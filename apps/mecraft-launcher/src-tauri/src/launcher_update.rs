use base64::{Engine, engine::general_purpose::STANDARD};
use futures_util::StreamExt;
use minisign_verify::{PublicKey, Signature};
use serde::Serialize;
use sha2::{Digest, Sha256};
use std::time::Duration;
use tauri::{Manager, ipc::Channel};
use tauri_plugin_updater::UpdaterExt;
use tokio::sync::Mutex;

const MAX_INSTALLER_BYTES: u64 = 512 * 1024 * 1024;
const MAX_MANIFEST_BYTES: usize = 64 * 1024;
#[cfg(feature = "private-msi-preview")]
const UPDATE_CHANNEL: &str = "preview";
#[cfg(not(feature = "private-msi-preview"))]
const UPDATE_CHANNEL: &str = "stable";
static UPDATE_OPERATION: Mutex<()> = Mutex::const_new(());

#[cfg(windows)]
fn open_update_lock(path: &std::path::Path) -> Result<std::fs::File, String> {
    use std::os::windows::fs::OpenOptionsExt;
    std::fs::OpenOptions::new()
        .create(true)
        .write(true)
        .share_mode(0)
        .open(path)
        .map_err(|error| format!("Another Launcher update may be running: {error}"))
}

#[derive(Clone, Serialize)]
#[serde(tag = "status", rename_all = "snake_case")]
pub(crate) enum LauncherUpdateEvent {
    Checking,
    Downloading { downloaded: u64, total: u64 },
    Installing,
    Current,
}

fn validate_url(url: &reqwest::Url) -> bool {
    #[cfg(feature = "private-msi-preview")]
    if url.scheme() == "http" && url.host_str() == Some("127.0.0.1") && url.port() == Some(18978)
        && url.username().is_empty() && url.password().is_none() {
        return true;
    }
    url.scheme() == "https"
        && url.username().is_empty()
        && url.password().is_none()
        && matches!(
            url.host_str(),
            Some("github.com" | "mecrafts.vercel.app" | "release-assets.githubusercontent.com")
        )
}

fn metadata(raw: &serde_json::Value, target: &str) -> Result<(u64, String, String), String> {
    let platform = &raw["platforms"][target];
    let size = platform["size"]
        .as_u64()
        .filter(|size| *size > 0 && *size <= MAX_INSTALLER_BYTES)
        .ok_or("Update package size is missing or invalid")?;
    let hash = platform["sha256"]
        .as_str()
        .filter(|hash| hash.len() == 64 && hash.bytes().all(|byte| byte.is_ascii_hexdigit()))
        .ok_or("Update package SHA-256 is missing or invalid")?;
    let publisher = platform["publisher_thumbprint"]
        .as_str()
        .filter(|value| value.len() == 40 && value.bytes().all(|byte| byte.is_ascii_hexdigit()))
        .ok_or("Update publisher thumbprint is missing or invalid")?;
    Ok((
        size,
        hash.to_ascii_lowercase(),
        publisher.to_ascii_uppercase(),
    ))
}

fn validate_channel(manifest: &serde_json::Value) -> Result<(), String> {
    if manifest["channel"].as_str() != Some(UPDATE_CHANNEL) {
        return Err("Update channel does not match this Launcher".into());
    }
    Ok(())
}

#[cfg(windows)]
async fn verify_authenticode(bytes: &[u8], expected_publisher: &str) -> Result<(), String> {
    use std::io::Write;

    let mut file = tempfile::Builder::new()
        .prefix("mecraft-authenticode-")
        .suffix(".msi")
        .tempfile()
        .map_err(|error| error.to_string())?;
    file.write_all(bytes).map_err(|error| error.to_string())?;
    file.flush().map_err(|error| error.to_string())?;
    let file_path = file.into_temp_path();
    let system_root = std::env::var_os("SystemRoot").ok_or("Windows system directory missing")?;
    let powershell_dir =
        std::path::PathBuf::from(system_root).join("System32/WindowsPowerShell/v1.0");
    let powershell = powershell_dir.join("powershell.exe");
    let script = "$ErrorActionPreference='Stop'; $s=Get-AuthenticodeSignature -LiteralPath $env:MECRAFT_VERIFY_INSTALLER; if ($s.Status -ne 'Valid' -or $null -eq $s.SignerCertificate -or $s.SignerCertificate.Thumbprint -ne $env:MECRAFT_VERIFY_PUBLISHER) { exit 1 }";
    let mut command = tokio::process::Command::new(powershell);
    command
        .kill_on_drop(true)
        .args([
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            script,
        ])
        .env("MECRAFT_VERIFY_INSTALLER", &file_path)
        .env("MECRAFT_VERIFY_PUBLISHER", expected_publisher)
        .env("PSModulePath", powershell_dir.join("Modules"))
        .creation_flags(0x08000000);
    let result = tokio::time::timeout(Duration::from_secs(30), command.output())
        .await
        .map_err(|_| "Windows signature check timed out")?
        .map_err(|error| error.to_string())?;
    if !result.status.success() {
        return Err(format!(
            "Windows signature or publisher verification failed: {}",
            String::from_utf8_lossy(&result.stderr).trim()
        ));
    }
    Ok(())
}

#[cfg(not(windows))]
async fn verify_authenticode(_bytes: &[u8], _expected_publisher: &str) -> Result<(), String> {
    Err("Windows signature verification is only supported on Windows".into())
}

#[cfg(windows)]
fn start_update_worker(
    app: &tauri::AppHandle,
    bytes: &[u8],
    sha256: &str,
    version: &str,
) -> Result<(), String> {
    use std::os::windows::process::CommandExt;

    let staging = tempfile::Builder::new()
        .prefix("mecraft-update-")
        .tempdir()
        .map_err(|error| error.to_string())?;
    let installer = staging.path().join("installer.msi");
    std::fs::write(&installer, bytes).map_err(|error| error.to_string())?;
    let target = std::env::current_exe().map_err(|error| error.to_string())?;
    let app_data = app
        .path()
        .app_local_data_dir()
        .map_err(|error| error.to_string())?;
    std::fs::create_dir_all(&app_data).map_err(|error| error.to_string())?;
    let backup_root = app_data.join("update-backups");
    std::fs::create_dir_all(&backup_root).map_err(|error| error.to_string())?;
    let backup_dir = tempfile::Builder::new()
        .prefix("launcher-")
        .tempdir_in(backup_root)
        .map_err(|error| error.to_string())?;
    let desktop = app
        .path()
        .desktop_dir()
        .map_err(|error| error.to_string())?;
    let backup_name = backup_dir
        .path()
        .file_name()
        .ok_or("Recovery directory name missing")?;
    let recovery_shortcut = desktop.join(format!(
        "meCraft Recovery ({}).lnk",
        backup_name.to_string_lossy()
    ));
    let powershell = std::path::PathBuf::from(
        std::env::var_os("SystemRoot").ok_or("Windows system directory missing")?,
    )
    .join("System32/WindowsPowerShell/v1.0/powershell.exe");
    let mut command = std::process::Command::new(powershell);
    command
        .args([
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            include_str!("update_worker.ps1"),
        ])
        .env("MECRAFT_UPDATE_TARGET", target)
        .env("MECRAFT_UPDATE_INSTALLER", installer)
        .env(
            "MECRAFT_UPDATE_BACKUP",
            backup_dir.path().join("previous.exe"),
        )
        .env("MECRAFT_UPDATE_RECOVERY_SHORTCUT", recovery_shortcut)
        .env("MECRAFT_UPDATE_SHA256", sha256)
        .env("MECRAFT_UPDATE_VERSION", version)
        .env("MECRAFT_UPDATE_PARENT", std::process::id().to_string())
        .env(
            "MECRAFT_UPDATE_BOOT_UPTIME",
            unsafe { windows_sys::Win32::System::SystemInformation::GetTickCount64() }.to_string(),
        )
        .env(
            "MECRAFT_UPDATE_RESULT",
            app_data.join("launcher-update-result.txt"),
        )
        .env("MECRAFT_UPDATE_LOCK", app_data.join("launcher-update.lock"))
        .env(
            "MECRAFT_UPDATE_REGISTRY",
            format!(r"HKLM:\Software\meCraft\{}", app.config().product_name.as_deref().ok_or("Product name missing")?),
        )
        .env(
            "PSModulePath",
            std::path::PathBuf::from(
                std::env::var_os("SystemRoot").ok_or("Windows system directory missing")?,
            )
            .join("System32/WindowsPowerShell/v1.0/Modules"),
        )
        .creation_flags(0x08000000);
    command.spawn().map_err(|error| error.to_string())?;
    let _ = staging.keep();
    let _ = backup_dir.keep();
    Ok(())
}

#[cfg(not(windows))]
fn start_update_worker(
    _app: &tauri::AppHandle,
    _bytes: &[u8],
    _sha256: &str,
    _version: &str,
) -> Result<(), String> {
    Err("Launcher updates are only supported on Windows".into())
}

#[tauri::command]
pub(crate) fn take_launcher_update_result(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let directory = app
        .path()
        .app_local_data_dir()
        .map_err(|error| error.to_string())?;
    read_update_result(&directory, app.config().product_name.as_deref().ok_or("Product name missing")?)
}

fn read_update_result(directory: &std::path::Path, product: &str) -> Result<Option<String>, String> {
    std::fs::create_dir_all(&directory).map_err(|error| error.to_string())?;
    #[cfg(windows)]
    let _lock = match open_update_lock(&directory.join("launcher-update.lock")) {
        Ok(lock) => lock,
        Err(_) => return Ok(Some("busy".into())),
    };
    let path = directory.join("launcher-update-result.txt");
    let result = match std::fs::read_to_string(&path) {
        Ok(result) => result,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(None),
        Err(error) => return Err(error.to_string()),
    };
    if result.len() > 4096 {
        return Err("Update result is too large".into());
    }
    if result.starts_with("in_progress\n") || result.starts_with("recovery_required\n") {
        #[cfg(windows)]
        {
            let mut lines = result.lines().skip(1);
            if let (Some(backup), Some(hash), Some(saved_uptime)) =
                (lines.next(), lines.next(), lines.next())
            {
                if let Ok(saved_uptime) = saved_uptime.parse::<u64>() {
                    if let Ok(current) = std::env::current_exe() {
                        if let Ok(key) = windows_registry::LOCAL_MACHINE
                            .open(format!(r"Software\meCraft\{product}"))
                        {
                            if let Ok(location) = key.get_string("InstallLocation") {
                                let target = std::path::Path::new(location.trim_matches('"'))
                                    .join("mecraft-launcher.exe");
                                let uptime = unsafe {
                                    windows_sys::Win32::System::SystemInformation::GetTickCount64()
                                };
                                if restore_running_backup(
                                    directory,
                                    std::path::Path::new(backup),
                                    hash,
                                    &current,
                                    &target,
                                    saved_uptime,
                                    uptime,
                                )
                                .is_ok()
                                {
                                    std::fs::remove_file(path)
                                        .map_err(|error| error.to_string())?;
                                    return Ok(Some("restored".into()));
                                }
                            }
                        }
                    }
                }
            }
        }
        return Ok(Some(result.replacen(
            "in_progress\n",
            "recovery_required\n",
            1,
        )));
    }
    std::fs::remove_file(path).map_err(|error| error.to_string())?;
    Ok(Some(result))
}

#[cfg(windows)]
fn restore_running_backup(
    directory: &std::path::Path,
    backup: &std::path::Path,
    expected_hash: &str,
    current: &std::path::Path,
    target: &std::path::Path,
    saved_uptime: u64,
    current_uptime: u64,
) -> Result<(), String> {
    use std::io::{Read, Write};
    if current_uptime >= saved_uptime {
        return Err("Restart Windows before restoring the interrupted update".into());
    }
    if expected_hash.len() != 64 || !expected_hash.bytes().all(|byte| byte.is_ascii_hexdigit()) {
        return Err("Recovery checksum is invalid".into());
    }
    let backup_root = std::fs::canonicalize(directory.join("update-backups"))
        .map_err(|error| error.to_string())?;
    let backup = std::fs::canonicalize(backup).map_err(|error| error.to_string())?;
    let current = std::fs::canonicalize(current).map_err(|error| error.to_string())?;
    if backup != current
        || !backup.starts_with(&backup_root)
        || backup.file_name().and_then(|name| name.to_str()) != Some("previous.exe")
    {
        return Err("Recovery must run from the saved Launcher backup".into());
    }
    let parent = target
        .parent()
        .ok_or("Installed Launcher directory missing")?;
    let mut staged = tempfile::Builder::new()
        .prefix("mecraft-restore-")
        .tempfile_in(parent)
        .map_err(|error| error.to_string())?;
    let mut source = std::fs::File::open(&backup).map_err(|error| error.to_string())?;
    let mut hash = Sha256::new();
    let mut buffer = [0_u8; 65536];
    loop {
        let count = source
            .read(&mut buffer)
            .map_err(|error| error.to_string())?;
        if count == 0 {
            break;
        }
        staged
            .write_all(&buffer[..count])
            .map_err(|error| error.to_string())?;
        hash.update(&buffer[..count]);
    }
    if !format!("{:x}", hash.finalize()).eq_ignore_ascii_case(expected_hash) {
        return Err("Recovery copy checksum does not match".into());
    }
    staged
        .as_file()
        .sync_all()
        .map_err(|error| error.to_string())?;
    staged.persist(target).map_err(|error| error.to_string())?;
    Ok(())
}

#[tauri::command]
pub(crate) fn clear_launcher_update_result(app: tauri::AppHandle) -> Result<(), String> {
    let directory = app
        .path()
        .app_local_data_dir()
        .map_err(|error| error.to_string())?;
    clear_update_result(&directory)
}

fn clear_update_result(directory: &std::path::Path) -> Result<(), String> {
    std::fs::create_dir_all(&directory).map_err(|error| error.to_string())?;
    #[cfg(windows)]
    let _lock = open_update_lock(&directory.join("launcher-update.lock"))?;
    match std::fs::remove_file(directory.join("launcher-update-result.txt")) {
        Ok(()) => Ok(()),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => Ok(()),
        Err(error) => Err(error.to_string()),
    }
}

async fn read_verified_download(
    response: reqwest::Response,
    expected_size: u64,
    expected_hash: &str,
    mut progress: impl FnMut(u64),
) -> Result<Vec<u8>, String> {
    if let Some(length) = response.content_length() {
        if length != expected_size {
            return Err("Update download size does not match metadata".into());
        }
    }
    let mut stream = response.bytes_stream();
    let mut bytes = Vec::new();
    let mut hash = Sha256::new();
    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|error| error.to_string())?;
        let next_size = (bytes.len() as u64)
            .checked_add(chunk.len() as u64)
            .ok_or("Update package size overflow")?;
        if next_size > expected_size || next_size > MAX_INSTALLER_BYTES {
            return Err("Update package exceeds declared size".into());
        }
        hash.update(&chunk);
        bytes.extend_from_slice(&chunk);
        progress(next_size);
    }
    if bytes.len() as u64 != expected_size || format!("{:x}", hash.finalize()) != expected_hash {
        return Err("Update package failed integrity verification".into());
    }
    Ok(bytes)
}

async fn read_small_response(response: reqwest::Response, limit: usize) -> Result<Vec<u8>, String> {
    let mut stream = response.bytes_stream();
    let mut bytes = Vec::new();
    while let Some(chunk) = stream.next().await {
        let chunk = chunk.map_err(|error| error.to_string())?;
        if chunk.len() > limit.saturating_sub(bytes.len()) {
            return Err("Update metadata exceeds size limit".into());
        }
        bytes.extend_from_slice(&chunk);
    }
    Ok(bytes)
}

fn verified_manifest(
    data: &[u8],
    signature: &[u8],
    encoded_key: &str,
) -> Result<serde_json::Value, String> {
    let decoded_key = STANDARD
        .decode(encoded_key)
        .map_err(|error| error.to_string())?;
    let public_key =
        PublicKey::decode(std::str::from_utf8(&decoded_key).map_err(|error| error.to_string())?)
            .map_err(|error| error.to_string())?;
    let signature = std::str::from_utf8(signature).map_err(|error| error.to_string())?;
    let decoded_signature = STANDARD
        .decode(signature.trim())
        .map_err(|error| error.to_string())?;
    let signature = Signature::decode(
        std::str::from_utf8(&decoded_signature).map_err(|error| error.to_string())?,
    )
    .map_err(|error| error.to_string())?;
    public_key
        .verify(data, &signature, true)
        .map_err(|error| error.to_string())?;
    let manifest: serde_json::Value =
        serde_json::from_slice(data).map_err(|error| error.to_string())?;
    let version = manifest["version"]
        .as_str()
        .ok_or("Manifest version is missing")?;
    if !signature
        .trusted_comment()
        .split('\t')
        .any(|field| field == format!("version:{version}"))
    {
        return Err("Manifest signature does not match its version".into());
    }
    Ok(manifest)
}

#[tauri::command]
pub(crate) async fn update_launcher(
    app: tauri::AppHandle,
    on_event: Channel<LauncherUpdateEvent>,
) -> Result<(), String> {
    #[cfg(feature = "private-msi-preview")]
    if app.config().identifier != "com.mecraft.launcher.msi.preview"
        || app.config().product_name.as_deref() != Some("meCraft MSI Preview") {
        return Err("Private MSI testing requires its isolated Preview identity".into());
    }
    let _guard = UPDATE_OPERATION
        .try_lock()
        .map_err(|_| "Update already in progress")?;
    #[cfg(windows)]
    let _file_guard = {
        let app_data = app
            .path()
            .app_local_data_dir()
            .map_err(|error| error.to_string())?;
        std::fs::create_dir_all(&app_data).map_err(|error| error.to_string())?;
        let lock = open_update_lock(&app_data.join("launcher-update.lock"))?;
        match std::fs::read_to_string(app_data.join("launcher-update-result.txt")) {
            Ok(result)
                if result.starts_with("in_progress\n")
                    || result.starts_with("recovery_required\n") =>
            {
                return Err("Resolve the interrupted update before starting another update".into());
            }
            Ok(_) => {}
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
            Err(error) => return Err(error.to_string()),
        }
        lock
    };
    let _ = on_event.send(LauncherUpdateEvent::Checking);
    let updater = app
        .updater_builder()
        .target("windows-x86_64")
        .timeout(Duration::from_secs(10))
        .build()
        .map_err(|error| error.to_string())?;
    let config = app
        .config()
        .plugins
        .0
        .get("updater")
        .ok_or("Updater configuration missing")?;
    let endpoint = config["endpoints"][0]
        .as_str()
        .ok_or("Update endpoint missing")?;
    let public_key = config["pubkey"]
        .as_str()
        .ok_or("Update public key missing")?;
    let manifest_url: reqwest::Url = endpoint.parse().map_err(|_| "Update endpoint is invalid")?;
    if !validate_url(&manifest_url)
        || manifest_url.query().is_some()
        || manifest_url.fragment().is_some()
    {
        return Err("Update endpoint is not permitted".into());
    }
    let signature_url: reqwest::Url = format!("{endpoint}.sig")
        .parse()
        .map_err(|_| "Update signature URL is invalid")?;
    let client = reqwest::Client::builder()
        .connect_timeout(Duration::from_secs(10))
        .timeout(Duration::from_secs(120))
        .redirect(reqwest::redirect::Policy::custom(|attempt| {
            if attempt.previous().len() >= 5 || !validate_url(attempt.url()) {
                attempt.error("Update redirect is not permitted")
            } else {
                attempt.follow()
            }
        }))
        .build()
        .map_err(|error| error.to_string())?;
    let fetch_metadata = |url| async {
        let response = client
            .get(url)
            .timeout(Duration::from_secs(10))
            .send()
            .await
            .map_err(|error| error.to_string())?
            .error_for_status()
            .map_err(|error| error.to_string())?;
        read_small_response(response, MAX_MANIFEST_BYTES).await
    };
    let (manifest_bytes, signature_bytes) =
        tokio::try_join!(fetch_metadata(manifest_url), fetch_metadata(signature_url),)?;
    let manifest = verified_manifest(&manifest_bytes, &signature_bytes, public_key)?;
    validate_channel(&manifest)?;
    let Some(update) = updater
        .restore_update(manifest)
        .map_err(|error| error.to_string())?
    else {
        let _ = on_event.send(LauncherUpdateEvent::Current);
        return Ok(());
    };
    let (expected_size, expected_hash, expected_publisher) =
        metadata(&update.raw_json, &update.target)?;
    if !validate_url(&update.download_url) || !update.download_url.path().to_ascii_lowercase().ends_with(".msi") {
        return Err("Update download URL is not permitted".into());
    }
    let response = client
        .get(update.download_url.clone())
        .send()
        .await
        .map_err(|error| error.to_string())?
        .error_for_status()
        .map_err(|error| error.to_string())?;
    let bytes = read_verified_download(response, expected_size, &expected_hash, |downloaded| {
        let _ = on_event.send(LauncherUpdateEvent::Downloading {
            downloaded,
            total: expected_size,
        });
    })
    .await?;
    update.verify(&bytes).map_err(|error| error.to_string())?;
    #[cfg(not(feature = "private-msi-preview"))]
    verify_authenticode(&bytes, &expected_publisher).await?;
    #[cfg(feature = "private-msi-preview")]
    let _ = expected_publisher; // Private build only; updater signatures and SHA-256 remain mandatory.
    start_update_worker(&app, &bytes, &expected_hash, &update.version)?;
    let _ = on_event.send(LauncherUpdateEvent::Installing);
    std::thread::spawn(move || {
        std::thread::sleep(Duration::from_millis(500));
        app.exit(0);
    });
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_missing_or_wrong_update_channel() {
        assert!(validate_channel(&serde_json::json!({"channel": UPDATE_CHANNEL})).is_ok());
        assert!(validate_channel(&serde_json::json!({"channel": if UPDATE_CHANNEL == "stable" { "preview" } else { "stable" }})).is_err());
        assert!(validate_channel(&serde_json::json!({})).is_err());
    }

    #[cfg(feature = "private-msi-preview")]
    #[test]
    fn private_preview_accepts_only_its_loopback_port() {
        assert!(validate_url(&"http://127.0.0.1:18978/preview.json".parse().unwrap()));
        for url in ["http://127.0.0.1:18977/preview.json", "http://localhost:18978/preview.json", "http://user@127.0.0.1:18978/file.msi"] {
            assert!(!validate_url(&url.parse().unwrap()));
        }
    }

    #[cfg(windows)]
    #[test]
    fn recovery_requires_restart_verified_backup_and_correct_entry_point() {
        let dir = tempfile::tempdir().unwrap();
        let backup_dir = dir.path().join("update-backups").join("launcher-test");
        std::fs::create_dir_all(&backup_dir).unwrap();
        let backup = backup_dir.join("previous.exe");
        let target = dir.path().join("mecraft-launcher.exe");
        std::fs::write(&backup, b"old launcher").unwrap();
        std::fs::write(&target, b"damaged launcher").unwrap();
        let hash = format!("{:x}", Sha256::digest(b"old launcher"));
        assert!(
            restore_running_backup(dir.path(), &backup, &hash, &backup, &target, 100, 101).is_err()
        );
        assert!(
            restore_running_backup(dir.path(), &backup, &hash, &target, &target, 100, 10).is_err()
        );
        assert!(
            restore_running_backup(
                dir.path(),
                &backup,
                &"a".repeat(64),
                &backup,
                &target,
                100,
                10
            )
            .is_err()
        );
        assert_eq!(std::fs::read(&target).unwrap(), b"damaged launcher");
        restore_running_backup(dir.path(), &backup, &hash, &backup, &target, 100, 10).unwrap();
        assert_eq!(std::fs::read(&target).unwrap(), b"old launcher");
    }

    #[cfg(windows)]
    #[test]
    fn interrupted_update_keeps_recovery_record_until_acknowledged() {
        let directory = tempfile::tempdir().unwrap();
        let path = directory.path().join("launcher-update-result.txt");
        std::fs::write(&path, "in_progress\nC:/backup/previous.exe").unwrap();
        let expected = Some("recovery_required\nC:/backup/previous.exe".to_string());
        assert_eq!(read_update_result(directory.path(), "meCraft").unwrap(), expected);
        assert_eq!(read_update_result(directory.path(), "meCraft").unwrap(), expected);
        let lock = open_update_lock(&directory.path().join("launcher-update.lock")).unwrap();
        assert_eq!(
            read_update_result(directory.path(), "meCraft").unwrap(),
            Some("busy".into())
        );
        assert!(clear_update_result(directory.path()).is_err());
        drop(lock);
        clear_update_result(directory.path()).unwrap();
        assert_eq!(read_update_result(directory.path(), "meCraft").unwrap(), None);
    }

    #[cfg(windows)]
    #[test]
    fn exclusive_update_lock_is_released_when_owner_exits() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("update.lock");
        let first = open_update_lock(&path).unwrap();
        assert!(open_update_lock(&path).is_err());
        drop(first);
        assert!(open_update_lock(&path).is_ok());
    }

    #[test]
    fn rejects_missing_or_excessive_size_and_bad_hash() {
        let manifest = serde_json::json!({"platforms":{"windows-x86_64":{"size":1,"sha256":"a".repeat(64),"publisher_thumbprint":"b".repeat(40)}}});
        assert_eq!(metadata(&manifest, "windows-x86_64").unwrap().0, 1);
        assert!(metadata(&manifest, "wrong-target").is_err());
        let mut bad = manifest.clone();
        bad["platforms"]["windows-x86_64"]["size"] = (MAX_INSTALLER_BYTES + 1).into();
        assert!(metadata(&bad, "windows-x86_64").is_err());
        bad["platforms"]["windows-x86_64"]["size"] = 1.into();
        bad["platforms"]["windows-x86_64"]["sha256"] = "not a hash".into();
        assert!(metadata(&bad, "windows-x86_64").is_err());
        bad["platforms"]["windows-x86_64"]["sha256"] = "a".repeat(64).into();
        bad["platforms"]["windows-x86_64"]["publisher_thumbprint"] = "invalid".into();
        assert!(metadata(&bad, "windows-x86_64").is_err());
    }

    #[test]
    fn permits_only_known_https_download_hosts() {
        for url in [
            "http://github.com/x",
            "https://github.com.attacker.example/x",
            "https://localhost/x",
            "https://user@github.com/x",
        ] {
            assert!(!validate_url(&url.parse().unwrap()));
        }
        assert!(validate_url(
            &"https://github.com/methastrategy/meCraft/releases/x"
                .parse()
                .unwrap()
        ));
        assert!(validate_url(
            &"https://release-assets.githubusercontent.com/x"
                .parse()
                .unwrap()
        ));
    }

    #[cfg(windows)]
    #[tokio::test]
    async fn rejects_unsigned_installer() {
        let result = verify_authenticode(b"not a signed installer", &"A".repeat(40)).await;
        assert!(result.is_err());
    }

    #[cfg(windows)]
    #[tokio::test]
    #[ignore = "requires a trusted Windows-signed executable and its publisher thumbprint"]
    async fn accepts_trusted_windows_signature_and_rejects_wrong_publisher() {
        let path = std::env::var("MECRAFT_TEST_SIGNED_EXE").unwrap();
        let thumbprint = std::env::var("MECRAFT_TEST_PUBLISHER").unwrap();
        let bytes = std::fs::read(path).unwrap();
        verify_authenticode(&bytes, &thumbprint).await.unwrap();
        assert!(verify_authenticode(&bytes, &"A".repeat(40)).await.is_err());
    }

    #[tokio::test]
    async fn checks_downloaded_bytes_and_hash() {
        use tokio::io::{AsyncReadExt, AsyncWriteExt};
        use tokio::net::TcpListener;

        async fn serve(body: &'static [u8]) -> reqwest::Response {
            let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
            let address = listener.local_addr().unwrap();
            tokio::spawn(async move {
                let (mut stream, _) = listener.accept().await.unwrap();
                let mut request = [0; 1024];
                let _ = stream.read(&mut request).await;
                let headers = format!(
                    "HTTP/1.1 200 OK\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
                    body.len()
                );
                stream.write_all(headers.as_bytes()).await.unwrap();
                stream.write_all(body).await.unwrap();
            });
            reqwest::get(format!("http://{address}")).await.unwrap()
        }

        let hash = format!("{:x}", Sha256::digest(b"abc"));
        let response = serve(b"abc").await;
        assert_eq!(
            read_verified_download(response, 3, &hash, |_| {})
                .await
                .unwrap(),
            b"abc"
        );
        let response = serve(b"abcd").await;
        assert!(
            read_verified_download(response, 3, &hash, |_| {})
                .await
                .is_err()
        );
        let response = serve(b"abd").await;
        assert!(
            read_verified_download(response, 3, &hash, |_| {})
                .await
                .is_err()
        );

        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let address = listener.local_addr().unwrap();
        tokio::spawn(async move {
            let (mut stream, _) = listener.accept().await.unwrap();
            let mut request = [0; 1024];
            let _ = stream.read(&mut request).await;
            stream.write_all(b"HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\nConnection: close\r\n\r\n4\r\nabcd\r\n0\r\n\r\n").await.unwrap();
        });
        let response = reqwest::get(format!("http://{address}")).await.unwrap();
        assert!(
            read_verified_download(response, 3, &hash, |_| {})
                .await
                .is_err()
        );
    }

    #[test]
    #[ignore = "requires a locally signed manifest"]
    fn checks_signed_manifest_and_rejects_tampering() {
        let path =
            std::env::var("MECRAFT_TEST_MANIFEST").expect("MECRAFT_TEST_MANIFEST is required");
        let config: serde_json::Value = serde_json::from_slice(
            &std::fs::read(
                std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("tauri.conf.json"),
            )
            .unwrap(),
        )
        .unwrap();
        let key = config["plugins"]["updater"]["pubkey"].as_str().unwrap();
        let data = std::fs::read(&path).unwrap();
        let signature = std::fs::read(format!("{path}.sig")).unwrap();
        let manifest = verified_manifest(&data, &signature, key).unwrap();
        validate_channel(&manifest).unwrap();
        let expected_version = std::env::var("MECRAFT_TEST_VERSION").unwrap_or_else(|_| config["version"].as_str().unwrap().to_string());
        assert_eq!(manifest["version"].as_str(), Some(expected_version.as_str()));
        let mut altered = data;
        altered.push(b' ');
        assert!(verified_manifest(&altered, &signature, key).is_err());
    }

    #[tokio::test]
    #[ignore = "requires a locally signed manifest and installer"]
    async fn downloads_and_verifies_signed_release_over_http() {
        use tokio::io::{AsyncReadExt, AsyncWriteExt};
        use tokio::net::TcpListener;

        let manifest_path = std::env::var("MECRAFT_TEST_MANIFEST").unwrap();
        let manifest = std::fs::read(&manifest_path).unwrap();
        let manifest_signature = std::fs::read(format!("{manifest_path}.sig")).unwrap();
        let config: serde_json::Value = serde_json::from_slice(
            &std::fs::read(
                std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("tauri.conf.json"),
            )
            .unwrap(),
        )
        .unwrap();
        let key = config["plugins"]["updater"]["pubkey"].as_str().unwrap();
        let version = config["version"].as_str().unwrap();
        let installer = std::env::var_os("MECRAFT_TEST_INSTALLER")
            .map(std::path::PathBuf::from)
            .unwrap_or_else(|| {
                std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
                    .join("target/release/bundle/msi")
                    .join(format!("meCraft_{version}_x64_en-US.msi"))
            });
        let installer_bytes = std::fs::read(installer).unwrap();

        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let address = listener.local_addr().unwrap();
        let server = tokio::spawn(async move {
            for body in [manifest, manifest_signature, installer_bytes] {
                let (mut stream, _) = listener.accept().await.unwrap();
                let mut request = [0; 1024];
                stream.read(&mut request).await.unwrap();
                let headers = format!(
                    "HTTP/1.1 200 OK\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
                    body.len()
                );
                stream.write_all(headers.as_bytes()).await.unwrap();
                stream.write_all(&body).await.unwrap();
            }
        });
        let client = reqwest::Client::new();
        let endpoint = format!("http://{address}");
        let data = read_small_response(
            client.get(&endpoint).send().await.unwrap(),
            MAX_MANIFEST_BYTES,
        )
        .await
        .unwrap();
        let signature = read_small_response(
            client.get(&endpoint).send().await.unwrap(),
            MAX_MANIFEST_BYTES,
        )
        .await
        .unwrap();
        let manifest = verified_manifest(&data, &signature, key).unwrap();
        validate_channel(&manifest).unwrap();
        let (size, sha256, publisher) = metadata(&manifest, "windows-x86_64").unwrap();
        let response = client.get(&endpoint).send().await.unwrap();
        let bytes = read_verified_download(response, size, &sha256, |_| {})
            .await
            .unwrap();
        let public_key_bytes = STANDARD.decode(key).unwrap();
        let public_key =
            PublicKey::decode(std::str::from_utf8(&public_key_bytes).unwrap()).unwrap();
        let signature_bytes = STANDARD
            .decode(
                manifest["platforms"]["windows-x86_64"]["signature"]
                    .as_str()
                    .unwrap(),
            )
            .unwrap();
        let signature = Signature::decode(std::str::from_utf8(&signature_bytes).unwrap()).unwrap();
        public_key.verify(&bytes, &signature, true).unwrap();
        verify_authenticode(&bytes, &publisher).await.unwrap();
        assert!(
            signature
                .trusted_comment()
                .split('\t')
                .any(|field| field == format!("version:{version}"))
        );
        server.await.unwrap();
    }
}
