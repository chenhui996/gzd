---
name: "antd-wrapper"
description: "封装或重构 Ant Design v6 组件为 gzd 风格。在用户要求封装新组件或重构现有 antd 组件时立即调用。"
---

# Ant Design 组件二次封装规范 (gzd)

当你被要求在 `gzd` 组件库中封装或重构一个新的 Ant Design 组件时，**必须**严格遵循以下规范和模板。

## 核心设计原则

1. **纯净透传 (Pure Pass-through)**：不要在组件内部写死任何样式或包裹 `ConfigProvider`。样式由全局的 Design Tokens 驱动。
2. **类型对齐 (Interface Inheritance)**：直接继承 Antd 的 Props，保持与官方 API 100% 同步，不要手动罗列属性。
3. **Ref 转发策略 (Ref Forwarding)**：
   - 默认使用 `forwardRef` 暴露 DOM 节点或实例。
   - **TypeScript 报错驱动**：如果强行使用 `forwardRef` 导致 TS 报错（如 `Property 'ref' does not exist`），说明原组件不支持 ref。
   - **DOM 结构敏感度判定**：对于不支持 ref 的组件，**严禁无脑包裹 `<div ref={ref}>`**，因为这会破坏原本的 Flex/Grid/List 等布局层级（如 `Card.Grid`, `Col`, `List.Item`）。此时必须直接降级为普通 `React.FC` 函数组件原样透传。
   - **仅独立块级组件例外**：只有当组件完全独立且业务强依赖 ref 时（如孤立的 `Divider`），才考虑外层包裹 `<div>`。
4. **组件标识 (displayName)**：强制设置 `displayName` 以优化 React DevTools 调试体验。
5. **点语法挂载 (Compound Components)**：如果组件有子组件（如 `Input.Password` 或 `Checkbox.Group`），**严禁直接挂载 Antd 原生的子组件**。必须单独为其创建封装文件（如 `Group.tsx`），继承原生属性并暴露 ref，然后在主组件的 `index.tsx` 中通过交叉类型和属性赋值挂载我们自定义的子组件。
6. **文档收敛与自动化对齐 (Automated Doc Alignment)**：在编写或更新 `.md` 组件文档时，**严禁依赖大脑记忆中的用例，必须通过编写 Node 脚本直接拉取 GitHub 最新源码（Ant Design `master` 分支）进行 1:1 复刻**。
   - **抓取策略**：通过 GitHub API 获取 `components/[组件名]/demo/` 目录树，全量拉取对应的 `.tsx` 和 `.md`。
   - **标题映射**：必须从 `components/[组件名]/index.zh-CN.md` 中正则提取 `<code src="./demo/xxx.tsx">中文标题</code>`，以确保使用官方标准中文标题。
   - **智能替换**：将代码中的 `import { [已封装的组件] } from 'antd'` 自动正则替换为 `from 'gzd'`，其余未封装的组件保留从 `antd` 引入。
   - **过滤黑名单**：严格过滤 `_semantic.tsx`, `semantic-dom.md`, `component-token.md` 等与底层 Token/Semantic DOM 强相关的用例。
   - **API 过滤**：抓取 `index.zh-CN.md` 中的 API 表格时，剔除“版本 (Version)”列及 Semantic DOM 段落。

## 标准执行流程 (SOP)

每次封装一个全新组件，**必须**严格遵循以下五个步骤，不得跳过：

1. **Phase 1: 组件封装 (`src/components/[name]`)**
   - 编写 `[Name].tsx`（优先使用 `forwardRef` 试探，若 TS 报错则降级为 `React.FC`）。
   - 如果有子组件，拆分单独文件并挂载。
   - 在同目录下编写 `index.tsx` 进行聚合与导出。
2. **Phase 2: 全局导出 (`src/index.ts`)**
   - 在组件库统一入口增加组件和 Props 类型的导出。
3. **Phase 3: 自动化抓取 (`scripts/fetch-[name].cjs`)**
   - 编写用于从 GitHub 获取 Antd 官方 Markdown 和 Demo 源码的临时 Node.js 脚本。
   - 脚本要求（极其关键）：
     - 使用 `https.get` 时必须带上 `User-Agent: Mozilla/5.0`。
     - 必须实现 **3次网络重试 (Retry) 机制**，以防超时。
     - 必须解析原 `index.zh-CN.md` 中形如 `<code src="..." iframe="300">` 的 iframe 参数。并在拼接内联 `tsx` 时，向文件顶部注入 `/**\n * iframe: 300\n */` 的 Frontmatter 注释，否则会撑爆文档全局样式（如 Popover 贴边偏移演示）。
     - 智能替换 `import { X, Y } from 'antd'`：**仅替换我们已经在 gzd 里封装过的组件**（如 Button, Tooltip, Space 等）为 `from 'gzd'`，其他仍从 `'antd'` 导入。
4. **Phase 4: 生成与清理**
   - 运行脚本 `node scripts/fetch-[name].cjs`，确认 `index.md` 成功生成。
   - **立即删除临时脚本文件**：`rm scripts/fetch-[name].cjs`，保持项目纯净。
5. **Phase 5: 构建验证**
   - 运行 `npm run build`。
   - 解决所有 TS 类型错误（特别是未使用 `React` 变量的 `TS6133` 警告）。

## 标准封装模板

假设我们要封装一个名为 `Example` 的组件：

```tsx
import React, { forwardRef } from "react";
import { Example as AntdExample, type ExampleProps } from "antd";

// 1. 继承官方 Props
export interface GZDExampleProps extends ExampleProps {}

// 2. 使用 forwardRef，并正确标注 HTMLElement 的类型
const Example = forwardRef<HTMLDivElement, GZDExampleProps>((props, ref) => {
  const { children, ...restProps } = props;

  // 3. 纯净透传属性和 ref
  return (
    <AntdExample ref={ref} {...restProps}>
      {children}
    </AntdExample>
  );
});

// 4. 设置 displayName
Example.displayName = "GZDExample";

export default Example;
```

## 复合组件 (点语法) 挂载模板

如果需要挂载子组件（例如 `Example.Sub`）：

```tsx
import React from "react";
import Sub from "./Sub";
import Example, { type GZDExampleProps } from "./Example";

export type { GZDExampleProps } from "./Example";

// 1. 获取原 forwardRef 组件的类型，并交叉子组件类型
export type GZDExampleComponent = typeof Example & {
  Sub: typeof Sub;
};

// 2. 类型断言
const TransExample = Example as GZDExampleComponent;

// 3. 挂载子组件
TransExample.Sub = Sub;

export default TransExample;
```

## 常见坑点与解决

- **组件不支持 Ref (如 Card.Grid, Divider 等)**：
  如果 Antd 原生组件不支持 ref 且 TypeScript 报错 `类型“IntrinsicAttributes & Props”上不存在属性“ref”`，**优先降级为 `React.FC` 进行纯透传**，千万不要为了凑 ref 而包一个 div，以免破坏布局（尤其是 Grid / Flex 相关的组件）：
  ```tsx
  const Grid: React.FC<GZDCardGridProps> = (props) => {
    return <AntdCard.Grid {...props} />;
  };
  ```
  如果是非常独立的块级组件（如 `Divider`），且业务强烈要求拿到 DOM，才勉强考虑在外层包裹 `<div ref={ref}>`。
- **默认属性拦截**：
  如果有强业务需求，可以在解构时赋予默认值，例如 `const { type = 'primary', ...restProps } = props;`。
