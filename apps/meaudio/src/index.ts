/**
 * @file meAudio (meaudio)
 * Multi-Track Digital Audio Workstation & Mastering
 * Part of meCraft Creative & Document Suite
 */

export const APP_METADATA = {
  id: 'meaudio',
  name: 'meAudio',
  tagline: 'Multi-Track Digital Audio Workstation & Mastering',
  category: 'MEDIA',
  version: '3.2.1',
  status: 'draft',
  inspiredBy: 'Adobe Audition / SoundCraft (storytold/soundcraft)',
  supportedExtensions: [".mp3",".wav",".flac",".aac",".ogg"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}
