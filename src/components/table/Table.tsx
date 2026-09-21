import { forwardRef, useContext, useMemo, useCallback, useRef } from "react";
import { AllEnterpriseModule } from "ag-grid-enterprise"; // 引入企业版的所有模块
import {
  AgGridProvider,
  AgGridReact,
  type AgGridReactProps,
  type AgGridReact as AgGridReactInstance
} from "ag-grid-react"; // 引入 React 组件
import type { PaginationPanel, GetContextMenuItemsParams, BodyScrollEvent, GridReadyEvent, ModelUpdatedEvent, GridSizeChangedEvent, DisplayedColumnsChangedEvent, GridApi } from "ag-grid-community"; // 引入分页器及其他类型
import { GZDConfigContext } from "../config-provider/context"; // 引入全局配置上下文
import {
  AG_GRID_ENTERPRISE_LICENSE,
  DEFAULT_GRID_OPTIONS,
} from "./constants/config"; // 引入默认配置
import { AG_GRID_LOCALE_CN } from "@ag-grid-community/locale"; // 引入中文包以获取类型
import { goldDarkTableTheme, goldLightTableTheme } from "./tableTheme"; // 引入表格主题

// 提取出所有中文包里的 Key（比如 "page" | "of" | "to" | "noRowsToShow" 等）
export type GzdLocaleKeys = keyof typeof AG_GRID_LOCALE_CN;

// 定义 gzd Table 组件的属性类型
export interface GZDTableProps<TData = unknown> extends Omit<AgGridReactProps<TData>, "localeText"> {
  /**
   * 自定义覆盖中文文案字典
   * @example { page: "当前页", of: "总页数", pageSizeSelectorLabel: "每页条数" }
   */
  localeText?: Partial<Record<GzdLocaleKeys, string>>;
}

// 默认的列定义
const DEFAULT_COL_DEF = {
  sortable: true,
  resizable: true,
  // 根据基线产品需求：开启按列聚合功能，并限制只能使用以下 5 种汇总方式（原生的 first/last 等被剔除）
  enableValue: true,
  // 限制只能使用以下 5 种汇总方式（原生的 first/last 等被剔除）
  allowedAggFuncs: ["sum", "avg", "max", "min", "count"],
};

// 注入 AG Grid 企业版的所有模块（如行分组、高级过滤、树形数据等）
const ENTERPRISE_MODULES = [
  AllEnterpriseModule
];

// 我们定制的分页器布局结构：
// rowSummary: 左侧的“共 x 条”
// pageSize: 右侧的“每页显示多少条”下拉框
// pageSummary: 最右侧的“第 1 页 / 共 10 页”以及翻页按钮
const DEFAULT_PAGINATION_PANELS: PaginationPanel[] = [
  "rowSummary",
  "pageSize",
  "pageSummary",
];

// 为了让 Table 组件在使用时能够正确推导泛型（比如 TData，代表行数据的类型）
// 并且能够正确推导出 ref 的类型（AgGridReactInstance），
// 我们需要使用这个自定义的类型断言来覆盖 forwardRef 默认的类型定义。
// 这是因为 React.forwardRef 本身对泛型组件的支持不太友好。
type TableComponent = <TData = unknown>(
  props: GZDTableProps<TData> & React.RefAttributes<AgGridReactInstance<TData>>,
) => React.ReactElement | null;

// 定义 gzd Table 组件
const Table = forwardRef<AgGridReactInstance, GZDTableProps>((props, ref) => {
  // 最外层容器的引用，用于绕过 React 直接操作 DOM 以优化滚动性能
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 从全局上下文获取当前的明暗主题模式 (gold-dark / gold-light)
  const { themeMode } = useContext(GZDConfigContext);
  const { gridOptions } = props;

  // 1. 确定是否开启分页（优先级：props > gridOptions > 默认值）
  const pagination =
    props.pagination ?? gridOptions?.pagination ?? DEFAULT_GRID_OPTIONS.pagination;

  // 2. 确定分页器布局
  const customPaginationPanels =
    props.paginationPanels ?? gridOptions?.paginationPanels;

  // 如果开启了分页，并且没有传自定义的布局，就使用我们定制的极简布局
  const usesDefaultPaginationLayout: boolean =
    pagination && customPaginationPanels === undefined;

  // 确定最终的分页器布局
  const paginationPanels = usesDefaultPaginationLayout
    ? DEFAULT_PAGINATION_PANELS
    : customPaginationPanels;

  // 3. 确定最终的 AG Grid 主题对象
  const themeModeTheme =
    themeMode === "gold-dark"
      ? goldDarkTableTheme
      : themeMode === "gold-light"
        ? goldLightTableTheme
        : undefined;

  // AG Grid React 会忽略运行时 gridOptions 对象本身的变化；将最终主题提升到顶层
  // theme 属性，才能让明暗模式切换触发 AG Grid 的主题服务更新。
  const resolvedTheme = props.theme ?? gridOptions?.theme ?? themeModeTheme;

  // 合并全局 Grid 配置
  // 为什么不创建一个大一统的 mergedProps 把所有配置全合并了？
  // 核心是为了顺应 AG Grid 的“动静分离”设计，并优化 React 渲染性能：
  // 1. 角色分离：gridOptions 适合存放静态的、初始化的配置（如分页布局）；而直接的 props 适合存放动态状态（如 rowData、事件）。
  // 2. 避免无意义的重计算：如果合并所有 props，会导致 useMemo 依赖整个 props 对象。任何无关状态的变化都会触发大对象的重新生成。
  // 3. 避免底层重渲染：将稳定的 gridOptions 和动态的 props 分开传递，可以防止因对象引用频繁变化而触发底层 AG Grid 昂贵的 Deep Diff 和重渲染。
  const mergedGridOptions = useMemo(
    () => ({
      ...DEFAULT_GRID_OPTIONS,
      ...gridOptions,
      paginationPanels,
    }),
    [gridOptions, paginationPanels],
  );

  // 合并多语言配置（主要是中文支持）
  const localeText = useMemo(
    () => ({
      ...DEFAULT_GRID_OPTIONS.localeText,
      ...gridOptions?.localeText,
      ...props.localeText,
    }),
    [gridOptions?.localeText, props.localeText],
  );

  // 合并类名
  const mergedClassName = [
    "gzd-table",
    pagination ? "gzd-table-pagination" : undefined,
    usesDefaultPaginationLayout
      ? "gzd-table-default-pagination-layout"
      : undefined,
    themeMode === "gold-dark" ? "gzd-table-gold-dark" : undefined,
    themeMode === "gold-light" ? "gzd-table-gold-light" : undefined,
    props.className,
  ]
    .filter(Boolean)
    .join(" ");

  // 合并默认列定义
  // 合并默认列定义时，要优先考虑 props 中的配置，因为 props 中的配置是运行时的，而 gridOptions 中的配置是初始化时。
  // 如果 props 中没有配置，再考虑 gridOptions 中的配置。
  const defaultColDef = useMemo(
    () => ({
      ...DEFAULT_COL_DEF,
      ...gridOptions?.defaultColDef,
      ...props.defaultColDef,
    }),
    [gridOptions?.defaultColDef, props.defaultColDef],
  );

  // ============================================================================
  // 横向滚动 Ping 效果逻辑 (纯函数组合与直接 DOM 操作)
  // ============================================================================

  // 核心纯函数：根据滚动容器的实际 DOM 状态，计算并更新 Ping 类名
  const updatePingClasses = useCallback((api: GridApi) => {
    const wrapperElement = wrapperRef.current;
    if (!wrapperElement || !api) return;

    // 获取 AG Grid 内部的横向滚动视口容器
    const scrollViewport = wrapperElement.querySelector('.ag-body-horizontal-scroll-viewport');

    if (scrollViewport) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollViewport;

      // 左侧是否滚动过（只要 scrollLeft 大于 0，左侧固定列就应该显示右边框）
      const isPingLeft = scrollLeft > 0;

      // 右侧是否滚动到底部（由于精度问题，减去 1px 作为容差）
      const isPingRight = Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1;

      // 遵循底层直接操作以优化性能的原则
      wrapperElement.classList.toggle('gzd-table-ping-left', isPingLeft);
      wrapperElement.classList.toggle('gzd-table-ping-right', isPingRight);
    } else {
      // 若没有出现横向滚动条，则清除所有的 ping 类名
      wrapperElement.classList.remove('gzd-table-ping-left', 'gzd-table-ping-right');
    }
  }, []);

  // ============================================================================
  // 横向滚动事件监听器
  // ============================================================================
  // 事件监听器：当表格发生滚动时触发
  // ============================================================================

  // 事件监听器：当表格发生滚动时触发
  const handleBodyScroll = useCallback((event: BodyScrollEvent) => {
    // 仅响应横向滚动
    if (event.direction === 'horizontal') {
      updatePingClasses(event.api);
    }
    // 调用用户可能传入的其他 onBodyScroll 处理函数
    if (props.onBodyScroll) props.onBodyScroll(event);
    if (gridOptions?.onBodyScroll) gridOptions.onBodyScroll(event);
  }, [updatePingClasses, props.onBodyScroll, gridOptions?.onBodyScroll]);

  // 事件监听器：当表格尺寸、列显示状态、数据模型等发生变化时，需要重新校验滚动状态
  const handleGridReady = useCallback((event: GridReadyEvent) => {
    updatePingClasses(event.api);
    if (props.onGridReady) props.onGridReady(event);
    if (gridOptions?.onGridReady) gridOptions.onGridReady(event);
  }, [updatePingClasses, props.onGridReady, gridOptions?.onGridReady]);

  const handleGridSizeChanged = useCallback((event: GridSizeChangedEvent) => {
    updatePingClasses(event.api);
    if (props.onGridSizeChanged) props.onGridSizeChanged(event);
    if (gridOptions?.onGridSizeChanged) gridOptions.onGridSizeChanged(event);
  }, [updatePingClasses, props.onGridSizeChanged, gridOptions?.onGridSizeChanged]);

  const handleModelUpdated = useCallback((event: ModelUpdatedEvent) => {
    updatePingClasses(event.api);
    if (props.onModelUpdated) props.onModelUpdated(event);
    if (gridOptions?.onModelUpdated) gridOptions.onModelUpdated(event);
  }, [updatePingClasses, props.onModelUpdated, gridOptions?.onModelUpdated]);

  const handleDisplayedColumnsChanged = useCallback((event: DisplayedColumnsChangedEvent) => {
    updatePingClasses(event.api);
    if (props.onDisplayedColumnsChanged) props.onDisplayedColumnsChanged(event);
    if (gridOptions?.onDisplayedColumnsChanged) gridOptions.onDisplayedColumnsChanged(event);
  }, [updatePingClasses, props.onDisplayedColumnsChanged, gridOptions?.onDisplayedColumnsChanged]);

  // 4. 定制基线右键菜单 (Context Menu)
  // 根据产品需求：如果当前表格存在行分组，默认提供“展开全部行组”和“收起全部行组”操作。
  const userGetContextMenuItems = props.getContextMenuItems ?? gridOptions?.getContextMenuItems;

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams) => {
      // 将原生的 "copy" (复制当前选中单元格) 改为自定义的“整行复制”逻辑
      // 顺应业务需求：即便用户只右键点击了某一个单元格，点击“整行复制”后，也会复制该单元格所在整行的数据
      const customCopyRowItem = {
        name: "复制整行数据",
        icon: '<span class="ag-icon ag-icon-copy" unselectable="on" role="presentation"></span>',
        action: () => {
          const node = params.node;
          if (!node || !node.data) return;

          // 获取所有可见的列定义 (V31+ API)
          const columns = params.api.getAllDisplayedColumns() || [];

          // 提取整行数据并按列顺序格式化为制表符分隔的字符串 (用于粘贴到 Excel)
          const rowDataString = columns
            .map((col: any) => {
              const colId = col.getColId();
              // 获取当前单元格的值 (V31+ 推荐直接从 data 中获取)
              const value = node.data[colId];
              // 简单处理：如果是对象或数组，转为 JSON 字符串；否则转为字符串
              return typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
            })
            .join('\t');

          // 写入剪贴板 (兼容非安全上下文，如 HTTP 协议下的开发环境)
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(rowDataString).catch(err => {
              console.error("复制整行数据失败: ", err);
            });
          } else {
            // 降级方案：使用 document.execCommand
            const textArea = document.createElement("textarea");
            textArea.value = rowDataString;
            // 确保文本域不可见且不影响页面布局
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand('copy');
            } catch (err) {
              console.error('降级复制失败', err);
            }
            textArea.remove();
          }
        }
      };

      // 提取 AG Grid 原生生成的默认菜单项（如复制、导出等）
      let defaultItems = params.defaultItems || [];
      const copyIndex = defaultItems.indexOf("copy");
      if (copyIndex !== -1) {
        // 我们将原生的 copy 替换为自定义的 customCopyRowItem (忽略类型校验以兼容 AG Grid 的混合类型)
        (defaultItems as any)[copyIndex] = customCopyRowItem;
      }

      // 检查当前表格是否处于“行分组”状态
      // 通过 api 获取当前所有的分组列，如果有值，说明开启了分组
      const isRowGrouping = params.api.getRowGroupColumns().length > 0;

      if (isRowGrouping) {
        // 在原生菜单的基础上，追加基线要求的分组操作项
        defaultItems = [
          ...defaultItems,
          "separator",
          "expandAll",
          "contractAll", // AG Grid 中“收起全部”对应的内部指令是 contractAll
        ];
      }

      // 如果开发者（外部 props 或 gridOptions）自定义了 getContextMenuItems
      // 遵循函数式编程组合的哲学，我们将修改后的 defaultItems 交给外部函数处理
      if (userGetContextMenuItems) {
        return userGetContextMenuItems({
          ...params,
          defaultItems,
        });
      }

      return defaultItems;
    },
    [userGetContextMenuItems]
  );

  return (
    <div ref={wrapperRef} className="gzd-table-wrapper" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <AgGridProvider
        modules={ENTERPRISE_MODULES}
        licenseKey={AG_GRID_ENTERPRISE_LICENSE}
      >
        <AgGridReact
          ref={ref}
          {...props}
          gridOptions={mergedGridOptions}
          {...(resolvedTheme === undefined ? {} : { theme: resolvedTheme })}
          className={mergedClassName || undefined}
          defaultColDef={defaultColDef}
          localeText={localeText}
          getContextMenuItems={getContextMenuItems}
          onBodyScroll={handleBodyScroll}
          onGridReady={handleGridReady}
          onGridSizeChanged={handleGridSizeChanged}
          onModelUpdated={handleModelUpdated}
          onDisplayedColumnsChanged={handleDisplayedColumnsChanged}
        />
      </AgGridProvider>
    </div>
  );
}) as TableComponent;

export default Table;
