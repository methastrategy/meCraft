/**
 * @file meDesign (medesign)
 * Desktop Publishing, Grid Layouts & Typography
 * Part of meCraft Creative & Document Suite
 */

export const APP_METADATA = {
  id: 'medesign',
  name: 'meDesign',
  tagline: 'Desktop Publishing, Grid Layouts & Typography',
  category: 'CREATIVE',
  version: '3.2.1',
  status: 'draft',
  inspiredBy: 'Adobe InDesign / DesignCraft (storytold/designcraft)',
  supportedExtensions: [".indd",".idml",".sla"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}
