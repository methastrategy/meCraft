/**
 * @file meLight (melight)
 * meLight Studio — Pro RAW Color Grading & Darkroom Suite
 * Part of meCraft Creative & Document Suite
 */

import { StudioShell } from '@mecraft/studio-shell';

export const APP_METADATA = {
  id: 'melight',
  name: 'meLight',
  title: 'meLight Studio — Pro RAW Color Grading & Darkroom Suite',
  tagline: 'Pro RAW Color Grading & Darkroom Suite',
  category: 'PHOTO_COLOR',
  version: '1.0.0',
  status: 'production',
  inspiredBy: 'Adobe Lightroom / Darktable (darktable-org/darktable)',
  supportedExtensions: [".dng",".raw",".cr3",".arw",".nef"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}

export function createStudioShell(target?: HTMLElement | string): StudioShell {
  const shell = new StudioShell({
    appId: 'melight',
    appName: 'meLight',
    appTag: 'Lightroom Pro',
    version: '1.0.0',
    documentTitle: 'meLight Studio — Pro RAW Color Grading & Darkroom Suite',
    theme: 'navy-black',
    menu: [
    {
        "id": "file",
        "label": "File",
        "items": [
            {
                "id": "import",
                "label": "Import RAW...",
                "shortcut": "Ctrl+I"
            },
            {
                "id": "export",
                "label": "Export 16-bit TIFF"
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
            }
        ]
    },
    {
        "id": "develop",
        "label": "Develop",
        "items": [
            {
                "id": "autotone",
                "label": "Auto Tone"
            },
            {
                "id": "wb",
                "label": "White Balance Picker"
            }
        ]
    },
    {
        "id": "help",
        "label": "Help",
        "items": [
            {
                "id": "check-updates",
                "label": "Check for Updates..."
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
                "id": "tool-import",
                "label": "Import RAW"
            },
            {
                "id": "tool-wb",
                "label": "White Balance"
            },
            {
                "id": "tool-curve",
                "label": "Tone Curve"
            },
            {
                "id": "tool-hsl",
                "label": "HSL Mixer"
            },
            {
                "id": "tool-export",
                "label": "Export High-Res"
            }
        ]
    }
],
    panes: {
      left: {
        title: 'RAW Filmstrip',
        initialWidth: 180,
        minWidth: 140,
        collapsible: true,
        content: "\n      <div style=\"display: flex; flex-direction: column; gap: 8px; padding: 10px;\">\n        <div style=\"font-size: 11px; text-transform: uppercase; color: #06b6d4; font-weight: 600;\">Queue (4 Photos)</div>\n        <div style=\"aspect-ratio: 3/2; background: #1a202c; border: 1px solid #06b6d4; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #f1f5f9;\">RAW_9821.CR3</div>\n        <div style=\"aspect-ratio: 3/2; background: #11151f; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #94a3b8;\">RAW_9822.CR3</div>\n      </div>\n    "
      },
      center: {
        content: "\n      <div style=\"display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; background: #07090e;\">\n        <div style=\"font-size: 40px; margin-bottom: 12px;\">📷</div>\n        <div style=\"font-size: 15px; font-weight: 600; color: #f1f5f9;\">32-Bit Floating-Point RAW Canvas</div>\n        <div style=\"font-size: 12px; color: #64748b; margin-top: 4px;\">Zero Quality Loss · ProPhoto RGB Pipeline</div>\n      </div>\n    "
      },
      right: {
        title: 'Tone & Color Sliders',
        initialWidth: 300,
        minWidth: 180,
        collapsible: true,
        content: "\n      <div style=\"display: flex; flex-direction: column; gap: 14px; padding: 14px; font-size: 12px;\">\n        <div style=\"font-weight: 600; color: #06b6d4;\">White Balance & Exposure</div>\n        <div><span>Temperature: 5600 K</span><input type=\"range\" style=\"width: 100%; accent-color: #06b6d4;\" value=\"56\" /></div>\n        <div><span>Exposure: +0.65 EV</span><input type=\"range\" style=\"width: 100%; accent-color: #06b6d4;\" value=\"65\" /></div>\n        <div><span>Highlights: -25</span><input type=\"range\" style=\"width: 100%; accent-color: #06b6d4;\" value=\"35\" /></div>\n        <div><span>Shadows: +40</span><input type=\"range\" style=\"width: 100%; accent-color: #06b6d4;\" value=\"70\" /></div>\n      </div>\n    "
      }
    },
    statusBar: {
      showPrivacyBadge: true,
      items: [
    {
        "id": "status-msg",
        "align": "left",
        "content": "meLight Ready · 14-bit RAW Engine Active"
    },
    {
        "id": "status-dims",
        "align": "center",
        "content": "ISO 100 · f/2.8 · 1/500s · 50mm"
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
