/**
 * @file StudioGateway.ts
 * Cross-App IPC Dispatcher for meDrop
 * Transfers dropped files seamlessly into meCraft Creative Studios
 */

import { clipBus, createLauncherBridge } from '@mecraft/core-bridge';
import type { DraggedFileInfo, RadialWedgeAction } from '../types/radial-types.js';

export class StudioGateway {
  public static async dispatchToStudio(
    action: RadialWedgeAction,
    info: DraggedFileInfo
  ): Promise<boolean> {
    if (!action.studioAppId || !info.file) return false;

    try {
      const dataUrl = await this.fileToDataUrl(info.file);

      // 1. Send data package through ClipBus memory pipeline
      clipBus.send({
        sourceApp: 'medrop',
        targetApp: action.studioAppId,
        type: info.category === 'image' ? 'image-page' : 'document',
        dataUrl,
        name: info.name,
      });

      // 2. Launch target studio desktop application
      const bridge = createLauncherBridge();
      await bridge.launchApp({
        appId: action.studioAppId,
        args: info.filePath ? [info.filePath] : [],
      });

      return true;
    } catch (err) {
      console.error('[StudioGateway] Failed to dispatch to studio:', err);
      return false;
    }
  }

  private static async fileToDataUrl(file: File): Promise<string> {
    if (typeof FileReader !== 'undefined') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file as DataURL'));
        reader.readAsDataURL(file);
      });
    }

    // Universal fallback for Node / Vitest environments without FileReader
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = typeof btoa !== 'undefined' ? btoa(binary) : Buffer.from(bytes).toString('base64');
    const mime = file.type || 'application/octet-stream';
    return `data:${mime};base64,${base64}`;
  }
}
