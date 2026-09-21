import { AG_GRID_LOCALE_CN } from "@ag-grid-community/locale";
import type { AgGridReactProps } from "ag-grid-react";
import NoRowsOverlay from "../components/NoRowsOverlay";
import tableTheme from "../tableTheme";

// ⚠️ AG Grid 企业版 License 密钥
// 由于启用了 AllEnterpriseModule，必须注入有效的密钥，否则控制台会报错并带有水印。
export const AG_GRID_ENTERPRISE_LICENSE =
  "AgGridLicense66fwc79n[NORMAL][v0102]_NDA3MDk2NjQwMDAwMA==80908dd5fb71b58d3ce28b2ed320216d";

/**
 * gzd Table 的全局默认配置 (Grid Options)
 * 这里的配置会作为最低优先级的兜底配置，如果使用者没有在业务代码中覆盖，就会生效。
 */
export const DEFAULT_GRID_OPTIONS = {
  theme: tableTheme,

  // 允许鼠标划选并复制单元格里的文本（AG Grid 默认是 false，防止和拖拽冲突，但业务通常需要复制）
  enableCellTextSelection: true,

  // 自定义空状态组件：当 rowData 为空时，展示我们自己写的 NoRowsOverlay 组件
  noRowsOverlayComponent: NoRowsOverlay,

  // 注入官方的纯中文语言包，并覆盖部分默认文案以符合业务习惯
  localeText: {
    ...AG_GRID_LOCALE_CN,
    pageSizeSelectorLabel: "每页条数",
    page: '第',
    of: '页/共',
    collapseAll: '收起所有行组',
  },

  // 默认表头高度和行高
  headerHeight: 31,
  rowHeight: 28,

  // 禁用原生的右键菜单（界面更干净，如有需要业务侧可自行开启）
  suppressContextMenu: false,

  // 拖动列交换位置时，关闭动画（可能为了性能或视觉统一）
  suppressColumnMoveAnimation: true,

  // 禁用单元格的焦点框（点击单元格时不会出现蓝色边框，类似普通网页体验）
  suppressCellFocus: true,

  // 把列拖出表格范围时，不隐藏该列
  suppressDragLeaveHidesColumns: true,

  // 滚动条宽度（10px）
  scrollbarWidth: 10,

  // 默认关闭分页。如果要开启，使用者必须显式传 pagination: true
  pagination: false,
} satisfies AgGridReactProps;
