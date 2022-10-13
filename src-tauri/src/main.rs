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

    #[cfg(target_os = "windows")]
    tauri::Builder::default()
        .setup(|app| {
            let splashscreen_window = app.get_window("splashscreen").unwrap();
            let main_window = app.get_window("main").unwrap();
            // we perform the initialization code on a new task so the app doesn't freeze
            tauri::async_runtime::spawn(async move {
                // initialize your app here instead of sleeping :)
                // For some reason app crashes if I don't wait at least 0.2 seconds
                std::thread::sleep(std::time::Duration::from_secs_f32(0.5));

                // After it's done, close the splashscreen and display the main window
                splashscreen_window.close().unwrap();
                main_window.show().unwrap();
            });
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

    #[cfg(not(target_os = "windows"))]
    tauri::Builder::default()
        .setup(|app| {
            let splashscreen_window = app.get_window("splashscreen").unwrap();
            let main_window = app.get_window("main").unwrap();
            // we perform the initialization code on a new task so the app doesn't freeze
            tauri::async_runtime::spawn(async move {
                // initialize your app here instead of sleeping :)
                // For some reason app crashes if I don't wait at least 0.2 seconds
                std::thread::sleep(std::time::Duration::from_secs_f32(0.5));

                // After it's done, close the splashscreen and display the main window
                splashscreen_window.close().unwrap();
                main_window.show().unwrap();
            });
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
