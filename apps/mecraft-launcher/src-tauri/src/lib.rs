use std::fs;
use std::io::Write;
use std::path::PathBuf;
use std::time::Instant;
use futures_util::StreamExt;
use tauri::Emitter;

#[derive(serde::Serialize, serde::Deserialize)]
pub struct AppStatusResponse {
    #[serde(rename = "appId")]
    pub app_id: String,
    pub installed: bool,
    pub version: Option<String>,
    #[serde(rename = "exePath")]
    pub exe_path: Option<String>,
    #[serde(rename = "sizeBytes")]
    pub size_bytes: Option<u64>,
}

#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub struct DownloadProgressPayload {
    #[serde(rename = "appId")]
    pub app_id: String,
    #[serde(rename = "downloadedBytes")]
    pub downloaded_bytes: u64,
    #[serde(rename = "totalBytes")]
    pub total_bytes: u64,
    pub percent: u32,
    #[serde(rename = "speedBps")]
    pub speed_bps: u64,
}

fn get_base_apps_dir() -> PathBuf {
    if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
        PathBuf::from(local_app_data).join("meCraft").join("apps")
    } else if let Ok(home) = std::env::var("USERPROFILE").or_else(|_| std::env::var("HOME")) {
        PathBuf::from(home).join(".mecraft").join("apps")
    } else {
        std::env::temp_dir().join("meCraft").join("apps")
    }
}

fn get_target_app_dir(app_id: &str) -> PathBuf {
    get_base_apps_dir().join(app_id)
}

fn validate_app_id(app_id: &str) -> Result<(), String> {
    let len = app_id.len();
    if !(2..=32).contains(&len) {
        return Err(format!(
            "Invalid app_id length (must be 2-32 chars): '{}'",
            app_id
        ));
    }

    // Hard safety guard against any potential directory traversal
    if app_id.contains('.') || app_id.contains('/') || app_id.contains('\\') || app_id.contains('\0') {
        return Err(format!("Path traversal attempt blocked: '{}'", app_id));
    }

    let is_valid_char = app_id
        .chars()
        .all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || c == '-');
    if !is_valid_char || app_id.starts_with('-') || app_id.ends_with('-') || app_id.contains("--") {
        return Err(format!(
            "Invalid app_id format (lowercase alphanumeric and single hyphens only, no leading/trailing hyphens): '{}'",
            app_id
        ));
    }

    Ok(())
}

fn get_target_exe_path(app_id: &str) -> PathBuf {
    let app_dir = get_target_app_dir(app_id);
    let exe_name = if cfg!(windows) {
        format!("{}.exe", app_id)
    } else {
        app_id.to_string()
    };
    app_dir.join(exe_name)
}

#[tauri::command]
fn check_app_status(app_id: String) -> Result<AppStatusResponse, String> {
    validate_app_id(&app_id)?;
    let exe_path = get_target_exe_path(&app_id);

    if exe_path.exists() {
        let size = fs::metadata(&exe_path).map(|m| m.len()).unwrap_or(0);
        // Read version from version.txt alongside the exe; fall back to None
        let version = {
            let ver_file = get_target_app_dir(&app_id).join("version.txt");
            fs::read_to_string(&ver_file).ok().map(|s| s.trim().to_string())
        };
        return Ok(AppStatusResponse {
            app_id: app_id.clone(),
            installed: true,
            version,
            exe_path: Some(exe_path.to_string_lossy().to_string()),
            size_bytes: Some(size),
        });
    }

    Ok(AppStatusResponse {
        app_id,
        installed: false,
        version: None,
        exe_path: None,
        size_bytes: None,
    })
}

#[tauri::command]
async fn download_and_install_app(
    app_handle: tauri::AppHandle,
    app_id: String,
    release_url: String,
) -> Result<String, String> {
    validate_app_id(&app_id)?;
    if !release_url.starts_with("https://") && !release_url.starts_with("http://") {
        return Err(format!("Invalid release URL scheme: {}", release_url));
    }
    let app_dir = get_target_app_dir(&app_id);
    fs::create_dir_all(&app_dir).map_err(|e| format!("Failed to create app dir: {}", e))?;

    let temp_download_path = app_dir.join(format!("{}_download.tmp", app_id));

    let client = reqwest::Client::builder()
        .user_agent("meCraft-Launcher/1.0.0")
        .build()
        .map_err(|e| format!("Failed to initialize HTTP client: {}", e))?;

    let res = client
        .get(&release_url)
        .send()
        .await
        .map_err(|e| format!("Failed to request package from {}: {}", release_url, e))?;

    if !res.status().is_success() {
        return Err(format!("Download failed with status: {}", res.status()));
    }

    let total_bytes = res.content_length().unwrap_or(50 * 1024 * 1024);
    let mut downloaded_bytes: u64 = 0;
    let mut stream = res.bytes_stream();

    let mut temp_file = fs::File::create(&temp_download_path)
        .map_err(|e| format!("Failed to create temporary download file: {}", e))?;

    let start_time = Instant::now();
    let mut last_progress_emit = Instant::now();

    while let Some(chunk_result) = stream.next().await {
        let chunk = chunk_result.map_err(|e| format!("Error downloading chunk: {}", e))?;
        temp_file
            .write_all(&chunk)
            .map_err(|e| format!("Error writing chunk to file: {}", e))?;

        downloaded_bytes += chunk.len() as u64;

        if last_progress_emit.elapsed().as_millis() >= 80 {
            let elapsed_sec = start_time.elapsed().as_secs_f64().max(0.001);
            let speed_bps = (downloaded_bytes as f64 / elapsed_sec) as u64;
            let percent = if total_bytes > 0 {
                ((downloaded_bytes as f64 / total_bytes as f64) * 100.0).min(99.0) as u32
            } else {
                50
            };

            let _ = app_handle.emit(
                "download-progress",
                DownloadProgressPayload {
                    app_id: app_id.clone(),
                    downloaded_bytes,
                    total_bytes,
                    percent,
                    speed_bps,
                },
            );

            last_progress_emit = Instant::now();
        }
    }

    drop(temp_file);

    // Install binary (either direct .exe or unpack .zip)
    let is_direct_exe = release_url.ends_with(".exe");
    let unpack_result = (|| -> Result<(), String> {
        if is_direct_exe {
            let target_exe = get_target_exe_path(&app_id);
            fs::copy(&temp_download_path, &target_exe)
                .map_err(|e| format!("Failed to save executable: {}", e))?;
            return Ok(());
        }

        let zip_file = fs::File::open(&temp_download_path)
            .map_err(|e| format!("Failed to open downloaded archive: {}", e))?;
        let mut archive = zip::ZipArchive::new(zip_file)
            .map_err(|e| format!("Corrupt zip archive: {}", e))?;

        for i in 0..archive.len() {
            let mut file = archive
                .by_index(i)
                .map_err(|e| format!("Failed to read archive entry #{}: {}", i, e))?;

            let outpath = match file.enclosed_name() {
                Some(path) => app_dir.join(path),
                None => continue,
            };

            if file.is_dir() || file.name().ends_with('/') || file.name().ends_with('\\') {
                fs::create_dir_all(&outpath).map_err(|e| e.to_string())?;
            } else {
                if let Some(p) = outpath.parent() {
                    fs::create_dir_all(p).map_err(|e| e.to_string())?;
                }
                let mut outfile = fs::File::create(&outpath).map_err(|e| e.to_string())?;
                std::io::copy(&mut file, &mut outfile).map_err(|e| e.to_string())?;
            }
        }
        Ok(())
    })();

    // Ensure temporary download file is always cleaned up regardless of unpack result
    let _ = fs::remove_file(&temp_download_path);

    unpack_result?;

    // Record installed version if identifiable from URL
    if let Some(idx) = release_url.find("/download/v") {
        let rest = &release_url[idx + 11..];
        if let Some(slash_idx) = rest.find('/') {
            let ver = &rest[..slash_idx];
            let _ = fs::write(app_dir.join("version.txt"), ver);
        }
    }

    // Emit final 100% progress
    let _ = app_handle.emit(
        "download-progress",
        DownloadProgressPayload {
            app_id: app_id.clone(),
            downloaded_bytes: total_bytes,
            total_bytes,
            percent: 100,
            speed_bps: 0,
        },
    );

    let installed_exe = get_target_exe_path(&app_id);
    Ok(installed_exe.to_string_lossy().to_string())
}

#[tauri::command]
fn launch_app(app_id: String, args: Vec<String>) -> Result<bool, String> {
    validate_app_id(&app_id)?;
    let exe_path = get_target_exe_path(&app_id);

    if !exe_path.exists() {
        return Err(format!(
            "App '{}' is not installed yet (missing executable: {})",
            app_id,
            exe_path.display()
        ));
    }

    let mut cmd = std::process::Command::new(&exe_path);
    cmd.current_dir(get_target_app_dir(&app_id));
    cmd.args(&args);

    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NEW_PROCESS_GROUP: u32 = 0x00000200;
        const DETACHED_PROCESS: u32 = 0x00000008;
        cmd.creation_flags(CREATE_NEW_PROCESS_GROUP | DETACHED_PROCESS);
    }

    cmd.spawn().map_err(|e| format!("Failed to spawn {}: {}", exe_path.display(), e))?;
    Ok(true)
}

#[tauri::command]
fn get_app_directory(app_id: String) -> Result<String, String> {
    validate_app_id(&app_id)?;
    let app_dir = get_target_app_dir(&app_id);
    if !app_dir.exists() {
        let _ = fs::create_dir_all(&app_dir);
    }
    Ok(app_dir.to_string_lossy().to_string())
}

#[tauri::command]
fn uninstall_app(app_id: String) -> Result<bool, String> {
    validate_app_id(&app_id)?;
    let app_dir = get_target_app_dir(&app_id);
    if app_dir.exists() {
        fs::remove_dir_all(&app_dir).map_err(|e| format!("Failed to remove app directory: {}", e))?;
    }
    Ok(true)
}

#[tauri::command]
async fn apply_launcher_update(
    app_handle: tauri::AppHandle,
    download_url: String,
) -> Result<bool, String> {
    if !download_url.starts_with("https://") && !download_url.starts_with("http://") {
        return Err(format!("Invalid download URL scheme: {}", download_url));
    }

    let temp_installer = std::env::temp_dir().join("meCraft-Update-Setup.exe");

    let client = reqwest::Client::builder()
        .user_agent("meCraft-Launcher/1.0.0")
        .build()
        .map_err(|e| format!("Failed to initialize HTTP client: {}", e))?;

    let res = client
        .get(&download_url)
        .send()
        .await
        .map_err(|e| format!("Failed to request installer from {}: {}", download_url, e))?;

    if !res.status().is_success() {
        return Err(format!("Download failed with status: {}", res.status()));
    }

    let total_bytes = res.content_length().unwrap_or(90 * 1024 * 1024);
    let mut downloaded_bytes: u64 = 0;
    let mut stream = res.bytes_stream();

    let mut temp_file = fs::File::create(&temp_installer)
        .map_err(|e| format!("Failed to create temporary installer file: {}", e))?;

    let start_time = Instant::now();
    let mut last_progress_emit = Instant::now();

    while let Some(chunk_result) = stream.next().await {
        let chunk = chunk_result.map_err(|e| format!("Error downloading chunk: {}", e))?;
        temp_file
            .write_all(&chunk)
            .map_err(|e| format!("Error writing chunk to file: {}", e))?;

        downloaded_bytes += chunk.len() as u64;

        if last_progress_emit.elapsed().as_millis() >= 80 {
            let elapsed_sec = start_time.elapsed().as_secs_f64().max(0.001);
            let speed_bps = (downloaded_bytes as f64 / elapsed_sec) as u64;
            let percent = if total_bytes > 0 {
                ((downloaded_bytes as f64 / total_bytes as f64) * 100.0).min(99.0) as u32
            } else {
                50
            };

            let _ = app_handle.emit(
                "download-progress",
                DownloadProgressPayload {
                    app_id: "mecraft-suite".to_string(),
                    downloaded_bytes,
                    total_bytes,
                    percent,
                    speed_bps,
                },
            );

            last_progress_emit = Instant::now();
        }
    }

    drop(temp_file);

    // Final 100% progress
    let _ = app_handle.emit(
        "download-progress",
        DownloadProgressPayload {
            app_id: "mecraft-suite".to_string(),
            downloaded_bytes: total_bytes,
            total_bytes,
            percent: 100,
            speed_bps: 0,
        },
    );

    // Execute silent update and self-restart on Windows
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NEW_PROCESS_GROUP: u32 = 0x00000200;
        const DETACHED_PROCESS: u32 = 0x00000008;

        let current_exe = std::env::current_exe().map_err(|e| e.to_string())?;
        let pid = std::process::id();

        let script = format!(
            "Start-Sleep -Milliseconds 600; \
             try {{ Wait-Process -Id {} -Timeout 15 }} catch {{}}; \
             Start-Process -FilePath '{}' -ArgumentList '/S' -Wait; \
             Start-Sleep -Milliseconds 800; \
             $targetExe = '{}'; \
             $prog = Join-Path $env:ProgramFiles 'meCraft\\mecraft-launcher.exe'; \
             $local = Join-Path $env:LOCALAPPDATA 'Programs\\meCraft\\mecraft-launcher.exe'; \
             if (Test-Path $prog) {{ $targetExe = $prog }} elseif (Test-Path $local) {{ $targetExe = $local }}; \
             Start-Process -FilePath $targetExe; \
             Remove-Item -Path '{}' -Force -ErrorAction SilentlyContinue",
            pid,
            temp_installer.to_string_lossy().replace('\'', "''"),
            current_exe.to_string_lossy().replace('\'', "''"),
            temp_installer.to_string_lossy().replace('\'', "''")
        );

        let mut cmd = std::process::Command::new("powershell");
        cmd.args(&["-NoProfile", "-WindowStyle", "Hidden", "-Command", &script]);
        cmd.creation_flags(CREATE_NEW_PROCESS_GROUP | DETACHED_PROCESS);
        cmd.spawn().map_err(|e| format!("Failed to spawn silent updater process: {}", e))?;

        std::thread::spawn(|| {
            std::thread::sleep(std::time::Duration::from_millis(400));
            std::process::exit(0);
        });
    }

    Ok(true)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            check_app_status,
            download_and_install_app,
            launch_app,
            get_app_directory,
            uninstall_app,
            apply_launcher_update,
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while building tauri launcher application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_app_id_accepts_valid_ids() {
        assert!(validate_app_id("mepdf").is_ok());
        assert!(validate_app_id("mephoto").is_ok());
        assert!(validate_app_id("mevector").is_ok());
        assert!(validate_app_id("medoc").is_ok());
        assert!(validate_app_id("mecraft-pdf").is_ok());
        assert!(validate_app_id("app123").is_ok());
        assert!(validate_app_id("a-b-c").is_ok());
        assert!(validate_app_id("ab").is_ok());
        assert!(validate_app_id("12").is_ok());
        assert!(validate_app_id("1-2").is_ok());
        assert!(validate_app_id("0a").is_ok());
        assert!(validate_app_id("a0").is_ok());
        assert!(validate_app_id("abcdefghijklmnopqrstuvwxyz012345").is_ok()); // 32 chars
    }

    #[test]
    fn test_validate_app_id_blocks_path_traversal_and_invalid_formats() {
        // Path traversal
        assert!(validate_app_id("../mepdf").is_err());
        assert!(validate_app_id("..\\mepdf").is_err());
        assert!(validate_app_id("../../windows/system32").is_err());
        assert!(validate_app_id("/etc/passwd").is_err());
        assert!(validate_app_id("./mepdf").is_err());
        assert!(validate_app_id(".").is_err());
        assert!(validate_app_id("..").is_err());
        assert!(validate_app_id("mepdf.app").is_err());
        assert!(validate_app_id("mepdf.").is_err());
        assert!(validate_app_id(".mepdf").is_err());
        assert!(validate_app_id("mepdf/test").is_err());
        assert!(validate_app_id("mepdf\\test").is_err());

        // Length boundaries
        assert!(validate_app_id("").is_err());
        assert!(validate_app_id("a").is_err());
        assert!(validate_app_id("abcdefghijklmnopqrstuvwxyz0123456").is_err()); // 33 chars

        // Invalid characters
        assert!(validate_app_id("unknown_app").is_err()); // underscore
        assert!(validate_app_id("mepdf\0").is_err());
        assert!(validate_app_id(" mepdf").is_err());
        assert!(validate_app_id("mepdf ").is_err());
        assert!(validate_app_id("mepdf app").is_err());
        assert!(validate_app_id("mepdf\n").is_err());
        assert!(validate_app_id("\tmepdf").is_err());
        assert!(validate_app_id("MEPDF").is_err());
        assert!(validate_app_id("MePhoto").is_err());
        assert!(validate_app_id("ไทย").is_err());
        assert!(validate_app_id("mepdfé").is_err());

        // Hyphen violations
        assert!(validate_app_id("-mepdf").is_err());
        assert!(validate_app_id("mepdf-").is_err());
        assert!(validate_app_id("me--pdf").is_err());
        assert!(validate_app_id("--").is_err());
        assert!(validate_app_id("-a").is_err());
        assert!(validate_app_id("a-").is_err());
        assert!(validate_app_id("a--").is_err());
        assert!(validate_app_id("--a").is_err());
    }

    #[test]
    fn test_target_paths_consistency() {
        let app_dir = get_target_app_dir("mepdf");
        assert!(app_dir.ends_with("mepdf"));

        let exe_path = get_target_exe_path("mepdf");
        if cfg!(windows) {
            assert!(exe_path.ends_with("mepdf.exe"));
        } else {
            assert!(exe_path.ends_with("mepdf"));
        }
    }
}
