// Needed as error of injecting __TAURI__ into ts
interface Window {
  __TAURI__: {
    // Could be changed to import in each file instead of doing it in whole project
    [key: string]: any;
  };
}
