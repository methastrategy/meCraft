/**
 * @file meFilm (mefilm)
 * Multi-Track Video Timeline Editing & Export
 * Part of meCraft Creative & Document Suite
 */

export const APP_METADATA = {
  id: 'mefilm',
  name: 'meFilm',
  tagline: 'Multi-Track Video Timeline Editing & Export',
  category: 'MEDIA',
  version: '1.0.0',
  status: 'draft',
  inspiredBy: 'Adobe Premiere Pro / FilmCraft (storytold/filmcraft)',
  supportedExtensions: [".mp4",".mov",".avi",".mkv",".webm"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}
