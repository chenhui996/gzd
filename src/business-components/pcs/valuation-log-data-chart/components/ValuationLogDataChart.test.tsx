import type { ComponentType } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ColDef } from "../../../../gzd-table";
import type {
  FinancialData,
  ValuationLogAdapter,
  ValuationLogItem,
  ValuationLogMetric,
  ValuationLogRequestContext,
  ValuationLogRequestParams,
} from "../types";
import { formatValuationLogEndTime } from "../utils";

interface MockTableRow extends ValuationLogItem {
  rowId: string;
}

interface MockTableProps {
  rowData?: MockTableRow[];
  columnDefs?: ColDef<MockTableRow>[];
  noRowsOverlayComponent?: ComponentType;
}

interface MockLineChartProps {
  data: readonly ValuationLogItem[];
  metric: ValuationLogMetric;
  currency: string;
}

const { lineChartPropsSpy, messageErrorSpy, messageApi, tablePropsSpy } =
  vi.hoisted(() => {
    const error = vi.fn();
    return {
      lineChartPropsSpy: vi.fn(),
      messageErrorSpy: error,
      messageApi: { error },
      tablePropsSpy: vi.fn(),
    };
  });

vi.mock("../../../../components/app", () => ({
  default: {
    useApp: () => ({ message: messageApi }),
  },
}));

vi.mock("../../../../components/table", async () => {
  const React = await import("react");
  return {
    default: (props: MockTableProps) => {
      tablePropsSpy(props);
      const EmptyOverlay = props.noRowsOverlayComponent;
      return (
        <div data-testid="valuation-table">
          {props.rowData?.length === 0 && EmptyOverlay
            ? React.createElement(EmptyOverlay)
            : null}
        </div>
      );
    },
  };
});

vi.mock("./ValuationLineChart", () => ({
  default: (props: MockLineChartProps) => {
    lineChartPropsSpy(props);
    return <div role="img" aria-label={`mock-${props.metric}-chart`} />;
  },
}));

import ValuationLogDataChart from "./ValuationLogDataChart";

const ALL_VAR_CODE_SNUM = "340480468745060362";

const financialData: FinancialData[] = [
  {
    allVarCodeSnum: ALL_VAR_CODE_SNUM,
    busnsDate: "20260716",
    valtnPrice: "65000",
    mval: "28000",
    tradeCrrc: "CNY",
  },
  {
    allVarCodeSnum: ALL_VAR_CODE_SNUM,
    busnsDate: "20260717",
    valtnPrice: "68000",
    mval: "32000",
    tradeCrrc: "CNY",
  },
];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ValuationLogDataChart", () => {
  it("初始化时展示 Loading，并通过 Adapter 请求近 30 日数据", async () => {
    let resolveRequest: ((value: readonly FinancialData[]) => void) | undefined;
    const getValuationLogs = vi.fn(
      () =>
        new Promise<readonly FinancialData[]>((resolve) => {
          resolveRequest = resolve;
        }),
    );

    render(
      <ValuationLogDataChart
        adapter={{ getValuationLogs }}
        allVarCodeSnum={ALL_VAR_CODE_SNUM}
      />,
    );

    expect(screen.getByRole("heading", { name: "估值日志（最大展示30条日志数据）" })).toBeTruthy();
    const root = screen.getByLabelText("估值日志数据图表");
    expect(root.getAttribute("data-status")).toBe("loading");
    expect(getValuationLogs).toHaveBeenCalledWith(
      {
        allVarCodeSnum: ALL_VAR_CODE_SNUM,
        endTime: formatValuationLogEndTime(new Date()),
        size: "30",
      },
      { signal: expect.any(AbortSignal) },
    );

    await act(async () => resolveRequest?.(financialData));
    await waitFor(() => expect(root.getAttribute("data-status")).toBe("success"));
  });

  it("表格倒序展示完整数据，图表正序展示并支持切换 NPV", async () => {
    const adapter: ValuationLogAdapter = {
      getValuationLogs: vi.fn().mockResolvedValue(financialData),
    };
    render(
      <ValuationLogDataChart
        adapter={adapter}
        allVarCodeSnum={ALL_VAR_CODE_SNUM}
      />,
    );

    await screen.findByLabelText("mock-price-chart");
    const tableProps = tablePropsSpy.mock.lastCall?.[0] as MockTableProps;
    const lineProps = lineChartPropsSpy.mock.lastCall?.[0] as MockLineChartProps;

    expect(tableProps.rowData?.map(({ date }) => date)).toEqual([
      "2026-07-17",
      "2026-07-16",
    ]);
    expect(tableProps.columnDefs?.map(({ headerName }) => headerName)).toEqual([
      "日期",
      "价格",
      "NPV",
    ]);
    expect(tableProps.columnDefs?.slice(1).map(({ type }) => type)).toEqual([
      "rightAligned",
      "rightAligned",
    ]);
    expect(lineProps.data.map(({ date }) => date)).toEqual([
      "2026-07-16",
      "2026-07-17",
    ]);
    expect(lineProps.metric).toBe("price");
    expect(lineProps.currency).toBe("CNY");

    fireEvent.click(screen.getByText("NPV"));
    await waitFor(() =>
      expect(
        (lineChartPropsSpy.mock.lastCall?.[0] as MockLineChartProps).metric,
      ).toBe("npv"),
    );
  });

  it("表格中的负价格和负 NPV 使用负值字体类名", async () => {
    const adapter: ValuationLogAdapter = {
      getValuationLogs: vi.fn().mockResolvedValue([
        {
          allVarCodeSnum: ALL_VAR_CODE_SNUM,
          busnsDate: "20260716",
          valtnPrice: "-65000",
          mval: "-28000",
          tradeCrrc: "CNY",
        },
      ]),
    };
    render(
      <ValuationLogDataChart
        adapter={adapter}
        allVarCodeSnum={ALL_VAR_CODE_SNUM}
      />,
    );

    await screen.findByLabelText("mock-price-chart");
    const columnDefs = (tablePropsSpy.mock.lastCall?.[0] as MockTableProps)
      .columnDefs;
    const priceCellClassRule = Object.values(
      columnDefs?.find(({ field }) => field === "price")?.cellClassRules ?? {},
    )[0];
    const npvCellClassRule = Object.values(
      columnDefs?.find(({ field }) => field === "npv")?.cellClassRules ?? {},
    )[0];

    expect(typeof priceCellClassRule).toBe("function");
    expect(typeof npvCellClassRule).toBe("function");
    if (
      typeof priceCellClassRule !== "function" ||
      typeof npvCellClassRule !== "function"
    ) {
      throw new Error("价格或 NPV 列未配置动态单元格类名");
    }

    expect(priceCellClassRule({ value: "-65000" } as never)).toBe(true);
    expect(priceCellClassRule({ value: "65000" } as never)).toBe(false);
    expect(npvCellClassRule({ value: "-28000" } as never)).toBe(true);
    expect(npvCellClassRule({ value: "0" } as never)).toBe(false);
  });

  it("无估值数据时在表格和图表中展示统一空状态且不绘制曲线", async () => {
    const adapter: ValuationLogAdapter = {
      getValuationLogs: vi.fn().mockResolvedValue([]),
    };
    render(
      <ValuationLogDataChart
        adapter={adapter}
        allVarCodeSnum={ALL_VAR_CODE_SNUM}
      />,
    );

    await waitFor(() =>
      expect(screen.getAllByText("暂无数据", { selector: "div" })).toHaveLength(
        2,
      ),
    );
    expect(screen.getByLabelText("暂无估值日志数据")).toBeTruthy();
    expect(screen.getByLabelText("暂无估值曲线数据")).toBeTruthy();
    expect(screen.queryByLabelText("mock-price-chart")).toBeNull();
    expect(
      screen.getByLabelText("估值日志数据图表").getAttribute("data-status"),
    ).toBe("empty");
  });

  it("查询超时或失败时展示指定 Toast", async () => {
    const adapter: ValuationLogAdapter = {
      getValuationLogs: vi.fn().mockRejectedValue(new Error("timeout")),
    };
    render(
      <ValuationLogDataChart
        adapter={adapter}
        allVarCodeSnum={ALL_VAR_CODE_SNUM}
      />,
    );

    await waitFor(() =>
      expect(messageErrorSpy).toHaveBeenCalledWith("数据加载失败，请稍后重试"),
    );
    expect(
      screen.getByLabelText("估值日志数据图表").getAttribute("data-status"),
    ).toBe("error");
  });

  it("卸载时中止尚未完成的请求", () => {
    let requestContext: ValuationLogRequestContext | undefined;
    const getValuationLogs = vi.fn(
      (
        _params: ValuationLogRequestParams,
        context?: ValuationLogRequestContext,
      ) => {
        requestContext = context;
        return new Promise<readonly FinancialData[]>(() => undefined);
      },
    );
    const { unmount } = render(
      <ValuationLogDataChart
        adapter={{ getValuationLogs }}
        allVarCodeSnum={ALL_VAR_CODE_SNUM}
      />,
    );

    expect(requestContext?.signal?.aborted).toBe(false);
    unmount();
    expect(requestContext?.signal?.aborted).toBe(true);
  });
});
