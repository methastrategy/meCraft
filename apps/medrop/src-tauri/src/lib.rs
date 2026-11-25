use tauri::{
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, PhysicalPosition, Position,
};

#[tauri::command]
fn show_radial_at(app: AppHandle, x: i32, y: i32) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("radial") {
        let _ = window.set_position(Position::Physical(PhysicalPosition {
            x: x - 170,
            y: y - 170,
        }));
        let _ = window.show();
        let _ = window.set_focus();
        let _ = window.set_always_on_top(true);
    }
    Ok(())
}

#[tauri::command]
fn hide_radial(app: AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("radial") {
        let _ = window.hide();
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![show_radial_at, hide_radial])
        .setup(|app| {
            // Build Tray Menu
            let tray_menu = Menu::new(app)?;
            let info_item = MenuItem::with_id(app, "info", "meDrop v1.0.0 — Ready", false, None::<&str>)?;
            let trigger_item = MenuItem::with_id(app, "trigger", "Trigger: Ctrl + Drag", false, None::<&str>)?;
            let show_item = MenuItem::with_id(app, "show", "Show Radial HUD", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Exit meDrop", true, None::<&str>)?;

            tray_menu.append(&info_item)?;
            tray_menu.append(&trigger_item)?;
            tray_menu.append(&show_item)?;
            tray_menu.append(&quit_item)?;

            let _tray = TrayIconBuilder::new()
                .menu(&tray_menu)
                .tooltip("meDrop — Zero-Window Radial File Converter")
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("radial") {
                            let _ = window.center();
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click { .. } = event {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("radial") {
                            let _ = window.center();
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running meDrop application");
}
