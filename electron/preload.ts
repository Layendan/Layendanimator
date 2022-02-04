import { generateContextBridge } from "./IPC/General/contextBridge"

import systemInfo from './IPC/systemInfo';
import updaterInfo from './IPC/updaterInfo';
import fileSystem from './IPC/fileSystem';

generateContextBridge([systemInfo, updaterInfo, fileSystem]);
