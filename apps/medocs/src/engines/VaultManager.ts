/**
 * @file VaultManager.ts
 * meDocs Studio — Local-First Document Storage & Vault Manager
 * 100% In-Device File System & Local Storage Persistence
 */

import { parseDocxToHtml, exportHtmlToDocx } from './DocxEngine.js';

export type NativeSaveResult =
  | { status: 'saved'; path: string }
  | { status: 'cancelled' }
  | { status: 'failed' };

export interface VaultDocument {
  id: string;
  name: string;
  path?: string;
  content: string;
  lastModified: number;
  isDirty: boolean;
  format?: 'markdown' | 'docx';
}

export interface RecoverySnapshot {
  id: string;
  docId: string;
  name: string;
  content: string;
  timestamp: number;
  reason: 'autosave' | 'pre-import' | 'manual-backup';
}

const STORAGE_KEY_DOCS = 'medocs_vault_documents';
const STORAGE_KEY_ACTIVE = 'medocs_active_doc_id';
const STORAGE_KEY_RECOVERY = 'medocs_recovery_journal_v1';
const LEGACY_STORAGE_KEY_DOCS = 'medoc_vault_documents';
const LEGACY_STORAGE_KEY_ACTIVE = 'medoc_active_doc_id';
const LEGACY_STORAGE_KEY_RECOVERY = 'medoc_recovery_journal_v1';

const STARTER_WELCOME_MD = `---
title: Welcome to meDocs Studio
date: 2026-11-24
tags: [markdown, katex, typewriter, mecraft]
author: meCraft Creative Team
version: 1.0.0
---

# Welcome to meDocs Studio

> **meDocs** is a distraction-free typographic studio engineered for high-density technical authoring, client-side KaTeX equations, Mermaid diagrams, and instant zero-cloud PDF generation.

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
| **meDocs Studio** | Pure Client-Side Typewriter | 100% In-Device RAM | **Active Production** |
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

export const THAI_OFFICIAL_MEMO_MD = `# บันทึกข้อความ

**ส่วนราชการ:** สำนักวิจัยและพัฒนาระบบ กลุ่มงานสถาปัตยกรรมดิจิทัล โทร. ๐-๒๑๒๓-๔๕๖๗
**ที่:** มค ๐๐๑/๒๕๖๙ **วันที่:** ๒๕ พฤศจิกายน ๒๕๖๙
**เรื่อง:** รายงานผลการทดสอบการใช้งานระบบเอกสารดิจิทัลและแบบอักษรสารบรรณ

---

**เรียน:** ผู้อำนวยการสำนักวิจัยและพัฒนาระบบ

**๑. ข้อเท็จจริง**
ตามที่กลุ่มงานสถาปัตยกรรมดิจิทัล ได้รับมอบหมายให้ดำเนินการพัฒนาและทดสอบระบบเอกสารดิจิทัล meDoc Studio เพื่อรองรับมาตรฐานงานสารบรรณภาครัฐและการแสดงผลภาษาไทยที่มีความละเอียดสูง นั้น

**๒. การดำเนินการ**
กลุ่มงานฯ ได้ดำเนินการตรวจสอบระบบเรียบร้อยแล้ว โดยมีผลการทดสอบดังนี้:
๑. ระบบรองรับการแปลงตัวเลขอารบิกเป็นเลขไทย (๐ ๑ ๒ ๓ ๔ ๕ ๖ ๗ ๘ ๙) ได้อย่างสมบูรณ์
๒. ระบบจัดหน้าและกระจายคำแบบ Thai Justified Inter-Character ได้อย่างถูกต้องตามระเบียบงานสารบรรณ
๓. ระบบคำนวณข้อความจำนวนเงินเป็นตัวอักษรภาษาไทย (BAHTTEXT) ได้อย่างแม่นยำ ๑๐๐%

**๓. ข้อเสนอแนะ**
จึงเรียนมาเพื่อโปรดทราบและพิจารณาอนุมัติให้นำระบบดังกล่าวไปใช้เป็นมาตรฐานต่อไป

<br><br>
(ลงชื่อ)....................................................
(นายเมธา ไตรปาพันจิตต์)
สถาปนิกอาวุโสด้านระบบดิจิทัล
`;

export const THAI_OFFICIAL_LETTER_MD = `<div align="center">

# ครุฑ

</div>

**ที่** มค ๐๑๐๑/ว ๒๕๖๙

**ถึง** ส่วนราชการและหน่วยงานในสังกัด

ด้วย โครงการ meCraft ได้ดำเนินการพัฒนาชุดโปรแกรมสำนักงานระบบความปลอดภัยสูง (Local-First In-Device Memory Execution) เพื่อส่งเสริมการใช้งานซอฟต์แวร์ที่พัฒนาโดยคนไทย และลดการพึ่งพาเทคโนโลยีจากต่างประเทศ

ในการนี้ เพื่อให้การจัดทำเอกสารราชการเป็นไปอย่างมีประสิทธิภาพ ถูกต้องตามระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. ๒๕๒๖ และที่แก้ไขเพิ่มเติม ขอให้หน่วยงานของท่านดำเนินการดังต่อไปนี้:
๑. ใช้แบบอักษร TH Sarabun New ขนาด ๑๖ พอยต์ สำหรับเนื้อหาเอกสาร
๒. ใช้การกระจายคำแบบ Thai Inter-Character เพื่อความเรียบร้อยของรูปเล่ม
๓. จัดเก็บข้อมูลภายในเครื่องแบบ ๑๐๐% In-Device RAM Privacy เพื่อความปลอดภัยสูงสุด

จึงเรียนมาเพื่อโปรดทราบและถือปฏิบัติต่อไป

<br><br>
<div align="right">

(ลงชื่อ)....................................................
(นายเมธา ไตรปาพันจิตต์)
ผู้อำนวยการโครงการ meCraft

</div>
`;

export const THAI_MEETING_MINUTES_MD = `# รายงานการประชุม
## คณะกรรมการพัฒนานวัตกรรมสำนักงานดิจิทัล meCraft
### ครั้งที่ ๑/๒๕๖๙
**วันพุธที่ ๒๕ พฤศจิกายน ๒๕๖๙ เวลา ๐๙.๓๐ น.**
**ณ ห้องประชุมเสมือนจริง meCraft Digital Space**

---

### ผู้มาประชุม
๑. นายเมธา ไตรปาพันจิตต์ — ประธานกรรมการ
๒. คณะที่ปรึกษาด้านสถาปัตยกรรมระบบ — กรรมการ
๓. ผู้แทนฝ่ายทดสอบและประกันคุณภาพ (QA) — กรรมการและเลขานุการ

### เริ่มประชุมเวลา ๐๙.๓๐ น.
ประธานกล่าวเปิดการประชุมและดำเนินการประชุมตามระเบียบวาระดังนี้

**วาระที่ ๑: เรื่องที่ประธานแจ้งให้ที่ประชุมทราบ**
ประธานแจ้งให้ที่ประชุมทราบถึงความสำเร็จในการพัฒนาฟังก์ชันรองรับมาตรฐานภาษาไทย (Thai Typography & Numerals Engine) ในทุกแอปพลิเคชันของ meCraft

**วาระที่ ๒: เรื่องรับรองรายงานการประชุมครั้งที่ผ่านมา**
ที่ประชุมมีมติรับรองรายงานการประชุมครั้งที่ผ่านมาโดยไม่มีการแก้ไข

**วาระที่ ๓: เรื่องสืบเนื่อง**
ความคืบหน้าการพัฒนาโปรแกรมชุดสำนักงานครบทั้ง ๑๕ แอปพลิเคชันและการกระจายคำภาษาไทย

**วาระที่ ๔: เรื่องเพื่อพิจารณา**
การเปิดตัวเวอร์ชันทางการพร้อมตัวติดตั้ง Windows Setup แยกเดี่ยว ๑๕ โปรแกรม

### มติที่ประชุม
เห็นชอบเป็นเอกฉันท์และให้ดำเนินการประชาสัมพันธ์เผยแพร่ต่อไป

### เลิกประชุมเวลา ๑๒.๐๐ น.

<br><br>
(ลงชื่อ).................................................... ผู้จดรายงานการประชุม
(ลงชื่อ).................................................... ผู้ตรวจรายงานการประชุม
`;

export class VaultManager {
  private documents: VaultDocument[] = [];
  private activeId: string = '';
  private inMemoryRecoveryJournal: Record<string, RecoverySnapshot> = {};

  constructor() {
    this.loadFromStorage();
  }

  private getStorage(): Storage | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      return (globalThis as any).localStorage;
    }
    return null;
  }

  private loadFromStorage(): void {
    const storage = this.getStorage();
    if (!storage) {
      this.initDefaultDocuments();
      return;
    }

    try {
      let journalRaw = storage.getItem(STORAGE_KEY_RECOVERY);
      if (!journalRaw) {
        const legacyJournal = storage.getItem(LEGACY_STORAGE_KEY_RECOVERY);
        if (legacyJournal) {
          journalRaw = legacyJournal;
          storage.setItem(STORAGE_KEY_RECOVERY, legacyJournal);
        }
      }
      if (journalRaw) {
        this.inMemoryRecoveryJournal = JSON.parse(journalRaw) || {};
      }
    } catch {
      this.inMemoryRecoveryJournal = {};
    }

    try {
      let stored = storage.getItem(STORAGE_KEY_DOCS);
      if (!stored) {
        const stage = storage.getItem(`${STORAGE_KEY_DOCS}__stage`);
        if (stage) {
          stored = stage;
          storage.setItem(STORAGE_KEY_DOCS, stage);
        }
      }
      if (!stored) {
        const legacyDocs = storage.getItem(LEGACY_STORAGE_KEY_DOCS) || storage.getItem(`${LEGACY_STORAGE_KEY_DOCS}__stage`);
        if (legacyDocs) {
          stored = legacyDocs;
          storage.setItem(STORAGE_KEY_DOCS, legacyDocs);
        }
      }
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.documents = parsed;
          const savedActive = storage.getItem(STORAGE_KEY_ACTIVE) || storage.getItem(LEGACY_STORAGE_KEY_ACTIVE);
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
    const draft: VaultDocument = {
      id: 'doc-draft',
      name: 'Untitled.md',
      content: '# Untitled\n',
      lastModified: Date.now(),
      isDirty: false,
    };
    const welcomeDoc: VaultDocument = {
      id: 'doc-welcome',
      name: 'Welcome to meDocs.md',
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

    this.documents = [draft, welcomeDoc, quantumDoc];
    this.activeId = draft.id;
    this.persist();
  }

  public persist(): void {
    const storage = this.getStorage();
    if (!storage) return;
    try {
      const payload = JSON.stringify(this.documents);
      const stageKey = `${STORAGE_KEY_DOCS}__stage`;
      // 1. Write to stage
      storage.setItem(stageKey, payload);
      // 2. Verify stage integrity
      const readBack = storage.getItem(stageKey);
      if (readBack === payload) {
        // 3. Commit main atomically
        storage.setItem(STORAGE_KEY_DOCS, payload);
        storage.setItem(STORAGE_KEY_ACTIVE, this.activeId);
        // 4. Prune stage
        storage.removeItem(stageKey);
      }
    } catch {
      // Storage quota or disabled
    }
  }

  public saveRecoverySnapshot(docId: string, content: string, reason: 'autosave' | 'pre-import' | 'manual-backup' = 'autosave'): void {
    const doc = this.documents.find(d => d.id === docId);
    const snapshot: RecoverySnapshot = {
      id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      docId,
      name: doc?.name || 'Untitled.md',
      content,
      timestamp: Date.now(),
      reason,
    };
    this.inMemoryRecoveryJournal[docId] = snapshot;

    const storage = this.getStorage();
    if (storage) {
      try {
        const journalRaw = storage.getItem(STORAGE_KEY_RECOVERY);
        const journal: Record<string, RecoverySnapshot> = journalRaw ? JSON.parse(journalRaw) : {};
        journal[docId] = snapshot;
        storage.setItem(STORAGE_KEY_RECOVERY, JSON.stringify(journal));
      } catch {
        // Quota or storage disabled
      }
    }
  }

  public getRecoverySnapshot(docId: string): RecoverySnapshot | null {
    if (this.inMemoryRecoveryJournal[docId]) {
      return this.inMemoryRecoveryJournal[docId];
    }
    const storage = this.getStorage();
    if (storage) {
      for (const storageKey of [STORAGE_KEY_RECOVERY, LEGACY_STORAGE_KEY_RECOVERY]) {
        try {
          const journalRaw = storage.getItem(storageKey);
          if (!journalRaw) continue;
          const journal: Record<string, RecoverySnapshot> = JSON.parse(journalRaw);
          if (journal[docId]) return journal[docId];
        } catch {
          // Continue to fallback key
        }
      }
    }
    return null;
  }

  public getAllRecoverySnapshots(): RecoverySnapshot[] {
    const snapshotsMap: Record<string, RecoverySnapshot> = {};

    const storage = this.getStorage();
    if (storage) {
      for (const storageKey of [LEGACY_STORAGE_KEY_RECOVERY, STORAGE_KEY_RECOVERY]) {
        try {
          const journalRaw = storage.getItem(storageKey);
          if (journalRaw) {
            const storedSnapshots: Record<string, RecoverySnapshot> = JSON.parse(journalRaw);
            for (const [key, snap] of Object.entries(storedSnapshots)) {
              snapshotsMap[key] = snap;
            }
          }
        } catch {
          // Quota or parse issue
        }
      }
    }

    for (const [key, snap] of Object.entries(this.inMemoryRecoveryJournal)) {
      snapshotsMap[key] = snap;
    }

    return Object.values(snapshotsMap).sort((a, b) => b.timestamp - a.timestamp);
  }

  public clearRecoverySnapshot(docId: string): void {
    delete this.inMemoryRecoveryJournal[docId];
    const storage = this.getStorage();
    if (storage) {
      try {
        const journalRaw = storage.getItem(STORAGE_KEY_RECOVERY);
        if (!journalRaw) return;
        const journal: Record<string, RecoverySnapshot> = JSON.parse(journalRaw);
        delete journal[docId];
        storage.setItem(STORAGE_KEY_RECOVERY, JSON.stringify(journal));
      } catch {}
    }
  }

  public restoreFromRecovery(docId: string): boolean {
    const snapshot = this.getRecoverySnapshot(docId);
    if (!snapshot) return false;
    let doc = this.documents.find(d => d.id === docId);
    if (!doc) {
      doc = {
        id: docId,
        name: snapshot.name || 'Restored.md',
        content: snapshot.content,
        lastModified: snapshot.timestamp,
        isDirty: false,
      };
      this.documents.push(doc);
    } else {
      doc.content = snapshot.content;
      doc.lastModified = snapshot.timestamp;
      doc.isDirty = false;
    }
    this.activeId = doc.id;
    this.persist();
    this.clearRecoverySnapshot(docId);
    return true;
  }

  public getRecentDocuments(limit: number = 10): VaultDocument[] {
    return [...this.documents]
      .sort((a, b) => b.lastModified - a.lastModified)
      .slice(0, limit);
  }

  public backupDocument(id: string): VaultDocument | null {
    const doc = this.documents.find(d => d.id === id);
    if (!doc) return null;
    const base = doc.name.replace(/\.md$/, '');
    const backupName = `${base}.bak.md`;
    const backupDoc: VaultDocument = {
      id: `doc-bak-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: backupName,
      content: doc.content,
      lastModified: Date.now(),
      isDirty: false,
    };
    this.documents.push(backupDoc);
    this.saveRecoverySnapshot(id, doc.content, 'manual-backup');
    this.persist();
    return backupDoc;
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

  public createDocumentFromTemplate(type: 'memo' | 'letter' | 'meeting'): VaultDocument {
    if (type === 'memo') {
      return this.createDocument('บันทึกข้อความ.md', THAI_OFFICIAL_MEMO_MD);
    } else if (type === 'letter') {
      return this.createDocument('หนังสือภายนอก.md', THAI_OFFICIAL_LETTER_MD);
    } else {
      return this.createDocument('รายงานการประชุม.md', THAI_MEETING_MINUTES_MD);
    }
  }

  public updateDocumentContent(id: string, content: string): void {
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      doc.content = content;
      doc.lastModified = Date.now();
      doc.isDirty = true;
      this.saveRecoverySnapshot(id, content, 'autosave');
      this.persist();
    }
  }

  public markSaved(id: string): void {
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      doc.isDirty = false;
      this.clearRecoverySnapshot(id);
      this.persist();
    }
  }

  public renameDocument(id: string, newName: string): void {
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      if (newName.endsWith('.md') || newName.endsWith('.docx')) {
        doc.name = newName;
      } else {
        const ext = doc.format === 'docx' ? '.docx' : '.md';
        doc.name = `${newName}${ext}`;
      }
      doc.lastModified = Date.now();
      this.persist();
    }
  }

  public deleteDocument(id: string): boolean {
    const idx = this.documents.findIndex(d => d.id === id);
    if (idx === -1) return false;

    this.clearRecoverySnapshot(id);
    this.documents.splice(idx, 1);
    if (this.activeId === id) {
      this.activeId = this.documents.length > 0 ? this.documents[0].id : '';
    }
    this.persist();
    return true;
  }

  public async importFile(file: File): Promise<VaultDocument> {
    const isDocx = file.name.toLowerCase().endsWith('.docx');
    let content: string;
    let format: 'markdown' | 'docx' = 'markdown';

    if (isDocx) {
      const buffer = await file.arrayBuffer();
      content = await parseDocxToHtml(buffer);
      format = 'docx';
    } else {
      content = await file.text();
    }

    const current = this.getActiveDocument();
    if (current && current.isDirty) {
      this.saveRecoverySnapshot(current.id, current.content, 'pre-import');
    }
    const doc = this.createDocument(file.name, content);
    doc.format = format;
    this.persist();
    return doc;
  }

  public async exportDocxFile(doc: VaultDocument, customHtml?: string): Promise<Uint8Array | null> {
    const htmlToExport = customHtml !== undefined ? customHtml : doc.content;
    const title = doc.name.replace(/\.[^.]+$/, '');
    const bytes = await exportHtmlToDocx(htmlToExport, { title });

    if (typeof window !== 'undefined' && window.document) {
      const blob = new Blob([bytes as any], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    return bytes;
  }

  public async saveToNativeDisk(fileName: string, data: Uint8Array | string, existingPath?: string): Promise<NativeSaveResult> {
    try {
      const { save } = await import('@tauri-apps/plugin-dialog');
      const { writeFile } = await import('@tauri-apps/plugin-fs');
      const ext = fileName.toLowerCase().endsWith('.docx') ? 'docx' : 'md';
      const filePath = existingPath ?? await save({
        defaultPath: fileName,
        filters: [
          { name: ext === 'docx' ? 'Word Document (*.docx)' : 'Markdown Document (*.md)', extensions: [ext] },
          { name: 'All Files (*.*)', extensions: ['*'] },
        ],
      });
      if (filePath) {
        const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
        await writeFile(filePath, bytes);
        return { status: 'saved', path: filePath };
      }
    } catch {
      return { status: 'failed' };
    }
    return { status: 'cancelled' };
  }

  public exportMarkdownFile(doc: VaultDocument): void {
    if (typeof window === 'undefined' || !window.document) return;
    const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name.endsWith('.md') ? doc.name : `${doc.name.replace(/\.[^.]+$/, '')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
