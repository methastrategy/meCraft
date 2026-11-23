/**
 * @file meDesign (medesign)
 * meDesign Studio — UI/UX Prototyping & Curated Design Suite
 * Part of meCraft Creative & Document Suite
 */

import { StudioShell } from '@mecraft/studio-shell';

export const APP_METADATA = {
  id: 'medesign',
  name: 'meDesign',
  title: 'meDesign Studio — UI/UX Prototyping & Curated Design Suite',
  tagline: 'UI/UX Prototyping & Curated Design Suite',
  category: 'VECTOR_DESIGN',
  version: '1.0.0',
  status: 'production',
  inspiredBy: 'Figma / Penpot (penpot/penpot)',
  supportedExtensions: [".design",".fig",".penpot"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}

export function createStudioShell(target?: HTMLElement | string): StudioShell {
  const shell = new StudioShell({
    appId: 'medesign',
    appName: 'meDesign',
    appTag: 'Figma Pro',
    version: '1.0.0',
    documentTitle: 'meDesign Studio — UI/UX Prototyping & Curated Design Suite',
    theme: 'luxury-dark',
    menu: [
    {
        "id": "file",
        "label": "File",
        "items": [
            {
                "id": "export-css",
                "label": "Export Design Tokens (CSS)"
            }
        ]
    }
],
    ribbon: [
    {
        "id": "tools",
        "tools": [
            {
                "id": "frame",
                "label": "Frame (F)"
            },
            {
                "id": "rect",
                "label": "Rectangle"
            },
            {
                "id": "text",
                "label": "Text"
            },
            {
                "id": "autolayout",
                "label": "Auto-Layout"
            }
        ]
    }
],
    panes: {
      left: {
        title: 'Layers & Artboards',
        initialWidth: 200,
        minWidth: 140,
        collapsible: true,
        content: "<div style=\"padding: 10px; font-size: 11px; color: #f1f5f9;\">❖ Frame: Landing_Hero_Desktop</div>"
      },
      center: {
        content: "<div style=\"display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #0b0d14; color: #f1f5f9;\">Infinite Canvas Viewport</div>"
      },
      right: {
        title: 'Design Tokens',
        initialWidth: 260,
        minWidth: 180,
        collapsible: true,
        content: "<div style=\"padding: 10px; font-size: 11px; color: #94a3b8;\">Auto-Layout: Horizontal · Gap: 16px</div>"
      }
    },
    statusBar: {
      showPrivacyBadge: true,
      items: [
    {
        "id": "status-msg",
        "content": "meDesign Studio Ready"
    }
]
    },
    update: {
      currentVersion: '1.0.0',
      latestVersion: '1.0.0',
      releaseDate: '2026-11-23',
      changelog: [
        'Initialized with centralized @mecraft/studio-shell standard',
        '3-Pane professional desktop cockpit layout',
        '100% In-Device RAM Privacy verification'
      ]
    }
  });

  if (target) {
    shell.mount(target);
  }

  return shell;
}
