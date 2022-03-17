#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use crate::menu::AddDefaultSubmenus;
use tauri::{CustomMenuItem, Manager, Menu, Submenu};
#[allow(unused_imports)]
use window_vibrancy::{apply_mica, apply_vibrancy, NSVisualEffectMaterial};

mod api;
mod menu;

fn custom_item(name: &str) -> CustomMenuItem {
  let c = CustomMenuItem::new(name.to_string(), name);
  return c;
}

fn main() {
  let ctx = tauri::generate_context!();

  tauri::Builder::default()
    // Set custom background meterial
    .setup(|app| {
      let window = app.get_window("main").unwrap();

      #[cfg(target_os = "macos")]
      apply_vibrancy(&window, NSVisualEffectMaterial::UnderWindowBackground).unwrap();

      #[cfg(target_os = "windows")]
      apply_mica(&window).unwrap();

      Ok(())
    })
    // Declare API methods
    .invoke_handler(tauri::generate_handler![
      api::close_splashscreen,
      api::search_anime,
      api::add_module
    ])
    // Add default submenus
    .menu(
      Menu::new()
        .add_default_app_submenu_if_macos(&ctx.package_info().name)
        .add_default_file_submenu()
        .add_default_edit_submenu()
        .add_default_view_submenu()
        .add_default_window_submenu()
        .add_submenu(Submenu::new(
          "Help",
          Menu::new().add_item(custom_item("Learn More")),
        )),
    )
    .run(ctx)
    .expect("error while running tauri application");
}
