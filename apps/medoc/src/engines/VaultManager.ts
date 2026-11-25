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
