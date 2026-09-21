---
name: release-package
description: Safely prepare, commit, and publish formal or Beta releases of the gzd npm package. Use when a maintainer asks to release, publish, 发包, 发布正式包, 发布 Beta 包, or continue a prepared npm release in this repository.
---

# Release Package

Prepare exactly one npm release with explicit version and publish checkpoints. Reuse
`scripts/release-prepare.js`; do not calculate or edit versions by hand.

## Safety rules

- Treat `npm publish`, `git commit`, version changes, and changelog archival as separate stages.
- Never publish until a release commit exists and the user confirms the exact package,
  version, registry, and dist-tag in a new message after seeing the final summary.
- Never push, create a Git tag, amend, reset, stash, or delete a release commit.
- Never use `git add .` or `git add -A`. Stage only `package.json`,
  `package-lock.json`, and `CHANGELOG.md`.
- Require a clean starting worktree. If it is dirty, stop and list the paths; do not
  modify or clean them.
- Require the current branch to have an upstream and to be neither ahead nor behind it.
- Require the user to supply non-empty changelog notes for this release even when
  `CHANGELOG.md#Unreleased` already contains notes.
- Never interpolate user-provided changelog text into a shell command. Store it in a
  uniquely named temporary file using `apply_patch`, pass the path through
  `--changelog`, and use another temporary file with `git commit -F` for the commit
  message. Delete only those exact temporary files with `apply_patch` after their
  final use.
- Stop on every failed check. Preserve prepared files or the release commit so the
  maintainer can inspect and retry safely.

## 1. Preflight

Run read-only checks from the repository root:

```shell
git status --short --branch
git status --porcelain
git branch --show-current
git rev-list --left-right --count HEAD...@{upstream}
npm config get registry
npm whoami --registry=https://registry.npmjs.org/
```

Require:

- an empty porcelain status;
- a named branch with a configured upstream;
- upstream counts `0 0`;
- registry `https://registry.npmjs.org/`;
- successful npm authentication.

Read the package name and current version from `package.json`. Do not publish from a
detached HEAD or silently switch branches.

## 2. Collect choices

Ask for the release channel: `formal` or `beta`. Ask the user for one or more
changelog lines. Preserve their wording in the commit body. The preparation script
may normalize recognized prefixes such as `新增：`, `变更：`, `修复：`, `移除：`,
`废弃：`, and `破坏性变更：` into Changelog sections.

Select the release arguments from the current version:

| Current version | Channel | Action |
| --- | --- | --- |
| Stable | Formal | Ask for `patch`, `minor`, or `major`; use `--type <bump>` |
| Stable | Beta | Ask for `patch`, `minor`, or `major`; use `--type prerelease --bump <bump> --tag beta` |
| `-beta.N` | Beta | Use `--type prerelease --tag beta`; do not pass `--bump` |
| `-beta.N` | Formal | Use `--type promote` |

If the current prerelease identifier is not `beta`, stop and ask for direction. Do
not silently convert alpha or rc releases into Beta releases.

## 3. Preview and prepare

Create a uniquely named changelog file under `/tmp`, write the user's exact notes
with `apply_patch`, and run the selected command with `--dry-run` and
`--changelog <path>`. Show the calculated version and normalized Changelog entry.

After confirming that the preview matches the already supplied choices, rerun the
same command without `--dry-run`. This stage may change only:

- `package.json`
- `package-lock.json`
- `CHANGELOG.md`

Read the new version from `package.json`. Check whether that exact version already
exists before building:

```shell
npm view <package>@<version> version --registry=https://registry.npmjs.org/
```

A registry not-found result is expected. If the version exists or the result is
ambiguous because of a network/authentication failure, stop.

## 4. Build and inspect the package

Run all required checks:

```shell
npm run test:release
npm run build
npm run verify:exports
npm --cache /tmp/gzd-release-npm-cache pack --dry-run
git diff --check
git status --short
git diff -- package.json package-lock.json CHANGELOG.md
```

The explicit temporary cache avoids this workstation's root-owned `~/.npm` cache
entries without changing their ownership. `npm pack --dry-run` invokes `prepack`, so a repeated build is expected. Stop if any
command fails. Require all tracked modifications to be limited to the three release
files. Do not stage ignored build output.

## 5. Create the release commit

Build a commit message file without passing user text through the shell:

```text
chore(release): v<new-version>

Changelog:
- <user changelog line 1>
- <user changelog line 2>
```

Then stage and inspect only the release files:

```shell
git add -- package.json package-lock.json CHANGELOG.md
git diff --cached --check
git diff --cached --name-only
git diff --cached
git commit -F <commit-message-file>
```

Require the staged name list to contain exactly the three release files. After a
successful commit, remove the two exact temporary files and run:

```shell
git status --short
git show --stat --oneline --decorate HEAD
```

Require a clean worktree.

## 6. Mandatory publish confirmation

Present:

- package name and new version;
- `formal` with dist-tag `latest`, or `beta` with dist-tag `beta`;
- registry URL;
- release commit hash and subject;
- the exact publish command.

Then stop and ask the user to confirm publishing that exact version. A choice made
before the commit is not publish authorization. Do not accept vague acknowledgements
that do not clearly approve publishing.

If the user declines, finish with the commit preserved and explain that no package
was published.

## 7. Publish and verify

Only after explicit post-commit confirmation, recheck that HEAD is the displayed
release commit, the worktree is clean, the version is unchanged, and npm auth still
works. Publish with an explicit dist-tag:

```shell
# Beta
npm --cache /tmp/gzd-release-npm-cache publish --tag beta --access public --registry=https://registry.npmjs.org/

# Formal
npm --cache /tmp/gzd-release-npm-cache publish --tag latest --access public --registry=https://registry.npmjs.org/
```

Verify the immutable version and current dist-tags:

```shell
npm view <package>@<version> version --registry=https://registry.npmjs.org/
npm dist-tag ls <package> --registry=https://registry.npmjs.org/
git status --short
```

For Beta, explicitly verify that `beta` points to the new version and do not alter
`latest`. For a formal release, verify that `latest` points to the new version.

If publishing returns an error or times out, query the exact version before retrying.
If it exists, treat the publish as successful and verify dist-tags. If it does not
exist, report the failure and preserve the release commit; never bump again or retry
without renewed user confirmation.
