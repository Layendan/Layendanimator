use serde_json::json;
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

#[tauri::command]
pub async fn add_module(link: String) -> Value {
    println!("Saving Module with link: {}", link);

    let client = ClientBuilder::new().connect_timeout(10).build().unwrap(); // Create a new client
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