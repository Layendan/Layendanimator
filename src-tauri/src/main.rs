#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![allow(unused_variables)]
#![allow(unused_imports)]
#![allow(dead_code)]
#![allow(unused_imports)]

mod api;

use api::{add_module, close_splashscreen, search_anime};
use tauri::Manager;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

fn main() {
    let ctx = tauri::generate_context!();

    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            #[cfg(target_os = "macos")]
            {
                apply_vibrancy(
                    &window,
                    NSVisualEffectMaterial::UnderWindowBackground,
                    Some(NSVisualEffectState::FollowsWindowActiveState),
                    None,
                )
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            }
            #[cfg(target_os = "windows")]
            {
                apply_blur(&window, Some((31, 31, 31, 31)))
                    .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
            }
            Ok(())
        })
        // Declare API methods
        .invoke_handler(tauri::generate_handler![
            api::close_splashscreen,
            api::search_anime,
            api::add_module
        ])
        .run(ctx)
        .expect("error while running tauri application");
}
