/**
 * @file meDeck (medeck)
 * Dynamic Markdown & Visual Presentation Slides
 * Part of meCraft Creative & Document Suite
 */

export const APP_METADATA = {
  id: 'medeck',
  name: 'meDeck',
  tagline: 'Dynamic Markdown & Visual Presentation Slides',
  category: 'DOCUMENT',
  version: '1.0.0',
  status: 'draft',
  inspiredBy: 'Microsoft PowerPoint / DeckCraft (storytold/deckcraft)',
  supportedExtensions: [".pptx",".ppt",".slide"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}
