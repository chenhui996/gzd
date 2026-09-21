---
title: 子应用独立部署主题与自定义样式说明
order: 3
---

# 子应用独立部署主题与自定义样式说明

本文说明业务子应用从微前端主应用中独立出来部署时，如何继续使用 `gzd` 的主题能力、Design Tokens 和自定义样式。

## 适用场景

同一个业务子应用可能有两种运行方式：

1. 嵌入主应用：主应用决定 `themeMode`，子应用只消费并透传。
2. 独立部署：没有主应用下发主题，子应用自己成为当前页面的主题拥有者。

两种模式的职责不同，不要复用同一套主题初始化逻辑直接写 `document.documentElement`，否则嵌入主应用时容易和主应用重复写全局 CSS 变量。

## 核心原则

1. 独立部署时，子应用必须自己确定 `themeMode`，来源可以是用户设置、部署配置、URL 参数或本地默认值。
2. 独立部署时，子应用应显式引入 `gzd/gzd.css`。
3. 独立部署时，子应用可以调用 `applyDesignTokenCssVariables({ themeMode })` 写入页面级 `--gz-*` 变量。
4. 嵌入主应用时，子应用不写 `document.documentElement` 上的 `--gz-*`，只消费主应用已经注入的变量。
5. 自定义样式优先使用组件库导出的 Design Tokens 或 `var(--gz-*)`，不要长期散落硬编码颜色、字号、间距。
6. 如果业务新增的样式值具备跨页面、跨应用复用价值，应回收到组件库 Design Tokens 中维护。

## 运行模式识别

建议在子应用入口区分 `embedded` 和 `standalone`：

```ts
export const isEmbeddedInMainApp = () => Boolean(window.microApp);
```

主题来源也应区分：

```ts
import type { GZDThemeMode } from "gzd";

const DEFAULT_THEME_MODE: GZDThemeMode = "gold-dark";

export function resolveThemeMode(): GZDThemeMode {
  if (window.microApp) {
    return window.microApp.getGlobalData()?.themeMode ?? DEFAULT_THEME_MODE;
  }

  const storedThemeMode = localStorage.getItem(
    "themeMode",
  ) as GZDThemeMode | null;

  return storedThemeMode ?? DEFAULT_THEME_MODE;
}
```

独立部署时，子应用可以根据部署客户、用户明暗模式或本地配置生成完整的 `themeMode`：

```ts
import type {
  GZDThemeMode,
  GZDThemeName,
  GZDThemeVariant,
} from "gzd";

const customerThemeName: GZDThemeName = "gold";
const userThemeVariant: GZDThemeVariant = prefersDarkMode ? "dark" : "light";

const themeMode: GZDThemeMode = `${customerThemeName}-${userThemeVariant}`;
```

## 独立部署入口示例

独立部署时，子应用是当前页面的主题拥有者，可以注入全局业务 CSS 变量：

```tsx
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "gzd/gzd.css";
import {
  ConfigProvider,
  applyDesignTokenCssVariables,
} from "gzd";
import { App } from "./App";
import { resolveThemeMode } from "./theme";

function StandaloneRoot() {
  const themeMode = resolveThemeMode();

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

createRoot(document.getElementById("root")!).render(<StandaloneRoot />);
```

这会写入默认业务 CSS 变量：

```css
:root {
  --gz-color-primary: ...;
  --gz-color-bg-container: ...;
  --gz-color-text: ...;
}
```

业务样式可直接消费：

```css
.page {
  background: var(--gz-color-bg-layout);
  color: var(--gz-color-text);
}

.page-header {
  border-bottom: 1px solid var(--gz-color-border-secondary);
}
```

## 同一入口兼容嵌入和独立部署

如果同一个构建产物既可能被主应用加载，也可能独立访问，建议只在独立模式下写全局 CSS 变量：

```tsx
function Root() {
  const embedded = Boolean(window.microApp);
  const themeMode = resolveThemeMode();

  useEffect(() => {
    if (embedded) {
      return;
    }

    return applyDesignTokenCssVariables({
      themeMode,
      includeCustom: true,
      includeComponents: false,
    });
  }, [embedded, themeMode]);

  return (
    <ConfigProvider themeMode={themeMode}>
      <App />
    </ConfigProvider>
  );
}
```

在嵌入模式下：

1. 主应用下发 `themeMode`。
2. 主应用调用 `applyDesignTokenCssVariables({ themeMode })`。
3. 子应用只 `<ConfigProvider themeMode={themeMode}>`，不重复写 root 变量。

在独立模式下：

1. 子应用自己确定 `themeMode`。
2. 子应用调用 `applyDesignTokenCssVariables({ themeMode })`。
3. 子应用使用同一个 `themeMode` 包裹 `ConfigProvider`。

## 需要独立作用域时

独立部署通常只有一个应用实例，不需要设置 `cssVarScope`。组件库默认会生成：

```ts
cssVar: {
  key: `gz-${themeMode}`,
  prefix: "gz-ant",
}
```

如果独立部署页面里还会同时加载多个子应用、多个组件库版本，或者当前应用传入了自己的 `theme.token/components` 覆盖，应设置稳定的 `cssVarScope`：

```tsx
<ConfigProvider themeMode={themeMode} cssVarScope="risk-center">
  <App />
</ConfigProvider>
```

组件库会生成：

```ts
cssVar: {
  key: `gz-risk-center-${themeMode}`,
  prefix: "gz-risk-center",
}
```

注意：`cssVarScope` 只影响 antd 运行时 CSS 变量，例如 `--gz-risk-center-color-primary`。它不会改变 `applyDesignTokenCssVariables` 注入的业务 CSS 变量 `--gz-*`。

如果业务 CSS 变量也需要隔离，应同时给 `applyDesignTokenCssVariables` 设置 `target` 和 `prefix`：

```tsx
useEffect(() => {
  const target = document.querySelector("#risk-center-root") as HTMLElement;

  return applyDesignTokenCssVariables({
    themeMode,
    target,
    prefix: "gz-risk-center",
    includeCustom: true,
  });
}, [themeMode]);
```

对应 CSS：

```css
#risk-center-root .page {
  background: var(--gz-risk-center-color-bg-layout);
  color: var(--gz-risk-center-color-text);
}
```

如果弹层挂载到 `body`，而 CSS 变量注入在局部容器上，需要配置弹层容器，避免 Select、DatePicker、Modal 等弹层拿不到局部变量：

```tsx
<ConfigProvider
  themeMode={themeMode}
  cssVarScope="risk-center"
  getPopupContainer={() =>
    document.querySelector("#risk-center-root") as HTMLElement
  }>
  <App />
</ConfigProvider>
```

## 自定义样式怎么写

优先级建议如下：

1. React 组件内动态样式优先使用 `theme.useToken()` 或 `getDesignTokens({ themeMode })`。
2. 普通 CSS、CSS Modules、Less 优先使用 `var(--gz-*)`。
3. 独立作用域下的普通 CSS 使用隔离后的 `var(--gz-risk-center-*)`。
4. 业务私有临时变量使用应用自己的前缀，例如 `--risk-center-chart-warning-bg`。
5. 长期设计语义回收到组件库 tokens，不在业务应用长期维护。

示例：

```css
.dashboard-card {
  background: var(--gz-color-bg-container);
  color: var(--gz-color-text);
  border: 1px solid var(--gz-color-border-secondary);
  border-radius: calc(var(--gz-border-radius-lg) * 1px);
}

.dashboard-card__metric {
  color: var(--gz-color-primary);
}
```

业务私有临时变量可以放在应用根节点：

```css
#risk-center-root {
  --risk-center-chart-warning-bg: rgba(216, 150, 20, 0.12);
}

.risk-chart-warning {
  background: var(--risk-center-chart-warning-bg);
}
```

如果这个值后续会被多个页面、多个业务应用复用，应按组件库新增自定义 Design Token 的流程沉淀，不要继续作为业务私有变量扩散。

## theme 覆盖和 CSS 变量的关系

`ConfigProvider` 的 `theme.token`、`theme.components` 覆盖只影响当前 React 树中的 antd 主题。`applyDesignTokenCssVariables({ themeMode })` 注入的 `--gz-*` 来自组件库内置 token bundle，不会自动包含业务传给 `ConfigProvider.theme` 的临时覆盖。

因此：

```tsx
<ConfigProvider
  themeMode={themeMode}
  theme={{
    token: {
      borderRadius: 8,
    },
  }}>
  <App />
</ConfigProvider>
```

这会影响 antd 组件和 `theme.useToken()` 读取到的结果，但不会自动把 `--gz-border-radius` 改成 `8`。

如果 CSS 里也需要这个值，有三种处理方式：

1. 短期局部兼容：在业务根节点写应用私有 CSS 变量。
2. React 内部样式：用 `theme.useToken()` 读取最终 antd token。
3. 长期规范：把该 token 回收到组件库维护，再通过 `applyDesignTokenCssVariables` 输出。

## 推荐接入清单

独立部署子应用应确认：

1. 已引入 `gzd/gzd.css`。
2. 有明确的 `themeMode` 来源和默认值。
3. 独立模式下调用 `applyDesignTokenCssVariables({ themeMode })`。
4. 嵌入模式下不重复写 `document.documentElement` 的 `--gz-*`。
5. 使用 `ConfigProvider themeMode={themeMode}` 包裹应用。
6. 只有隔离、多版本、局部覆盖或多主题同屏时才使用 `cssVarScope`。
7. 自定义样式优先消费 Design Tokens，长期语义 token 回收到组件库。
