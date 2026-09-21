---
group: 新人培训
title: 开发一个组件
order: 5
---

# 开发一个组件

这一章讲两件事：

1. 怎样安全地修改已有组件。
2. 怎样把一个新组件完整地加入组件库。

先记住一个原则：gzd 大多是在 Ant Design 6 的组件上增加统一主题、默认行为和业务能力；Table 则基于 AG Grid 36。能复用上游组件的地方，就不要重新实现一遍。

## 动手前先判断改哪里

收到需求后，先问自己下面几个问题：

| 需求 | 通常应该查看的位置 |
| --- | --- |
| 修改某个组件的行为或默认值 | `src/components/组件名/` |
| 修改所有组件都会使用的颜色、字号或圆角 | Design Token，参见[主题与 Design Token](/training/04-theme-and-tokens) |
| 只修改某个组件在某套主题下的样式 | 组件 `style.less`、主题 Token、`ConfigProvider` 适配代码 |
| 增加文档示例 | 组件的 `index.md` 或 `demo/` |
| 让业务项目可以导入新组件 | 组件入口和 `src/index.ts` |

不要一看到颜色不对，就马上写一个硬编码色值。先确认它是不是应该由主题 Token 控制。

## 修改已有组件

以修改 `Button` 为例，推荐按下面的顺序做。

### 第 1 步：找到完整链路

至少查看这些位置：

```text
src/components/button/index.tsx   组件实现和组件自身导出
src/components/button/index.md    组件文档与示例
src/components/button/style.less  组件库补充样式
src/styles/index.less             发布样式的统一入口
src/index.ts                      包的公开导出入口
```

不同组件的拆分方式不完全相同。例如 `Input`、`Form`、`Tag` 还有子组件文件；有的简单组件直接写在 `index.tsx` 中。修改前先看完这个组件目录，不要只改第一个看到的文件。

### 第 2 步：先在文档站复现

运行：

```shell
npm run dev
```

打开对应组件页面，确认问题确实存在。最好把复现场景做成一个最小 demo，只保留能触发问题的属性。

这样做有两个好处：

- 修改前知道问题是什么，不会改偏。
- 修改后可以直接比较结果。

### 第 3 步：确认上游组件的原有能力

普通组件先检查 Ant Design 6 是否已经提供对应属性、事件、子组件或 ref 类型；Table 相关开发则检查 AG Grid 36 的 Props、Grid API、模块和事件。

如果上游组件已经能完成需求，gzd 通常只需要透传属性或增加很薄的一层封装。不要复制相同逻辑，否则以后升级上游依赖时会更难维护。

### 第 4 步：只改需求需要的部分

修改时重点检查：

- 没有被 gzd 特别处理的属性，是否仍然传给了 Ant Design。
- 受控值和非受控值是否都能工作，例如 `value` 与 `defaultValue`。
- 原有默认值是否被意外改变。
- 事件回调的参数和触发时机是否保持兼容。
- 业务传入的 `className`、`style` 和组件级样式是否仍有合理的优先级。
- 组件原来支持 ref 时，修改后是否仍然能拿到正确对象。

`Input` 的 `trim` 是一个适合阅读的例子：它只在需要时处理值和 `onChange`，其他属性继续传给 Ant Design。

### 第 5 步：检查四套主题

至少切换并观察：

- `gold-dark`
- `gold-light`
- `blue-dark`
- `blue-light`

如果需求只针对一套主题，样式或逻辑也必须限制在这套主题内，不能顺带影响另外三套。

### 第 6 步：补文档和测试

下列变化需要同步更新文档：

- 新增属性、默认值或子组件。
- 使用方式发生变化。
- 有容易误用的限制。
- 新增了一个业务方能看到的状态或样式。

行为逻辑、主题适配或历史 bug 修复，建议增加测试。测试文件放在组件目录内，命名为 `*.test.ts` 或 `*.test.tsx`。

最后执行[测试与质量检查](/training/06-test-and-quality)中的检查。

## 新增组件的完整流程

下面用 `ActionButton` 作为结构示例。它只是用来说明文件怎样组织，并不是要求仓库真的再新增一个 Button。

### 第 1 步：建立组件目录

目录名使用小写中划线，React 组件名使用大驼峰：

```text
src/components/action-button/
├── ActionButton.tsx
├── index.tsx
├── index.md
├── style.less              可选，有补充样式时才需要
├── ActionButton.test.tsx   建议为新增行为补测试
└── demo/                   可选，示例较多时使用
```

请先参考一个结构相近的现有组件：

- 简单封装可看 `button/`、`flex/`。
- 带子组件可看 `input/`、`tag/`、`form/`。
- 带主题差异和测试可看 `tag/`。
- 需要全局配置可看 `config-provider/`。

### 第 2 步：定义 Props 和组件

如果 Props 与 Ant Design 完全相同，优先使用类型别名。不要为了改一个名字而写空接口；当前 ESLint 会把空接口报错。

```tsx | pure
import { Button as AntdButton, type ButtonProps } from 'antd';
import { forwardRef } from 'react';

export type GZDActionButtonProps = ButtonProps & {
  trackingName?: string;
};

const ActionButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  GZDActionButtonProps
>(({ trackingName, ...restProps }, ref) => {
  return (
    <AntdButton
      ref={ref}
      data-tracking-name={trackingName}
      {...restProps}
    />
  );
});

ActionButton.displayName = 'GZDActionButton';

export default ActionButton;
```

这里要注意：

- 组件库内部的属性类型通常以 `GZD` 开头，例如 `GZDButtonProps`。
- 使用 `import type` 导入纯类型。
- 不要使用 `any` 暂时绕过类型问题。
- 新增自己的属性后，不要把 Ant Design 不认识的属性原样传到 DOM。
- ref 类型要按真实组件确定。输入框可能是 `InputRef`，选择器可能是 `RefSelectProps`，不一定都是 `HTMLElement`。
- `displayName` 能让 React DevTools 中的名字更清楚。

不是所有组件都必须使用 `forwardRef`。但如果被封装的组件原本支持 focus、滚动、读取 DOM 或其他 ref 能力，就要保留这项能力。

### 第 3 步：建立组件自身入口

`src/components/action-button/index.tsx`：

```tsx | pure
import ActionButton from './ActionButton';

export type { GZDActionButtonProps } from './ActionButton';

export default ActionButton;
```

如果组件有 `Group`、`Item`、`Option` 之类的子组件，请参考 `Input` 或 `Tag` 的入口，把子组件挂在默认组件上，并分别导出它们的 Props 类型。

### 第 4 步：加入包的公开入口

在 `src/index.ts` 增加：

```ts | pure
export {
  default as ActionButton,
  type GZDActionButtonProps as ActionButtonProps,
} from './components/action-button';
```

这一步不能漏。文档里直接引用内部文件即使能运行，也不代表发布后的业务项目能从 `gzd` 导入它。

项目中的常见命名方式是：

- 源码内部类型：`GZDActionButtonProps`
- 包对外类型：`ActionButtonProps`

### 第 5 步：接入样式

只有 Ant Design 原有样式不能满足需求时，才新增 `style.less`。

创建样式文件后，要确认它被构建入口引用。当前发布样式的统一入口是 `src/styles/index.less`，可在其中增加：

```less
@import "../components/action-button/style.less";
```

写样式时注意：

- 优先使用 Design Token 或 CSS 变量，不要随意硬编码主题色。
- 选择器范围要小，不要覆盖所有 `.ant-*` 组件。
- 保留业务传入 `className` 和 `style` 的能力。
- 如果使用 `prefixCls` 或 `cssVarScope`，不要假设类名永远只以 `.ant-` 开头。
- 弹层组件还要检查弹层挂载到 `body` 时的样式和变量。

仓库中少数组件直接导入了自己的 `style.less`，也有组件由统一入口导入。新增组件应选定一种清楚的接入方式，避免同一个样式重复导入；优先跟随 `src/styles/index.less` 的统一入口。

### 第 6 步：写 Dumi 文档

`src/components/action-button/index.md` 至少包含：

```md
---
group: 通用
title: ActionButton 操作按钮
---

# ActionButton 操作按钮

一句话说明它解决什么问题。

## 何时使用

- 场景一。
- 场景二。

## 基础用法

放一个最小可运行示例。

## 与 Ant Design 的不同

说明新增属性、默认值和限制。
```

组件分类沿用现有文档，例如“通用”“布局”“导航”“数据录入”“数据展示”“反馈”“其他”。

Dumi 示例中建议从 `gzd` 导入：

```tsx | pure
import { ActionButton } from 'gzd';
```

`gzd` 在文档配置中指向 `src/index.ts`，在业务项目中则解析到安装的 npm 包。两边使用相同的导入语句，示例既能检查公开导出，也能直接复制到业务项目。

Table demo 中的 `gzd/gzd-table` 别名指向 `src/gzd-table/index.ts`，用于验证 AG Grid 子路径导出；业务项目也使用相同的 `gzd/gzd-table` 导入路径。

一个页面只有少量示例时，可以直接在 `index.md` 写代码块；示例较多时，放入 `demo/`。重点不是形式，而是新人复制示例后能运行。

### 第 7 步：补测试

根据修改的内容选择合适的测试框架：

- **逻辑、工具函数、基础属性**：在组件目录内新建 `*.test.tsx`，使用 Vitest 测试。
- **UI 样式、宽高尺寸、复杂交互**：在 `tests/ct/` 目录下新建 `*.spec.tsx`，使用 Playwright 组件测试。

新增的行为至少覆盖：

- 最常用的正常场景。
- gzd 自己增加的属性或默认值。
- 修复过的 bug。
- 有条件分支的主题适配。
- 业务样式或实例样式的优先级，如果这正是需求的一部分。

不用把 Ant Design 或 AG Grid 已经测试过的每一个 Props 再测一遍。测试重点是 gzd 增加或改变的部分。

### 第 8 步：记录变化

如果业务使用者能感知这次变化，请把说明写到根目录 `CHANGELOG.md` 的 `Unreleased` 中。不要直接编辑自动生成的 `docs/CHANGELOG.md`。

### 第 9 步：完成检查

按顺序执行：

```shell
./node_modules/.bin/tsc -b --pretty false
npm run test
npm run test:ct
npm run lint
npm run build
npm run docs:build
```

当前全量 lint 有历史问题，处理方式见下一章。不能因为它目前不通过，就不检查自己新增的文件。

## 需要新增依赖时

先判断依赖在什么时候使用：

| 依赖用途 | 通常放在哪里 |
| --- | --- |
| 发布后的组件运行时需要 | `dependencies` |
| 由业务项目提供的核心框架，例如 React、ReactDOM、Ant Design 和 AG Grid | `peerDependencies`，同时放在 `devDependencies` 供本仓库开发 |
| 只用于文档、demo、测试、构建或代码检查 | `devDependencies` |

使用 npm 安装依赖，让 `package.json` 和 `package-lock.json` 一起更新。不要只手改其中一个文件，也不要把只用于 demo 的包放进运行时依赖。

## 项目约定速查

| 项目 | 约定 |
| --- | --- |
| 组件目录 | 小写中划线，例如 `date-picker` |
| React 组件 | 大驼峰，例如 `DatePicker` |
| 内部 Props | 通常使用 `GZD` 前缀，例如 `GZDDatePickerProps` |
| 公开 Props | 在 `src/index.ts` 中常导出为 `DatePickerProps` |
| 公开入口 | 普通组件从 `src/index.ts` 导出；额外子路径还要同步 `package.json#exports`、Vite 构建入口和导出验证 |
| 样式入口 | `src/styles/index.less` |
| 组件文档 | `src/components/<name>/index.md` |
| 文档示例导入 | 根入口从 `gzd` 导入；Table 的 AG Grid API 从 `gzd/gzd-table` 导入 |
| 测试位置 | 逻辑测试：组件目录内的 `*.test.tsx`；UI 交互测试：`tests/ct/*.spec.tsx` |
| 引号和格式 | 仓库历史代码不完全统一，修改时跟随当前文件，避免无关的全文件格式化 |

## 开发中不要做的事

- 不要从业务项目导入 `src/components/...` 等内部路径。
- 不要直接修改 `gzd-lib/`，它是构建产物。
- 不要直接修改 `gzd-design-tokens/`，它是 Token 生成结果。
- 不要为了消除报错随意加入 `any`、关闭整个文件的规则或删除测试。
- 不要在没有需求时改变 Ant Design 或 AG Grid 的原有行为。
- 不要新增组件后忘记公开导出、文档、样式入口、测试和变更记录。
- 不要只看一种主题和一种状态。

## 学完本页，你应该会什么

- 能找到一个组件从实现、样式、文档到公开导出的完整链路。
- 能按步骤修改已有组件，并控制影响范围。
- 能建立一个新组件的目录、类型、入口、样式、文档和测试。
- 知道 ref、主题、公开导出和生成文件是最容易遗漏的地方。

下一章：[测试与质量检查](/training/06-test-and-quality)。
