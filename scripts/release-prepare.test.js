import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '..');
const releaseScript = path.join(projectRoot, 'scripts/release-prepare.js');

async function createFixture(version) {
  const fixtureDir = await mkdtemp(path.join(tmpdir(), 'gzd-release-'));
  const pkg = {
    name: '@example/release-fixture',
    version,
    type: 'module',
  };

  await writeFile(
    path.join(fixtureDir, 'package.json'),
    `${JSON.stringify(pkg, null, 2)}\n`,
  );
  await writeFile(
    path.join(fixtureDir, 'package-lock.json'),
    `${JSON.stringify({
      name: pkg.name,
      version,
      lockfileVersion: 3,
      packages: { '': { name: pkg.name, version } },
    }, null, 2)}\n`,
  );
  await writeFile(path.join(fixtureDir, 'CHANGELOG.md'), '# Changelog\n\n## Unreleased\n');

  return fixtureDir;
}

async function runPrepare(version, args) {
  const fixtureDir = await createFixture(version);

  try {
    const result = spawnSync(process.execPath, [releaseScript, ...args], {
      cwd: fixtureDir,
      encoding: 'utf8',
    });
    const pkg = JSON.parse(await readFile(path.join(fixtureDir, 'package.json'), 'utf8'));
    const lock = JSON.parse(
      await readFile(path.join(fixtureDir, 'package-lock.json'), 'utf8'),
    );
    const changelog = await readFile(path.join(fixtureDir, 'CHANGELOG.md'), 'utf8');

    return { result, pkg, lock, changelog };
  } finally {
    await rm(fixtureDir, { recursive: true, force: true });
  }
}

for (const [bump, expected] of [
  ['patch', '1.2.4-beta.0'],
  ['minor', '1.3.0-beta.0'],
  ['major', '2.0.0-beta.0'],
]) {
  test(`creates a ${bump} beta prerelease from a stable version`, async () => {
    const output = await runPrepare('1.2.3', [
      '--type',
      'prerelease',
      '--bump',
      bump,
      '--tag',
      'beta',
      '--message',
      '新增：测试发布流程',
    ]);

    assert.equal(output.result.status, 0, output.result.stderr);
    assert.equal(output.pkg.version, expected);
    assert.equal(output.lock.version, expected);
    assert.equal(output.lock.packages[''].version, expected);
    assert.match(output.changelog, new RegExp(`## ${expected.replaceAll('.', '\\.')}`));
    assert.match(output.changelog, /### Added\n\n- 测试发布流程/);
  });
}

for (const [releaseType, expected] of [
  ['patch', '1.2.4'],
  ['minor', '1.3.0'],
  ['major', '2.0.0'],
]) {
  test(`creates a ${releaseType} stable release`, async () => {
    const output = await runPrepare('1.2.3', [
      '--type',
      releaseType,
      '--message',
      '变更：测试正式发布',
    ]);

    assert.equal(output.result.status, 0, output.result.stderr);
    assert.equal(output.pkg.version, expected);
    assert.equal(output.lock.version, expected);
    assert.match(output.changelog, new RegExp(`## ${expected.replaceAll('.', '\\.')}`));
  });
}

test('increments an existing beta without accepting a new base bump', async () => {
  const output = await runPrepare('1.3.0-beta.2', [
    '--type',
    'prerelease',
    '--tag',
    'beta',
    '--message',
    '修复：继续测试 Beta',
  ]);

  assert.equal(output.result.status, 0, output.result.stderr);
  assert.equal(output.pkg.version, '1.3.0-beta.3');
});

test('promotes an existing beta to the matching stable version', async () => {
  const output = await runPrepare('1.3.0-beta.2', [
    '--type',
    'promote',
    '--message',
    '变更：正式发布',
  ]);

  assert.equal(output.result.status, 0, output.result.stderr);
  assert.equal(output.pkg.version, '1.3.0');
});

test('requires a base bump when creating a prerelease non-interactively', async () => {
  const output = await runPrepare('1.2.3', [
    '--type',
    'prerelease',
    '--tag',
    'beta',
    '--message',
    '新增：缺少 bump',
  ]);

  assert.notEqual(output.result.status, 0);
  assert.match(output.result.stderr, /--bump is required/);
  assert.equal(output.pkg.version, '1.2.3');
});

test('rejects a base bump when incrementing an existing prerelease', async () => {
  const output = await runPrepare('1.3.0-beta.2', [
    '--type',
    'prerelease',
    '--bump',
    'minor',
    '--tag',
    'beta',
    '--message',
    '新增：不应重新选择 bump',
  ]);

  assert.notEqual(output.result.status, 0);
  assert.match(output.result.stderr, /cannot be used when incrementing/);
  assert.equal(output.pkg.version, '1.3.0-beta.2');
});
