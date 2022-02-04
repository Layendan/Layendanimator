import { SendChannels } from "./General/channelsInterface";
import IPC from "./General/IPC";
import { app, BrowserWindow } from "electron";
import { access, writeFile, mkdir, readFile } from 'fs/promises';
import path from "path";


const nameAPI = "fileSystem";

// to Main
const validSendChannel: SendChannels = {
    "readFile": readFileTodos,
    "saveFile": saveFile
};

// from Main
const validReceiveChannel: string[] = [
    "getFile"
];

const fileSystem = new IPC ({
    nameAPI,
    validSendChannel,
    validReceiveChannel
});

export default fileSystem;

async function readFileTodos(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, fileName: any) {
    const fileExists = await checkFileTodosExists(fileName);
    if (!fileExists) {
        await createDir();
        const data = `[]`;
        await writeTodos(fileName, data);
    }
    const todos = await loadTodos(fileName);
    mainWindow.webContents.send("getFile", todos);
}

async function saveFile(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, data: { fileName: string, todo: string }) {
    const { fileName, todo } = {...data};
    console.log(fileName);
    console.log(todo);

    const fileExists = await checkFileTodosExists(fileName);
    if (!fileExists) {
        await createDir();
    }
    await writeTodos(fileName, todo);
}

async function checkFileTodosExists(fileName:string) {
    const userData = app.getPath('userData');
    const pathFile = path.join(userData, 'todos' ,fileName);
    try {
        await access(pathFile);
        return true;
    } catch (error) {
        console.log("DOES NOT exist:", pathFile);
        console.error(error);
        return false;
    }
}

async function writeTodos(fileName: string, data: string) {
    const userData = app.getPath('userData');
    const pathFile = path.join(userData, 'todos' ,fileName);
    try {
        await writeFile(pathFile, data);
    } catch (error) {
        console.log("await writeFile(pathFile, data);", pathFile);
        console.error(error);
    }
}

async function createDir() {
    const userData = app.getPath('userData');
    const pathDir = path.join(userData, 'todos');
    let dirExists = false;
    try {
        await access(pathDir);
        dirExists = true;
    } catch (error) {
        // The check failed
        console.log("DOES NOT exist:", pathDir);
        console.error(error);
        dirExists = false;
    }

    if (!dirExists) {
        try {
            await mkdir(pathDir);
        } catch (error) {
            console.log(" await mkdir(pathDir);", pathDir);
            console.error(error);
        }
    }
}


async function loadTodos(fileName: string) {
    const userData = app.getPath('userData');
    const pathDir = path.join(userData, 'todos', fileName);
    let result = [];
    try {
        const rawData = await readFile(pathDir, 'utf-8');
        result = JSON.parse(rawData);
    } catch (err) {
        console.error(err);
    }

    return result;
}