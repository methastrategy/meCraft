/**
 * @file meSheet (mesheet)
 * meSheet Studio — Reactive Financial Modeling & High-Volume Spreadsheet
 * Part of meCraft Creative & Document Suite
 */

import { StudioShell } from '@mecraft/studio-shell';

export const APP_METADATA = {
  id: 'mesheet',
  name: 'meSheet',
  title: 'meSheet Studio — Reactive Financial Modeling & High-Volume Spreadsheet',
  tagline: 'Reactive Financial Modeling & High-Volume Spreadsheet',
  category: 'DOCUMENT',
  version: '1.0.0',
  status: 'production',
  inspiredBy: 'Microsoft Excel / Luckysheet',
  supportedExtensions: [".xlsx",".csv",".tsv"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}

export function createStudioShell(target?: HTMLElement | string): StudioShell {
  const shell = new StudioShell({
    appId: 'mesheet',
    appName: 'meSheet',
    appTag: 'Excel Pro',
    version: '1.0.0',
    documentTitle: 'meSheet Studio — Reactive Financial Modeling & High-Volume Spreadsheet',
    theme: 'navy-black',
    menu: [
    {
        "id": "file",
        "label": "File",
        "items": [
            {
                "id": "export-xlsx",
                "label": "Export XLSX"
            }
        ]
    }
],
    ribbon: [
    {
        "id": "tools",
        "tools": [
            {
                "id": "sum",
                "label": "∑ AutoSum"
            },
            {
                "id": "bold",
                "label": "Bold"
            },
            {
                "id": "chart",
                "label": "Insert Chart"
            },
            {
                "id": "filter",
                "label": "Filter"
            }
        ]
    }
],
    panes: {
      left: {
        title: 'Workbook Sheets',
        initialWidth: 160,
        minWidth: 140,
        collapsible: true,
        content: "<div style=\"padding: 10px; font-size: 11px; color: #f1f5f9;\">Sheet 1: Q4_Financial_Model</div>"
      },
      center: {
        content: "<div style=\"display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #080a0f; color: #10b981;\">Virtualized 100,000-Row Calculation Grid</div>"
      },
      right: {
        title: 'Cell Formula Inspector',
        initialWidth: 240,
        minWidth: 180,
        collapsible: true,
        content: "<div style=\"padding: 10px; font-size: 11px; color: #94a3b8;\">Formula: =SUM(B2:B12) * 1.07</div>"
      }
    },
    statusBar: {
      showPrivacyBadge: true,
      items: [
    {
        "id": "status-msg",
        "content": "meSheet Ready · 0 errors"
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
