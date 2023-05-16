import { getVersion } from '@tauri-apps/api/app';
import { type, arch, type OsType, type Arch } from '@tauri-apps/api/os';

export async function getAppVersion(): Promise<string | 'Unknown'> {
  return getVersion?.() ?? 'Unknown';
}

export async function getOS(): Promise<OsType | 'Unknown'> {
  return type?.() ?? 'Unknown';
}

export async function getArch(): Promise<Arch | 'Unknown'> {
  return arch?.() ?? 'Unknown';
}
