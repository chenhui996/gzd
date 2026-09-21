---
title: 主题与 Design Token
order: 4
group: 新人培训
---

# 主题与 Design Token

主题看起来概念很多，其实可以先把它理解成一组“统一的视觉变量”：

- `colorPrimary` 表示主色。
- `colorBgLayout` 表示页面大背景。
- `fontSize` 表示基础字号。
- `components.Button` 下面的值只控制 Button。

切换 `themeMode`，就是整套替换这些视觉变量。

## 四套主题

当前公开类型是：

```ts | pure
type GZDThemeName = 'gold' | 'blue';
type GZDThemeVariant = 'light' | 'dark';
type GZDThemeMode = `${GZDThemeName}-${GZDThemeVariant}`;
```

所以现在只有四个合法值：

| `themeMode` | 含义 |
| --- | --- |
| `gold-dark` | 金色主题，暗色模式；也是默认值 |
| `gold-light` | 金色主题，亮色模式 |
| `blue-dark` | 蓝色主题，暗色模式 |
| `blue-light` | 蓝色主题，亮色模式 |

在应用入口把完整的 `themeMode` 传给 `ConfigProvider`：

```tsx | pure
import type { PropsWithChildren } from 'react';
import {
  ConfigProvider,
  type GZDThemeMode,
} from 'gzd';

const themeMode: GZDThemeMode = 'blue-light';

export function Root({ children }: PropsWithChildren) {
  return (
    <ConfigProvider themeMode={themeMode}>
      {children}
    </ConfigProvider>
  );
}
```

主应用或业务配置负责决定使用哪套主题。子应用最好只接收完整的 `themeMode`，不要再分别拼接“客户颜色”和“明暗模式”。

本地启动文档站后，可以使用页面右上角的主题选择器切换金色/蓝色和亮色/暗色。它会让整页组件示例一起切换，适合做四套主题的快速人工检查。

## `ConfigProvider` 怎样应用主题

`ConfigProvider` 内部会做四件事：

1. 根据 `themeMode` 取得预设 Token。
2. 把全局 Token 和组件 Token 交给 Ant Design。
3. 合并业务传入的 `theme.token` 与 `theme.components`。
4. 在 `gold-dark` 下为部分组件补充设计稿需要的类名和 CSS 变量。

它还继承了 Ant Design `ConfigProvider` 的其他属性，并默认使用中文语言。

### 覆盖全局 Token

业务值会覆盖同名的预设值：

```tsx | pure
import { ConfigProvider } from 'gzd';

export function Root() {
  return (
    <ConfigProvider
      themeMode="blue-light"
      theme={{
        token: {
          borderRadius: 8,
        },
      }}
    >
      <main>业务应用</main>
    </ConfigProvider>
  );
}
```

只有确实存在业务规范差异时才覆盖。能使用现有语义 Token，就不要在页面中散落固定色值。

### 覆盖组件 Token

可以只调整某一类组件：

```tsx | pure
import { Button, ConfigProvider } from 'gzd';

<ConfigProvider
  themeMode="gold-dark"
  theme={{
    components: {
      Button: {
        controlHeight: 36,
      },
    },
  }}
>
  <Button type="primary">保存</Button>
</ConfigProvider>
```

这里要注意：当前实现对 `theme.components` 做的是组件一级的浅合并。传入 `components.Button` 时，会替换预设的整个 Button 配置，而不是逐字段深合并。

如果必须保留预设 Button Token，再覆盖其中一项，可以显式合并：

```tsx | pure
import {
  Button,
  ConfigProvider,
  getDesignTokens,
} from 'gzd';

const themeMode = 'gold-dark' as const;
const preset = getDesignTokens({ themeMode });

<ConfigProvider
  themeMode={themeMode}
  theme={{
    components: {
      Button: {
        ...preset.components.Button,
        controlHeight: 36,
      },
    },
  }}
>
  <Button type="primary">保存</Button>
</ConfigProvider>;
```

`custom` Token 不会自动交给 Ant Design。它主要给业务样式和响应式配置使用，读取方式见后文。

## `cssVarScope` 是做什么的

Ant Design 会把主题转换成 CSS 变量。gzd 会自动为它生成稳定的 `key` 和 `prefix`，业务代码不要直接维护 `theme.cssVar.key` 或 `theme.cssVar.prefix`。

默认情况下：

| 配置 | 生成结果 |
| --- | --- |
| `themeMode="gold-dark"` | `key: "gzd-gold-dark"`，`prefix: "gzd-ant"` |
| `themeMode="blue-light"` | `key: "gzd-blue-light"`，`prefix: "gzd-ant"` |

普通单体应用不需要传 `cssVarScope`。

同一页面存在多个子应用、多个组件库版本，或者不同应用要使用不同的主题覆盖时，再给每个应用一个稳定且唯一的作用域：

```tsx | pure
import { ConfigProvider } from 'gzd';

<ConfigProvider
  themeMode="gold-dark"
  cssVarScope="orderCenter"
>
  <main>订单中心应用</main>
</ConfigProvider>
```

`orderCenter` 会被转成短横线格式，结果是：

```text
key:    gzd-order-center-gold-dark
prefix: gzd-order-center
```

使用时记住三点：

- 作用域名称要稳定，不要每次渲染随机生成。
- 不同应用使用不同名称，例如 `order-center`、`risk-center`。
- 只切换同一个应用的明暗主题时，保持 `cssVarScope` 不变，只改变 `themeMode`。

## 在 JS/TS 中读取 Token

### `getDesignTokens`

这个函数返回当前主题的完整 Token 包：

```ts | pure
import { getDesignTokens } from 'gzd';

const tokens = getDesignTokens({
  themeMode: 'gold-dark',
});
```

返回值分为三部分：

| 字段 | 内容 | 常见用途 |
| --- | --- | --- |
| `globalToken` | 全局颜色、背景、字号、圆角、间距等 | 业务容器、图表、普通自定义组件 |
| `components` | 按 Button、Input 等组件名分组的专属 Token | 自定义组件需要与某个 gzd 组件保持一致 |
| `custom` | 非 Ant Design 的项目配置，目前包含响应式数据等 | 页面布局和项目自定义能力 |

Gold 主题在 `components.Sidebar` 中提供 8 个值，在 `components.PanelCollapse` 中提供 4 个值。它们可以从 `getDesignTokens().components` 读取，开启 `includeComponents` 时也会生成 CSS 变量。

但要注意：仓库目前还没有名为 Sidebar 或 PanelCollapse 的对应组件，Ant Design 也不会自动识别这两个额外的组件 key。因此“Token 已接入”不等于页面立即变化；后续开发对应组件时，还需要主动读取并使用这些值。

业务代码优先使用 `globalToken`：

```tsx | pure
import { getDesignTokens } from 'gzd';

const tokens = getDesignTokens({ themeMode: 'blue-dark' });

export function BusinessPanel() {
  return (
    <section
      style={{
        color: tokens.globalToken.colorText,
        background: tokens.globalToken.colorBgContainer,
        borderColor: tokens.globalToken.colorBorder,
      }}
    >
      业务内容
    </section>
  );
}
```

返回的是组件库维护的主题对象。把它当成只读数据使用，不要直接修改。主题变化后，应使用新的 `themeMode` 重新获取。

这个函数只返回 `themeMode` 对应的预设值。它不会读取 React 上下文，也不知道某个 `ConfigProvider` 又覆盖了哪些 Token。

## 在 CSS 中使用 Token

gzd 提供两个函数：

- `getDesignTokenCssVariables`：只生成一个 CSS 变量对象，不改页面。
- `applyDesignTokenCssVariables`：把变量写到页面元素上，并返回清理函数。

### `getDesignTokenCssVariables`

```ts | pure
import {
  getDesignTokenCssVariables,
} from 'gzd';

const variables = getDesignTokenCssVariables({
  themeMode: 'gold-dark',
});

console.log(variables['--gzd-color-bg-layout']);
```

默认配置如下：

| 选项 | 默认值 | 作用 |
| --- | --- | --- |
| `prefix` | `'gzd'` | CSS 变量名前缀 |
| `includeCustom` | `true` | 是否包含 `custom` Token |
| `includeComponents` | `false` | 是否包含组件级 Token |

命名会自动转成短横线格式：

```text
globalToken.colorBgLayout
→ --gzd-color-bg-layout

custom.responsive.Desktop...
→ --gzd-custom-responsive-desktop-...

components.Button.primaryGradientStart
→ --gzd-components-button-primary-gradient-start
```

组件级 Token 数量很多，所以 `includeComponents` 默认关闭。只有 CSS 确实需要读取组件级 Token 时再打开。

数值 Token 会原样转成字符串，不会自动补 `px`。例如变量值为 `14` 时，要先确认它代表像素、倍数还是其他单位，再决定 CSS 写法。

// chenhui996？？？

### `applyDesignTokenCssVariables`

默认会把变量写到 `document.documentElement`，也就是页面根元素：

```tsx | pure
import { useEffect } from 'react';
import {
  applyDesignTokenCssVariables,
  type GZDThemeMode,
} from 'gzd';

export function BusinessThemeVariables({
  themeMode,
}: {
  themeMode: GZDThemeMode;
}) {
  useEffect(() => {
    return applyDesignTokenCssVariables({
      themeMode,
      prefix: 'business',
    });
  }, [themeMode]);

  return null;
}
```

业务 CSS 就可以使用：

```css
.business-panel {
  color: var(--business-color-text);
  background: var(--business-color-bg-container);
  border: 1px solid var(--business-color-border);
}
```

也可以把变量限制在某个元素：

```ts | pure
const cleanup = applyDesignTokenCssVariables({
  themeMode: 'blue-light',
  prefix: 'order-app',
  target: orderAppRootElement,
});

// 子应用卸载或重新应用主题时调用
cleanup();
```

清理函数会恢复这个元素原来的内联变量。若其他代码后来又改写了同名变量，它不会误删后来写入的值。在服务端渲染且没有可用 DOM 时，该函数会安全地返回一个空清理函数。

## 两套 CSS 变量不要混淆

这里存在两种用途不同的 CSS 变量：

| 来源 | 是否自动 | 给谁使用 |
| --- | --- | --- |
| `ConfigProvider` 内部的 Ant Design CSS 变量 | 自动 | gzd 和 Ant Design 组件 |
| `applyDesignTokenCssVariables` 生成的变量 | 按需调用 | 业务 CSS、Less、图表或非 React 内容 |

`cssVarScope` 只负责第一种变量的隔离。业务 CSS 变量需要隔离时，要给 `applyDesignTokenCssVariables` 设置独立的 `prefix` 或 `target`。

三个 Token 工具都根据预设 `themeMode` 工作，不会自动带上 `ConfigProvider` 的业务覆盖。如果业务同时覆盖了主题，又要求自定义 CSS 完全一致，需要自行维护对应的业务变量。

## Token 从哪里来

仓库内只有一个可编辑的 Token 源目录：`gzd-design-tokens-origin/`。可以把后面的流程理解为两个出口：

```text
gzd-design-tokens-origin/
UI 从 Figma 导出的源 JSON，唯一允许手动编辑的 Token 目录
        │
        ├── 主设计系统 → src/styles/themes → ConfigProvider / Token 工具
        │
        └── AG Grid → src/gzd-table → Table / gzd-table 子入口
```

### 源文件目录

`gzd-design-tokens-origin/` 按主题分为 `gold-theme` 和 `blue-theme`。每套主题中又包含：

- `colors`：色板。
- `seed`、`map`、`alias`、`static`：不同层级的全局 Token。
- `components`：组件级 Token。
- `responsive`：响应式与页面自定义数据。

亮色和暗色分别使用 `Light.tokens.json`、`Dark.tokens.json`。

Gold 主题下还有表格专项源：

- `ag-grid/Dark.tokens.json` 和 `ag-grid/Light.tokens.json`：表格参数。

Token 转换只读取 `gzd-design-tokens-origin/` 中的 JSON。根目录不要保留或依赖 UI 导出的 ZIP 等临时交付文件。

### 转换阶段

导入工具会自动完成转换和文档生成，无需手动执行这一阶段。生成结果包括：

| 内容 | 生成结果 |
| --- | --- |
| 主设计系统 | `gold-dark`、`gold-light`、`blue-dark`、`blue-light` 四套 Token |
| AG Grid | Gold Dark / Light 各 225 个可用参数（含 14 个兼容参数） |
| Token 文档 | 全局、组件、自定义与响应式、AG Grid 四页文档 |

转换器会解析 Token alias。主 Token 发现未解析 alias 会直接失败；AG Grid 也会阻止缺失引用、循环引用和无效输出。这是在阻止一个看似生成成功、实际在页面中找不到值的 Token 进入业务。

### 运行阶段

`getDesignTokens({ themeMode })` 从映射中取出：

- 生成结果的 `token`，对外叫 `globalToken`。
- 生成结果的 `components`。
- 生成结果的 `custom`。

`ConfigProvider` 使用前两项驱动组件主题；业务代码可以使用三项，也可以把它们转换成自己的 CSS 变量。

// chenhui996？？？

AG Grid 不走 `getDesignTokens`。`Table` 会在 `gold-dark` 和 `gold-light` 下自动使用对应结果。如果业务直接使用底层 AG Grid，则从 `gzd/gzd-table` 导入生成的 Grid Token。详细用法见 [AG Grid Table Tokens](/tokens/ag-grid-table)。

项目图表技术栈统一使用 ECharts，不单独维护图表 Token。创建 ECharts option 时，直接读取当前模式的全局 Token：

```ts | pure
import { getDesignTokens } from 'gzd';

const { globalToken } = getDesignTokens({ themeMode: 'gold-light' });

const option = {
  backgroundColor: globalToken.colorBgContainer,
  color: [globalToken.colorPrimary, globalToken.colorSuccess],
  textStyle: { color: globalToken.colorText },
};
```

主题切换后，用新的 `themeMode` 重新创建并设置 option。完整字段对照见 [全局 Tokens](/tokens)。

## 正确维护 Token

### 收到 UI 交付包：一条命令导入

在仓库根目录执行，路径有空格时保留引号：

```shell
npm run tokens:import -- "/path/to/UI 交付包"
```

这是日常导入的唯一入口，已包含源文件替换、Token 转换和文档生成。

工具使用系统 `unzip` 读取 ZIP，macOS 自带，无需手动解压每个分组。

多主题包按以下结构交付：

```text
UI 交付包/
├── gold-theme/
│   ├── colors.zip
│   ├── seed.zip
│   ├── map.zip
│   ├── alias.zip
│   ├── static.zip
│   ├── components.zip
│   └── responsive.zip
└── blue-theme/
    └── 同样七个分组 ZIP
```

每个主题需提供完整的七个分组。前六个 ZIP 各含 `Dark.tokens.json`、`Light.tokens.json`；`responsive.zip` 含 `Mobile.tokens.json`、`Tablet.tokens.json`、`Desktop SM.tokens.json`、`Desktop.tokens.json`，即每主题 16 份 JSON。也支持已解压的同名分组目录，JSON 直接放在分组目录内；同一分组不要同时提供 ZIP 和目录。

工具自动导入包中所有 Gold、Blue 主题，包括各自的明暗模式。也可以只提供一个主题目录；目录名支持 `gold-theme` / `gold`、`blue-theme` / `blue`，不区分大小写。当前工具只支持这两种主题。

如果旧包直接包含七个 ZIP，没有主题目录，必须明确指定归属：

```shell
npm run tokens:import -- "/path/to/国泰海通专用 token 0918" --theme gold
npm run tokens:import -- "/path/to/Blue 单主题包" --theme blue
```

`--theme` 仅用于指定无主题标识的单主题包，不能用来筛选多主题包。Light、Dark 表示明暗模式，不等于 Gold、Blue；一份只有 Gold 明暗数据的包不会同时覆盖 Blue。

可先预览，确认归属和变更文件后再正式导入：

```shell
npm run tokens:import -- "/path/to/UI 交付包" --dry-run
npm run tokens:import -- "/path/to/单主题包" --theme gold --dry-run
npm run tokens:import -- --help
```

`--dry-run` 只检查输入和源文件差异，不写文件、不执行转换；引用解析和文档校验会在正式生成时执行。

### 导入后会自动更新什么

```text
UI 交付包
  ↓ tokens:import：全部主题校验通过后替换源 JSON
gzd-design-tokens-origin/
  ↓ 自动转换：统一执行一次
gzd-design-tokens/
  ↓ 自动生成文档
四页 Token 文档
```

自动更新的文档包括：

| 文档 | 文件 |
| --- | --- |
| [全局 Token](/tokens) | `docs/tokens.md` |
| [组件 Token](/tokens/components) | `docs/tokens/components.md` |
| [自定义与响应式 Token](/tokens/custom) | `docs/tokens/custom.md` |
| [AG Grid Token](/tokens/ag-grid-table) | `docs/tokens/ag-grid-table.md` |

已有 Token 的值变化会自动反映到文档。组件 Token 的说明优先使用源 JSON 的 `$description`，没有说明时回退为组件名与 Token 名。新增或删除全局 Token 时，可能需要同步修改 `scripts/token-doc-metadata.json` 中的中文说明；工具不会自动编写这些说明，也不会修改培训文档或组件使用教程。

任一主题缺文件、JSON 无效或有重复文件时，整包都不会写入。普通导入或生成错误会回滚本次所有主题的源文件、生成物和 Token 文档，保留执行前已有的未提交内容。按日志修正交付包或文档元数据后重新导入即可。运行期间不要同时编辑这些文件；强制结束进程或断电不保证自动恢复，恢复失败时按日志中的备份路径处理。

### AG Grid 交付包单独处理

**`tokens:import` 不支持导入 AG Grid 交付包。** 它调用完整生成链路时，只会根据仓库已有的 AG Grid 源重新生成参数和文档。

收到新的 AG Grid 交付时，核对并手动替换以下两份源文件：

```text
gzd-design-tokens-origin/gold-theme/ag-grid/Dark.tokens.json
gzd-design-tokens-origin/gold-theme/ag-grid/Light.tokens.json
```

然后执行：

```shell
npm run tokens:transform:ag-grid
```

这条命令生成 Gold AG Grid Token 并更新 Token 文档，不包含导入工具的回滚功能。若新增或删除 Grid 参数，需要根据校验提示同步文档元数据及相关清单。

### 导入后的检查

1. 查看源文件、`gzd-design-tokens/` 和 Token 文档的 Git diff，确认变化符合 UI 交付。
2. 确认生成日志中四套主主题的 `unresolvedAliases` 都为 `0`，AG Grid 和文档生成没有错误。
3. 在文档站检查受影响组件的亮色、暗色效果。

日常导入无需另外运行导入工具自身的测试，也无需再次执行生成命令。提交前可运行针对 Token 的快速校验：

```shell
npx vitest run src/styles/themes/themeTokens.test.ts src/styles/themes/tokenDocs.test.ts src/gzd-table/transformAgGridTokens.test.ts
npm run docs:tokens:check
git diff --check
```

发版前再按发布流程完成完整测试、组件库和文档站构建。

### 维护者：手动修改源 JSON 后重新生成

`tokens:transform` 保留为导入工具调用的内部生成命令，日常导入不需要手动执行。仅在维护者直接修改 `gzd-design-tokens-origin/` 中的源 JSON、调试生成器时，才单独运行：

```shell
npm run tokens:transform
```

它不读取 UI 交付包，也不包含导入工具的备份回滚流程。

不要直接修改 `gzd-design-tokens/`，下次执行转换时手工修改会被覆盖。

如果未来增加一种新主题颜色，只添加源文件还不够，还需要扩展：

- `GZDThemeName` / `GZDThemeMode` 类型。
- `themeTokens.ts` 中的主题映射。
- 文档站或主应用中的主题选择逻辑。

## 常见注意事项

- `themeMode` 必须是当前四个合法值之一，不要用普通字符串绕过类型检查。
- 不要在业务中直接依赖 `goldDarkThemeTokens` 这类内部生成常量。
- 不要修改 `getDesignTokens` 返回的对象。
- 不要把组件 Token 全部转换成 CSS 变量，除非业务确实需要。
- 调用 `applyDesignTokenCssVariables` 后要保存并执行清理函数。
- 多个应用共用页面根元素时，要使用不同 `prefix`，或者把变量写到各自的 `target`。 // chenhui996？？？
- 覆盖 `theme.components.Xxx` 前，要记住当前是组件一级的浅合并。
- 固定颜色只适合不随主题变化的特殊场景；普通页面优先使用语义 Token。

完整 Token 表可以继续查看 [Tokens 使用](/tokens)，全局主题组件的 API 可以查看 [ConfigProvider](/components/config-provider)。

## 学完本页，你应该会什么

- 能说明四个 `themeMode` 分别代表什么。
- 会用 `ConfigProvider` 选择主题并做少量业务覆盖。
- 知道普通应用何时不需要 `cssVarScope`，微前端何时需要。
- 会用三个公开函数在 JS/TS 和 CSS 中消费 Token。
- 能说清 `origin → transform → runtime` 的 Token 流程。
- 会用 `tokens:import` 导入多主题包、预览变更，并区分主主题与 AG Grid 的更新方式。
- 知道只能修改源 Token，不能手改生成目录。

下一章：[开发一个组件](/training/05-develop-component)。
