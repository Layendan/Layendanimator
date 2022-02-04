import { BrowserWindow, app } from "electron";
import { AppUpdater, autoUpdater } from "electron-updater";
import { SendChannels } from "./General/channelsInterface";
import IPC from "./General/IPC";

const nameAPI = "updaterInfo";

// to Main
const validSendChannel: SendChannels = {
    "requestVersionNumber": requestVersionNumber,
    "checkForUpdate": checkForUpdate,
    "startDownloadUpdate": startDownloadUpdate,
    "quitAndInstall": quitAndInstall,
};

// from Main
const validReceiveChannel: string[] = [
    "getVersionNumber",
    "checkingForUpdate",
    "updateAvailable",
    "updateNotAvailable",
    "downloadProgress",
    "updateDownloaded",
];

class UpdaterInfo extends IPC {
    initAutoUpdater(autoUpdater: AppUpdater, mainWindow: BrowserWindow) {
        initAutoUpdater(autoUpdater, mainWindow);
    }
}

const updaterInfo = new UpdaterInfo ({
    nameAPI,
    validSendChannel,
    validReceiveChannel
});

export default updaterInfo;

// Enter here the functions for ElectronJS

function initAutoUpdater(autoUpdater: AppUpdater, mainWindow: BrowserWindow) {
    autoUpdater.on('checking-for-update', () => {
        mainWindow.webContents.send("checkingForUpdate", null);
    });

    autoUpdater.on('error', (err) => { });

    autoUpdater.on("update-available", (info: any) => {
        mainWindow.webContents.send("updateAvailable", info);
    });
        
    autoUpdater.on('download-progress', (info: any) => {
        mainWindow.webContents.send("downloadProgress", info);
    });

    autoUpdater.on("update-downloaded", (info: any) => {
        mainWindow.webContents.send("updateDownloaded", info);
    });

    autoUpdater.on("update-not-available", (info: any) => {
        mainWindow.webContents.send("updateNotAvailable", info);
    });
}

function requestVersionNumber(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: any) {
    const version = app.getVersion();
    const result = {version};
    mainWindow.webContents.send("getVersionNumber", result);
}

function checkForUpdate(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: any) {
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdates();
}

function startDownloadUpdate(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: any) {
    autoUpdater.downloadUpdate();
}

function quitAndInstall(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: any) {
    autoUpdater.quitAndInstall();
}






  




