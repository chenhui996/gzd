# gzd Table 组件全方位深度剖析 (Deep Dive)

本文档旨在为研发人员提供 `Table` 组件的**上帝视角**，让你能够完完全全掌控这个基于 AG Grid 深度定制的企业级表格组件。

---

## 1. 宏观定位：它到底是个什么东西？

gzd 的 `Table` 并不是从零手写的，也不是对 Ant Design Table 的简单魔改。
**它是一个基于业界最强表格库 `ag-grid-react` (v36.0.1) 的“重型装甲”封装。**

在保留了 AG Grid 几乎所有原生能力（包括企业版特性）的前提下，它在外部包裹了一层“符合公司业务规范”的壳，解决了原生 AG Grid 在国内业务中直接使用时的痛点（如默认英文、样式不符、默认配置繁琐等）。

---

## 2. 封装解析：代码漫游 (Code Roaming)

核心封装代码位于：`src/components/table/Table.tsx`。我们来看看数据和链路是怎么流转的：

### 2.1 壳的结构
组件的最外层并不是直接返回 `AgGridReact`，而是：
```tsx
<AgGridProvider modules={ENTERPRISE_MODULES} licenseKey={AG_GRID_ENTERPRISE_LICENSE}>
  <AgGridReact ref={ref} {...props} />
</AgGridProvider>
```
**解读**：它默认注册了 `AllEnterpriseModule`（全量企业级模块）并注入了 License。这意味着使用者无需再关心如何破解或激活 AG Grid，直接开箱即用（支持树形数据、行分组、高级筛选等企业功能）。

### 2.2 配置合并的“三级跳” (优先级)
在 `Table.tsx` 中，有一个非常优雅的配置合并逻辑（通过 `useMemo` 实现）：
1. **最高优先级**：调用方直接传给 `<Table>` 的顶层 props (如 `props.pagination`)。
2. **中优先级**：调用方通过 `gridOptions` 对象传入的配置。
3. **最低优先级**：gzd 内置的 `DEFAULT_GRID_OPTIONS` 和 `DEFAULT_COL_DEF`。

### 2.3 gzd 到底改了哪些默认值？
为了更贴合咱们的业务，封装层强行修改了以下原生默认行为：
* **表头菜单**：默认 `suppressHeaderMenuButton: true`（隐藏了原生的列头菜单按钮，界面更清爽）。
* **分页样式**：如果开启分页，强行将 `paginationPanels` 改为 `["rowSummary", "pageSize", "pageSummary"]`，去掉了原生的当前区间，改成了极简风格。
* **默认交互**：`suppressCellFocus: true`（关闭单元格聚焦蓝框）、`enableCellTextSelection: true`（允许鼠标划选复制文本，AG Grid 默认是禁用的！）。
* **中文支持**：强制合并了 `AG_GRID_LOCALE_CN`，所有自带的过滤、分页提示全变成了中文。
* **空状态**：默认注入了定制的 `noRowsOverlayComponent`，居中显示“暂无符合条件的数据”。

### 2.4 主题链路 (Theme Flow)
1. 从 `GZDConfigContext` 拿到当前的 `themeMode` (例如 `gold-dark`)。
2. 转换为对应的 AG Grid 主题对象 (`goldDarkTableTheme`)。
3. 作为 `theme` 属性传给 `AgGridReact`。这使得表格的明暗色能够与组件库的 ConfigProvider 完美联动。

---

## 3. TS 类型与导入导出策略 (Export Strategy)

这是这个组件库设计的**非常亮眼**的一个工程化亮点：**双入口策略**。

### 3.1 为什么要有双入口？
如果使用者需要定义列，他们需要 `ColDef` 类型。如果他们直接 `import { ColDef } from 'ag-grid-community'`，会导致业务项目的依赖极其混乱，甚至可能出现版本冲突。

### 3.2 怎么解决的？
* **入口一：主包入口 (`gzd`)**
  使用者只从这里导入 React 组件本身。
  ```tsx
  import { Table } from 'gzd';
  ```
* **入口二：子包扩展入口 (`gzd/gzd-table`)**
  源码在 `src/gzd-table/index.ts` 中，**它重新导出 (re-export) 了 AG Grid 所有的东西**！
  ```ts
  export * from "ag-grid-community";
  export * from "ag-grid-enterprise";
  export * from "ag-grid-react";
  ```
  使用者在写业务时，所有的类型和底层 API 都从这里拿：
  ```tsx
  import type { ColDef, GridApi } from 'gzd/gzd-table';
  ```
**评价**：极其规范。完美隔离了第三方库，把 AG Grid 变成了组件库的内部实现细节（虽然通过逃生舱暴露了，但收口在了一个地方）。

---

## 4. 文档与 Demo 建设情况

文档位于 `src/components/table/index.md`，使用 Dumi 编写。

### 4.1 质量评估：优秀
文档写得非常详尽，不仅有 API 列表，还特别写了：
* **“何时使用”**：明确指出了只读用 `Descriptions`，复杂交互用 `Table`。
* **“配置优先级”**：教用户怎么传参。
* **“图表约定”**：甚至跨界指导了 ECharts 怎么和 Table 的 Token 配合。
* **“FAQ”**：解答了“为什么高度为0”、“为什么没有筛选按钮”、“为什么刷新后选中态丢失”等极其经典的新手坑。

### 4.2 Demo 覆盖率：极高
目前拥有 **31 个** 真实可运行的 Demo (`src/components/table/demo/*.tsx`)，覆盖了：
* 基础布局、固定行列、自动高度。
* 多选、自定义选择、单列/多列排序、拖拽排序。
* 树形数据 (Tree Data)、嵌套子表格、行列合并。
* 虚拟滚动、可编辑单元格、自定义空状态。
**结论**：用例完全覆盖了日常 B 端复杂中后台的 99% 场景，新人照抄 Demo 就能干活。

---

## 5. 整体评价与总结

1. **封装深度**：恰到好处。没有去造轮子重写 AG Grid，也没有把它包得太死（保留了 `gridOptions` 和 `ref` 的逃生舱）。
2. **企业级就绪**：内置了 Enterprise License 和 Module，意味着性能和高级特性（虚拟渲染、树形等）处于前端表格领域的最高水平。
3. **工程化成熟**：`gzd-table` 的独立导出设计、完善的 TypeScript 类型转发、细致的 Dumi 文档和 FAQ，展现了极高的组件库维护水准。

### 给开发者的两点重要提醒 (Takeaways)：
1. **高度问题**：因为底层是 AG Grid，`domLayout="normal"` 时父容器必须有高度！不要再问“为什么我的表格看不见”了。
2. **唯一 Key**：务必传递 `getRowId={({ data }) => data.id}`，否则数据一刷新，用户的勾选和展开状态就会瞬间丢失。
