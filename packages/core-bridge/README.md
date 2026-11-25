# @mecraft/core-bridge

> **Universal IPC, ClipBus Bus, File I/O & Thai Localization Core Engine**  
> *Category: SHARED PACKAGE · Status: Stable v1.0.0 · Suite: meCraft*

---

## 📌 Overview
`@mecraft/core-bridge` provides the universal hardware, file system, IPC, and localization abstraction layer shared across all 15 meCraft applications.

### Key Capabilities:
1. **Universal Launcher Bridge:** Adapts seamlessly between Tauri v2 desktop IPC (`invoke`) and browser web fallbacks.
2. **Universal ClipBus:** High-performance cross-tab and cross-app asset transmission using `BroadcastChannel` with `localStorage` fallback buffer.
3. **Thai Localization Engine (`thai-utils.ts`):**
   - `toThaiNumerals(input)`: Arabic digits (0-9) to Thai numerals (๐-๙).
   - `toArabicNumerals(input)`: Thai numerals to Arabic digits.
   - `toThaiBahtText(amount)`: Numeric currency into Thai Baht text (`1250.50` -> `หนึ่งพันสองร้อยห้าสิบบาทห้าสิบสตางค์`).
   - `toThaiBuddhistYear(date)` & `formatThaiDate(date)`: Formats standard Thai Buddhist Era (พ.ศ.) dates.
   - `segmentThaiWords(text)` & `countWordsThaiMixed(text)`: Thai-Latin mixed word boundary counting via `Intl.Segmenter`.
4. **Offline Entitlements & Session:** In-memory licensing and verification with zero remote telemetry.
