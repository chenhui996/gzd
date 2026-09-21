#!/usr/bin/env node

import { access, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';

const RELEASE_TYPES = ['patch', 'minor', 'major', 'prerelease', 'promote'];
const PRERELEASE_BUMPS = ['patch', 'minor', 'major'];
const DEFAULT_PRERELEASE_TAG = 'beta';

const rootDir = process.cwd();
const packageJsonPath = path.join(rootDir, 'package.json');
const packageLockPath = path.join(rootDir, 'package-lock.json');
const changelogPath = path.join(rootDir, 'CHANGELOG.md');

main().catch((error) => {
  console.error(`\nrelease:prepare failed: ${error.message}`);
  process.exit(1);
});

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const pkg = await readJson(packageJsonPath);
  const currentVersion = parseSemver(pkg.version);
  const currentChangelog = await readChangelog();
  const unreleasedSection = findUnreleasedSection(currentChangelog);
  const hasUnreleasedNotes = hasChangelogContent(unreleasedSection.content);
  const needsChangelogInput = !hasUnreleasedNotes && !hasChangelogInput(args);
  const needsPrereleaseBump =
    args.type === 'prerelease' && !currentVersion.prerelease && !args.bump;

  const interactive =
    process.stdin.isTTY && (!args.type || needsChangelogInput || needsPrereleaseBump);
  const rl = interactive
    ? readline.createInterface({ input: process.stdin, output: process.stdout })
    : null;

  try {
    const releaseType = await resolveReleaseType(args.type, rl);
    const prereleaseTag = await resolvePrereleaseTag(args.tag, releaseType, currentVersion, rl);
    const prereleaseBump = await resolvePrereleaseBump(
      args.bump,
      releaseType,
      currentVersion,
      rl,
    );
    const additionalNotes = await resolveChangelog(args, rl, hasUnreleasedNotes);
    const releaseNotes = mergeChangelogNotes(
      unreleasedSection.content,
      additionalNotes,
    );
    const nextVersion = bumpVersion(
      currentVersion,
      releaseType,
      prereleaseTag,
      prereleaseBump,
    );
    const today = formatDate(new Date());

    const changelogEntry = formatChangelogEntry(nextVersion, today, releaseNotes);

    if (args.dryRun) {
      printSummary({
        dryRun: true,
        currentVersion: pkg.version,
        nextVersion,
        releaseType,
        changelogEntry,
      });
      return;
    }

    pkg.version = nextVersion;
    await writeJson(packageJsonPath, pkg);
    await updatePackageLock(nextVersion);
    await updateChangelog(currentChangelog, unreleasedSection, changelogEntry);

    printSummary({
      dryRun: false,
      currentVersion: currentVersion.raw,
      nextVersion,
      releaseType,
      changelogEntry,
    });
  } finally {
    rl?.close();
  }
}

function parseArgs(argv) {
  const args = {
    message: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--help' || token === '-h') {
      args.help = true;
      continue;
    }

    if (token === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (token.startsWith('--type=')) {
      args.type = token.slice('--type='.length);
      continue;
    }

    if (token === '--type' || token === '-t') {
      args.type = readArgValue(argv, (index += 1), token);
      continue;
    }

    if (token.startsWith('--tag=')) {
      args.tag = token.slice('--tag='.length);
      continue;
    }

    if (token.startsWith('--preid=')) {
      args.tag = token.slice('--preid='.length);
      continue;
    }

    if (token === '--tag' || token === '--preid') {
      args.tag = readArgValue(argv, (index += 1), token);
      continue;
    }

    if (token.startsWith('--bump=')) {
      args.bump = token.slice('--bump='.length);
      continue;
    }

    if (token === '--bump') {
      args.bump = readArgValue(argv, (index += 1), token);
      continue;
    }

    if (token.startsWith('--message=')) {
      args.message.push(token.slice('--message='.length));
      continue;
    }

    if (token === '--message' || token === '-m') {
      args.message.push(readArgValue(argv, (index += 1), token));
      continue;
    }

    if (token.startsWith('--changelog=')) {
      args.changelog = token.slice('--changelog='.length);
      continue;
    }

    if (token === '--changelog' || token === '-c') {
      args.changelog = readArgValue(argv, (index += 1), token);
      continue;
    }

    throw new Error(`unknown argument: ${token}`);
  }

  return args;
}

function readArgValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith('-')) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function printHelp() {
  console.log(`Usage:
  npm run release:prepare
  npm run release:prepare -- --type patch
  npm run release:prepare -- --type <patch|minor|major|prerelease|promote> --message "..."
  npm run release:prepare -- --type prerelease --bump minor --tag beta --message "..."
  npm run release:prepare -- --type patch --changelog ./release-notes.md

Options:
  -t, --type        Release type: patch, minor, major, prerelease, promote
      --tag         Prerelease identifier, for example beta, alpha, rc
      --preid       Alias of --tag
      --bump        Base bump for a new prerelease: patch, minor, or major
  -m, --message     Additional changelog item. Can be passed multiple times.
  -c, --changelog   Read additional changelog text from a file.
      --dry-run     Print the next version and changelog without writing files.
  -h, --help        Show help.

The existing Unreleased section is archived automatically. Additional changelog
input is only required when Unreleased is missing or empty.`);
}

async function resolveReleaseType(input, rl) {
  if (input) {
    return validateReleaseType(input);
  }

  if (!rl) {
    throw new Error('--type is required in non-interactive mode');
  }

  console.log('请选择发布类型:');
  console.log('  patch      修复问题，向后兼容');
  console.log('  minor      新增能力，向后兼容');
  console.log('  major      破坏性变更');
  console.log('  prerelease 预发布版本，例如 beta/rc');
  console.log('  promote    预发布转正式版');

  while (true) {
    const answer = (await rl.question('Release type: ')).trim();
    try {
      return validateReleaseType(answer);
    } catch (error) {
      console.log(error.message);
    }
  }
}

function validateReleaseType(value) {
  if (!RELEASE_TYPES.includes(value)) {
    throw new Error(`release type must be one of: ${RELEASE_TYPES.join(', ')}`);
  }
  return value;
}

async function resolvePrereleaseTag(input, releaseType, currentVersion, rl) {
  if (releaseType !== 'prerelease') {
    return null;
  }

  if (input) {
    return validatePrereleaseTag(input);
  }

  const currentTag = currentVersion.prerelease?.[0];
  if (currentTag && Number.isNaN(Number(currentTag))) {
    return currentTag;
  }

  if (!rl) {
    return DEFAULT_PRERELEASE_TAG;
  }

  const answer = (await rl.question(`Prerelease tag (${DEFAULT_PRERELEASE_TAG}): `)).trim();
  return validatePrereleaseTag(answer || DEFAULT_PRERELEASE_TAG);
}

function validatePrereleaseTag(tag) {
  if (!/^[0-9A-Za-z-]+$/.test(tag)) {
    throw new Error('prerelease tag can only contain letters, numbers, and hyphens');
  }
  if (/^\d+$/.test(tag)) {
    throw new Error('prerelease tag cannot be only numbers');
  }
  return tag;
}

async function resolvePrereleaseBump(input, releaseType, currentVersion, rl) {
  if (releaseType !== 'prerelease') {
    if (input) {
      throw new Error('--bump can only be used with --type prerelease');
    }
    return null;
  }

  if (currentVersion.prerelease) {
    if (input) {
      throw new Error('--bump cannot be used when incrementing an existing prerelease');
    }
    return null;
  }

  if (input) {
    return validatePrereleaseBump(input);
  }

  if (!rl) {
    throw new Error(
      '--bump is required when creating a prerelease from a stable version',
    );
  }

  console.log('请选择预发布版本的基础升级类型:');
  console.log('  patch  修复问题，向后兼容');
  console.log('  minor  新增能力，向后兼容');
  console.log('  major  破坏性变更');

  while (true) {
    const answer = (await rl.question('Prerelease bump: ')).trim();
    try {
      return validatePrereleaseBump(answer);
    } catch (error) {
      console.log(error.message);
    }
  }
}

function validatePrereleaseBump(value) {
  if (!PRERELEASE_BUMPS.includes(value)) {
    throw new Error(
      `prerelease bump must be one of: ${PRERELEASE_BUMPS.join(', ')}`,
    );
  }
  return value;
}

async function resolveChangelog(args, rl, hasUnreleasedNotes) {
  if (args.changelog) {
    const notes = (await readFile(path.resolve(rootDir, args.changelog), 'utf8')).trim();
    if (!notes) {
      throw new Error(`changelog file is empty: ${args.changelog}`);
    }
    return notes;
  }

  if (args.message.length > 0) {
    return args.message.join('\n').trim();
  }

  if (hasUnreleasedNotes) {
    return '';
  }

  if (!rl) {
    throw new Error(
      'Unreleased is empty; --message or --changelog is required in non-interactive mode',
    );
  }

  console.log('请输入 changelog，每行一条；输入空行结束。');
  const lines = [];

  while (true) {
    const line = await rl.question('> ');
    if (!line.trim()) {
      break;
    }
    lines.push(line.trim());
  }

  if (lines.length === 0) {
    throw new Error('changelog cannot be empty');
  }

  return lines.join('\n');
}

function hasChangelogInput(args) {
  return Boolean(args.changelog || args.message.length > 0);
}

function parseSemver(version) {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(version);

  if (!match) {
    throw new Error(`package.json version is not valid SemVer: ${version}`);
  }

  const prerelease = match[4] ? match[4].split('.') : null;
  validatePrereleaseIdentifiers(prerelease, version);

  return {
    raw: version,
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease,
  };
}

function validatePrereleaseIdentifiers(identifiers, version) {
  if (!identifiers) {
    return;
  }

  for (const identifier of identifiers) {
    if (/^\d+$/.test(identifier) && identifier.length > 1 && identifier.startsWith('0')) {
      throw new Error(`package.json version has an invalid numeric prerelease identifier: ${version}`);
    }
  }
}

function bumpVersion(version, releaseType, prereleaseTag, prereleaseBump) {
  switch (releaseType) {
    case 'major':
      return stringifySemver({ major: version.major + 1, minor: 0, patch: 0 });
    case 'minor':
      return stringifySemver({ major: version.major, minor: version.minor + 1, patch: 0 });
    case 'patch':
      return stringifySemver({ major: version.major, minor: version.minor, patch: version.patch + 1 });
    case 'promote':
      if (!version.prerelease) {
        throw new Error('promote requires the current version to be a prerelease version');
      }
      return stringifySemver({ major: version.major, minor: version.minor, patch: version.patch });
    case 'prerelease':
      return bumpPrerelease(version, prereleaseTag, prereleaseBump);
    default:
      throw new Error(`unsupported release type: ${releaseType}`);
  }
}

function bumpPrerelease(version, prereleaseTag, prereleaseBump) {
  const next = {
    major: version.major,
    minor: version.minor,
    patch: version.patch,
    prerelease: [prereleaseTag, '0'],
  };

  if (!version.prerelease) {
    const bumped = bumpStableVersion(version, prereleaseBump);
    next.major = bumped.major;
    next.minor = bumped.minor;
    next.patch = bumped.patch;
    return stringifySemver(next);
  }

  const [currentTag, ...rest] = version.prerelease;
  const lastIdentifier = rest.at(-1);
  const hasSameTag = currentTag === prereleaseTag;
  const hasNumericSuffix = lastIdentifier !== undefined && /^\d+$/.test(lastIdentifier);

  if (hasSameTag && hasNumericSuffix) {
    next.prerelease = [currentTag, ...rest.slice(0, -1), String(Number(lastIdentifier) + 1)];
  }

  return stringifySemver(next);
}

function bumpStableVersion(version, bump) {
  switch (bump) {
    case 'major':
      return { major: version.major + 1, minor: 0, patch: 0 };
    case 'minor':
      return { major: version.major, minor: version.minor + 1, patch: 0 };
    case 'patch':
      return { major: version.major, minor: version.minor, patch: version.patch + 1 };
    default:
      throw new Error(`unsupported prerelease bump: ${bump}`);
  }
}

function stringifySemver(version) {
  const core = `${version.major}.${version.minor}.${version.patch}`;
  return version.prerelease ? `${core}-${version.prerelease.join('.')}` : core;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatChangelogEntry(version, date, notes) {
  return `## ${version} - ${date}\n\n${notes.trim()}\n`;
}

function mergeChangelogNotes(unreleasedNotes, additionalNotes) {
  let mergedNotes = unreleasedNotes.trim();

  if (!additionalNotes.trim()) {
    if (!hasChangelogContent(mergedNotes)) {
      throw new Error('changelog cannot be empty');
    }
    return mergedNotes;
  }

  const groups = groupChangelogLines(additionalNotes);
  for (const [title, items] of groups) {
    mergedNotes = appendChangelogItems(mergedNotes, title, items);
  }

  return mergedNotes;
}

function appendChangelogItems(notes, title, items) {
  const heading = `### ${title}`;
  const itemLines = items.map((item) => `- ${item}`);

  if (!notes) {
    return `${heading}\n\n${itemLines.join('\n')}`;
  }

  const lines = notes.split(/\r?\n/);
  const sectionIndex = lines.findIndex(
    (line) => line.trim().toLowerCase() === heading.toLowerCase(),
  );

  if (sectionIndex === -1) {
    return `${notes.trim()}\n\n${heading}\n\n${itemLines.join('\n')}`;
  }

  const nextSectionOffset = lines
    .slice(sectionIndex + 1)
    .findIndex((line) => /^###(?!#)\s+/.test(line.trim()));
  const nextSectionIndex =
    nextSectionOffset === -1
      ? lines.length
      : sectionIndex + 1 + nextSectionOffset;
  let insertIndex = nextSectionIndex;

  while (insertIndex > sectionIndex + 1 && !lines[insertIndex - 1].trim()) {
    insertIndex -= 1;
  }

  lines.splice(insertIndex, 0, ...itemLines);
  return lines.join('\n').trim();
}

function groupChangelogLines(notes) {
  const groups = new Map();

  for (const rawLine of notes.split(/\r?\n/)) {
    const line = normalizeChangelogLine(rawLine);
    if (!line) {
      continue;
    }

    const parsed = parseChangelogCategory(line);
    const title = parsed.title || 'Changes';
    const items = groups.get(title) || [];
    items.push(parsed.text);
    groups.set(title, items);
  }

  if (groups.size === 0) {
    throw new Error('changelog cannot be empty');
  }

  return groups;
}

function normalizeChangelogLine(line) {
  return line.trim().replace(/^[-*]\s+/, '').trim();
}

function parseChangelogCategory(line) {
  const match = /^(?:\[([^\]]+)\]|([^:：]+))[:：]\s*(.+)$/.exec(line);
  if (!match) {
    return { title: 'Changes', text: line };
  }

  const rawCategory = (match[1] || match[2]).trim().toLowerCase();
  const text = match[3].trim();
  const title = categoryTitle(rawCategory);

  return title ? { title, text } : { title: 'Changes', text: line };
}

function categoryTitle(category) {
  const titles = {
    add: 'Added',
    added: 'Added',
    feature: 'Added',
    feat: 'Added',
    '新增': 'Added',
    change: 'Changed',
    changed: 'Changed',
    update: 'Changed',
    updated: 'Changed',
    '变更': 'Changed',
    fix: 'Fixed',
    fixed: 'Fixed',
    bugfix: 'Fixed',
    '修复': 'Fixed',
    remove: 'Removed',
    removed: 'Removed',
    '移除': 'Removed',
    deprecate: 'Deprecated',
    deprecated: 'Deprecated',
    '废弃': 'Deprecated',
    breaking: 'Breaking Changes',
    'breaking change': 'Breaking Changes',
    'breaking changes': 'Breaking Changes',
    '破坏性变更': 'Breaking Changes',
  };

  return titles[category];
}

async function readChangelog() {
  try {
    return await readFile(changelogPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return '';
    }
    throw error;
  }
}

function findUnreleasedSection(changelog) {
  const headingPattern = /^##(?!#)[ \t]+Unreleased[ \t]*\r?$/im;
  const headingMatch = headingPattern.exec(changelog);

  if (!headingMatch) {
    return {
      found: false,
      start: -1,
      end: -1,
      content: '',
    };
  }

  const contentStart = headingMatch.index + headingMatch[0].length;
  const remaining = changelog.slice(contentStart);
  const nextSectionMatch = /^##(?!#)[ \t]+.+$/m.exec(remaining);
  const end = nextSectionMatch
    ? contentStart + nextSectionMatch.index
    : changelog.length;

  return {
    found: true,
    start: headingMatch.index,
    end,
    content: changelog.slice(contentStart, end),
  };
}

function hasChangelogContent(content) {
  const withoutComments = content.replace(/<!--[\s\S]*?-->/g, '');

  return withoutComments
    .split(/\r?\n/)
    .some((line) => {
      const trimmed = line.trim();
      return Boolean(trimmed) && !/^#{3,6}\s+/.test(trimmed);
    });
}

async function updatePackageLock(nextVersion) {
  try {
    await access(packageLockPath, constants.F_OK);
  } catch {
    return;
  }

  const lockfile = await readJson(packageLockPath);
  lockfile.version = nextVersion;

  if (lockfile.packages?.['']) {
    lockfile.packages[''].version = nextVersion;
  }

  await writeJson(packageLockPath, lockfile);
}

async function updateChangelog(current, unreleasedSection, entry) {
  if (!current.trim()) {
    await writeFile(
      changelogPath,
      `# Changelog\n\n## Unreleased\n\n${entry}`,
      'utf8',
    );
    return;
  }

  if (unreleasedSection.found) {
    const before = current.slice(0, unreleasedSection.start).trimEnd();
    const after = current.slice(unreleasedSection.end).trimStart();
    const next = [
      before,
      '## Unreleased',
      entry.trim(),
      after,
    ].filter(Boolean).join('\n\n');

    await writeFile(changelogPath, `${next}\n`, 'utf8');
    return;
  }

  const titleMatch = /^#(?!#)[ \t]+Changelog[ \t]*\r?$/im.exec(current);

  if (titleMatch) {
    const titleEnd = titleMatch.index + titleMatch[0].length;
    const before = current.slice(0, titleEnd).trimEnd();
    const after = current.slice(titleEnd).trim();
    const next = [
      before,
      '## Unreleased',
      entry.trim(),
      after,
    ].filter(Boolean).join('\n\n');

    await writeFile(changelogPath, `${next}\n`, 'utf8');
    return;
  }

  await writeFile(
    changelogPath,
    `# Changelog\n\n## Unreleased\n\n${entry}\n${current.trimStart()}`,
    'utf8',
  );
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function writeJson(filePath, data) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function printSummary({ dryRun, currentVersion, nextVersion, releaseType, changelogEntry }) {
  console.log('');
  console.log(dryRun ? 'Dry run complete.' : 'Release files updated.');
  console.log(`Release type: ${releaseType}`);
  console.log(`Version: ${currentVersion} -> ${nextVersion}`);
  console.log('');
  console.log(changelogEntry.trim());
}
