import { describe, it, expect, vi } from 'vitest';
import { UniversalClipBus, clipBus } from '../src/clip-bus';

describe('UniversalClipBus Cross-App Pipeline', () => {
  it('instantiates global singleton instance', () => {
    expect(clipBus).toBeDefined();
    expect(typeof clipBus.send).toBe('function');
    expect(typeof clipBus.subscribe).toBe('function');
    expect(typeof clipBus.consumePending).toBe('function');
  });

  it('broadcasts messages to subscribers', () => {
    const bus = new UniversalClipBus();
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
    const bus = new UniversalClipBus();

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
    const bus = new UniversalClipBus();
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
});
