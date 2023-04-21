#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs::{create_dir_all, File};

use ffmpeg_sidecar::{
    command::{ffmpeg_is_installed, FfmpegCommand},
    event::FfmpegEvent,
};
use serde_json::json;
use tauri::Manager;

#[derive(Clone, serde::Serialize)]
struct SInst {
    args: Vec<String>,
    cwd: String,
}

#[tauri::command]
async fn download<R: tauri::Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
    episode_id: String,
    episode_url: String,
) -> Result<(), String> {
    let app_dir = app.path_resolver().app_data_dir().unwrap();
    let store_path = app_dir.join("downloads").join(episode_id.clone() + ".mp4");

    println!("{}", &store_path.display());

    create_dir_all(store_path.parent().expect("invalid store path")).unwrap();
    File::create(&store_path).unwrap();

    FfmpegCommand::new()
        .hwaccel("auto")
        .input(episode_url)
        .args("-bsf:a aac_adtstoasc -vcodec copy -c copy -crf 50".split(' '))
        .create_no_window()
        .output(&store_path.canonicalize().unwrap().to_str().unwrap())
        .overwrite()
        .spawn()
        .unwrap()
        .iter()
        .unwrap()
        .for_each(|event: FfmpegEvent| {
            match event {
                FfmpegEvent::Done => {
                    println!("download done");
                    window
                        .emit(
                            format!("download-progress-{}", episode_id).as_str(),
                            json!({
                                "progress": 100,
                                "status": "success",
                                "path": store_path.display().to_string()
                            }),
                        )
                        .unwrap();
                    // <- download done
                }
                FfmpegEvent::LogEOF => {
                    println!("download log eof");
                    window
                        .emit(
                            format!("download-progress-{}", episode_id).as_str(),
                            json!({
                                "progress": 100,
                                "status": "success",
                                "path": store_path.display().to_string()
                            }),
                        )
                        .unwrap();
                    println!("{}", &store_path.display());
                    // <- download log eof
                }
                FfmpegEvent::Error(err) => {
                    println!("download error: {}", err);
                    window
                        .emit(
                            format!("download-progress-{}", episode_id).as_str(),
                            json!({
                                "progress": 100,
                                "status": "error",
                                "logs": err,
                                "path": store_path.display().to_string()
                            }),
                        )
                        .unwrap();
                    // <- download error
                }
                FfmpegEvent::Progress(progress) => {
                    eprintln!("[ffmpeg] Time: {}", progress.time);
                    // <- parsed progress updates
                }
                FfmpegEvent::Log(level, msg) => {
                    if level == ffmpeg_sidecar::event::LogLevel::Error
                        || level == ffmpeg_sidecar::event::LogLevel::Fatal
                    {
                        window
                            .emit(
                                format!("download-progress-{}", episode_id).as_str(),
                                json!({
                                    "progress": 100,
                                    "status": "error",
                                    "path": store_path.display().to_string()
                                }),
                            )
                            .unwrap();
                    }
                    eprintln!("[ffmpeg] {}", msg);
                    // <- granular log message from stderr
                }
                _ => {}
            }
        });

    Ok(())
}

fn main() {
    tauri_plugin_deep_link::prepare("com.layendan.dev");
    tauri::Builder::default()
        .setup(|app| {
            // If you need macOS support this must be called in .setup() !
            // Otherwise this could be called right after prepare() but then you don't have access to tauri APIs
            let handle = app.handle();
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

            if !ffmpeg_is_installed() {
                ffmpeg_sidecar::download::auto_download().unwrap();
            }

            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);

            app.emit_all("single-instance", SInst { args: argv, cwd })
                .unwrap();
        }))
        .invoke_handler(tauri::generate_handler![download])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
