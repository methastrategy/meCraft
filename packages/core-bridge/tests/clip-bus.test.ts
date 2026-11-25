import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  UniversalClipBus,
  clipBus,
  saveLargePayloadToIdb,
  getLargePayloadFromIdb,
  deleteLargePayloadFromIdb,
  cleanStaleBlobsFromIdb,
  IDB_NAME,
  IDB_STORE,
} from '../src/clip-bus';

function createMockIndexedDB() {
  const stores = new Map<string, Map<string, any>>();
  return {
    open(name: string, _version: number) {
      const req: any = {};
      setTimeout(() => {
        const db: any = {
          objectStoreNames: {
            contains: (sName: string) => stores.has(sName),
          },
          createObjectStore(sName: string) {
            stores.set(sName, new Map());
            return {};
          },
          transaction(sName: string, _mode: string) {
            if (!stores.has(sName)) stores.set(sName, new Map());
            const storeMap = stores.get(sName)!;
            const tx: any = {};
            const store: any = {
              put(val: any) {
                storeMap.set(val.id, val);
              },
              get(key: string) {
                const getReq: any = {};
                setTimeout(() => {
                  getReq.result = storeMap.get(key) || null;
                  getReq.onsuccess?.();
                }, 0);
                return getReq;
              },
              delete(key: string) {
                storeMap.delete(key);
                const delReq: any = {};
                setTimeout(() => {
                  delReq.result = undefined;
                  delReq.onsuccess?.();
                }, 0);
                return delReq;
              },
              openCursor() {
                const curReq: any = {};
                setTimeout(() => {
                  const entries = Array.from(storeMap.entries());
                  let idx = 0;
                  function step() {
                    if (idx < entries.length) {
                      const [k, v] = entries[idx++];
                      curReq.result = {
                        value: v,
                        delete: () => storeMap.delete(k),
                        continue: () => step(),
                      };
                    } else {
                      curReq.result = null;
                    }
                    curReq.onsuccess?.();
                  }
                  step();
                }, 0);
                return curReq;
              },
            };
            tx.objectStore = () => store;
            setTimeout(() => {
              tx.oncomplete?.();
            }, 0);
            return tx;
          },
        };
        req.result = db;
        req.onupgradeneeded?.();
        req.onsuccess?.();
      }, 0);
      return req;
    },
    _stores: stores,
  };
}

describe('UniversalClipBus Cross-App Pipeline', () => {
  let buses: UniversalClipBus[] = [];

  function makeBus(): UniversalClipBus {
    const b = new UniversalClipBus();
    buses.push(b);
    return b;
  }

  afterEach(() => {
    for (const b of buses) {
      b.close();
    }
    buses = [];
    clipBus.close();
  });
  it('instantiates global singleton instance', () => {
    expect(clipBus).toBeDefined();
    expect(typeof clipBus.send).toBe('function');
    expect(typeof clipBus.subscribe).toBe('function');
    expect(typeof clipBus.consumePending).toBe('function');
  });

  it('broadcasts messages to subscribers', () => {
    const bus = makeBus();
    const received: any[] = [];

    const unsubscribe = bus.subscribe((msg) => {
      received.push(msg);
    });

    const sent = bus.send({
      sourceApp: 'mephoto',
      targetApp: 'mepdf',
      type: 'image-page',
      dataUrl: 'data:image/jpeg;base64,sample123',
      name: 'Scan_001.jpg',
    });

    expect(received).toHaveLength(1);
    expect(received[0].id).toBe(sent.id);
    expect(received[0].sourceApp).toBe('mephoto');
    expect(received[0].targetApp).toBe('mepdf');
    expect(received[0].dataUrl).toBe('data:image/jpeg;base64,sample123');

    unsubscribe();

    bus.send({
      sourceApp: 'mephoto',
      targetApp: 'mepdf',
      type: 'text',
      dataUrl: 'test',
    });

    // Should not receive second message after unsubscribe
    expect(received).toHaveLength(1);
  });

  it('manages pending messages and supports removal by ID', () => {
    const bus = makeBus();

    const mockStorage: Record<string, string> = {};
    const originalWindow = (globalThis as any).window;
    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => mockStorage[k] || null,
        setItem: (k: string, v: string) => { mockStorage[k] = v; },
        removeItem: (k: string) => { delete mockStorage[k]; },
      },
    };

    try {
      const msg1 = bus.send({
        sourceApp: 'mephoto',
        targetApp: 'mepdf',
        type: 'image-page',
        name: 'Page1.jpg',
      });

      const msg2 = bus.send({
        sourceApp: 'mephoto',
        targetApp: 'mepdf',
        type: 'image-page',
        name: 'Page2.jpg',
      });

      // Remove msg1 specifically
      bus.removePendingMessage('mepdf', msg1.id);

      const pending = bus.consumePending('mepdf');
      expect(pending).toHaveLength(1);
      expect(pending[0].id).toBe(msg2.id);

      // Consumed queue should now be empty
      expect(bus.consumePending('mepdf')).toHaveLength(0);
    } finally {
      (globalThis as any).window = originalWindow;
    }
  });

  it('marks large payloads >100KB with storedInIndexedDb flag and saves lightweight metadata in localStorage', () => {
    const bus = makeBus();
    const mockStorage: Record<string, string> = {};
    const originalWindow = (globalThis as any).window;
    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => mockStorage[k] || null,
        setItem: (k: string, v: string) => { mockStorage[k] = v; },
        removeItem: (k: string) => { delete mockStorage[k]; },
      },
    };

    try {
      const hugeDataUrl = 'data:image/jpeg;base64,' + 'A'.repeat(120 * 1024);
      const sent = bus.send({
        sourceApp: 'mephoto',
        targetApp: 'mepdf',
        type: 'image-page',
        dataUrl: hugeDataUrl,
        name: 'HugeScan.jpg',
      });

      expect(sent.storedInIndexedDb).toBe(true);

      const pending = bus.consumePending('mepdf');
      expect(pending).toHaveLength(1);
      expect(pending[0].id).toBe(sent.id);
      expect(pending[0].storedInIndexedDb).toBe(true);
      // DataUrl in localStorage was stripped to protect the 5MB quota
      expect(pending[0].dataUrl).toBeUndefined();
    } finally {
      (globalThis as any).window = originalWindow;
    }
  });

  describe('Hybrid IndexedDB Engine & Auto-Delete Lifecycle', () => {
    it('saves large payload to IndexedDB and automatically deletes upon consumption', async () => {
      const mockIdb = createMockIndexedDB();
      const originalIndexedDb = (globalThis as any).indexedDB;
      (globalThis as any).indexedDB = mockIdb;

      try {
        const payloadId = 'test_blob_123';
        const samplePayload = {
          dataUrl: 'data:image/png;base64,largeImageData123',
          blobBytes: [1, 2, 3, 4, 5],
        };

        const saved = await saveLargePayloadToIdb(payloadId, samplePayload);
        expect(saved).toBe(true);

        // First read: must return payload and delete it from IDB
        const retrieved = await getLargePayloadFromIdb(payloadId);
        expect(retrieved).not.toBeNull();
        expect(retrieved?.dataUrl).toBe(samplePayload.dataUrl);
        expect(retrieved?.blobBytes).toEqual([1, 2, 3, 4, 5]);

        // Second read: must be null because it was auto-deleted on consumption
        const secondRead = await getLargePayloadFromIdb(payloadId);
        expect(secondRead).toBeNull();
      } finally {
        (globalThis as any).indexedDB = originalIndexedDb;
      }
    });

    it('reconstructs message with large payload on consumePendingAsync and deletes blob', async () => {
      // Close module singleton channel to simulate cold-start (target app not yet opened)
      clipBus.close();

      const mockIdb = createMockIndexedDB();
      const originalIndexedDb = (globalThis as any).indexedDB;
      (globalThis as any).indexedDB = mockIdb;

      const mockStorage: Record<string, string> = {};
      const originalWindow = (globalThis as any).window;
      (globalThis as any).window = {
        localStorage: {
          getItem: (k: string) => mockStorage[k] || null,
          setItem: (k: string, v: string) => { mockStorage[k] = v; },
          removeItem: (k: string) => { delete mockStorage[k]; },
        },
      };

      try {
        const bus = makeBus();
        const hugeDataUrl = 'data:image/jpeg;base64,' + 'B'.repeat(120 * 1024);

        // Send async to ensure IDB save finishes
        const msg = await bus.sendAsync({
          sourceApp: 'mephoto',
          targetApp: 'mepdf',
          type: 'image-page',
          dataUrl: hugeDataUrl,
          name: 'AsyncScan.jpg',
        });

        expect(msg.storedInIndexedDb).toBe(true);

        // Async consumption should retrieve blob and restore dataUrl
        const consumed = await bus.consumePendingAsync('mepdf');
        expect(consumed).toHaveLength(1);
        expect(consumed[0].id).toBe(msg.id);
        expect(consumed[0].dataUrl).toBe(hugeDataUrl);

        // Further retrieval from IDB must be null (auto-deleted)
        const idbCheck = await getLargePayloadFromIdb(msg.id);
        expect(idbCheck).toBeNull();
      } finally {
        (globalThis as any).indexedDB = originalIndexedDb;
        (globalThis as any).window = originalWindow;
      }
    });

    it('cleans stale blobs older than maxAgeMs', async () => {
      const mockIdb = createMockIndexedDB();
      const originalIndexedDb = (globalThis as any).indexedDB;
      (globalThis as any).indexedDB = mockIdb;

      try {
        await saveLargePayloadToIdb('old_blob', { dataUrl: 'old' });
        // Alter timestamp in store
        const storeMap = mockIdb._stores.get(IDB_STORE);
        if (storeMap) {
          const old = storeMap.get('old_blob');
          if (old) old.timestamp = Date.now() - 48 * 3600 * 1000; // 48h ago
        }
        await saveLargePayloadToIdb('new_blob', { dataUrl: 'new' });

        const cleanedCount = await cleanStaleBlobsFromIdb(24 * 3600 * 1000);
        expect(cleanedCount).toBe(1);

        const checkOld = await getLargePayloadFromIdb('old_blob');
        expect(checkOld).toBeNull();

        const checkNew = await getLargePayloadFromIdb('new_blob');
        expect(checkNew?.dataUrl).toBe('new');
      } finally {
        (globalThis as any).indexedDB = originalIndexedDb;
      }
    });

    it('handles undefined indexedDB gracefully without errors', async () => {
      const originalIndexedDb = (globalThis as any).indexedDB;
      (globalThis as any).indexedDB = undefined;

      try {
        const saved = await saveLargePayloadToIdb('fail_blob', { dataUrl: 'test' });
        expect(saved).toBe(false);

        const got = await getLargePayloadFromIdb('fail_blob');
        expect(got).toBeNull();

        const del = await deleteLargePayloadFromIdb('fail_blob');
        expect(del).toBe(false);

        const clean = await cleanStaleBlobsFromIdb();
        expect(clean).toBe(0);
      } finally {
        (globalThis as any).indexedDB = originalIndexedDb;
      }
    });

    it('verifies mepdf and mephoto consume pending messages asynchronously to support large payloads', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const mepdfMain = fs.readFileSync(path.resolve(__dirname, '../../../apps/mepdf/src/main.ts'), 'utf8');
      const mephotoMain = fs.readFileSync(path.resolve(__dirname, '../../../apps/mephoto/src/main.ts'), 'utf8');

      expect(mepdfMain).toContain('clipBus.consumePendingAsync');
      expect(mephotoMain).toContain('clipBus.consumePendingAsync');
      expect(mephotoMain).toContain('clipBus.sendAsync');
    });
  });
});
