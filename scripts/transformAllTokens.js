import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixedFontFamilyDesignToken } from './tokenFontFamily.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const originDir = path.join(rootDir, 'gzd-design-tokens-origin');
const outputRootDir = path.join(rootDir, 'gzd-design-tokens');
const modes = ['dark', 'light'];

function upperFirst(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function applyFixedDesignTokens({ outputDir, exportName }) {
  const tokensFile = path.join(outputDir, 'tokens.json');
  const themeTokensFile = path.join(outputDir, `${exportName}Tokens.ts`);
  const themeData = JSON.parse(fs.readFileSync(tokensFile, 'utf-8'));

  themeData.token.fontFamily = fixedFontFamilyDesignToken.$value;

  fs.writeFileSync(tokensFile, `${JSON.stringify(themeData, null, 2)}\n`, 'utf-8');
  fs.writeFileSync(
    themeTokensFile,
    `export const ${exportName}Tokens = ${JSON.stringify(themeData, null, 2)};\n`,
    'utf-8',
  );
}

function runTransform({ themeDir, themeName, mode }) {
  const sourceDir = path.join(originDir, themeDir);
  const outputDir = path.join(outputRootDir, themeDir, `${mode}-mode`);
  const exportName = `${themeName}${upperFirst(mode)}Theme`;

  console.log(`\n> transform ${themeDir}/${mode}-mode`);

  execFileSync(
    process.execPath,
    [
      path.join(rootDir, 'scripts/transformFullTokens.js'),
      '--source',
      sourceDir,
      '--output',
      outputDir,
      '--mode',
      mode,
      '--name',
      exportName,
    ],
    {
      cwd: rootDir,
      stdio: 'inherit',
    },
  );

  applyFixedDesignTokens({ outputDir, exportName });
}

const themeDirs = fs
  .readdirSync(originDir, { withFileTypes: true })
  .filter((item) => item.isDirectory())
  .map((item) => item.name)
  .sort((a, b) => a.localeCompare(b));

for (const themeDir of themeDirs) {
  const themeName = themeDir.replace(/-theme$/, '');

  for (const mode of modes) {
    runTransform({ themeDir, themeName, mode });
  }
}
