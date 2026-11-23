/**
 * @file meVector (mevector)
 * meVector Studio — Precision Bézier Vector Illustration & SVG Studio
 * Part of meCraft Creative & Document Suite
 */

import { StudioShell } from '@mecraft/studio-shell';

export const APP_METADATA = {
  id: 'mevector',
  name: 'meVector',
  title: 'meVector Studio — Precision Bézier Vector Illustration & SVG Studio',
  tagline: 'Precision Bézier Vector Illustration & SVG Studio',
  category: 'CREATIVE',
  version: '1.0.0',
  status: 'production',
  inspiredBy: 'Adobe Illustrator / VectorCraft (storytold/vectorcraft)',
  supportedExtensions: [".svg",".ai",".eps"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}

export function createStudioShell(target?: HTMLElement | string): StudioShell {
  const shell = new StudioShell({
    appId: 'mevector',
    appName: 'meVector',
    appTag: 'VectorCraft Pro',
    version: '1.0.0',
    documentTitle: 'meVector Studio — Precision Bézier Vector Illustration & SVG Studio',
    theme: 'luxury-dark',
    menu: [
    {
        "id": "file",
        "label": "File",
        "items": [
            {
                "id": "new",
                "label": "New Artboard",
                "shortcut": "Ctrl+N"
            },
            {
                "id": "open",
                "label": "Open Vector...",
                "shortcut": "Ctrl+O"
            },
            {
                "id": "save",
                "label": "Save SVG",
                "shortcut": "Ctrl+S"
            },
            {
                "id": "export",
                "label": "Export as Clean SVG / PDF"
            }
        ]
    },
    {
        "id": "edit",
        "label": "Edit",
        "items": [
            {
                "id": "undo",
                "label": "Undo",
                "shortcut": "Ctrl+Z"
            },
            {
                "id": "redo",
                "label": "Redo",
                "shortcut": "Ctrl+Y"
            },
            {
                "id": "cut",
                "label": "Cut",
                "shortcut": "Ctrl+X"
            },
            {
                "id": "copy",
                "label": "Copy",
                "shortcut": "Ctrl+C"
            },
            {
                "id": "paste",
                "label": "Paste",
                "shortcut": "Ctrl+V"
            }
        ]
    },
    {
        "id": "object",
        "label": "Object",
        "items": [
            {
                "id": "group",
                "label": "Group Selection",
                "shortcut": "Ctrl+G"
            },
            {
                "id": "ungroup",
                "label": "Ungroup",
                "shortcut": "Ctrl+Shift+G"
            },
            {
                "id": "lock",
                "label": "Lock Layer"
            }
        ]
    },
    {
        "id": "path",
        "label": "Path",
        "items": [
            {
                "id": "unite",
                "label": "Boolean: Unite (Union)"
            },
            {
                "id": "subtract",
                "label": "Boolean: Subtract (Difference)"
            },
            {
                "id": "intersect",
                "label": "Boolean: Intersect"
            },
            {
                "id": "simplify",
                "label": "Simplify Path Nodes"
            }
        ]
    },
    {
        "id": "help",
        "label": "Help",
        "items": [
            {
                "id": "check-updates",
                "label": "Check for Updates...",
                "badge": "NEW"
            },
            {
                "id": "about",
                "label": "About meVector Studio"
            }
        ]
    }
],
    ribbon: [
    {
        "id": "tools-main",
        "align": "left",
        "tools": [
            {
                "id": "tool-select",
                "label": "Select (V)",
                "active": true
            },
            {
                "id": "tool-pen",
                "label": "Pen Tool (P)"
            },
            {
                "id": "tool-node",
                "label": "Node Edit (A)"
            },
            {
                "id": "sep1",
                "type": "separator"
            },
            {
                "id": "tool-rect",
                "label": "Rectangle (R)"
            },
            {
                "id": "tool-circle",
                "label": "Ellipse (O)"
            },
            {
                "id": "tool-text",
                "label": "Text (T)"
            },
            {
                "id": "sep2",
                "type": "separator"
            },
            {
                "id": "tool-unite",
                "label": "Unite"
            },
            {
                "id": "tool-cut",
                "label": "Subtract"
            },
            {
                "id": "sep3",
                "type": "separator"
            },
            {
                "id": "tool-export",
                "label": "Export SVG"
            }
        ]
    }
],
    panes: {
      left: {
        title: 'Layers & Objects',
        initialWidth: 220,
        minWidth: 140,
        collapsible: true,
        content: "\n      <div style=\"display: flex; flex-direction: column; gap: 8px; padding: 12px; font-size: 12px;\">\n        <div style=\"font-weight: 600; color: #a855f7; margin-bottom: 4px;\">SVG Hierarchy</div>\n        <div style=\"padding: 6px 8px; background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.3); border-radius: 4px; color: #f1f5f9; display: flex; justify-content: space-between;\">\n          <span>◆ Path: Logo_Crown_Glyph</span><span>16 pts</span>\n        </div>\n        <div style=\"padding: 6px 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; color: #94a3b8; display: flex; justify-content: space-between;\">\n          <span>◇ Path: Accent_Aura_Ring</span><span>8 pts</span>\n        </div>\n        <div style=\"padding: 6px 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; color: #94a3b8; display: flex; justify-content: space-between;\">\n          <span>◇ Group: Isometric_Grid</span><span>Locked</span>\n        </div>\n      </div>\n    "
      },
      center: {
        content: "\n      <div style=\"display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: radial-gradient(circle, #0e1226 0%, #060814 100%);\">\n        <svg width=\"380\" height=\"300\" viewBox=\"0 0 380 300\" fill=\"none\">\n          <path d=\"M80 230 C80 130, 160 60, 190 60 C220 60, 300 130, 300 230 Z\" stroke=\"#a855f7\" stroke-width=\"2.5\" fill=\"rgba(168,85,247,0.1)\"/>\n          <line x1=\"190\" y1=\"60\" x2=\"120\" y2=\"40\" stroke=\"#c084fc\" stroke-width=\"1.2\" stroke-dasharray=\"3 3\"/>\n          <line x1=\"190\" y1=\"60\" x2=\"260\" y2=\"40\" stroke=\"#c084fc\" stroke-width=\"1.2\" stroke-dasharray=\"3 3\"/>\n          <circle cx=\"190\" cy=\"60\" r=\"5\" fill=\"#c084fc\"/>\n          <circle cx=\"120\" cy=\"40\" r=\"4\" fill=\"#f43f5e\"/>\n          <circle cx=\"260\" cy=\"40\" r=\"4\" fill=\"#f43f5e\"/>\n          <circle cx=\"80\" cy=\"230\" r=\"4\" fill=\"#c084fc\"/>\n          <circle cx=\"300\" cy=\"230\" r=\"4\" fill=\"#c084fc\"/>\n        </svg>\n      </div>\n    "
      },
      right: {
        title: 'Path & Node Inspector',
        initialWidth: 280,
        minWidth: 180,
        collapsible: true,
        content: "\n      <div style=\"display: flex; flex-direction: column; gap: 14px; padding: 14px; font-size: 12px;\">\n        <div style=\"font-weight: 600; color: #a855f7;\">Bézier Geometry</div>\n        <div style=\"display: flex; justify-content: space-between; color: #94a3b8;\">\n          <span>Selected Node:</span><span style=\"font-family: monospace; color: #f1f5f9;\">(190.00, 60.00)</span>\n        </div>\n        <div style=\"display: flex; justify-content: space-between; color: #94a3b8;\">\n          <span>Tangent Angle:</span><span style=\"font-family: monospace; color: #f1f5f9;\">18.4° (Smooth)</span>\n        </div>\n        <div style=\"margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; font-weight: 600; color: #a855f7;\">Fill & Stroke</div>\n        <div style=\"display: flex; align-items: center; gap: 8px;\">\n          <div style=\"width: 24px; height: 24px; background: rgba(168,85,247,0.3); border: 1px solid #a855f7; border-radius: 4px;\"></div>\n          <span>Fill: rgba(168,85,247,0.1)</span>\n        </div>\n        <div style=\"display: flex; align-items: center; gap: 8px;\">\n          <div style=\"width: 24px; height: 24px; background: #a855f7; border: 1px solid #c084fc; border-radius: 4px;\"></div>\n          <span>Stroke: #a855f7 (2.5px)</span>\n        </div>\n      </div>\n    "
      }
    },
    statusBar: {
      showPrivacyBadge: true,
      items: [
    {
        "id": "status-msg",
        "align": "left",
        "content": "Vector Engine Ready · 16 Bézier Nodes"
    },
    {
        "id": "status-dims",
        "align": "center",
        "content": "1920 x 1080 px · Scale: 100%"
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
