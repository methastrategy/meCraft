/**
 * @file meMotion (memotion)
 * Motion Graphics, Keyframe Animation & VFX
 * Part of meCraft Creative & Document Suite
 */

export const APP_METADATA = {
  id: 'memotion',
  name: 'meMotion',
  tagline: 'Motion Graphics, Keyframe Animation & VFX',
  category: 'MEDIA',
  version: '1.0.0',
  status: 'draft',
  inspiredBy: 'Adobe After Effects / EffectCraft (storytold/effectcraft)',
  supportedExtensions: [".mevfx",".aep"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}
