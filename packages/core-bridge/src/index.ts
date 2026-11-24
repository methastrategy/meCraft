/**
 * @mecraft/core-bridge
 * Cross-app process communication, app catalog types, and launcher IPC contracts.
 */

export * from './clip-bus';
export * from './auth';
export * from './updater';
import { clipBus } from './clip-bus';

export type AppId = 'mepdf' | 'mephoto' | 'mevector' | 'medoc' | string;

export type AppInstallStatus =
  | 'not-installed'
  | 'installing'
  | 'installed'
  | 'updating'
  | 'error';

export interface AppCatalogItem {
  id: AppId;
  name: string;
  tagline: string;
  description: string;
  version: string;
  tags: string[];
  category: 'document' | 'graphics' | 'writing' | 'utilities';
  icon: string;
  color: string;
  accentGlow: string;
  exeName: string;
  releaseAssetPattern: string;
  status: AppInstallStatus;
  installedPath?: string;
  installedVersion?: string;
  sizeFormatted?: string;
  comingSoon?: boolean;
  inDevelopment?: boolean;
}

export interface DownloadProgress {
  appId: AppId;
  downloadedBytes: number;
  totalBytes: number;
  percent: number;
  speedBps: number;
  speedFormatted?: string;
  etaSeconds?: number;
}

export interface RecentProject {
  id: string;
  name: string;
  path: string;
  appId: AppId;
  lastOpened: number;
  sizeBytes?: number;
  fileType: string;
}

export interface AppStatusResult {
  appId: AppId;
  installed: boolean;
  version?: string;
  exePath?: string;
  sizeBytes?: number;
}

export interface LaunchAppOptions {
  appId: AppId;
  args?: string[];
  filePath?: string;
  dataUrl?: string;
  target?: 'web' | 'desktop';
}

export interface LauncherBridge {
  isTauri(): boolean;
  checkAppStatus(appId: AppId): Promise<AppStatusResult>;
  downloadAndInstallApp(
    appId: AppId,
    releaseUrl: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<{ success: boolean; installedPath: string; error?: string }>;
  launchApp(options: LaunchAppOptions): Promise<{ success: boolean; error?: string }>;
  getAppDirectory(appId: AppId): Promise<string>;
  uninstallApp(appId: AppId): Promise<{ success: boolean }>;
  getRecentProjects(): Promise<RecentProject[]>;
  saveRecentProject(project: Omit<RecentProject, 'id' | 'lastOpened'>): Promise<RecentProject>;
  clearRecentProjects(): Promise<void>;
}

/**
 * Format raw bytes into human readable binary units (KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeI = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, safeI)).toFixed(dm))} ${sizes[safeI]}`;
}

/**
 * Format bytes per second into human readable speed (e.g. 3.5 MB/s)
 */
export function formatSpeed(bps: number): string {
  if (bps <= 0) return '0 KB/s';
  return `${formatBytes(bps)}/s`;
}

/**
 * Default Catalog of meCraft Ecosystem Apps
 */
export function getDefaultCatalog(): AppCatalogItem[] {
  return [
    {
      id: 'mepdf',
      name: 'mePDF Studio',
      tagline: 'Professional Pure Client-Side PDF Engineering Studio',
      description:
        'High-performance document cockpit with client-side merge, split, lossless/scanned compression, AES-256 encryption, and instant vector rendering.',
      version: '1.0.0',
      tags: ['PDF', 'Merge', 'Split', 'Compress', 'AES-256'],
      category: 'document',
      icon: 'FileText',
      color: '#6366f1',
      accentGlow: 'rgba(99, 102, 241, 0.35)',
      exeName: 'mepdf.exe',
      releaseAssetPattern: 'mepdf-windows-x64.zip',
      status: 'not-installed',
      sizeFormatted: '~42 MB',
    },
    {
      id: 'mephoto',
      name: 'mePhoto Studio',
      tagline: 'CamScanner-Grade Document Enhancer & Non-Destructive Photo Studio',
      description:
        'Adaptive Otsu document binarization, Magic Color enhancement, sub-pixel unsharp mask, fine deskew, perspective crop, and multi-format batch export.',
      version: '1.0.0',
      tags: ['Photo', 'Magic Color', 'Deskew', 'Otsu B&W'],
      category: 'graphics',
      icon: 'Camera',
      color: '#06b6d4',
      accentGlow: 'rgba(6, 182, 212, 0.35)',
      exeName: 'mephoto.exe',
      releaseAssetPattern: 'mephoto-windows-x64.zip',
      status: 'not-installed',
      sizeFormatted: '~38 MB',
    },
    {
      id: 'mevector',
      name: 'meVector',
      tagline: 'Vector Illustration & SVG/PDF Graphic Workbench',
      description:
        'Precision Bézier vector editing, node pen, path boolean operations, and ultra-crisp resolution-independent vector export.',
      version: '1.0.0',
      tags: ['Vector', 'Bezier', 'SVG', 'Pen'],
      category: 'graphics',
      icon: 'PenTool',
      color: '#f43f5e',
      accentGlow: 'rgba(244, 63, 94, 0.35)',
      exeName: 'mevector.exe',
      releaseAssetPattern: 'mevector.exe',
      status: 'not-installed',
      sizeFormatted: '~45 MB',
      comingSoon: true,
    },
    {
      id: 'medoc',
      name: 'meDoc',
      tagline: 'Distraction-Free Typewriter & Markdown Document Suite',
      description:
        'Zen focus typography, live LaTeX math equations, offline bilingual grammar assistance, and instant publication export.',
      version: '1.0.0',
      tags: ['Markdown', 'Typography', 'LaTeX', 'Focus'],
      category: 'writing',
      icon: 'BookOpen',
      color: '#10b981',
      accentGlow: 'rgba(16, 185, 129, 0.35)',
      exeName: 'medoc.exe',
      releaseAssetPattern: 'medoc.exe',
      status: 'not-installed',
      sizeFormatted: '~30 MB',
      inDevelopment: true,
    },
  ];
}

export const STORAGE_KEYS = {
  RECENT_PROJECTS: 'mecraft:launcher:recent-projects',
  INSTALLED_APPS: 'mecraft:launcher:installed-apps',
  SETTINGS: 'mecraft:launcher:settings',
} as const;

// In-memory fallback storage when localStorage is unavailable (Node / SSR)
const memoryStore = new Map<string, string>();

function getStorageItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {}
  return memoryStore.get(key) ?? null;
}

function setStorageItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch {}
  memoryStore.set(key, value);
}

function removeStorageItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }
  } catch {}
  memoryStore.delete(key);
}

function clearAllStorage(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  } catch {}
  memoryStore.clear();
}

export { clearAllStorage };

/**
 * Create a universal Launcher Bridge client supporting Tauri desktop and Web fallback
 */
export function createLauncherBridge(): LauncherBridge {
  const isTauriEnv =
    typeof window !== 'undefined' &&
    ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);

  return {
    isTauri(): boolean {
      return isTauriEnv;
    },

    async checkAppStatus(appId: AppId): Promise<AppStatusResult> {
      if (isTauriEnv) {
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          return await invoke<AppStatusResult>('check_app_status', { appId });
        } catch (e) {
          console.warn(`[LauncherBridge] Tauri check_app_status failed for ${appId}:`, e);
        }
      }

      // Web/Mock Fallback Mode
      try {
        const raw = getStorageItem(STORAGE_KEYS.INSTALLED_APPS);
        const map = raw ? JSON.parse(raw) : {};
        if (map[appId]) {
          return {
            appId,
            installed: true,
            version: map[appId].version || '1.0.0',
            exePath: map[appId].exePath || `C:\\Users\\User\\AppData\\Local\\meCraft\\apps\\${appId}\\${appId}.exe`,
            sizeBytes: map[appId].sizeBytes || 45000000,
          };
        }
      } catch (err) {
        console.warn('[LauncherBridge] Storage fallback read failed:', err);
      }

      return {
        appId,
        installed: false,
        version: undefined,
        exePath: undefined,
        sizeBytes: 0,
      };
    },

    async downloadAndInstallApp(
      appId: AppId,
      releaseUrl: string,
      onProgress?: (progress: DownloadProgress) => void
    ): Promise<{ success: boolean; installedPath: string; error?: string }> {
      if (isTauriEnv) {
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          const { listen } = await import('@tauri-apps/api/event');

          let unlisten: (() => void) | undefined;
          if (onProgress) {
            unlisten = await listen<DownloadProgress>('download-progress', (event) => {
              if (event.payload.appId === appId) {
                onProgress(event.payload);
              }
            });
          }

          try {
            const installedPath = await invoke<string>('download_and_install_app', {
              appId,
              releaseUrl,
            });
            return { success: true, installedPath };
          } finally {
            if (unlisten) unlisten();
          }
        } catch (e: any) {
          return {
            success: false,
            installedPath: '',
            error: e?.message || String(e),
          };
        }
      }

      // Simulated Browser Download & Installation Fallback
      const totalBytes = 48 * 1024 * 1024;
      let downloaded = 0;
      const stepBytes = 3 * 1024 * 1024;
      const speed = 12 * 1024 * 1024; // 12 MB/s

      while (downloaded < totalBytes) {
        await new Promise((r) => setTimeout(r, 60));
        downloaded = Math.min(totalBytes, downloaded + stepBytes);
        const percent = Math.round((downloaded / totalBytes) * 100);
        if (onProgress) {
          onProgress({
            appId,
            downloadedBytes: downloaded,
            totalBytes,
            percent,
            speedBps: speed,
            speedFormatted: formatSpeed(speed),
            etaSeconds: Math.ceil((totalBytes - downloaded) / speed),
          });
        }
      }

      // Persist to Web mock
      try {
        const raw = getStorageItem(STORAGE_KEYS.INSTALLED_APPS);
        const map = raw ? JSON.parse(raw) : {};
        map[appId] = {
          version: '1.0.0',
          installedAt: Date.now(),
          exePath: `C:\\Users\\User\\AppData\\Local\\meCraft\\apps\\${appId}\\${appId}.exe`,
          sizeBytes: totalBytes,
        };
        setStorageItem(STORAGE_KEYS.INSTALLED_APPS, JSON.stringify(map));
      } catch (e) {
        console.error('[LauncherBridge] Failed to save mock app install:', e);
      }

      return {
        success: true,
        installedPath: `C:\\Users\\User\\AppData\\Local\\meCraft\\apps\\${appId}\\${appId}.exe`,
      };
    },

    async launchApp(options: LaunchAppOptions): Promise<{ success: boolean; error?: string }> {
      const { appId, args = [], filePath, dataUrl, target } = options;
      const launchArgs = [...args];
      if (filePath) {
        launchArgs.push(filePath);
      }

      if (isTauriEnv && target !== 'web') {
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          const launched = await invoke<boolean>('launch_app', {
            appId,
            args: launchArgs,
          });
          return { success: launched };
        } catch (e: any) {
          return { success: false, error: e?.message || String(e) };
        }
      }

      // Web Fallback: open target web studio in browser tab/window
      let targetUrl = '';
      if (typeof window !== 'undefined') {
        const isLocalhost = Boolean(
          window.location &&
          (window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '0.0.0.0' ||
           window.location.hostname.endsWith('.local'))
        );

        let baseUrl = `/${appId}/`;
        if (isLocalhost) {
          if (appId === 'mepdf') {
            baseUrl = 'http://localhost:5173/';
          } else if (appId === 'mephoto') {
            baseUrl = 'http://localhost:5174/';
          }
        }

        try {
          const origin = window.location && window.location.origin ? window.location.origin : 'http://localhost:5175';
          const resolved = new URL(baseUrl, origin);

          const activeDataUrl = dataUrl || (filePath && filePath.startsWith('data:') ? filePath : undefined);
          if (activeDataUrl) {
            try {
              clipBus.send({
                sourceApp: 'launcher',
                targetApp: appId,
                type: appId === 'mepdf' ? (activeDataUrl.startsWith('data:application/pdf') ? 'document' : 'image-page') : 'image-page',
                dataUrl: activeDataUrl,
                name: filePath && !filePath.startsWith('data:') ? filePath.split(/[/\\]/).pop() : `Import_${Date.now()}`,
              });
            } catch (busErr) {
              console.warn('[LauncherBridge] ClipBus relay warning:', busErr);
            }
          }

          if (filePath && !filePath.startsWith('data:')) {
            resolved.searchParams.set('filePath', filePath);
          }

          targetUrl = resolved.toString();
          if (typeof window.open === 'function') {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
          }
        } catch (err) {
          console.warn('[LauncherBridge:WebFallback] URL resolution error:', err);
        }
      }

      console.info(`[LauncherBridge:WebFallback] Launching ${appId} with args:`, launchArgs, `url: ${targetUrl}`);
      return { success: true };
    },

    async getAppDirectory(appId: AppId): Promise<string> {
      if (isTauriEnv) {
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          return await invoke<string>('get_app_directory', { appId });
        } catch (e) {
          console.warn('[LauncherBridge] getAppDirectory failed:', e);
        }
      }
      return `C:\\Users\\User\\AppData\\Local\\meCraft\\apps\\${appId}`;
    },

    async uninstallApp(appId: AppId): Promise<{ success: boolean }> {
      if (isTauriEnv) {
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          await invoke('uninstall_app', { appId });
          return { success: true };
        } catch (e) {
          console.warn('[LauncherBridge] uninstallApp failed:', e);
        }
      }

      try {
        const raw = getStorageItem(STORAGE_KEYS.INSTALLED_APPS);
        if (raw) {
          const map = JSON.parse(raw);
          delete map[appId];
          setStorageItem(STORAGE_KEYS.INSTALLED_APPS, JSON.stringify(map));
        }
      } catch (e) {
        console.error('[LauncherBridge] Failed to delete mock app install:', e);
      }
      return { success: true };
    },

    async getRecentProjects(): Promise<RecentProject[]> {
      try {
        const raw = getStorageItem(STORAGE_KEYS.RECENT_PROJECTS);
        if (!raw) return [];
        return JSON.parse(raw);
      } catch {
        return [];
      }
    },

    async saveRecentProject(
      project: Omit<RecentProject, 'id' | 'lastOpened'>
    ): Promise<RecentProject> {
      const list = await this.getRecentProjects();
      const existingIdx = list.findIndex(
        (p) => p.path === project.path && p.appId === project.appId
      );

      const item: RecentProject = {
        ...project,
        id: existingIdx >= 0 && list[existingIdx] ? list[existingIdx]!.id : `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        lastOpened: Date.now(),
      };

      let updated: RecentProject[];
      if (existingIdx >= 0) {
        updated = [item, ...list.filter((_, idx) => idx !== existingIdx)];
      } else {
        updated = [item, ...list].slice(0, 30); // keep max 30
      }

      try {
        setStorageItem(STORAGE_KEYS.RECENT_PROJECTS, JSON.stringify(updated));
      } catch (e) {
        console.warn('[LauncherBridge] Failed to save recent project:', e);
      }

      return item;
    },

    async clearRecentProjects(): Promise<void> {
      try {
        removeStorageItem(STORAGE_KEYS.RECENT_PROJECTS);
      } catch (e) {
        console.warn('[LauncherBridge] Failed to clear recent projects:', e);
      }
    },
  };
}
