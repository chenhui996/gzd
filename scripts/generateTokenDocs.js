import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptFile = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(scriptFile), "..");

const modeConfigs = [
  {
    id: "gold-dark",
    label: "Gold Dark",
    file: "gzd-design-tokens/gold-theme/dark-mode/tokens.json",
  },
  {
    id: "gold-light",
    label: "Gold Light",
    file: "gzd-design-tokens/gold-theme/light-mode/tokens.json",
  },
  {
    id: "blue-dark",
    label: "Blue Dark",
    file: "gzd-design-tokens/blue-theme/dark-mode/tokens.json",
  },
  {
    id: "blue-light",
    label: "Blue Light",
    file: "gzd-design-tokens/blue-theme/light-mode/tokens.json",
  },
];

const agGridConfigs = [
  {
    id: "gold-dark",
    label: "Gold Dark",
    file: "gzd-design-tokens/gold-theme/dark-mode/ag-grid/goldDarkAgGridTokens.ts",
    exportName: "goldDarkAgGridTokens",
  },
  {
    id: "gold-light",
    label: "Gold Light",
    file: "gzd-design-tokens/gold-theme/light-mode/ag-grid/goldLightAgGridTokens.ts",
    exportName: "goldLightAgGridTokens",
  },
];

const expectedAgGridTokenCount = 225;

const outputFiles = {
  global: "docs/tokens.md",
  components: "docs/tokens/components.md",
  custom: "docs/tokens/custom.md",
  ag: "docs/tokens/ag-grid-table.md",
};

const tokenDemoFiles = [
  "docs/tokens/demo/global.tsx",
  "docs/tokens/demo/components.tsx",
  "docs/tokens/demo/custom.tsx",
  "docs/tokens/demo/ag-grid-table.tsx",
];

const metadataFile = path.join(rootDir, "scripts/token-doc-metadata.json");
const componentDescriptionFiles = [
  "gzd-design-tokens-origin/gold-theme/components/Dark.tokens.json",
  "gzd-design-tokens-origin/gold-theme/components/Light.tokens.json",
  "gzd-design-tokens-origin/blue-theme/components/Dark.tokens.json",
  "gzd-design-tokens-origin/blue-theme/components/Light.tokens.json",
];

const readJson = (relativeFile) =>
  JSON.parse(fs.readFileSync(path.join(rootDir, relativeFile), "utf8"));

const tokenNameFromPath = (pathParts) => {
  if (pathParts.length <= 1) return pathParts[0];
  return `${pathParts[0]}${pathParts
    .slice(1)
    .map((value) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`)
    .join("")}`;
};

const loadComponentDescriptions = () => {
  const descriptions = {};

  const visitComponent = (componentName, value, pathParts = []) => {
    for (const [key, child] of Object.entries(value)) {
      if (child && typeof child === "object" && "$value" in child) {
        const tokenName = tokenNameFromPath([...pathParts, key]);
        const description = child.$description;
        if (typeof description === "string" && description.trim()) {
          descriptions[`${componentName}.${tokenName}`] ??= description.trim();
        }
      } else if (child && typeof child === "object") {
        visitComponent(componentName, child, [...pathParts, key]);
      }
    }
  };

  for (const relativeFile of componentDescriptionFiles) {
    const source = readJson(relativeFile);
    for (const [componentName, value] of Object.entries(source)) {
      if (/^[A-Z]/.test(componentName) && value && typeof value === "object") {
        visitComponent(componentName, value);
      }
    }
  }

  return descriptions;
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const isDisplayColor = (value) =>
  typeof value === "string" &&
  /^(#[\da-f]{3,8}|rgba?\([\d.,%\s/-]+\)|hsla?\([\d.,%a-z\s/-]+\)|transparent)$/i.test(
    value,
  );

const renderValue = (value) => {
  if (value === undefined) {
    return '<span style="color: #8c8c8c;">—</span>';
  }

  const text =
    value && typeof value === "object" ? JSON.stringify(value) : String(value);
  const swatch = isDisplayColor(value)
    ? `<span aria-hidden="true" class="gzd-token-swatch" style="background:${escapeHtml(value)};"></span>`
    : "";

  return `${swatch}<code>${escapeHtml(text)}</code>`;
};

export const toKebabCase = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/([a-zA-Z])(\d)/g, "$1-$2")
    .replace(/(\d)([a-zA-Z])/g, "$1-$2")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const cssVariableName = (prefix, pathParts) =>
  `--${prefix}-${pathParts.map(toKebabCase).join("-")}`;

const orderedUnion = (collections) => {
  const values = [];
  const seen = new Set();

  for (const collection of collections) {
    for (const value of collection) {
      if (seen.has(value)) continue;
      seen.add(value);
      values.push(value);
    }
  }

  return values;
};

const getNestedValue = (value, pathParts) => {
  let current = value;

  for (const pathPart of pathParts) {
    if (!current || typeof current !== "object") return undefined;
    current = Array.isArray(current) && /^\d+$/.test(pathPart)
      ? current[Number(pathPart) - 1]
      : current[pathPart];
  }

  return current;
};

export const flattenTokenValues = (value, pathParts = [], result = []) => {
  if (Array.isArray(value)) {
    value.forEach((child, index) => {
      flattenTokenValues(child, [...pathParts, String(index + 1)], result);
    });
    return result;
  }

  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      flattenTokenValues(child, [...pathParts, key], result);
    }
    return result;
  }

  result.push({ pathParts, value });
  return result;
};

const assertUnique = (values, label) => {
  if (new Set(values).size !== values.length) {
    throw new Error(`${label} 存在重复项`);
  }
};

const assertSameStringSet = (actual, expected, label) => {
  const missing = expected.filter((value) => !actual.includes(value));
  const extra = actual.filter((value) => !expected.includes(value));

  if (missing.length > 0 || extra.length > 0) {
    throw new Error(
      `${label} 集合不一致；缺少：${missing.join(", ") || "无"}；多出：${
        extra.join(", ") || "无"
      }`,
    );
  }
};

const describeValueType = (values) => {
  const types = [];
  for (const value of values.filter((item) => item !== undefined)) {
    let type;
    if (value === null) type = "null";
    else if (Array.isArray(value)) type = "array";
    else if (typeof value !== "object") type = typeof value;
    else if (typeof value.ref === "string") type = "reference";
    else if (
      Object.keys(value).some((key) =>
        ["color", "style", "width"].includes(key),
      )
    ) {
      type = "border";
    } else type = "object";

    if (!types.includes(type)) types.push(type);
  }

  return types.join(" / ") || "unknown";
};

const renderTable = ({ headers, rows, minWidth = 1200 }) =>
  [
    '<div style="overflow-x:auto;">',
    `<table style="width:100%;min-width:${minWidth}px;table-layout:auto;">`,
    "<thead>",
    "<tr>",
    ...headers.map((header) => `<th>${escapeHtml(header)}</th>`),
    "</tr>",
    "</thead>",
    "<tbody>",
    ...rows.map(
      ({ id, cells }) =>
        `<tr data-token-path="${escapeHtml(id)}">${cells
          .map((cell) => `<td>${cell}</td>`)
          .join("")}</tr>`,
    ),
    "</tbody>",
    "</table>",
    "</div>",
  ].join("\n");

const fencedCode = (language, value) =>
  [`\`\`\`${language}`, value.trim(), "\`\`\`"].join("\n");

const generatedNotice =
  '<!-- AUTO-GENERATED by scripts/generateTokenDocs.js. 请修改 Token 源或生成脚本，不要手工修改清单。 -->';

const readGeneratedJsonExport = (relativeFile, exportName) => {
  const source = fs.readFileSync(path.join(rootDir, relativeFile), "utf8");
  const marker = `export const ${exportName} = `;
  const startIndex = source.indexOf(marker);
  if (startIndex < 0) {
    throw new Error(`Missing export ${exportName} in ${relativeFile}`);
  }

  const assignment = source.slice(startIndex + marker.length);
  const endIndex = assignment.indexOf(" satisfies ");
  if (endIndex < 0) {
    throw new Error(`Cannot parse generated export ${exportName} in ${relativeFile}`);
  }

  return JSON.parse(assignment.slice(0, endIndex).trim());
};

const loadDocumentationData = () => {
  const themes = Object.fromEntries(
    modeConfigs.map((config) => [config.id, readJson(config.file)]),
  );
  const agGrid = Object.fromEntries(
    agGridConfigs.map((config) => [
      config.id,
      readGeneratedJsonExport(config.file, config.exportName),
    ]),
  );
  return {
    themes,
    agGrid,
    componentDescriptions: loadComponentDescriptions(),
    metadata: JSON.parse(fs.readFileSync(metadataFile, "utf8")),
  };
};

const buildGlobalDocumentation = ({ themes, metadata }) => {
  const tokenNames = orderedUnion(
    modeConfigs.map(({ id }) => Object.keys(themes[id].token)),
  );
  assertUnique(tokenNames, "Global Token");
  assertSameStringSet(
    Object.keys(metadata.global),
    tokenNames,
    "Global Token 文档元数据",
  );
  const missingDescriptions = tokenNames.filter(
    (tokenName) => !metadata.global[tokenName],
  );
  if (missingDescriptions.length > 0) {
    throw new Error(
      `Global Token 缺少文档说明：${missingDescriptions.join(", ")}`,
    );
  }
  const rows = tokenNames.map((tokenName) => ({
    id: tokenName,
    cells: [
      `<code>${escapeHtml(tokenName)}</code>`,
      escapeHtml(metadata.global[tokenName]),
      `<code>${escapeHtml(
        describeValueType(
          modeConfigs.map(({ id }) => themes[id].token[tokenName]),
        ),
      )}</code>`,
      `<code>${escapeHtml(cssVariableName("gzd", [tokenName]))}</code>`,
      ...modeConfigs.map(({ id }) => renderValue(themes[id].token[tokenName])),
    ],
  }));

  const page = `---
group: Tokens 使用
title: 全局 Tokens
description: 对照查看 gzd 四种主题模式下的全部全局 Design Token。
---

${generatedNotice}

# 全局 Tokens

这里列出 <strong>${tokenNames.length} 个全局 Token</strong>，并直接对照 Gold / Blue、Dark / Light 四种运行时值。表格来自当前 <code>gzd-design-tokens/**/tokens.json</code>，不会再靠人工复制色值。

## 代码演示

文档站最外层已经由 gzd <code>ConfigProvider</code> 包裹。示例通过 <code>theme.useToken()</code> 读取合并后的当前 Token；请使用右上角的主题切换器观察效果。

<!-- prettier-ignore -->
<code src="./tokens/demo/global.tsx">跟随文档主题使用全局 Token</code>

需要 <code>--gzd-*</code> CSS 变量时，使用 <code>getDesignTokenCssVariables</code> 或 <code>applyDesignTokenCssVariables</code>。完整流程参见 [新人培训：主题与 Design Token](/training/04-theme-and-tokens)。

## ECharts 使用全局 Token

项目图表技术栈统一使用 ECharts，不单独维护图表 Token。创建 ECharts option 时，直接读取当前主题的全局 Token：

${fencedCode(
    "ts | pure",
    `import { getDesignTokens, type GZDThemeMode } from 'gzd';

export const createChartOption = (themeMode: GZDThemeMode) => {
  const { globalToken } = getDesignTokens({ themeMode });

  return {
    backgroundColor: globalToken.colorBgContainer,
    color: [
      globalToken.colorPrimary,
      globalToken.colorSuccess,
      globalToken.colorWarning,
      globalToken.colorError,
      globalToken.colorInfo,
    ],
    textStyle: { color: globalToken.colorText },
    xAxis: {
      axisLabel: { color: globalToken.colorTextSecondary },
      axisLine: { lineStyle: { color: globalToken.colorSplit } },
    },
    yAxis: {
      axisLabel: { color: globalToken.colorTextSecondary },
      splitLine: { lineStyle: { color: globalToken.colorSplit } },
    },
  };
};`,
  )}

主题模式变化后，使用新的 <code>themeMode</code> 重新创建并设置 option，即可让图表与组件库主题保持一致。

## 阅读说明

- <strong>—</strong> 表示该主题没有这个 Token。例如本次新增的国泰蓝色阶只存在于 Gold。
- CSS 变量列使用默认前缀 <code>gzd</code>；业务传入其他 <code>prefix</code> 时，前缀会随之变化。
- 此页只列 <code>globalToken</code>。组件和响应式 Token 分别见 [组件 Tokens](/tokens/components) 与 [响应式和自定义 Tokens](/tokens/custom)。

## 完整清单（${tokenNames.length} 个）

${renderTable({
    headers: [
      "Token 名称",
      "说明",
      "值类型",
      "默认 CSS 变量",
      ...modeConfigs.map(({ label }) => label),
    ],
    rows,
    minWidth: 1650,
  })}
`;

  return { page, tokenNames };
};

const buildComponentDocumentation = ({ themes, componentDescriptions }) => {
  const componentNames = orderedUnion(
    modeConfigs.map(({ id }) => Object.keys(themes[id].components)),
  );
  let tokenCount = 0;
  const sections = [];
  const allTokenPaths = [];

  for (const componentName of componentNames) {
    const pathsByMode = modeConfigs.map(({ id }) =>
      flattenTokenValues(themes[id].components[componentName] ?? {}).map(
        ({ pathParts }) => pathParts.join("."),
      ),
    );
    const relativePaths = orderedUnion(pathsByMode);
    tokenCount += relativePaths.length;

    const rows = relativePaths.map((relativePath) => {
      const relativeParts = relativePath.split(".");
      const fullPath = `${componentName}.${relativePath}`;
      allTokenPaths.push(fullPath);

      return {
        id: fullPath,
        cells: [
          `<code>${escapeHtml(fullPath)}</code>`,
          escapeHtml(
            componentDescriptions[fullPath] ??
              `${componentName} 组件的 ${relativePath} Token`,
          ),
          `<code>${escapeHtml(
            describeValueType(
              modeConfigs.map(({ id }) =>
                getNestedValue(
                  themes[id].components[componentName],
                  relativeParts,
                ),
              ),
            ),
          )}</code>`,
          `<code>${escapeHtml(
            cssVariableName("gzd", [
              "components",
              componentName,
              ...relativeParts,
            ]),
          )}</code>`,
          ...modeConfigs.map(({ id }) =>
            renderValue(
              getNestedValue(themes[id].components[componentName], relativeParts),
            ),
          ),
        ],
      };
    });

    sections.push(`<a id="${toKebabCase(componentName)}"></a>
## ${componentName}（${relativePaths.length} 个）

${renderTable({
      headers: [
        "Token 路径",
        "说明",
        "值类型",
        "默认 CSS 变量",
        ...modeConfigs.map(({ label }) => label),
      ],
      rows,
      minWidth: 1450,
    })}`);
  }

  const componentLinks = componentNames
    .map(
      (componentName) =>
        `[${componentName}](#${toKebabCase(componentName)})`,
    )
    .join(" · ");

  const page = `---
group: Tokens 使用
title: 组件 Tokens
description: 查看 gzd 四种主题模式下的全部组件级 Design Token。
---

${generatedNotice}

# 组件 Tokens

这里逐项列出 <strong>${componentNames.length} 个组件分组、${tokenCount} 个组件 Token</strong>。运行时通过 <code>getDesignTokens().components</code> 读取；只有主动消费这些值的组件才会产生视觉变化。

“说明”优先使用 UI / Figma 源文件中的 <code>$description</code>，因此少量说明保留设计源里的英文原文；源文件没有说明时，文档会明确回退为组件名和 Token 名，不会凭空猜测用途。

## 代码演示

文档站最外层的 <code>ConfigProvider</code> 会自动把当前组件 Token 传给示例；请使用右上角的主题切换器观察 Button、Input 和 Switch 的变化。

<!-- prettier-ignore -->
<code src="./demo/components.tsx">组件自动使用当前 Token</code>

开启 <code>includeComponents</code> 后，可以把这些值转换为 <code>--gzd-components-*</code> CSS 变量：

${fencedCode(
    "ts | pure",
    `import { getDesignTokenCssVariables } from 'gzd';

const variables = getDesignTokenCssVariables({
  themeMode: 'gold-light',
  includeComponents: true,
});`,
  )}

<blockquote><strong>注意：</strong><code>Sidebar</code> 和 <code>PanelCollapse</code> 已进入 Token 数据，但仓库目前没有对应组件，Ant Design 也不会自动识别这两个扩展分组。后续组件需要主动读取并使用。</blockquote>

## 组件索引

${componentLinks}

${sections.join("\n\n")}
`;

  return { page, componentNames, tokenPaths: allTokenPaths };
};

const buildCustomDocumentation = ({ themes }) => {
  const pathsByMode = modeConfigs.map(({ id }) =>
    flattenTokenValues(themes[id].custom).map(({ pathParts }) =>
      pathParts.join("."),
    ),
  );
  const tokenPaths = orderedUnion(pathsByMode);
  const rows = tokenPaths.map((tokenPath) => {
    const pathParts = tokenPath.split(".");

    return {
      id: tokenPath,
      cells: [
        `<code>${escapeHtml(tokenPath)}</code>`,
        escapeHtml(
          pathParts[0] === "responsive"
            ? `${pathParts[1]} 断点的 ${pathParts.slice(2).join(".")} 值`
            : `${tokenPath} 自定义 Token`,
        ),
        `<code>${escapeHtml(
          describeValueType(
            modeConfigs.map(({ id }) =>
              getNestedValue(themes[id].custom, pathParts),
            ),
          ),
        )}</code>`,
        `<code>${escapeHtml(
          cssVariableName("gzd", ["custom", ...pathParts]),
        )}</code>`,
        ...modeConfigs.map(({ id }) =>
          renderValue(getNestedValue(themes[id].custom, pathParts)),
        ),
      ],
    };
  });

  const page = `---
group: Tokens 使用
title: 响应式和自定义 Tokens
description: 查看 gzd 四种主题模式下的全部 custom 与 responsive Design Token。
---

${generatedNotice}

# 响应式和自定义 Tokens

这里列出 <strong>${tokenPaths.length} 个 custom Token</strong>。当前全部属于 <code>responsive</code> 分组，可通过 <code>getDesignTokens().custom</code> 读取。

## 代码演示

文档根节点会把当前主题的 custom Token 写入 <code>--gzd-custom-*</code> CSS 变量。当前四套主题的响应式数值一致，因此切换主题时断点数值不会变化。

<!-- prettier-ignore -->
<code src="./demo/custom.tsx">使用响应式 CSS 变量</code>

开启 <code>includeCustom</code>（默认开启）时，这些值会生成 <code>--gzd-custom-*</code> CSS 变量。表中的 <code>0 / 1</code> 是当前生成物的真实值，不在文档层擅自转换成布尔值。

## 完整清单（${tokenPaths.length} 个）

${renderTable({
    headers: [
      "Token 路径",
      "说明",
      "值类型",
      "默认 CSS 变量",
      ...modeConfigs.map(({ label }) => label),
    ],
    rows,
    minWidth: 1450,
  })}
`;

  return { page, tokenPaths };
};

const buildAgDocumentation = ({ agGrid, metadata }) => {
  const agGridNamesByMode = agGridConfigs.map(({ id }) =>
    Object.keys(agGrid[id]),
  );
  const agGridNames = orderedUnion(agGridNamesByMode);
  assertUnique(agGridNames, "AG Grid Token");
  for (const [index, names] of agGridNamesByMode.entries()) {
    assertSameStringSet(
      names,
      agGridNames,
      `${agGridConfigs[index].label} AG Grid Token`,
    );
  }
  if (agGridNames.length !== expectedAgGridTokenCount) {
    throw new Error(
      `AG Grid Token 数量应为 ${expectedAgGridTokenCount}，实际为 ${agGridNames.length}`,
    );
  }

  assertSameStringSet(
    Object.keys(metadata.agGrid),
    agGridNames,
    "AG Grid Token 文档元数据",
  );
  const missingDescriptions = agGridNames.filter(
    (tokenName) => !metadata.agGrid[tokenName],
  );
  if (missingDescriptions.length > 0) {
    throw new Error(
      `AG Grid Token 缺少文档说明：${missingDescriptions.join(", ")}`,
    );
  }
  for (const tokenName of agGridNames) {
    const tokenMetadata = metadata.agGrid[tokenName];
    if (
      !tokenMetadata.category?.trim() ||
      !tokenMetadata.description?.trim() ||
      !tokenMetadata.cssVariable?.trim()
    ) {
      throw new Error(`AG Grid Token 文档元数据不完整：${tokenName}`);
    }
    const expectedCssVariable = `--ag-${toKebabCase(tokenName)}`;
    if (tokenMetadata.cssVariable !== expectedCssVariable) {
      throw new Error(
        `AG Grid Token CSS 变量错误：${tokenName} 应为 ${expectedCssVariable}`,
      );
    }
  }

  const agGridGroups = new Map();
  for (const tokenName of agGridNames) {
    const category = metadata.agGrid[tokenName].category;
    const rows = agGridGroups.get(category) ?? [];
    rows.push({
      id: tokenName,
      cells: [
        `<code>${escapeHtml(tokenName)}</code>`,
        `<code>${escapeHtml(
          describeValueType(
            agGridConfigs.map(({ id }) => agGrid[id][tokenName]),
          ),
        )}</code>`,
        escapeHtml(metadata.agGrid[tokenName].description),
        `<code>${escapeHtml(metadata.agGrid[tokenName].cssVariable)}</code>`,
        ...agGridConfigs.map(({ id }) => renderValue(agGrid[id][tokenName])),
      ],
    });
    agGridGroups.set(category, rows);
  }
  const agGridSections = [...agGridGroups.entries()].map(
    ([category, rows]) => `### ${category}（${rows.length} 个）

${renderTable({
      headers: [
        "Token 名称",
        "值类型",
        "说明",
        "AG CSS 变量",
        ...agGridConfigs.map(({ label }) => label),
      ],
      rows,
      minWidth: 1650,
    })}`,
  );

  const page = `---
group: Tokens 使用
title: AG Grid Table Tokens
description: 查看 Gold Table 的全部 AG Grid 主题参数。
---

${generatedNotice}

# AG Grid Table Tokens

此页逐项列出运行时真正公开的 <strong>${agGridNames.length} 个 AG Grid Token</strong>。Gold Dark / Light 值直接来自当前生成文件。其中包含原有的 211 个参数，以及 gzd 从设计源保留的 14 个兼容参数；兼容参数同样可以从导出对象读取，并由 <code>themeQuartz.withParams()</code> 生成对应的 <code>--ag-*</code> CSS 变量。

## 安装依赖

${fencedCode(
    "shell",
    `npm install ag-grid-community@36.0.1 ag-grid-enterprise@36.0.1 ag-grid-react@36.0.1`,
  )}

## Table 默认行为

| themeMode | AG Grid 主题 |
| --- | --- |
| <code>gold-dark</code> | 自动使用 Gold Dark AG Grid Token |
| <code>gold-light</code> | 自动使用 Gold Light AG Grid Token |
| <code>blue-dark</code> | 使用运行时 <code>--gzd-*</code> 表格主题 |
| <code>blue-light</code> | 使用运行时 <code>--gzd-*</code> 表格主题 |

图表统一使用 ECharts，并直接消费 [全局 Tokens](/tokens)；Table 不注册图表模块，也不注入图表主题。

文档站根节点已经由 gzd <code>ConfigProvider</code> 包裹。下面的示例不再创建第二套主题状态；请使用右上角切换器。选择 Gold Dark / Light 时，<code>Table</code> 会自动应用对应的 <code>goldDarkAgGridTokens</code> / <code>goldLightAgGridTokens</code>；Blue 模式继续使用 Table 的运行时变量主题。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/ag-grid-table.tsx">Table 跟随文档主题</code>

表格主题遵循：顶层 <code>theme</code> &gt; <code>gridOptions.theme</code> &gt; gzd 当前模式默认值。

## 底层 AG Grid 手动使用

不使用 gzd <code>Table</code> 时，也可以从子入口读取参数，交给 Quartz 主题：

${fencedCode(
    "tsx | pure",
    `import {
  AgGridReact,
  AllEnterpriseModule,
  ModuleRegistry,
  goldDarkAgGridTokens,
  goldLightAgGridTokens,
  themeQuartz,
} from 'gzd/gzd-table';

ModuleRegistry.registerModules([AllEnterpriseModule]);

const goldDarkTheme = themeQuartz.withParams(goldDarkAgGridTokens);
const goldLightTheme = themeQuartz.withParams(goldLightAgGridTokens);

export default () => (
  <div style={{ height: 320 }}>
    <AgGridReact
      theme={goldLightTheme}
      columnDefs={[{ field: 'name', headerName: '姓名' }]}
      rowData={[{ name: '张三' }]}
    />
  </div>
);`,
  )}

只覆盖少量业务值时，先展开 gzd 参数，再写覆盖项：

${fencedCode(
    "ts | pure",
    `import {
  goldLightAgGridTokens,
  themeQuartz,
} from 'gzd/gzd-table';

const customTheme = themeQuartz.withParams({
  ...goldLightAgGridTokens,
  accentColor: '#7ab8ff',
  rowHoverColor: 'rgba(122, 184, 255, 0.12)',
});`,
  )}

## 导出或注入 AG Grid CSS 变量

需要在普通 CSS、微前端根节点或 AG Grid 主题作用域中消费同一套 Token 时，可以导出或直接注入原生 <code>--ag-*</code> CSS 变量：

${fencedCode(
    "ts | pure",
    `import {
  applyAgGridDesignTokenCssVariables,
  getAgGridDesignTokenCssVariables,
} from 'gzd/gzd-table';

const variables = getAgGridDesignTokenCssVariables({
  themeMode: 'gold-dark',
});

const cleanup = applyAgGridDesignTokenCssVariables({
  themeMode: 'gold-dark',
  target: document.querySelector<HTMLElement>('.business-grid')!,
});

// 微前端卸载或主题切换前恢复原值
cleanup();`,
  )}

两个方法默认使用 <code>ag</code> 前缀。<code>getAgGridDesignTokenCssVariables</code> 返回 CSS 变量对象；<code>applyAgGridDesignTokenCssVariables</code> 默认写入 <code>document.documentElement</code> 并返回清理函数。需要覆盖 <code>themeQuartz.withParams()</code> 生成的同名变量时，应把 <code>target</code> 指向 Grid 主题元素本身。可通过 <code>prefix</code> 使用自定义变量前缀；自定义前缀时，Token 之间的 CSS 变量引用也会同步更新。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| <code>themeMode</code> | 选择 Gold AG Grid Token 模式 | <code>'gold-dark' \\| 'gold-light'</code> | - |
| <code>prefix</code> | CSS 变量前缀 | <code>string</code> | <code>'ag'</code> |
| <code>target</code> | <code>applyAgGridDesignTokenCssVariables</code> 的注入节点 | <code>HTMLElement</code> | <code>document.documentElement</code> |

## 公开导出

| 导出 | 内容 |
| --- | --- |
| <code>goldDarkAgGridTokens</code> | Gold Dark 的 AG Grid 参数 |
| <code>goldLightAgGridTokens</code> | Gold Light 的 AG Grid 参数 |
| <code>getAgGridDesignTokenCssVariables</code> | 返回指定 Gold 模式的 AG Grid CSS 变量对象 |
| <code>applyAgGridDesignTokenCssVariables</code> | 将 AG Grid CSS 变量写入目标元素并返回清理函数 |

这些内容统一从 <code>gzd/gzd-table</code> 导入。

## AG Grid 完整清单（${agGridNames.length} 个）

复合 Border 和引用会以紧凑 JSON 显示，例如 <code>{"ref":"foregroundColor"}</code>。<strong>—</strong> 表示该模式没有输出该参数。

${agGridSections.join("\n\n")}

## 源文件与生成命令

- AG Grid 源：<code>gzd-design-tokens-origin/gold-theme/ag-grid/Dark.tokens.json</code> 和 <code>Light.tokens.json</code>。
- 完整生成：<code>npm run tokens:transform</code>。
- 只生成 AG Grid Token：<code>npm run tokens:transform:ag-grid</code>。
- 只生成文档：<code>npm run docs:tokens</code>。

转换器会阻止缺失引用、循环引用和无效输出引用。业务图表的颜色、文字和背景应从 [全局 Tokens](/tokens) 读取并传给 ECharts。
`;

  return { page, agGridNames };
};

export const buildTokenDocumentation = () => {
  for (const demoFile of tokenDemoFiles) {
    if (!fs.existsSync(path.join(rootDir, demoFile))) {
      throw new Error(`Token 文档示例不存在：${demoFile}`);
    }
  }

  const data = loadDocumentationData();
  const global = buildGlobalDocumentation(data);
  const components = buildComponentDocumentation(data);
  const custom = buildCustomDocumentation(data);
  const ag = buildAgDocumentation(data);

  return {
    files: {
      [outputFiles.global]: global.page,
      [outputFiles.components]: components.page,
      [outputFiles.custom]: custom.page,
      [outputFiles.ag]: ag.page,
    },
    inventory: {
      global: global.tokenNames,
      components: components.tokenPaths,
      componentGroups: components.componentNames,
      custom: custom.tokenPaths,
      agGrid: ag.agGridNames,
    },
  };
};

export const generateTokenDocumentation = ({ check = false } = {}) => {
  const documentation = buildTokenDocumentation();
  const staleFiles = [];

  for (const [relativeFile, content] of Object.entries(documentation.files)) {
    const absoluteFile = path.join(rootDir, relativeFile);
    const normalizedContent = content.endsWith("\n") ? content : `${content}\n`;
    const currentContent = fs.existsSync(absoluteFile)
      ? fs.readFileSync(absoluteFile, "utf8")
      : undefined;

    if (currentContent === normalizedContent) continue;
    staleFiles.push(relativeFile);

    if (!check) {
      fs.mkdirSync(path.dirname(absoluteFile), { recursive: true });
      fs.writeFileSync(absoluteFile, normalizedContent, "utf8");
    }
  }

  if (check && staleFiles.length > 0) {
    throw new Error(
      `Token 文档不是最新生成结果，请运行 npm run docs:tokens：${staleFiles.join(", ")}`,
    );
  }

  console.info(
    `[Token Docs] ${check ? "checked" : "generated"}: ${
      documentation.inventory.global.length
    } global, ${documentation.inventory.components.length} component, ${
      documentation.inventory.custom.length
    } custom, ${documentation.inventory.agGrid.length} AG Grid.`,
  );

  return { ...documentation, staleFiles };
};

if (
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
) {
  generateTokenDocumentation({ check: process.argv.includes("--check") });
}
