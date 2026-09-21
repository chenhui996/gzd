---
group: 数据展示
title: Table 表格
description: 展示和操作结构化行列数据。
---

# Table 表格

Table 用于展示和操作结构化的行列数据。gzd 的 `Table` 基于 `ag-grid-react@36.0.1` 封装。

## 何时使用

- 需要以清晰的行列结构展示较多同类数据时。
- 需要对数据进行排序、筛选、分页、选择、编辑或远程加载时。
- 需要固定表头或关键列、虚拟滚动、树形数据等复杂表格能力时。

## 如何使用

最小用法：
- 列定义 `columnDefs` 和数据 `rowData`。
- 建议始终通过 `getRowId` 返回稳定且唯一的业务主键，以便在刷新数据后正确保留选择、展开和编辑状态。

```tsx | pure
import { Table } from 'gzd';
import type { ColDef } from 'gzd/gzd-table';

interface User {
  id: string;
  name: string;
  age: number;
}

const columnDefs: ColDef<User>[] = [
  { headerName: '姓名', field: 'name', flex: 1 },
  { headerName: '年龄', field: 'age', width: 100 },
];

const rowData: User[] = [
  { id: '1', name: 'John Brown', age: 32 },
  { id: '2', name: 'Jim Green', age: 42 },
];

export default () => (
  <div style={{ height: 320 }}>
    <Table<User>
      columnDefs={columnDefs}
      rowData={rowData}
      getRowId={({ data }) => data.id}
    />
  </div>
);
```

默认布局需要父容器提供明确高度。数据量较少且希望表格随内容撑开时，可以传入 `domLayout="autoHeight"`；大数据量场景应使用固定高度，以保留行虚拟化带来的性能优势。

## 相关推荐

- [AG Grid Modules](https://www.ag-grid.com/react-data-grid/modules/)：查看 Community 与 Enterprise 功能对应的模块。
- [ConfigProvider 全局化配置](/components/config-provider)：为 Table 提供 `themeMode` 和运行时主题变量。
- [Empty 空状态](/components/empty) 与 [Tooltip 文字提示](/components/tooltip)：用于自定义无数据反馈和截断内容提示。
- [AG Grid Grid Options](https://www.ag-grid.com/react-data-grid/grid-interface/)：查看完整 Grid 配置方式。
- [AG Grid Column Definitions](https://www.ag-grid.com/react-data-grid/column-properties/)：查看列定义支持的全部属性。
- [AG Grid Grid API](https://www.ag-grid.com/react-data-grid/grid-api/)：查看通过 ref 操作表格实例的方法。

## 代码演示

以下示例按实际用途组织。示例描述会同时说明可观察行为和对应的关键配置。

<code src="./demo/busniess-basic.tsx">Table 基线</code>
<code src="./demo/checkbox-column.tsx">首列 Checkbox</code>
<code src="./demo/row-grouping.tsx">行分组与聚合</code>
<code src="./demo/floating-filters.tsx">悬浮过滤器</code>
<!-- <code src="./demo/header-grouping.tsx">合并表头 (多级分组)</code> -->

<!-- ### 基础与布局

<code src="./demo/basic.tsx">基础表格</code>
<code src="./demo/pagination.tsx">分页</code>
<code src="./demo/compact.tsx">紧凑型</code>
<code src="./demo/bordered.tsx">带边框</code>
<code src="./demo/fixed-header.tsx">固定表头</code>
<code src="./demo/fixed-columns.tsx">固定列</code>
<code src="./demo/fixed-header-columns.tsx">固定头和列</code>
<code src="./demo/auto-height.tsx">自动高度</code>

### 选择、筛选与数据加载

<code src="./demo/row-selection.tsx">多选</code>
<code src="./demo/custom-selection.tsx">自定义选择项</code>
<code src="./demo/filter-sort.tsx">筛选和排序</code>
<code src="./demo/filter-search.tsx">自定义筛选的搜索</code>
<code src="./demo/multiple-sorter.tsx">多列排序</code>
<code src="./demo/controlled-filter-sort.tsx">可控的筛选和排序</code>
<code src="./demo/custom-filter-menu.tsx">自定义筛选菜单</code>
<code src="./demo/remote-data.tsx">远程加载数据</code>

### 层级、编辑与拖拽

<code src="./demo/expandable.tsx">可展开</code>
<code src="./demo/special-column-order.tsx">特殊列排序</code>
<code src="./demo/tree-data.tsx">树形数据展示</code>
<code src="./demo/nested-table.tsx">嵌套子表格</code>
<code src="./demo/editable-cell.tsx">可编辑单元格</code>
<code src="./demo/editable-row.tsx">可编辑行</code>
<code src="./demo/drag-sorting.tsx">拖拽排序</code>
<code src="./demo/column-drag-sorting.tsx">列拖拽排序</code>
<code src="./demo/drag-handle-column.tsx">拖拽手柄列</code>

### 数据展示与样式定制

<code src="./demo/merged-cells.tsx">行列合并</code>
<code src="./demo/hidden-columns.tsx">隐藏列</code>
<code src="./demo/grouped-header.tsx">表头分组</code>
<code src="./demo/ellipsis.tsx">单元格自动省略</code>
<code src="./demo/default-col-def.tsx">统一列配置</code>
<code src="./demo/ellipsis-tooltip.tsx">自定义单元格省略提示</code>
<code src="./demo/custom-empty.tsx">自定义空状态</code>
<code src="./demo/summary.tsx">总结栏</code>
<code src="./demo/virtual-list.tsx">虚拟列表</code>
<code src="./demo/responsive.tsx">响应式</code>
<code src="./demo/dynamic-properties.tsx">动态控制表格属性</code>
<code src="./demo/semantic-styles.tsx">自定义语义结构的样式和类</code> -->


<!-- <code src="./demo/pivoting.tsx">数据透视</code>
<code src="./demo/context-menu.tsx">自定义右键菜单</code>
<code src="./demo/cell-events.tsx">状态与事件拦截</code>
<code src="./demo/clipboard-operations.tsx">导入与导出 (剪贴板控制)</code> -->

## API 概览

> **组件定位说明**：`Table` 组件在底层基于业界顶级的 **AG Grid 36** 构建。
> 
> **⚠️ 核心能力透传承诺：** 
> 作为底座基建，`gzd` 的 `Table` 组件**100% 继承并透传**了 AG Grid (React 版) 的所有能力！
> 为了方便查阅，我们严格按照 **AG Grid 官方文档** 的功能分类（Core Features / Advanced Features）对全量 API 进行了重新整理。你需要的 `suppressMovable` 等配置均在其中，绝无遗漏。

## 列配置 (columnDefs)

> 个体： 列配置 (Column Properties)

### Columns (列) 

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `autoHeaderHeight` | 自动表头高度。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `colDef` | 列Def。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ColDef&lt;TData, TValue&gt;</code> | - |
| `colSpan` | 列跨列/行。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ColSpanFunc&lt;TData, TValue&gt;</code> | - |
| `column` | 列。用于精细化配置该功能的展现形式或执行逻辑。 | <code>Column&lt;TValue&gt;</code> | - |
| `columnChooserParams` | 列选择器参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ColumnChooserParams</code> | - |
| `columnGroup` | 列分组。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ColumnGroup \| ProvidedColumnGroup \| null</code> | - |
| `columnGroupShow` | 列分组显示。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ColumnGroupShowType</code> | - |
| `columnLayout` | 列布局。用于精细化配置该功能的展现形式或执行逻辑。 | <code>(ColDef \| ColGroupDef)[]</code> | - |
| `contractColumnSelection` | 收起列选择。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `flex` | 弹性自适应比例。类似于 CSS 的 flex-grow，根据比例自动分配表格的剩余水平空间。 | <code>number \| null</code> | - |
| `headerCheckboxSelection` | 是否显示表头全选复选框。设置为 true 时，该列表头会渲染一个用于全选/反选所有行的 Checkbox。 | <code>boolean \| HeaderCheckboxSelectionCallback&lt;TData, TValue&gt;</code> | `false` |
| `headerCheckboxSelectionCurrentPageOnly` | 表头复选框选择当前页仅。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `headerCheckboxSelectionFilteredOnly` | 表头复选框选择过滤后的仅。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `headerClass` | 表头 CSS 类名。用于定制该列表头的样式，支持字符串、数组或回调函数。 | <code>HeaderClass&lt;TData, TValue&gt;</code> | - |
| `headerComponent` | 组件：自定义 表头组件。通过注入自定义组件来完全接管该区域的 DOM 结构与样式。 | <code>any</code> | - |
| `headerComponentParams` | 表头组件参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `headerGroupComponent` | 组件：自定义 表头分组组件。通过注入自定义组件来完全接管该区域的 DOM 结构与样式。 | <code>any</code> | - |
| `headerGroupComponentParams` | 表头分组组件参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `headerName` | 表头名称。在表头中展示的文本内容，如果不提供则默认根据 field 自动生成。 | <code>string</code> | - |
| `headerRowIndex` | 表头行索引。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `headerStyle` | 表头样式。用于精细化配置该功能的展现形式或执行逻辑。 | <code>HeaderStyle \| HeaderStyleFunc&lt;TData, TValue&gt;</code> | - |
| `headerTooltip` | 表头提示。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | - |
| `headerTooltipValueGetter` | 回调函数：表头提示值获取。当直接绑定 field 无法满足要求时，提供动态计算并提取数据的逻辑。 | <code>HeaderTooltipValueGetterFunc&lt;TData, TValue&gt;</code> | - |
| `headerValueGetter` | 回调函数：表头值获取。当直接绑定 field 无法满足要求时，提供动态计算并提取数据的逻辑。 | <code>string \| HeaderValueGetterFunc&lt;TData, TValue&gt;</code> | - |
| `initialFlex` | 初始弹性。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `initialPinned` | 初始固定。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean \| 'left' \| 'right'</code> | `false` |
| `initialWidth` | 初始宽度。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `lockPinned` | 锁定固定。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `maxWidth` | 列的最大宽度。在拖拽调整列宽或自适应宽度时，限制列宽不能大于此值。 | <code>number</code> | - |
| `minWidth` | 列的最小宽度。在拖拽调整列宽或自适应宽度时，限制列宽不能小于此值。 | <code>number</code> | **`60`** |
| `pinned` | 固定列位置。可选 "left" 或 "right"，将该列冻结在表格的左侧或右侧，不随水平滚动条滚动。 | <code>boolean \| 'left' \| 'right' \| null</code> | `false` | "right"） |
| `pivotResultColumn` | 透视结果列。用于精细化配置该功能的展现形式或执行逻辑。 | <code>Column</code> | - |
| `pivotTotalColumnIds` | 透视Total列Ids。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string[]</code> | - |
| `pivotValueColumn` | 透视值列。用于精细化配置该功能的展现形式或执行逻辑。 | <code>Column \| null</code> | - |
| `providedColumnGroup` | provided列分组。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ProvidedColumnGroup \| null</code> | - |
| `rowSpan` | 行跨列/行。用于精细化配置该功能的展现形式或执行逻辑。 | <code>RowSpanFunc&lt;TData, TValue&gt;</code> | - |
| `spanRows` | 跨列/行Rows。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean \| SpanRowsFunc&lt;TData, TValue&gt;</code> | `false` |
| `suppressAutoSize` | 禁用 禁用自动大小。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressColumnExpandAll` | 禁用 禁用列展开All。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressColumnFilter` | 禁用 禁用列筛选。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressColumnSelectAll` | 禁用 禁用列选择All。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressColumnsToolPanel` | 禁用 禁用Columns工具面板。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressHeaderContextMenu` | 禁用 禁用表头上下文菜单。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressHeaderFilterButton` | 禁用 禁用表头筛选Button。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressHeaderMenuButton` | 禁用 禁用表头菜单Button。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressMovable` | 禁用列移动。设置为 true 时，将禁止用户通过拖拽表头来改变该列的排列顺序。 | <code>boolean</code> | **`true`** |
| `suppressSpanHeaderHeight` | 禁用 禁用跨列/行表头高度。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `width` | 列的初始宽度。定义该列渲染时的绝对宽度（以像素为单位）。 | <code>number</code> | - |
| `wrapHeaderText` | wrap表头文本。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |




### Rows (行)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `autoHeight` | 自动撑开高度。设置为 true 时，单元格高度将根据其内部文本或组件的实际内容高度动态撑开。 | <code>boolean</code> | `false` |
| `rowDrag` | 行拖拽。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean \| RowDragCallback&lt;TData, TValue&gt;</code> | `false` |
| `rowDragText` | 行拖拽文本。用于精细化配置该功能的展现形式或执行逻辑。 | <code>RowDragTextFunc</code> | - |
| `rowNode` | 行节点。用于精细化配置该功能的展现形式或执行逻辑。 | <code>IRowNode&lt;TData&gt;</code> | - |




### Cells (单元格)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `cellAriaRole` | 单元格AriaRole。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | `'gridcell'` |
| `cellClass` | 单元格 CSS 类名。可以是一个字符串、数组，或返回类名的回调函数，用于定制特定单元格的样式。 | <code>string \| string[] \| CellClassFunc&lt;TData, TValue&gt;</code> | - |
| `cellClassRules` | 单元格类名Rules。用于精细化配置该功能的展现形式或执行逻辑。 | <code>CellClassRules&lt;TData, TValue&gt;</code> | - |
| `cellDataType` | 单元格数据类型。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean \| string</code> | `true` |
| `cellEditor` | 组件：自定义单元格编辑器。传入一个 React 组件，用于在单元格进入编辑状态时提供自定义的交互表单。 | <code>any</code> | - |
| `cellEditorParams` | 单元格Editor参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `cellEditorPopup` | 单元格EditorPopup。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `cellEditorPopupPosition` | 单元格EditorPopupPosition。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'over' \| 'under'</code> | `'over'` |
| `cellEditorSelector` | 单元格EditorSelector。用于精细化配置该功能的展现形式或执行逻辑。 | <code>CellEditorSelectorFunc&lt;TData, TValue&gt;</code> | - |
| `cellRenderer` | 组件：自定义单元格渲染器。传入一个 React 组件或 HTML 字符串，用于接管该单元格的 DOM 渲染逻辑。 | <code>any</code> | - |
| `cellRendererParams` | 单元格渲染参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `cellRendererSelector` | 单元格渲染Selector。用于精细化配置该功能的展现形式或执行逻辑。 | <code>CellRendererSelectorFunc&lt;TData, TValue&gt;</code> | - |
| `cellStyle` | 单元格内联样式。可以是一个样式对象，或返回样式对象的回调函数。 | <code>CellStyle \| CellStyleFunc&lt;TData, TValue&gt;</code> | - |
| `filterValueGetter` | 回调函数：筛选值获取。当直接绑定 field 无法满足要求时，提供动态计算并提取数据的逻辑。 | <code>string \| ValueGetterFunc&lt;TData&gt;</code> | - |
| `tooltipValueGetter` | 回调函数：提示值获取。当直接绑定 field 无法满足要求时，提供动态计算并提取数据的逻辑。 | <code>TooltipValueGetterFunc&lt;TData, TValue&gt;</code> | - |
| `useValueFormatterForExport` | use值格式化For导出。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `true` |
| `valueFormatter` | 回调函数：格式化显示值。在不改变底层数据的前提下，对单元格展示的文本进行格式化（如添加货币符号、日期转换）。 | <code>string \| ValueFormatterFunc&lt;TData, TValue&gt;</code> | - |
| `valueGetter` | 回调函数：自定义取值逻辑。当 field 无法满足复杂取值需求时，通过此函数动态计算并返回单元格的数据。 | <code>string \| ValueGetterFunc&lt;TData, TValue&gt;</code> | - |

### Filtering (筛选)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `floatingFilter` | floating筛选。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `getQuickFilterText` | 回调函数：获取 get快速筛选文本。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetQuickFilterText&lt;TData, TValue&gt;</code> | - |
| `suppressFiltersToolPanel` | 禁用 禁用Filters工具面板。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressFloatingFilterButton` | 禁用 禁用Floating筛选Button。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |

### Selection (选择)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `checkboxSelection` | 是否显示行选择复选框。设置为 true 时，该列的每个单元格前会渲染一个用于选中该行的 Checkbox。 | <code>boolean \| CheckboxSelectionCallback&lt;TData, TValue&gt;</code> | `false` |
| `loadingCellRendererSelector` | 加载中单元格渲染Selector。用于精细化配置该功能的展现形式或执行逻辑。 | <code>LoadingCellRendererSelectorFunc&lt;TData&gt;</code> | - |
| `showDisabledCheckboxes` | 显示DisabledCheckboxes。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `tooltipComponentSelector` | 提示组件Selector。用于精细化配置该功能的展现形式或执行逻辑。 | <code>CellEditorSelectorFunc \| CellRendererSelectorFunc</code> | - |




### Editing (编辑)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `editable` | 是否允许编辑。设置为 true 时，允许用户双击或单击单元格进入编辑模式修改数据。 | <code>boolean \| EditableCallback&lt;TData, TValue&gt;</code> | `false` |
| `editing` | editing。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `groupRowEditable` | 分组行Editable。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean \| GroupRowEditableCallback&lt;TData, TValue&gt;</code> | `false` |
| `singleClickEdit` | 单个ClickEdit。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |




### Interactivity (交互)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `dndSourceOnRowDrag` | dndSourceOn行拖拽。用于精细化配置该功能的展现形式或执行逻辑。 | <code>DndSourceOnRowDragFunc&lt;TData&gt;</code> | - |
| `suppressNavigable` | 禁用 禁用Navigable。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean \| SuppressNavigableCallback&lt;TData, TValue&gt;</code> | `false` |
| `tooltipComponent` | 组件：自定义 提示组件。通过注入自定义组件来完全接管该区域的 DOM 结构与样式。 | <code>any</code> | - |
| `tooltipComponentParams` | 提示组件参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `tooltipField` | 提示信息字段。指定行数据中的某个字段，当鼠标悬浮在单元格上时作为 Tooltip 显示。 | <code>ColDefField&lt;TData&gt;</code> | - |




### Miscellaneous (其他)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `children` | children。用于精细化配置该功能的展现形式或执行逻辑。 | <code>(ColDef&lt;TData&gt; \| ColGroupDef&lt;TData&gt;)[]</code> | - |
| `colId` | 列Id。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | - |
| `comparator` | comparator。用于精细化配置该功能的展现形式或执行逻辑。 | <code>SortComparatorFn&lt;TData, TValue&gt; \| Partial&lt;Record&lt;SortType, SortC...</code> | - |
| `component` | 组件。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `context` | 全局上下文对象。在此处传入的任何数据或方法，都可以在 cellRenderer、valueFormatter 等各个回调函数的 params.context 中随时访问。 | <code>any</code> | - |
| `count` | count。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `data` | 数据。用于精细化配置该功能的展现形式或执行逻辑。 | <code>TData</code> | - |
| `dateComponent` | 组件：自定义 date组件。通过注入自定义组件来完全接管该区域的 DOM 结构与样式。 | <code>any</code> | - |
| `dateComponentParams` | date组件参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `deferRender` | deferRender。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `dndSource` | dndSource。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean \| DndSourceCallback&lt;TData, TValue&gt;</code> | `false` |
| `enableCellChangeFlash` | 启用 启用单元格ChangeFlash。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `enableShowValuesAs` | 启用 启用显示ValuesAs。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `enableValue` | 启用 启用值。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `equals` | equals。用于精细化配置该功能的展现形式或执行逻辑。 | <code>EqualsFunc&lt;TValue&gt;</code> | - |
| `field` | 数据字段名。对应行数据对象中的 key，用于从数据源中提取该列的值。 | <code>ColDefField&lt;TData, TValue&gt;</code> | - |
| `getFindText` | 回调函数：获取 getFind文本。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetFindTextFunc&lt;TData, TValue&gt;</code> | - |
| `getValue` | 回调函数：获取 get值。用于精细化配置该功能的展现形式或执行逻辑。 | <code>(field: string) =&gt; any</code> | - |
| `getValueFormatted` | 回调函数：获取 get值Formatted。用于精细化配置该功能的展现形式或执行逻辑。 | <code>() =&gt; string \| null</code> | - |
| `hide` | 是否隐藏该列。设置为 true 时，该列将不会在表格中渲染显示。 | <code>boolean \| null</code> | `false` |
| `icons` | icons。用于精细化配置该功能的展现形式或执行逻辑。 | <code>Icons</code> | - |
| `initialHide` | 初始隐藏。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `initialShowValuesAs` | 初始显示ValuesAs。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ShowValuesAsType \| ShowValuesAs</code> | - |
| `initialSort` | 初始排序。用于精细化配置该功能的展现形式或执行逻辑。 | <code>SortDirection \| SortDef</code> | - |
| `initialSortIndex` | 初始排序索引。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `initialValueIndex` | 初始值索引。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `keyCreator` | 键创建器。用于精细化配置该功能的展现形式或执行逻辑。 | <code>KeyCreatorFunc&lt;TData, TValue&gt;</code> | - |
| `loadingCellRenderer` | 组件：自定义 加载中单元格渲染。通过注入自定义组件来完全接管该区域的 DOM 结构与样式。 | <code>any</code> | - |
| `loadingCellRendererParams` | 加载中单元格渲染参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `location` | location。用于精细化配置该功能的展现形式或执行逻辑。 | <code>HeaderLocation</code> | - |
| `lockPosition` | 锁定Position。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean \| 'left' \| 'right'</code> | `false` |
| `lockVisible` | 锁定Visible。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `marryChildren` | marryChildren。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `newRawValue` | newRaw值。用于精细化配置该功能的展现形式或执行逻辑。 | <code>TValue \| null</code> | - |
| `node` | 节点。用于精细化配置该功能的展现形式或执行逻辑。 | <code>IRowNode&lt;TData&gt;</code> | - |
| `nodeA` | 节点A。用于精细化配置该功能的展现形式或执行逻辑。 | <code>IRowNode&lt;TData&gt; \| null</code> | - |
| `nodeB` | 节点B。用于精细化配置该功能的展现形式或执行逻辑。 | <code>IRowNode&lt;TData&gt; \| null</code> | - |
| `openByDefault` | openBy默认。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `params` | 参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `popup` | popup。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `popupPosition` | popupPosition。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'over' \| 'under'</code> | - |
| `refData` | ref数据。用于精细化配置该功能的展现形式或执行逻辑。 | <code>RefData</code> | - |
| `resizable` | 是否允许调整列宽。设置为 true 时，允许用户通过拖拽表头边缘来改变该列的宽度。 | <code>boolean</code> | `true` |
| `showValuesAs` | 显示ValuesAs。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ShowValuesAsType \| ShowValuesAs \| null</code> | - |
| `showValuesAsDef` | 显示ValuesAsDef。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ShowValuesAsDef&lt;TData, TValue&gt; \| null</code> | - |
| `sort` | 排序。用于精细化配置该功能的展现形式或执行逻辑。 | <code>SortDirection \| SortDef</code> | - |
| `sortable` | 是否允许排序。设置为 true 时，允许用户点击表头对该列数据进行升序或降序排列。 | <code>boolean</code> | `true` |
| `sortIndex` | 排序索引。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number \| null</code> | - |
| `sortingOrder` | sortingOrder。用于精细化配置该功能的展现形式或执行逻辑。 | <code>SortDirection[]</code> | `[null, 'asc', 'desc']` |
| `source` | source。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | - |
| `suppressFillHandle` | 禁用 禁用填充手柄。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressNoteActions` | 禁用 禁用NoteActions。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean \| SuppressNoteActionsCallback&lt;TData, TValue&gt;</code> | `false` |
| `suppressSizeToFit` | 忽略自适应。当调用 API 使列宽自适应表格容器时，设置为 true 的列将保持原有宽度不参与缩放。 | <code>boolean</code> | `false` |
| `suppressStickyLabel` | 禁用 禁用StickyLabel。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressSyncLayoutWithGrid` | 禁用 禁用Sync布局WithGrid。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `toolPanelClass` | 工具面板类名。用于追加自定义 CSS 类名，以便在外部样式表中进行精准覆写。 | <code>ToolPanelClass&lt;TData, TValue&gt;</code> | - |
| `unSortIcon` | 取消排序图标。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `useValueParserForImport` | use值ParserFor导入。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `true` |
| `value` | 值。用于精细化配置该功能的展现形式或执行逻辑。 | <code>TValue \| null</code> | - |
| `valueA` | 值A。用于精细化配置该功能的展现形式或执行逻辑。 | <code>TValue \| null</code> | - |
| `valueB` | 值B。用于精细化配置该功能的展现形式或执行逻辑。 | <code>TValue \| null</code> | - |
| `valueIndex` | 值索引。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `valueParser` | 值Parser。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string \| ValueParserFunc&lt;TData, TValue&gt;</code> | - |
| `values` | values。用于精细化配置该功能的展现形式或执行逻辑。 | <code>(TValue \| null)[]</code> | - |
| `valueSetter` | 回调函数：自定义设值逻辑。在单元格编辑完成后，通过此函数将新值写回底层数据对象。 | <code>string \| ValueSetterFunc&lt;TData, TValue&gt;</code> | - |
| `wrapText` | 允许文本换行。设置为 true 时，当单元格内容超过列宽时自动折行显示（通常需要配合 autoHeight 使用）。 | <code>boolean</code> | `false` |

## 全局 Table 属性 (Table Props)

### Columns (列)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `aggregateOnlyChangedColumns` | aggregate仅变更Columns。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `allowDragFromColumnsToolPanel` | allow拖拽FromColumns工具面板。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `animateColumnResizing` | 动画列Resizing。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `autoGenerateColumnDefs` | 自动Generate列Defs。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean \| AutoGenerateColumnDefsOptions</code> | `false` |
| `autoGroupColumnDef` | 自动分组列Def。用于精细化配置该功能的展现形式或执行逻辑。 | <code>AutoGroupColumnDef&lt;TData&gt;</code> | - |
| `autoSizePadding` | 自动大小Padding。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `20` |
| `autoSizeStrategy` | 自动大小Strategy。用于精细化配置该功能的展现形式或执行逻辑。 | <code>AutoSizeStrategy</code> | - |
| `calculatedColumns` | calculatedColumns。用于精细化配置该功能的展现形式或执行逻辑。 | <code>CalculatedColumnsGridOption</code> | - |
| `colResizeDefault` | 列调整大小默认。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'shift'</code> | - |
| `columnDefs` | 表格的列配置数组。定义表格有哪些列，以及每列的宽度、字段映射、渲染方式等核心规则。 | <code>(ColDef \| ColGroupDef)[]</code> | - |
| `columnHoverHighlight` | 列HoverHighlight。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `columnMenu` | 列菜单。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'legacy' \| 'new'</code> | `'new'` |
| `columnTypes` | 列Types。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ColTypeDefs&lt;TData&gt;</code> | - |
| `copyGroupHeadersToClipboard` | copy分组HeadersTo剪贴板。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `copyHeadersToClipboard` | copyHeadersTo剪贴板。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `defaultColDef` | 所有列的默认公共配置。在此处设置的属性（如默认开启 sortable）会被自动应用到 columnDefs 中的每一列，减少重复代码。 | <code>ColDef&lt;TData&gt;</code> | - |
| `embedFullWidthRows` | embedFull宽度Rows。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `enableCellSpan` | 启用 启用单元格跨列/行。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `enableColumnSelection` | 启用 启用列选择。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `enableHeaderHighlight` | 启用 启用表头Highlight。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false;` |
| `enableStrictPivotColumnOrder` | 启用 启用Strict透视列Order。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `fullWidthCellRenderer` | 组件：自定义 full宽度单元格渲染。通过注入自定义组件来完全接管该区域的 DOM 结构与样式。 | <code>any</code> | - |
| `fullWidthCellRendererParams` | full宽度单元格渲染参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `groupHeaderHeight` | 分组表头高度。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `groupHideColumnsUntilExpanded` | 分组隐藏ColumnsUntilExpanded。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `groupLockGroupColumns` | 分组锁定分组Columns。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `0` |
| `groupSuppressBlankHeader` | 分组禁用Blank表头。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `headerCheckbox` | 表头复选框。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `true` |
| `headerHeight` | 表头默认高度。统一设置表格最顶部表头区域的绝对高度（以像素为单位）。 | <code>number</code> | **`36`** |
| `hidePaddedHeaderRows` | 隐藏Padded表头Rows。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `includeHiddenColumnsInAdvancedFilter` | includeHiddenColumnsInAdvanced筛选。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `includeHiddenColumnsInQuickFilter` | includeHiddenColumnsIn快速筛选。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `isFullWidthRow` | 回调函数：判断 isFull宽度行。返回 boolean 值，决定特定状态或条件是否成立。 | <code>IsFullWidthRow&lt;TData&gt;</code> | - |
| `isRowPinned` | 回调函数：判断 is行固定。返回 boolean 值，决定特定状态或条件是否成立。 | <code>IsRowPinned&lt;TData&gt;</code> | - |
| `maintainColumnOrder` | maintain列Order。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `navigateToNextHeader` | navigateToNext表头。用于精细化配置该功能的展现形式或执行逻辑。 | <code>NavigateToNextHeader&lt;TData&gt;</code> | - |
| `pinnedBottomRowData` | 固定Bottom行数据。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any[]</code> | - |
| `pinnedTopRowData` | 固定Top行数据。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any[]</code> | - |
| `pivotColumnGroupTotals` | 透视列分组Totals。用于精细化配置该功能的展现形式或执行逻辑。 | <code>PivotColumnGroupTotals</code> | - |
| `pivotGroupHeaderHeight` | 透视分组表头高度。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `pivotHeaderHeight` | 透视表头高度。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `pivotMaxGeneratedColumns` | 透视MaxGeneratedColumns。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `-1` |
| `pivotSuppressAutoColumn` | 透视禁用自动列。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `removePivotHeaderRowWhenSingleValueColumn` | 移除透视表头行When单个值列。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `scrollbarWidth` | scrollbar宽度。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `selectionColumnDef` | 选择列Def。用于精细化配置该功能的展现形式或执行逻辑。 | <code>SelectionColumnDef</code> | - |
| `skipHeaderOnAutoSize` | skip表头On自动大小。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `suppressAggFuncInHeader` | 禁用 禁用聚合函数In表头。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressAutoSize` | 禁用 禁用自动大小。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressBrowserResizeObserver` | 禁用 禁用Browser调整大小Observer。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressColumnMoveAnimation` | 禁用 禁用列移动Animation。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressColumnVirtualisation` | 禁用 禁用列Virtualisation。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressDragLeaveHidesColumns` | 禁用 禁用拖拽LeaveHidesColumns。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressGroupChangesColumnVisibility` | 禁用 禁用分组Changes列Visibility。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean \| 'suppressHideOnGroup' \| 'suppressShowOnUngroup'</code> | `false` |
| `suppressHeaderFocus` | 禁用 禁用表头焦点。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressMakeColumnVisibleAfterUnGroup` | 禁用 禁用Make列VisibleAfter取消分组。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressMovableColumns` | 禁用 禁用移动Columns。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressMoveWhenColumnDragging` | 禁用 禁用移动When列Dragging。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressRowGroupHidesColumns` | 禁用 禁用行分组HidesColumns。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressServerSideFullWidthLoadingRow` | 禁用 禁用服务端端Full宽度加载中行。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `tabToNextHeader` | tabToNext表头。用于精细化配置该功能的展现形式或执行逻辑。 | <code>TabToNextHeader&lt;TData&gt;</code> | - |

### Rows (行)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `detailRowAutoHeight` | 从行自动高度。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `detailRowHeight` | 从行高度。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `floatingFiltersHeight` | floatingFilters高度。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `getRowClass` | 回调函数：动态获取行 CSS 类名。根据当前行的数据状态（如是否过期、盈亏状态），动态返回特定的样式类。 | <code>GetRowClass&lt;TData&gt;</code> | - |
| `getRowHeight` | 回调函数：获取 get行高度。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetRowHeight&lt;TData&gt;</code> | - |
| `rowBuffer` | 行缓冲。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `10` |
| `rowClass` | 自定义行 CSS 类名。为表格中所有的渲染行统一追加特定的样式类。 | <code>string \| string[]</code> | - |
| `rowClassRules` | 行类名Rules。用于精细化配置该功能的展现形式或执行逻辑。 | <code>RowClassRules&lt;TData&gt;</code> | - |
| `rowData` | 表格的数据源数组。传入包含业务数据的对象数组，表格将根据此数据渲染对应的行。 | <code>TData[]</code> | - |
| `rowDragEntireRow` | 行拖拽Entire行。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `rowDragInsertDelay` | 行拖拽InsertDelay。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `500` |
| `rowDragManaged` | 行拖拽管理。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `rowDragMultiRow` | 行拖拽多行。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `rowDragText` | 行拖拽文本。用于精细化配置该功能的展现形式或执行逻辑。 | <code>RowDragTextFunc</code> | - |
| `rowHeight` | 表格默认行高。统一设置表格所有普通数据行的绝对高度（以像素为单位）。 | <code>number</code> | **`28`** |
| `rowIndex` | 行索引。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `rowModelType` | 行模型类型。用于精细化配置该功能的展现形式或执行逻辑。 | <code>RowModelType</code> | `'clientSide'` |
| `rowMultiSelectWithClick` | 行多选择WithClick。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `rowNumbers` | 行Numbers。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean \| RowNumbersOptions</code> | `false` |
| `rowSelection` | 行选择模式。支持 "single" (单选) 或 "multiple" (多选)，允许用户通过点击或复选框选中表格行。 | <code>RowSelectionOptions&lt;TData&gt; \| 'single' \| 'multiple'</code> | - | "multiple"） | "multiple"） |
| `rowStyle` | 行样式。用于精细化配置该功能的展现形式或执行逻辑。 | <code>RowStyle</code> | - |

### Cells (单元格)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `cellFadeDuration` | 单元格FadeDuration。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `1000` |
| `cellFlashDuration` | 单元格FlashDuration。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `500` |
| `cellSelection` | 单元格选择。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean \| CellSelectionOptions&lt;TData&gt;</code> | `false` |

### Filtering (筛选)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `advancedFilterBuilderParams` | advanced筛选Builder参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>IAdvancedFilterBuilderParams</code> | - |
| `advancedFilterParams` | advanced筛选参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>IAdvancedFilterParams</code> | - |
| `advancedFilterParent` | advanced筛选Parent。用于精细化配置该功能的展现形式或执行逻辑。 | <code>HTMLElement \| null</code> | - |
| `allowShowChangeAfterFilter` | allow显示ChangeAfter筛选。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `alwaysPassFilter` | 总是Pass筛选。用于精细化配置该功能的展现形式或执行逻辑。 | <code>AlwaysPassFilter&lt;TData&gt;</code> | - |
| `applyQuickFilterBeforePivotOrAgg` | 应用快速筛选Before透视Or聚合。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `cacheQuickFilter` | 缓存快速筛选。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `doesExternalFilterPass` | doesExternal筛选Pass。用于精细化配置该功能的展现形式或执行逻辑。 | <code>DoesExternalFilterPass&lt;TData&gt;</code> | - |
| `enableAdvancedFilter` | 启用 启用Advanced筛选。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `enableFilterHandlers` | 启用 启用筛选Handlers。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `excludeChildrenWhenTreeDataFiltering` | excludeChildrenWhen树数据Filtering。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `filterHandlers` | 筛选Handlers。用于精细化配置该功能的展现形式或执行逻辑。 | <code>FilterHandlers&lt;TData&gt;</code> | - |
| `findSearchValue` | findSearch值。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | - |
| `groupAggFiltering` | 分组聚合Filtering。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean \| IsRowFilterable&lt;TData&gt;</code> | `false` |
| `groupSelectsFiltered` | 分组Selects过滤后的。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `isExternalFilterPresent` | 回调函数：判断 isExternal筛选Present。返回 boolean 值，决定特定状态或条件是否成立。 | <code>IsExternalFilterPresent&lt;TData&gt;</code> | - |
| `quickFilterMatcher` | 快速筛选Matcher。用于精细化配置该功能的展现形式或执行逻辑。 | <code>QuickFilterMatcher</code> | - |
| `quickFilterParser` | 快速筛选Parser。用于精细化配置该功能的展现形式或执行逻辑。 | <code>QuickFilterParser</code> | - |
| `quickFilterText` | 快速筛选文本。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | - |
| `serverSideOnlyRefreshFilteredGroups` | 服务端端仅刷新过滤后的Groups。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `suppressAdvancedFilterEval` | 禁用 禁用Advanced筛选Eval。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `true` |
| `suppressAggFilteredOnly` | 禁用 禁用聚合过滤后的仅。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressSetFilterByDefault` | 禁用 禁用Set筛选By默认。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |

### Selection (选择)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `checkboxes` | checkboxes。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean \| CheckboxSelectionCallback&lt;TData, TValue, TContext&gt;</code> | `true` |
| `checkboxLocation` | 复选框Location。用于精细化配置该功能的展现形式或执行逻辑。 | <code>CheckboxLocation</code> | `'selectionColumn'` |
| `copySelectedRows` | copySelectedRows。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `ctrlASelectsRows` | ctrlASelectsRows。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `enableCellTextSelection` | 允许选中文本。设置为 true 时，用户可以用鼠标划选并复制单元格内的普通文本。 | <code>boolean</code> | `false` |
| `enableClickSelection` | 启用 启用Click选择。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean \| 'enableDeselection' \| 'enableSelection'</code> | `false` |
| `enableRangeSelection` | 启用范围选择。设置为 true 时，允许用户像在 Excel 中一样，通过鼠标拖拽选中一片矩形区域的单元格。 | <code>boolean</code> | `false` |
| `enableSelectionWithoutKeys` | 启用 启用选择WithoutKeys。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `groupSelects` | 分组Selects。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GroupSelectionMode</code> | `'self'` |
| `groupSelectsChildren` | 分组SelectsChildren。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `hideDisabledCheckboxes` | 隐藏DisabledCheckboxes。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `isRowSelectable` | 回调函数：判断 is行Selectable。返回 boolean 值，决定特定状态或条件是否成立。 | <code>IsRowSelectable&lt;TData&gt;</code> | - |
| `loadingCellRendererSelector` | 加载中单元格渲染Selector。用于精细化配置该功能的展现形式或执行逻辑。 | <code>LoadingCellRendererSelectorFunc&lt;TData&gt;</code> | - |
| `masterSelects` | 主Selects。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'self' \| 'detail'</code> | `'self'` |
| `overlayComponentSelector` | 遮罩组件Selector。用于精细化配置该功能的展现形式或执行逻辑。 | <code>OverlaySelectorFunc&lt;TData&gt;</code> | - |
| `paginationPageSizeSelector` | 每页条数选项。传入一个数字数组（如 [10, 20, 50]），允许用户在分页栏中自行切换单页显示的条数。 | <code>number[] \| boolean</code> | `false` |
| `selectAll` | 选择All。用于精细化配置该功能的展现形式或执行逻辑。 | <code>SelectAllMode</code> | `'all'` |
| `suppressMultiRangeSelection` | 禁用 禁用多范围选择。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressRowClickSelection` | 禁用 禁用行Click选择。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressRowDeselection` | 禁用 禁用行Deselection。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |

### Editing (编辑)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `editType` | edit类型。用于精细化配置该功能的展现形式或执行逻辑。 | <code>EditStrategyType</code> | - |
| `enableCellEditingOnBackspace` | 启用 启用单元格EditingOnBackspace。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `enableGroupEdit` | 启用 启用分组Edit。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `ensureDomOrder` | ensureDomOrder。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `enterNavigatesVerticallyAfterEdit` | enterNavigatesVerticallyAfterEdit。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `getFullRowEditValidationErrors` | 回调函数：获取 getFull行EditValidationErrors。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetFullRowEditValidationErrors</code> | - |
| `invalidEditValueMode` | invalidEdit值模式。用于精细化配置该功能的展现形式或执行逻辑。 | <code>EditValidationCommitType</code> | - |
| `readOnlyEdit` | read仅Edit。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `refreshAfterGroupEdit` | 刷新After分组Edit。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `singleClickEdit` | 单个ClickEdit。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `stopEditingWhenCellsLoseFocus` | stopEditingWhenCellsLose焦点。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `suppressClickEdit` | 禁用 禁用ClickEdit。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressStartEditOnTab` | 禁用 禁用StartEditOnTab。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `undoRedoCellEditing` | undoRedo单元格Editing。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `undoRedoCellEditingLimit` | undoRedo单元格EditingLimit。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `10` |

### Updating Data (数据更新)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `asyncTransactionWaitMillis` | 异步TransactionWaitMillis。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `isApplyServerSideTransaction` | 回调函数：判断 is应用服务端端Transaction。返回 boolean 值，决定特定状态或条件是否成立。 | <code>IsApplyServerSideTransaction&lt;TData&gt;</code> | - |
| `resetRowDataOnUpdate` | reset行数据On更新。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `suppressFocusAfterRefresh` | 禁用 禁用焦点After刷新。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressModelUpdateAfterUpdateTransaction` | 禁用 禁用模型更新After更新Transaction。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |

### Interactivity (交互)

| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `alwaysShowHorizontalScroll` | 总是显示HorizontalScroll。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `true` |
| `alwaysShowVerticalScroll` | 总是显示VerticalScroll。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `true` |
| `debounceVerticalScrollbar` | 防抖VerticalScrollbar。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `dragAndDropImageComponent` | 组件：自定义 拖拽And放置Image组件。通过注入自定义组件来完全接管该区域的 DOM 结构与样式。 | <code>any</code> | - |
| `dragAndDropImageComponentParams` | 拖拽And放置Image组件参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `enableBrowserTooltips` | 启用 启用BrowserTooltips。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `enterNavigatesVertically` | enterNavigatesVertically。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `focusChart` | 焦点图表。用于精细化配置该功能的展现形式或执行逻辑。 | <code>() =&gt; void</code> | - |
| `focusGridInnerElement` | 焦点GridInnerElement。用于精细化配置该功能的展现形式或执行逻辑。 | <code>FocusGridInnerElement&lt;TData&gt;</code> | - |
| `navigateToNextCell` | navigateToNext单元格。用于精细化配置该功能的展现形式或执行逻辑。 | <code>NavigateToNextCell&lt;TData&gt;</code> | - |
| `suppressCellFocus` | 禁用单元格焦点。设置为 true 时，点击单元格不会出现蓝色的焦点边框，通常用于纯展示类的表格。 | <code>boolean</code> | **`true`** |
| `suppressHorizontalScroll` | 禁用水平滚动条。设置为 true 时，表格将强制不显示底部横向滚动条，内容溢出时可能被截断。 | <code>boolean</code> | `false` |
| `suppressMiddleClickScrolls` | 禁用 禁用MiddleClickScrolls。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressMoveWhenRowDragging` | 禁用 禁用移动When行Dragging。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressRowDrag` | 禁用 禁用行拖拽。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressRowHoverHighlight` | 禁用 禁用行HoverHighlight。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressScrollOnNewData` | 禁用 禁用ScrollOnNew数据。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressScrollWhenPopupsAreOpen` | 禁用 禁用ScrollWhenPopupsAreOpen。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `tooltipHideDelay` | 提示隐藏Delay。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `10000` |
| `tooltipInteraction` | 提示Interaction。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `tooltipMouseTrack` | 提示鼠标Track。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `tooltipShowDelay` | 提示显示Delay。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `2000` |
| `tooltipShowMode` | 提示显示模式。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'standard' \| 'whenTruncated'</code> | ``standard`` |
| `tooltipSwitchShowDelay` | 提示Switch显示Delay。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `200` |
| `tooltipTrigger` | 提示Trigger。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'hover' \| 'focus'</code> | `'hover'` |

## 高级功能

### Row Grouping (行分组) (10 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `enableRowGroup` | 启用 启用行分组。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `groupHierarchy` | 分组Hierarchy。用于精细化配置该功能的展现形式或执行逻辑。 | <code>(GroupHierarchyParts \| string \| ColDef&lt;TData, TValue&gt;)[]</code> | - |
| `groupId` | 分组Id。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | - |
| `groupRowValueSetter` | 回调函数：分组行值设置。在单元格完成编辑后，提供将新值反向回写到底层数据的逻辑。 | <code>boolean \| GroupRowValueSetterFunc&lt;TData, TValue&gt; \| GroupRowValueSette...</code> | `false` |
| `initialRowGroup` | 初始行分组。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `initialRowGroupIndex` | 初始行分组索引。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `rowGroup` | 是否作为行分组依据。设置为 true 时，表格将根据该列的值对数据进行聚合分组。 | <code>boolean \| null</code> | `false` |
| `rowGroupIndex` | 行分组索引。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number \| null</code> | - |
| `rowGroupingHierarchy` | 行GroupingHierarchy。用于精细化配置该功能的展现形式或执行逻辑。 | <code>(GroupHierarchyParts \| string \| ColDef&lt;TData, TValue&gt;)[]</code> | - |
| `showRowGroup` | 显示行分组。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string \| boolean</code> | `false` |




#### Aggregation (聚合) (5 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `aggFunc` | 聚合函数。在行分组时，指定对该列数据使用的聚合算法（如 "sum", "min", "max", "avg" 等）。 | <code>string \| IAggFunc&lt;TData, TValue&gt; \| null</code> | - |
| `aggregatedChildren` | aggregatedChildren。用于精细化配置该功能的展现形式或执行逻辑。 | <code>IRowNode&lt;TData&gt;[]</code> | - |
| `allowedAggFuncs` | allowed聚合Funcs。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string[]</code> | - |
| `defaultAggFunc` | 回调函数：默认聚合函数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | `'sum'` |
| `initialAggFunc` | 回调函数：初始聚合函数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string \| IAggFunc&lt;TData, TValue&gt;</code> | - |




#### Formulas (公式) (2 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `allowFormula` | allow公式。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `calculatedExpression` | calculated表达式。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | - |




#### Pivoting (透视) (7 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `enablePivot` | 启用 启用透视。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `initialPivot` | 初始透视。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `initialPivotIndex` | 初始透视索引。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `pivot` | 是否开启数据透视。设置为 true 时，该列的唯一值将转换为透视表的新列。 | <code>boolean \| null</code> | `false` |
| `pivotComparator` | 透视Comparator。用于精细化配置该功能的展现形式或执行逻辑。 | <code>PivotComparatorFunc</code> | - |
| `pivotIndex` | 透视索引。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number \| null</code> | - |
| `pivotKeys` | 透视Keys。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string[]</code> | - |




#### Accessories (附件) (4 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `chartDataType` | 图表数据类型。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'category' \| 'series' \| 'time' \| 'excluded'</code> | - |
| `contextMenuItems` | 上下文菜单Items。用于精细化配置该功能的展现形式或执行逻辑。 | <code>(DefaultMenuItem \| MenuItemDef&lt;TData&gt;)[] \| GetContextMenuItems&lt;TDa...</code> | - |
| `mainMenuItems` | main菜单Items。用于精细化配置该功能的展现形式或执行逻辑。 | <code>(DefaultMenuItem \| MenuItemDef&lt;TData&gt;)[] \| GetMainMenuItems&lt;TData&gt;</code> | - |
| `menuTabs` | 菜单Tabs。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ColumnMenuTab[]</code> | - | 'generalMenuTab' \| 'columnsMenuTab'`. This is used to figure out which menu tabs are present and in which or... |




#### Import & Export (导入导出) (1 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `suppressPaste` | 禁用 禁用Paste。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean \| SuppressPasteCallback&lt;TData, TValue&gt;</code> | `false` |




#### State & Lifecycle (状态与生命周期) (8 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `dragEvent` | 拖拽事件。用于精细化配置该功能的展现形式或执行逻辑。 | <code>DragEvent</code> | - |
| `event` | 事件。用于精细化配置该功能的展现形式或执行逻辑。 | <code>KeyboardEvent</code> | - |
| `onCellClicked` | 事件回调：当用户点击某个具体单元格时触发。 | <code>(event: CellClickedEvent&lt;TData, TValue&gt;) =&gt; void</code> | - |
| `onCellContextMenu` | 事件回调：当 on单元格上下文菜单 时触发。用于监听底层状态变化并执行自定义业务逻辑。 | <code>(event: CellContextMenuEvent&lt;TData, TValue&gt;) =&gt; void</code> | - |
| `onCellDoubleClicked` | 事件回调：当 on单元格双击点击 时触发。用于监听底层状态变化并执行自定义业务逻辑。 | <code>(event: CellDoubleClickedEvent&lt;TData, TValue&gt;) =&gt; void</code> | - |
| `onCellValueChanged` | 事件回调：当 on单元格值变更 时触发。用于监听底层状态变化并执行自定义业务逻辑。 | <code>(event: NewValueParams&lt;TData, TValue&gt;) =&gt; void</code> | - |
| `suppressHeaderKeyboardEvent` | 禁用 禁用表头键盘事件。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>SuppressHeaderKeyboardEventFunc&lt;TData, TValue&gt;</code> | - |
| `suppressKeyboardEvent` | 禁用 禁用键盘事件。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>SuppressKeyboardEventFunc&lt;TData, TValue&gt;</code> | `false` |



#### 表格全局配置 (Grid Options)

#### Row Grouping (行分组) (25 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `defaultColGroupDef` | 默认列分组Def。用于精细化配置该功能的展现形式或执行逻辑。 | <code>Partial&lt;ColGroupDef&lt;TData&gt;&gt;</code> | - |
| `getGroupRowAgg` | 回调函数：获取 get分组行聚合。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetGroupRowAgg&lt;TData&gt;</code> | - |
| `getServerSideGroupKey` | 回调函数：获取 get服务端端分组键。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetServerSideGroupKey</code> | - |
| `getServerSideGroupLevelParams` | 回调函数：获取 get服务端端分组Level参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetServerSideGroupLevelParams&lt;TData&gt;</code> | - |
| `groupAllowUnbalanced` | 分组AllowUnbalanced。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `groupDefaultExpanded` | 分组默认展开层级。在树形或行分组模式下，设定初始渲染时默认展开到第几级（设为 -1 则全部展开）。 | <code>number</code> | `0` |
| `groupDisplayType` | 分组Display类型。用于精细化配置该功能的展现形式或执行逻辑。 | <code>RowGroupingDisplayType</code> | - |
| `groupHideOpenParents` | 分组隐藏OpenParents。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `groupHideParentOfSingleChild` | 分组隐藏ParentOf单个Child。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean \| 'leafGroupsOnly'</code> | `false` |
| `groupHierarchyConfig` | 分组HierarchyConfig。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GroupHierarchyConfig</code> | - |
| `groupMaintainOrder` | 分组MaintainOrder。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `groupRemoveLowestSingleChildren` | 分组移除Lowest单个Children。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `groupRemoveSingleChildren` | 分组移除单个Children。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `groupRowRenderer` | 组件：自定义 分组行渲染。通过注入自定义组件来完全接管该区域的 DOM 结构与样式。 | <code>any</code> | - |
| `groupRowRendererParams` | 分组行渲染参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `groupTotalRow` | 分组Total行。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'top' \| 'bottom' \| UseGroupTotalRow&lt;TData&gt;</code> | - |
| `initialGroupOrderComparator` | 初始分组OrderComparator。用于精细化配置该功能的展现形式或执行逻辑。 | <code>InitialGroupOrderComparator&lt;TData&gt;</code> | - |
| `isGroupOpenByDefault` | 回调函数：判断 is分组OpenBy默认。返回 boolean 值，决定特定状态或条件是否成立。 | <code>IsGroupOpenByDefault&lt;TData&gt;</code> | - |
| `isServerSideGroup` | 回调函数：判断 is服务端端分组。返回 boolean 值，决定特定状态或条件是否成立。 | <code>IsServerSideGroup</code> | - |
| `isServerSideGroupOpenByDefault` | 回调函数：判断 is服务端端分组OpenBy默认。返回 boolean 值，决定特定状态或条件是否成立。 | <code>IsServerSideGroupOpenByDefault&lt;TData&gt;</code> | - |
| `rowGroupPanelShow` | 行分组面板显示。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'always' \| 'onlyWhenGrouping' \| 'never'</code> | `'never'` |
| `rowGroupPanelSuppressSort` | 行分组面板禁用排序。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `showOpenedGroup` | 显示Opened分组。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `suppressExpandablePivotGroups` | 禁用 禁用Expandable透视Groups。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressGroupRowsSticky` | 禁用 禁用分组RowsSticky。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |




#### Aggregation (聚合) (3 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `aggFuncs` | 聚合Funcs。用于精细化配置该功能的展现形式或执行逻辑。 | <code>IAggFuncs&lt;TData&gt;</code> | - |
| `alwaysAggregateAtRootLevel` | 总是AggregateAtRootLevel。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `grandTotalRow` | grandTotal行。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'top' \| 'bottom' \| 'pinnedTop' \| 'pinnedBottom'</code> | - |




#### Formulas (公式) (3 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `enableCellExpressions` | 启用 启用单元格Expressions。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `formulaDataSource` | 公式数据Source。用于精细化配置该功能的展现形式或执行逻辑。 | <code>FormulaDataSource</code> | - |
| `formulaFuncs` | 公式Funcs。用于精细化配置该功能的展现形式或执行逻辑。 | <code>FormulaFuncs</code> | - |




#### Pivoting (透视) (5 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `pivotDefaultExpanded` | 透视默认Expanded。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `0` |
| `pivotMode` | 透视模式。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `pivotPanelShow` | 透视面板显示。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'always' \| 'onlyWhenPivoting' \| 'never'</code> | `'never'` |
| `pivotRowTotals` | 透视行Totals。用于精细化配置该功能的展现形式或执行逻辑。 | <code>PivotRowTotals</code> | - |
| `serverSidePivotResultFieldSeparator` | 服务端端透视结果FieldSeparator。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | `'_'` |




#### Tree Data (树形数据) (5 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `getChildCount` | 回调函数：获取 getChildCount。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetChildCount</code> | - |
| `treeData` | 是否开启树形数据模式。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `treeDataChildrenField` | 树数据ChildrenField。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | - |
| `treeDataDisplayType` | 树数据Display类型。用于精细化配置该功能的展现形式或执行逻辑。 | <code>TreeDataDisplayType</code> | - |
| `treeDataParentIdField` | 树数据ParentIdField。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | - |




#### Master Detail (主从表) (6 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `detailCellRenderer` | 组件：自定义 从单元格渲染。通过注入自定义组件来完全接管该区域的 DOM 结构与样式。 | <code>any</code> | - |
| `detailCellRendererParams` | 从单元格渲染参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `isRowMaster` | 回调函数：判断 is行主。返回 boolean 值，决定特定状态或条件是否成立。 | <code>IsRowMaster&lt;TData&gt;</code> | - |
| `keepDetailRows` | keep从Rows。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `keepDetailRowsCount` | keep从RowsCount。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `10` |
| `masterDetail` | 主从。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |




#### Accessories (附件) (32 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `activeOverlay` | active遮罩。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `activeOverlayParams` | active遮罩参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `allowContextMenuWithControlKey` | allow上下文菜单WithControl键。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `chart` | 图表。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `chartElement` | 图表Element。用于精细化配置该功能的展现形式或执行逻辑。 | <code>HTMLElement</code> | - |
| `chartId` | 图表Id。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | - |
| `chartMenuItems` | 图表菜单Items。用于精细化配置该功能的展现形式或执行逻辑。 | <code>(DefaultChartMenuItem \| MenuItemDef&lt;TData&gt;)[] \| GetChartMenuItems&lt;...</code> | - |
| `chartThemeOverrides` | 图表主题Overrides。用于精细化配置该功能的展现形式或执行逻辑。 | <code>AgChartThemeOverrides</code> | - |
| `chartThemes` | 图表Themes。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string[]</code> | `['ag-default', 'ag-material', 'ag-sheets', 'ag-polychroma', 'ag-vivid'];` |
| `chartToolPanelsDef` | 图表工具PanelsDef。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ChartToolPanelsDef</code> | - |
| `createChartContainer` | create图表容器。用于精细化配置该功能的展现形式或执行逻辑。 | <code>CreateChartContainer&lt;TData&gt;</code> | - |
| `customChartThemes` | 自定义图表Themes。用于精细化配置该功能的展现形式或执行逻辑。 | <code>CustomChartThemes</code> | - |
| `enableCharts` | 启用 启用Charts。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `getChartToolbarItems` | 回调函数：获取 get图表ToolbarItems。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetChartToolbarItems&lt;TData&gt;</code> | - |
| `getContextMenuItems` | 回调函数：获取 get上下文菜单Items。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetContextMenuItems&lt;TData&gt;</code> | - |
| `getMainMenuItems` | 回调函数：获取 getMain菜单Items。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetMainMenuItems&lt;TData&gt;</code> | - |
| `loadingOverlayComponent` | 组件：自定义 加载中遮罩组件。通过注入自定义组件来完全接管该区域的 DOM 结构与样式。 | <code>any</code> | - |
| `loadingOverlayComponentParams` | 加载中遮罩组件参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `noRowsOverlayComponent` | 组件：自定义 无Rows遮罩组件。通过注入自定义组件来完全接管该区域的 DOM 结构与样式。 | <code>any</code> | - |
| `noRowsOverlayComponentParams` | 无Rows遮罩组件参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `overlayComponent` | 组件：自定义 遮罩组件。通过注入自定义组件来完全接管该区域的 DOM 结构与样式。 | <code>any</code> | - |
| `overlayComponentParams` | 遮罩组件参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `overlayLoadingTemplate` | 自定义加载中模板。传入一段 HTML 字符串，覆盖表格处于 loading 状态时的默认遮罩层 UI。 | <code>string</code> | - |
| `overlayNoRowsTemplate` | 自定义无数据模板。传入一段 HTML 字符串，覆盖表格数据源为空时的默认空状态 UI。 | <code>string</code> | - |
| `sideBar` | 端栏。用于精细化配置该功能的展现形式或执行逻辑。 | <code>SideBarDef \| string \| string[] \| boolean \| null</code> | `false` |
| `statusBar` | 状态栏。用于精细化配置该功能的展现形式或执行逻辑。 | <code>StatusBar</code> | - |
| `suppressContextMenu` | 禁用 禁用上下文菜单。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | **`true`** |
| `suppressLoadingOverlay` | 禁用 禁用加载中遮罩。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressMenuHide` | 禁用 禁用菜单隐藏。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | **`true`** |
| `suppressNoRowsOverlay` | 禁用 禁用无Rows遮罩。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressOverlays` | 禁用 禁用Overlays。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>OverlayType[]</code> | - |
| `toolbar` | toolbar。用于精细化配置该功能的展现形式或执行逻辑。 | <code>Toolbar</code> | - |




#### Server-Side Data (服务端数据) (20 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `blockLoadDebounceMillis` | 块Load防抖Millis。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `cacheBlockSize` | 缓存块大小。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `100` |
| `cacheOverflowSize` | 缓存Overflow大小。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `1` |
| `infiniteInitialRowCount` | 无限初始行Count。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `1` |
| `maxBlocksInCache` | maxBlocksIn缓存。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `pagination` | 是否启用分页功能。设置为 true 时，表格底部会显示原生的分页控制栏，对长列表进行分页展示。 | <code>boolean</code> | **`false`** |
| `paginationAutoPageSize` | 分页自动页大小。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `paginationNumberFormatter` | 回调函数：分页Number格式化。在渲染到视图前对原始数据进行格式化转换，不改变数据源本身。 | <code>PaginationNumberFormatter&lt;TData&gt;</code> | - |
| `paginationPageSize` | 每页显示的条数。在开启分页功能后，设定默认单页渲染的数据行数。 | <code>number</code> | - |
| `paginationPanels` | 分页Panels。用于精细化配置该功能的展现形式或执行逻辑。 | <code>PaginationPanel[]</code> | - |
| `serverSideDatasource` | 服务端端Datasource。用于精细化配置该功能的展现形式或执行逻辑。 | <code>IServerSideDatasource</code> | - |
| `serverSideEnableClientSideSort` | 服务端端启用Client端排序。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `serverSideInitialRowCount` | 服务端端初始行Count。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `1` |
| `serverSideSortAllLevels` | 服务端端排序AllLevels。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `suppressPaginationPanel` | 禁用 禁用分页面板。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `valueCache` | 值缓存。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `valueCacheNeverExpires` | 值缓存NeverExpires。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `viewportDatasource` | 视图Datasource。用于精细化配置该功能的展现形式或执行逻辑。 | <code>IViewportDatasource</code> | - |
| `viewportRowModelBufferSize` | 视图行模型缓冲大小。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |
| `viewportRowModelPageSize` | 视图行模型页大小。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | - |




#### Import & Export (导入导出) (13 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `clipboardDelimiter` | 剪贴板Delimiter。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | `'\t'` |
| `defaultCsvExportParams` | 默认CSV导出参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>CsvExportParams</code> | - |
| `defaultExcelExportParams` | 默认Excel导出参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ExcelExportParams</code> | - |
| `excelStyles` | ExcelStyles。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ExcelStyle[]</code> | - |
| `sendToClipboard` | sendTo剪贴板。用于精细化配置该功能的展现形式或执行逻辑。 | <code>SendToClipboard&lt;TData&gt;</code> | - |
| `suppressClipboardApi` | 禁用 禁用剪贴板接口。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressClipboardPaste` | 禁用 禁用剪贴板Paste。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressCopyRowsToClipboard` | 禁用 禁用CopyRowsTo剪贴板。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressCopySingleCellRanges` | 禁用 禁用Copy单个单元格Ranges。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressCsvExport` | 禁用 禁用CSV导出。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressCutToClipboard` | 禁用 禁用CutTo剪贴板。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressExcelExport` | 禁用 禁用Excel导出。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressLastEmptyLineOnPaste` | 禁用 禁用Last空LineOnPaste。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |




#### State & Lifecycle (状态与生命周期) (16 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `destroyChart` | destroy图表。用于精细化配置该功能的展现形式或执行逻辑。 | <code>() =&gt; void</code> | - |
| `initialState` | 初始状态。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GridState</code> | - |
| `postProcessPopup` | post处理Popup。用于精细化配置该功能的展现形式或执行逻辑。 | <code>PostProcessPopup&lt;TData&gt;</code> | - |
| `preventDefaultOnContextMenu` | prevent默认On上下文菜单。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `processAutoGeneratedColumnDefs` | 处理自动Generated列Defs。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ProcessAutoGeneratedColumnDefs&lt;TData&gt;</code> | - |
| `processCellForClipboard` | 处理单元格For剪贴板。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ProcessCellForClipboard&lt;TData&gt;</code> | - |
| `processCellFromClipboard` | 处理单元格From剪贴板。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ProcessCellFromClipboard&lt;TData&gt;</code> | - |
| `processDataFromClipboard` | 处理数据From剪贴板。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ProcessDataFromClipboard&lt;TData&gt;</code> | - |
| `processFileInput` | 处理FileInput。用于精细化配置该功能的展现形式或执行逻辑。 | <code>(params: ProcessFileInputParams&lt;TData&gt;) =&gt; void</code> | - |
| `processGroupHeaderForClipboard` | 处理分组表头For剪贴板。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ProcessGroupHeaderForClipboard&lt;TData&gt;</code> | - |
| `processHeaderForClipboard` | 处理表头For剪贴板。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ProcessHeaderForClipboard&lt;TData&gt;</code> | - |
| `processPivotResultColDef` | 处理透视结果列Def。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ProcessPivotResultColDef&lt;TData&gt;</code> | - |
| `processPivotResultColGroupDef` | 处理透视结果列分组Def。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ProcessPivotResultColGroupDef&lt;TData&gt;</code> | - |
| `processRowPostCreate` | 处理行PostCreate。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ProcessRowPostCreate&lt;TData&gt;</code> | - |
| `processUnpinnedColumns` | 处理UnpinnedColumns。用于精细化配置该功能的展现形式或执行逻辑。 | <code>ProcessUnpinnedColumns&lt;TData&gt;</code> | - |
| `suppressPreventDefaultOnMouseWheel` | 禁用 禁用Prevent默认On鼠标Wheel。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |




#### Performance (性能) (2 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `suppressAnimationFrame` | 禁用 禁用AnimationFrame。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressRowVirtualisation` | 禁用 禁用行Virtualisation。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |




#### Miscellaneous (其他) (80 个属性)


| 属性 (Property) | 说明 (Description) | 类型 (Type) | 默认值 (Default) |
| --- | --- | --- | --- |
| `accentedSort` | accented排序。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `alignedGrids` | alignedGrids。用于精细化配置该功能的展现形式或执行逻辑。 | <code>AlignedGrid[] \| (() =&gt; AlignedGrid[])</code> | - |
| `alwaysMultiSort` | 总是多排序。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `animateRows` | 启用行动画。设置为 true 时，在数据排序、过滤或位置移动时，表格会提供丝滑的过渡动画。 | <code>boolean</code> | `true` |
| `arrayValues` | arrayValues。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'primitives' \| 'include' \| 'skip'</code> | `'primitives'` |
| `component` | 组件。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `components` | 注册自定义组件。以键值对的形式全局注册自定义的渲染器或编辑器，之后可在列配置中通过字符串名称直接引用。 | <code>Components</code> | - |
| `context` | 全局上下文对象。在此处传入的任何数据或方法，都可以在 cellRenderer、valueFormatter 等各个回调函数的 params.context 中随时访问。 | <code>any</code> | - |
| `data` | 数据。用于精细化配置该功能的展现形式或执行逻辑。 | <code>TData</code> | - |
| `datasource` | datasource。用于精细化配置该功能的展现形式或执行逻辑。 | <code>IDatasource</code> | - |
| `dataTypeDefinitions` | 数据类型Definitions。用于精细化配置该功能的展现形式或执行逻辑。 | <code>DataTypeDefinitions&lt;TData&gt;</code> | - |
| `debug` | debug。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `deltaSort` | delta排序。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `direction` | direction。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'x' \| 'y' \| 'xy'</code> | `'xy'` |
| `domLayout` | DOM 布局模式。例如设置为 "autoHeight" 时，表格会取消内部滚动条，根据数据行数自动向下撑开总高度。 | <code>DomLayoutType</code> | `'normal'` |
| `enableFillHandle` | 启用 启用填充手柄。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `enableRangeHandle` | 启用 启用范围手柄。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `enableRowPinning` | 启用 启用行Pinning。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean \| 'top' \| 'bottom'</code> | `false` |
| `enableRtl` | 启用 启用Rtl。设置为 true 时开启该高级特性，提供更丰富的交互能力。 | <code>boolean</code> | `false` |
| `fillHandleDirection` | 填充手柄Direction。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'x' \| 'y' \| 'xy'</code> | `'xy'` |
| `fillOperation` | 填充Operation。用于精细化配置该功能的展现形式或执行逻辑。 | <code>FillOperation&lt;TData&gt;</code> | - |
| `findOptions` | findOptions。用于精细化配置该功能的展现形式或执行逻辑。 | <code>FindOptions</code> | - |
| `functionsReadOnly` | functionsRead仅。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `getBusinessKeyForNode` | 回调函数：获取 getBusiness键For节点。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetBusinessKeyForNode&lt;TData&gt;</code> | - |
| `getDataPath` | 回调函数：获取 get数据Path。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetDataPath&lt;TData&gt;</code> | - |
| `getDocument` | 回调函数：获取 getDocument。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetDocument</code> | - |
| `getLocaleText` | 回调函数：获取 get本地化文本。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetLocaleText&lt;TData&gt;</code> | - |
| `getRowId` | 回调函数：获取行唯一标识。为每行数据提供一个唯一的 ID，极大提升 React 渲染性能和数据更新效率。 | <code>GetRowIdFunc&lt;TData&gt;</code> | - |
| `getRowStyle` | 回调函数：获取 get行样式。用于精细化配置该功能的展现形式或执行逻辑。 | <code>GetRowStyle&lt;TData&gt;</code> | - |
| `gridId` | gridId。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | - |
| `handle` | 手柄。用于精细化配置该功能的展现形式或执行逻辑。 | <code>RangeHandleOptions \| FillHandleOptions&lt;TData&gt;</code> | - |
| `icons` | icons。用于精细化配置该功能的展现形式或执行逻辑。 | <code>Icons</code> | - |
| `isRowPinnable` | 回调函数：判断 is行Pinnable。返回 boolean 值，决定特定状态或条件是否成立。 | <code>IsRowPinnable&lt;TData&gt;</code> | - |
| `isRowValidDropPosition` | 回调函数：判断 is行Valid放置Position。返回 boolean 值，决定特定状态或条件是否成立。 | <code>IsRowValidDropPositionCallback&lt;TData&gt;</code> | - |
| `loading` | 加载中。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `undefined` |
| `loadingCellRenderer` | 组件：自定义 加载中单元格渲染。通过注入自定义组件来完全接管该区域的 DOM 结构与样式。 | <code>any</code> | - |
| `loadingCellRendererParams` | 加载中单元格渲染参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `loadThemeGoogleFonts` | load主题GoogleFonts。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `localeText` | 本地化字典。传入键值对对象，用于覆盖表格内部各种原生 UI 提示（如分页、过滤、空状态）的默认中文文本。 | <code>LocaleText</code> | **`AG_GRID_LOCALE_CN`** |
| `maxConcurrentDatasourceRequests` | maxConcurrentDatasourceRequests。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `2` |
| `multiSortKey` | 多排序键。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'ctrl'</code> | - |
| `node` | 节点。用于精细化配置该功能的展现形式或执行逻辑。 | <code>IRowNode&lt;TData&gt;</code> | - |
| `noteHideDelay` | note隐藏Delay。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `220` |
| `notesDataSource` | notes数据Source。用于精细化配置该功能的展现形式或执行逻辑。 | <code>NotesDataSource \| FullWidthNotesDataSource</code> | - |
| `noteShowDelay` | note显示Delay。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `180` |
| `noteTrigger` | noteTrigger。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'hover' \| 'click'</code> | `'hover'` |
| `nullishValues` | nullishValues。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'include' \| 'skip'</code> | `'include'` |
| `objectValues` | objectValues。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'group' \| 'flatten' \| 'skip'</code> | `'group'` |
| `paginateChildRows` | paginateChildRows。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `params` | 参数。用于精细化配置该功能的展现形式或执行逻辑。 | <code>any</code> | - |
| `popupParent` | popupParent。用于精细化配置该功能的展现形式或执行逻辑。 | <code>HTMLElement \| null</code> | - |
| `postSortRows` | post排序Rows。用于精细化配置该功能的展现形式或执行逻辑。 | <code>PostSortRows&lt;TData&gt;</code> | - |
| `purgeClosedRowNodes` | purgeClosed行Nodes。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `reactiveCustomComponents` | reactive自定义Components。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `true` |
| `renderingMode` | rendering模式。用于精细化配置该功能的展现形式或执行逻辑。 | <code>'default' \| 'legacy'</code> | `'default'` |
| `setFillValue` | 回调函数：设置 set填充值。用于精细化配置该功能的展现形式或执行逻辑。 | <code>&lt;TContext = any&gt;(params: FillOperationParams&lt;TData, TContext&gt;) =&...</code> | - |
| `setMaximized` | 回调函数：设置 setMaximized。用于精细化配置该功能的展现形式或执行逻辑。 | <code>(maximized: boolean) =&gt; void</code> | `false` |
| `sortingOrder` | sortingOrder。用于精细化配置该功能的展现形式或执行逻辑。 | <code>SortDirection[]</code> | `[null, 'asc', 'desc']` |
| `ssrmExpandAllAffectsAllRows` | ssrm展开AllAffectsAllRows。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |
| `styleNonce` | 样式Nonce。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | - |
| `suppressChangeDetection` | 禁用 禁用ChangeDetection。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressClearOnFillReduction` | 禁用 禁用清除On填充Reduction。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressContentVisibilityAuto` | 禁用 禁用ContentVisibility自动。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `true` |
| `suppressFieldDotNotation` | 禁用 禁用FieldDotNotation。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressMaintainUnsortedOrder` | 禁用 禁用MaintainUnsortedOrder。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressMaxRenderedRowRestriction` | 禁用 禁用MaxRendered行Restriction。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressMultiRanges` | 禁用 禁用多Ranges。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressMultiSort` | 禁用 禁用多排序。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressPageInput` | 禁用 禁用页Input。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressPropertyNamesCheck` | 禁用 禁用PropertyNamesCheck。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressRowTransform` | 禁用 禁用行Transform。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `suppressStickyTotalRow` | 禁用 禁用StickyTotal行。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean \| 'grand' \| 'group'</code> | `false` |
| `suppressTouch` | 禁用 禁用触摸。设置为 true 时生效，用于屏蔽原生默认的交互或展示行为。 | <code>boolean</code> | `false` |
| `tabIndex` | tab索引。用于精细化配置该功能的展现形式或执行逻辑。 | <code>number</code> | `0` |
| `tabToNextCell` | tabToNext单元格。用于精细化配置该功能的展现形式或执行逻辑。 | <code>TabToNextCell&lt;TData&gt;</code> | - |
| `tabToNextGridContainer` | tabToNextGrid容器。用于精细化配置该功能的展现形式或执行逻辑。 | <code>TabToNextGridContainer&lt;TData&gt;</code> | - |
| `theme` | 主题。用于精细化配置该功能的展现形式或执行逻辑。 | <code>Theme \| 'legacy'</code> | `themeQuartz` |
| `themeCssLayer` | 主题CSS层。用于精细化配置该功能的展现形式或执行逻辑。 | <code>string</code> | - |
| `themeStyleContainer` | 主题样式容器。用于精细化配置该功能的展现形式或执行逻辑。 | <code>HTMLElement \| (() =&gt; HTMLElement \| void)</code> | - |
| `unSortIcon` | 取消排序图标。用于精细化配置该功能的展现形式或执行逻辑。 | <code>boolean</code> | `false` |






### Table ref

Table ref 与 `AgGridReact` 保持一致，可通过 `ref.current.api` 调用 Grid API。相关类型同样从 `gzd/gzd-table` 导入。

```tsx | pure
import &#123; useRef &#125; from 'react';
import &#123; Table &#125; from 'gzd';
import type &#123; AgGridReact &#125; from 'gzd/gzd-table';

const tableRef = useRef<AgGridReact&lt;User&gt;>(null);

tableRef.current?.api.setFilterModel(null);

return <Table&lt;User&gt; ref=&#123;tableRef&#125; columnDefs=&#123;columnDefs&#125; rowData=&#123;rowData&#125; />;
```

## 主题变量

Table 默认主题基于 `themeQuartz`。gold-dark 和 gold-light 模式分别使用对应的 AG Grid Token 提供视觉参数；其他主题继续使用运行时 `--gzd-*` CSS 变量。

### Table 组件变量

| CSS 变量 | 说明 | 未提供时回退到 |
| --- | --- | --- | --- | --- |
| `--gzd-components-table-header-bg` | gzcomponentstable表头bg。用于精细化配置该功能的展现形式或执行逻辑。 | `--gzd-color-border` |
| `--gzd-components-table-header-text-color` | gzcomponentstable表头文本color。用于精细化配置该功能的展现形式或执行逻辑。 | `--gzd-color-text-secondary` |
| `--gzd-components-table-border-color` | gzcomponentstablebordercolor。用于精细化配置该功能的展现形式或执行逻辑。 | `--gzd-color-border` |
| `--gzd-table-scrollbar-background-color` | gztablescrollbarbackgroundcolor。用于精细化配置该功能的展现形式或执行逻辑。 | `--gzd-color-border` |

组件变量需要在生成 CSS 变量时启用 `includeComponents`：

```ts | pure
import &#123; applyDesignTokenCssVariables &#125; from 'gzd';

applyDesignTokenCssVariables(&#123;
  themeMode,
  includeComponents: true,
  target: document.documentElement,
&#125;);
```

未启用组件变量时，Table 会自动使用全局变量，不会出现未定义样式。

### 主要全局变量

| CSS 变量 | 影响范围 |
| --- | --- | --- | --- |
| `--gzd-color-bg-container` | gzcolorbg容器。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-color-text` | gzcolor文本。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-color-text-secondary` | gzcolor文本secondary。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-color-primary` | gzcolorprimary。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-color-border` | gzcolorborder。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-color-border-secondary` | gzcolorbordersecondary。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-color-split` | gzcolorsplit。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-color-text-on-light` | gzcolor文本onlight。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-font-family` | gzfontfamily。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-font-size` | gzfont大小。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-font-weight-normal` | gzfontweightnormal。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-line-height` | gzline高度。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-padding-xs` | gzpaddingxs。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-border-radius-lg` | gzborderradiuslg。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-border-radius-sm` | gzborderradiussm。用于精细化配置该功能的展现形式或执行逻辑。 |
| `--gzd-checkbox-size` | gzd复选框大小。用于精细化配置该功能的展现形式或执行逻辑。 |

当 `ConfigProvider` 的 `themeMode` 为 `gold-dark` 或 `gold-light` 时，Table 会使用对应的 Gold AG Grid Token；gold-dark 额外适配表头、数据行、hover、边框、滚动区域、cell focus 和范围选择状态。这些视觉值优先读取主题生成的 `--ag-*` CSS 变量。该覆盖只作用于 gzd Table，不影响页面中的其他 AG Grid 实例。

## 注意

- **始终提供稳定行 ID。** 当数据会刷新、分页、选择或编辑时，请使用 `getRowId` 返回业务主键。不要使用会随排序或分页变化的数组索引。
- **为普通布局提供高度。** `domLayout="normal"` 下，Table 需要自身或父容器具有明确高度；否则内容区域可能为零高。
- **谨慎使用自动高度。** `domLayout="autoHeight"` 适合少量数据。它会让表格随全部行内容撑开，不适合依赖虚拟化的大数据集。
- **按需开启键盘导航。** 默认的 `suppressCellFocus=&#123;true&#125;` 会关闭数据单元格的键盘聚焦和导航；无障碍或键盘操作场景应显式传入 `false`。
- **区分 Community 与 Enterprise。** Set Filter、Tree Data、Master/Detail 等能力需要 Enterprise；完整边界参见 [AG Grid Modules](https://www.ag-grid.com/react-data-grid/modules/)。
- **升级 AG Grid 后需要视觉回归。** 部分表头、固定列、选中态、滚动区和分页样式依赖 AG Grid 36.0.1 的 DOM 类名及内部 CSS 变量。升级时需要运行 Table 样式契约测试，并重点检查表头拖动、固定列、滚动区域、选中态、cell focus 和分页布局。
- **优先使用公开 API。** 业务样式可以使用 `cellClass`、`headerClass`、`getRowClass` 或主题参数，避免依赖 AG Grid 内部 DOM 结构。

如只需修改默认空状态文案，可传入 `noRowsOverlayComponentParams=&#123;&#123; text: '暂无数据' &#125;&#125;`；需要完全改变结构时再使用 `noRowsOverlayComponent` 替换空状态组件。

## FAQ

### 为什么表格没有内容或高度为 0？

普通布局不会根据行内容自动撑开，需要给 Table 自身或父容器设置明确高度，例如 `<div style=&#123;&#123; height: 320 &#125;&#125;>`。少量数据可以改用 `domLayout="autoHeight"`。

### 为什么配置了 `filter`，表头仍然没有筛选入口？

Table 默认设置了 `suppressHeaderMenuButton: true`。请在需要筛选的列上同时配置 `filter` 和 `suppressHeaderMenuButton: false`：

```ts | pure
&#123;
  field: 'name',
  filter: 'agTextColumnFilter',
  suppressHeaderMenuButton: false,
&#125;
```

### 为什么刷新 `rowData` 后选择或展开状态丢失？

通常是因为行没有稳定 ID。通过 `getRowId=&#123;(&#123; data &#125;) => data.id&#125;` 返回不会随刷新变化的业务主键，并确保同一张表内没有重复值。

### 如何隐藏分页的页大小选择器？

设置 `paginationPageSizeSelector=&#123;false&#125;`。如果需要完全隐藏内置分页栏，可使用 `suppressPaginationPanel` 并通过 Grid API 实现外部分页控件。

### 如何恢复单元格键盘聚焦和导航？

显式传入 `suppressCellFocus=&#123;false&#125;`。如果还需要范围选择等能力，请同时确认对应功能是否属于 Enterprise。

### 如何减少 React 更新导致的表格重复计算？

使用 `useMemo` 或 `useState` 保持 `columnDefs`、`defaultColDef` 和对象类型配置的引用稳定；更新少量数据时优先使用稳定的 `getRowId` 配合事务或 Grid API。大数据量场景应使用固定高度和默认虚拟化，不要使用 `domLayout="autoHeight"` 渲染全部行。

## 样式微调最佳实践

在业务开发中，如果需要微调 Table 的深层 DOM 样式（尤其是内部组件如分页器 `ag-picker-field` 等），请务必遵循以下三个层级的最佳实践（从优到劣），以保证样式的健壮性和明暗模式的兼容性：

### 1. 首选 Theme Builder API (`tableTheme.ts`)
这是最优雅、最安全的做法。直接与 Figma Token 打通，不怕 AG Grid 升级改类名。
如果你需要微调的样式（如颜色、边框、基础间距等）在官方的 Theme Parameters 中有对应变量，请直接在 `src/components/table/tableTheme.ts` 中通过 `.withParams()` 修改：
```ts | pure
export const tableTheme = themeQuartz
  .withParams(&#123;
    // 例如：微调输入框内边距，并绑定到全局 Token
    inputPaddingStart: "8px",
    inputBorderRadius: "var(--gzd-border-radius-base)",
  &#125;)
```

### 2. 使用官方逃生舱 `createPart`
当官方没有暴露相关的 `withParams` 参数，但你只想针对某个局部组件写少量 CSS，并且希望样式能跟随主题对象时，请使用 `createPart`。
```ts | pure
import &#123; createPart &#125; from "ag-grid-community";

const customPickerPart = createPart(&#123;
  feature: "gzdTableCustomPicker", 
  css: `
    .ag-picker-field &#123; box-shadow: 0 2px 4px rgba(0,0,0,0.1); &#125;
  `
&#125;);

export const tableTheme = themeQuartz
  .withPart(customPickerPart) // 混入主题
  .withParams(&#123;...&#125;)
```

### 3. 最终兜底：`style.less` 强覆盖 + 契约测试
如果涉及极其复杂的布局修改（如强行隐藏/挪动深层 DOM 节点），只能在 `src/components/table/style.less` 中利用 `.gzd-table` 命名空间进行强制覆盖。
**⚠️ 警告：** 采用此方法直接依赖了 AG Grid 的内部类名。你**必须**在 `tests/ct/Table.style.test.ts` 中添加对应的“契约测试”，以防未来 AG Grid 升级更改类名导致样式“静默雪崩”：
```ts | pure
it("防御性测试：确保自定义分页器选择框的内部类名没有丢失", () => &#123;
  expect(tableStyles).toContain(".ag-picker-field");
&#125;);
```
`

## 中文文案字典 (Locale Dictionary)

| 属性 (Locale Key) | 默认中文翻译 (Default Value) |
| --- | --- |
| `selectAll` | (全选) |
| `selectAllSearchResults` | (全选搜索结果) |
| `addCurrentSelectionToFilter` | 将当前选择添加到筛选器 |
| `searchOoo` | 搜索... |
| `blanks` | (空白) |
| `noMatches` | 无匹配项 |
| `typeToSearchOoo` | 输入内容进行搜索... |
| `filterOoo` | 过滤... |
| `equals` | 等于 |
| `notEqual` | 不等于 |
| `blank` | 空白 |
| `notBlank` | 非空 |
| `empty` | 选择一个 |
| `lessThan` | 小于 |
| `greaterThan` | 大于 |
| `lessThanOrEqual` | 小于等于 |
| `greaterThanOrEqual` | 大于等于 |
| `inRange` | 介于 |
| `inRangeStart` | 从 |
| `inRangeEnd` | 到 |
| `contains` | 包含 |
| `notContains` | 不包含 |
| `startsWith` | 开始于 |
| `endsWith` | 结束于 |
| `dateFormatOoo` | yyyy-mm-dd |
| `before` | 之前 |
| `after` | 之后 |
| `yesterday` | 昨天 |
| `today` | 今天 |
| `tomorrow` | 明天 |
| `last7Days` | 最近7天 |
| `lastWeek` | 上周 |
| `thisWeek` | 本周 |
| `nextWeek` | 下周 |
| `last30Days` | 最近30天 |
| `lastMonth` | 上个月 |
| `thisMonth` | 这个月 |
| `nextMonth` | 下个月 |
| `last90Days` | 最近90天 |
| `lastQuarter` | 上个季度 |
| `thisQuarter` | 这个季度 |
| `nextQuarter` | 下个季度 |
| `lastYear` | 去年 |
| `thisYear` | 今年 |
| `yearToDate` | 年初至今 |
| `nextYear` | 明年 |
| `last6Months` | 最近6个月 |
| `last12Months` | 最近12个月 |
| `last24Months` | 最近24个月 |
| `andCondition` | 和 |
| `orCondition` | 或 |
| `applyFilter` | 应用 |
| `applyColumnToolPanel` | 应用 |
| `resetFilter` | 重置 |
| `clearFilter` | 清除 |
| `cancelFilter` | 取消 |
| `cancelColumnToolPanel` | 取消 |
| `textFilter` | 文本过滤器 |
| `numberFilter` | 数字过滤器 |
| `dateFilter` | 日期过滤器 |
| `setFilter` | 集合过滤器 |
| `groupFilterSelect` | 选择字段: |
| `filterSummaryInactive` | 是（全部） |
| `filterSummaryContains` | 包含 |
| `filterSummaryNotContains` | 不包含 |
| `filterSummaryTextEquals` | 等于 |
| `filterSummaryTextNotEqual` | 不等于 |
| `filterSummaryStartsWith` | 开始于 |
| `filterSummaryEndsWith` | 结束于 |
| `filterSummaryBlank` | 为空 |
| `filterSummaryNotBlank` | 不为空 |
| `filterSummaryEquals` | = |
| `filterSummaryNotEqual` | != |
| `filterSummaryGreaterThan` | &gt; |
| `filterSummaryGreaterThanOrEqual` | &gt;= |
| `filterSummaryLessThan` | &lt; |
| `filterSummaryLessThanOrEqual` | &lt;= |
| `filterSummaryInRange` | 介于 |
| `filterSummaryInRangeValues` | ($&#123;variable&#125;, $&#123;variable&#125;) |
| `filterSummaryTextQuote` |  "$&#123;variable&#125;" |
| `filterSummaryListInactive` | 是（全部） |
| `filterSummaryListSeparator` | ,  |
| `filterSummaryListShort` | 是($&#123;variable&#125;) |
| `filterSummaryListLong` | 是($&#123;variable&#125;)和$&#123;variable&#125;更多 |
| `addFilterCard` | 添加过滤器 |
| `agTextColumnFilterDisplayName` | 简单过滤器 |
| `agNumberColumnFilterDisplayName` | 简单过滤器 |
| `agDateColumnFilterDisplayName` | 简单过滤器 |
| `agSetColumnFilterDisplayName` | 选择过滤器 |
| `agMultiColumnFilterDisplayName` | 组合过滤器 |
| `addFilterPlaceholder` | 搜索列... |
| `advancedFilterContains` | 包含 |
| `advancedFilterNotContains` | 不包含 |
| `advancedFilterTextEquals` | 等于 |
| `advancedFilterTextNotEqual` | 不等于 |
| `advancedFilterStartsWith` | 开始于 |
| `advancedFilterEndsWith` | 结束于 |
| `advancedFilterBlank` | 为空 |
| `advancedFilterNotBlank` | 不为空 |
| `advancedFilterEquals` | = |
| `advancedFilterNotEqual` | != |
| `advancedFilterGreaterThan` | &gt; |
| `advancedFilterGreaterThanOrEqual` | &gt;= |
| `advancedFilterLessThan` | &lt; |
| `advancedFilterLessThanOrEqual` | &lt;= |
| `advancedFilterTrue` | 为真 |
| `advancedFilterFalse` | 为假 |
| `advancedFilterAnd` | 且 |
| `advancedFilterOr` | 或 |
| `advancedFilterApply` | 应用 |
| `advancedFilterReset` | 重置 |
| `advancedFilterCancel` | 取消 |
| `advancedFilterClear` | 清除 |
| `advancedFilterBuilder` | 构建器 |
| `advancedFilterValidationMissingColumn` | 缺少列 |
| `advancedFilterValidationMissingOption` | 缺少选项 |
| `advancedFilterValidationMissingValue` | 缺少值 |
| `advancedFilterValidationInvalidColumn` | 找不到列 |
| `advancedFilterValidationInvalidOption` | 找不到选项 |
| `advancedFilterValidationMissingQuote` | 值缺少结束引号 |
| `advancedFilterValidationNotANumber` | 值不是一个数字 |
| `advancedFilterValidationInvalidDate` | 值不是一个有效日期 |
| `advancedFilterValidationMissingCondition` | 缺少条件 |
| `advancedFilterValidationJoinOperatorMismatch` | 一个条件内的连接操作符必须相同 |
| `advancedFilterValidationInvalidJoinOperator` | 找不到连接操作符 |
| `advancedFilterValidationMissingEndBracket` | 缺少结束括号 |
| `advancedFilterValidationExtraEndBracket` | 结束括号过多 |
| `advancedFilterValidationMessage` | 表达式有错误。$&#123;variable&#125; - $&#123;variable&#125;。 |
| `advancedFilterValidationMessageAtEnd` | 表达式有错误。表达式末尾的$&#123;variable&#125;。 |
| `advancedFilterBuilderTitle` | 高级筛选 |
| `advancedFilterBuilderApply` | 应用 |
| `advancedFilterBuilderClear` | 清除 |
| `advancedFilterBuilderReset` | 重置 |
| `advancedFilterBuilderCancel` | 取消 |
| `advancedFilterBuilderAddButtonTooltip` | 添加筛选或组 |
| `advancedFilterBuilderRemoveButtonTooltip` | 移除 |
| `advancedFilterBuilderMoveUpButtonTooltip` | 上移 |
| `advancedFilterBuilderMoveDownButtonTooltip` | 下移 |
| `advancedFilterBuilderAddJoin` | 添加组 |
| `advancedFilterBuilderAddCondition` | 添加筛选 |
| `advancedFilterBuilderSelectColumn` | 选择一个列 |
| `advancedFilterBuilderSelectOption` | 选择一个选项 |
| `advancedFilterBuilderEnterValue` | 输入一个值... |
| `advancedFilterBuilderValidationAlreadyApplied` | 当前筛选已应用。 |
| `advancedFilterBuilderValidationIncomplete` | 并非所有条件都已完成。 |
| `advancedFilterBuilderValidationSelectColumn` | 必须选择一个列。 |
| `advancedFilterBuilderValidationSelectOption` | 必须选择一个选项。 |
| `advancedFilterBuilderValidationEnterValue` | 必须输入一个值。 |
| `minDateValidation` | 日期必须在 $&#123;variable&#125; 之后 |
| `maxDateValidation` | 日期必须在 $&#123;variable&#125; 之前 |
| `maxLengthValidation` | 必须少于或等于 $&#123;variable&#125; 个字符 |
| `minValueValidation` | 必须大于或等于 $&#123;variable&#125; |
| `maxValueValidation` | 必须小于或等于$&#123;variable&#125; |
| `strictMinValueValidation` | 必须大于$&#123;variable&#125; |
| `strictMaxValueValidation` | 必须小于$&#123;variable&#125; |
| `invalidSelectionValidation` | 无效的选择 |
| `invalidFormulaValidation` | 无效公式。 |
| `formulaParseInvalidCellReference` | 无效的单元格引用：$&#123;variable&#125;。 |
| `formulaParseInvalidRangeEndReference` | 无效的范围结束引用。 |
| `formulaParseUnterminatedString` | 未终止的字符串。 |
| `formulaParseUnexpectedCharacter` | 意外字符：$&#123;variable&#125;。 |
| `formulaParseOperatorStackUnderflow` | 运算符栈下溢。 |
| `formulaParseMissingOperand` | 缺少 '$&#123;variable&#125;' 的操作数。 |
| `formulaParseInternalUnexpectedFrameDuringReduction` | 内部错误：归约期间出现意外帧。 |
| `formulaParseInternalUnexpectedFrameBeforeOpenParen` | 内部错误：'(' 前出现意外帧。 |
| `formulaParseMisplacedComma` | 逗号位置错误。 |
| `formulaParseCommaOutsideFunctionCall` | 函数调用外出现逗号。 |
| `formulaParseInternalUnexpectedFrameBeforeCloseParen` | 内部错误：')' 前出现意外帧。 |
| `formulaParseMismatchedParentheses` | 括号不匹配。 |
| `formulaParseUnsupportedOperand` | 不支持的操作数：$&#123;variable&#125;。 |
| `formulaParseMismatchedParenthesesOrUnfinishedFunctionCall` | 括号不匹配或函数调用未完成。 |
| `formulaParseInvalidExpression` | 无效表达式。 |
| `formulaParseFormulasMustBeginWithEquals` | 公式必须以 = 开头。 |
| `formulaSerializeStringContainsQuote` | 字符串包含引号 (")，分词器不支持。 |
| `formulaSerializeCannotProduceAbsoluteColumnLabelFromId` | 无法从 ID '$&#123;variable&#125;' 生成绝对列标签。 |
| `formulaSerializeCannotProduceAbsoluteRowIndexFromId` | 无法从 ID '$&#123;variable&#125;' 生成绝对行索引。 |
| `formulaSerializeCannotProduceRowIndexFromId` | 无法从 ID '$&#123;variable&#125;' 生成行索引。 |
| `formulaSerializeCannotMapColumnIdToA1Label` | 无法将列 ID '$&#123;variable&#125;' 映射为 A1 标签。 |
| `formulaSerializeCannotParseAbsoluteRowIndex` | 无法解析绝对行索引 '$&#123;variable&#125;'。 |
| `formulaSerializeCannotMapRowIdToA1Index` | 无法将行 ID '$&#123;variable&#125;' 映射为 A1 索引。 |
| `formulaEvalRangeNotAllowedInScalarContext` | 标量上下文中不允许范围。 |
| `formulaEvalUnknownReferenceToCell` | 未知的单元格引用。 |
| `formulaEvalUnsupportedOperation` | 不支持的操作：$&#123;variable&#125;。 |
| `formulaEvalInvalidAbsoluteRow` | 无效的绝对行。 |
| `formulaEvalUnrecognisedRowId` | 无法识别的行 ID。 |
| `formulaEvalInvalidAbsoluteColumn` | 无效的绝对列。 |
| `formulaEvalUnrecognisedColumnId` | 无法识别的列 ID。 |
| `formulaEvalUnrecognisedRowInRange` | 范围中存在无法识别的行。 |
| `formulaEvalUnrecognisedReferenceToCell` | 无法识别的单元格引用。 |
| `formulaEvalIncompleteRangeReference` | 不完整的范围引用。 |
| `formulaFunctionExpectedExactlyArguments` | $&#123;variable&#125;: 需要恰好 $&#123;variable&#125; 个参数。 |
| `formulaFunctionExpectedAtMostArguments` | $&#123;variable&#125;: 最多需要 $&#123;variable&#125; 个参数。 |
| `formulaFunctionExpectedAtLeastArguments` | $&#123;variable&#125;: 至少需要 $&#123;variable&#125; 个参数。 |
| `formulaFunctionInvalidCriteriaWildcardsWithComparator` | 无效条件：比较运算符不能与通配符同时使用。 |
| `formulaFunctionNonNumericArgument` | $&#123;variable&#125;: 参数必须为数值。 |
| `formulaFunctionDivisionByZero` | $&#123;variable&#125;: 除数不能为 0。 |
| `formulaFunctionCannotCombineDatesWithBigInt` | $&#123;variable&#125;: 不能将日期与 BigInt 混合。 |
| `formulaFunctionRequiresAtLeastOneNumericValue` | $&#123;variable&#125;: 至少需要一个数值。 |
| `formulaFunctionRequiresAtLeastOneValue` | $&#123;variable&#125;: 至少需要一个值。 |
| `formulaFunctionAllValuesMustBeNumbers` | $&#123;variable&#125;: 所有值都必须是数字。 |
| `formulaFunctionArgumentMustBeRange` | $&#123;variable&#125;: 第 $&#123;variable&#125; 个参数必须是范围。 |
| `formulaFunctionArgumentMustBeValue` | $&#123;variable&#125;: 第 $&#123;variable&#125; 个参数必须是值。 |
| `formulaFunctionRangesHaveDifferentSizes` | $&#123;variable&#125;: 范围大小不一致。 |
| `formulaFunctionValuesMustBeNumeric` | $&#123;variable&#125;: 值必须为数值。 |
| `formulaFunctionValuesMustBeIntegers` | $&#123;variable&#125;: 值必须为整数。 |
| `formulaFunctionUnsupportedValueType` | $&#123;variable&#125;: 不支持的值类型。 |
| `formulaFunctionDivNonNumericArgument` | DIV：参数必须为数值。 |
| `formulaFunctionDivDivisionByZero` | DIV：除数不能为 0。 |
| `formulaFunctionSumCannotCombineDatesWithBigInt` | SUM：不能将日期与 BigInt 混合。 |
| `formulaFunctionSumRequiresAtLeastOneNumericValue` | SUM：至少需要一个数值。 |
| `formulaFunctionAvgRequiresAtLeastOneValue` | AVG：至少需要一个值。 |
| `formulaFunctionMedianAllValuesMustBeNumbers` | MEDIAN：所有值都必须是数字。 |
| `formulaFunctionMedianRequiresAtLeastOneValue` | MEDIAN：至少需要一个值。 |
| `formulaFunctionSumifFirstArgumentMustBeRange` | SUMIF：第一个参数必须是范围。 |
| `formulaFunctionSumifSecondArgumentMustBeValue` | SUMIF：第二个参数必须是值（criteria）。 |
| `formulaFunctionSumifThirdArgumentMustBeRange` | SUMIF：第三个参数必须是范围（sum_range）。 |
| `formulaFunctionSumifRangesHaveDifferentSizes` | SUMIF：范围大小不一致。 |
| `formulaFunctionCountifFirstArgumentMustBeRange` | COUNTIF：第一个参数必须是范围。 |
| `formulaFunctionCountifSecondArgumentMustBeValue` | COUNTIF：第二个参数必须是值（criteria）。 |
| `formulaFunctionConcatUnsupportedValueType` | CONCAT：不支持的值类型。 |
| `formulaFunctionMinRequiresAtLeastOneValue` | MIN：至少需要一个值。 |
| `formulaFunctionMaxRequiresAtLeastOneValue` | MAX：至少需要一个值。 |
| `formulaFunctionPercentNonNumericArgument` | PERCENT：参数必须为数值。 |
| `formulaFunctionPowerNonNumericArgument` | POWER：参数必须为数值。 |
| `formulaServiceCircularReference` | 循环引用。 |
| `formulaServiceExpectedParsableFormula` | 期望可解析的公式。 |
| `formulaServiceInternalSchedulingError` | 内部调度错误。 |
| `tooltipValidationErrorSeparator` | 。 |
| `columns` | 列 |
| `filters` | 过滤器 |
| `pivotMode` | 透视模式 |
| `groups` | 行组 |
| `rowGroupColumnsEmptyMessage` | 拖动到此处设置行组 |
| `values` | 值 |
| `valueColumnsEmptyMessage` | 拖动到此处聚合 |
| `pivots` | 列标签 |
| `pivotColumnsEmptyMessage` | 拖动到此处设置列标签 |
| `group` | 组 |
| `rowDragRow` | 行 |
| `rowDragRows` | 行 |
| `loadingOoo` | 加载中... |
| `loadingError` | 错误 |
| `noRowsToShow` | 无显示行 |
| `noMatchingRows` | 无匹配行 |
| `exportingOoo` | 正在导出... |
| `fileInputOverlay` | 拖放文件以导入数据 |
| `fileInputOverlayBrowse` | 浏览文件 |
| `fileInputProcessing` | 正在处理 $&#123;variable&#125; |
| `fileInputProcessingFailed` | 处理 $&#123;variable&#125; 时出错 |
| `enabled` | 启用 |
| `pinColumn` | 固定列 |
| `pinLeft` | 固定在左侧 |
| `pinRight` | 固定在右侧 |
| `noPin` | 取消固定 |
| `pinRow` | 锁定行 |
| `pinTop` | 固定到顶部 |
| `pinBottom` | 固定到底部 |
| `unpinRow` | 取消锁定行 |
| `valueAggregation` | 值汇总 |
| `noAggregation` | 无 |
| `showValuesAs` | 值显示方式 |
| `showValuesAsNone` | 无 |
| `percentOfGrandTotal` | 占总计的百分比 |
| `percentOfColumnTotal` | 占列总计的百分比 |
| `percentOfRowTotal` | 占行总计的百分比 |
| `percentOfParentRowTotal` | 占父行总计的百分比 |
| `percentOfParentColumnTotal` | 占父列总计的百分比 |
| `percentOfGrandTotalDescription` | 每个值占该列总计的百分比。 |
| `percentOfColumnTotalDescription` | 每个值占其列总计的百分比——每列合计为 100%。 |
| `percentOfRowTotalDescription` | 每个值占透视列中该行总计的百分比。 |
| `percentOfParentRowTotalDescription` | 每个值占其父分组的百分比。 |
| `percentOfParentColumnTotalDescription` | 每个值占其父透视列的百分比。 |
| `autosizeThisColumn` | 自动调整该列 |
| `autosizeAllColumns` | 自动调整所有列 |
| `groupBy` | 按$&#123;variable&#125;分组 |
| `ungroupBy` | 取消按$&#123;variable&#125;分组 |
| `ungroupAll` | 取消全部分组 |
| `addToValues` | 将$&#123;variable&#125;添加到值 |
| `removeFromValues` | 将$&#123;variable&#125;从值中移除 |
| `addToLabels` | 将$&#123;variable&#125;添加到标签 |
| `removeFromLabels` | 将$&#123;variable&#125;从标签中移除 |
| `resetColumns` | 重置列 |
| `expandAll` | 展开所有行组 |
| `collapseAll` | 关闭所有行组 |
| `copy` | 复制 |
| `ctrlC` | Ctrl+C |
| `ctrlX` | Ctrl+X |
| `copyWithHeaders` | 复制包含标题 |
| `copyWithGroupHeaders` | 复制包含组标题 |
| `cut` | 剪切 |
| `paste` | 粘贴 |
| `ctrlV` | Ctrl+V |
| `export` | 导出 |
| `csvExport` | 导出为CSV |
| `excelExport` | 导出为Excel |
| `columnFilter` | 列过滤 |
| `columnChooser` | 选择列 |
| `chooseColumns` | 选择列 |
| `sortAscending` | 升序排列 |
| `sortDescending` | 降序排列 |
| `sortAbsoluteAscending` | 绝对升序排序 |
| `sortAbsoluteDescending` | 绝对降序排序 |
| `sortUnSort` | 清除排序 |
| `shiftF2` | Shift+F2 |
| `toolbarFind` | 查找 |
| `toolbarFindPreviousMatch` | 上一个匹配 |
| `toolbarFindNextMatch` | 下一个匹配 |
| `toolbarQuickFilter` | 筛选 |
| `toolbarMenu` | 菜单 |
| `sum` | 总和 |
| `first` | 第一个 |
| `last` | 最后一个 |
| `min` | 最小值 |
| `max` | 最大值 |
| `none` | 无 |
| `count` | 计数 |
| `avg` | 平均 |
| `filteredRows` | 已筛选 |
| `selectedRows` | 已选中 |
| `totalRows` | 总行数 |
| `totalAndFilteredRows` | 行 |
| `more` | 更多 |
| `to` | 至 |
| `of` | 的 |
| `page` | 页 |
| `pageLastRowUnknown` | ? |
| `nextPage` | 下一页 |
| `lastPage` | 最后一页 |
| `firstPage` | 第一页 |
| `previousPage` | 上一页 |
| `pageSizeSelectorLabel` | 每页大小： |
| `footerTotal` | 合计 |
| `statusBarLastRowUnknown` | ？ |
| `scrollColumnIntoView` | 滚动$&#123;variable&#125;到视图内 |
| `pivotColumnGroupTotals` | 总计 |
| `pivotChartAndPivotMode` | 数据透视图和数据透视模式 |
| `pivotChart` | 数据透视图 |
| `chartRange` | 图表范围 |
| `columnChart` | 柱状图 |
| `groupedColumn` | 分组 |
| `stackedColumn` | 堆积 |
| `normalizedColumn` | 100% 堆积 |
| `barChart` | 条形图 |
| `groupedBar` | 分组 |
| `stackedBar` | 堆积 |
| `normalizedBar` | 100% 堆积 |
| `pieChart` | 饼图 |
| `pie` | 饼图 |
| `donut` | 环形图 |
| `lineChart` | 折线图 |
| `stackedLine` | 堆叠 |
| `normalizedLine` | 100% 堆叠 |
| `xyChart` | X Y (散点图) |
| `scatter` | 散点图 |
| `bubble` | 气泡图 |
| `areaChart` | 面积图 |
| `area` | 面积 |
| `stackedArea` | 堆积 |
| `normalizedArea` | 100% 堆积 |
| `histogramChart` | 直方图 |
| `polarChart` | 极地图 |
| `radarLine` | 雷达线 |
| `radarArea` | 雷达面积 |
| `nightingale` | 夜莺图 |
| `radialColumn` | 径向柱状图 |
| `radialBar` | 径向条形图 |
| `statisticalChart` | 统计图 |
| `boxPlot` | 箱线图 |
| `rangeBar` | 区间条形图 |
| `rangeArea` | 区间面积图 |
| `hierarchicalChart` | 层次图 |
| `treemap` | 树图 |
| `sunburst` | 旭日图 |
| `specializedChart` | 专项图 |
| `waterfall` | 瀑布图 |
| `heatmap` | 热力图 |
| `combinationChart` | 组合图 |
| `columnLineCombo` | 柱状图和折线图组合 |
| `AreaColumnCombo` | 面积图和柱状图组合 |
| `pivotChartTitle` | 数据透视图 |
| `rangeChartTitle` | 范围图 |
| `settings` | 图表 |
| `data` | 设置 |
| `format` | 自定义 |
| `categories` | 类别 |
| `defaultCategory` | (无) |
| `series` | 系列 |
| `switchCategorySeries` | 切换类别 / 系列 |
| `categoryValues` | 类别值 |
| `seriesLabels` | 系列标签 |
| `aggregate` | 汇总 |
| `xyValues` | XY 值 |
| `paired` | 配对模式 |
| `axis` | 轴 |
| `xAxis` | 水平轴 |
| `yAxis` | 垂直轴 |
| `polarAxis` | 极坐标轴 |
| `radiusAxis` | 半径轴 |
| `navigator` | 导航器 |
| `zoom` | 缩放 |
| `animation` | 动画 |
| `crosshair` | 准星 |
| `color` | 颜色 |
| `thickness` | 厚度 |
| `preferredLength` | 首选长度 |
| `xType` | X 类型 |
| `axisType` | 轴类型 |
| `automatic` | 自动 |
| `category` | 类别 |
| `number` | 数值 |
| `time` | 时间 |
| `timeFormat` | 时间格式 |
| `autoRotate` | 自动旋转 |
| `labelRotation` | 旋转 |
| `circle` | 圆形 |
| `polygon` | 多边形 |
| `square` | 方形 |
| `cross` | 十字符 |
| `diamond` | 菱形 |
| `plus` | 加号 |
| `triangle` | 三角形 |
| `heart` | 爱心 |
| `orientation` | 方向 |
| `fixed` | 固定 |
| `parallel` | 平行 |
| `perpendicular` | 垂直 |
| `radiusAxisPosition` | 位置 |
| `ticks` | 刻度 |
| `gridLines` | 网格线 |
| `width` | 宽度 |
| `height` | 高度 |
| `length` | 长度 |
| `padding` | 内边距 |
| `spacing` | 间距 |
| `chartStyle` | 图表样式 |
| `title` | 标题 |
| `chartTitles` | 标题 |
| `chartTitle` | 图表标题 |
| `chartSubtitle` | 副标题 |
| `horizontalAxisTitle` | 水平轴标题 |
| `verticalAxisTitle` | 垂直轴标题 |
| `polarAxisTitle` | 极坐标轴标题 |
| `titlePlaceholder` | 图表标题 |
| `background` | 背景 |
| `font` | 字体 |
| `weight` | 粗细 |
| `top` | 顶部 |
| `right` | 右边 |
| `bottom` | 底部 |
| `left` | 左边 |
| `labels` | 标签 |
| `calloutLabels` | 标注标签 |
| `sectorLabels` | 扇区标签 |
| `positionRatio` | 位置比例 |
| `size` | 大小 |
| `shape` | 形状 |
| `minSize` | 最小大小 |
| `maxSize` | 最大大小 |
| `legend` | 图例 |
| `position` | 位置 |
| `markerSize` | 标记大小 |
| `markerStroke` | 标记描边 |
| `markerPadding` | 标记内边距 |
| `itemSpacing` | 项目间距 |
| `itemPaddingX` | 项目内边距 X |
| `itemPaddingY` | 项目内边距 Y |
| `layoutHorizontalSpacing` | 横向间距 |
| `layoutVerticalSpacing` | 纵向间距 |
| `strokeWidth` | 描边宽度 |
| `offset` | 偏移 |
| `offsets` | 偏移 |
| `tooltips` | 工具提示 |
| `callout` | 标注 |
| `markers` | 标记 |
| `shadow` | 阴影 |
| `blur` | 模糊 |
| `xOffset` | X 偏移 |
| `yOffset` | Y 偏移 |
| `lineWidth` | 线宽 |
| `lineDash` | 线条虚线 |
| `lineDashOffset` | 虚线偏移 |
| `scrollingZoom` | 滚动 |
| `scrollingStep` | 滚动步骤 |
| `selectingZoom` | 选择 |
| `durationMillis` | 持续时间 (毫秒) |
| `crosshairLabel` | 标签 |
| `crosshairSnap` | 对节点对齐 |
| `normal` | 常规 |
| `bold` | 加粗 |
| `italic` | 斜体 |
| `boldItalic` | 加粗斜体 |
| `predefined` | 预定义 |
| `fillOpacity` | 填充不透明度 |
| `strokeColor` | 线条颜色 |
| `strokeOpacity` | 线条不透明度 |
| `miniChart` | 迷你图表 |
| `histogramBinCount` | 箱数 |
| `connectorLine` | 连接线 |
| `seriesItems` | 系列项目 |
| `seriesItemType` | 项目类型 |
| `seriesItemPositive` | 正面 |
| `seriesItemNegative` | 负面 |
| `seriesItemLabels` | 项目标签 |
| `columnGroup` | 柱形图 |
| `barGroup` | 条形图 |
| `pieGroup` | 饼图 |
| `lineGroup` | 折线图 |
| `scatterGroup` | 散点图 |
| `areaGroup` | 面积图 |
| `polarGroup` | 极坐标图 |
| `statisticalGroup` | 统计图 |
| `hierarchicalGroup` | 层次图 |
| `specializedGroup` | 专用图 |
| `combinationGroup` | 组合图 |
| `groupedColumnTooltip` | 分组 |
| `stackedColumnTooltip` | 堆积 |
| `normalizedColumnTooltip` | 100% 堆积 |
| `groupedBarTooltip` | 分组 |
| `stackedBarTooltip` | 堆积 |
| `normalizedBarTooltip` | 100% 堆积 |
| `pieTooltip` | 饼图 |
| `donutTooltip` | 环形图 |
| `lineTooltip` | 折线图 |
| `stackedLineTooltip` | 堆叠 |
| `normalizedLineTooltip` | 百分比堆叠 |
| `groupedAreaTooltip` | 面积图 |
| `stackedAreaTooltip` | 堆积 |
| `normalizedAreaTooltip` | 100% 堆积 |
| `scatterTooltip` | 散点图 |
| `bubbleTooltip` | 气泡图 |
| `histogramTooltip` | 直方图 |
| `radialColumnTooltip` | 径向柱图 |
| `radialBarTooltip` | 径向条图 |
| `radarLineTooltip` | 雷达线图 |
| `radarAreaTooltip` | 雷达面积图 |
| `nightingaleTooltip` | 玫瑰图 |
| `rangeBarTooltip` | 范围条图 |
| `rangeAreaTooltip` | 范围面积图 |
| `boxPlotTooltip` | 箱线图 |
| `treemapTooltip` | 树状图 |
| `sunburstTooltip` | 旭日图 |
| `waterfallTooltip` | 瀑布图 |
| `heatmapTooltip` | 热力图 |
| `columnLineComboTooltip` | 柱图与折线图 |
| `areaColumnComboTooltip` | 面积图与柱图 |
| `customComboTooltip` | 自定义组合 |
| `innerRadius` | 内半径 |
| `startAngle` | 起始角度 |
| `endAngle` | 终止角度 |
| `reverseDirection` | 反向 |
| `groupPadding` | 组间距 |
| `seriesPadding` | 系列间距 |
| `tile` | 瓦片 |
| `whisker` | 须 |
| `cap` | 顶部 |
| `capLengthRatio` | 顶部长度比 |
| `labelPlacement` | 标签位置 |
| `inside` | 内部 |
| `outside` | 外部 |
| `noDataToChart` | 无可绘制的数据。 |
| `pivotChartRequiresPivotMode` | 数据透视图需要启用数据透视模式。 |
| `chartSettingsToolbarTooltip` | 菜单 |
| `chartLinkToolbarTooltip` | 链接到网格 |
| `chartUnlinkToolbarTooltip` | 从网格中取消链接 |
| `chartDownloadToolbarTooltip` | 下载图表 |
| `chartMenuToolbarTooltip` | 菜单 |
| `chartEdit` | 编辑图表 |
| `chartAdvancedSettings` | 高级设置 |
| `chartLink` | 链接到网格 |
| `chartUnlink` | 从网格中取消链接 |
| `chartDownload` | 下载图表 |
| `histogramFrequency` | 频率 |
| `seriesChartType` | 系列图表类型 |
| `seriesType` | 系列类型 |
| `secondaryAxis` | 次轴 |
| `seriesAdd` | 添加系列 |
| `categoryAdd` | 添加类别 |
| `bar` | 条形图 |
| `column` | 柱形图 |
| `histogram` | 直方图 |
| `advancedSettings` | 高级设置 |
| `direction` | 方向 |
| `horizontal` | 水平 |
| `vertical` | 垂直 |
| `seriesGroupType` | 分组类型 |
| `groupedSeriesGroupType` | 分组 |
| `stackedSeriesGroupType` | 堆积 |
| `normalizedSeriesGroupType` | 100% 堆积 |
| `legendEnabled` | 启用 |
| `invalidColor` | 无效的颜色值 |
| `groupedColumnFull` | 分组柱形图 |
| `stackedColumnFull` | 堆积柱形图 |
| `normalizedColumnFull` | 100% 堆积柱形图 |
| `groupedBarFull` | 分组条形图 |
| `stackedBarFull` | 堆积条形图 |
| `normalizedBarFull` | 100% 堆积条形图 |
| `stackedAreaFull` | 堆积面积图 |
| `normalizedAreaFull` | 100% 堆积面积图 |
| `customCombo` | 自定义组合 |
| `funnel` | 漏斗 |
| `coneFunnel` | 圆锥漏斗 |
| `pyramid` | 金字塔 |
| `funnelGroup` | 漏斗 |
| `funnelTooltip` | 漏斗 |
| `coneFunnelTooltip` | 圆锥漏斗 |
| `pyramidTooltip` | 金字塔 |
| `dropOff` | 流失 |
| `stageLabels` | 阶段标签 |
| `reverse` | 反向 |
| `tooltipMode` | 工具提示模式 |
| `tooltipModeSingle` | 单个 |
| `tooltipModeShared` | 多个 |
| `tooltipModeCompact` | 紧凑 |
| `ariaAdvancedFilterBuilderItem` | $&#123;variable&#125;. 级别 $&#123;variable&#125;. 按 ENTER 进行编辑。 |
| `ariaAdvancedFilterBuilderItemValidation` | $&#123;variable&#125;. 级别 $&#123;variable&#125;. $&#123;variable&#125; 按 ENTER 进行编辑。 |
| `ariaAdvancedFilterBuilderList` | 高级过滤器构建器列表 |
| `ariaAdvancedFilterBuilderFilterItem` | 过滤条件 |
| `ariaAdvancedFilterBuilderGroupItem` | 过滤组 |
| `ariaAdvancedFilterBuilderColumn` | 列 |
| `ariaAdvancedFilterBuilderOption` | 选项 |
| `ariaAdvancedFilterBuilderValueP` | 值 |
| `ariaAdvancedFilterBuilderJoinOperator` | 连接运算符 |
| `ariaAdvancedFilterInput` | 高级过滤器输入 |
| `ariaChecked` | 已选中 |
| `ariaColumn` | 列 |
| `ariaColumnGroup` | 列组 |
| `ariaFilterActive` | 筛选已激活 |
| `ariaColumnFiltered` | 列已过滤 |
| `ariaCalculatedColumn` | 计算列 |
| `ariaColumnShowValuesAs` | 正在以此方式显示值 |
| `ariaColumnSelectAll` | 切换所有列的可见性 |
| `ariaDateFilterInput` | 日期过滤器输入 |
| `ariaDefaultListName` | 列表 |
| `ariaFilterColumnsInput` | 过滤列输入 |
| `ariaFilterFromValue` | 过滤从值 |
| `ariaFilterInput` | 过滤器输入 |
| `ariaFilterList` | 过滤器列表 |
| `ariaFilterToValue` | 过滤至值 |
| `ariaFilterValue` | 过滤值 |
| `ariaFilterMenuOpen` | 打开过滤器菜单 |
| `ariaFilteringOperator` | 过滤运算符 |
| `ariaHidden` | 隐藏 |
| `ariaIndeterminate` | 不确定 |
| `ariaInputEditor` | 输入编辑器 |
| `ariaMenuColumn` | 按 ALT 向下 打开列菜单 |
| `ariaFilterColumn` | 按 CTRL ENTER 打开过滤器 |
| `ariaRowDeselect` | 按 SPACE 取消选择此行 |
| `ariaHeaderSelection` | 具有标题选择的列 |
| `ariaSelectAllCells` | 按空格键或回车键选择所有单元格 |
| `ariaSelectAllRowCells` | 按 Enter 键选择此行中的所有单元格 |
| `ariaColumnCellSelection` | 按 Enter 键切换此列中所有可见单元格的选择 |
| `ariaColumnGroupCellSelection` | 按 Enter 键切换此列组中所有可见单元格的选择 |
| `ariaColumnGroupExpansion` | 按 ENTER 键展开或折叠此列组 |
| `ariaColumnGroupCellSelectionAndExpansion` | 按 Enter 键切换此列组中所有可见单元格的选择. 按 ALT ENTER 键展开或折叠此列组 |
| `ariaRowSelectAll` | 按 Space 切换所有行选择 |
| `ariaRowToggleSelection` | 按 Space 切换行选择 |
| `ariaRowSelect` | 按 SPACE 选择此行 |
| `ariaRowSelectionDisabled` | 此行的行选择功能被禁用 |
| `ariaSearch` | 搜索 |
| `ariaSortableColumn` | 按 ENTER 排序 |
| `ariaSortableColumnWithCellSelection` | 按 ALT ENTER 排序 |
| `ariaToggleVisibility` | 按 Space 切换可见性 |
| `ariaToggleCellValue` | 按 Space 切换单元格值 |
| `ariaUnchecked` | 未选中 |
| `ariaVisible` | 可见 |
| `ariaSearchFilterValues` | 搜索过滤值 |
| `ariaPageSizeSelectorLabel` | 页面大小 |
| `ariaChartMenuClose` | 关闭图表编辑菜单 |
| `ariaChartSelected` | 已选择 |
| `ariaSparklineChartDescription` | 迷你图 - $&#123;chartType&#125; 显示 $&#123;count&#125; 个值，范围在 $&#123;min&#125; 到 $&#123;max&#125; 之间。起始于 $&#123;start&#125;，结束于 $&#123;end&#125;。 |
| `ariaSparklineChartDescriptionSingleValue` | 迷你图 - $&#123;chartType&#125; 显示 1 个值：$&#123;value&#125;。 |
| `ariaSparklineChartDescriptionEmpty` | 迷你图 - $&#123;chartType&#125;，无值。 |
| `ariaSkeletonCellLoadingFailed` | 行加载失败 |
| `ariaSkeletonCellLoading` | 行数据加载中 |
| `ariaDeferSkeletonCellLoading` | 单元格正在加载 |
| `ariaPendingChange` | 待处理的变更 |
| `ariaRowGroupDropZonePanelLabel` | 行分组 |
| `ariaValuesDropZonePanelLabel` | 值 |
| `ariaPivotDropZonePanelLabel` | 列标签 |
| `ariaDropZoneColumnComponentDescription` | 按 DELETE 键移除 |
| `ariaDropZoneColumnValueItemDescription` | 按 ENTER 键更改聚合类型 |
| `ariaDropZoneColumnGroupItemDescription` | 按 ENTER 键排序 |
| `ariaDropZoneColumnComponentAggFuncSeparator` |  的  |
| `ariaDropZoneColumnComponentSortAscending` | 升序 |
| `ariaDropZoneColumnComponentSortDescending` | 降序 |
| `ariaDropZoneColumnComponentSortAbsoluteAscending` | 绝对升序 |
| `ariaDropZoneColumnComponentSortAbsoluteDescending` | 绝对降序 |
| `ariaLabelDialog` | 对话框 |
| `ariaLabelColumnMenu` | 列菜单 |
| `ariaLabelColumnFilter` | 列过滤器 |
| `ariaLabelSelectField` | 选择字段 |
| `ariaValidationErrorPrefix` | 单元格编辑器验证 |
| `ariaLabelLoadingContextMenu` | 正在加载上下文菜单 |
| `ariaLabelRichSelectField` | 丰富选择字段 |
| `ariaLabelRichSelectToggleSelection` | 按下空格键以切换选择 |
| `ariaLabelRichSelectDeselectAllItems` | 按下删除键来取消选择所有项目 |
| `ariaLabelRichSelectDeleteSelection` | 按下删除键来取消选择项目 |
| `ariaLabelTooltip` | 工具提示 |
| `ariaLabelContextMenu` | 上下文菜单 |
| `ariaLabelSubMenu` | 子菜单 |
| `ariaLabelAggregationFunction` | 聚合函数 |
| `ariaLabelAdvancedFilterAutocomplete` | 高级筛选自动完成 |
| `ariaLabelAdvancedFilterBuilderAddField` | 高级筛选生成器添加字段 |
| `ariaLabelAdvancedFilterBuilderColumnSelectField` | 高级筛选生成器列选择字段 |
| `ariaLabelAdvancedFilterBuilderOptionSelectField` | 高级筛选生成器选项选择字段 |
| `ariaLabelAdvancedFilterBuilderJoinSelectField` | 高级筛选生成器连接操作符选择字段 |
| `ariaColumnPanelList` | 列列表 |
| `ariaFilterPanelList` | 过滤列表 |
| `ariaLabelAddFilterField` | 添加过滤字段 |
| `ariaLabelFilterCardDelete` | 删除过滤器 |
| `ariaLabelFilterCardHasEdits` | 有编辑 |
| `ariaHasNote` | 此单元格有备注。 |
| `thousandSeparator` | , |
| `decimalSeparator` | . |
| `dataTypeText` | 文本 |
| `dataTypeNumber` | 数字 |
| `dataTypeBigInt` | BigInt |
| `dataTypeBoolean` | 布尔值 |
| `dataTypeDate` | 日期 |
| `dataTypeDateString` | 日期字符串 |
| `dataTypeDateTime` | 日期时间 |
| `dataTypeDateTimeString` | 日期时间字符串 |
| `dataTypeObject` | 对象 |
| `true` | 真 |
| `false` | 假 |
| `invalidDate` | 无效日期 |
| `invalidNumber` | 无效数字 |
| `invalidBigInt` | 无效BigInt |
| `january` | 一月 |
| `february` | 二月 |
| `march` | 三月 |
| `april` | 四月 |
| `may` | 五月 |
| `june` | 六月 |
| `july` | 七月 |
| `august` | 八月 |
| `september` | 九月 |
| `october` | 十月 |
| `november` | 十一月 |
| `december` | 十二月 |
| `year` | 年 |
| `quarter` | 季度 |
| `month` | 月 |
| `day` | 日 |
| `hour` | 小时 |
| `minute` | 分钟 |
| `second` | 秒 |
| `timeFormatSlashesDDMMYYYY` | DD/MM/YYYY |
| `timeFormatSlashesMMDDYYYY` | MM/DD/YYYY |
| `timeFormatSlashesDDMMYY` | DD/MM/YY |
| `timeFormatSlashesMMDDYY` | MM/DD/YY |
| `timeFormatDotsDDMYY` | DD.M.YY |
| `timeFormatDotsMDDYY` | M.DD.YY |
| `timeFormatDashesYYYYMMDD` | YYYY-MM-DD |
| `timeFormatSpacesDDMMMMYYYY` | DD MMMM YYYY |
| `timeFormatHHMMSS` | HH:MM:SS |
| `timeFormatHHMMSSAmPm` | HH:MM:SS 上午/下午 |
| `calculatedColumn` | 计算列 |
| `calculatedColumnAdd` | 添加计算列 |
| `calculatedColumnEdit` | 编辑计算列 |
| `calculatedColumnRemove` | 删除计算列 |
| `calculatedColumnTitle` | 标题 |
| `calculatedColumnType` | 类型 |
| `calculatedColumnExpression` | 表达式 |
| `calculatedColumnExpressionPlaceholder` | 在此输入 |
| `calculatedColumnExpressionToolsLabel` | 插入 |
| `calculatedColumnColumns` | 列 |
| `calculatedColumnFunctions` | 函数 |
| `calculatedColumnOperators` | 运算符 |
| `calculatedColumnSuggestions` | 计算列建议 |
| `calculatedColumnDefaultTitle` | 未命名 |
| `calculatedColumnExpressionAmbiguousReference` | 列引用不明确 "$&#123;variable&#125;"。请使用“列”列表或更具体的分组路径。 |
| `calculatedColumnExpressionUnknownReference` | 未知的列引用 "$&#123;variable&#125;"。 |
| `calculatedColumnExpressionEmpty` | 请输入表达式 |
| `calculatedColumnTitleEmpty` | 请输入标题 |
| `calculatedColumnApply` | 应用 |
| `calculatedColumnCancel` | 取消 |
| `note` | 单元格备注 |
| `addNote` | 添加备注 |
| `viewNote` | 查看备注 |
| `editNote` | 编辑备注 |
| `deleteNote` | 删除备注 |
| `notePlaceholder` | 添加备注... |
