/**
 * `gzd-table` 发布子路径的最小消费者契约。
 *
 * `npm run verify:exports` 会把本文件当作包外业务代码单独交给 TypeScript
 * 编译。这里必须始终通过正式包名导入，不能引用 `src`，这样才能发现
 * package exports、声明文件或三方类型转导出配置的回归。
 */
import type {
  AgGridReactProps,
  ColDef,
  ICellRendererParams,
} from "gzd/gzd-table";
import {
  applyAgGridDesignTokenCssVariables,
  getAgGridDesignTokenCssVariables,
  goldDarkAgGridTokens,
  themeQuartz,
} from "gzd/gzd-table";
import type { GZDAgGridThemeCssVariablesOptions } from "gzd/gzd-table";

interface RowData {
  id: string;
  name: string;
}

// 同时覆盖列定义、单元格渲染参数以及行数据泛型的转导出能力。
const columnDefs: ColDef<RowData>[] = [
  {
    field: "name",
    cellRenderer: ({ value }: ICellRendererParams<RowData, string>) => value,
  },
];

const gridProps: AgGridReactProps<RowData> = {
  columnDefs,
  rowData: [{ id: "1", name: "Soleil" }],
};

// 该夹具只参与编译，不会真正创建表格；void 用于显式消费这些校验值。
void gridProps;

// 检查扩展 Token 的联合类型仍与 AG Grid 主题参数兼容。
const rowGroupBackground: string | { ref: string } | undefined =
  goldDarkAgGridTokens.rowGroupBgColor;
void rowGroupBackground;
void themeQuartz.withParams(goldDarkAgGridTokens);

// 覆盖主题模式类型，以及读取/应用 CSS 变量这两个公开辅助函数。
const cssVariableOptions: GZDAgGridThemeCssVariablesOptions = {
  themeMode: "gold-dark",
};
const cssVariables = getAgGridDesignTokenCssVariables(cssVariableOptions);
const cleanup = applyAgGridDesignTokenCssVariables(cssVariableOptions);
void cssVariables;
void cleanup;
