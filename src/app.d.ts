/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces
// declare namespace App {
// 	interface Locals {}

// 	interface Platform {}

// 	interface Session {}

// 	interface Stuff {}
// }

// Needed as error of injecting __TAURI__ into ts
interface Window {
  __TAURI__: {
    // Could be changed to import in each file instead of doing it in whole project
    [key: string]: any;
  };
}
