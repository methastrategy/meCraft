/**
 * @file meSheet (mesheet)
 * High-Performance Grid & Financial Analytics
 * Part of meCraft Creative & Document Suite
 */

export const APP_METADATA = {
  id: 'mesheet',
  name: 'meSheet',
  tagline: 'High-Performance Grid & Financial Analytics',
  category: 'DOCUMENT',
  version: '1.0.0',
  status: 'draft',
  inspiredBy: 'Microsoft Excel / GridCraft (storytold/gridcraft)',
  supportedExtensions: [".xlsx",".xls",".csv"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}
