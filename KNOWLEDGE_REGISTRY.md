# 🧠 meCraft Knowledge Registry & Invariants

| What (สิ่งที่เกิดขึ้น/ได้เรียนรู้) | Why (เหตุผล/รากเหง้าปัญหา) | How (วิธีการแก้/มาตรฐานปฏิบัติ) | Scope (ขอบเขตที่มีผล) |
|:---|:---|:---|:---|
| Monorepo PostCSS Token Import Failure | Vite alias `@mecraft/ui-tokens` ชี้เฉพาะ `.ts` ทำให้ `@import 'tokens.css'` พัง | กำหนด explicit alias สำหรับ `@mecraft/ui-tokens/tokens.css` ใน `vite.config.ts` ทุกแอปเสมอ | Monorepo Apps / Vite |
| Triplicated Image Engine Drift | โค้ด `photo-processor.ts` ถูกก็อปปี้ไว้ 3 ที่ (`src/`, `mepdf/`, `mephoto/`) ทำให้การอัปเกรดไม่ซิงก์กัน | สกัดเป็นแพ็กเกจกลาง `@mecraft/photo-core` และให้ทุกแอป import จากแพ็กเกจเดียว | Core Engines / Packages |
| Ghost Monorepo Test Inflation | โฟลเดอร์ `tests/` เดิมที่ Root ทำให้ Vitest รันเทสต์ซ้ำซ้อน 370 tests (ซ้ำ 2 รอบ) | ใช้ `vitest.workspace.ts` คุม workspace ชัดเจน และล้างโฟลเดอร์ Root ให้เหลือเฉพาะ orchestrator | Testing / Vitest |
| Launcher App ID Security Bottleneck | การใช้ Static Slice Whitelist ใน Rust ขัดขวางการเพิ่มแอปใหม่ใน Ecosystem | ใช้ Structural Validation (`^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$`) บล็อก Path Traversal 100% พร้อมรองรับแอปใหม่ทันที | Desktop Launcher / Rust IPC |
| 4-Point Homography Singular Fallback | จุดลากมุม 4 จุดของเอกสารอาจซ้อนทับกัน (Collinear/Degenerate) ทำให้เมทริกซ์ $3\times3$ เป็น Singular Matrix | ครอบ `solveHomography` ด้วย try/catch หาก Singular ให้ Fallback กลับภาพเดิมโดย UI ไม่แครช | `@mecraft/photo-core` |
| Client-Side Searchable PDF Injection | สแกนเอกสารกลายเป็นพิกเซลแบนๆ ค้นหาไม่ได้ | ฝัง Invisible Searchable Text Layer (`opacity: 0.0`) ทับตำแหน่งตัวอักษรด้วย `pdf-lib` ทำให้ `Ctrl+F` และเลือกข้อความได้ทันที | `apps/mepdf` |
| Universal Inter-App ClipBus | ผู้ใช้ต้องเซฟไฟล์ลงเครื่องก่อนเปิดในอีกแอป | ใช้ `UniversalClipBus` สื่อสารผ่าน `BroadcastChannel` + `localStorage` fallback พร้อมระบบลบข้อความซ้ำ | `@mecraft/core-bridge` |
| Undo/Redo Inspector Desynchronization | การย้อนกลับค่า Recipe ในหน่วยความจำ ไม่ได้สั่งอัปเดตสไลเดอร์บนหน้าจอ | ทำ `syncInspectorToActiveRecipe()` อัปเดตทั้งสไลเดอร์ ตัวเลข และจุด Pin ทุกครั้งที่กด Undo/Redo | `apps/mephoto` |
| Dual-Action Launcher Web/Desktop Continuum | ผู้ใช้บนเว็บกด Launch แล้วไม่เกิดอะไรขึ้นเพราะไม่มีไฟล์ .exe ในเครื่อง | ทำปุ่มคู่ "Open Web Studio" (เปิดในเบราว์เซอร์ทันที) ควบคู่กับ "Install / Launch Desktop" และส่งข้อมูลไฟล์ข้ามแท็บผ่าน URL / ClipBus | `apps/mecraft-launcher` & `core-bridge` |
| Universal Hub Drop Zone Auto-Routing | ผู้ใช้ต้องเลือกเปิดแอปก่อนแล้วค่อยโหลดไฟล์ | สร้าง Drop Zone กลางที่หน้า Hub ดักตรวจนามสกุลไฟล์ (.pdf -> mePDF, ภาพ -> mePhoto) แล้วเปิดแอปที่ตรงกันทันทีพร้อมบันทึกประวัติ | `apps/mecraft-launcher` |
| Workspace Junction Drift After Directory Relocation | ย้ายโฟลเดอร์โปรเจกต์ข้ามไดเรกทอรี ทำให้ Windows Junctions ใน `node_modules/@mecraft/*` ยังชี้ไปที่พาธเดิม ส่งผลให้ Vitest หาแพ็กเกจภายใน monorepo ไม่เจอ | รัน `npm install` เพื่อซิงก์และรีลิงก์ Windows Junctions ไปยัง CWD ใหม่โดยอัตโนมัติ | Monorepo / Workspaces / Windows CLI |
