/**
 * @file meAudio (meaudio)
 * meAudio Studio — Multi-Track Digital Audio Workstation & Noise Reducer
 * Part of meCraft Creative & Document Suite
 */

import { StudioShell } from '@mecraft/studio-shell';

export const APP_METADATA = {
  id: 'meaudio',
  name: 'meAudio',
  title: 'meAudio Studio — Multi-Track Digital Audio Workstation & Noise Reducer',
  tagline: 'Multi-Track Digital Audio Workstation & Noise Reducer',
  category: 'AUDIO_3D',
  version: '1.0.0',
  status: 'production',
  inspiredBy: 'Audacity / Adobe Audition / LMMS (LMMS/lmms)',
  supportedExtensions: [".wav",".mp3",".flac",".ogg"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}

export function createStudioShell(target?: HTMLElement | string): StudioShell {
  const shell = new StudioShell({
    appId: 'meaudio',
    appName: 'meAudio',
    appTag: 'Audition / DAW',
    version: '1.0.0',
    documentTitle: 'meAudio Studio — Multi-Track Digital Audio Workstation & Noise Reducer',
    theme: 'navy-black',
    menu: [
    {
        "id": "file",
        "label": "File",
        "items": [
            {
                "id": "export-wav",
                "label": "Export 24-bit WAV"
            }
        ]
    }
],
    ribbon: [
    {
        "id": "tools",
        "tools": [
            {
                "id": "rec",
                "label": "● Record"
            },
            {
                "id": "play",
                "label": "▶ Play"
            },
            {
                "id": "denoise",
                "label": "Spectral De-Noise"
            }
        ]
    }
],
    panes: {
      left: {
        title: 'Audio Tracks',
        initialWidth: 180,
        minWidth: 140,
        collapsible: true,
        content: "<div style=\"padding: 10px; font-size: 11px; color: #f1f5f9;\">Track 1: Vocal_Mic (Mono)</div>"
      },
      center: {
        content: "<div style=\"display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #07090e; color: #10b981;\">Spectral Frequency Waveform Display (48kHz)</div>"
      },
      right: {
        title: 'Master Strip',
        initialWidth: 240,
        minWidth: 180,
        collapsible: true,
        content: "<div style=\"padding: 10px; font-size: 11px; color: #94a3b8;\">Parametric EQ · Peak Limiter -0.1 dB</div>"
      }
    },
    statusBar: {
      showPrivacyBadge: true,
      items: [
    {
        "id": "status-msg",
        "content": "meAudio DAW Active · 48,000 Hz"
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
