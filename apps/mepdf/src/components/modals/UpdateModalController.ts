import type { ModalContext } from './ModalContext';

export interface UpdateInfo {
  currentVersion: string;
  latestVersion: string;
  releaseDate: string;
  changelog: string[];
  mandatory: boolean;
}

export class UpdateModalController {
  private ctx: ModalContext;
  private downloadProgress = 0;
  private isDownloadComplete = false;
  private progressInterval: ReturnType<typeof setInterval> | null = null;

  constructor(ctx: ModalContext) {
    this.ctx = ctx;
  }

  public show(info?: Partial<UpdateInfo>): void {
    const updateInfo: UpdateInfo = {
      currentVersion: info?.currentVersion || '1.0.0',
      latestVersion: info?.latestVersion || '1.0.0',
      releaseDate: info?.releaseDate || '2026-11-23',
      changelog: info?.changelog || [
        '🎨 โฉมใหม่: Navy Black Pro Studio ธีมน้ำเงินดำ สบายตา สไตล์ Adobe Acrobat Pro',
        '⚡ 4-Point Camera Perspective Deskew (ดึงเอกสารที่ถ่ายจากมือถือให้ตรงระนาบ)',
        '🔍 Invisible Searchable OCR Layer (สแกนข้อความไทย-อังกฤษ ค้นหาด้วย Ctrl+F ได้ทันที)',
        '🗜️ Dual-Engine Smart Compression (บีบอัดลดขนาดไฟล์สูงสุด 90% โดยไม่เสียความคมชัด)',
        '🛡️ AES-256 PDF Password Vault & Security Sanitizer (ลบประวัติความลับในไฟล์)',
        '🚀 In-App One-Click Update: อัปเดตเวอร์ชันใหม่ในคลิกเดียว ไม่ต้องเข้าเว็บดาวน์โหลดซ้ำ'
      ],
      mandatory: info?.mandatory || false,
    };

    const isUpToDate = updateInfo.currentVersion === updateInfo.latestVersion;
    const modalTitle = `<i data-lucide="sparkles" style="width: 18px; height: 18px; color: #3b82f6;"></i> ตรวจสอบและติดตั้งการอัปเดต (mePDF Software Update)`;

    const bodyHtml = `
      <div class="update-modal-container">
        <!-- Header Comparison Card -->
        <div class="update-version-card">
          <div class="version-stat-box current">
            <span class="version-label">เวอร์ชันที่ติดตั้งอยู่</span>
            <span class="version-number">v${updateInfo.currentVersion}</span>
            <span class="version-tag installed">Installed</span>
          </div>
          <div class="version-arrow">
            <i data-lucide="arrow-right" style="width: 20px; height: 20px; color: #60a5fa;"></i>
          </div>
          <div class="version-stat-box latest">
            <span class="version-label">เวอร์ชันล่าสุดบนระบบ</span>
            <span class="version-number">v${updateInfo.latestVersion}</span>
            <span class="version-tag ${isUpToDate ? 'uptodate' : 'available'}">${isUpToDate ? 'Up to date' : 'New Release'}</span>
          </div>
        </div>

        <!-- Release Notes Section -->
        <div class="update-changelog-section">
          <h4 class="changelog-heading">
            <i data-lucide="sparkles" style="width: 15px; height: 15px; color: #3b82f6;"></i>
            สิ่งที่ปรับปรุงใหม่ในเวอร์ชันนี้ (Release Notes)
          </h4>
          <ul class="changelog-list">
            ${updateInfo.changelog.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>

        <!-- Download Progress Bar Container (Hidden by default) -->
        <div class="update-progress-section" id="update-progress-container" style="display: none;">
          <div class="progress-labels">
            <span class="progress-status-text" id="update-status-text">กำลังดาวน์โหลดแพตช์...</span>
            <span class="progress-percent" id="update-percent-text">0%</span>
          </div>
          <div class="update-progress-track">
            <div class="update-progress-fill" id="update-progress-bar" style="width: 0%;"></div>
          </div>
          <div class="progress-subtext" id="update-subtext">กำลังดึงไฟล์ไบนารี mePDF จาก GitHub Releases (14.8 MB)...</div>
        </div>
      </div>
    `;

    const footerHtml = isUpToDate
      ? `<button class="btn btn-secondary" id="update-modal-close-btn">ปิดหน้าต่าง</button>`
      : `
        <button class="btn btn-secondary" id="update-modal-cancel-btn">เตือนฉันภายหลัง</button>
        <button class="btn btn-primary update-btn-pulse" id="update-modal-confirm-btn">
          <span>อัปเดตและเริ่มใหม่ทันที (Update Now)</span>
        </button>
      `;

    this.ctx.open(modalTitle, bodyHtml, footerHtml);

    const closeBtn = this.ctx.footerActions.querySelector<HTMLButtonElement>('#update-modal-close-btn');
    closeBtn?.addEventListener('click', () => this.ctx.close());

    const cancelBtn = this.ctx.footerActions.querySelector<HTMLButtonElement>('#update-modal-cancel-btn');
    cancelBtn?.addEventListener('click', () => this.ctx.close());

    const confirmBtn = this.ctx.footerActions.querySelector<HTMLButtonElement>('#update-modal-confirm-btn');
    confirmBtn?.addEventListener('click', async () => {
      if (this.isDownloadComplete) {
        window.location.reload();
        return;
      }
      await this.startDownloadSimulation(confirmBtn);
    });
  }

  private async startDownloadSimulation(confirmBtn: HTMLButtonElement): Promise<void> {
    const progressContainer = this.ctx.bodyContent.querySelector<HTMLElement>('#update-progress-container');
    const progressBar = this.ctx.bodyContent.querySelector<HTMLElement>('#update-progress-bar');
    const percentText = this.ctx.bodyContent.querySelector<HTMLElement>('#update-percent-text');
    const statusText = this.ctx.bodyContent.querySelector<HTMLElement>('#update-status-text');
    const subtext = this.ctx.bodyContent.querySelector<HTMLElement>('#update-subtext');

    if (!progressContainer || !progressBar || !percentText) return;

    progressContainer.style.display = 'block';
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'กำลังดาวน์โหลด...';

    this.downloadProgress = 0;

    return new Promise((resolve) => {
      this.progressInterval = setInterval(() => {
        this.downloadProgress += Math.floor(Math.random() * 18) + 12;
        if (this.downloadProgress >= 100) {
          this.downloadProgress = 100;
          if (this.progressInterval) clearInterval(this.progressInterval);
          this.isDownloadComplete = true;

          if (progressBar) progressBar.style.width = '100%';
          if (percentText) percentText.textContent = '100%';
          if (statusText) statusText.textContent = '✨ ตรวจสอบลายเซ็น Ed25519 และติดตั้งสำเร็จแล้ว!';
          if (subtext) subtext.textContent = 'ไฟล์ mePDF.exe ถูกอัปเดตเป็นเวอร์ชันล่าสุดในเครื่องเรียบร้อยแล้ว';

          confirmBtn.disabled = false;
          confirmBtn.classList.remove('btn-primary');
          confirmBtn.classList.add('btn-success');
          confirmBtn.textContent = 'รีสตาร์ตโปรแกรมเดี๋ยวนี้ (Restart mePDF)';
          resolve();
        } else {
          if (progressBar) progressBar.style.width = `${this.downloadProgress}%`;
          if (percentText) percentText.textContent = `${this.downloadProgress}%`;
          if (subtext) subtext.textContent = `ดาวน์โหลดแล้ว ${(this.downloadProgress * 0.148).toFixed(1)} MB / 14.8 MB`;
        }
      }, 200);
    });
  }
}
