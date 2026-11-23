/**
 * @file types.ts
 * Core contracts and data contracts for @mecraft/studio-shell
 */

export interface MenuItem {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  divider?: boolean;
  badge?: string;
  action?: () => void;
  subItems?: MenuItem[];
}

export interface MenuGroup {
  id: string;
  label: string;
  items: MenuItem[];
}

export type RibbonToolType = 'button' | 'toggle' | 'separator' | 'select' | 'custom';

export interface RibbonTool {
  id: string;
  label?: string;
  icon?: string;
  title?: string;
  type?: RibbonToolType;
  active?: boolean;
  disabled?: boolean;
  action?: (e: MouseEvent) => void;
  options?: Array<{ value: string; label: string }>;
  onSelect?: (value: string) => void;
  customHtml?: string;
}

export interface RibbonGroup {
  id: string;
  align?: 'left' | 'center' | 'right';
  tools: RibbonTool[];
}

export interface PaneTab {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
  render?: () => HTMLElement | string;
}

export interface PaneConfig {
  id?: string;
  title: string;
  icon?: string;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  collapsible?: boolean;
  collapsed?: boolean;
  tabs?: PaneTab[];
  activeTabId?: string;
  content?: HTMLElement | string | (() => HTMLElement | string);
  onTabChange?: (tabId: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export interface CenterPaneConfig {
  content: HTMLElement | string | (() => HTMLElement | string);
  emptyPlaceholder?: {
    icon?: string;
    title: string;
    subtitle: string;
    actionLabel?: string;
    onAction?: () => void;
  };
  onDropFiles?: (files: File[]) => void;
}

export interface StatusBarItem {
  id: string;
  align?: 'left' | 'center' | 'right';
  content: string | HTMLElement;
  title?: string;
  onClick?: () => void;
}

export interface UpdateConfig {
  currentVersion: string;
  latestVersion: string;
  releaseDate?: string;
  changelog: string[];
  downloadUrl?: string;
  hasUpdate?: boolean;
  onDownloadUpdate?: (onProgress: (percent: number) => void) => Promise<boolean>;
  onRestart?: () => void;
}

export interface ToastOptions {
  type?: 'info' | 'success' | 'warning' | 'error';
  durationMs?: number;
}

export interface ModalOptions {
  title: string;
  body: HTMLElement | string;
  footer?: HTMLElement | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
  onClose?: () => void;
}

export interface StudioShellConfig {
  appId: string;
  appName: string;
  appIcon?: string;
  appTag?: string;
  version: string;
  documentTitle?: string;
  theme?: 'navy-black' | 'obsidian' | 'luxury-dark';
  isTauri?: boolean;
  menu?: MenuGroup[];
  ribbon?: RibbonGroup[];
  panes: {
    left?: PaneConfig;
    center: CenterPaneConfig;
    right?: PaneConfig;
  };
  statusBar?: {
    items?: StatusBarItem[];
    showPrivacyBadge?: boolean;
  };
  update?: UpdateConfig;
}
