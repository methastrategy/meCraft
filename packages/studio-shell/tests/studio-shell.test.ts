import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupMockDom, MockElement } from './mock-dom.js';
import {
  StudioShell,
  TitleBar,
  MenuBar,
  CommandRibbon,
  Cockpit,
  CockpitSplitter,
  StatusBar,
  UpdateBanner,
  UpdateModal,
  ToastManager,
  ModalManager,
} from '../src/index.js';

describe('@mecraft/studio-shell Architecture & Components Suite', () => {
  beforeEach(() => {
    setupMockDom();
  });

  describe('1. TitleBar Component', () => {
    it('renders app name, tags, and document title', () => {
      const titleBar = new TitleBar({
        appName: 'meVector Studio',
        appTag: 'PRO',
        documentTitle: 'Artwork_01.svg',
      });
      const el = titleBar.getElement();
      expect(el.innerHTML).toContain('meVector Studio');
      expect(el.innerHTML).toContain('PRO');
      expect(el.innerHTML).toContain('— [Artwork_01.svg]');
      expect(el.innerHTML).toContain('100% Native Desktop');
    });

    it('updates document title dynamically', () => {
      const titleBar = new TitleBar({
        appName: 'mePDF Studio',
        documentTitle: 'Contract.pdf',
      });
      titleBar.setDocumentTitle('Invoice_Final.pdf');
      const docNameEl = titleBar.getElement().querySelector('.titlebar-doc-name');
      expect(docNameEl?.textContent).toBe('— [Invoice_Final.pdf]');
    });

    it('triggers minimize, maximize, and close callbacks', () => {
      const onMin = vi.fn();
      const onMax = vi.fn();
      const onClose = vi.fn();

      const titleBar = new TitleBar({
        appName: 'mePhoto',
        onMinimize: onMin,
        onMaximize: onMax,
        onClose: onClose,
      });

      (titleBar.getElement().querySelector('#titlebar-btn-min') as HTMLElement)?.click();
      expect(onMin).toHaveBeenCalledTimes(1);

      (titleBar.getElement().querySelector('#titlebar-btn-max') as HTMLElement)?.click();
      expect(onMax).toHaveBeenCalledTimes(1);

      (titleBar.getElement().querySelector('#titlebar-btn-close') as HTMLElement)?.click();
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('2. MenuBar Component', () => {
    it('renders menu groups and executes item action on click', () => {
      const saveAction = vi.fn();
      const menuBar = new MenuBar({
        appName: 'mePDF Pro',
        groups: [
          {
            id: 'file',
            label: 'File',
            items: [
              { id: 'open', label: 'Open...', shortcut: 'Ctrl+O' },
              { id: 'save', label: 'Save Document', shortcut: 'Ctrl+S', action: saveAction },
            ],
          },
        ],
      });

      const el = menuBar.getElement();
      expect(el.innerHTML).toContain('File');

      // Click on menu button to open dropdown
      const fileBtn = el.querySelector('.menubar-btn') as HTMLElement | null;
      fileBtn?.click();
      expect(el.innerHTML).toContain('Save Document');

      // Click on save item
      const saveItem = el.querySelector('[data-item-id="save"]') as HTMLElement | null;
      saveItem?.click();
      expect(saveAction).toHaveBeenCalledTimes(1);
    });

    it('dispatches global keyboard shortcuts registered in menu', () => {
      const openAction = vi.fn();
      new MenuBar({
        appName: 'mePDF',
        groups: [
          {
            id: 'file',
            label: 'File',
            items: [
              { id: 'open', label: 'Open File', shortcut: 'Ctrl+O', action: openAction },
            ],
          },
        ],
      });

      // Simulate global keydown event on window
      window.dispatchEvent({
        type: 'keydown',
        key: 'o',
        ctrlKey: true,
        preventDefault: vi.fn(),
      } as any);

      expect(openAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('3. CommandRibbon Component', () => {
    it('renders tools and triggers tool action on click', () => {
      const zoomInAction = vi.fn();
      const ribbon = new CommandRibbon({
        groups: [
          {
            id: 'zoom',
            align: 'left',
            tools: [
              { id: 'zoom-in', label: 'Zoom In', icon: '🔍+', action: zoomInAction },
              { id: 'sep', type: 'separator' },
            ],
          },
        ],
      });

      const el = ribbon.getElement();
      expect(el.innerHTML).toContain('Zoom In');

      const toolBtn = el.querySelector('[data-tool-id="zoom-in"]') as HTMLElement | null;
      toolBtn?.click();
      expect(zoomInAction).toHaveBeenCalledTimes(1);
    });

    it('manages active and disabled states for ribbon tools', () => {
      const ribbon = new CommandRibbon({
        groups: [
          {
            id: 'edit',
            tools: [{ id: 'hand-tool', label: 'Hand' }],
          },
        ],
      });

      ribbon.setToolActive('hand-tool', true);
      const btn = ribbon.getElement().querySelector('[data-tool-id="hand-tool"]') as any;
      expect(btn?.classList.contains('active')).toBe(true);

      ribbon.setToolDisabled('hand-tool', true);
      expect(btn?.disabled).toBe(true);
    });
  });

  describe('4. Cockpit & Splitter (3-Pane Layout)', () => {
    it('renders Left Drawer, Center Stage, and Right Drawer', () => {
      const cockpit = new Cockpit({
        left: { title: 'Pages', initialWidth: 240 },
        center: { content: '<div id="main-canvas">Canvas</div>' },
        right: { title: 'Inspector', initialWidth: 280 },
      });

      const el = cockpit.getElement();
      expect(el.innerHTML).toContain('Pages');
      expect(el.innerHTML).toContain('Inspector');
      expect(el.innerHTML).toContain('Canvas');
      expect(cockpit.getLeftPane()).not.toBeNull();
      expect(cockpit.getRightPane()).not.toBeNull();
    });

    it('handles splitter collapse toggle button', () => {
      const onCollapse = vi.fn();
      const targetPane = new MockElement('ASIDE');

      const splitter = new CockpitSplitter({
        orientation: 'left',
        targetPane: targetPane as any,
        onToggleCollapse: onCollapse,
      });

      const btn = splitter.getElement().querySelector('.splitter-collapse-btn') as HTMLElement | null;
      btn?.click();
      expect(targetPane.classList.contains('collapsed')).toBe(true);
      expect(onCollapse).toHaveBeenCalledWith(true);
    });

    it('updates center content dynamically', () => {
      const cockpit = new Cockpit({
        center: { content: 'Initial' },
      });
      cockpit.setCenterContent('<p id="new-doc">Updated Document</p>');
      expect(cockpit.getCenterStage().innerHTML).toContain('Updated Document');
    });
  });

  describe('5. StatusBar Component', () => {
    it('renders status indicators, privacy shield badge, and version', () => {
      const status = new StatusBar({
        version: '1.0.0',
        items: [
          { id: 'page-count', align: 'left', content: 'Page 1 / 10' },
          { id: 'zoom', align: 'right', content: '100%' },
        ],
      });

      const el = status.getElement();
      expect(el.innerHTML).toContain('Page 1 / 10');
      expect(el.innerHTML).toContain('100% In-Device Privacy');
      expect(el.innerHTML).toContain('v1.0.0');
    });

    it('updates status item text dynamically', () => {
      const status = new StatusBar({
        version: '1.0.0',
        items: [{ id: 'status-msg', content: 'Idle' }],
      });
      status.updateItem('status-msg', 'Saving document...');
      const itemEl = status.getElement().querySelector('[data-status-id="status-msg"]');
      expect(itemEl?.textContent).toBe('Saving document...');
    });
  });

  describe('6. In-App One-Click Update Engine', () => {
    it('renders update banner and triggers modal on update click', () => {
      const onOpen = vi.fn();
      const banner = new UpdateBanner({
        config: {
          currentVersion: '1.0.0',
          latestVersion: '1.0.1',
          changelog: ['Fixed minor glitch'],
        },
        onOpenModal: onOpen,
      });

      expect(banner.getElement().innerHTML).toContain('v1.0.1');
      (banner.getElement().querySelector('#btn-banner-update') as HTMLElement)?.click();
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('renders UpdateModal with version comparison card', () => {
      const modal = new UpdateModal({
        currentVersion: '1.0.0',
        latestVersion: '1.0.1',
        changelog: ['Feature A', 'Feature B'],
      });

      modal.open();
      const dialog = document.querySelector('.update-modal-dialog');
      expect(dialog?.innerHTML).toContain('v1.0.0');
      expect(dialog?.innerHTML).toContain('v1.0.1');
      expect(dialog?.innerHTML).toContain('Feature A');
    });
  });

  describe('7. StudioShell Master Orchestrator', () => {
    it('mounts into container and exposes API methods cleanly', () => {
      const container = new MockElement('DIV');
      document.body.appendChild(container as any);

      const shell = new StudioShell({
        appId: 'mevector',
        appName: 'meVector Studio',
        version: '1.0.0',
        documentTitle: 'Logo_Concept.svg',
        panes: {
          left: { title: 'Layers' },
          center: { content: '<svg id="vector-stage"></svg>' },
          right: { title: 'Nodes' },
        },
        statusBar: {
          items: [{ id: 'coords', content: 'X: 100, Y: 200' }],
        },
      });

      shell.mount(container as any);
      expect(container.innerHTML).toContain('meVector Studio');
      expect(container.innerHTML).toContain('Logo_Concept.svg');
      expect(container.innerHTML).toContain('Layers');
      expect(container.innerHTML).toContain('Nodes');

      // Test title update
      shell.setDocumentTitle('Banner_Final.svg');
      expect(container.innerHTML).toContain('Banner_Final.svg');

      // Test toast
      shell.toast('Vector exported successfully', { type: 'success' });
      expect(document.body.innerHTML).toContain('Vector exported successfully');

      // Test modal
      const { close } = shell.modal({
        title: 'Export Vector',
        body: '<p>Choose resolution</p>',
      });
      expect(document.body.innerHTML).toContain('Export Vector');
      close();
    });
  });
});
