import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const outDir = 'resources/scripts/dist';

const packages = [
  'existdb-launcher',
  'existdb-packagemanager',
  '@existdb/usermanager',
  'existdb-backup'
];

if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true, force: true });
}
mkdirSync(outDir, { recursive: true });

for (const name of packages) {
  const src = join('node_modules', name, 'dist');
  if (!existsSync(src)) {
    console.warn(`skip ${name}: ${src} missing (run ensure-component-builds)`);
    continue;
  }
  cpSync(src, outDir, { recursive: true, force: true });
}

const repoSrc = 'node_modules/@existdb/repo-elements/dist';
const repoDest = 'resources/scripts/@existdb/repo-elements/dist';
if (existsSync(repoSrc)) {
  mkdirSync(join('resources/scripts/@existdb/repo-elements'), { recursive: true });
  cpSync(repoSrc, repoDest, { recursive: true, force: true });
}

for (const file of readdirSync('resources/loaders')) {
  if (file.endsWith('.js')) {
    copyFileSync(join('resources/loaders', file), join(outDir, file));
  }
}

if (existsSync('dist/dashboard.js')) {
  copyFileSync('dist/dashboard.js', join(outDir, 'dashboard.js'));
}

console.log(`Dev dist linked at ${outDir}`);
