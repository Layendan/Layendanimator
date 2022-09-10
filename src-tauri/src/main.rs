#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![allow(unused_variables)]
#![allow(unused_imports)]
#![allow(dead_code)]
#![allow(unused_imports)]

mod api;
mod menu;

use crate::menu::AddDefaultSubmenus;
use api::{add_module, close_splashscreen, search_anime};
use tauri::{CustomMenuItem, Manager, Menu, Submenu};
use window_vibrancy::{apply_mica, apply_vibrancy, NSVisualEffectMaterial};

fn custom_item(name: &str) -> CustomMenuItem {
    let c = CustomMenuItem::new(name.to_string(), name);
    return c;
}

fn main() {
    let ctx = tauri::generate_context!();

    #[cfg(target_os = "linux")]
    tauri::Builder::default()
        // Declare API methods
        .invoke_handler(tauri::generate_handler![
            api::close_splashscreen,
            api::search_anime,
            api::add_module
        ])
        .run(ctx)
        .expect("error while running tauri application");

    #[cfg(target_os = "windows")]
    tauri::Builder::default()
        // Set custom background material
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            apply_mica(&window).unwrap();

            Ok(())
        })
        // Declare API methods
        .invoke_handler(tauri::generate_handler![
            api::close_splashscreen,
            api::search_anime,
            api::add_module,
            api::fullscreen
        ])
        .run(ctx)
        .expect("error while running tauri application");

    #[cfg(not(any(target_os = "windows", target_os = "linux")))]
    tauri::Builder::default()
        // Set custom background material
        .setup(|app| {
            #[cfg(target_os = "macos")]
            {
                let window = app.get_window("main").unwrap();
                apply_vibrancy(&window, NSVisualEffectMaterial::UnderWindowBackground).unwrap();
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
