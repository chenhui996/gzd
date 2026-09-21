---
name: gzd-token-update
description: 更新、转换、核对和验证 gzd Design Tokens。用户提到 UI Token 交付、替换 gzd-design-tokens-origin、Gold/Blue 明暗主题 Token、AG Grid Token、Figma tokens JSON、重新生成 gzd-design-tokens、Token 文档或 Token 更新后的发版准备时使用。
---

# gzd Token 更新

把 UI / Figma JSON 视为唯一源，使用仓库现有生成链路更新运行时产物、文档和精确清单。默认执行快速校验；只有用户明确要求发版准备或全量验证时才运行耗时构建。

## 固定边界

- 只编辑 `gzd-design-tokens-origin/` 中的源 JSON；不要手改 `gzd-design-tokens/` 生成物。
- 保留用户已放入的源文件和所有无关工作区改动。
- 主主题源包含 `colors`、`seed`、`map`、`alias`、`static`、`components`、`responsive`；AG Grid 源只在 `gold-theme/ag-grid/`。
- 未解析引用、循环引用或非法输出必须回到源 JSON 修复，不要猜值或在生成物补值。
- Token 同步本身不授权升版本、改 Changelog、提交、发布或推送。
- 同时遵守项目的 `$gzd-development-guidelines`。

## 快速工作流

若用户明确要求只读检查，不要运行会写文件的 `npm run tokens:transform`、测试、构建或文档生成命令。只运行检查脚本和 Git diff 审核，并明确说明：该模式能确认当前生成物、元数据和清单内部一致，但不能证明源 JSON 重新转换后一定无差异，也不能替代与 UI 原始交付物的验收。

### 1. 确认输入和工作区

运行：

```shell
git status --short
node .agents/skills/gzd-token-update/scripts/inspect-token-update.mjs
```

先确认改动确实位于预期主题、模式和分组。不要要求用户重复说明 Git 已能识别的信息。

检查脚本是只读的，会汇总源文件改动、当前四套生成主题数量、相对 `HEAD` 的公开 Token 增删、文档元数据缺口和测试数量基线。使用它代替每次重新搜索生成链路。

### 2. 执行唯一生成命令

```shell
npm run tokens:transform
```

该命令依次生成四套主主题、Gold AG Grid 和四页 Token 文档。确认每套主主题的 `unresolvedAliases` 为 `0`；确认 AG Grid 没有缺失引用、循环引用、重复 basename 或非法参数引用。

### 3. 处理预期的文档门禁

若生成因文档元数据集合不一致失败：

1. 再运行检查脚本，读取明确的缺失或多余项。
2. 只为确认新增的全局 Token 补充 `scripts/token-doc-metadata.json` 中文说明；删除的 Token 同步移除元数据。
3. 组件 Token 优先使用源 JSON 的 `$description`；源文件没有描述时，生成器会使用明确的路径回退说明，不要虚构设计语义。
4. 新增 AG Grid Token 时，为 `scripts/token-doc-metadata.json` 的 `agGrid` 项补齐 `category`、`description` 和准确的 `--ag-*` CSS 变量。
5. 重新运行 `npm run tokens:transform`。

### 4. 更新精确清单基线

再次运行：

```shell
node .agents/skills/gzd-token-update/scripts/inspect-token-update.mjs
```

如果脚本报告 `src/styles/themes/tokenDocs.test.ts` 数量基线不一致，先确认新增/删除清单与 UI 交付一致，再更新断言。为重要新增项补充代表性 `arrayContaining` 断言，避免只改数字。

### 5. 执行快速验证

Token 日常更新默认只运行：

```shell
npx vitest run src/styles/themes/themeTokens.test.ts src/styles/themes/tokenDocs.test.ts src/gzd-table/transformAgGridTokens.test.ts
npx eslint src/styles/themes/tokenDocs.test.ts
npm run docs:tokens:check
git diff --check
```

只 lint 本次手工修改的 TypeScript / JavaScript 文件；JSON 和生成 Markdown 不需要 ESLint。仓库全量 lint 存在历史噪声，不要为普通 Token 更新重复运行。

### 6. 审核最终差异

检查：

```shell
git status --short
git diff --stat
git diff -- gzd-design-tokens-origin gzd-design-tokens docs/tokens.md docs/tokens/components.md scripts/token-doc-metadata.json src/styles/themes/tokenDocs.test.ts
```

确认：

- 源文件变更与 UI 交付一致。
- 只有对应主题生成物发生语义变化；没有无关 Blue 或 AG Grid 改动。
- Token 数量、组件分组、明暗值和文档清单同步。
- `gzd-lib/`、`gzd-docs/`、`.dumi/` 等临时产物未进入 Git 变更。

## 发版前模式

仅当用户明确要求“发版前操作”“更新 Changelog/版本”或全量验证时，在快速工作流之后执行：

```shell
npm run test
npm run prepack
npm run docs:build
npm pack --dry-run
```

若用户 npm 缓存存在权限问题，使用任务专用临时缓存重试 `npm pack --dry-run --cache <临时目录>`，不要修改全局缓存权限。

版本和 Changelog 使用 `npm run release:prepare`：先 `--dry-run`，核对后再正式写入，并运行 `npm run docs:sync`。根据当前版本序列和改动兼容性选择版本类型；不确定时向用户确认。不要执行 `npm publish`、Git 提交、Tag 或推送，除非用户另行明确要求。

## 结果汇报

简洁说明：

- 哪些主题和源分组更新。
- 新增、删除及关键值变化。
- 生成后的全局/组件数量和未解析引用数。
- 实际运行的验证及结果。
- 既有 lint 噪声、缓存权限等与本次改动无关的限制。
