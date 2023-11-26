#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod discord;

use discord::{clear_activity, pause_watching, reset_activity, set_watching, RPC};
use discord_rich_presence::DiscordIpc;
use std::thread;
use tauri::Manager;
#[allow(unused_imports)]
use window_vibrancy::{apply_mica, apply_vibrancy, NSVisualEffectMaterial};

#[derive(Clone, serde::Serialize)]
struct SInst {
    args: Vec<String>,
    cwd: String,
}

fn main() {
    tauri_plugin_deep_link::prepare("com.layendan.dev");
    tauri::Builder::default()
        .setup(|app| {
            // If you need macOS support this must be called in .setup() !
            // Otherwise this could be called right after prepare() but then you don't have access to tauri APIs
            let handle = app.handle();
            let window = app.get_window("main").unwrap();

            tauri_plugin_deep_link::register("layendanimator", move |request| {
                dbg!(&request);
                handle.emit_all("scheme-request-received", request).unwrap();
            })
            .unwrap();

            // If you also need the url when the primary instance was started by the custom scheme, you currently have to read it yourself
            #[cfg(not(target_os = "macos"))]
            // on macos the plugin handles this (macos doesn't use cli args for the url)
            if let Some(url) = std::env::args().nth(1) {
                app.emit_all("scheme-request-received", url).unwrap();
            }

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::Menu, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_mica(&window, None)
                .expect("Unsupported platform! 'apply_mica' is only supported on Windows");

            thread::spawn(move || {
                let mut client = RPC.lock().unwrap();
                client.connect().unwrap();
            });

            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);

            app.emit_all("single-instance", SInst { args: argv, cwd })
                .unwrap();
        }))
        .invoke_handler(tauri::generate_handler![
            set_watching,
            pause_watching,
            reset_activity,
            clear_activity
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
