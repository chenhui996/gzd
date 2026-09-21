# 业务方使用 Design Tokens 技术方案

## 背景

当前组件库已经维护了不同主题色和明暗模式下的 Design Tokens，并从 `src/index.ts` 导出了一批具体主题常量，例如 `goldDarkThemeTokens`、`blueLightThemeConfig`、`goldDarkThemeCustomTokens` 等。

这些导出可以满足组件库内部和少量业务代码直接引用，但对微前端主应用、子应用来说存在几个问题：

- 业务方需要理解并拼接具体导出名，使用成本高。
- 主题色和明暗模式耦合在导出名中，主应用的客户主题色、子应用的明暗模式来源不一致时不方便组合。
- 未来新增主题色后，业务方代码容易继续扩散 `xxxDarkThemeTokens`、`xxxLightThemeTokens` 这类枚举式引用。
- 自定义样式除了 JS/TS 中使用 token，还需要支持 Less/CSS/CSS-in-JS 等不同写法。

## 目标

为业务方提供稳定、收敛、可扩展的 Design Tokens 消费入口，让主应用和子应用可以按以下方式工作：

- 主应用按部署客户固定配置主题色，例如本期部署为 `gold`。
- 主应用根据当前用户选择的明暗模式映射出完整主题模式 `themeMode`，例如暗色为 `gold-dark`，亮色为 `gold-light`。
- 子应用只从微前端主框架获取 `themeMode`，不再关心主题色和明暗模式的组合规则。
- 业务自定义样式可以通过统一 API 获取当前 token，而不是直接依赖某个具体主题文件。
- 后续新增主题色时，业务方大部分代码不需要调整。

## 设计原则

- 面向业务只提供统一入口，不再把 `goldDarkThemeTokens` 这类具体主题常量作为业务 API。
- 组件库内部可以继续按主题文件组织 token，但业务方不需要感知内部文件和常量命名。
- 业务 API 以主应用传入的 `themeMode` 为唯一主题选择参数。
- 主题色与明暗模式的映射由主应用完成，子应用和组件库消费映射后的完整主题模式。
- JS/TS 和 CSS 两类消费场景都要覆盖。
- 组件库内部仍然以 Ant Design `ThemeConfig` 为基础，业务方不需要理解转换细节。

## 推荐 API 设计

### 类型

```ts | pure
export type GZDThemeName = 'gold' | 'blue';
export type GZDThemeVariant = 'light' | 'dark';
export type GZDThemeMode = `${GZDThemeName}-${GZDThemeVariant}`;

export interface GZDDesignTokenBundle {
  globalToken: ThemeConfig['token'];
  components: ThemeConfig['components'];
  custom?: Record<string, unknown>;
}

export interface GZDThemeOptions {
  themeMode: GZDThemeMode;
}
```

### JS/TS 入口

建议新增以下函数：

```ts | pure
export function getDesignTokens(options: GZDThemeOptions): GZDDesignTokenBundle;
```

其中：

- `getDesignTokens` 返回完整 token bundle，适合业务方写 CSS-in-JS、自定义组件样式、图表样式等。

`getDesignTokens` 返回的 `globalToken`、`components` 和 `custom` 分别对应不同层级的 token：`globalToken` 是全局通用 token，描述颜色、字号、圆角、间距、背景、边框等跨组件共享的基础视觉语义，适合业务页面、自定义区块、图表和通用样式使用；`components` 是组件级 token，按组件名称组织，例如 `components.Button`、`components.Input`，用于控制某个 antd/组件库组件的专属样式细节；`custom` 用于承载当前转换脚本保留下来的非 antd 主题配置，例如响应式断点和页面间距。业务侧优先使用 `globalToken`，只有自定义组件需要和某个组件库组件保持尺寸、圆角、状态色等细节一致时，再读取对应的 `components` token。

业务方示例：

```tsx | pure
import {
  ConfigProvider,
  getDesignTokens,
  type GZDThemeMode,
} from 'gzd';

const themeMode: GZDThemeMode = microAppTheme.themeMode;
const themeOptions = { themeMode };

const tokens = getDesignTokens(themeOptions);

export function App() {
  return (
    <ConfigProvider themeMode={themeMode}>
      <div style={{ background: tokens.globalToken?.colorBgLayout }}>
        <Router />
      </div>
    </ConfigProvider>
  );
}
```

### 内部选择器

建议在组件库内部维护一个稳定的主题 token map，作为 `getDesignTokens` 等统一 API 的实现基础：

```ts | pure
const themeTokenMap: Record<
  GZDThemeMode,
  GZDDesignTokenBundle
>;
```

业务方不直接依赖这个 map，统一通过 `getDesignTokens` API 获取当前主题数据。

## CSS 变量方案

JS/TS API 适合 React 组件和 CSS-in-JS，但微前端子应用中仍然会有 Less、普通 CSS 或非 React 样式。建议组件库额外提供 CSS 变量注入能力。

### API

```ts | pure
export interface GZDThemeCssVariablesOptions extends GZDThemeOptions {
  prefix?: string;
  target?: HTMLElement;
  includeComponents?: boolean;
  includeCustom?: boolean;
}

export function applyDesignTokenCssVariables(
  options: GZDThemeCssVariablesOptions,
): () => void;

export function getDesignTokenCssVariables(
  options: GZDThemeCssVariablesOptions,
): Record<string, string>;
```

默认行为：

- 默认 `prefix` 为 `gzd`。
- 默认注入到 `document.documentElement`。
- 默认注入全局 token 和 custom token。
- 组件级 token 是否注入由 `includeComponents` 控制，默认不注入，避免变量数量过大。
- 返回清理函数，便于微前端应用卸载时移除本应用注入的变量。

生成变量示例：

```css
:root {
  --gzd-color-primary: #c98a49;
  --gzd-color-bg-layout: #000000;
  --gzd-font-size: 14px;
  --gzd-custom-page-header-bg: #141414;
}
```

业务 CSS 示例：

```css
.business-card {
  background: var(--gzd-color-bg-container);
  border-color: var(--gzd-color-border);
  color: var(--gzd-color-text);
}

.business-card__title {
  color: var(--gzd-color-primary);
}
```

## 微前端接入方式

### 主应用

主应用负责确定客户主题色，并把映射后的 `themeMode` 下发给子应用：

```ts | pure
const customerThemeName = 'gold';
const themeMode: GZDThemeMode = `${customerThemeName}-${userPreference.mode}`;

microApp.setGlobalData({
  themeMode,
});
```

主应用自身也使用同一套 API：

```ts | pure
applyDesignTokenCssVariables({
  themeMode,
});
```

### 子应用

子应用只消费主应用下发的结果：

```ts | pure
const { themeMode } = getGlobalThemeData();

const cleanup = applyDesignTokenCssVariables({
  themeMode,
  target: document.documentElement,
});

render(
  <ConfigProvider themeMode={themeMode}>
    <App />
  </ConfigProvider>,
);
```

当用户切换明暗模式时，主应用更新全局数据，子应用重新调用：

```ts | pure
cleanup();

applyDesignTokenCssVariables({
  themeMode: nextThemeMode,
});
```

## 推荐目录调整

建议把主题消费相关逻辑集中在 `src/styles/themes` 中，并通过统一主题入口对外导出：

```text | pure
src/styles/themes/
├── themeTokens.ts          # 内部维护 themeTokenMap，对外提供 getDesignTokens
├── themeCssVariables.ts    # 维护 CSS 变量生成和注入
└── types.ts                # 维护主题相关公共类型
```

`src/index.ts` 继续统一导出：

```ts | pure
export {
  applyDesignTokenCssVariables,
  getDesignTokenCssVariables,
  getDesignTokens,
  type GZDDesignTokenBundle,
  type GZDThemeCssVariablesOptions,
  type GZDThemeMode,
  type GZDThemeName,
  type GZDThemeOptions,
  type GZDThemeVariant,
} from './styles/themes';
```

## 导出策略

业务方不再直接使用具体主题常量：

```ts | pure
goldDarkThemeTokens
goldLightThemeTokens
blueDarkThemeTokens
blueLightThemeTokens
goldDarkThemeConfig
goldLightThemeConfig
blueDarkThemeConfig
blueLightThemeConfig
```

这些常量如果仍然存在，也只应被视为组件库内部实现细节，不作为业务接入 API 暴露或宣传。业务方统一使用：

```ts | pure
getDesignTokens({ themeMode: 'gold-dark' });
```

## 新增主题色流程

未来新增主题色，例如 `green`：

1. UI 提供 `green` 主题的 Light/Dark tokens。
2. 转换脚本生成 `greenLightThemeTokens` 和 `greenDarkThemeTokens`。
3. 扩展 `GZDThemeName = 'gold' | 'blue' | 'green'`，`GZDThemeMode` 会自动包含 `green-light` 和 `green-dark`。
4. 在组件库内部的主题 token map 中注册 `green-light` 和 `green-dark` 的 token bundle。
5. 主应用按客户部署配置输出新的 `themeMode`，子应用如果只透传 `themeMode`，不需要修改业务代码。

## 实施步骤

1. 新增 `types.ts`、`themeTokens.ts`、`themeCssVariables.ts`。
2. 新增 `getDesignTokens`。
3. 新增 CSS 变量生成和注入函数。
4. 更新 `src/index.ts` 导出。
5. 补充文档和基础单元测试，覆盖：
   - `themeMode = 'gold-dark' | 'gold-light' | 'blue-dark' | 'blue-light'` 正确取值。
   - CSS 变量 kebab-case 命名正确。
   - `applyDesignTokenCssVariables` 可更新、可清理。

## 推荐结论

推荐采用“统一选择器 API + CSS 变量注入”的方案。

这套方案能让主应用负责客户主题色与明暗模式的最终映射，子应用只消费 `themeMode`，同时让业务自定义样式在 JS/TS、CSS、Less、CSS-in-JS 场景下都能稳定消费组件库维护的 Design Tokens。新增主题色时，只需要组件库注册新 token，并由主应用输出新的 `themeMode`，子应用不需要继续增加分散的具体主题导入。
