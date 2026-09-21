import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptsDir, '..');
const sourceFile = resolve(projectRoot, 'CHANGELOG.md');
const targetFile = resolve(projectRoot, 'docs/CHANGELOG.md');
const generatedNotice =
  '<!-- 此文件由 scripts/syncChangelog.js 根据根目录 CHANGELOG.md 自动生成，请勿直接修改。 -->\n\n';

const changelog = await readFile(sourceFile, 'utf8');

await mkdir(dirname(targetFile), { recursive: true });
await writeFile(targetFile, `${generatedNotice}${changelog.trimEnd()}\n`, 'utf8');

console.log('Synced CHANGELOG.md to docs/CHANGELOG.md');
