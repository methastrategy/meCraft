import { Channel, invoke } from '@tauri-apps/api/core';

export type LauncherUpdateEvent =
  | { status: 'checking' | 'installing' | 'current' }
  | { status: 'downloading'; downloaded: number; total: number };

export async function runLauncherUpdate(onProgress: (event: LauncherUpdateEvent) => void): Promise<void> {
  const onEvent = new Channel<LauncherUpdateEvent>();
  onEvent.onmessage = onProgress;
  await invoke('update_launcher', { onEvent });
}

export async function takeLauncherUpdateResult(): Promise<string | null> {
  return invoke<string | null>('take_launcher_update_result');
}

export async function clearLauncherUpdateResult(): Promise<void> {
  await invoke('clear_launcher_update_result');
}
