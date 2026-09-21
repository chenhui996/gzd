#!/usr/bin/env node

import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { packageExportsConfig } from "./package-exports.config.js";

const rootDir = process.cwd();
const packageJson = JSON.parse(
  await readFile(path.join(rootDir, "package.json"), "utf8"),
);
const require = createRequire(import.meta.url);

assert.equal(
  packageJson.name,
  packageExportsConfig.packageName,
  "Package name does not match the export verification config.",
);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resolvePackageSpecifier(packageName, subpath) {
  if (subpath === ".") return packageName;
  assert.match(subpath, /^\.\/.+/, `Invalid package subpath: ${subpath}`);
  return `${packageName}/${subpath.slice(2)}`;
}

async function verifyArtifacts({ label, targets }) {
  await Promise.all(
    Object.values(targets).map((target) =>
      access(path.resolve(rootDir, target)),
    ),
  );
  assert.ok(targets.types, `${label} must configure a declaration target.`);
}

async function verifyDeclaration({ label, targets, declaration = {} }) {
  const declarationText = await readFile(
    path.resolve(rootDir, targets.types),
    "utf8",
  );

  for (const source of declaration.reExports ?? []) {
    const pattern = new RegExp(
      `export\\s+\\*\\s+from\\s+["']${escapeRegExp(source)}["'];?`,
    );
    assert.match(
      declarationText,
      pattern,
      `${label} declaration must re-export ${source}.`,
    );
  }

  for (const symbol of declaration.requiredSymbols ?? []) {
    assert.ok(
      declarationText.includes(symbol),
      `${label} declaration must include ${symbol}.`,
    );
  }

  for (const symbol of declaration.forbiddenSymbols ?? []) {
    assert.ok(
      !declarationText.includes(symbol),
      `${label} declaration must not include ${symbol}.`,
    );
  }
}

function verifyRuntimeModule(label, moduleFormat, moduleExports, runtime) {
  for (const exportName of runtime.requiredExports ?? []) {
    assert.ok(
      moduleExports[exportName],
      `${label} ${moduleFormat} must export ${exportName}.`,
    );
  }

  for (const [exportName, expectedType] of Object.entries(
    runtime.exportTypes ?? {},
  )) {
    assert.equal(
      typeof moduleExports[exportName],
      expectedType,
      `${label} ${moduleFormat} export ${exportName} must be a ${expectedType}.`,
    );
  }

  for (const exportName of runtime.forbiddenExports ?? []) {
    assert.equal(
      moduleExports[exportName],
      undefined,
      `${label} ${moduleFormat} must not export ${exportName}.`,
    );
  }
}

async function verifyRuntime(entry) {
  if (!entry.runtime) return;

  const packageSpecifier = resolvePackageSpecifier(
    packageJson.name,
    entry.subpath,
  );
  const esmModule = await import(packageSpecifier);
  const cjsModule = require(packageSpecifier);

  verifyRuntimeModule(entry.label, "ESM", esmModule, entry.runtime);
  verifyRuntimeModule(entry.label, "CommonJS", cjsModule, entry.runtime);
}

for (const entry of packageExportsConfig.subpaths) {
  assert.deepEqual(
    packageJson.exports?.[entry.subpath],
    entry.targets,
    `${entry.label} package export mapping does not match the config.`,
  );
  await verifyArtifacts(entry);
  await verifyDeclaration(entry);
  await verifyRuntime(entry);
}

// CSS 只验证发布映射与解析结果，不作为 JavaScript 模块执行。
for (const subpath of ["./gzd.css", "./style.css"]) {
  const target = "./gzd-lib/gzd.css";
  assert.equal(packageJson.exports?.[subpath], target);
  assert.equal(
    require.resolve(resolvePackageSpecifier(packageJson.name, subpath)),
    path.resolve(rootDir, target),
  );
}
const css = await readFile(path.join(rootDir, "gzd-lib/gzd.css"), "utf8");
assert.ok(css.includes(".gzd-"), "Published CSS must include gzd component classes.");
assert.ok(css.includes("--gzd-"), "Published CSS must use gzd token variables.");

const verifiedSubpaths = packageExportsConfig.subpaths
  .map(({ subpath }) => subpath)
  .join(", ");
console.log(`Verified package export subpaths: ${verifiedSubpaths}.`);
