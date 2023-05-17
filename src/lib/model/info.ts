import type { OsType, Arch } from '@tauri-apps/api/os';

export async function getVersion(): Promise<string | 'Unknown'> {
  const { getVersion } = await import('@tauri-apps/api/app');
  return getVersion?.() ?? 'Unknown';
}

export async function getOS(): Promise<OsType | 'Unknown'> {
  const { type } = await import('@tauri-apps/api/os');
  return type?.() ?? 'Unknown';
}

export async function getArch(): Promise<Arch | 'Unknown'> {
  const { arch } = await import('@tauri-apps/api/os');
  return arch?.() ?? 'Unknown';
}
