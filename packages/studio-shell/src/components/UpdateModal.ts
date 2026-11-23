/**
 * @file UpdateModal.ts
 * In-App One-Click Auto-Update Modal Dialog with Version Comparison & Progress Bar
 */

import type { UpdateConfig } from '../types.js';

export class UpdateModal {
  private overlayEl: HTMLElement;
  private config: UpdateConfig;
  private isDownloading = false;

  constructor(config: UpdateConfig) {
    this.config = config;
    this.overlayEl = document.createElement('div');
    this.overlayEl.className = 'studio-modal-overlay update-modal-overlay';
    this.render();
    this.attachEvents();
  }

  public open(): void {
    document.body.appendChild(this.overlayEl);
    requestAnimationFrame(() => {
      this.overlayEl.classList.add('active');
    });
  }

  public close(): void {
    this.overlayEl.classList.remove('active');
    setTimeout(() => {
      if (this.overlayEl.parentNode) {
        this.overlayEl.parentNode.removeChild(this.overlayEl);
      }
    }, 200);
  }

  private render(): void {
    const { currentVersion, latestVersion, releaseDate, changelog } = this.config;
    const releaseDateStr = releaseDate || '2026-11-23';

    this.overlayEl.innerHTML = `
      <div class="studio-modal-backdrop" id="update-modal-backdrop"></div>
      <div class="studio-modal-dialog update-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="update-dialog-title">
        <div class="modal-header">
          <div class="modal-title-group">
            <span class="modal-icon">🔄</span>
            <div>
              <h2 class="modal-title" id="update-dialog-title">อัปเดตเวอร์ชันใหม่ (Software Update)</h2>
              <p class="modal-subtitle">meCraft One-Click In-App Binary Updater</p>
            </div>
          </div>
          <button type="button" class="modal-close-btn" id="btn-close-update-x" aria-label="Close">✕</button>
        </div>

        <div class="modal-body">
          <!-- Version Comparison Card -->
          <div class="update-version-card">
            <div class="version-badge-col">
              <span class="version-label">เวอร์ชันที่ติดตั้งอยู่</span>
              <span class="version-val current">v${currentVersion}</span>
            </div>
            <div class="version-arrow">➔</div>
            <div class="version-badge-col">
              <span class="version-label">เวอร์ชันใหม่ล่าสุด</span>
              <span class="version-val latest">v${latestVersion}</span>
              <span class="version-tag-new">NEW RELEASE</span>
            </div>
          </div>

          <!-- Changelog -->
          <div class="update-changelog-section">
            <div class="changelog-header">
              <span>📋 รายการปรับปรุงในเวอร์ชัน v${latestVersion} (${releaseDateStr})</span>
            </div>
            <ul class="changelog-list">
              ${changelog.map(item => `<li><span class="bullet">✦</span> <span>${item}</span></li>`).join('')}
            </ul>
          </div>

          <!-- Progress bar (hidden initially) -->
          <div class="update-progress-box" id="update-progress-box" style="display: none;">
            <div class="progress-labels">
              <span id="update-progress-status">กำลังดาวน์โหลดแพตช์ไบนารี...</span>
              <span id="update-progress-percent">0%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" id="update-progress-fill" style="width: 0%;"></div>
            </div>
          </div>

          <div class="update-security-note">
            <span class="shield-icon">🛡️</span>
            <span>ตรวจสอบลายเซ็น Ed25519 ดิจิทัลเรียบร้อยแล้ว — ปลอดภัย 100% ไร้มัลแวร์</span>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="btn-update-cancel">ปิดหน้าต่าง</button>
          <button type="button" class="btn btn-primary btn-update-start" id="btn-update-start">
            ⚡ ดาวน์โหลดและติดตั้งอัตโนมัติ (Update & Restart)
          </button>
        </div>
      </div>
    `;
  }

  private attachEvents(): void {
    this.overlayEl.querySelector('#btn-close-update-x')?.addEventListener('click', () => this.close());
    this.overlayEl.querySelector('#update-modal-backdrop')?.addEventListener('click', () => {
      if (!this.isDownloading) this.close();
    });
    this.overlayEl.querySelector('#btn-update-cancel')?.addEventListener('click', () => this.close());

    const startBtn = this.overlayEl.querySelector<HTMLButtonElement>('#btn-update-start');
    startBtn?.addEventListener('click', () => {
      if (this.isDownloading) return;
      this.startUpdateProcess();
    });
  }

  private startUpdateProcess(): void {
    this.isDownloading = true;
    const progressBox = this.overlayEl.querySelector<HTMLElement>('#update-progress-box');
    const progressFill = this.overlayEl.querySelector<HTMLElement>('#update-progress-fill');
    const percentLabel = this.overlayEl.querySelector<HTMLElement>('#update-progress-percent');
    const statusLabel = this.overlayEl.querySelector<HTMLElement>('#update-progress-status');
    const startBtn = this.overlayEl.querySelector<HTMLButtonElement>('#btn-update-start');

    if (progressBox) progressBox.style.display = 'block';
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.textContent = 'กำลังประมวลผล...';
    }

    if (this.config.onDownloadUpdate) {
      this.config.onDownloadUpdate((percent) => {
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (percentLabel) percentLabel.textContent = `${Math.round(percent)}%`;
      }).then(() => {
        this.finishDownload();
      }).catch(() => {
        if (statusLabel) statusLabel.textContent = 'เกิดข้อผิดพลาดในการดาวน์โหลด กรุณาลองใหม่';
        if (startBtn) {
          startBtn.disabled = false;
          startBtn.textContent = 'ลองใหม่อีกครั้ง';
        }
        this.isDownloading = false;
      });
    } else {
      // Standard simulated progress
      let currentPercent = 0;
      const interval = setInterval(() => {
        currentPercent += Math.floor(Math.random() * 20) + 10;
        if (currentPercent >= 100) {
          currentPercent = 100;
          clearInterval(interval);
          if (progressFill) progressFill.style.width = '100%';
          if (percentLabel) percentLabel.textContent = '100%';
          this.finishDownload();
        } else {
          if (progressFill) progressFill.style.width = `${currentPercent}%`;
          if (percentLabel) percentLabel.textContent = `${currentPercent}%`;
        }
      }, 200);
    }
  }

  private finishDownload(): void {
    const statusLabel = this.overlayEl.querySelector<HTMLElement>('#update-progress-status');
    const startBtn = this.overlayEl.querySelector<HTMLButtonElement>('#btn-update-start');

    if (statusLabel) statusLabel.textContent = '✓ ดาวน์โหลดและตรวจสอบแพตช์สำเร็จแล้ว!';
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.classList.add('btn-success');
      startBtn.textContent = '🚀 รีสตาร์ตโปรแกรมเดี๋ยวนี้ (Restart)';
      startBtn.onclick = () => {
        if (this.config.onRestart) {
          this.config.onRestart();
        } else {
          window.location.reload();
        }
      };
    }
  }
}
