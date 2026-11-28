import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { checkPublication } from './check-launcher-publication.mjs';

const endpoint = 'https://mecrafts.vercel.app/updates/launcher/preview.json';
const installer = Buffer.from('signed installer fixture');
const signature = Buffer.from('signed manifest fixture');
const artifactUrl = 'https://github.com/example/releases/download/v1/mecraft-hub.msi';
const manifest = Buffer.from(JSON.stringify({ platforms: { 'windows-x86_64': {
  url: artifactUrl, size: installer.length, sha256: createHash('sha256').update(installer).digest('hex'),
} } }));

function server(overrides: Record<string, Response> = {}) {
  const files: Record<string, Response> = {
    [endpoint]: new Response(manifest),
    [`${endpoint}.sig`]: new Response(signature),
    [artifactUrl]: new Response(installer),
    ...overrides,
  };
  return async (url: string) => files[url] ?? new Response(null, { status: 404 });
}

describe('published Launcher artifact verification', () => {
  it('accepts the exact manifest, signature and installer', async () => {
    await expect(checkPublication(manifest, signature, server())).resolves.toBeUndefined();
  });

  it('rejects a mismatched published manifest or installer', async () => {
    await expect(checkPublication(manifest, signature, server({ [endpoint]: new Response('different') }))).rejects.toThrow('does not match');
    await expect(checkPublication(manifest, signature, server({ [`${endpoint}.sig`]: new Response('different') }))).rejects.toThrow('does not match');
    await expect(checkPublication(manifest, signature, server({ [artifactUrl]: new Response(Buffer.alloc(installer.length)) }))).rejects.toThrow('does not match');
  });

  it('rejects a release manifest that points to the retired EXE installer', async () => {
    const old = Buffer.from(JSON.stringify({ platforms: { 'windows-x86_64': {
      url: 'https://github.com/example/releases/download/v1/meCraft-Setup.exe',
      size: installer.length,
      sha256: createHash('sha256').update(installer).digest('hex'),
    } } }));
    await expect(checkPublication(old, signature, server())).rejects.toThrow('mecraft.exe');
  });

  it('allows a GitHub release redirect to its approved asset host', async () => {
    const asset = 'https://release-assets.githubusercontent.com/file';
    await expect(checkPublication(manifest, signature, server({
      [artifactUrl]: new Response(null, { status: 302, headers: { location: asset } }),
      [asset]: new Response(installer),
    }))).resolves.toBeUndefined();
  });

  it('rejects an unapproved redirect and a response that exceeds its bound', async () => {
    await expect(checkPublication(manifest, signature, server({ [artifactUrl]: new Response(null, { status: 302, headers: { location: 'https://example.com/file' } }) }))).rejects.toThrow('not permitted');
    await expect(checkPublication(manifest, signature, server({ [artifactUrl]: new Response(Buffer.alloc(installer.length + 1)) }))).rejects.toThrow('size limit');
  });
});
