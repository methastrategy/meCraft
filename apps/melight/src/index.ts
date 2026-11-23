/**
 * @file meLight Studio (melight)
 * Professional RAW Photo Development & Color Grading
 * Part of meCraft Creative & Document Suite
 */

export const APP_METADATA = {
  id: 'melight',
  name: 'meLight Studio',
  tagline: 'Professional RAW Photo Development & Color Grading',
  category: 'CREATIVE',
  version: '3.2.1',
  status: 'draft',
  inspiredBy: 'Adobe Lightroom / LightCraft (storytold/lightcraft)',
  supportedExtensions: [".raw",".cr2",".nef",".arw",".dng"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}
