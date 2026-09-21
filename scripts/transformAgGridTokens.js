import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { fixedFontFamilyCssValue } from "./tokenFontFamily.js";

const scriptFile = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(scriptFile), "..");
const agGridTokenConfigs = {
  dark: {
    sourceFile: path.join(
      rootDir,
      "gzd-design-tokens-origin/gold-theme/ag-grid/Dark.tokens.json",
    ),
    outputFile: path.join(
      rootDir,
      "gzd-design-tokens/gold-theme/dark-mode/ag-grid/goldDarkAgGridTokens.ts",
    ),
    exportName: "goldDarkAgGridTokens",
  },
  light: {
    sourceFile: path.join(
      rootDir,
      "gzd-design-tokens-origin/gold-theme/ag-grid/Light.tokens.json",
    ),
    outputFile: path.join(
      rootDir,
      "gzd-design-tokens/gold-theme/light-mode/ag-grid/goldLightAgGridTokens.ts",
    ),
    exportName: "goldLightAgGridTokens",
  },
};

const themeTypeFiles = [
  "node_modules/ag-stack/dist/types/src/theming/shared/shared-css.d.ts",
  "node_modules/ag-grid-community/dist/types/src/theming/core/core-css.d.ts",
  "node_modules/ag-grid-community/dist/types/src/theming/parts/button-style/button-styles.d.ts",
  "node_modules/ag-grid-community/dist/types/src/theming/parts/checkbox-style/checkbox-styles.d.ts",
  "node_modules/ag-grid-community/dist/types/src/theming/parts/tab-style/tab-styles.d.ts",
  "node_modules/ag-grid-community/dist/types/src/theming/parts/input-style/input-styles.d.ts",
];

// 设计侧仍会交付这些历史/扩展参数。AG Grid 36 的公开类型没有全部声明，
// 但 withParams 能为它们生成对应的 --ag-* 变量，因此需要保留在公开产物中。
export const agGridExtensionTokenKeys = [
  "checkboxCheckedColor",
  "chromeForegroundColor",
  "dropdownBorderRadius",
  "headerBorderColor",
  "inputDisabledBorderLegacy",
  "inputRightIconVisible",
  "radioCheckedShapeImage",
  "rowGroupBgColor",
  "rowGroupBgHoverColor",
  "scrollbarThumbColor",
  "scrollbarThumbHoverColor",
  "tabBorderColor",
  "widgetContainerBorderRadius",
  "widgetContainerVerticalSpacing",
];

const isToken = (value) =>
  value && typeof value === "object" && "$value" in value;

const getAliasPath = (token) => {
  if (typeof token?.$value !== "string") return undefined;
  return token.$value.match(/^\{(.+)\}$/)?.[1];
};

const colorToCss = (value) => {
  if (!value || typeof value !== "object" || !value.hex) return undefined;

  if (value.alpha === undefined || value.alpha >= 1) return value.hex;

  const alpha = Number(value.alpha.toFixed(2));
  const components = value.components ?? [];
  const channels = components.map((channel) => Math.round(channel * 255));
  return `rgba(${channels.join(", ")}, ${alpha})`;
};

const shouldSkipPath = (pathParts) => {
  if (pathParts[0] === "Color" || pathParts.includes("fixed")) return true;
  if (pathParts[0] !== "charts") return false;
  if (pathParts.length === 1) return false;

  return !["chartMenuPanelWidth", "chartMenuLabelColor"].includes(
    pathParts.at(-1),
  );
};

const collectRawTokens = (source) => {
  const allTokensByPath = new Map();
  const selectedTokensByName = new Map();
  const duplicateNames = new Map();
  let skippedTokenCount = 0;

  const walk = (node, pathParts = [], parentSkipped = false) => {
    if (!node || typeof node !== "object") return;

    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) continue;

      const nextPath = [...pathParts, key];
      const skipped = parentSkipped || shouldSkipPath(nextPath);

      if (isToken(value)) {
        const tokenPath = nextPath.join(".");
        const record = {
          name: key,
          path: tokenPath,
          token: value,
          selected: !skipped,
        };
        allTokensByPath.set(tokenPath, record);

        if (skipped) {
          skippedTokenCount += 1;
          continue;
        }

        const existing = selectedTokensByName.get(key);
        if (existing) {
          duplicateNames.set(key, [
            ...(duplicateNames.get(key) ?? [existing.path]),
            tokenPath,
          ]);
          continue;
        }

        selectedTokensByName.set(key, record);
        continue;
      }

      walk(value, nextPath, skipped);
    }
  };

  walk(source);

  if (duplicateNames.size > 0) {
    const details = [...duplicateNames]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, tokenPaths]) => `${name}: ${tokenPaths.join(", ")}`)
      .join("; ");
    throw new Error(
      `Duplicate AG Grid token basenames found. Basenames must be unique after filtering. ${details}`,
    );
  }

  return {
    allTokensByPath,
    selectedTokensByName,
    skippedTokenCount,
  };
};

const validateSourceReferences = (allTokensByPath) => {
  const states = new Map();

  const visit = (record, chain = []) => {
    const state = states.get(record.path);
    if (state === "visited") return;
    if (state === "visiting") {
      throw new Error(
        `Circular AG Grid token reference: ${[...chain, record.path].join(" -> ")}`,
      );
    }

    states.set(record.path, "visiting");
    const aliasPath = getAliasPath(record.token);
    if (aliasPath) {
      const referenced = allTokensByPath.get(aliasPath);
      if (!referenced) {
        throw new Error(
          `Missing AG Grid token reference "${aliasPath}" from "${record.path}".`,
        );
      }
      visit(referenced, [...chain, record.path]);
    }
    states.set(record.path, "visited");
  };

  for (const record of allTokensByPath.values()) visit(record);
};

const normalizeValue = (key, record, context, chain = []) => {
  if (!record) return undefined;

  const { allTokensByPath, validKeys } = context;
  const { token } = record;
  const aliasPath = getAliasPath(token);
  if (aliasPath) {
    const referenced = allTokensByPath.get(aliasPath);
    if (!referenced) {
      throw new Error(
        `Missing AG Grid token reference "${aliasPath}" from "${record.path}".`,
      );
    }

    if (chain.includes(referenced.path) || referenced.path === record.path) {
      throw new Error(
        `Circular AG Grid token reference: ${[
          ...chain,
          record.path,
          referenced.path,
        ].join(" -> ")}`,
      );
    }

    // 只有真正属于 AG Grid 参数的别名才保留为 ref；Figma 中间变量继续向下解析。
    if (referenced.selected && validKeys.has(referenced.name)) {
      return { ref: referenced.name };
    }

    return normalizeValue(key, referenced, context, [...chain, record.path]);
  }

  // 这个兼容参数在 Figma 中带有 boolean 标记，但 AG Grid 的参数推断会把
  // 未知 boolean 判为无效值；保留原始 0/1 才能稳定生成 CSS 变量。
  if (
    key === "inputRightIconVisible" &&
    typeof token.$value === "number"
  ) {
    return token.$value;
  }

  const figmaType = token.$extensions?.["com.figma.type"];
  if (figmaType === "boolean") return Boolean(token.$value);

  if (typeof token.$value === "string") {
    if (key === "browserColorScheme") return token.$value.toLowerCase();
    return token.$value;
  }

  if (token.$type === "color") return colorToCss(token.$value);
  if (["number", "boolean"].includes(typeof token.$value)) {
    // Figma 用 0 表示不提供自定义图片；AG Grid 的合法 ImageValue 是 none。
    if (key.endsWith("Image")) {
      return token.$value === 0 ? "none" : undefined;
    }
    if (key.endsWith("Shadow")) return token.$value === 0 ? false : undefined;
    return token.$value;
  }

  return undefined;
};

const normalizeBorder = (key, rawTokens, context) => {
  const token = rawTokens.get(key);
  const colorToken = rawTokens.get(`${key}Color`);
  const widthToken = rawTokens.get(`${key}Width`);

  if (!token && !colorToken && !widthToken) return undefined;

  if (colorToken || widthToken) {
    const enabled = token ? normalizeValue(key, token, context) : true;
    if (enabled === false || enabled === 0) return false;

    return {
      style: "solid",
      width: widthToken
        ? normalizeValue(`${key}Width`, widthToken, context)
        : 1,
      color: colorToken
        ? normalizeValue(`${key}Color`, colorToken, context)
        : { ref: "borderColor" },
    };
  }

  const normalized = normalizeValue(key, token, context);
  if (typeof normalized === "number") return normalized === 0 ? false : true;
  return normalized;
};

const collectGeneratedReferences = (value, references = []) => {
  if (!value || typeof value !== "object") return references;
  if (typeof value.ref === "string") references.push(value.ref);

  for (const child of Object.values(value)) {
    collectGeneratedReferences(child, references);
  }
  return references;
};

export const convertTokensWithStats = (source, validKeys) => {
  const {
    allTokensByPath,
    selectedTokensByName,
    skippedTokenCount,
  } = collectRawTokens(source);
  validateSourceReferences(allTokensByPath);

  const result = {};
  const context = { allTokensByPath, validKeys };

  for (const key of [...validKeys].sort()) {
    const value = key.endsWith("Border")
      ? normalizeBorder(key, selectedTokensByName, context)
      : normalizeValue(key, selectedTokensByName.get(key), context);

    if (value !== undefined) result[key] = value;
  }

  const references = collectGeneratedReferences(result);
  const invalidReferences = [...new Set(references)]
    .filter((reference) => !validKeys.has(reference))
    .sort();
  if (invalidReferences.length > 0) {
    throw new Error(
      `Generated AG Grid token refs are not ThemeDefaultParams: ${invalidReferences.join(", ")}`,
    );
  }

  return {
    tokens: result,
    stats: {
      sourceTokenCount: allTokensByPath.size,
      selectedTokenCount: selectedTokensByName.size,
      skippedTokenCount,
      generatedParamCount: Object.keys(result).length,
      generatedReferenceCount: references.length,
    },
  };
};

export const convertTokens = (source, validKeys) =>
  convertTokensWithStats(source, validKeys).tokens;

export const loadValidThemeParamNames = () => {
  const validKeys = new Set();
  for (const relativeFile of themeTypeFiles) {
    const source = fs.readFileSync(path.join(rootDir, relativeFile), "utf8");
    for (const match of source.matchAll(
      /^\s{4}([A-Za-z][A-Za-z0-9]*)\??\s*:/gm,
    )) {
      validKeys.add(match[1]);
    }
  }
  for (const key of agGridExtensionTokenKeys) validKeys.add(key);
  return validKeys;
};

export const generateAgGridTokens = (mode = "dark") => {
  const config = agGridTokenConfigs[mode];
  if (!config) throw new Error(`Unsupported AG Grid token mode: ${mode}`);

  const source = JSON.parse(fs.readFileSync(config.sourceFile, "utf8"));
  const { tokens, stats } = convertTokensWithStats(
    source,
    loadValidThemeParamNames(),
  );
  // 统一 fontFamily 兜底：让 AG Grid 直接消费主包生成的 CSS 变量
  // 这样既能保持全局统一，又能避免因包含逗号和引号的复杂字符串在 AG Grid 内部解析出错。
  tokens.fontFamily = "var(--gz-font-family)";
  
  // 对于 Figma 中可能定义的特定组件字体（如单元格、表头等），同样强制替换为统一字体，
  // 除非它们有特殊的图标字体（如 charts.fontFamily 我们暂不处理）。
  for (const key of Object.keys(tokens)) {
    if (key.endsWith("FontFamily") && tokens[key] !== undefined) {
      tokens[key] = "var(--gz-font-family)";
    }
  }
  const relativeSource = path
    .relative(rootDir, config.sourceFile)
    .split(path.sep)
    .join("/");
  const output = `// AUTO-GENERATED FILE. Update ${relativeSource} and run npm run tokens:transform:ag-grid.\nimport type { GZDAgGridTokens } from "../../../../src/gzd-table/agGridTokens";\n\nexport const ${config.exportName} = ${JSON.stringify(tokens, null, 2)} satisfies GZDAgGridTokens;\n`;

  fs.mkdirSync(path.dirname(config.outputFile), { recursive: true });
  fs.writeFileSync(config.outputFile, output, "utf8");
  console.info(
    `[AG Grid Tokens] ${mode}: ${stats.sourceTokenCount} source, ${stats.selectedTokenCount} selected, ${stats.skippedTokenCount} skipped, ${stats.generatedParamCount} generated, ${stats.generatedReferenceCount} refs.`,
  );
  return tokens;
};

export const generateGoldDarkAgGridTokens = () => generateAgGridTokens("dark");
export const generateGoldLightAgGridTokens = () =>
  generateAgGridTokens("light");

if (
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
) {
  const requestedMode = process.argv[2];
  if (requestedMode === "dark" || requestedMode === "light") {
    generateAgGridTokens(requestedMode);
  } else {
    generateGoldDarkAgGridTokens();
    generateGoldLightAgGridTokens();
  }
}
