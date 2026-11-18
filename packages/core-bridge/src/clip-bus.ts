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
}

export type ClipBusListener = (msg: ClipBusMessage) => void;

export class UniversalClipBus {
  private channel: BroadcastChannel | null = null;
  private listeners = new Set<ClipBusListener>();

  constructor() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('mecraft-clipbus');
        this.channel.onmessage = (event) => {
          if (event.data && typeof event.data === 'object') {
            const msg = event.data as ClipBusMessage;
            // Clean up from pending local storage so reload won't re-import
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
    const fullMsg: ClipBusMessage = {
      ...msg,
      id: `clip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };

    // 1. BroadcastChannel for instant live messaging between tabs
    if (this.channel) {
      try {
        this.channel.postMessage(fullMsg);
      } catch (e) {
        console.warn('[UniversalClipBus] BroadcastChannel postMessage error:', e);
      }
    }

    // 2. LocalStorage persistence for cold start / cross-window pickup (capped to latest 3)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const key = `mecraft:clipbus:${fullMsg.targetApp}`;
        const existing = window.localStorage.getItem(key);
        const list: ClipBusMessage[] = existing ? JSON.parse(existing) : [];
        list.push(fullMsg);
        try {
          window.localStorage.setItem(key, JSON.stringify(list.slice(-3)));
        } catch {
          // In case of quota exceeded, keep strictly the latest message
          window.localStorage.setItem(key, JSON.stringify([fullMsg]));
        }
      }
    } catch (e) {
      console.warn('[UniversalClipBus] LocalStorage save error:', e);
    }

    // 3. Notify internal in-memory listeners
    this.notifyListeners(fullMsg);

    return fullMsg;
  }

  public removePendingMessage(targetApp: AppId, messageId: string): void {
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
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const key = `mecraft:clipbus:${targetApp}`;
        const existing = window.localStorage.getItem(key);
        if (existing) {
          window.localStorage.removeItem(key);
          return JSON.parse(existing);
        }
      }
    } catch (e) {
      console.warn('[UniversalClipBus] consumePending error:', e);
    }
    return [];
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
