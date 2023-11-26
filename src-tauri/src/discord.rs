use core::time::Duration;
use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use lazy_static::lazy_static;
use std::ops::Add;
use std::sync::Mutex;
use std::time::SystemTime;

const DISCORD_CLIENT_ID: &str = "943204505519001682";

lazy_static! {
    pub static ref RPC: Mutex<DiscordIpcClient> =
        Mutex::new(DiscordIpcClient::new(DISCORD_CLIENT_ID).unwrap());
}

#[tauri::command]
pub fn set_watching(
    title: &str,
    episode: u64,
    episode_title: &str,
    current_time: f64,
    duration: f64,
    artwork: &str,
    link: &str,
) {
    let mut client = RPC.lock().unwrap();

    client
        .set_activity(
            activity::Activity::new()
                .state(format!("Episode {}", episode).as_str())
                .details(format!("{} - {}", title, episode_title).as_str())
                .assets(
                    activity::Assets::new()
                        .large_image(&artwork)
                        .large_text(title)
                        .small_image("layendanimator_never_dies")
                        .small_text("Playing on Layendanimator"),
                )
                .timestamps(
                    activity::Timestamps::new()
                        .start(
                            SystemTime::now()
                                .duration_since(SystemTime::UNIX_EPOCH)
                                .unwrap_or(Duration::from_secs(0))
                                .as_secs() as i64,
                        )
                        .end(
                            SystemTime::now()
                                .duration_since(SystemTime::UNIX_EPOCH)
                                .unwrap_or(Duration::from_secs(0))
                                .add(Duration::from_secs_f64(duration - current_time))
                                .as_secs() as i64,
                        ),
                )
                .buttons(vec![
                    activity::Button::new("Anime Link", &link),
                    activity::Button::new(
                        "Download App",
                        "https://github.com/Layendan/Layendanimator",
                    ),
                ]),
        )
        .unwrap();
}

#[tauri::command]
pub fn pause_watching(title: &str, episode_title: &str, artwork: &str, link: &str) {
    let mut client = RPC.lock().unwrap();

    client
        .set_activity(
            activity::Activity::new()
                .state("Idling")
                .details(format!("{} - {}", title, episode_title).as_str())
                .assets(
                    activity::Assets::new()
                        .large_image(&artwork)
                        .large_text(title)
                        .small_image("layendanimator_never_dies")
                        .small_text("Playing on Layendanimator"),
                )
                .buttons(vec![
                    activity::Button::new("Anime Link", &link),
                    activity::Button::new(
                        "Download App",
                        "https://github.com/Layendan/Layendanimator",
                    ),
                ]),
        )
        .unwrap();
}

#[tauri::command]
pub fn reset_activity() {
    let mut client = RPC.lock().unwrap();

    client
        .set_activity(
            activity::Activity::new()
                .state("Idling")
                .assets(
                    activity::Assets::new()
                        .large_image("layendanimator_never_dies")
                        .large_text("Layendanimator"),
                )
                .timestamps(
                    activity::Timestamps::new().start(
                        SystemTime::now()
                            .duration_since(SystemTime::UNIX_EPOCH)
                            .unwrap_or(Duration::from_secs(0))
                            .as_secs() as i64,
                    ),
                )
                .buttons(vec![activity::Button::new(
                    "Download App",
                    "https://github.com/Layendan/Layendanimator",
                )]),
        )
        .unwrap();
}

#[tauri::command]
pub fn clear_activity() {
    let mut client = RPC.lock().unwrap();
    client.clear_activity().unwrap();
}
