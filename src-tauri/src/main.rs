#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod discord;

use discord::{clear_activity, pause_watching, reset_activity, set_watching, RPC};
use discord_rich_presence::DiscordIpc;
use log::{error, info, LevelFilter};
use std::thread;
use tauri::Manager;
use tauri_plugin_log::{fern::colors::ColoredLevelConfig, LogTarget};

#[cfg(target_os = "windows")]
use std::mem;
#[cfg(target_os = "windows")]
use winapi::um::sysinfoapi::GetVersionExW;
#[cfg(target_os = "windows")]
use winapi::um::winnt::OSVERSIONINFOW;
#[cfg(target_os = "windows")]
use window_vibrancy::{apply_acrylic, apply_mica};

#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

#[derive(Clone, serde::Serialize)]
struct SInst {
    args: Vec<String>,
    cwd: String,
}

#[cfg(target_os = "windows")]
fn get_windows_version() -> Option<(u32, u32)> {
    unsafe {
        let mut info: OSVERSIONINFOW = mem::zeroed();
        info.dwOSVersionInfoSize = mem::size_of::<OSVERSIONINFOW>() as u32;

        if GetVersionExW(&mut info as *mut _) == 0 {
            return None;
        }

        Some((info.dwMajorVersion, info.dwMinorVersion))
    }
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
            apply_vibrancy(&window, NSVisualEffectMaterial::Menu, None, None).unwrap_or_else(
                |_| {
                    error!("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
                    panic!("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
                },
            );

            #[cfg(target_os = "windows")]
            {
                if let Some((major, minor)) = get_windows_version() {
                    if major == 10 && minor >= 17763 && minor < 22000 {
                        apply_acrylic(&window, None).unwrap_or_else(|_| {
                            error!("Unsupported platform! 'apply_acrylic' is only supported on Windows 10");
                            panic!("Unsupported platform! 'apply_acrylic' is only supported on Windows 10");
                        });
                    }
                    else {
                        apply_mica(&window, None).unwrap_or_else(|_| {
                            error!("Unsupported platform! 'apply_mica' is only supported on Windows 11");
                            panic!("Unsupported platform! 'apply_mica' is only supported on Windows 11");
                        });
                    }
                } else {
                    error!("Unsupported platform! Windows 10 v1809+ and Windows 11 are the only supported versions");
                    panic!("Unsupported platform! Windows 10 v1809+ and Windows 11 are the only supported versions");
                }
            }

            thread::spawn(move || {
                let mut client = RPC.lock().unwrap_or_else(|_| {
                    error!("Failed to create Discord IPC client - main");
                    panic!("Failed to create Discord IPC client - main");
                });
                client.connect().unwrap_or_else(|_| {
                    error!("Failed to connect to Discord IPC client - main");
                    panic!("Failed to connect to Discord IPC client - main");
                });
            });

            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            info!("{}, {argv:?}, {cwd}", app.package_info().name);

            app.emit_all("single-instance", SInst { args: argv, cwd })
                .unwrap();
        }))
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::Stdout, LogTarget::LogDir])
                .with_colors(ColoredLevelConfig::default())
                .level(LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_context_menu::init())
        .plugin(tauri_plugin_clipboard::init())
        .invoke_handler(tauri::generate_handler![
            set_watching,
            pause_watching,
            reset_activity,
            clear_activity
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
