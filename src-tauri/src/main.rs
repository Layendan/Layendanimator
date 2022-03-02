#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use crate::menu::AddDefaultSubmenus;
use tauri::{CustomMenuItem, Menu, Submenu};

mod menu;

fn custom_item(name: &str) -> CustomMenuItem {
  let c = CustomMenuItem::new(name.to_string(), name);
  return c;
}

fn main() {
  let ctx = tauri::generate_context!();

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![my_custom_command, search_anime])
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

// API

#[tauri::command]
fn my_custom_command() {
  println!("I was invoked from JS!");
}

#[tauri::command]
fn search_anime(name: String) {
  println!("I was invoked from JS! {}", name);
}
