import type { AppId } from './index';

export interface ClipBusMessage {
  id: string;
  sourceApp: AppId;
  targetApp: AppId;
  type: 'image-page' | 'document' | 'text';
  dataUrl?: string;
  blobBytes?: number[];
  name?: string;
  timestamp: number;
  storedInIndexedDb?: boolean;
}

export type ClipBusListener = (msg: ClipBusMessage) => void;

export const IDB_NAME = 'mecraft_clipbus_blobs';
export const IDB_STORE = 'blobs';

export function openClipBusIdb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function saveLargePayloadToIdb(
  id: string,
  payload: { dataUrl?: string; blobBytes?: number[] }
): Promise<boolean> {
  const db = await openClipBusIdb();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.put({ id, ...payload, timestamp: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export async function getLargePayloadFromIdb(
  id: string
): Promise<{ dataUrl?: string; blobBytes?: number[] } | null> {
  const db = await openClipBusIdb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(id);
      req.onsuccess = () => {
        const val = req.result;
        if (val) {
          // Auto-delete upon consumption
          store.delete(id);
          resolve(val);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function deleteLargePayloadFromIdb(id: string): Promise<boolean> {
  const db = await openClipBusIdb();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export async function cleanStaleBlobsFromIdb(maxAgeMs = 24 * 60 * 60 * 1000): Promise<number> {
  const db = await openClipBusIdb();
  if (!db) return 0;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.openCursor();
      let cleaned = 0;
      const now = Date.now();
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          const val = cursor.value;
          if (val && val.timestamp && now - val.timestamp > maxAgeMs) {
            cursor.delete();
            cleaned++;
          }
          cursor.continue();
        } else {
          resolve(cleaned);
        }
      };
      req.onerror = () => resolve(0);
    } catch {
      resolve(0);
    }
  });
}

export class UniversalClipBus {
  private channel: BroadcastChannel | null = null;
  private listeners = new Set<ClipBusListener>();

  constructor() {
    // Automatically prune any stale/orphaned blobs in background
    cleanStaleBlobsFromIdb().catch(() => {});

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('mecraft-clipbus');
        this.channel.onmessage = (event) => {
          if (event.data && typeof event.data === 'object') {
            const msg = event.data as ClipBusMessage;
            if (msg.targetApp && msg.id) {
              this.removePendingMessage(msg.targetApp, msg.id);
            }
            this.notifyListeners(msg);
          }
        };
      } catch (e) {
        console.warn('[UniversalClipBus] BroadcastChannel not supported:', e);
      }
    }
  }

  public send(msg: Omit<ClipBusMessage, 'id' | 'timestamp'>): ClipBusMessage {
    const isLarge = (msg.dataUrl?.length ?? 0) > 100 * 1024 || (msg.blobBytes?.length ?? 0) > 50 * 1024;
    const fullMsg: ClipBusMessage = {
      ...msg,
      id: `clip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      storedInIndexedDb: isLarge,
    };

    // 1. Asynchronously offload large payload to IndexedDB for cold-start pickup
    if (isLarge && (msg.dataUrl || msg.blobBytes)) {
      saveLargePayloadToIdb(fullMsg.id, {
        dataUrl: msg.dataUrl,
        blobBytes: msg.blobBytes,
      }).catch((e) => {
        console.warn('[UniversalClipBus] IndexedDB offload error:', e);
      });
    }

    // 2. BroadcastChannel for instant live messaging between tabs (carries full payload in RAM)
    if (this.channel) {
      try {
        this.channel.postMessage(fullMsg);
      } catch (e) {
        console.warn('[UniversalClipBus] BroadcastChannel postMessage error:', e);
      }
    }

    // 3. LocalStorage persistence for cold start / cross-window pickup
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const key = `mecraft:clipbus:${fullMsg.targetApp}`;
        const existing = window.localStorage.getItem(key);
        const list: ClipBusMessage[] = existing ? JSON.parse(existing) : [];

        // In localStorage, store trimmed metadata if offloaded to IndexedDB to never exceed 5MB quota
        const storageMsg: ClipBusMessage = isLarge
          ? { ...fullMsg, dataUrl: undefined, blobBytes: undefined }
          : fullMsg;

        list.push(storageMsg);
        try {
          window.localStorage.setItem(key, JSON.stringify(list.slice(-3)));
        } catch {
          window.localStorage.setItem(key, JSON.stringify([storageMsg]));
        }
      }
    } catch (e) {
      console.warn('[UniversalClipBus] LocalStorage save error:', e);
    }

    // 4. Notify internal in-memory listeners
    this.notifyListeners(fullMsg);

    return fullMsg;
  }

  public async sendAsync(msg: Omit<ClipBusMessage, 'id' | 'timestamp'>): Promise<ClipBusMessage> {
    const isLarge = (msg.dataUrl?.length ?? 0) > 100 * 1024 || (msg.blobBytes?.length ?? 0) > 50 * 1024;
    const fullMsg: ClipBusMessage = {
      ...msg,
      id: `clip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      storedInIndexedDb: isLarge,
    };

    if (isLarge && (msg.dataUrl || msg.blobBytes)) {
      await saveLargePayloadToIdb(fullMsg.id, {
        dataUrl: msg.dataUrl,
        blobBytes: msg.blobBytes,
      }).catch((e) => {
        console.warn('[UniversalClipBus] IndexedDB offload error:', e);
      });
    }

    if (this.channel) {
      try {
        this.channel.postMessage(fullMsg);
      } catch (e) {
        console.warn('[UniversalClipBus] BroadcastChannel postMessage error:', e);
      }
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const key = `mecraft:clipbus:${fullMsg.targetApp}`;
        const existing = window.localStorage.getItem(key);
        const list: ClipBusMessage[] = existing ? JSON.parse(existing) : [];

        const storageMsg: ClipBusMessage = isLarge
          ? { ...fullMsg, dataUrl: undefined, blobBytes: undefined }
          : fullMsg;

        list.push(storageMsg);
        try {
          window.localStorage.setItem(key, JSON.stringify(list.slice(-3)));
        } catch {
          window.localStorage.setItem(key, JSON.stringify([storageMsg]));
        }
      }
    } catch (e) {
      console.warn('[UniversalClipBus] LocalStorage save error:', e);
    }

    this.notifyListeners(fullMsg);
    return fullMsg;
  }

  public removePendingMessage(targetApp: AppId, messageId: string): void {
    // Delete any associated blob in IndexedDB
    deleteLargePayloadFromIdb(messageId).catch(() => {});

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const key = `mecraft:clipbus:${targetApp}`;
        const existing = window.localStorage.getItem(key);
        if (existing) {
          const list: ClipBusMessage[] = JSON.parse(existing);
          const filtered = list.filter((m) => m.id !== messageId);
          if (filtered.length > 0) {
            window.localStorage.setItem(key, JSON.stringify(filtered));
          } else {
            window.localStorage.removeItem(key);
          }
        }
      }
    } catch (e) {
      console.warn('[UniversalClipBus] removePendingMessage error:', e);
    }
  }

  public consumePending(targetApp: AppId): ClipBusMessage[] {
    const keys = [`mecraft:clipbus:${targetApp}`];
    if (targetApp === 'medocs') {
      keys.push('mecraft:clipbus:medoc');
    } else if (targetApp === 'medoc') {
      keys.push('mecraft:clipbus:medocs');
    }
    const collected: ClipBusMessage[] = [];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        for (const key of keys) {
          const existing = window.localStorage.getItem(key);
          if (existing) {
            window.localStorage.removeItem(key);
            const parsed = JSON.parse(existing);
            if (Array.isArray(parsed)) collected.push(...parsed);
          }
        }
      }
    } catch (e) {
      console.warn('[UniversalClipBus] consumePending error:', e);
    }
    return collected;
  }

  public async consumePendingAsync(targetApp: AppId): Promise<ClipBusMessage[]> {
    const list = this.consumePending(targetApp);
    for (const msg of list) {
      if (msg.storedInIndexedDb) {
        const blobData = await getLargePayloadFromIdb(msg.id);
        if (blobData) {
          if (blobData.dataUrl) msg.dataUrl = blobData.dataUrl;
          if (blobData.blobBytes) msg.blobBytes = blobData.blobBytes;
        }
      }
    }
    return list;
  }

  public close(): void {
    if (this.channel) {
      try {
        this.channel.close();
      } catch {}
      this.channel = null;
    }
    this.listeners.clear();
  }

  public subscribe(listener: ClipBusListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(msg: ClipBusMessage) {
    this.listeners.forEach((fn) => {
      try {
        fn(msg);
      } catch (err) {
        console.error('[UniversalClipBus] Listener error:', err);
      }
    });
  }
}

export const clipBus = new UniversalClipBus();
