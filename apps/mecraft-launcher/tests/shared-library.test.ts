import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
// @ts-ignore JS build script without .d.ts
import { buildCatalogFiles, validateCatalogRegistry } from '../../../scripts/build-catalog.js';
import { setupMockDom } from '../../../packages/studio-shell/tests/mock-dom';
import { MeCraftsPortal } from '../src/main';
import { parseMeDocCatalog } from '../src/medoc-package';
import {
  CATALOG_V2_CACHE_KEY,
  detectClientPlatform,
  fetchCatalogV2,
  filterCatalogProducts,
  getMeDocPackageFromCatalogV2,
  getRecommendedChannel,
  parseCatalogV2,
  parseProductRoute,
  type CatalogProduct,
} from '../src/catalog';
import {
  renderCatalogProductCard,
  renderHomeScreenGuideModal,
  renderProductDetailView,
} from '../src/product-library-ui';

afterEach(() => vi.unstubAllGlobals());

describe('Shared Product Catalog v2 & Build Validation', () => {
  it('validates real catalog/registry.json and emits v2 + v1 compatible with legacy reader', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mecraft-cat-'));
    try {
      const { v2, v1 } = buildCatalogFiles({ outDir: tmpDir });
      expect(v2.schemaVersion).toBe(2);
      expect(v2.products.length).toBeGreaterThanOrEqual(18);
      expect(v2.products.some((p: CatalogProduct) => p.id === 'mecraft')).toBe(true);
      expect(v2.products.some((p: CatalogProduct) => p.id === 'medoc')).toBe(true);

      // Legacy v1 reader must still parse v1.json cleanly
      const parsedV1 = parseMeDocCatalog(v1);
      expect(parsedV1).not.toBeNull();
      expect(parsedV1?.version).toBe('1.0.4');
      expect(parsedV1?.sizeBytes).toBe(103988736);

      // v2 reader must parse v2.json cleanly
      const parsedV2 = parseCatalogV2(JSON.parse(fs.readFileSync(path.join(tmpDir, 'v2.json'), 'utf8')));
      expect(parsedV2).not.toBeNull();
      expect(getMeDocPackageFromCatalogV2(parsedV2)?.version).toBe('1.0.4');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('rejects duplicate ids, non-https urls, missing package metadata, and channels on in-dev apps', () => {
    const validProduct = {
      id: 'medoc',
      name: 'meDoc',
      category: 'document',
      categoryLabel: { en: 'Document', th: 'เอกสาร' },
      tagline: { en: 'Doc', th: 'เอกสาร' },
      description: { en: 'Desc', th: 'คำอธิบาย' },
      status: 'active',
      version: '1.0.4',
      channels: [
        {
          platform: 'windows',
          type: 'windows-exe',
          stability: 'stable',
          version: '1.0.4',
          arch: 'x64',
          url: 'https://github.com/methastrategy/meCraft/releases/download/v1.0.4/medoc.exe',
          sizeBytes: 103988736,
          sha256: 'a'.repeat(64),
        },
      ],
    };

    expect(validateCatalogRegistry({ products: [validProduct, validProduct] }).length).toBeGreaterThan(0);

    const httpUrl = {
      ...validProduct,
      channels: [{ ...validProduct.channels[0], url: 'http://example.com/medoc.exe' }],
    };
    expect(validateCatalogRegistry({ products: [httpUrl] }).length).toBeGreaterThan(0);

    const missingHash = {
      ...validProduct,
      channels: [{ ...validProduct.channels[0], sha256: 'short' }],
    };
    expect(validateCatalogRegistry({ products: [missingHash] }).length).toBeGreaterThan(0);

    const inDevWithChannel = {
      ...validProduct,
      id: 'mecad',
      status: 'in-dev',
    };
    expect(validateCatalogRegistry({ products: [inDevWithChannel] }).length).toBeGreaterThan(0);
  });

  it('caches verified v2 catalog and falls back offline, or returns null when uncached', async () => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
    });

    const v2Sample = {
      schemaVersion: 2,
      products: [
        {
          id: 'medoc',
          name: 'meDoc',
          category: 'document',
          categoryLabel: { en: 'Document', th: 'เอกสาร' },
          tagline: { en: 'Doc', th: 'เอกสาร' },
          description: { en: 'Desc', th: 'คำอธิบาย' },
          status: 'active',
          version: '1.0.4',
          icon: 'medoc',
          accentColor: '#0d9488',
          glowColor: 'rgba(13,148,136,0.3)',
          keywords: ['doc'],
          channels: [
            {
              platform: 'web',
              type: 'web-app',
              stability: 'stable',
              version: '1.0.4',
              url: 'https://mecrafts.vercel.app/medoc/',
            },
          ],
        },
      ],
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(v2Sample)))
      .mockRejectedValueOnce(new Error('offline'));
    vi.stubGlobal('fetch', fetchMock);

    const online = await fetchCatalogV2('https://mecrafts.vercel.app/catalog/v2.json');
    expect(online.fromCache).toBe(false);
    expect(online.catalog?.products.length).toBe(1);
    expect(store.has(CATALOG_V2_CACHE_KEY)).toBe(true);

    const offlineCached = await fetchCatalogV2('https://mecrafts.vercel.app/catalog/v2.json');
    expect(offlineCached.fromCache).toBe(true);
    expect(offlineCached.catalog?.products[0].id).toBe('medoc');

    store.clear();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const offlineUncached = await fetchCatalogV2('https://mecrafts.vercel.app/catalog/v2.json');
    expect(offlineUncached.catalog).toBeNull();
    expect(offlineUncached.fromCache).toBe(false);
  });

  it('filters products by query, category, platform, and status', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mecraft-cat-filter-'));
    try {
      const { v2 } = buildCatalogFiles({ outDir: tmpDir });
      expect(filterCatalogProducts(v2.products, { query: 'mecraft-hub' }).some(p => p.id === 'mecraft')).toBe(false);
      expect(filterCatalogProducts(v2.products, { query: 'medoc' }).map(p => p.id)).toContain('medoc');
      expect(filterCatalogProducts(v2.products, { platform: 'windows' }).every(p => p.channels.some(c => c.platform === 'windows'))).toBe(true);
      expect(filterCatalogProducts(v2.products, { status: 'in-dev' }).every(p => p.status === 'in-dev')).toBe(true);
      expect(filterCatalogProducts(v2.products, { category: 'photo' }).every(p => p.category === 'photo')).toBe(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('detects platform and recommends matching channel without hiding others', () => {
    expect(detectClientPlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('windows');
    expect(detectClientPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')).toBe('ios');
    expect(detectClientPlatform('Mozilla/5.0 (Linux; Android 14; Pixel 8)')).toBe('android');

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mecraft-cat-rec-'));
    try {
      const { v2 } = buildCatalogFiles({ outDir: tmpDir });
      const medoc = v2.products.find((p: CatalogProduct) => p.id === 'medoc')!;
      expect(getRecommendedChannel(medoc, 'windows')?.type).toBe('windows-exe');
      expect(getRecommendedChannel(medoc, 'ios')?.type).toBe('web-app');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('parses /apps/<id>/ routes and renders detail & home screen UI cleanly', () => {
    expect(parseProductRoute('/apps/medoc/')).toBe('medoc');
    expect(parseProductRoute('/apps/mecraft')).toBe('mecraft');
    expect(parseProductRoute('/apps/bad/path')).toBeNull();
    expect(parseProductRoute('/')).toBeNull();

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mecraft-cat-ui-'));
    try {
      const { v2 } = buildCatalogFiles({ outDir: tmpDir });
      const medoc = v2.products.find((p: CatalogProduct) => p.id === 'medoc')!;
      const mecad = v2.products.find((p: CatalogProduct) => p.id === 'mecad')!;

      const webCard = renderCatalogProductCard(medoc, { lang: 'th', isDesktop: false });
      expect(webCard).toContain('/apps/medoc/');
      expect(webCard).toContain('เพิ่มไปยังหน้าจอโฮม');

      const inDevDetail = renderProductDetailView(mecad, { lang: 'th', isDesktop: false });
      expect(inDevDetail).toContain('กำลังพัฒนา');
      expect(inDevDetail).toContain('shared-indev-notice');
      expect(inDevDetail).not.toContain('detail-channel-card');

      const medocDetail = renderProductDetailView(medoc, { lang: 'th', isDesktop: true, localStatus: { installed: true, version: '1.0.4', exePath: 'C:\\meCraft\\medoc-1.0.4.exe' }, meDocAction: 'open' });
      expect(medocDetail).toContain('เปิด meDoc');
      expect(medocDetail).toContain('744e3a9ae5b61c63171c77aa9cfeee878a7420b7dd4fbb1355c6e486c6d06ef7');

      const retryDetail = renderProductDetailView(medoc, { lang: 'th', isDesktop: true, localStatus: { installed: false }, meDocAction: 'retry' });
      expect(retryDetail).toContain('ลองใหม่');

      const updateDetail = renderProductDetailView(medoc, { lang: 'th', isDesktop: true, localStatus: { installed: true, version: '1.0.3' }, meDocAction: 'update' });
      expect(updateDetail).toContain('อัปเดต meDoc');
      expect(updateDetail).toContain('เปิด meDoc');

      const guide = renderHomeScreenGuideModal(true, 'th');
      expect(guide).toContain('iPhone / iPad (Safari)');
      expect(guide).toContain('Android (Chrome)');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('keeps MeCraftsPortal search, filter pills, detail navigation, and desktop card buttons working', () => {
    const { doc, win } = setupMockDom();
    const appDiv = doc.createElement('div');
    appDiv.id = 'app';
    doc.body.appendChild(appDiv);
    delete (win as any).__TAURI_INTERNALS__;
    delete (globalThis as any).__TAURI_INTERNALS__;
    win.location.hostname = 'mecrafts.vercel.app';
    win.location.pathname = '/';
    win.location.search = '?mode=web';
    win.history = { pushState: vi.fn(), replaceState: vi.fn() };
    new MeCraftsPortal();

    // Web search filters #web-shared-catalog-grid without duplicating #btn-lang listeners
    const searchInput = doc.getElementById('apps-search') as HTMLInputElement;
    expect(searchInput).not.toBeNull();
    searchInput.value = 'med';
    searchInput.dispatchEvent({ type: 'input' } as unknown as Event);
    searchInput.value = 'medoc';
    searchInput.dispatchEvent({ type: 'input' } as unknown as Event);

    const webGrid = doc.getElementById('web-shared-catalog-grid')!;
    const cardsAfterSearch = webGrid.querySelectorAll('.shared-product-card');
    expect(cardsAfterSearch.length).toBe(1);
    expect(cardsAfterSearch[0].getAttribute('data-product-id')).toBe('medoc');

    // Language toggle still switches once (not duplicated by search input)
    const langBtnBefore = doc.getElementById('btn-lang')!;
    const initialLangText = langBtnBefore.textContent;
    langBtnBefore.click();
    expect(doc.getElementById('btn-lang')!.textContent).not.toBe(initialLangText);

    // Clicking product detail link navigates to detail view and back link returns
    const detailLink = doc.getElementById('web-shared-catalog-grid')!.querySelector('[data-product-link="medoc"]') as HTMLAnchorElement;
    expect(detailLink).not.toBeNull();
    detailLink.click();
    expect(doc.getElementById('detail-product-title')?.textContent).toBe('meDoc');
    (doc.querySelector('[data-back-to-library="true"]') as HTMLAnchorElement).click();
    expect(doc.getElementById('web-shared-catalog-grid')).not.toBeNull();

    // Clear search and click top .filter-pill -> syncs #web-shared-catalog-grid
    const resetSearch = doc.getElementById('apps-search') as HTMLInputElement;
    resetSearch.value = '';
    resetSearch.dispatchEvent({ type: 'input' } as unknown as Event);
    const photoPill = Array.from(doc.querySelectorAll('.filter-pill')).find((el: any) => el.getAttribute('data-filter') === 'photo') as HTMLButtonElement;
    photoPill.click();
    const photoCards = Array.from(doc.getElementById('web-shared-catalog-grid')!.querySelectorAll('.shared-product-card')) as Element[];
    expect(photoCards.length).toBeGreaterThan(0);
    expect(photoCards.some(c => c.getAttribute('data-product-id') === 'medoc')).toBe(false);

    // Desktop mode: search keeps card detail buttons alive
    const desktopDom = setupMockDom();
    const desktopApp = desktopDom.doc.createElement('div');
    desktopApp.id = 'app';
    desktopDom.doc.body.appendChild(desktopApp);
    (desktopDom.win as any).__TAURI_INTERNALS__ = {
      invoke: vi.fn().mockResolvedValue(null),
      transformCallback: vi.fn(),
    };
    desktopDom.win.location.search = '?skipSteam=1';
    desktopDom.win.history = { pushState: vi.fn(), replaceState: vi.fn() };
    new MeCraftsPortal();
    const wsSearch = desktopDom.doc.getElementById('ws-studios-search-input') as HTMLInputElement;
    expect(wsSearch).not.toBeNull();
    wsSearch.value = 'medoc';
    wsSearch.dispatchEvent({ type: 'input' } as unknown as Event);
    const wsDetailBtn = desktopDom.doc.getElementById('ws-shared-catalog-grid')!.querySelector('[data-open-product-detail="medoc"]') as HTMLButtonElement;
    expect(wsDetailBtn).not.toBeNull();
    wsDetailBtn.click();
    expect(desktopDom.doc.getElementById('detail-product-title')?.textContent).toBe('meDoc');
  });
});
