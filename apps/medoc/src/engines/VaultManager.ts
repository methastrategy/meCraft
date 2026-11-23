/**
 * @file VaultManager.ts
 * meDoc Studio — Local-First Document Storage & Vault Manager
 * 100% In-Device File System & Local Storage Persistence
 */

export interface VaultDocument {
  id: string;
  name: string;
  path?: string;
  content: string;
  lastModified: number;
  isDirty: boolean;
}

const STORAGE_KEY_DOCS = 'medoc_vault_documents';
const STORAGE_KEY_ACTIVE = 'medoc_active_doc_id';

const STARTER_WELCOME_MD = `---
title: Welcome to meDoc Studio
date: 2026-11-24
tags: [markdown, katex, typewriter, mecraft]
author: meCraft Creative Team
version: 1.0.0
---

# Welcome to meDoc Studio

> **meDoc** is a distraction-free typographic studio engineered for high-density technical authoring, client-side KaTeX equations, Mermaid diagrams, and instant zero-cloud PDF generation.

---

## 1. Mathematical Rigor with KaTeX

Write inline formulas effortlessly: the mass-energy equivalence $E = mc^2$ or the Gaussian normal distribution formula:

$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$$

Euler's identity binds five fundamental constants:

$$e^{i\\pi} + 1 = 0$$

## 2. Mermaid Diagram Engine

Diagrams render client-side without external dependencies:

\`\`\`mermaid
graph TD
  A[Markdown Source] --> B(AST Parser)
  B --> C{KaTeX & Mermaid}
  C -->|Math Engine| D[Vector Typography]
  C -->|Flowchart Engine| E[SVG Canvas]
  D --> F[Zero-Cloud Client Preview]
  E --> F
\`\`\`

## 3. High-Density Code Highlighting

Clean, readable syntax highlighting for modern software stacks:

\`\`\`typescript
import { PDFDocument } from 'pdf-lib';

export async function generateDocument(markdown: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  // 100% In-Device Memory Execution
  return await doc.save();
}
\`\`\`

## 4. Typographic Tables

| Component | Architecture | Privacy Standard | Status |
| :--- | :--- | :--- | :--- |
| **meDoc Studio** | Pure Client-Side Typewriter | 100% In-Device RAM | **Active Production** |
| **mePDF Studio** | High-Throughput PDF Engine | Zero-Cloud Upload | **Active Production** |
| **mePhoto Studio** | OpenCV Perspective Deskew | Zero External API | **Active Production** |
| **meDrop Utility** | Zero-Window Radial HUD | 100% Local-First | **Active Production** |

---

*Enjoy distraction-free writing in Zen Mode (\`Ctrl+Shift+Z\`)!*
`;

const STARTER_QUANTUM_MD = `---
title: Quantum Mechanics Notes
tags: [physics, quantum, math]
---

# Quantum Mechanics & Linear Algebra

## Schrödinger Equation

The time-dependent Schrödinger equation governs quantum state evolution:

$$i\\hbar \\frac{\\partial}{\\partial t} |\\Psi(t)\\rangle = \\hat{H} |\\Psi(t)\\rangle$$

## Pauli Matrices

In a 2-level quantum spin system, observables correspond to the Pauli matrices:

$$\\sigma_x = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\quad \\sigma_y = \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix}, \\quad \\sigma_z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$$
`;

export class VaultManager {
  private documents: VaultDocument[] = [];
  private activeId: string = '';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      this.initDefaultDocuments();
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY_DOCS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.documents = parsed;
          const savedActive = localStorage.getItem(STORAGE_KEY_ACTIVE);
          this.activeId = savedActive && this.documents.some(d => d.id === savedActive)
            ? savedActive
            : this.documents[0].id;
          return;
        }
      }
    } catch {
      // Fallback on parse failure
    }

    this.initDefaultDocuments();
  }

  private initDefaultDocuments(): void {
    const welcomeDoc: VaultDocument = {
      id: 'doc-welcome',
      name: 'Welcome to meDoc.md',
      content: STARTER_WELCOME_MD,
      lastModified: Date.now(),
      isDirty: false,
    };

    const quantumDoc: VaultDocument = {
      id: 'doc-quantum',
      name: 'Quantum Notes.md',
      content: STARTER_QUANTUM_MD,
      lastModified: Date.now(),
      isDirty: false,
    };

    this.documents = [welcomeDoc, quantumDoc];
    this.activeId = welcomeDoc.id;
    this.persist();
  }

  public persist(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(this.documents));
      localStorage.setItem(STORAGE_KEY_ACTIVE, this.activeId);
    } catch {
      // Storage quota or disabled
    }
  }

  public getDocuments(): VaultDocument[] {
    return [...this.documents];
  }

  public getActiveDocument(): VaultDocument {
    const active = this.documents.find(d => d.id === this.activeId);
    if (active) return active;
    if (this.documents.length > 0) {
      this.activeId = this.documents[0].id;
      return this.documents[0];
    }
    return this.createDocument('Untitled.md', '# Untitled\n\nStart writing...');
  }

  public selectDocument(id: string): VaultDocument | null {
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      this.activeId = id;
      this.persist();
      return doc;
    }
    return null;
  }

  public createDocument(name: string = 'Untitled.md', content: string = '# Untitled\n\n'): VaultDocument {
    const cleanName = name.endsWith('.md') ? name : `${name}.md`;
    const newDoc: VaultDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: cleanName,
      content,
      lastModified: Date.now(),
      isDirty: false,
    };
    this.documents.unshift(newDoc);
    this.activeId = newDoc.id;
    this.persist();
    return newDoc;
  }

  public updateDocumentContent(id: string, content: string): void {
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      doc.content = content;
      doc.lastModified = Date.now();
      doc.isDirty = true;
      this.persist();
    }
  }

  public markSaved(id: string): void {
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      doc.isDirty = false;
      this.persist();
    }
  }

  public renameDocument(id: string, newName: string): void {
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      doc.name = newName.endsWith('.md') ? newName : `${newName}.md`;
      doc.lastModified = Date.now();
      this.persist();
    }
  }

  public deleteDocument(id: string): boolean {
    const idx = this.documents.findIndex(d => d.id === id);
    if (idx === -1) return false;

    this.documents.splice(idx, 1);
    if (this.activeId === id) {
      this.activeId = this.documents.length > 0 ? this.documents[0].id : '';
    }
    this.persist();
    return true;
  }

  public async importFile(file: File): Promise<VaultDocument> {
    const content = await file.text();
    return this.createDocument(file.name, content);
  }

  public exportMarkdownFile(doc: VaultDocument): void {
    if (typeof window === 'undefined' || !window.document) return;
    const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
