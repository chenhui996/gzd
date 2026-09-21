import { createPart, themeQuartz } from "ag-grid-community";
import { goldDarkAgGridTokens } from "../../gzd-table/goldDarkAgGridTokens";
import { goldLightAgGridTokens } from "../../gzd-table/goldLightAgGridTokens";

// 逃生仓：禁用复选框的光标样式
const disabledCheckboxCursorPart = createPart({
  feature: "gzdTableDisabledCheckboxCursor",
  css: `
.ag-checkbox-input:disabled,
.ag-checkbox-input-wrapper.ag-disabled,
.ag-selection-checkbox .ag-checkbox-input-wrapper.ag-disabled::before {
  cursor: not-allowed;
}
`,
});

const paginationPickerPart = createPart({
  feature: "gzdTablePaginationPickerWidth",
  css: `
/* 覆盖分页器选择框的宽度，以及补充缺失的边框 */
.ag-paging-panel .ag-picker-field-wrapper {
  min-width: 48px !important;
  min-height: 24px !important;
  border: 1px solid var(--gzd-color-border) !important;
  cursor: pointer;
  transition: border-color 0.3s ease-in-out;

  &:hover {
    border-color: var(--gzd-color-primary-hover) !important;
  }
}

/* 覆盖分页器输入框的宽度，以及补充缺失的边框 */
.ag-number-field-input-wrapper .ag-input-field-input.ag-number-field-input {
  border: 1px solid var(--gzd-color-border) !important;
  cursor: pointer;
  transition: border-color 0.3s ease-in-out;

  &:hover {
    border-color: var(--gzd-color-primary-hover) !important;
  }
}

.ag-paging-panel-content{
  padding: 0 !important;
}
`,
});

/**
 * 这是 gzd Table 的基础主题对象。
 * 它继承了 AG Grid 官方现代主题 `themeQuartz`。
 * 这里面混入了两个硬编码的字体参数，确保表格字体和全局字体保持绝对一致。
 */
const tableTheme = themeQuartz
  .withPart(disabledCheckboxCursorPart)
  .withPart(paginationPickerPart)
  .withParams({
    fontFamily: "var(--gzd-font-family)",
    fontSize: "calc(var(--gzd-font-size) * 1px)",
    fontWeight: "var(--gzd-font-weight-normal)",
    iconSize: "calc(var(--gzd-checkbox-size) * 1px)",
    focusShadow: {
      spread: "0px",
    },
    cellFontSize: "calc(var(--gzd-font-size) * 1px)",
    cellFontWeight: "var(--gzd-font-weight-normal)",
    cellHorizontalPadding: "calc(var(--gzd-padding-xs) * 1px)",
    headerFontSize: "calc(var(--gzd-font-size) * 1px)",
    headerFontWeight: "var(--gzd-font-weight-normal)",
    headerHeight: 31,
    rowHeight: 28,
    headerBackgroundColor:
      "var(--gzd-components-table-header-bg, var(--gzd-color-border))",
    headerTextColor:
      "var(--gzd-components-table-header-text-color, var(--gzd-color-text-secondary))",
    headerColumnBorder: {
      style: "solid",
      width: 2,
      color: "var(--gzd-color-split)",
    },
    headerColumnBorderHeight: 14,
    pinnedColumnBorder: {
      style: "solid",
      width: 1,
      color: "var(--gzd-color-split)",
    },
    checkboxBorderRadius: "calc(var(--gzd-border-radius-sm) * 1px)",
    checkboxBorderWidth: 1,
    checkboxUncheckedBackgroundColor: "var(--gzd-color-bg-container)",
    checkboxUncheckedBorderColor: "var(--gzd-color-border-secondary)",
    checkboxCheckedBackgroundColor: "var(--gzd-color-primary)",
    checkboxCheckedBorderColor: "var(--gzd-color-primary)",
    checkboxCheckedShapeColor: "var(--gzd-color-text-on-light)",
    checkboxIndeterminateBackgroundColor: "var(--gzd-color-primary)",
    checkboxIndeterminateBorderColor: "var(--gzd-color-primary)",
    checkboxIndeterminateShapeColor: "var(--gzd-color-text-on-light)",
    borderColor:
      "var(--gzd-components-table-border-color, var(--gzd-color-border))",
    oddRowBackgroundColor: "var(--gzd-color-bg-container)",
    backgroundColor: "var(--gzd-color-bg-container)",
    dataBackgroundColor: "var(--gzd-color-bg-container)",
    foregroundColor: "var(--gzd-color-text)",
    cellTextColor: "var(--gzd-color-text)",
    rowHoverColor:
      "color-mix(in srgb, transparent, var(--gzd-color-primary) 15%)",
    selectedRowBackgroundColor:
      "color-mix(in srgb, transparent, var(--gzd-color-primary) 12%)",
    paginationPanelHeight: 40,
  })

// 生成的 Gold Token 仍包含 wrapper 边框和圆角，必须在其后重置，确保三套默认主题一致。
/**
 * 金色暗黑主题配置 (Gold Dark)
 * 继承基础主题，并将 Figma 转换来的暗黑版 Token (goldDarkAgGridTokens) 覆盖上去。
 */
export const goldDarkTableTheme = tableTheme
  .withParams(goldDarkAgGridTokens)

/**
 * 金色亮色主题配置 (Gold Light)
 * 继承基础主题，并将 Figma 转换来的亮色版 Token (goldLightAgGridTokens) 覆盖上去。
 */
export const goldLightTableTheme = tableTheme
  .withParams(goldLightAgGridTokens)

export default tableTheme;
