import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { importTokens, planImport } from './importTokens.js';

const script = path.resolve(import.meta.dirname, 'importTokens.js');
const token = { sample: { $type: 'number', $value: 8 } };

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function fixture(t, { zipped = false, fail = false, theme = 'gold' } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gzd-import-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const source = path.join(root, 'UI 交付包', `${theme}-theme`);
  const projectRoot = path.join(root, 'project');
  for (const group of ['colors', 'seed', 'map', 'alias', 'static', 'components', 'responsive']) {
    const files = group === 'responsive'
      ? ['Mobile', 'Tablet', 'Desktop SM', 'Desktop']
      : ['Dark', 'Light'];
    const directory = path.join(source, group);
    for (const file of files) write(path.join(directory, `${file}.tokens.json`), JSON.stringify(token));
    if (zipped) {
      execFileSync('zip', ['-q', path.join(source, `${group}.zip`), ...files.map((file) => `${file}.tokens.json`)], { cwd: directory });
      fs.rmSync(directory, { recursive: true });
    }
  }
  write(path.join(projectRoot, 'package.json'), JSON.stringify({
    scripts: { 'tokens:transform': 'node transform.cjs' },
  }));
  // 用有意写入部分产物后失败的转换器，验证真实子进程失败时的回滚行为。
  write(path.join(projectRoot, 'transform.cjs'), `
    const fs = require('node:fs');
    fs.mkdirSync('gzd-design-tokens', { recursive: true });
    fs.writeFileSync('gzd-design-tokens/existing.json', 'updated');
    fs.writeFileSync('gzd-design-tokens/new.json', 'new');
    fs.mkdirSync('docs/tokens', { recursive: true });
    fs.writeFileSync('docs/tokens.md', 'updated docs');
    fs.writeFileSync('docs/tokens/components.md', 'new docs');
    process.exit(${fail ? 1 : 0});
  `);
  return { source, projectRoot };
}

function tree(root) {
  const result = {};
  function walk(directory) {
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, item.name);
      if (item.isDirectory()) walk(file);
      else result[path.relative(root, file)] = fs.readFileSync(file).toString('base64');
    }
  }
  walk(root);
  return result;
}

test('imports all seven ZIPs with spaces in paths, preserves other themes and is idempotent', (t) => {
  const options = fixture(t, { zipped: true });
  const blue = path.join(options.projectRoot, 'gzd-design-tokens-origin/blue-theme/seed/Light.tokens.json');
  const ag = path.join(options.projectRoot, 'gzd-design-tokens-origin/gold-theme/ag-grid/Light.tokens.json');
  write(blue, 'existing blue');
  write(ag, 'existing grid');
  const inputBefore = tree(options.source);
  importTokens(options);
  const plan = planImport(options.source, 'gold', options.projectRoot);
  assert.equal(plan.length, 16);
  assert.ok(plan.every((file) => !file.changed));
  assert.deepEqual(JSON.parse(fs.readFileSync(plan[0].target, 'utf8')), token);
  assert.ok(plan.some((file) => file.relative.endsWith('responsive/Desktop SM.tokens.json')));
  assert.equal(fs.readFileSync(blue, 'utf8'), 'existing blue');
  assert.equal(fs.readFileSync(ag, 'utf8'), 'existing grid');
  assert.equal(fs.readFileSync(path.join(options.projectRoot, 'docs/tokens.md'), 'utf8'), 'updated docs');
  assert.deepEqual(tree(options.source), inputBefore);
  const first = tree(options.projectRoot);
  importTokens(options);
  assert.deepEqual(tree(options.projectRoot), first);
});

test('dry run is read-only; explicit blue maps to blue and ignores formatting differences', (t) => {
  const options = fixture(t, { theme: 'blue' });
  const blue = path.join(options.projectRoot, 'gzd-design-tokens-origin/blue-theme/colors/Dark.tokens.json');
  write(blue, '{"sample":{"$value":8,"$type":"number"}}');
  const before = tree(options.projectRoot);
  importTokens({ ...options, theme: 'blue', dryRun: true });
  assert.deepEqual(tree(options.projectRoot), before);
  const plan = planImport(options.source, 'blue', options.projectRoot);
  assert.equal(plan.filter((file) => file.changed).length, 15);
  assert.ok(plan.every((file) => file.relative.includes('/blue-theme/')));
});

function multiThemeFixture(t, options) {
  const fixtureOptions = fixture(t, options);
  const source = path.dirname(fixtureOptions.source);
  fs.cpSync(fixtureOptions.source, path.join(source, 'blue-theme'), { recursive: true });
  return { ...fixtureOptions, source };
}

test('automatically imports both themes and both modes, then generates only once', (t) => {
  const options = multiThemeFixture(t);
  for (const mode of ['Dark', 'Light']) {
    write(path.join(options.source, 'blue-theme/seed', `${mode}.tokens.json`), JSON.stringify({
      sample: { $type: 'number', $value: 20 },
    }));
  }
  const transformFile = path.join(options.projectRoot, 'transform.cjs');
  write(transformFile, fs.readFileSync(transformFile, 'utf8').replace('process.exit(0);',
    "fs.appendFileSync('generation-count.txt', 'run\\n');"));
  importTokens(options);
  const files = planImport(options.source, undefined, options.projectRoot);
  assert.equal(files.length, 32);
  assert.ok(files.every((file) => !file.changed));
  for (const theme of ['gold', 'blue']) {
    for (const mode of ['Dark', 'Light']) {
      const target = path.join(options.projectRoot, `gzd-design-tokens-origin/${theme}-theme/seed/${mode}.tokens.json`);
      assert.equal(JSON.parse(fs.readFileSync(target, 'utf8')).sample.$value, theme === 'gold' ? 8 : 20);
    }
  }
  assert.equal(fs.readFileSync(path.join(options.projectRoot, 'generation-count.txt'), 'utf8'), 'run\n');
});

test('multi-theme ZIP dry run validates all 32 files without writing', (t) => {
  const options = multiThemeFixture(t, { zipped: true });
  const before = tree(options.projectRoot);
  importTokens({ ...options, dryRun: true });
  assert.equal(planImport(options.source, undefined, options.projectRoot).length, 32);
  assert.deepEqual(tree(options.projectRoot), before);
});

test('invalid later theme prevents writing either theme', (t) => {
  const options = multiThemeFixture(t);
  fs.unlinkSync(path.join(options.source, 'gold-theme/components/Light.tokens.json'));
  const before = tree(options.projectRoot);
  assert.throws(() => importTokens(options), /gold-theme 校验失败/);
  assert.deepEqual(tree(options.projectRoot), before);
});

test('generation failure rolls back both themes and generated files together', (t) => {
  const options = multiThemeFixture(t, { fail: true });
  for (const theme of ['gold', 'blue']) {
    write(path.join(options.projectRoot, `gzd-design-tokens-origin/${theme}-theme/seed/Dark.tokens.json`), `${theme} uncommitted`);
  }
  const before = tree(options.projectRoot);
  assert.throws(() => importTokens(options), /已恢复调用前/);
  assert.deepEqual(tree(options.projectRoot), before);
});

test('unlabelled single-theme packages require an explicit theme', (t) => {
  const options = fixture(t);
  const unnamed = path.join(path.dirname(options.source), '0918 交付');
  fs.renameSync(options.source, unnamed);
  assert.throws(() => planImport(unnamed, undefined, options.projectRoot), /没有 Gold\/Blue 主题标识/);
  assert.equal(planImport(unnamed, 'blue', options.projectRoot).length, 16);
});

test('rejects conflicting, duplicate and unsupported theme routing', (t) => {
  const options = multiThemeFixture(t);
  assert.throws(() => planImport(options.source, 'gold', options.projectRoot), /移除 --theme/);
  assert.throws(() => planImport(path.join(options.source, 'gold-theme'), 'blue', options.projectRoot), /不一致/);
  fs.mkdirSync(path.join(options.source, 'gold'));
  assert.throws(() => planImport(options.source, undefined, options.projectRoot), /重复的主题/);
  fs.rmdirSync(path.join(options.source, 'gold'));
  fs.mkdirSync(path.join(options.source, 'red-theme'));
  assert.throws(() => planImport(options.source, undefined, options.projectRoot), /不支持的主题/);
});

for (const kind of ['missing group', 'missing mode', 'invalid JSON', 'empty tokens', 'ambiguous group', 'unknown ZIP', 'corrupt ZIP']) {
  test(`rejects ${kind} before changing any project file`, (t) => {
    const options = fixture(t);
    const components = path.join(options.source, 'components');
    const light = path.join(components, 'Light.tokens.json');
    if (kind === 'missing group') fs.rmSync(components, { recursive: true });
    if (kind === 'missing mode') fs.unlinkSync(light);
    if (kind === 'invalid JSON') write(light, '{broken');
    if (kind === 'empty tokens') write(light, '{}');
    if (kind === 'ambiguous group') write(`${components}.zip`, 'zip');
    if (kind === 'unknown ZIP') write(path.join(options.source, 'ag-grid.zip'), 'zip');
    if (kind === 'corrupt ZIP') {
      fs.rmSync(components, { recursive: true });
      write(`${components}.zip`, 'broken zip');
    }
    const before = tree(options.projectRoot);
    assert.throws(() => importTokens(options));
    assert.deepEqual(tree(options.projectRoot), before);
  });
}

test('rejects duplicate mode filenames inside a ZIP', (t) => {
  const options = fixture(t);
  const group = path.join(options.source, 'colors');
  write(path.join(group, 'duplicate/Dark.tokens.json'), JSON.stringify(token));
  execFileSync('zip', ['-qr', '../colors.zip', '.'], { cwd: group });
  fs.rmSync(group, { recursive: true });
  assert.throws(() => planImport(options.source, 'gold', options.projectRoot), /重复文件/);
});

test('failed generation restores uncommitted files byte-for-byte and removes partial outputs', (t) => {
  const options = fixture(t, { fail: true });
  write(path.join(options.projectRoot, 'gzd-design-tokens-origin/gold-theme/seed/Dark.tokens.json'), 'uncommitted source');
  write(path.join(options.projectRoot, 'gzd-design-tokens/existing.json'), 'uncommitted output');
  write(path.join(options.projectRoot, 'docs/tokens.md'), 'uncommitted docs');
  write(path.join(options.projectRoot, 'unrelated.txt'), 'keep me');
  const before = tree(options.projectRoot);
  assert.throws(() => importTokens(options), /已恢复调用前/);
  assert.deepEqual(tree(options.projectRoot), before);
});

test('CLI reports help and rejects missing paths, invalid options and unsupported themes', () => {
  const help = spawnSync(process.execPath, [script, '--help'], { encoding: 'utf8' });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /用法/);
  for (const args of [[], ['--unknown'], ['somewhere', '--theme', 'red'], ['somewhere', '--theme'], ['a', 'b']]) {
    const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Token 导入失败/);
  }
});
