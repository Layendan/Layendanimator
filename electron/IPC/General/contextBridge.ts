import { contextBridge, ipcRenderer } from "electron";
import { APIChannels } from "./channelsInterface";
import IPC from "./IPC";

interface APIContextBridge {
  send: (channel: string, data: any) => void;
  receive: (channel: string, func: (arg0: any) => void) => void;
}

export function generateContextBridge(listIPC: IPC[]) {

  let listChannels: APIChannels[] = [];
  listIPC.forEach(el => {
    listChannels.push(el.channels);
  });

  let listAPI: {[key: string]: APIContextBridge} = {};

  listChannels.forEach(el => {
    const api = getContextBridge(el);
    const name = el.nameAPI;
    listAPI[name] = {...api};
  });

  contextBridge.exposeInMainWorld("api", {
    ...listAPI
  });
}

function getContextBridge(obj: APIChannels): APIContextBridge {
  const { validReceiveChannel } = { ...obj };
  const validSendChannel = getArrayOfValidSendChannel(obj);

  return {
      send: (channel: string, data: any) => {
        // whitelist channels
        if (validSendChannel.includes(channel)) {
          ipcRenderer.send(channel, data);
        }
      },
      receive: (channel: string, func: (arg0: any) => void) => {
        if (validReceiveChannel.includes(channel)) {
          // Deliberately strip event as it includes `sender`
          ipcRenderer.on(channel, (event, ...args: [any]) => {func(...args);});
        }
      }
  }
};

function getArrayOfValidSendChannel(obj: APIChannels): string[] {
  const { validSendChannel } = { ...obj };
  let result: string[] = Object.keys(validSendChannel);
  return result;
}
