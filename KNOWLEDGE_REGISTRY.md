# 🧠 meCraft Knowledge Registry & Invariants

| What (สิ่งที่เกิดขึ้น/ได้เรียนรู้) | Why (เหตุผล/รากเหง้าปัญหา) | How (วิธีการแก้/มาตรฐานปฏิบัติ) | Scope (ขอบเขตที่มีผล) |
|:---|:---|:---|:---|
| Monorepo PostCSS Token Import Failure | Vite alias `@mecraft/ui-tokens` ชี้เฉพาะ `.ts` ทำให้ `@import 'tokens.css'` พัง | กำหนด explicit alias สำหรับ `@mecraft/ui-tokens/tokens.css` ใน `vite.config.ts` ทุกแอปเสมอ | Monorepo Apps / Vite |
| Triplicated Image Engine Drift | โค้ด `photo-processor.ts` ถูกก็อปปี้ไว้ 3 ที่ (`src/`, `mepdf/`, `mephoto/`) ทำให้การอัปเกรดไม่ซิงก์กัน | สกัดเป็นแพ็กเกจกลาง `@mecraft/photo-core` และให้ทุกแอป import จากแพ็กเกจเดียว | Core Engines / Packages |
| Ghost Monorepo Test Inflation | โฟลเดอร์ `tests/` เดิมที่ Root ทำให้ Vitest รันเทสต์ซ้ำซ้อน 370 tests (ซ้ำ 2 รอบ) | ใช้ `vitest.workspace.ts` คุม workspace ชัดเจน และล้างโฟลเดอร์ Root ให้เหลือเฉพาะ orchestrator | Testing / Vitest |
| Launcher App ID Security Bottleneck | การใช้ Static Slice Whitelist ใน Rust ขัดขวางการเพิ่มแอปใหม่ใน Ecosystem | ใช้ Structural Validation (`^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$`) บล็อก Path Traversal 100% พร้อมรองรับแอปใหม่ทันที | Desktop Launcher / Rust IPC |
