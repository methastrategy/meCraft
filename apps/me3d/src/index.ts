/**
 * @file me3D (me3d)
 * me3D Studio — WebGL Polygon Modeling & PBR Spatial Staging Studio
 * Part of meCraft Creative & Document Suite
 */

import { StudioShell } from '@mecraft/studio-shell';

export const APP_METADATA = {
  id: 'me3d',
  name: 'me3D',
  title: 'me3D Studio — WebGL Polygon Modeling & PBR Spatial Staging Studio',
  tagline: 'WebGL Polygon Modeling & PBR Spatial Staging Studio',
  category: 'AUDIO_3D',
  version: '1.0.0',
  status: 'production',
  inspiredBy: 'Blender / Three.js Editor (mrdoob/three.js)',
  supportedExtensions: [".gltf",".glb",".obj",".stl"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}

export function createStudioShell(target?: HTMLElement | string): StudioShell {
  const shell = new StudioShell({
    appId: 'me3d',
    appName: 'me3D',
    appTag: 'Blender Pro',
    version: '1.0.0',
    documentTitle: 'me3D Studio — WebGL Polygon Modeling & PBR Spatial Staging Studio',
    theme: 'obsidian',
    menu: [
    {
        "id": "file",
        "label": "File",
        "items": [
            {
                "id": "export-gltf",
                "label": "Export GLTF 2.0"
            }
        ]
    }
],
    ribbon: [
    {
        "id": "tools",
        "tools": [
            {
                "id": "orbit",
                "label": "Orbit"
            },
            {
                "id": "pan",
                "label": "Pan"
            },
            {
                "id": "extrude",
                "label": "Extrude"
            },
            {
                "id": "pbr",
                "label": "PBR Staging"
            }
        ]
    }
],
    panes: {
      left: {
        title: 'Scene Graph',
        initialWidth: 200,
        minWidth: 140,
        collapsible: true,
        content: "<div style=\"padding: 10px; font-size: 11px; color: #f1f5f9;\">Scene > Mesh: Isometric_Chassis</div>"
      },
      center: {
        content: "<div style=\"display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #08090d; color: #f59e0b;\">WebGL 3D Viewport & Perspective Grid</div>"
      },
      right: {
        title: 'PBR Materials',
        initialWidth: 260,
        minWidth: 180,
        collapsible: true,
        content: "<div style=\"padding: 10px; font-size: 11px; color: #94a3b8;\">Metallic: 0.85 · Roughness: 0.15</div>"
      }
    },
    statusBar: {
      showPrivacyBadge: true,
      items: [
    {
        "id": "status-msg",
        "content": "me3D WebGL Active · 14,280 Polygons"
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
