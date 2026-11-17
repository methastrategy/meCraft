use std::fs;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
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
    let exe_path = get_target_exe_path(&app_id);

    if exe_path.exists() {
        let size = fs::metadata(&exe_path).map(|m| m.len()).unwrap_or(0);
        return Ok(AppStatusResponse {
            app_id: app_id.clone(),
            installed: true,
            version: Some("3.1.0".to_string()),
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
    let app_dir = get_target_app_dir(&app_id);
    fs::create_dir_all(&app_dir).map_err(|e| format!("Failed to create app dir: {}", e))?;

    let temp_zip_path = app_dir.join(format!("{}_download.zip", app_id));

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

    let mut temp_file = fs::File::create(&temp_zip_path)
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

    // Unpack ZIP Archive
    let zip_file = fs::File::open(&temp_zip_path)
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

        if file.name().ends_with('/') {
            fs::create_dir_all(&outpath).map_err(|e| e.to_string())?;
        } else {
            if let Some(p) = outpath.parent() {
                if !p.exists() {
                    fs::create_dir_all(p).map_err(|e| e.to_string())?;
                }
            }
            let mut outfile = fs::File::create(&outpath).map_err(|e| e.to_string())?;
            std::io::copy(&mut file, &mut outfile).map_err(|e| e.to_string())?;
        }
    }

    // Clean up temporary download file
    let _ = fs::remove_file(&temp_zip_path);

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
    let exe_path = get_target_exe_path(&app_id);

    if !exe_path.exists() {
        return Err(format!(
            "App '{}' is not installed yet (missing executable: {})",
            app_id,
            exe_path.display()
        ));
    }

    let mut cmd = std::process::Command::new(&exe_path);
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
    let app_dir = get_target_app_dir(&app_id);
    if !app_dir.exists() {
        let _ = fs::create_dir_all(&app_dir);
    }
    Ok(app_dir.to_string_lossy().to_string())
}

#[tauri::command]
fn uninstall_app(app_id: String) -> Result<bool, String> {
    let app_dir = get_target_app_dir(&app_id);
    if app_dir.exists() {
        fs::remove_dir_all(&app_dir).map_err(|e| format!("Failed to remove app directory: {}", e))?;
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
