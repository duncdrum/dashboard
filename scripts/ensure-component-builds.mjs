import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const packages = [
  { name: '@existdb/repo-elements', artifact: 'dist/repo-elements.js' },
  { name: 'existdb-launcher', artifact: 'dist/existdb-launcher-app.js' },
  { name: 'existdb-packagemanager', artifact: 'dist/existdb-packagemanager.js' },
  { name: '@existdb/usermanager', artifact: 'dist/usermanager.js' },
  { name: 'existdb-backup', artifact: 'dist/existdb-backup-app.js' }
];

for (const { name, artifact } of packages) {
  const pkgRoot = join(root, 'node_modules', name);
  const built = join(pkgRoot, artifact);
  if (existsSync(built)) continue;
  console.log(`Building ${name} (${artifact} missing)...`);
  execSync('npm run build:production', { cwd: pkgRoot, stdio: 'inherit' });
}
