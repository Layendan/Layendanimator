// API

#[tauri::command]
pub fn my_custom_command() {
    println!("I was invoked from JS!");
}

#[tauri::command]
pub fn search_anime(name: String) {
    println!("I was invoked from JS! {}", name);
}
