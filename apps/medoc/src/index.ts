/**
 * @file meDoc (medoc)
 * meDoc Studio — Distraction-Free Pro Writing & KaTeX Typography Studio
 * Part of meCraft Creative & Document Suite
 */

import { StudioShell } from '@mecraft/studio-shell';

export const APP_METADATA = {
  id: 'medoc',
  name: 'meDoc',
  title: 'meDoc Studio — Distraction-Free Pro Writing & KaTeX Typography Studio',
  tagline: 'Distraction-Free Pro Writing & KaTeX Typography Studio',
  category: 'DOCUMENT',
  version: '1.0.0',
  status: 'production',
  inspiredBy: 'Microsoft Word / Typora / Obsidian (obsidianmd)',
  supportedExtensions: [".md",".docx",".txt",".tex"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}

export function createStudioShell(target?: HTMLElement | string): StudioShell {
  const shell = new StudioShell({
    appId: 'medoc',
    appName: 'meDoc',
    appTag: 'Word / Markdown Pro',
    version: '1.0.0',
    documentTitle: 'meDoc Studio — Distraction-Free Pro Writing & KaTeX Typography Studio',
    theme: 'navy-black',
    menu: [
    {
        "id": "file",
        "label": "File",
        "items": [
            {
                "id": "new",
                "label": "New Document"
            },
            {
                "id": "export-pdf",
                "label": "Export as Clean PDF"
            }
        ]
    },
    {
        "id": "format",
        "label": "Format",
        "items": [
            {
                "id": "bold",
                "label": "Bold (Ctrl+B)"
            },
            {
                "id": "math",
                "label": "Insert KaTeX Formula"
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
                "id": "tool-bold",
                "label": "Bold"
            },
            {
                "id": "tool-italic",
                "label": "Italic"
            },
            {
                "id": "tool-h1",
                "label": "H1"
            },
            {
                "id": "tool-h2",
                "label": "H2"
            },
            {
                "id": "tool-math",
                "label": "KaTeX Math"
            },
            {
                "id": "tool-table",
                "label": "Table"
            },
            {
                "id": "tool-pdf",
                "label": "Export PDF"
            }
        ]
    }
],
    panes: {
      left: {
        title: 'Document Outline',
        initialWidth: 200,
        minWidth: 140,
        collapsible: true,
        content: "\n      <div style=\"display: flex; flex-direction: column; gap: 6px; padding: 12px; font-size: 11px; color: #94a3b8;\">\n        <div style=\"color: #3b82f6; font-weight: 600;\">1. Executive Summary</div>\n        <div style=\"padding-left: 10px;\">1.1 System Architecture</div>\n        <div style=\"padding-left: 10px;\">1.2 Privacy Invariants</div>\n        <div style=\"color: #3b82f6; font-weight: 600; margin-top: 6px;\">2. Technical Roadmap</div>\n      </div>\n    "
      },
      center: {
        content: "\n      <div style=\"display: flex; justify-content: center; width: 100%; height: 100%; background: #080a0f; overflow-y: auto; padding: 40px 20px;\">\n        <div style=\"width: 700px; min-height: 800px; background: #0f1422; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 48px; color: #f1f5f9; font-family: 'Inter', sans-serif; line-height: 1.8;\">\n          <h1 style=\"font-size: 26px; font-weight: 700; color: #3b82f6; margin-bottom: 12px;\">meDoc Creative Documentation</h1>\n          <p style=\"color: #94a3b8; font-size: 14px;\">A distraction-free typographic studio engineered for high-density technical authoring and client-side KaTeX rendering.</p>\n          <div style=\"margin: 24px 0; padding: 16px; background: rgba(59,130,246,0.08); border-left: 3px solid #3b82f6; border-radius: 4px; font-family: monospace; font-size: 13px;\">\n            $$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$\n          </div>\n        </div>\n      </div>\n    "
      },
      right: {
        title: 'Typographic Stats',
        initialWidth: 240,
        minWidth: 180,
        collapsible: true,
        content: "\n      <div style=\"display: flex; flex-direction: column; gap: 10px; padding: 14px; font-size: 12px; color: #94a3b8;\">\n        <div style=\"font-weight: 600; color: #3b82f6;\">Document Telemetry</div>\n        <div>Words: <strong style=\"color: #f1f5f9;\">1,420 words</strong></div>\n        <div>Characters: <strong style=\"color: #f1f5f9;\">8,910 chars</strong></div>\n        <div>Reading Time: <strong style=\"color: #f1f5f9;\">~5.5 mins</strong></div>\n      </div>\n    "
      }
    },
    statusBar: {
      showPrivacyBadge: true,
      items: [
    {
        "id": "status-msg",
        "align": "left",
        "content": "meDoc Ready · Typographic Zen Mode"
    },
    {
        "id": "status-dims",
        "align": "center",
        "content": "Page 1 of 4 · UTF-8 Markdown"
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
