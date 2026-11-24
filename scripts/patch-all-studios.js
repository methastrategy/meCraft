import fs from 'node:fs';
import path from 'node:path';

// 1. Run patch for meide
const meidePatchScript = path.resolve('scripts/patch-meide.js');
if (fs.existsSync(meidePatchScript)) {
  import('file:///' + meidePatchScript.replace(/\\/g, '/'));
}

// 2. Patch apps/mepdf/src/components/AuthModal.ts
const mepdfAuthPath = path.resolve('apps/mepdf/src/components/AuthModal.ts');
let mepdfCode = fs.readFileSync(mepdfAuthPath, 'utf8');

const targetMethod = `  private render(): void {
    if (!this.overlay) return;

    const isSignIn = this.currentTab === 'signin';`;

const replacementMethod = `  private isDesktopMode(): boolean {
    if (typeof window === 'undefined') return true;
    if ((window as any).__TAURI__) return true;
    const params = new URLSearchParams(window.location.search || '');
    if (params.get('mode') === 'web') return false;
    if (params.get('mode') === 'desktop') return true;
    if (window.location.hostname && window.location.hostname.includes('vercel.app')) {
      return false;
    }
    return true;
  }

  private bindDesktopEvents(): void {
    if (!this.overlay) return;
    this.overlay.querySelector('#auth-close-btn')?.addEventListener('click', () => this.close());
    const googleBtn = this.overlay.querySelector('#auth-google-btn');
    googleBtn?.addEventListener('click', async () => {
      try {
        await authService.signInWithGoogle();
        const user = authService.getCurrentUser();
        if (user) {
          toast.success(t('authSignedInToast', { name: user.fullName || user.email }));
          this.close();
          if (this.onSuccessCallback) this.onSuccessCallback(user);
        }
      } catch (err: any) {
        toast.error(err?.message || t('authErrorGeneric'));
      }
    });
  }

  private render(): void {
    if (!this.overlay) return;

    if (this.isDesktopMode()) {
      this.overlay.innerHTML = \`
        <div class="modal-card auth-modal-card desktop-google-auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
          <div class="modal-header auth-modal-header">
            <div class="auth-header-top">
              <div class="auth-brand-badge">
                <i data-lucide="shield-check" style="width: 22px; height: 22px; color: var(--primary);"></i>
              </div>
              <button class="btn btn-ghost btn-icon-only modal-close-pill" id="auth-close-btn" title="Close" aria-label="Close modal">
                <i data-lucide="x" style="width: 18px; height: 18px;"></i>
              </button>
            </div>
            <div class="auth-header-title-wrap">
              <h3 class="modal-title auth-title" id="auth-modal-title">เข้าสู่ระบบ mePDF Studio ด้วยบัญชี Google</h3>
              <p class="auth-subtitle">ซิงค์สิทธิการใช้งานและคลังเอกสารผ่านบัญชี Google ที่ปลอดภัย</p>
            </div>
          </div>

          <div class="modal-body auth-modal-body">
            <div id="auth-alert-box" class="auth-alert" style="display: none;"></div>

            <!-- Google Social Sign In -->
            <button class="btn btn-google" id="auth-google-btn" type="button">
              <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>\${t('authGoogleBtn')}</span>
            </button>

            <!-- Redirect to Web Portal for Registration -->
            <div class="desktop-auth-signup-box" style="margin-top:14px; padding:12px 14px; background:rgba(255,255,255,0.03); border:1px dashed rgba(255,255,255,0.15); border-radius:10px; text-align:center;">
              <span style="font-size:12px; color:#94a3b8; display:block; margin-bottom:4px;">ยังไม่มีบัญชี meCraft หรือต้องการสร้างบัญชีใหม่?</span>
              <a href="https://mecrafts.vercel.app/auth?action=signup&source=desktop" target="_blank" class="btn-desktop-web-link" id="modal-link-web-signup" style="color:#d4af37; font-size:13px; font-weight:600; text-decoration:none;">
                สมัครสมาชิกบนเว็บพอร์ทัล (Web Portal) →
              </a>
            </div>

            <!-- Trust Badges -->
            <div class="auth-trust-badges" style="margin-top:16px; display:flex; flex-direction:column; gap:6px; text-align:left;">
              <div style="font-size:11px; color:#94a3b8;">🔒 ประมวลผลเอกสารใน RAM เครื่อง 100% ไร้การอัปโหลด</div>
              <div style="font-size:11px; color:#94a3b8;">🛡️ Google Verified OAuth ความปลอดภัยระดับองค์กร</div>
              <div style="font-size:11px; color:#94a3b8;">⚡ รองรับ Offline Grace 30 วัน ใช้งานออฟไลน์ได้สมบูรณ์</div>
            </div>
          </div>
        </div>
      \`;
      this.bindDesktopEvents();
      this.refreshIcons();
      return;
    }

    const isSignIn = this.currentTab === 'signin';`;

mepdfCode = mepdfCode.replace(targetMethod, replacementMethod).replace(targetMethod.replace(/\n/g, '\r\n'), replacementMethod.replace(/\n/g, '\r\n'));
fs.writeFileSync(mepdfAuthPath, mepdfCode, 'utf8');
console.log('Successfully patched apps/mepdf/src/components/AuthModal.ts!');
