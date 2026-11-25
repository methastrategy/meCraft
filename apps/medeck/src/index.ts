/**
 * @file meDeck (medeck)
 * meDeck Studio — High-Impact Interactive Presentation Studio
 * Part of meCraft Creative & Document Suite
 */

import { StudioShell } from '@mecraft/studio-shell';

export const APP_METADATA = {
  id: 'medeck',
  name: 'meDeck',
  title: 'meDeck Studio — High-Impact Interactive Presentation Studio',
  tagline: 'High-Impact Interactive Presentation Studio',
  category: 'CREATIVE',
  version: '1.0.0',
  status: 'production',
  inspiredBy: 'Apple Keynote / Slidev',
  supportedExtensions: [".deck",".pptx",".pdf"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}

export function createStudioShell(target?: HTMLElement | string): StudioShell {
  const shell = new StudioShell({
    appId: 'medeck',
    appName: 'meDeck',
    appTag: 'Keynote / Slide',
    version: '1.0.0',
    documentTitle: 'meDeck Studio — High-Impact Interactive Presentation Studio',
    theme: 'luxury-dark',
    menu: [
    {
        "id": "file",
        "label": "File",
        "items": [
            {
                "id": "present",
                "label": "Start Presentation (F5)"
            }
        ]
    }
],
    ribbon: [
    {
        "id": "tools",
        "tools": [
            {
                "id": "add-slide",
                "label": "+ New Slide"
            },
            {
                "id": "layout",
                "label": "Layout"
            },
            {
                "id": "transition",
                "label": "Transition"
            },
            {
                "id": "play",
                "label": "Present"
            },
            {
                "id": "thai-font",
                "label": "🇹🇭 Sarabun"
            },
            {
                "id": "thai-num",
                "label": "๑๒๓"
            }
        ]
    }
],
    panes: {
      left: {
        title: 'Slides Deck',
        initialWidth: 180,
        minWidth: 140,
        collapsible: true,
        content: "<div style=\"padding: 10px; font-size: 11px; color: #f1f5f9;\">Slide 1: Title & Hero<br><br>Slide 2: Architecture</div>"
      },
      center: {
        content: "<div style=\"display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #07080d; color: #f1f5f9;\">16:9 Presentation Canvas Artboard</div>"
      },
      right: {
        title: 'Slide Animations',
        initialWidth: 240,
        minWidth: 180,
        collapsible: true,
        content: "<div style=\"padding: 10px; font-size: 11px; color: #94a3b8;\">Magic Move Transition: 600ms Ease</div>"
      }
    },
    statusBar: {
      showPrivacyBadge: true,
      items: [
    {
        "id": "status-msg",
        "content": "meDeck Ready · Slide 1 of 12"
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
