/**
 * @file meVector (mevector)
 * Precision Vector Graphics & Illustration
 * Part of meCraft Creative & Document Suite
 */

export const APP_METADATA = {
  id: 'mevector',
  name: 'meVector',
  tagline: 'Precision Vector Graphics & Illustration',
  category: 'CREATIVE',
  version: '1.0.0',
  status: 'draft',
  inspiredBy: 'Adobe Illustrator / VectorCraft (storytold/vectorcraft)',
  supportedExtensions: [".svg",".ai",".eps"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}
