use tauri::Manager;

// API
#[tauri::command]
pub async fn close_splashscreen(window: tauri::Window) {
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    // Show main window
    window.get_window("main").unwrap().show().unwrap();
}

#[tauri::command]
pub fn search_anime(name: String) {
    println!("I was invoked from JS! {}", name);
}
