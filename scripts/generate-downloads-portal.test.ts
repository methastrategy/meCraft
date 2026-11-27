import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const html = readFileSync(new URL('../public/downloads/index.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error('Download page script is missing');

async function load(releases: unknown) {
  const elements = new Map<string, Record<string, any>>();
  for (const id of ['release-status', 'download-msi', 'release-meta']) {
    elements.set(id, { hidden: id === 'download-msi', dataset: {}, textContent: '' });
  }
  runInNewContext(script, {
    document: { getElementById: (id: string) => elements.get(id) },
    fetch: async () => ({ ok: true, json: async () => releases }),
    AbortController,
    URL,
    setTimeout,
    clearTimeout,
  });
  await new Promise(resolve => setImmediate(resolve));
  return elements;
}

describe('public meCraft download page', () => {
  it('shows no download button while the public release only has EXE files', async () => {
    const elements = await load([{ draft: false, prerelease: false, assets: [{ name: 'meCraft-Setup.exe' }] }]);
    expect(elements.get('download-msi')?.hidden).toBe(true);
    expect(elements.get('release-status')?.textContent).toContain('ยังไม่พร้อม');
  });

  it('shows only a verified GitHub MSI release address', async () => {
    const url = 'https://github.com/methastrategy/meCraft/releases/download/v1.0.10/mecraft-hub.msi';
    const elements = await load([{ tag_name: 'v1.0.10', draft: false, prerelease: false,
      assets: [{ name: 'mecraft-hub.msi', browser_download_url: url, size: 96907264 }] }]);
    expect(elements.get('download-msi')?.hidden).toBe(false);
    expect(elements.get('download-msi')?.href).toBe(url);
    expect(elements.get('release-status')?.textContent).toContain('v1.0.10');
  });
});
