import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.realpathSync(path.resolve(__dirname, '..'));

export const APP_REPO_MAP = [
  { appDir: 'apps/medocs', repo: 'methastrategy/medocs', localHubFolder: 'medocs', note: 'Renamed from medoc to meDocs/medocs (with medoc aliases)' },
  { appDir: 'apps/meide', repo: 'methastrategy/meide', localHubFolder: 'meide' },
  { appDir: 'apps/mepdf', repo: 'methastrategy/mepdf', localHubFolder: 'mepdf' },
  { appDir: 'apps/mephoto', repo: 'methastrategy/mephoto', localHubFolder: 'mephoto' },
  { appDir: 'apps/medrop', repo: 'methastrategy/medrop', localHubFolder: 'medrop' },
  { appDir: 'apps/mesheet', repo: 'methastrategy/mesheet', localHubFolder: 'mesheet' },
  { appDir: 'apps/medeck', repo: 'methastrategy/medeck', localHubFolder: 'medeck' },
  { appDir: 'apps/mevector', repo: 'methastrategy/mevector', localHubFolder: 'mevector' },
  { appDir: 'apps/me3d', repo: 'methastrategy/me3d', localHubFolder: 'me3d' },
  { appDir: 'apps/meaudio', repo: 'methastrategy/meaudio', localHubFolder: 'meaudio' },
  { appDir: 'apps/mefilm', repo: 'methastrategy/mefilm', localHubFolder: 'mefilm' },
  { appDir: 'apps/melight', repo: 'methastrategy/melight', localHubFolder: 'melight' },
  { appDir: 'apps/memotion', repo: 'methastrategy/memotion', localHubFolder: 'memotion' },
  { appDir: 'apps/medesign', repo: 'methastrategy/medesign-studio', localHubFolder: 'medesign-studio', note: 'Uses medesign-studio to avoid collision with existing methastrategy/medesign' },
];

function parseArgs(argv) {
  const args = { dryRun: false, targetApp: null, branch: 'main' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') args.dryRun = true;
    else if (argv[i] === '--app' && argv[i + 1]) args.targetApp = argv[++i];
    else if (argv[i] === '--branch' && argv[i + 1]) args.branch = argv[++i];
  }
  return args;
}

function runGit(cmd, cwd = rootDir) {
  return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function main() {
  const { dryRun, targetApp, branch } = parseArgs(process.argv.slice(2));
  const selected = targetApp
    ? APP_REPO_MAP.filter(item => item.localHubFolder === targetApp || item.appDir === `apps/${targetApp}` || item.repo.endsWith(`/${targetApp}`))
    : APP_REPO_MAP;

  if (selected.length === 0) {
    console.error(`[sync-repos] No app matched filter: ${targetApp}`);
    process.exit(1);
  }

  const headRef = runGit('git rev-parse --short HEAD');
  console.log(`[sync-repos] Monorepo HEAD ${headRef} -> syncing ${selected.length} standalone app mirror(s) (target branch: ${branch}${dryRun ? ', DRY RUN' : ''})`);

  const failures = [];
  for (const item of selected) {
    if (!fs.existsSync(path.join(rootDir, item.appDir))) {
      failures.push(`${item.appDir}: directory missing`);
      continue;
    }

    try {
      const splitSha = runGit(`git subtree split --prefix=${item.appDir} HEAD`);
      const token = process.env.GH_SYNC_TOKEN || process.env.GITHUB_TOKEN || '';
      const remoteUrl = token
        ? `https://x-access-token:${token}@github.com/${item.repo}.git`
        : `https://github.com/${item.repo}.git`;

      if (dryRun) {
        console.log(`  [dry-run] ${item.appDir} -> ${item.repo} (${splitSha.slice(0, 8)} -> ${branch})`);
      } else {
        execSync(`git push --force "${remoteUrl}" "${splitSha}:refs/heads/${branch}"`, {
          cwd: rootDir,
          stdio: ['ignore', 'pipe', 'pipe'],
        });
        console.log(`  ✅ ${item.appDir} -> https://github.com/${item.repo} (${splitSha.slice(0, 8)})`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ ${item.appDir} -> ${item.repo}: ${msg}`);
      failures.push(`${item.repo}: ${msg}`);
    }
  }

  if (failures.length > 0) {
    console.error(`\n[sync-repos] Completed with ${failures.length} failure(s).`);
    process.exit(1);
  }
  console.log(`\n✨ [sync-repos] Synchronized ${selected.length} repositories cleanly.`);
}

main();
