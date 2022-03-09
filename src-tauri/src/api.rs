use serde_json::value::Value;
use tauri::api::http::{ClientBuilder, HttpRequestBuilder};
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

#[allow(unused_mut)]
#[tauri::command]
pub async fn add_module(link: String) -> Value {
    println!("Saving Module with link: {}", link);

    let client = ClientBuilder::new().connect_timeout(10).build().unwrap();     // Create a new client
    let request = HttpRequestBuilder::new("GET", link).unwrap();                // Build new request
    let response = client.send(request).await;                                  // Returns Result<Response, Error>
    // println!("Response: {:?}", response);
    let result = response.ok().unwrap();                                        // Gets Response
    let data = result.read().await;                                             // Reads Response
    // println!("Data: {:?}", data);
    let response_data = data.ok().unwrap();                                     // Response to Value

    return response_data.data;
}
