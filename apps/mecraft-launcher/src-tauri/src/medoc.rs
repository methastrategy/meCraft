use super::{DownloadProgressPayload, get_target_app_dir};
use futures_util::StreamExt;
use sha2::{Digest, Sha256};
use std::fs;
use std::io::ErrorKind;
use std::path::{Path, PathBuf};
use std::time::{Duration, Instant};
use tauri::Emitter;
use tokio::{io::AsyncWriteExt, sync::Mutex};

const MAX_PACKAGE_BYTES: u64 = 512 * 1024 * 1024;
const ACTIVE_VERSION: &str = "medoc.active";
static PACKAGE_OPERATION: Mutex<()> = Mutex::const_new(());

fn valid_version(version: &str) -> bool {
    version.len() <= 24
        && version.split('.').count() == 3
        && version.split('.').all(|part| {
            !part.is_empty()
                && (part.len() == 1 || !part.starts_with('0'))
                && part.bytes().all(|byte| byte.is_ascii_digit())
        })
}

fn executable_path(dir: &Path, version: &str) -> PathBuf {
    dir.join(format!("medoc-{version}.exe"))
}

pub(crate) fn installed(dir: &Path) -> Option<(String, PathBuf)> {
    let version = fs::read_to_string(dir.join(ACTIVE_VERSION)).ok()?;
    if !valid_version(&version) {
        return None;
    }
    let executable = executable_path(dir, &version);
    executable.is_file().then_some((version, executable))
}

fn remove_file(path: &Path) -> Result<(), String> {
    match fs::remove_file(path) {
        Ok(()) => Ok(()),
        Err(error) if error.kind() == ErrorKind::NotFound => Ok(()),
        Err(error) => Err(error.to_string()),
    }
}

fn discard_inactive_versions(dir: &Path, active: Option<&Path>) {
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            let name = entry.file_name();
            let is_managed = name
                .to_str()
                .and_then(|name| name.strip_prefix("medoc-"))
                .and_then(|name| name.strip_suffix(".exe"))
                .is_some_and(valid_version);
            if is_managed && active != Some(path.as_path()) {
                let _ = remove_file(&path);
            }
        }
    }
}

pub(crate) fn uninstall(dir: &Path) -> Result<(), String> {
    let _operation = PACKAGE_OPERATION
        .try_lock()
        .map_err(|_| "meDoc is busy".to_string())?;
    let legacy = dir.join("medoc.exe");
    if let Some((_, executable)) = installed(dir) {
        remove_file(&legacy)?;
        remove_file(&executable)?;
    } else {
        remove_file(&legacy)?;
    }
    remove_file(&dir.join(ACTIVE_VERSION))?;
    discard_inactive_versions(dir, None);
    Ok(())
}

fn activate(dir: &Path, staged: &Path, version_file: &Path, version: &str) -> Result<(), String> {
    let executable = executable_path(dir, version);
    fs::write(version_file, version).map_err(|error| error.to_string())?;
    fs::rename(staged, &executable).map_err(|error| error.to_string())?;
    fs::rename(version_file, dir.join(ACTIVE_VERSION)).map_err(|error| error.to_string())?;
    discard_inactive_versions(dir, Some(&executable));
    Ok(())
}

fn verify_medoc_payload(
    downloaded: u64,
    expected_size: u64,
    hash: Sha256,
    expected_sha256: &str,
) -> Result<(), String> {
    if downloaded != expected_size
        || !format!("{:x}", hash.finalize()).eq_ignore_ascii_case(expected_sha256)
    {
        return Err("Downloaded meDoc package failed verification".to_string());
    }
    Ok(())
}

#[tauri::command]
pub(crate) async fn install_verified_medoc(
    app_handle: tauri::AppHandle,
    version: String,
    release_tag: String,
    sha256: String,
    size_bytes: u64,
) -> Result<(), String> {
    if !valid_version(&version)
        || (release_tag != format!("v{version}")
            && release_tag != format!("medocs-v{version}")
            && release_tag != format!("medoc-v{version}"))
        || sha256.len() != 64
        || !sha256.bytes().all(|byte| byte.is_ascii_hexdigit())
        || !(1..=MAX_PACKAGE_BYTES).contains(&size_bytes)
    {
        return Err("Invalid meDocs package metadata".into());
    }
    let _operation = PACKAGE_OPERATION
        .try_lock()
        .map_err(|_| "meDocs is busy".to_string())?;
    let dir = get_target_app_dir("medocs");
    fs::create_dir_all(&dir).map_err(|error| error.to_string())?;
    let staged = dir.join("medoc.download");
    let version_file = dir.join("medoc.next");

    let result = async {
        let client = reqwest::Client::builder()
            .user_agent("meCraft-Launcher")
            .connect_timeout(Duration::from_secs(15))
            .timeout(Duration::from_secs(900))
            .redirect(reqwest::redirect::Policy::custom(|attempt| {
                let url = attempt.url();
                if attempt.previous().len() < 5
                    && url.scheme() == "https"
                    && matches!(
                        url.host_str(),
                        Some(
                            "github.com"
                                | "release-assets.githubusercontent.com"
                                | "objects.githubusercontent.com"
                        )
                    )
                {
                    attempt.follow()
                } else {
                    attempt.error("Untrusted package redirect")
                }
            }))
            .build()
            .map_err(|error| error.to_string())?;
        let url = format!(
            "https://github.com/methastrategy/meCraft/releases/download/{release_tag}/medoc.exe"
        );
        let response = client
            .get(url)
            .send()
            .await
            .and_then(reqwest::Response::error_for_status)
            .map_err(|error| error.to_string())?;
        let mut stream = response.bytes_stream();
        let mut file = tokio::fs::File::create(&staged)
            .await
            .map_err(|error| error.to_string())?;
        let mut hash = Sha256::new();
        let mut downloaded = 0;
        let started = Instant::now();
        let mut emitted = started;
        while let Some(chunk) = stream.next().await {
            let chunk = chunk.map_err(|error| error.to_string())?;
            downloaded += chunk.len() as u64;
            if downloaded > size_bytes {
                return Err("Package exceeds its expected size".to_string());
            }
            hash.update(&chunk);
            file.write_all(&chunk)
                .await
                .map_err(|error| error.to_string())?;
            if emitted.elapsed() >= Duration::from_millis(100) {
                let _ = app_handle.emit(
                    "download-progress",
                    DownloadProgressPayload {
                        app_id: "medoc".into(),
                        downloaded_bytes: downloaded,
                        total_bytes: size_bytes,
                        percent: ((100 * downloaded / size_bytes).min(99)) as u32,
                        speed_bps: (downloaded as f64 / started.elapsed().as_secs_f64()) as u64,
                    },
                );
                emitted = Instant::now();
            }
        }
        verify_medoc_payload(downloaded, size_bytes, hash, &sha256)?;
        file.sync_all().await.map_err(|error| error.to_string())?;
        drop(file);
        activate(&dir, &staged, &version_file, &version)
    }
    .await;

    let _ = remove_file(&staged);
    let _ = remove_file(&version_file);
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn versions_cannot_change_package_paths() {
        for version in ["1.0.4", "0.11.0"] {
            assert!(valid_version(version));
        }
        for version in ["..", "1.0", "01.0.0", "1.0.0/other", "1.0.0-beta"] {
            assert!(!valid_version(version));
        }
    }

    #[test]
    fn activation_failure_preserves_the_installed_version_and_uninstall_preserves_documents() {
        let dir = std::env::temp_dir().join(format!("mecraft-medoc-test-{}", std::process::id()));
        fs::create_dir(&dir).unwrap();
        let staged = dir.join("meDoc.stage");
        let next = dir.join("meDoc.next");
        fs::write(&staged, "original").unwrap();
        activate(&dir, &staged, &next, "1.0.4").unwrap();
        assert!(activate(&dir, &staged, &next, "1.0.5").is_err());
        assert_eq!(installed(&dir).unwrap().0, "1.0.4");
        fs::write(&staged, "updated").unwrap();
        activate(&dir, &staged, &next, "1.0.5").unwrap();
        assert_eq!(fs::read(installed(&dir).unwrap().1).unwrap(), b"updated");
        let document = dir.join("document.md");
        fs::write(&document, "document").unwrap();
        uninstall(&dir).unwrap();
        assert!(installed(&dir).is_none());
        assert!(document.is_file());
        fs::remove_file(document).unwrap();
        fs::remove_dir(dir).unwrap();
    }

    #[test]
    fn payload_verification_rejects_wrong_size_or_sha256() {
        let payload = b"medoc-test-binary";
        let mut ok_hash = Sha256::new();
        ok_hash.update(payload);
        let expected_sha = format!("{:x}", ok_hash.clone().finalize());

        assert!(verify_medoc_payload(payload.len() as u64, payload.len() as u64, ok_hash.clone(), &expected_sha).is_ok());
        assert!(verify_medoc_payload((payload.len() - 1) as u64, payload.len() as u64, ok_hash.clone(), &expected_sha).is_err());

        let mut bad_hash = Sha256::new();
        bad_hash.update(b"tampered-binary");
        assert!(verify_medoc_payload(payload.len() as u64, payload.len() as u64, bad_hash, &expected_sha).is_err());
    }
}
