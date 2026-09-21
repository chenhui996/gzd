---
name: gzd-development-guidelines
description: gzd React 组件库的项目开发规范。用于在本仓库中修改或新增组件、主题定制样式、ConfigProvider 行为、antd v6 封装、导出 API、Less 样式、设计 Token 使用或组件文档（`src/components/**/index.md`）时指导实现。
---

# gzd 开发规范

## 核心流程

编辑前先阅读相邻实现。优先遵循 `src/components`、`src/components/config-provider`、`src/styles/themes` 和 `src/index.ts` 中已有的组织方式，不要为局部改动引入新的结构或风格。

处理组件相关任务时：

1. 先确认对应 antd v6 API 和 Semantic DOM key，再编写代码。
2. 默认保持 gzd wrapper 轻量，除非确实需要补充 gzd 特有行为。
3. 保留用户传入的 props、`className`、`style`、`classNames` 和 `styles`。
4. 新增公开组件或公开类型时，同步更新 `src/index.ts` 导出。
5. 新增组件或增加公开 API 时，同步更新 `src/components/<component>/index.md`。
6. 使用 `npm run build` 验证。若全量 lint 因既有生成文件或 demo 噪声失败，至少对本次改动文件单独运行 eslint，并在结果中说明限制。

## 组件实现

以 antd 组件作为基础实现。优先使用 `React.ComponentPropsWithoutRef<typeof AntdComponent>` 或 antd 导出的 props 类型，再导出 `GZD<Component>Props` 类型。底层 antd 组件支持 ref 时使用 `forwardRef`，并设置清晰的 `displayName`。

新增 API 应尽量与 antd 保持兼容；只有存在明确的 gzd 场景时，才增加 wrapper 专属 API。不要用本地 state 重写 antd 已有行为。未知 props 应透传给 antd。

新增公开组件时，遵循现有目录形态：

- `src/components/<component>/index.tsx`：组件封装。
- `src/components/<component>/style.less`：仅在需要本地样式时添加。
- `src/components/<component>/index.md`：组件文档。
- `src/index.ts`：包级导出。

组件核心逻辑需要补充注释。注释使用中文说明，重点解释主题判断、Semantic DOM 合并、设计 Token 映射、兼容性处理、复杂状态转换等不容易从代码直接看出的意图。避免机械注释，例如“设置变量”“返回组件”。

## 主题定制样式

为某个主题自定义组件样式时，尽量采用 antd v6 Semantic DOM 语法，避免依赖脆弱的 DOM 层级选择器：

- 使用 `classNames` 和 `styles` 配合 Semantic DOM key，例如 `root`、`handle`、`track`、`rail`、`popup.root` 等。
- 编码前通过本地 antd 类型或 `antd semantic <Component> --format json` 确认 Semantic DOM key。
- antd 支持 `classNames={(info) => ...}` 或 `styles={(info) => ...}` 时，同时兼容对象形式和函数形式。
- 合并用户传入的 Semantic DOM 配置，不要直接覆盖。
- 只在当前 `themeMode` 命中目标主题时注入主题类名或样式，例如 `themeMode === "gold-dark"`。

如果样式可以通过 antd `ConfigProvider` 的组件级配置注入，优先集中放在 `src/components/config-provider/goldDarkAdapters.ts` 这类主题适配入口。若组件实例自身需要读取当前 gzd 主题，使用 gzd `ConfigProvider` context，不要在组件中无条件硬编码主题类名。

优先使用设计 Token 和 CSS 变量。除非当前主题已有固定值实现，或 Token 源确实没有对应值，否则避免硬编码颜色。Less 选择器应通过 gzd 类名和 antd 状态类限定作用域，避免影响其他主题和禁用态。

跨子应用修复主题样式时，必须确认样式是否兼容业务侧自定义 `prefixCls`。不要写死 `.ant-*` 根类；优先使用 gzd 自有主题类名配合 antd 状态类后缀匹配，例如 `[class*="-tree-checkbox-checked"]`。如果组件的视觉元素由伪元素绘制，要定位真实生效节点。

`ConfigProvider` 的组件级 `className/style/classNames/styles` 适配不一定足以覆盖所有运行形态。若页面 DOM 上没有预期 gzd 主题类，应检查组件 wrapper 是否需要在实例层读取 `GZDConfigContext.themeMode` 并主动合并 `className/style`。组件需要使用当前主题 token 时，优先从 antd `theme.useToken()` 读取合并后的 token，不要把单个 token 扩散进 gzd context。

本地子应用通过 `link:` 消费 gzd 时，修改 `src` 后还要确认实际消费的是 `gzd-lib` 产物。必要时运行组件库 build 更新产物，并检查子应用的 Vite 预构建缓存 `node_modules/.vite/deps` 是否仍是旧实现。若页面重启后仍未生效，优先用源码产物和 `.vite` 缓存做对比，再要求子应用用 `--force` 重启或清理 Vite cache。

## 组件文档

新增组件或为组件增加公开 API 时，必须更新 `src/components/<component>/index.md`。

标准组件文档应包含：

- frontmatter，包含 `group` 和 `title`，风格与现有中文文档一致。
- 顶层标题：`# <Component> <中文名>`。
- 一段简短描述，说明组件用途。
- 有必要时提供 `## 何时使用`。
- `## 代码演示`，使用从 `gzd` 导入的可运行 TSX 示例。
- 覆盖默认用法，以及新增 API、状态或主题特性的示例。
- `## API`，使用 Markdown 表格列出公开属性、说明、类型、默认值。
- 适当补充通用属性链接：`通用属性参考：[通用属性](/react/common-props)`。

文档质量要求：

- 示例保持可运行、简洁，但要贴近真实使用。
- 演示回调或受控属性时，使用受控状态示例。
- 当组件 API 涉及禁用、加载、错误、范围、弹出位置、变体等重要状态时，补充对应示例。
- gzd 特有行为要与继承自 antd 的行为分开说明。
- 不要新增或暴露未记录的公开 API。

## 项目约定

包名、导入路径和类型品牌保持 `gzd` / `GZD`；自有类名及原始 Token 变量使用
`gz-*` / `--gz-*`。gzd ConfigProvider 默认设置 `prefixCls="gz"`，antd 计算后
变量使用 `--gz-ant-*`，避免与无单位的原始 Token 冲突。图标 `anticon` 和
AG Grid 的 `ag-*` 命名空间保持不变。修改样式前缀不应重命名包入口或 Token 目录。

优先使用 TypeScript 明确类型，避免 `any`。新增注释使用中文，并只解释核心逻辑或非显而易见的实现意图。

新增工具或依赖前，先查找项目内是否已有相同模式。合并类名、主题判断、Token 注入等逻辑应优先复用附近文件的写法。处理明确需求时，不要夹带大范围重构。

遵循被修改文件的现有格式。本仓库历史组件中存在单双引号混用；局部改动时跟随当前文件风格，除非格式化工具统一改动。

如果构建产生 dist、文档站或库产物变更，只有在任务明确要求提交产物时才保留。最终说明中列出验证命令，并清楚区分本次改动问题与仓库既有问题。
