"""
build_desktop_installer.py
Compiles the production Windows Desktop Installer (meCraft-Setup.exe) for the meCraft Dual-Powerhouse:
Private-First AI IDE & 18 Standalone Creative Studios Suite using Tauri v2, Rust MSVC, and NSIS:
1. Ensures ~/.cargo/bin is in PATH.
2. Invokes `npm run desktop:build --workspace=@mecraft/launcher`.
3. Locates generated NSIS installer (.exe) in src-tauri/target/release/bundle/nsis/
4. Copies to dist-artifacts/meCraft-Setup.exe, dist/downloads/, and meCrafts-website/downloads/.
"""

import os
import sys
import shutil
import subprocess
import time

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
WEBSITE_DIR = os.path.join(os.path.dirname(ROOT_DIR), 'mecrafts-website')
CARGO_BIN = os.path.expanduser('~/.cargo/bin')

def main():
    t0 = time.time()
    print("=== meCraft Dual-Powerhouse AI IDE & 18 Creative Studios Desktop Installer Pipeline ===")
    
    # 1. Environment preparation
    env = os.environ.copy()
    env['PATH'] = CARGO_BIN + os.pathsep + env['PATH']
    print(f"[*] Added {CARGO_BIN} to build PATH.")

    # 2. Build launcher frontend first (ensure latest dist)
    launcher_dir = os.path.join(ROOT_DIR, 'apps', 'mecraft-launcher')
    print("[*] Rebuilding launcher frontend...")
    r_fe = subprocess.run(['npm', 'run', 'build'], cwd=launcher_dir, env=env, shell=True)
    if r_fe.returncode != 0:
        print("[!] Frontend build failed.")
        sys.exit(r_fe.returncode)

    # 3. Invoke Tauri build
    print("[*] Invoking Tauri v2 release build (cargo + MSVC + NSIS)...")
    cmd = ['npx', 'tauri', 'build']
    r_tauri = subprocess.run(cmd, cwd=launcher_dir, env=env, shell=True)
    if r_tauri.returncode != 0:
        print(f"[!] Tauri build exited with code {r_tauri.returncode}")
        sys.exit(r_tauri.returncode)

    # 4. Search for generated NSIS installer
    target_bundle_dir = os.path.join(launcher_dir, 'src-tauri', 'target', 'release', 'bundle')
    print(f"[*] Searching for generated installers in {target_bundle_dir}...")
    
    found_installers = []
    if os.path.exists(target_bundle_dir):
        for root, dirs, files in os.walk(target_bundle_dir):
            for f in files:
                if f.endswith('.exe'):
                    found_installers.append(os.path.join(root, f))

    if not found_installers:
        print("[!] No .exe installer found in bundle directory!")
        sys.exit(1)

    print(f"[+] Found {len(found_installers)} installer binary(ies):")
    for ins in found_installers:
        sz = os.path.getsize(ins) / (1024 * 1024)
        print(f"    - {ins} ({sz:.2f} MB)")

    # Choose the setup / nsis installer
    setup_exe = None
    for ins in found_installers:
        if 'setup' in ins.lower() or 'nsis' in ins.lower():
            setup_exe = ins
            break
    if not setup_exe:
        setup_exe = found_installers[0]

    # 5. Distribute to dist-artifacts, dist/downloads, and meCrafts-website/downloads
    destinations = [
        os.path.join(ROOT_DIR, 'dist-artifacts', 'meCraft-Setup.exe'),
        os.path.join(ROOT_DIR, 'dist', 'downloads', 'meCraft-Setup.exe'),
        os.path.join(WEBSITE_DIR, 'downloads', 'meCraft-Setup.exe')
    ]

    for dst in destinations:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        for attempt in range(5):
            try:
                if os.path.exists(dst):
                    try:
                        os.remove(dst)
                    except Exception:
                        pass
                shutil.copyfile(setup_exe, dst)
                print(f"[+] Copied installer to {dst} ({os.path.getsize(dst) / (1024*1024):.2f} MB)")
                break
            except Exception as e:
                if attempt == 4:
                    print(f"[!] Warning copying to {dst}: {e}")
                else:
                    time.sleep(1)

    print(f"\n✨ Desktop installer build & distribution finished in {time.time() - t0:.2f}s!")

if __name__ == '__main__':
    main()
