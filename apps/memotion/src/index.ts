/**
 * @file meMotion (memotion)
 * meMotion Studio — Motion Graphics & Keyframe Animation Studio
 * Part of meCraft Creative & Document Suite
 */

import { StudioShell } from '@mecraft/studio-shell';

export const APP_METADATA = {
  id: 'memotion',
  name: 'meMotion',
  title: 'meMotion Studio — Motion Graphics & Keyframe Animation Studio',
  tagline: 'Motion Graphics & Keyframe Animation Studio',
  category: 'VIDEO_MOTION',
  version: '1.0.0',
  status: 'production',
  inspiredBy: 'Adobe After Effects / Lottie',
  supportedExtensions: [".motion",".aep",".lottie.json"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}

export function createStudioShell(target?: HTMLElement | string): StudioShell {
  const shell = new StudioShell({
    appId: 'memotion',
    appName: 'meMotion',
    appTag: 'After Effects',
    version: '1.0.0',
    documentTitle: 'meMotion Studio — Motion Graphics & Keyframe Animation Studio',
    theme: 'navy-black',
    menu: [
    {
        "id": "file",
        "label": "File",
        "items": [
            {
                "id": "export-lottie",
                "label": "Export Lottie JSON"
            }
        ]
    }
],
    ribbon: [
    {
        "id": "tools",
        "tools": [
            {
                "id": "keyframe",
                "label": "Add Keyframe"
            },
            {
                "id": "ease",
                "label": "Ease In/Out"
            },
            {
                "id": "render",
                "label": "Render"
            }
        ]
    }
],
    panes: {
      left: {
        title: 'Composition Layers',
        initialWidth: 200,
        minWidth: 140,
        collapsible: true,
        content: "<div style=\"padding: 10px; font-size: 11px; color: #f1f5f9;\">Layer 1: Motion_Path_Glyph</div>"
      },
      center: {
        content: "<div style=\"display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #08090f; color: #f1f5f9;\">Keyframe Motion Viewport (60 fps)</div>"
      },
      right: {
        title: 'Graph Editor',
        initialWidth: 260,
        minWidth: 180,
        collapsible: true,
        content: "<div style=\"padding: 10px; font-size: 11px; color: #94a3b8;\">Bézier Velocity Graph: 85% Easing</div>"
      }
    },
    statusBar: {
      showPrivacyBadge: true,
      items: [
    {
        "id": "status-msg",
        "content": "meMotion Studio Ready · 60fps"
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
