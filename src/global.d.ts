// TODO: Remove this when findLast is added to TypeScript
export {};

declare global {
  interface Window {
    __TAURI__: object;
  }
}
