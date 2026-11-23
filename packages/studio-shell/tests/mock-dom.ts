/**
 * @file mock-dom.ts
 * Robust Stack-Based HTML Parser Mock DOM for Headless Testing
 */

export class MockElement {
  public tagName: string;
  public className = '';
  public textContent = '';
  public id = '';
  public disabled = false;
  public style: Record<string, string> = {};
  public children: MockElement[] = [];
  public parentNode: MockElement | null = null;
  public attributes: Map<string, string> = new Map();
  public listeners: Record<string, Function[]> = {};
  private _rawHtml = '';

  constructor(tagName = 'DIV') {
    this.tagName = tagName.toUpperCase();
  }

  public set innerHTML(html: string) {
    this._rawHtml = html;
    this.children = parseHtml(html, this);
  }

  public get innerHTML(): string {
    if (this.children.length > 0) {
      return this.children.map(c => c.outerHTML).join('');
    }
    return this._rawHtml || this.textContent;
  }

  public get outerHTML(): string {
    const attrs: string[] = [];
    if (this.id) attrs.push(`id="${this.id}"`);
    if (this.className) attrs.push(`class="${this.className}"`);
    for (const [k, v] of this.attributes.entries()) {
      if (k !== 'id' && k !== 'class') attrs.push(`${k}="${v}"`);
    }
    const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : '';
    const tag = this.tagName.toLowerCase();
    const inner = this.children.length > 0 
      ? this.children.map(c => c.outerHTML).join('') 
      : (this.textContent || this._rawHtml);
    return `<${tag}${attrStr}>${inner}</${tag}>`;
  }

  public setAttribute(name: string, val: string): void {
    this.attributes.set(name, val);
    if (name === 'id') this.id = val;
    if (name === 'class') this.className = val;
  }

  public getAttribute(name: string): string | null {
    if (name === 'id') return this.id || null;
    if (name === 'class') return this.className || null;
    return this.attributes.get(name) || null;
  }

  public hasAttribute(name: string): boolean {
    if (name === 'id') return Boolean(this.id);
    if (name === 'class') return Boolean(this.className);
    return this.attributes.has(name);
  }

  public removeAttribute(name: string): void {
    if (name === 'id') this.id = '';
    if (name === 'class') this.className = '';
    this.attributes.delete(name);
  }

  public addEventListener(event: string, callback: Function): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  public removeEventListener(event: string, callback: Function): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  public dispatchEvent(event: any): boolean {
    event.target = event.target || this;
    const list = this.listeners[event.type || 'click'] || [];
    list.forEach(cb => cb(event));

    // Bubble up to parent
    if (this.parentNode && !event.propagationStopped) {
      this.parentNode.dispatchEvent(event);
    }
    return true;
  }

  public click(): void {
    const event = {
      type: 'click',
      target: this,
      propagationStopped: false,
      preventDefault: () => {},
      stopPropagation: function() { this.propagationStopped = true; },
    };
    this.dispatchEvent(event);
  }

  public appendChild(child: MockElement): MockElement {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  public removeChild(child: MockElement): MockElement {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentNode = null;
    }
    return child;
  }

  public get classList() {
    return {
      add: (...classes: string[]) => {
        const set = new Set(this.className.split(/\s+/).filter(Boolean));
        classes.forEach(c => set.add(c));
        this.className = Array.from(set).join(' ');
      },
      remove: (...classes: string[]) => {
        const set = new Set(this.className.split(/\s+/).filter(Boolean));
        classes.forEach(c => set.delete(c));
        this.className = Array.from(set).join(' ');
      },
      toggle: (c: string, force?: boolean): boolean => {
        const set = new Set(this.className.split(/\s+/).filter(Boolean));
        let result: boolean;
        if (force !== undefined) {
          if (force) set.add(c);
          else set.delete(c);
          result = force;
        } else {
          if (set.has(c)) {
            set.delete(c);
            result = false;
          } else {
            set.add(c);
            result = true;
          }
        }
        this.className = Array.from(set).join(' ');
        return result;
      },
      contains: (c: string): boolean => {
        return this.className.split(/\s+/).filter(Boolean).includes(c);
      },
    };
  }

  public querySelector<T = any>(selector: string): T | null {
    const list = this.querySelectorAll(selector);
    return (list[0] as unknown as T) || null;
  }

  public querySelectorAll(selector: string): MockElement[] {
    const results: MockElement[] = [];

    const matches = (el: MockElement): boolean => {
      if (selector.startsWith('#')) return el.id === selector.slice(1);
      if (selector.startsWith('.')) return el.classList.contains(selector.slice(1));
      if (selector.startsWith('[') && selector.endsWith(']')) {
        const inner = selector.slice(1, -1);
        if (inner.includes('=')) {
          const [k, rawV] = inner.split('=');
          const v = rawV.replace(/['"]/g, '');
          return el.getAttribute(k) === v;
        }
        return el.hasAttribute(inner);
      }
      return el.tagName.toLowerCase() === selector.toLowerCase();
    };

    const traverse = (el: MockElement) => {
      for (const child of el.children) {
        if (matches(child)) results.push(child);
        traverse(child);
      }
    };

    traverse(this);
    return results;
  }

  public closest<T = any>(selector: string): T | null {
    let current: MockElement | null = this;
    while (current) {
      if (selector.startsWith('.')) {
        if (current.classList.contains(selector.slice(1))) return current as unknown as T;
      } else if (selector.startsWith('#')) {
        if (current.id === selector.slice(1)) return current as unknown as T;
      } else if (selector.startsWith('[') && selector.endsWith(']')) {
        const inner = selector.slice(1, -1);
        if (inner.includes('=')) {
          const [k, rawV] = inner.split('=');
          const v = rawV.replace(/['"]/g, '');
          if (current.getAttribute(k) === v) return current as unknown as T;
        } else if (current.hasAttribute(inner)) {
          return current as unknown as T;
        }
      } else if (current.tagName.toLowerCase() === selector.toLowerCase()) {
        return current as unknown as T;
      }
      current = current.parentNode;
    }
    return null;
  }

  public getBoundingClientRect() {
    return {
      width: parseFloat(this.style.width || '260'),
      height: 600,
      top: 0,
      left: 0,
      right: 260,
      bottom: 600,
    };
  }

  public contains(other: any): boolean {
    let current = other;
    while (current) {
      if (current === this) return true;
      current = current.parentNode;
    }
    return false;
  }
}

const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function parseHtml(html: string, parent: MockElement): MockElement[] {
  const root = new MockElement('ROOT');
  const stack: MockElement[] = [root];

  // Tokenize tags and text
  const tokenRegex = /<!--[\s\S]*?-->|<(\/)?([a-zA-Z0-9-]+)([^>]*)>|([^<]+)/g;
  let match;

  while ((match = tokenRegex.exec(html)) !== null) {
    if (match[0].startsWith('<!--')) continue; // Skip HTML comments

    const isClosing = Boolean(match[1]);
    const tagName = match[2];
    const attrsStr = match[3];
    const text = match[4];

    if (text) {
      const trimmed = text.trim();
      if (trimmed) {
        const current = stack[stack.length - 1];
        current.textContent = (current.textContent ? current.textContent + ' ' : '') + trimmed;
      }
    } else if (isClosing) {
      // Find matching tag in stack
      const lower = tagName.toLowerCase();
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tagName.toLowerCase() === lower) {
          stack.length = i;
          break;
        }
      }
    } else if (tagName) {
      const el = new MockElement(tagName);
      const currentParent = stack[stack.length - 1];
      el.parentNode = currentParent === root ? parent : currentParent;
      currentParent.children.push(el);

      // parse attributes
      if (attrsStr) {
        const attrRegex = /([a-zA-Z0-9-_:]+)(?:=["']([^"']*)["'])?/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
          const name = attrMatch[1];
          const val = attrMatch[2] !== undefined ? attrMatch[2] : '';
          el.setAttribute(name, val);
        }
      }

      // If not self-closing and not void element, push to stack
      const isSelfClosing = attrsStr?.trim().endsWith('/') || VOID_ELEMENTS.has(tagName.toLowerCase());
      if (!isSelfClosing) {
        stack.push(el);
      }
    }
  }

  return root.children;
}

export function setupMockDom() {
  const body = new MockElement('BODY');
  const windowListeners: Record<string, Function[]> = {};

  const doc: any = {
    body,
    createElement: (tag: string) => new MockElement(tag),
    querySelector: (sel: string) => body.querySelector(sel),
    querySelectorAll: (sel: string) => body.querySelectorAll(sel),
    addEventListener: (evt: string, cb: Function) => {
      if (!windowListeners[evt]) windowListeners[evt] = [];
      windowListeners[evt].push(cb);
    },
    removeEventListener: (evt: string, cb: Function) => {
      if (windowListeners[evt]) {
        windowListeners[evt] = windowListeners[evt].filter(f => f !== cb);
      }
    },
  };

  const win: any = {
    addEventListener: (evt: string, cb: Function) => {
      if (!windowListeners[evt]) windowListeners[evt] = [];
      windowListeners[evt].push(cb);
    },
    removeEventListener: (evt: string, cb: Function) => {
      if (windowListeners[evt]) {
        windowListeners[evt] = windowListeners[evt].filter(f => f !== cb);
      }
    },
    dispatchEvent: (evt: any) => {
      const list = windowListeners[evt.type || 'keydown'] || [];
      list.forEach(f => f(evt));
      return true;
    },
    requestAnimationFrame: (cb: Function) => setTimeout(cb, 0),
    location: { reload: () => {} },
  };

  (globalThis as any).document = doc;
  (globalThis as any).window = win;
  (globalThis as any).requestAnimationFrame = win.requestAnimationFrame;

  return { doc, win, body };
}
