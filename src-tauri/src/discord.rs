use core::time::Duration;
use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use lazy_static::lazy_static;
use std::ops::Add;
use std::sync::{Mutex, MutexGuard};
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
    let client: Option<MutexGuard<'_, DiscordIpcClient>> = match RPC.lock() {
        Ok(l) => Some(l),
        Err(e) => {
            println!("Set Watching Activity Error: {}", e);
            let mut client = e.into_inner();
            match client.reconnect() {
                Ok(_) => {
                    println!("Reconnected to Discord");
                    Some(client)
                }
                Err(e) => {
                    println!("Reconnection Error: {}", e);
                    None
                }
            }
        }
    };

    if client.is_none() {
        return;
    }

    let mut client = client.unwrap();

    let res = client.set_activity(
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
                activity::Button::new("Download App", "https://github.com/Layendan/Layendanimator"),
            ]),
    );

    if let Err(e) = res {
        println!("Set Watching Error: {}", e);
        match login(client) {
            Err(e) => println!("Reconnection Error: {}", e),
            Ok(_) => {
                println!("Reconnected to Discord");
                set_watching(
                    title,
                    episode,
                    episode_title,
                    current_time,
                    duration,
                    artwork,
                    link,
                );
            }
        }
    } else {
        res.unwrap();
    }
}

#[tauri::command]
pub fn pause_watching(title: &str, episode_title: &str, artwork: &str, link: &str) {
    let client: Option<MutexGuard<'_, DiscordIpcClient>> = match RPC.lock() {
        Ok(l) => Some(l),
        Err(e) => {
            println!("Pause Watching Activity Error: {}", e);
            let mut client = e.into_inner();
            match client.reconnect() {
                Ok(_) => {
                    println!("Reconnected to Discord");
                    Some(client)
                }
                Err(e) => {
                    println!("Reconnection Error: {}", e);
                    None
                }
            }
        }
    };

    if client.is_none() {
        return;
    }

    let mut client = client.unwrap();

    let res = client.set_activity(
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
                activity::Button::new("Download App", "https://github.com/Layendan/Layendanimator"),
            ]),
    );

    if let Err(e) = res {
        println!("Pause Watching Error: {}", e);
        match login(client) {
            Err(e) => println!("Reconnection Error: {}", e),
            Ok(_) => {
                println!("Reconnected to Discord");
                pause_watching(title, episode_title, artwork, link);
            }
        }
    } else {
        res.unwrap();
    }
}

#[tauri::command]
pub fn reset_activity() {
    let client: Option<MutexGuard<'_, DiscordIpcClient>> = match RPC.lock() {
        Ok(l) => Some(l),
        Err(e) => {
            println!("Reset Activity Error: {}", e);
            let mut client = e.into_inner();
            match client.reconnect() {
                Ok(_) => {
                    println!("Reconnected to Discord");
                    Some(client)
                }
                Err(e) => {
                    println!("Reconnection Error: {}", e);
                    None
                }
            }
        }
    };

    if client.is_none() {
        return;
    }

    let mut client = client.unwrap();

    let res = client.set_activity(
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
    );

    if let Err(e) = res {
        println!("Reset Activity Error: {}", e);
        match login(client) {
            Err(e) => println!("Reconnection Error: {}", e),
            Ok(_) => {
                println!("Reconnected to Discord");
                reset_activity();
            }
        }
    } else {
        res.unwrap();
    }
}

#[tauri::command]
pub fn clear_activity() {
    let client: Option<MutexGuard<'_, DiscordIpcClient>> = match RPC.lock() {
        Ok(l) => Some(l),
        Err(e) => {
            println!("Clear Activity Error: {}", e);
            let mut client = e.into_inner();
            match client.reconnect() {
                Ok(_) => {
                    println!("Reconnected to Discord");
                    Some(client)
                }
                Err(e) => {
                    println!("Reconnection Error: {}", e);
                    None
                }
            }
        }
    };

    if client.is_none() {
        return;
    }

    let mut client = client.unwrap();

    let res = client.clear_activity();

    if let Err(e) = res {
        println!("Clear Activity Error: {}", e);
        match login(client) {
            Err(e) => println!("Reconnection Error: {}", e),
            Ok(_) => println!("Reconnected to Discord"),
        }
    } else {
        res.unwrap();
    }
}

fn login(mut rpc: MutexGuard<'_, DiscordIpcClient>) -> Result<(), String> {
    // Create new RPC
    return match rpc.reconnect() {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    };
}
