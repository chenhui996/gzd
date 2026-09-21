---
title: 业务接入最佳实践
order: 2
---

# 业务方使用组件库最佳实践

本文面向接入 `gzd` 的主应用和业务子应用，说明主题模式、Design Tokens、CSS 变量和自定义 tokens 的推荐使用方式。

如果业务子应用需要脱离主应用独立部署，同时继续支持主题和自定义样式，参见：[子应用独立部署主题与自定义样式说明](./sub-app-standalone-theme-and-custom-style.md)。

## 核心原则

1. 业务应用统一通过组件库入口消费主题能力，不直接引用内部主题文件。
2. 主应用负责把客户主题色和用户明暗模式映射成完整的 `themeMode`。
3. 子应用只消费主应用下发的 `themeMode`，不要自行拼装或维护主题规则。
4. 业务自定义样式优先使用组件库导出的 Design Tokens，避免散落硬编码颜色、字号、间距。
5. 微前端全局主题下，主应用作为 root CSS 变量的唯一写入者，子应用默认只消费 `var(--gzd-*)`。
6. 子应用入口应显式引入 `gzd/gzd.css`，确保组件库的全局样式、组件修正样式和主题适配样式被子应用构建产物稳定包含。
7. 如果业务需要新增自定义 Design Tokens，需要收敛到组件库统一维护，由组件库完成设计、命名、转换和导出。

## 可用主题模式

当前组件库支持以下 `themeMode`：

```ts
type GZDThemeMode = "gold-dark" | "gold-light" | "blue-dark" | "blue-light";
```

命名规则是：

```ts
type GZDThemeName = "gold" | "blue";
type GZDThemeVariant = "light" | "dark";
type GZDThemeMode = `${GZDThemeName}-${GZDThemeVariant}`;
```

## 主应用如何下发 themeMode

主应用应根据部署客户主题色和用户当前明暗模式，生成完整的 `themeMode`，再通过微前端全局状态、props 或应用配置下发给子应用。

```ts
import type {
  GZDThemeMode,
  GZDThemeName,
  GZDThemeVariant,
} from "gzd";

const customerThemeName: GZDThemeName = "gold";
const userThemeVariant: GZDThemeVariant = userSetting.darkMode
  ? "dark"
  : "light";

const themeMode: GZDThemeMode = `${customerThemeName}-${userThemeVariant}`;

microApp.setGlobalData({
  themeMode,
});
```

主应用自身也使用同一个 `themeMode`：

```tsx
import { ConfigProvider, type GZDThemeMode } from "gzd";

export function MainApp({ themeMode }: { themeMode: GZDThemeMode }) {
  return (
    <ConfigProvider themeMode={themeMode}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
```

注意：当前组件库的属性名是 `themeMode`。不要使用旧文档里的 `mode`，也不要把 `'gold-dark'` 这类字符串直接传给 antd 的 `theme` 属性。

`themeMode` 是主应用必须下发的业务主题状态，因为只有主应用知道当前客户主题色和用户明暗模式。antd CSS 变量的 `key` 和 `prefix` 不应由主应用、子应用分别手动维护，组件库 `ConfigProvider` 会根据 `themeMode` 自动生成：

```ts
cssVar: {
  key: `gzd-${themeMode}`,
  prefix: "gzd-ant",
}
```

这表示全局统一主题模式下，主应用和所有子应用只需要传同一个 `themeMode`。
不要在业务侧直接给组件库 `ConfigProvider.theme.cssVar` 传不同的 `key` 或 `prefix`，否则同屏多个应用可能出现 antd CSS 变量 style 标签互相覆盖、变量名前缀和变量定义不匹配等问题。

## 子应用如何应用主题

子应用从主应用读取 `themeMode` 后，直接传给组件库的 `ConfigProvider`。同时，子应用入口需要显式引入组件库样式：

```tsx
import "gzd/gzd.css";
import { ConfigProvider, type GZDThemeMode } from "gzd";

const themeMode = window.microApp?.getGlobalData()?.themeMode as GZDThemeMode;

createRoot(document.getElementById("root")!).render(
  <ConfigProvider themeMode={themeMode}>
    <App />
  </ConfigProvider>,
);
```

这条 CSS 引入是必要的：`ConfigProvider` 和 `themeMode` 负责把主题 token、组件配置和 React 上下文传下去，但它们不会替代已经构建好的样式表。组件库中的基础组件样式、全局修正样式、主题适配类名、以及类似 `gold-dark` 下按钮渐变这类依赖选择器的样式，都随 `gzd.css` 发布。子应用如果只引入 JS，不显式引入样式，容易因为微前端独立构建、按需加载、摇树、样式抽取或主子应用加载顺序差异，出现组件结构已渲染但视觉样式缺失、主题适配类名无对应 CSS、局部覆盖不生效等问题。

不要依赖主应用已经加载过组件库样式来“顺带”覆盖子应用。微前端场景下子应用可能独立运行、懒加载、灰度到不同组件库版本，或者在主应用样式加载前后挂载。每个使用 `gzd` 组件的子应用都应在自己的入口文件中引入 `gzd/gzd.css`，把样式依赖声明在自身构建边界内。

```tsx
<ConfigProvider
  themeMode={themeMode}
  theme={{
    token: {
      borderRadius: 6,
    },
    components: {
      Button: {
        controlHeight: 36,
      },
    },
  }}>
  <App />
</ConfigProvider>
```

这类覆盖应只用于短期或局部兼容。长期视觉规范变更应回到组件库维护。

如果同屏多个应用都使用组件库 `ConfigProvider`，但其中某个应用传入了不同的 `theme.token` 或 `theme.components` 覆盖，这个应用应被视为独立主题作用域。此时需要给该应用传入稳定的 `cssVarScope`，否则它可能和共享主题下的其他应用复用同一个 antd CSS 变量 `key`，导致变量定义相互覆盖。

## 微前端下 antd CSS 变量隔离策略

组件库内部会开启 antd 的 `theme.cssVar`，用于让 antd 运行时样式消费 CSS 变量。它和 `applyDesignTokenCssVariables` 注入的业务 CSS 变量不是同一套变量：

1. antd CSS 变量默认由组件库 `ConfigProvider` 管理，变量名形如 `--gzd-ant-color-primary`。
2. 业务 CSS 变量默认由 `applyDesignTokenCssVariables` 管理，变量名形如 `--gzd-color-primary`。
3. 主应用负责决定并下发 `themeMode`；子应用只消费并透传 `themeMode`。
4. 业务应用默认不要直接维护 antd `cssVar.key` 和 `cssVar.prefix`。

全局统一主题模式下，主应用和子应用都按以下方式使用即可：

```tsx
<ConfigProvider themeMode={themeMode}>
  <App />
</ConfigProvider>
```

组件库会自动使用稳定配置：

```ts
cssVar: {
  key: `gzd-${themeMode}`,
  prefix: "gzd-ant",
}
```

只有在子应用需要独立主题、隔离运行、多版本组件库共存、传入了不同的 `theme.token/components` 覆盖，或同屏多个子应用需要展示不同主题时，才传 `cssVarScope`。`cssVarScope` 应使用稳定的子应用标识，组件库会根据它成对生成 `key` 和 `prefix`：

```tsx
<ConfigProvider themeMode={themeMode} cssVarScope="risk-center">
  <App />
</ConfigProvider>
```

生成结果等价于：

```ts
cssVar: {
  key: `gzd-risk-center-${themeMode}`,
  prefix: "gzd-risk-center",
}
```

不要出现“相同 key、不同 prefix”的组合，例如一个子应用使用 `{ key: "gold-dark", prefix: "app-a" }`，另一个子应用使用 `{ key: "gold-dark", prefix: "app-b" }`。antd 会用 `key` 参与 CSS 变量 style 标签和缓存标识，后挂载应用可能替换前一个应用的变量定义，导致前一个应用仍引用 `var(--app-a-*)`，但页面上已经只剩 `--app-b-*` 的定义。

## 快速查看导出了哪些 Design Tokens

组件库从主入口导出了以下 token 相关 API：

```ts
import {
  applyDesignTokenCssVariables,
  getDesignTokenCssVariables,
  getDesignTokens,
  type GZDDesignTokenBundle,
  type GZDThemeCssVariablesOptions,
  type GZDThemeMode,
  type GZDThemeName,
  type GZDThemeOptions,
  type GZDThemeVariant,
} from "gzd";
```

最常用的是 `getDesignTokens`：

```ts
import { getDesignTokens } from "gzd";

const tokens = getDesignTokens({ themeMode: "gold-dark" });

console.log("全局 token", Object.keys(tokens.globalToken));
console.log("组件 token", Object.keys(tokens.components));
console.log("自定义 token 分组", Object.keys(tokens.custom ?? {}));
```

在浏览器控制台或本地调试页面中，可以临时使用：

```ts
console.table(Object.entries(tokens.globalToken));
console.table(Object.entries(tokens.components.Button ?? {}));
console.log(tokens.custom);
```

`getDesignTokens` 返回的 `globalToken`、`components` 和 `custom` 是不同层级的 Design Tokens。`globalToken` 是全局通用 token，描述颜色、字号、圆角、间距、背景、边框等跨组件共享的基础视觉语义，适合业务页面、自定义区块、图表和通用样式使用；`components` 是组件级 token，按组件名称组织，例如 `components.Button`、`components.Input`，用于控制某个 antd/组件库组件的专属样式细节；`custom` 用于承载当前转换脚本保留下来的非 antd 主题配置，例如响应式断点和页面间距。业务侧优先使用 `globalToken`；只有自定义组件需要和某个组件库组件保持尺寸、圆角、状态色等细节一致时，再读取对应的 `components` token。

如果只想查看 CSS 变量形式：

```ts
import { getDesignTokenCssVariables } from "gzd";

const cssVariables = getDesignTokenCssVariables({
  themeMode: "gold-dark",
  includeComponents: true,
  includeCustom: true,
});

console.table(cssVariables);
```

也可以直接查看仓库中的转换结果：

```text
gzd-design-tokens/gold-theme/dark-mode/tokens.json
gzd-design-tokens/gold-theme/light-mode/tokens.json
gzd-design-tokens/blue-theme/dark-mode/tokens.json
gzd-design-tokens/blue-theme/light-mode/tokens.json
```

这些文件由 `npm run tokens:transform` 生成，不应手动修改。仓库内唯一可编辑的 Token 源目录是 `gzd-design-tokens-origin/`；详细更新流程参见该目录下的 `README.md`。业务文档和业务代码不要依赖这些内部文件路径，它们只适合排查问题时辅助查看。

## 在 JS/TS 中使用 Design Tokens

业务组件、图表、CSS-in-JS 或动态样式中，推荐使用 `getDesignTokens`。

```tsx
import { getDesignTokens, type GZDThemeMode } from "gzd";

function DashboardCard({
  themeMode,
  children,
}: {
  themeMode: GZDThemeMode;
  children: React.ReactNode;
}) {
  const { globalToken } = getDesignTokens({ themeMode });

  return (
    <section
      style={{
        background: globalToken.colorBgContainer,
        color: globalToken.colorText,
        border: `1px solid ${globalToken.colorBorderSecondary}`,
        borderRadius: globalToken.borderRadiusLG,
        padding: globalToken.paddingLG,
      }}>
      {children}
    </section>
  );
}
```

业务应用优先使用组件库的 `ConfigProvider`。如果必须直接配置 antd 的 `ConfigProvider`，可以用 `getDesignTokens` 组装 antd `ThemeConfig`：

```tsx
import { ConfigProvider as AntdConfigProvider } from "antd";
import { getDesignTokens } from "gzd";

const { globalToken, components } = getDesignTokens({ themeMode });

<AntdConfigProvider
  theme={{
    token: globalToken,
    components,
  }}>
  <App />
</AntdConfigProvider>;
```

只有在必须直接配置 antd 根节点时才使用上面的写法。

在已经被 `ConfigProvider` 包裹的 React 组件内部，如果只需要读取当前上下文里最终生效的 antd token，也可以使用 antd 的 `theme.useToken()`：

```tsx
import { theme } from "antd";

function Toolbar() {
  const { token } = theme.useToken();

  return (
    <div style={{ background: token.colorBgContainer, color: token.colorText }}>
      Toolbar
    </div>
  );
}
```

`theme.useToken()` 适合读取当前 React 树里已合并后的 antd token；`getDesignTokens({ themeMode })` 适合按指定主题模式读取组件库预设 token bundle，并可访问 `globalToken`、`components` 和 `custom`。

## 在 CSS 中使用 Design Tokens

普通 CSS 或 CSS Modules 不能直接读取 JS 对象。推荐由主应用监听主题变化，并调用 `applyDesignTokenCssVariables({ themeMode })` 把当前全局主题 token 注入为 CSS 变量。

在微前端全局主题模式下，`document.documentElement` 上的 `--gzd-*` 变量属于整个页面的共享主题状态。主应用应作为 root CSS 变量的唯一写入者，子应用默认只消费这些变量，不重复向 `document.documentElement` 注入同名变量。

主应用示例：

```tsx
import { useEffect } from "react";
import {
  ConfigProvider,
  applyDesignTokenCssVariables,
  type GZDThemeMode,
} from "gzd";

export function MainAppRoot({ themeMode }: { themeMode: GZDThemeMode }) {
  useEffect(() => {
    const cleanup = applyDesignTokenCssVariables({
      themeMode,
      includeCustom: true,
      includeComponents: false,
    });

    return cleanup;
  }, [themeMode]);

  return (
    <ConfigProvider themeMode={themeMode}>
      <App />
    </ConfigProvider>
  );
}
```

子应用从主应用读取 `themeMode` 后，继续传给 `ConfigProvider`；业务 CSS 直接使用主应用已经注入的 `var(--gzd-*)`：

```tsx
import { ConfigProvider, type GZDThemeMode } from "gzd";

const themeMode = window.microApp?.getGlobalData()?.themeMode as GZDThemeMode;

createRoot(document.getElementById("root")!).render(
  <ConfigProvider themeMode={themeMode}>
    <App />
  </ConfigProvider>,
);
```

CSS 示例：

```css
.business-card {
  background: var(--gzd-color-bg-container);
  color: var(--gzd-color-text);
  border: 1px solid var(--gzd-color-border-secondary);
  border-radius: calc(var(--gzd-border-radius-lg) * 1px);
}

.business-card__title {
  color: var(--gzd-color-primary);
}
```

默认规则：

1. `prefix` 默认为 `gzd`，变量名形如 `--gzd-color-primary`。
2. 默认注入到 `document.documentElement`，该默认行为只适用于“全局主题模式”。
3. 默认包含全局 token 和 custom token。
4. 默认不包含组件级 token，避免变量数量过多。
5. `applyDesignTokenCssVariables` 返回清理函数，写入方在主题切换或应用卸载时应调用。

微前端下不建议主应用和多个子应用同时写 `document.documentElement`。同一个 `--gzd-*` 变量在 root 上只有一份，多个应用重复写入会出现最后写入者覆盖、卸载清理恢复旧值、不同组件库版本变量语义不一致等问题。

子应用只有在独立主题或隔离运行时才需要自己注入 CSS 变量。这时必须显式传入 `target`，必要时再传独立 `prefix`，不要依赖默认的 `document.documentElement`：

```ts
const cleanup = applyDesignTokenCssVariables({
  themeMode,
  target: document.querySelector("#sub-app-root") as HTMLElement,
  prefix: "gzd-sub-app",
});
```

对应 CSS：

```css
#sub-app-root .business-card {
  background: var(--gzd-sub-app-color-bg-container);
}
```

## 在 Less 中使用 Design Tokens

Less 编译发生在构建期，无法感知运行时的 `themeMode`。因此不要把 Design Tokens 当作 Less 变量导入，推荐继续使用运行时 CSS 变量。

```less
.business-panel {
  background: var(--gzd-color-bg-layout);
  color: var(--gzd-color-text);
  padding: calc(var(--gzd-padding-lg) * 1px);
}

.business-panel__action {
  color: var(--gzd-color-primary);

  &:hover {
    color: var(--gzd-color-primary-hover);
  }
}
```

如果 Less 中需要做颜色计算、透明度计算等编译期逻辑，不建议在业务侧自行硬编码 token 值。应确认是否能改为运行时 CSS 写法；如果不能，沉淀到组件库中统一处理。

## 使用组件级 Tokens

组件级 token 位于 `components`，例如：

```ts
const { components } = getDesignTokens({ themeMode: "gold-dark" });

console.log(components.Button);
console.log(components.Input);
console.log(components.Table);
```

CSS 变量默认不注入组件级 token。如果全局主题确实需要在 CSS/Less 中使用组件级 token，应由主应用写入时显式开启 `includeComponents`；隔离运行的子应用也可以在自己的 `target` 上开启：

```ts
applyDesignTokenCssVariables({
  themeMode,
  includeComponents: true,
});
```

变量名会带上 `components` 路径：

```css
.custom-primary-button {
  height: calc(var(--gzd-components-button-control-height) * 1px);
  border-radius: calc(var(--gzd-components-button-border-radius) * 1px);
}
```

组件级 token 数量较多，业务侧只应在少量自定义组件需要和组件库组件对齐时使用。

## 使用自定义 Tokens

自定义 tokens 位于 `getDesignTokens({ themeMode }).custom`。组件库不再提供单独的自定义 token 获取 API。

```ts
import { getDesignTokens } from "gzd";

const { custom } = getDesignTokens({ themeMode: "gold-dark" });
const responsive = custom?.responsive as
  | Record<string, { gutter: number; pageOffset: number }>
  | undefined;

const desktopOffset = responsive?.Desktop?.pageOffset;
const desktopSmOffset = responsive?.["Desktop SM"]?.pageOffset;
```

默认情况下，`applyDesignTokenCssVariables` 会注入自定义 tokens。微前端全局主题下，这些变量也应由主应用统一写入：

```css
.page {
  padding-inline: calc(var(--gzd-custom-responsive-desktop-page-offset) * 1px);
}

@media (max-width: 767px) {
  .page {
    padding-inline: calc(var(--gzd-custom-responsive-mobile-page-offset) * 1px);
  }
}
```

自定义 token 的定位是“组件库维护的业务语义 token”，不是各业务应用的私有变量池。

## 新增自定义 Design Tokens 的流程

如果业务方发现需要新增自定义 Design Tokens，请按以下流程处理：

1. 先确认它是否是跨页面、跨应用、跨组件会复用的视觉语义，例如页面边距、业务布局断点、特殊状态色、组件库扩展样式。
2. 和 UI/组件库维护方确认命名、含义、可用主题、明暗模式差异和默认值。
3. 由组件库维护 token 源文件、转换脚本和导出类型，不在业务应用中私自新增同名变量。
4. 组件库发布新版本后，业务方通过 `getDesignTokens({ themeMode }).custom` 或 CSS 变量消费。
5. 如需临时过渡，可以在业务应用中短期兜底，但必须有迁移到组件库 token 的后续计划。

不要在业务侧分散维护以下内容：

```ts
const businessTokens = {
  pageOffset: 24,
  brandGradientStart: "#c98a49",
};
```

也不要在业务样式中长期散落：

```css
.page {
  padding: 24px;
  color: #c98a49;
}
```

这些值一旦具备设计语义，应收敛到组件库的 Design Tokens。

## 常见问题

### ConfigProvider 应该传 themeMode 还是 theme？

业务应用传 `themeMode`：

```tsx
<ConfigProvider themeMode="gold-dark">
  <App />
</ConfigProvider>
```

`theme` 是 antd 的原生主题配置入口，仅用于补充覆盖。不要把 `'gold-dark'` 直接传给 `theme`。

### 旧代码里的 mode、dark、light 怎么办？

`dark`、`light` 只表示明暗模式，不包含客户主题色。主应用需要把它们映射成完整的 `themeMode`：

```ts
const themeMode = `${customerThemeName}-${mode}` as GZDThemeMode;
```

子应用不应继续只接收 `'dark' | 'light'`。

### CSS 变量切换主题后没有更新？

确认主应用切换 `themeMode` 时重新调用了 `applyDesignTokenCssVariables`，并清理上一次注入。独立主题或隔离运行的子应用如果自己传了 `target`，也需要按同样方式更新自己的容器变量：

```ts
useEffect(() => {
  const cleanup = applyDesignTokenCssVariables({ themeMode });

  return cleanup;
}, [themeMode]);
```

### 为什么 Less 变量拿不到当前主题？

Less 是构建期编译，`themeMode` 是运行时状态。业务 Less 中请使用 `var(--gzd-xxx)`，不要依赖 Less 变量实现运行时主题切换。

### CSS 里使用数字 token 为什么没有生效？

CSS 变量会保持 token 原值。颜色 token 可以直接使用，但数字 token 通常没有单位，例如 `--gzd-padding-lg: 24`。在 CSS 长度属性中需要补单位：

```css
.box {
  padding: calc(var(--gzd-padding-lg) * 1px);
  border-radius: calc(var(--gzd-border-radius-lg) * 1px);
}
```

React inline style 中使用数字 token 通常不需要这样处理，例如 `style={{ padding: globalToken.paddingLG }}`。

### 什么时候开启 includeComponents？

默认不开启。只有业务自定义组件需要复用某个 antd 组件级 token 时再开启，例如复用 Button 高度、Input 圆角等。普通页面布局优先使用全局 token。

### 静态方法 message、notification、Modal 为什么主题不生效？

antd 的静态方法不一定能消费当前 React context。需要主题上下文时，优先使用 hooks 版本，或确保相关调用位于组件库 `ConfigProvider` 和 antd `App` 上下文内。

### 可以直接使用 goldDarkThemeTokens 这类具体主题常量吗？

不推荐。业务侧统一使用 `getDesignTokens({ themeMode })`、`applyDesignTokenCssVariables({ themeMode })` 或 `getDesignTokenCssVariables({ themeMode })`。具体主题常量属于组件库内部组织方式，后续可能调整。

### 业务临时覆盖 token 会不会影响组件库？

传给 `ConfigProvider` 的 `theme` 只影响当前 React 树，不会改组件库内置 token。但如果该覆盖代表长期设计规范，应沉淀到组件库，否则不同应用会逐渐出现视觉差异。

### getDesignTokens 会包含业务传给 ConfigProvider.theme 的覆盖吗？

不会。`getDesignTokens({ themeMode })` 返回的是组件库内置的预设 token bundle。业务传给 `ConfigProvider.theme` 的覆盖只在当前 React 树中合并生效。

如果 React 组件需要读取覆盖后的 antd token，使用 `theme.useToken()`。如果 CSS 变量也要体现长期覆盖，应把对应 token 回收到组件库维护，而不是在业务侧单独维护一套覆盖逻辑。

### 组件样式和设计稿不一致时应该怎么处理？

先排查当前 `themeMode` 是否正确、样式文件是否加载、是否存在业务 CSS 覆盖。如果确认是组件库 token 或组件样式问题，应回到组件库修复，不建议业务侧写大范围覆盖选择器。

### 业务项目需要单独引入样式吗？

需要。推荐在业务入口显式引入组件库样式，尤其是微前端子应用，避免构建工具摇树、样式抽取、按需加载或主子应用加载顺序差异导致样式缺失：

```ts
import "gzd/gzd.css";
```

`gzd/style.css` 目前是同一份构建样式的兼容别名，但新接入应用统一推荐使用 `gzd/gzd.css`，入口含义更明确，也和包导出的实际样式产物名称一致。
