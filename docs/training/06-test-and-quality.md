---
group: 新人培训
title: 测试与质量检查
order: 6
---

# 测试与质量检查

“页面上看起来没问题”只是第一步。提交组件库代码前，还要检查类型、行为、代码规则、构建产物和文档站。

## 推荐的检查顺序

| 顺序 | 命令 | 主要检查什么 |
| --- | --- | --- |
| 1 | `./node_modules/.bin/tsc -b --pretty false` | TypeScript 类型 |
| 2 | `npm run test` & `npm run test:ct` | 组件逻辑 (Vitest) 与 真实 UI 交互 (Playwright) |
| 3 | `npm run lint` | ESLint 代码规则 |
| 4 | `npm run build` | 组件库能否生成 JS、CSS 和类型声明 |
| 5 | `npm run verify:exports` | 发布子路径的类型、ESM 和 CommonJS 导出 |
| 6 | `npm run docs:build` | Dumi 文档与示例能否构建 |

如果只改了一行，也应至少检查与这行代码有关的项目。新增组件、修改公开 API、主题或构建配置时，建议六项全部检查。

## 1. 类型检查

仓库目前没有单独的 `typecheck` npm script，可以直接运行本地 TypeScript：

```shell
./node_modules/.bin/tsc -b --pretty false
```

也可以运行：

```shell
npm run build
```

因为 `build` 的第一步就是 `tsc -b`。区别是 `build` 通过类型检查后还会继续生成组件库产物。

项目开启了严格类型检查，并会检查未使用的变量和参数。常见问题包括：

- 只作为类型使用的内容没有用 `import type`。
- 新增的变量、参数或导入没有使用。
- ref 类型与实际组件不一致。
- 新属性没有从 Props 中声明。
- 受控值可能是 `undefined`，但代码只按字符串处理。
- 为了省事写了 `any`，导致后续 lint 报错。

类型检查没有输出并以成功状态结束，才表示通过。

## 2. 自动化测试：Vitest 与 Playwright

在咱们的项目里，你会发现有两个测试命令和两套测试框架：**Vitest** 和 **Playwright**。
对刚接触的新人来说，可能第一反应是：“为什么要有两套？它们是互相替代的关系吗？”

**答案是：它们绝不是平替，而是“双剑合璧”的互补关系！** 它们各自负责测试组件的不同层面。

### 两者的分工与区别

为了方便理解，我们可以打个比方：
*   **Vitest** 就像是“质检员看图纸”。它在后台的虚拟环境里飞速运行，主要检查组件的**内部逻辑算得对不对**。
*   **Playwright** 就像是“体验员用成品”。它会真的打开一个 Chrome 浏览器，把组件真实渲染出来，主要检查组件**长得对不对、能不能点**。

| 特性 | Vitest (`npm run test`) | Playwright CT (`npm run test:ct`) |
| :--- | :--- | :--- |
| **运行环境** | Node.js (基于 jsdom，虚拟环境，无真实渲染) | 真实的 Chromium 浏览器 |
| **强项** | 极快！适合测纯数据逻辑、工具函数、基础 Props。 | 真实！能测出真实的宽高尺寸、颜色、复杂的 UI 交互。 |
| **弱点** | 测不了真实的 CSS 样式，测不了元素是否被遮挡。 | 运行速度相对较慢，需要安装真实浏览器内核。 |
| **文件位置** | 和源码放在一起，如 `src/.../Button.test.tsx` | 统一存放在 `tests/ct/` 目录下，如 `button.spec.tsx` |

### 举个例子：以 Button 组件为例

假设我们现在写了一个 `<Button>` 组件。针对这个组件，两边分别会怎么写测试呢？

#### 场景 A：用 Vitest 测“基础逻辑”
比如，我们要测传入 `disabled` 属性时，组件是不是真的有禁用标识。
*(文件位置通常在：`src/components/button/Button.test.tsx`)*
```tsx | pure
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import Button from './index';

it('传入 disabled 属性时，按钮应该是禁用状态', () => {
  render(<Button disabled>点击我</Button>);
  // Vitest 可以在代码层面飞速检查 DOM 节点上有没有 disabled 属性
  expect(screen.getByRole('button')).toBeDisabled();
});
```

#### 场景 B：用 Playwright 测“真实样式和交互”
比如，我们要测按钮在某种状态下，宽度必须是 `100px`，且鼠标放上去要能有背景色变化。Vitest 是算不出真实宽度的，这时候就要 Playwright 出马了。
*(文件位置通常在：`tests/ct/button.spec.tsx`)*
```tsx | pure
import { test, expect } from '@playwright/experimental-ct-react';
import Button from '../../src/components/button';

test('按钮渲染出的真实宽度应为 100px，且悬停有颜色变化', async ({ mount, page }) => {
  // Playwright 会把组件真实挂载到浏览器页面上
  const component = await mount(<Button width={100}>点击我</Button>);
  
  // 1. 测真实的像素宽度
  const box = await component.boundingBox();
  expect(box?.width).toBeCloseTo(100, 0);

  // 2. 模拟真实的鼠标悬停，测真实的 CSS 颜色
  await component.hover();
  const color = await component.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(color).not.toBe('rgba(0, 0, 0, 0)');
});
```

### 日常开发中我该怎么选？

*   **写 Vitest (`npm run test`)**：如果你今天写了一个数据过滤的方法，或者加了个简单的逻辑判断，用它来享受秒级反馈。
    *   *注意：测试输出里可能会有 `Could not parse CSS stylesheet` 的提示，这是 jsdom 解析不了现代 CSS 的正常现象，看最终的 `Tests ... passed` 即可。*
*   **写 Playwright (`npm run test:ct`)**：如果你今天改了组件的 **CSS 样式**、加了复杂的动画、或者写了个高度依赖浏览器尺寸的表格 (`Table`)，一定要写 Playwright 测试。
    *   **可视化调试神器**：在本地开发时，强烈推荐运行 `npx playwright test -c playwright-ct.config.ts --ui`。它会弹出一个界面，让你像看电影一样回放测试过程，找 Bug 神器！
    *   *注意：首次运行可能需要执行 `npx playwright install chromium` 来下载浏览器内核。*

## 3. ESLint

运行：

```shell
npm run lint
```

这条命令实际执行 `eslint .`，会扫描整个仓库中匹配的 TypeScript 和 TSX 文件。

### 当前已知情况

当前全量 lint 还不能通过，问题来源包括：

- `.dumi/tmp-production/` 等 Dumi 生成代码。
- 大量组件 demo。
- `.dumi` 自定义主题代码。
- 一部分现有组件源码。

当前 ESLint 只全局忽略了 `dist`，没有忽略上述 Dumi 生成目录。常见规则错误包括 `no-explicit-any`、空接口、React Hooks 和 Fast Refresh 规则。

问题数量会随着生成目录和代码变化而改变，所以不要把某次运行的数字当成固定目标。

### 全量 lint 不通过时怎么办

不要假装它通过，也不要一次提交大量与需求无关的历史修复。正确做法是：

1. 运行一次全量 lint，保存或查看结果。
2. 确认自己修改的文件是否出现了新错误。
3. 对本次组件目录单独运行 ESLint，例如：

   ```shell
   npx eslint src/components/tag
   ```

4. 修复自己引入的问题。
5. 在提交说明中如实写明：全量 lint 仍受哪些既有问题影响。

定向 lint 只能帮助确认本次文件，不能代替全量 lint。后续如果团队统一整理 ESLint 配置和历史问题，再以新的全量基线为准。

### 新代码特别容易触发的规则

- 不要使用 `any`。
- Props 完全等同父类型时，使用 `type` 别名，不要写空接口。
- 不要留下未使用的导入、变量和参数。
- Hooks 只能在组件或自定义 Hook 顶层调用。
- 不要为了让 lint 变绿而对整个文件使用大范围禁用。

## 4. 组件库构建

运行：

```shell
npm run build
```

它按顺序执行：

```text
tsc -b
  ↓
vite build
  ↓
生成 gzd-lib/
```

构建会生成 ES Module、CommonJS、CSS 和 TypeScript 声明。正常情况下至少能看到：

```text
gzd-lib/index.js
gzd-lib/index.cjs
gzd-lib/index.d.ts
gzd-lib/gzd.css
gzd-lib/gzd-table/index.js
gzd-lib/gzd-table/index.cjs
gzd-lib/gzd-table/index.d.ts
```

`gzd-lib/` 是生成目录，已经被 Git 忽略。发现构建问题时要修改源码或构建配置，不要直接修生成文件。

构建通过能说明：

- TypeScript 项目能通过。
- `src/index.ts` 根入口和 `src/gzd-table/index.ts` 子路径入口能打包。
- 类型声明能生成。
- Less 能汇总为发布 CSS。

构建通过不能说明：

- 每个交互都正确。
- 四套主题视觉都正确。
- Dumi 文档一定能构建。
- 业务项目一定已经导入 CSS。

所以仍然需要测试、人工预览和文档构建。

### 验证 `gzd-table` 发布入口

先完成构建，再运行：

```shell
npm run verify:exports
```

它会使用最小消费者代码检查泛型类型导入，并验证 `package.json#exports`、类型声明、ESM 和 CommonJS 产物。`prepack` 会依次执行 `build` 和 `verify:exports`。

## 5. Dumi 文档构建

运行：

```shell
npm run docs:build
```

执行前会自动运行 `docs:sync`，把根目录 `CHANGELOG.md` 同步成文档站使用的 `docs/CHANGELOG.md`，然后 Dumi 才开始构建。

文档构建主要发现：

- Markdown 或 frontmatter 写法错误。
- demo 导入了不存在的组件。
- 组件忘记从 `src/index.ts` 公开导出。
- TSX 示例有类型或语法问题。
- 部分文档路由配置错误。

普通 Markdown 链接即使写错，也不一定会让构建失败。因此修改导航或章节链接后，还要在文档站中实际点击检查。

输出目录是 `gzd-docs/`，它也是生成目录，不要手动编辑。

## 不同改动应该重点测什么

| 改动类型 | 除通用检查外，还要重点做什么 |
| --- | --- |
| 修改默认值 | 测未传属性和显式传属性两种情况 |
| 修改受控组件 | 测 `value`、`defaultValue`、`onChange` |
| 修改 ref | 实际读取 ref，确认类型和对象正确 |
| 修改主题样式 | 查看四套主题、hover、active、disabled |
| 修改弹层组件 | 查看弹层容器、遮罩、滚动和主题变量 |
| 新增子组件 | 测 `Component.SubComponent` 和类型导出 |
| 修复 bug | 先写能复现 bug 的测试，再确认修复后通过 |
| 修改 Token | 导入或重新生成 Token 与文档，核对 diff 并运行 [Token 快速校验](/training/04-theme-and-tokens#导入后的检查)；发版前完成组件库和文档站构建 |
| 修改公开导出 | 从 `gzd`、`gzd/gzd-table` 和构建后的真实包入口验证导入；运行 `npm run verify:exports` |

## 提交前的最小人工检查

自动化检查之外，再做一次人工预览：

1. 在 Dumi 中打开被修改的组件。
2. 操作最常用的交互。
3. 查看空值、禁用、加载、错误等相关状态。
4. 切换四套主题。
5. 打开浏览器控制台，确认没有新增错误。
6. 如果组件有弹层，确认弹层位置和主题正常。
7. 如果改了 ref，在一个小 demo 中实际调用它。

## 怎样汇报检查结果

不要只写“测试过了”。推荐写清楚：

```text
- TypeScript：通过
- Vitest：发现预期的测试文件和用例，全部通过（填写本次实际数量）
- ESLint：全量未通过；本次修改文件无新增错误，既有问题来自……
- 组件库构建：通过
- Dumi 构建：通过
- 人工检查：gold/blue 的 light/dark 均已查看
```

这样评审者能快速判断哪些结果是自动验证，哪些是人工确认，哪些仍有已知限制。

## 学完本页，你应该会什么

- 知道类型、测试、lint、组件库构建和文档构建分别检查什么。
- 能正确判断 Vitest 的 CSS 提示和最终结果。
- 知道当前全量 lint 的真实状态，以及如何保证自己不增加新问题。
- 能根据改动类型选择必要的回归场景。

下一章：[构建、版本与发布](/training/07-build-and-release)。
