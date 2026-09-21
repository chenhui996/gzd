---
title: 项目结构
order: 2
group: 新人培训
---

# 项目结构

第一次打开仓库时，不需要逐个文件阅读。

先记住三条主线：

```text
组件源码：src/ → npm run build → gzd-lib/
文档源码：docs/、src/docs/、src/components/**/index.md → npm run docs:build → gzd-docs/
Token 导入：UI 交付包 → npm run tokens:import -- "交付包目录" → 源 JSON、运行时 Token 与文档
```

箭头左边通常是要修改的源文件，右边通常是自动生成的结果。

## 1. 根目录一览

```text
gzd/
├── .agents/                       本仓库的辅助开发规则
├── .dumi/                         Dumi 主题定制和临时文件
├── docs/                          介绍、培训、Token 等站点文档
├── gzd-design-tokens-origin/   Design Token 源文件
├── gzd-design-tokens/          转换后的 Token
├── public/                        文档站静态资源
├── scripts/                       同步、Token 转换、版本准备脚本
├── src/                           组件库源码
├── tech-docs/                     技术专题资料
├── tests/                         Playwright 组件测试用例目录
├── package.json                   依赖和 npm 命令
├── package-lock.json              锁定依赖版本
├── .dumirc.ts                     Dumi 文档站配置
├── vite.config.ts                 组件库构建配置
├── vitest.config.ts               Vitest 逻辑测试配置
├── playwright-ct.config.ts        Playwright UI 测试配置
├── eslint.config.js               代码规范配置
├── tsconfig*.json                 TypeScript 配置
├── CHANGELOG.md                   版本更新记录源文件
└── README.md                      最简安装和使用说明
```

运行命令后，还可能看到：

```text
node_modules/   安装后的依赖
gzd-lib/      组件库构建产物
gzd-docs/     文档站构建产物
```

这三个目录都不是日常手写源码。

## 2. 根目录中的重要文件夹

| 路径 | 放什么 | 新人是否经常修改 |
| --- | --- | --- |
| `src/` | 组件、主题、样式和包入口 | 是 |
| `tests/` | Playwright 组件测试用例代码 | 是 |
| `docs/` | Dumi 普通页面和新人培训文档 | 是 |
| `public/` | 文档站直接使用的图片等静态文件，目前包含 Logo | 偶尔 |
| `.agents/skills/` | 本仓库提供给开发辅助工具的项目规则 | 一般不改 |
| `.dumi/theme/` | 文档站主题、页头和颜色切换等定制 | 只有修改文档站外观时 |
| `.dumi/tmp/`、`.dumi/tmp-production/` | Dumi 运行时生成的临时内容 | 否 |
| `scripts/` | 变更日志同步、Token 转换、版本准备脚本 | 先理解再改 |
| `gzd-design-tokens-origin/` | 从设计侧得到的 Token 源数据 | 修改 Token 时 |
| `gzd-design-tokens/` | 脚本转换后的四套主题 Token | 否，运行脚本生成 |
| `tech-docs/` | 较深入的技术背景和专题记录 | 排查复杂问题时阅读 |
| `gzd-lib/` | `npm run build` 生成的发布产物 | 否 |
| `gzd-docs/` | `npm run docs:build` 生成的文档站 | 否 |
| `node_modules/` | npm 安装的第三方依赖 | 否 |

还有一个容易误改的文件：`docs/CHANGELOG.md`。它由根目录 `CHANGELOG.md` 自动生成。要更新版本记录时，修改根目录的 `CHANGELOG.md`。

## 3. `src/` 是组件库核心

当前 `src/` 主要分为五部分：

```text
src/
├── components/   组件实现、组件样式、组件文档和测试
├── docs/         可以被 Dumi 读取的共享技术文档
├── gzd-table/     AG Grid 公开子路径的源码入口和导出测试
├── styles/       全局样式和主题能力
└── index.ts      npm 包的根导出入口
```

### `src/index.ts` 根入口

这是组件库的包根入口。

业务项目执行下面的导入时：

```tsx | pure
import { Button, ConfigProvider } from 'gzd';
```

能从包根导入哪些组件和类型，由 `src/index.ts` 决定。

新增了组件，却忘记在这里导出，组件在仓库里虽然存在，业务项目仍然用不到。

这个文件还会导入 `src/styles/index.less`，让构建结果包含组件库样式。

// chenhui996？？？

### `src/gzd-table/index.ts` 子路径入口  

Table 组件和 `TableProps` 从包根入口导入：

```tsx | pure
import { Table, type TableProps } from 'gzd';
```

AG Grid 的类型、事件、模块、主题和底层 React API 从专用子路径导入：

```tsx | pure
import type { ColDef } from 'gzd/gzd-table';
```

`src/gzd-table/index.ts` 会重新导出 `ag-grid-community`、`ag-grid-enterprise` 和 `ag-grid-react` 的公开能力，并由 `package.json` 的 `exports` 映射到发布产物。它是显式支持的公开子路径，不属于任意深层导入。

### `src/components/`

每个组件通常单独占一个文件夹。例如：

```text
src/components/button/
├── index.tsx     Button 的封装和导出
├── style.less    Button 的补充样式
└── index.md      Button 的说明和 Dumi 示例
```

不是每个组件都恰好有这三个文件。复杂组件可能拆成多个 `.tsx` 文件；只有需要补充样式时才有 `style.less`；测试文件一般以 `.test.ts` 或 `.test.tsx` 结尾。

以 Button 为例，查找顺序是：

1. 在 `src/index.ts` 看它怎样对外导出。
2. 在 `src/components/button/index.tsx` 看组件实现。
3. 在 `src/components/button/style.less` 看补充样式。
4. 在 `src/components/button/index.md` 看用法和页面示例。

大部分组件是对 Ant Design 6 的轻量封装。阅读时先找“gzd 增加了什么”，不需要从头研究 Ant Design 的全部源码。

### `src/styles/`

这里负责组件库的全局样式和主题能力。

重要文件包括：

| 路径 | 作用 |
| --- | --- |
| `src/styles/index.less` | 样式总入口，导入主题样式和各组件的 Less |
| `src/styles/themes/types.ts` | 主题相关 TypeScript 类型 |
| `src/styles/themes/themeTokens.ts` | 读取并整理四套主题 Token |
| `src/styles/themes/themeCssVariables.ts` | 生成和应用 CSS 变量 |
| `src/styles/themes/index.ts` | 统一导出主题工具 |
| `src/styles/themes/v1.less` | 主题相关基础 Less |

如果组件样式没有进入 `src/styles/index.less`，它可能不会出现在最终 CSS 中。

### `src/docs/`

这里放与源码关系较紧的共享说明。目前包括通用属性说明和 Token 使用方案。

`.dumirc.ts` 已把 `src/docs/` 配置为文档目录，所以其中的 Markdown 也能进入 Dumi 文档站。

// chenhui996？？？

## 4. 文档放在哪里

仓库里有三种常见文档：

| 文档 | 位置 | 用途 |
| --- | --- | --- |
| 站点普通页面 | `docs/` | 项目介绍、培训、Token、版本记录 |
| 单个组件文档 | `src/components/<组件>/index.md` | 组件说明、示例和 API |
| 技术专题 | `tech-docs/` | 深入原理、历史方案和复杂问题记录 |

新增或修改某个组件的公开能力时，通常要同步修改该组件的 `index.md`。

本套培训资料统一放在 `docs/training/`。

## 5. 配置和脚本在哪里

| 文件 | 主要作用 |
| --- | --- |
| `package.json` | 查看项目名称、版本、依赖和所有 npm 命令 |
| `package-lock.json` | 锁定实际安装的依赖版本，安装依赖时由 npm 维护 |
| `.dumirc.ts` | 配置 Dumi 导航、文档目录、别名和输出目录 |
| `vite.config.ts` | 配置 React、类型声明、库构建入口和 `gzd-lib/` 输出 |
| `vitest.config.ts` | 配置 jsdom 逻辑测试环境和测试文件范围 |
| `playwright-ct.config.ts` | 配置 Playwright 组件测试环境及真实浏览器执行参数 |
| `eslint.config.js` | 配置代码规范检查 |
| `tsconfig.json`、`tsconfig.*.json` | 配置 TypeScript 检查范围和规则 |
| `scripts/syncChangelog.js` | 生成 `docs/CHANGELOG.md` |
| `scripts/importTokens.js` | 导入 UI 主题交付包，校验全部主题后统一替换、生成，失败时回滚 |
| `scripts/transformAllTokens.js` | 批量生成四套主题 Token |
| `scripts/transformAgGridTokens.js` | 从仓库已有的 Gold AG Grid 源 JSON 生成表格 Token |
| `scripts/generateTokenDocs.js` | 根据生成结果更新四页 Token 文档 |
| `scripts/token-doc-metadata.json` | 维护全局 Token 中文说明及 AG Grid 文档元数据 |
| `scripts/release-prepare.js` | 准备版本号和变更日志 |
| `scripts/package-exports.config.js` | 声明各发布子路径的产物、类型和运行时导出契约 |
| `scripts/verify-package-exports.js` | 按配置验证各子路径的 ESM、CommonJS 和类型声明入口 |
| `scripts/fixtures/*.ts` | 模拟业务项目消费发布子路径类型的最小代码 |

版本脚本会修改重要文件。没有发布任务时，不要为了“试一下”直接运行。

## 6. 哪些内容不要直接修改

下面这些内容由安装、开发或构建过程生成：

- `node_modules/`
- `gzd-lib/`
- `gzd-docs/`
- `.dumi/tmp/`
- `.dumi/tmp-production/`
- `gzd-design-tokens/`
- `docs/CHANGELOG.md`

如果你在这些位置修好了问题，下次重新安装或构建后，修改很可能会消失。

应该回到对应源文件修改：

// chenhui996？？？

| 你想改什么 | 应该去哪里 |
| --- | --- |
| 组件行为 | `src/components/<组件>/` |
| 组件文档和示例 | `src/components/<组件>/index.md` |
| 包根公共导出 | `src/index.ts` |
| AG Grid 子路径导出 | `src/gzd-table/index.ts`、`package.json` 和 `vite.config.ts` |
| 主题逻辑 | `src/styles/themes/` 或 `src/components/config-provider/` |
| Design Token 数据 | `gzd-design-tokens-origin/` |
| 文档站导航 | `.dumirc.ts` |
| 版本记录 | 根目录 `CHANGELOG.md` |

## 7. 推荐阅读路线

第一次阅读仓库时，按这个顺序即可：

1. 看 `package.json`，认识常用命令和主要依赖。
2. 看 `src/index.ts`，知道组件库公开了哪些能力。
3. 看 `src/gzd-table/index.ts`，理解 Table 为什么还有一个公开子路径入口。
4. 看 `src/components/button/`，理解一个简单组件的完整结构。
5. 看 `src/components/config-provider/`，理解主题怎样进入组件。
6. 看 `src/styles/themes/`，理解 Token 和 CSS 变量怎样工作。
7. 打开几个组件的 `index.md`，观察 Dumi 示例怎样写。
8. 只有遇到对应任务时，再读 `scripts/` 和 `tech-docs/`。

不要一上来阅读所有组件。先完整看懂一个简单组件，再带着具体任务阅读其他目录，效率更高。

## 本页完成标准

读完后，你应该能够：

- 找到组件实现、样式、文档和测试。
- 说出 `src/index.ts` 的作用。
- 区分源码目录和生成目录。
- 知道 Token、文档站和发布脚本放在哪里。
- 接到修改任务后，先找到正确的文件，而不是在构建产物里改代码。

下一步请阅读[组件库能力](/training/03-library-capabilities)。
