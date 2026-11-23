/**
 * @file meFilm (mefilm)
 * meFilm Studio — Multi-Track Non-Linear Video Editor & Lossless Slicer
 * Part of meCraft Creative & Document Suite
 */

import { StudioShell } from '@mecraft/studio-shell';

export const APP_METADATA = {
  id: 'mefilm',
  name: 'meFilm',
  title: 'meFilm Studio — Multi-Track Non-Linear Video Editor & Lossless Slicer',
  tagline: 'Multi-Track Non-Linear Video Editor & Lossless Slicer',
  category: 'VIDEO_MOTION',
  version: '1.0.0',
  status: 'production',
  inspiredBy: 'Adobe Premiere / FilmCraft / OpenShot (OpenShot/openshot-qt)',
  supportedExtensions: [".mp4",".mov",".webm",".mkv",".meproject"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}

export function createStudioShell(target?: HTMLElement | string): StudioShell {
  const shell = new StudioShell({
    appId: 'mefilm',
    appName: 'meFilm',
    appTag: 'Premiere Pro',
    version: '1.0.0',
    documentTitle: 'meFilm Studio — Multi-Track Non-Linear Video Editor & Lossless Slicer',
    theme: 'navy-black',
    menu: [
    {
        "id": "file",
        "label": "File",
        "items": [
            {
                "id": "import",
                "label": "Import Footage..."
            },
            {
                "id": "export",
                "label": "Export Sequence (MP4)..."
            }
        ]
    },
    {
        "id": "sequence",
        "label": "Sequence",
        "items": [
            {
                "id": "render",
                "label": "Render In/Out"
            },
            {
                "id": "razor",
                "label": "Razor at Playhead (C)"
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
                "label": "Import Clip"
            },
            {
                "id": "tool-razor",
                "label": "Razor (C)"
            },
            {
                "id": "tool-ripple",
                "label": "Ripple Delete"
            },
            {
                "id": "tool-keyframe",
                "label": "Add Keyframe"
            },
            {
                "id": "tool-render",
                "label": "Export MP4"
            }
        ]
    }
],
    panes: {
      left: {
        title: 'Project Media Pool',
        initialWidth: 200,
        minWidth: 140,
        collapsible: true,
        content: "\n      <div style=\"display: flex; flex-direction: column; gap: 8px; padding: 10px; font-size: 11px;\">\n        <div style=\"font-weight: 600; color: #f59e0b;\">Media Bins</div>\n        <div style=\"padding: 6px; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); border-radius: 4px; color: #f1f5f9;\">🎬 Scene_01_A_Roll.mp4</div>\n        <div style=\"padding: 6px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; color: #94a3b8;\">🎬 Scene_01_B_Roll.mp4</div>\n        <div style=\"padding: 6px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; color: #94a3b8;\">🎵 Soundtrack_Master.wav</div>\n      </div>\n    "
      },
      center: {
        content: "\n      <div style=\"display: flex; flex-direction: column; width: 100%; height: 100%;\">\n        <div style=\"flex: 1; display: flex; align-items: center; justify-content: center; background: #05070a; border-bottom: 1px solid rgba(255,255,255,0.08);\">\n          <div style=\"width: 70%; aspect-ratio: 16/9; background: #0e131d; border: 1px solid #f59e0b; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #f1f5f9; font-size: 13px;\">\n            4K UHD Hardware-Accelerated Stage\n          </div>\n        </div>\n        <div style=\"height: 120px; background: #0b0f17; padding: 8px; display: flex; flex-direction: column; gap: 6px;\">\n          <div style=\"font-size: 10px; color: #64748b; font-family: monospace;\">00:01:24:18 / 00:05:00:00 · 60.00 fps</div>\n          <div style=\"height: 24px; background: rgba(245,158,11,0.2); border: 1px solid #f59e0b; border-radius: 3px; font-size: 10px; color: #f59e0b; padding: 4px;\">V1: Scene_01_A_Roll.mp4</div>\n          <div style=\"height: 24px; background: rgba(59,130,246,0.2); border: 1px solid #3b82f6; border-radius: 3px; font-size: 10px; color: #60a5fa; padding: 4px;\">A1: Dialogue_Stereo.wav</div>\n        </div>\n      </div>\n    "
      },
      right: {
        title: 'Inspector & Effects',
        initialWidth: 260,
        minWidth: 180,
        collapsible: true,
        content: "\n      <div style=\"display: flex; flex-direction: column; gap: 12px; padding: 12px; font-size: 12px;\">\n        <div style=\"font-weight: 600; color: #f59e0b;\">Motion & Transform</div>\n        <div><span>Position: X: 960, Y: 540</span></div>\n        <div><span>Scale: 100.0%</span><input type=\"range\" style=\"width: 100%; accent-color: #f59e0b;\" value=\"50\" /></div>\n        <div><span>Opacity: 100%</span><input type=\"range\" style=\"width: 100%; accent-color: #f59e0b;\" value=\"100\" /></div>\n      </div>\n    "
      }
    },
    statusBar: {
      showPrivacyBadge: true,
      items: [
    {
        "id": "status-msg",
        "align": "left",
        "content": "meFilm Ready · GPU Video Decoder Active"
    },
    {
        "id": "status-dims",
        "align": "center",
        "content": "3840 x 2160 @ 60.00 fps · Drop-Frame TC"
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
