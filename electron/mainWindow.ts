import { app, BrowserWindow, globalShortcut } from 'electron';
import path from "path";
import EventEmitter from 'events';
import ConfigureDev from './configureDev';
import { DeveloperOptions } from "./configureDev";

const appName = "Layendanimator";

const defaultSettings = {
  title:  "Layendanimator",
  minWidth: 400,
  minHeight: 400,
  width: 800,
  height: 600,
  fullscreen: true,
  webPreferences: {
      scrollBounce: true,
      nodeIntegration: true,
      webSecurity: false,
      nativeWindowOpen: true,
  },
}

const defaultSettingsDev:DeveloperOptions = {
  isInProduction: true,    // true if is in production
  serveSvelteDev: false,    // true when you want to watch svelte 
  buildSvelteDev: false,     // true when you want to build svelte
  watchSvelteBuild: false,   // true when you want to watch build svelte 
}

class Main {
  window!: BrowserWindow;
  settings: {[key: string]: any};
  onEvent: EventEmitter = new EventEmitter();
  settingsDev: DeveloperOptions;
  configDev: ConfigureDev;

  constructor(settings: {[key: string]: any} | null = null, settingsDev: DeveloperOptions | null = null) {
    this.settings = settings ? {...settings} : {...defaultSettings};
    this.settingsDev = settingsDev ? {...settingsDev} : {...defaultSettingsDev};

    this.configDev = new ConfigureDev(this.settingsDev);

  app.on('ready', () => {

    let loading = new BrowserWindow({show: true, frame: false, width: 300, height:300, transparent:true, resizable: false, alwaysOnTop: true, movable: false});

    loading.once('show', async () => {
      this.window = await this.createWindow();
      this.onEvent.emit("window-created");
      loading.hide()
      loading.close()

      this.window.maximize();
    })
    loading.loadURL(path.join(__dirname, "www", "loading.html"));
    loading.show();
  })

    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);

  }

  async createWindow() {
    let settings = {...this.settings}
    app.name = appName;
    let window = new BrowserWindow({
      ...settings,
      show: false, // false
      minWidth: 800,
      minHeight: 600,
      width: 1920,
      height: 1080,
      webPreferences: {
          // scrollBounce: true,
          nodeIntegration: true,
          webSecurity: false,
          nativeWindowOpen: true,
  },
    });

    if (this.configDev.isLocalHost()) {
      try {
        await window.loadURL("http://localhost:3000/");
      } catch (error) {
        console.log(`ERROR: window.loadURL("http://localhost:3000/");`)
        console.log(error)
      }
    } else if (this.configDev.isElectronServe()) {
      try {
        await this.configDev.loadURL(window);
      } catch (error) {
        console.log(`this.configDev.loadURL(window);`)
        console.log(error)
      }
    }

    window.show();

    // Create a global shortcut to go back on command and left arrow
    globalShortcut.register('CommandOrControl+Left', () => {
      if (window.webContents.canGoBack()) window.webContents.goBack();
    });

    // Create a global shortcut to go forward on command and right arrow
    globalShortcut.register('CommandOrControl+Right', () => {
      if (window.webContents.canGoForward()) window.webContents.goForward();
    });

    return window;
  }

  onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  onActivate() {
    if (!this.window) {
      this.createWindow();
    }
  }

}

export default Main;
