import { ipcMain } from 'electron';
import { autoUpdater } from "electron-updater";
import Main from "./mainWindow";

import systemInfo from './IPC/systemInfo';
import updaterInfo from './IPC/updaterInfo';
import fileSystem from './IPC/fileSystem';

const developerOptions = {
  isInProduction: true,    // true if is in production
  serveSvelteDev: false,    // true when you want to watch svelte 
  buildSvelteDev: false,     // true when you want to build svelte
  watchSvelteBuild: false,   // true when you want to watch build svelte 
};

/*
  testing svelte side: isInProduction: false, serveSvelteDev: true, buildSvelteDev:false, watchSvelteBuild: false
  testing only electron side: isInProduction: true, serveSvelteDev: false, buildSvelteDev:false, watchSvelteBuild: false
  testing both side: isInProduction: true, serveSvelteDev: false, buildSvelteDev:true, watchSvelteBuild: true
*/

const windowSettings = {
  title:  "Layendanimator",
  minWidth: 400,
  minHeight: 400,
  width: 800,
  height: 600,
  fullscreen: true,
  webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      nativeWindowOpen: true,
  },
}

let main = new Main(windowSettings, developerOptions);

main.onEvent.on("window-created", async () => {
  systemInfo.initIpcMain(ipcMain, main.window);
  updaterInfo.initIpcMain(ipcMain, main.window);
  fileSystem.initIpcMain(ipcMain, main.window);
  
  updaterInfo.initAutoUpdater(autoUpdater, main.window);
});

