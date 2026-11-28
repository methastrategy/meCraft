"""
build_desktop_installer.py
Compiles the Windows MSI installer (mecraft-hub.msi) using Tauri, Rust and WiX:
1. Ensures ~/.cargo/bin is in PATH.
2. Invokes `npm run desktop:build --workspace=@mecraft/launcher`.
3. Locates the matching MSI version in src-tauri/target/release/bundle/msi/.
4. Copies the MSI to the local artifact folder; this does not publish a release.
"""

import os
import sys
import shutil
import subprocess
import time
import json

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
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
    print("[*] Invoking Tauri v2 MSI build (cargo + MSVC + WiX)...")
    cmd = ['npx', 'tauri', 'build', '--bundles', 'msi']
    r_tauri = subprocess.run(cmd, cwd=launcher_dir, env=env, shell=True)
    if r_tauri.returncode != 0:
        print(f"[!] Tauri build exited with code {r_tauri.returncode}")
        sys.exit(r_tauri.returncode)

    # 4. Select only the MSI matching this package version.
    target_bundle_dir = os.path.join(launcher_dir, 'src-tauri', 'target', 'release', 'bundle')
    print(f"[*] Searching for generated installers in {target_bundle_dir}...")
    
    with open(os.path.join(launcher_dir, 'package.json'), encoding='utf-8') as package_file:
        version = json.load(package_file)['version']
    expected_msi = os.path.join(target_bundle_dir, 'msi', f'meCraft_{version}_x64_en-US.msi')
    found_installers = [expected_msi] if os.path.isfile(expected_msi) else []

    if not found_installers:
        print("[!] Matching MSI installer was not found in bundle directory!")
        sys.exit(1)

    print(f"[+] Found {len(found_installers)} installer binary(ies):")
    for ins in found_installers:
        sz = os.path.getsize(ins) / (1024 * 1024)
        print(f"    - {ins} ({sz:.2f} MB)")

    installer_msi = found_installers[0]

    # 5. Keep unsigned local build outputs separate from the public website.
    dst = os.path.join(ROOT_DIR, 'dist-artifacts', 'mecraft-hub.msi')
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    for attempt in range(5):
        try:
            shutil.copyfile(installer_msi, dst)
            if os.path.getsize(dst) != os.path.getsize(installer_msi):
                raise OSError('Copied MSI size does not match the build artifact')
            print(f"[+] Copied installer to {dst} ({os.path.getsize(dst) / (1024*1024):.2f} MB)")
            break
        except OSError:
            if attempt == 4:
                raise
            time.sleep(1)

    print(f"\n✨ Desktop installer build & distribution finished in {time.time() - t0:.2f}s!")

if __name__ == '__main__':
    main()
