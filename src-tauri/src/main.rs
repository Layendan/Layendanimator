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
        // Declare API methods
        .invoke_handler(tauri::generate_handler![
            api::close_splashscreen,
            api::search_anime,
            api::add_module
        ])
        .run(ctx)
        .expect("error while running tauri application");
}
