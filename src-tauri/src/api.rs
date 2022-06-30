use serde_json::json;
use serde_json::value::Value;
use tauri::api::http::{ClientBuilder, HttpRequestBuilder};
use tauri::{command, Manager};

// API
#[command]
pub async fn close_splashscreen(window: tauri::Window) {
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    // Show main window
    window.get_window("main").unwrap().show().unwrap();
}

#[command]
pub fn search_anime(name: String) {
    println!("I was invoked from JS! {}", name);
}

#[command]
pub async fn add_module(link: String) -> Value {
    println!("Saving Module with link: {}", link);

    let client = ClientBuilder::new()
        .connect_timeout(std::time::Duration::new(10, 0))
        .build()
        .unwrap(); // Create a new client
    let request = HttpRequestBuilder::new("GET", link).unwrap(); // Build new request
    let response = client.send(request).await; // Returns Result<Response, Error>
    let result = match response {
        Ok(result) => result,
        Err(e) => {
            println!("Error: {}", e);
            return json!({
                "status": "error",
                "message": "Error while fetching module",
                "status_number": 500,
                "data": null
            });
        }
    }; // Gets Response
    let data = result.read().await; // Reads Response, returns Result<ResponseData>
    let response_data = match data {
        Ok(data) => data,
        Err(e) => {
            println!("Error: {}", e);
            return json!({
                "status": "error",
                "message": "Missing data from response",
                "status_number": 400,
                "data": null
            });
        }
    }; // Response to Value

    let error_code = response_data.status;

    return json!({
        "status": "success",
        "message": "Module added successfully",
        "status_number": error_code,
        "data": response_data
    });

    // return response_data.data;
}

#[command]
pub fn get_theme(window: tauri::Window) -> Result<tauri::Theme, String> {
    match window.theme() {
        Ok(theme) => Ok(theme),
        Err(e) => Err(e.to_string()),
    }
}

#[command]
pub fn fullscreen(window: tauri::Window, label: &str) {
    // Only run the fullscreen command on windows since the actual window does not fullscreen
    #![cfg(target_os = "windows")]
    let target: tauri::Window = window
        .get_window(if label.is_empty() { "main" } else { label })
        .unwrap();

    let is_fullscreen: bool = target.is_fullscreen().unwrap();
    target.set_fullscreen(!is_fullscreen).unwrap();
}
