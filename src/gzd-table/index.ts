/**
 * @fileoverview gzd Table 的底层扩展导出入口
 * 
 * ⚠️ 重要设计策略：双入口隔离 ⚠️
 * 
 * 1. 使用者只应该从 `gzd` (主包) 导入 `<Table>` 组件。
 * 2. 如果使用者需要用到 AG Grid 的底层类型（比如定义列 `ColDef`）、枚举、API 实例，
 *    **必须从这里 (`gzd/gzd-table`) 导入**。
 * 
 * 目的：避免业务项目直接依赖 `ag-grid-community` 等包，防止包版本混乱。
 * 这里将 AG Grid 的所有底层模块原封不动地重新导出 (re-export)。
 */

export * from "ag-grid-community";
export * from "ag-grid-enterprise";
export * from "ag-grid-react";

// 导出与主题 Token 相关的自定义类型和处理函数
export type { GZDAgGridExtensionTokens, GZDAgGridTokens } from "./agGridTokens";
export {
  applyAgGridDesignTokenCssVariables,
  getAgGridDesignTokenCssVariables,
  type GZDAgGridThemeCssVariablesOptions,
  type GZDAgGridThemeMode,
} from "./agGridThemeCssVariables";
export { goldDarkAgGridTokens } from "./goldDarkAgGridTokens";
export { goldLightAgGridTokens } from "./goldLightAgGridTokens";
