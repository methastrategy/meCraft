/**
 * @file meDoc (medoc)
 * Distraction-Free Rich Document & Typography Processor
 * Part of meCraft Creative & Document Suite
 */

export const APP_METADATA = {
  id: 'medoc',
  name: 'meDoc',
  tagline: 'Distraction-Free Rich Document & Typography Processor',
  category: 'DOCUMENT',
  version: '1.0.0',
  status: 'draft',
  inspiredBy: 'Microsoft Word / WordCraft (storytold/wordcraft)',
  supportedExtensions: [".docx",".doc",".rtf",".odt"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}
