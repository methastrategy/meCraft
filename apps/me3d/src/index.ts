/**
 * @file me3D (me3d)
 * Parametric 3D Modeling & CAD Engineering
 * Part of meCraft Creative & Document Suite
 */

export const APP_METADATA = {
  id: 'me3d',
  name: 'me3D',
  tagline: 'Parametric 3D Modeling & CAD Engineering',
  category: 'ENGINEERING',
  version: '3.2.1',
  status: 'draft',
  inspiredBy: 'AutoCAD LT / CadCraft (storytold/cadcraft)',
  supportedExtensions: [".dwg",".dxf",".obj",".stl",".step"],
  privacyInvariant: '100% In-Device RAM Privacy (Zero-Cloud Upload)'
} as const;

export function getAppInfo() {
  return APP_METADATA;
}
