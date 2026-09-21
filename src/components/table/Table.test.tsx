import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_CN } from "@ag-grid-community/locale";
import { themeQuartz, type PaginationPanel } from "ag-grid-community";
import { createRef, type ComponentType } from "react";
import ConfigProvider from "../config-provider";

const { agGridPropsSpy, agGridRawPropsSpy, agGridProviderPropsSpy } = vi.hoisted(() => ({
  agGridPropsSpy: vi.fn(),
  agGridRawPropsSpy: vi.fn(),
  agGridProviderPropsSpy: vi.fn(),
}));

type MockAgGridProps = {
  gridOptions?: Omit<MockAgGridProps, "gridOptions">;
  rowData?: unknown[];
  columnDefs?: unknown[];
  headerHeight?: number;
  rowHeight?: number;
  suppressContextMenu?: boolean;
  suppressColumnMoveAnimation?: boolean;
  suppressCellFocus?: boolean;
  suppressDragLeaveHidesColumns?: boolean;
  defaultColDef?: Record<string, unknown>;
  theme?: unknown;
  enableCellTextSelection?: boolean;
  noRowsOverlayComponent?: ComponentType;
  localeText?: Record<string, string>;
  className?: string;
  pagination?: boolean;
  paginationPanels?: PaginationPanel[];
};

// 拦截并深度 Mock AG Grid 的底层 React 组件。
// 为什么这样做？
// 1. AG Grid 是一个极度复杂的庞然大物，在 jsdom（无真实浏览器）环境中强行渲染极易报错。
// 2. 避免测试运行极其缓慢。
// 我们用一个极简的“空壳组件”替换掉真正的 AgGridReact，只负责把合并后的 props 记录下来。
vi.mock("ag-grid-react", async () => {
  const React = await import("react");

  const AgGridProvider = ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    modules?: unknown[];
    licenseKey?: string;
  }) => {
    // 记录 Provider 收到的属性（比如 License Key）
    agGridProviderPropsSpy(props);
    return <>{children}</>;
  };

  const AgGridReact = React.forwardRef<HTMLDivElement, MockAgGridProps>((props, ref) => {
    // 记录传入的最原始的 props
    agGridRawPropsSpy(props);
    
    // 模拟内部合并逻辑：将散落的 props 覆盖到 gridOptions 上
    const { gridOptions, ...reactProps } = props;
    const definedReactProps = Object.fromEntries(
      Object.entries(reactProps).filter(([, value]) => value !== undefined),
    );
    const resolvedProps = {
      ...gridOptions,
      ...definedReactProps,
    } as MockAgGridProps;

    // 关键点：记录最终合并后的 props，方便我们在测试用例中断言配置是否正确传入
    agGridPropsSpy(resolvedProps);
    const NoRowsOverlay = resolvedProps.noRowsOverlayComponent;

    // 渲染一个包含所有配置数据（序列化为 data-xxx 属性）的空 DIV
    return (
      <div
        ref={ref}
        className={resolvedProps.className}
        data-testid="ag-grid-react"
        data-row-data={JSON.stringify(resolvedProps.rowData)}
        data-column-defs={JSON.stringify(resolvedProps.columnDefs)}
        data-view-props={JSON.stringify({
          headerHeight: resolvedProps.headerHeight,
          rowHeight: resolvedProps.rowHeight,
          suppressContextMenu: resolvedProps.suppressContextMenu,
          suppressColumnMoveAnimation: resolvedProps.suppressColumnMoveAnimation,
          suppressCellFocus: resolvedProps.suppressCellFocus,
          suppressDragLeaveHidesColumns:
            resolvedProps.suppressDragLeaveHidesColumns,
        })}
      >
        {NoRowsOverlay ? <NoRowsOverlay /> : null}
      </div>
    );
  });

  return { AgGridProvider, AgGridReact };
});

import Table from "./index";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Table", () => {
  it("adds the gold-dark scope class and preserves the caller class", () => {
    render(
      <ConfigProvider themeMode="gold-dark">
        <Table className="consumer-table" rowData={[]} columnDefs={[]} />
      </ConfigProvider>,
    );

    const grid = screen.getByTestId("ag-grid-react");
    expect(grid.classList.contains("gzd-table")).toBe(true);
    expect(grid.classList.contains("gzd-table-gold-dark")).toBe(true);
    expect(grid.classList.contains("consumer-table")).toBe(true);
  });

  it("does not add the gold-dark scope class in other theme modes", () => {
    render(
      <ConfigProvider themeMode="gold-light">
        <Table className="consumer-table" rowData={[]} columnDefs={[]} />
      </ConfigProvider>,
    );

    const grid = screen.getByTestId("ag-grid-react");
    expect(grid.classList.contains("gzd-table")).toBe(true);
    expect(grid.classList.contains("gzd-table-gold-dark")).toBe(false);
    expect(grid.classList.contains("gzd-table-gold-light")).toBe(true);
    expect(grid.classList.contains("consumer-table")).toBe(true);
  });

  it("uses the default pagination layout for every theme mode", () => {
    render(
      <ConfigProvider themeMode="gold-light">
        <Table pagination rowData={[]} columnDefs={[]} />
      </ConfigProvider>,
    );

    const grid = screen.getByTestId("ag-grid-react");
    const gridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;

    expect(grid.classList.contains("gzd-table-pagination")).toBe(true);
    expect(grid.classList.contains("gzd-table-default-pagination-layout")).toBe(true);
    expect(gridProps.paginationPanels).toEqual([
      "rowSummary",
      "pageSize",
      "pageSummary",
    ]);
  });

  it("preserves custom pagination panels and disables the default layout", () => {
    const paginationPanels: PaginationPanel[] = [
      "pageSize",
      { type: "pageSummary", suppressPageInput: true },
    ];

    render(
      <Table
        pagination
        paginationPanels={paginationPanels}
        rowData={[]}
        columnDefs={[]}
      />,
    );

    const grid = screen.getByTestId("ag-grid-react");
    const gridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;

    expect(grid.classList.contains("gzd-table-pagination")).toBe(true);
    expect(grid.classList.contains("gzd-table-default-pagination-layout")).toBe(false);
    expect(gridProps.paginationPanels).toBe(paginationPanels);
  });

  it("provides the Enterprise modules and license to the grid", () => {
    render(<Table rowData={[]} columnDefs={[]} />);

    const providerProps = agGridProviderPropsSpy.mock.lastCall?.[0] as
      | {
          modules?: Array<{
            moduleName?: string;
            dependsOn?: Array<{ moduleName?: string }>;
          }>;
          licenseKey?: string;
        }
      | undefined;

    expect(providerProps?.modules).toEqual([
      expect.objectContaining({ moduleName: "AllEnterprise" }),
    ]);
    expect(
      providerProps?.modules?.[0]?.dependsOn?.some(
        ({ moduleName }) => moduleName === "IntegratedCharts",
      ) ?? false,
    ).toBe(false);
    expect(providerProps?.licenseKey).toBeTruthy();
  });

  it("uses the Quartz theme as the default grid theme", () => {
    render(<Table rowData={[]} columnDefs={[]} />);

    const gridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;
    const themeParts = (
      gridProps.theme as { parts?: Array<{ feature?: string }> } | undefined
    )?.parts;

    expect(themeParts?.some(({ feature }) => feature === "styleQuartz")).toBe(
      true,
    );
  });

  it("applies the generated AG Grid tokens for both gold theme modes", () => {
    render(
      <ConfigProvider themeMode="gold-dark">
        <Table rowData={[]} columnDefs={[]} />
      </ConfigProvider>,
    );

    const goldDarkGridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;
    const goldDarkThemeCss = (
      goldDarkGridProps.theme as { _getParamsCss: () => string }
    )._getParamsCss();

    expect(goldDarkThemeCss).toContain(
      "--ag-accent-color: var(--ag-inherited-accent-color, #FFE7CB)",
    );
    expect(goldDarkThemeCss).toContain(
      "--ag-header-height: var(--ag-inherited-header-height, 32px)",
    );
    expect(goldDarkThemeCss).toContain(
      "--ag-row-height: var(--ag-inherited-row-height, 28px)",
    );
    expect(goldDarkThemeCss).toContain(
      "--ag-wrapper-background-color: var(--ag-inherited-wrapper-background-color, var(--ag-background-color))",
    );
    expect(goldDarkThemeCss).toContain("var(--gzd-font-family)");
    expect(goldDarkGridProps.headerHeight).toBeUndefined();
    expect(agGridRawPropsSpy.mock.lastCall?.[0]?.theme).toBeDefined();

    cleanup();
    vi.clearAllMocks();

    render(
      <ConfigProvider themeMode="gold-light">
        <Table rowData={[]} columnDefs={[]} />
      </ConfigProvider>,
    );

    const lightGridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;
    const lightThemeCss = (
      lightGridProps.theme as { _getParamsCss: () => string }
    )._getParamsCss();

    expect(lightThemeCss).toContain(
      "--ag-accent-color: var(--ag-inherited-accent-color, #0083FF)",
    );
    expect(lightThemeCss).toContain(
      "browser-color-scheme: var(--ag-inherited-browser-color-scheme, light)",
    );
    expect(lightThemeCss).toContain(
      "--ag-wrapper-background-color: var(--ag-inherited-wrapper-background-color, var(--ag-background-color))",
    );
    expect(agGridRawPropsSpy.mock.lastCall?.[0]?.theme).toBeDefined();
  });

  it("updates the top-level AG Grid theme when the theme mode changes", () => {
    const { rerender } = render(
      <ConfigProvider themeMode="gold-dark">
        <Table rowData={[]} columnDefs={[]} />
      </ConfigProvider>,
    );

    const darkTheme = agGridRawPropsSpy.mock.lastCall?.[0]?.theme;

    rerender(
      <ConfigProvider themeMode="gold-light">
        <Table rowData={[]} columnDefs={[]} />
      </ConfigProvider>,
    );

    const lightTheme = agGridRawPropsSpy.mock.lastCall?.[0]?.theme as {
      _getParamsCss: () => string;
    };

    expect(lightTheme).not.toBe(darkTheme);
    expect(lightTheme._getParamsCss()).toContain(
      "--ag-accent-color: var(--ag-inherited-accent-color, #0083FF)",
    );
  });

  it("keeps gridOptions.theme above the gold-dark default theme", () => {
    render(
      <ConfigProvider themeMode="gold-dark">
        <Table
          gridOptions={{ theme: themeQuartz }}
          rowData={[]}
          columnDefs={[]}
        />
      </ConfigProvider>,
    );

    const gridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;
    expect(gridProps.theme).toBe(themeQuartz);
  });

  it("keeps the top-level theme above gridOptions.theme", () => {
    const gridTheme = themeQuartz.withParams({ accentColor: "red" });

    render(
      <ConfigProvider themeMode="gold-dark">
        <Table
          gridOptions={{ theme: themeQuartz }}
          theme={gridTheme}
          rowData={[]}
          columnDefs={[]}
        />
      </ConfigProvider>,
    );

    const gridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;
    expect(gridProps.theme).toBe(gridTheme);
  });

  it("hides header menu buttons by default", () => {
    render(<Table rowData={[]} columnDefs={[]} />);

    const gridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;
    expect(gridProps.defaultColDef).toMatchObject({
      suppressHeaderMenuButton: true,
    });
  });

  it("forwards AG Grid props and ref to AgGridReact", () => {
    const rowData = [{ make: "Tesla" }];
    const columnDefs = [{ field: "make" }];
    const ref = createRef<AgGridReact>();

    render(<Table ref={ref} rowData={rowData} columnDefs={columnDefs} />);

    const grid = screen.getByTestId("ag-grid-react");
    expect(grid.getAttribute("data-row-data")).toBe(JSON.stringify(rowData));
    expect(grid.getAttribute("data-column-defs")).toBe(JSON.stringify(columnDefs));
    expect(ref.current).toBe(grid);
  });

  it("provides default size, scrollbar, and interaction props", () => {
    render(<Table rowData={[]} columnDefs={[]} />);

    const grid = screen.getByTestId("ag-grid-react");
    expect(JSON.parse(grid.getAttribute("data-view-props") ?? "{}")).toEqual({
      suppressContextMenu: true,
      suppressColumnMoveAnimation: true,
      suppressCellFocus: true,
      suppressDragLeaveHidesColumns: true,
    });
  });

  it("allows every view default to be overridden", () => {
    render(
      <Table
        rowData={[]}
        columnDefs={[]}
        headerHeight={40}
        rowHeight={36}
        suppressContextMenu={false}
        suppressColumnMoveAnimation={false}
        suppressCellFocus={false}
        suppressDragLeaveHidesColumns={false}
      />,
    );

    const grid = screen.getByTestId("ag-grid-react");
    expect(JSON.parse(grid.getAttribute("data-view-props") ?? "{}")).toEqual({
      headerHeight: 40,
      rowHeight: 36,
      suppressContextMenu: false,
      suppressColumnMoveAnimation: false,
      suppressCellFocus: false,
      suppressDragLeaveHidesColumns: false,
    });
  });

  it("allows gridOptions to override Table defaults", () => {
    render(
      <Table
        gridOptions={{
          rowHeight: 36,
          suppressContextMenu: false,
          pagination: true,
          defaultColDef: {
            sortable: false,
            filter: true,
          },
        }}
        rowData={[]}
        columnDefs={[]}
      />,
    );

    const grid = screen.getByTestId("ag-grid-react");
    const gridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;

    expect(JSON.parse(grid.getAttribute("data-view-props") ?? "{}")).toMatchObject({
      rowHeight: 36,
      suppressContextMenu: false,
    });
    expect(grid.classList.contains("gzd-table-pagination")).toBe(true);
    expect(grid.classList.contains("gzd-table-default-pagination-layout")).toBe(true);
    expect(gridProps.paginationPanels).toEqual([
      "rowSummary",
      "pageSize",
      "pageSummary",
    ]);
    expect(gridProps.defaultColDef).toEqual({
      sortable: false,
      resizable: true,
      suppressHeaderMenuButton: true,
      filter: true,
    });
  });

  it("gives top-level props priority over gridOptions", () => {
    render(
      <Table
        gridOptions={{
          rowHeight: 36,
          suppressContextMenu: false,
          pagination: true,
          defaultColDef: {
            sortable: false,
            filter: true,
          },
        }}
        rowHeight={42}
        suppressContextMenu
        pagination={false}
        defaultColDef={{
          sortable: true,
          filter: false,
        }}
        rowData={[]}
        columnDefs={[]}
      />,
    );

    const grid = screen.getByTestId("ag-grid-react");
    const gridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;

    expect(JSON.parse(grid.getAttribute("data-view-props") ?? "{}")).toMatchObject({
      rowHeight: 42,
      suppressContextMenu: true,
    });
    expect(grid.classList.contains("gzd-table-pagination")).toBe(false);
    expect(grid.classList.contains("gzd-table-default-pagination-layout")).toBe(false);
    expect(gridProps.paginationPanels).toBeUndefined();
    expect(gridProps.defaultColDef).toEqual({
      sortable: true,
      resizable: true,
      suppressHeaderMenuButton: true,
      filter: false,
    });
  });

  it("merges localeText by field with the expected priority", () => {
    render(
      <Table
        gridOptions={{
          localeText: {
            page: "Grid page",
            noRowsToShow: "Grid no rows",
          },
        }}
        localeText={{
          noRowsToShow: "Props no rows",
        }}
        rowData={[]}
        columnDefs={[]}
      />,
    );

    const gridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;

    expect(gridProps.localeText).toMatchObject({
      nextPage: AG_GRID_LOCALE_CN.nextPage,
      page: "Grid page",
      noRowsToShow: "Props no rows",
    });
  });

  it("provides the five core configuration defaults", () => {
    render(<Table rowData={[]} columnDefs={[]} />);

    const gridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;
    const themeCss = (
      gridProps.theme as { _getParamsCss: () => string } | undefined
    )?._getParamsCss();

    expect(gridProps.defaultColDef).toEqual({
      sortable: true,
      resizable: true,
      suppressHeaderMenuButton: true,
    });
    expect(gridProps.enableCellTextSelection).toBe(true);
    expect(gridProps.noRowsOverlayComponent).toBeTypeOf("function");
    expect(gridProps.localeText).toEqual(AG_GRID_LOCALE_CN);
    expect(themeCss).toContain(
      "--ag-header-height: var(--ag-inherited-header-height, 31px)",
    );
    expect(themeCss).toContain(
      "--ag-row-height: var(--ag-inherited-row-height, 28px)",
    );
    expect(themeCss).toContain(
      "--ag-font-size: var(--ag-inherited-font-size, calc(var(--gzd-font-size) * 1px))",
    );
    expect(themeCss).toContain(
      "--ag-header-font-size: var(--ag-inherited-header-font-size, calc(var(--gzd-font-size) * 1px))",
    );
    expect(themeCss).toContain(
      "--ag-wrapper-background-color: var(--ag-inherited-wrapper-background-color, var(--ag-background-color))",
    );
    expect(themeCss).toContain(
      "--ag-header-background-color: var(--ag-inherited-header-background-color, var(--gzd-components-table-header-bg, var(--gzd-color-border)))",
    );
    expect(themeCss).toContain(
      "--ag-header-text-color: var(--ag-inherited-header-text-color, var(--gzd-components-table-header-text-color, var(--gzd-color-text-secondary)))",
    );
    expect(themeCss).toContain(
      "--ag-header-column-border: var(--ag-inherited-header-column-border, solid 2px var(--gzd-color-split))",
    );
    expect(themeCss).toContain(
      "--ag-header-column-border-height: var(--ag-inherited-header-column-border-height, 14px)",
    );
    expect(themeCss).toContain(
      "--ag-pinned-column-border: var(--ag-inherited-pinned-column-border, solid 1px var(--gzd-color-split))",
    );
    expect(themeCss).toContain(
      "--ag-border-color: var(--ag-inherited-border-color, var(--gzd-components-table-border-color, var(--gzd-color-border)))",
    );
    expect(themeCss).toContain(
      "--ag-odd-row-background-color: var(--ag-inherited-odd-row-background-color, var(--gzd-color-bg-container))",
    );
    expect(themeCss).toContain(
      "--ag-background-color: var(--ag-inherited-background-color, var(--gzd-color-bg-container))",
    );
    expect(themeCss).toContain(
      "--ag-foreground-color: var(--ag-inherited-foreground-color, var(--gzd-color-text))",
    );
    expect(themeCss).toContain(
      "--ag-pagination-panel-height: var(--ag-inherited-pagination-panel-height, 40px)",
    );
    const emptyText = screen.getByText("暂无符合条件的数据");
    expect(emptyText.classList.contains("gzd-table-no-rows-overlay")).toBe(true);
    expect(emptyText.getAttribute("role")).toBe("status");
    expect(emptyText.getAttribute("style")).toBeNull();
  });

  it("uses runtime design tokens for the basic grid theme", () => {
    render(<Table rowData={[]} columnDefs={[]} />);

    const gridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;
    const themeCss = (
      gridProps.theme as { _getParamsCss: () => string } | undefined
    )?._getParamsCss();

    expect(themeCss).toContain(
      "--ag-font-family: var(--ag-inherited-font-family, var(--gzd-font-family))",
    );
    expect(themeCss).toContain(
      "--ag-font-size: var(--ag-inherited-font-size, calc(var(--gzd-font-size) * 1px))",
    );
    expect(themeCss).toContain(
      "--ag-header-font-weight: var(--ag-inherited-header-font-weight, var(--gzd-font-weight-normal))",
    );
    expect(themeCss).toContain(
      "--ag-cell-horizontal-padding: var(--ag-inherited-cell-horizontal-padding, calc(var(--gzd-padding-xs) * 1px))",
    );
    expect(themeCss).toContain(
      "--ag-odd-row-background-color: var(--ag-inherited-odd-row-background-color, var(--gzd-color-bg-container))",
    );
    expect(themeCss).toContain(
      "--ag-row-hover-color: var(--ag-inherited-row-hover-color, color-mix(in srgb, transparent, var(--gzd-color-primary) 15%))",
    );
    expect(themeCss).toContain(
      "--ag-selected-row-background-color: var(--ag-inherited-selected-row-background-color, color-mix(in srgb, transparent, var(--gzd-color-primary) 12%))",
    );
  });

  it("uses runtime design tokens for selection checkboxes", () => {
    render(<Table rowData={[]} columnDefs={[]} />);

    const gridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;
    const themeCss = (
      gridProps.theme as { _getParamsCss: () => string } | undefined
    )?._getParamsCss();

    expect(themeCss).toContain(
      "--ag-icon-size: var(--ag-inherited-icon-size, calc(var(--gzd-checkbox-size) * 1px))",
    );
    expect(themeCss).toContain(
      "--ag-focus-shadow: var(--ag-inherited-focus-shadow, 0px 0px 0px 0px var(--ag-foreground-color))",
    );
    expect(themeCss).toContain(
      "--ag-checkbox-border-radius: var(--ag-inherited-checkbox-border-radius, calc(var(--gzd-border-radius-sm) * 1px))",
    );
    expect(themeCss).toContain(
      "--ag-checkbox-border-width: var(--ag-inherited-checkbox-border-width, 1px)",
    );
    expect(themeCss).toContain(
      "--ag-checkbox-unchecked-background-color: var(--ag-inherited-checkbox-unchecked-background-color, var(--gzd-color-bg-container))",
    );
    expect(themeCss).toContain(
      "--ag-checkbox-unchecked-border-color: var(--ag-inherited-checkbox-unchecked-border-color, var(--gzd-color-border-secondary))",
    );
    expect(themeCss).toContain(
      "--ag-checkbox-checked-background-color: var(--ag-inherited-checkbox-checked-background-color, var(--gzd-color-primary))",
    );
    expect(themeCss).toContain(
      "--ag-checkbox-checked-border-color: var(--ag-inherited-checkbox-checked-border-color, var(--gzd-color-primary))",
    );
    expect(themeCss).toContain(
      "--ag-checkbox-checked-shape-color: var(--ag-inherited-checkbox-checked-shape-color, var(--gzd-color-text-on-light))",
    );
    expect(themeCss).toContain(
      "--ag-checkbox-indeterminate-background-color: var(--ag-inherited-checkbox-indeterminate-background-color, var(--gzd-color-primary))",
    );
    expect(themeCss).toContain(
      "--ag-checkbox-indeterminate-border-color: var(--ag-inherited-checkbox-indeterminate-border-color, var(--gzd-color-primary))",
    );
    expect(themeCss).toContain(
      "--ag-checkbox-indeterminate-shape-color: var(--ag-inherited-checkbox-indeterminate-shape-color, var(--gzd-color-text-on-light))",
    );
  });

  it("merges column defaults and allows every core default to be overridden", () => {
    const CustomNoRowsOverlay = () => <span>Custom empty state</span>;
    const customLocaleText = {
      noRowsToShow: "Custom no rows text",
    };

    render(
      <Table
        rowData={[]}
        columnDefs={[]}
        defaultColDef={{
          sortable: false,
          resizable: false,
          filter: true,
          suppressHeaderMenuButton: false,
        }}
        theme={themeQuartz}
        enableCellTextSelection={false}
        noRowsOverlayComponent={CustomNoRowsOverlay}
        localeText={customLocaleText}
      />,
    );

    const gridProps = agGridPropsSpy.mock.lastCall?.[0] as MockAgGridProps;
    expect(gridProps.defaultColDef).toEqual({
      sortable: false,
      resizable: false,
      filter: true,
      suppressHeaderMenuButton: false,
    });
    expect(gridProps.theme).toBe(themeQuartz);
    expect(gridProps.enableCellTextSelection).toBe(false);
    expect(gridProps.noRowsOverlayComponent).toBe(CustomNoRowsOverlay);
    expect(gridProps.localeText).toMatchObject({
      nextPage: AG_GRID_LOCALE_CN.nextPage,
      noRowsToShow: "Custom no rows text",
    });
    expect(screen.getByText("Custom empty state")).toBeTruthy();
  });
});
