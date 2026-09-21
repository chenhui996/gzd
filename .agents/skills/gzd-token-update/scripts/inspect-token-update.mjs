#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const inferredRoot = path.resolve(scriptDir, "../../../..");
const rootDir = process.cwd();

const requiredPaths = [
  "package.json",
  "gzd-design-tokens-origin",
  "gzd-design-tokens",
  "scripts/token-doc-metadata.json",
  "src/styles/themes/tokenDocs.test.ts",
];

if (!requiredPaths.every((item) => fs.existsSync(path.join(rootDir, item)))) {
  if (requiredPaths.every((item) => fs.existsSync(path.join(inferredRoot, item)))) {
    process.chdir(inferredRoot);
  } else {
    console.error("请在 gzd 仓库根目录运行此脚本。");
    process.exit(2);
  }
}

const repoRoot = process.cwd();
const modes = [
  ["goldDark", "gold-theme/dark-mode/tokens.json"],
  ["goldLight", "gold-theme/light-mode/tokens.json"],
  ["blueDark", "blue-theme/dark-mode/tokens.json"],
  ["blueLight", "blue-theme/light-mode/tokens.json"],
];

const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));

const readHeadJson = (relativePath) => {
  try {
    return JSON.parse(
      execFileSync("git", ["show", `HEAD:${relativePath}`], {
        cwd: repoRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }),
    );
  } catch {
    return undefined;
  }
};

const flattenPaths = (value, prefix = []) => {
  if (Array.isArray(value)) {
    return value.flatMap((child, index) =>
      flattenPaths(child, [...prefix, String(index + 1)]),
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      flattenPaths(child, [...prefix, key]),
    );
  }
  return [prefix.join(".")];
};

const orderedUnion = (collections) => {
  const result = [];
  const seen = new Set();
  for (const collection of collections) {
    for (const item of collection) {
      if (!seen.has(item)) {
        seen.add(item);
        result.push(item);
      }
    }
  }
  return result;
};

const inventoryFromThemes = (themes) => ({
  global: orderedUnion(themes.map((theme) => Object.keys(theme.token ?? {}))),
  components: orderedUnion(
    themes.map((theme) =>
      Object.entries(theme.components ?? {}).flatMap(([component, tokens]) =>
        flattenPaths(tokens).map((tokenPath) => `${component}.${tokenPath}`),
      ),
    ),
  ),
  componentGroups: orderedUnion(
    themes.map((theme) => Object.keys(theme.components ?? {})),
  ),
  custom: orderedUnion(themes.map((theme) => flattenPaths(theme.custom ?? {}))),
});

const setDiff = (left, right) => {
  const rightSet = new Set(right);
  return left.filter((item) => !rightSet.has(item));
};

const formatList = (values) => (values.length ? values.join(", ") : "无");

const sourceStatus = (() => {
  try {
    return execFileSync(
      "git",
      ["status", "--short", "--", "gzd-design-tokens-origin"],
      { cwd: repoRoot, encoding: "utf8" },
    ).trim();
  } catch {
    return "无法读取 Git 状态";
  }
})();

console.log("Token 源文件变更:");
if (sourceStatus) {
  for (const line of sourceStatus.split("\n")) {
    console.log(`- ${line.trimStart()}`);
  }
} else {
  console.log("无");
}

const currentThemes = [];
const headThemes = [];

console.log("\n当前生成主题:");
for (const [label, relativePath] of modes) {
  const fullPath = path.join("gzd-design-tokens", relativePath);
  const current = readJson(fullPath);
  const head = readHeadJson(fullPath);
  currentThemes.push(current);
  if (head) headThemes.push(head);
  console.log(
    `- ${label}: global=${Object.keys(current.token ?? {}).length}, ` +
      `components=${Object.keys(current.components ?? {}).length}, ` +
      `customGroups=${Object.keys(current.custom ?? {}).length}, ` +
      `unresolvedAliases=${current.meta?.unresolvedAliasCount ?? "未知"}`,
  );
}

const currentInventory = inventoryFromThemes(currentThemes);
const headInventory =
  headThemes.length === modes.length ? inventoryFromThemes(headThemes) : undefined;

console.log("\n公开清单:");
for (const key of ["global", "components", "componentGroups", "custom"]) {
  const current = currentInventory[key];
  console.log(`- ${key}: ${current.length}`);
  if (headInventory) {
    console.log(`  新增: ${formatList(setDiff(current, headInventory[key]))}`);
    console.log(`  删除: ${formatList(setDiff(headInventory[key], current))}`);
  }
}

const metadata = readJson("scripts/token-doc-metadata.json");
const metadataNames = Object.keys(metadata.global ?? {});
console.log("\n全局 Token 文档元数据:");
console.log(`- 缺少: ${formatList(setDiff(currentInventory.global, metadataNames))}`);
console.log(`- 多出: ${formatList(setDiff(metadataNames, currentInventory.global))}`);

const testSource = fs.readFileSync(
  path.join(repoRoot, "src/styles/themes/tokenDocs.test.ts"),
  "utf8",
);
const baselineKeys = ["global", "components", "componentGroups", "custom"];
console.log("\nToken 文档测试数量基线:");
let hasMismatch = false;
for (const key of baselineKeys) {
  const match = testSource.match(
    new RegExp(`inventory\\.${key}\\)\\.toHaveLength\\((\\d+)\\)`),
  );
  const expected = match ? Number(match[1]) : undefined;
  const actual = currentInventory[key].length;
  const status = expected === actual ? "一致" : "需更新";
  hasMismatch ||= expected !== actual;
  console.log(`- ${key}: test=${expected ?? "未找到"}, actual=${actual} (${status})`);
}

const metadataMissing = setDiff(currentInventory.global, metadataNames);
const metadataExtra = setDiff(metadataNames, currentInventory.global);
const unresolved = currentThemes.reduce(
  (total, theme) => total + (theme.meta?.unresolvedAliasCount ?? 0),
  0,
);

console.log("\n结论:");
if (metadataMissing.length || metadataExtra.length || hasMismatch || unresolved) {
  console.log("存在需要人工确认的文档元数据、清单基线或引用问题。");
} else {
  console.log("生成主题、全局元数据和清单数量当前一致。");
}
