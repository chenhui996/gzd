import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ValuationLogItem } from "../types";

const {
  disconnectSpy,
  disposeSpy,
  initSpy,
  observeSpy,
  resizeSpy,
  setOptionSpy,
} = vi.hoisted(() => ({
  disconnectSpy: vi.fn(),
  disposeSpy: vi.fn(),
  initSpy: vi.fn(),
  observeSpy: vi.fn(),
  resizeSpy: vi.fn(),
  setOptionSpy: vi.fn(),
}));

vi.mock("echarts/core", () => ({
  init: initSpy,
  use: vi.fn(),
}));
vi.mock("echarts/charts", () => ({ LineChart: {} }));
vi.mock("echarts/components", () => ({
  GridComponent: {},
  TooltipComponent: {},
}));
vi.mock("echarts/renderers", () => ({ CanvasRenderer: {} }));

import ValuationLineChart from "./ValuationLineChart";
import {
  buildValuationChartOption,
  type ValuationChartTheme,
} from "../chartOption";

const data: ValuationLogItem[] = [
  { date: "2026-07-17", price: "110", npv: "210" },
  { date: "2026-07-16", price: "100", npv: "200" },
];

const chartTheme: ValuationChartTheme = {
  primary: "#ffe7cb",
  baseline: "#FFFFFF2E",
  backgroundElevated: "#2e2e2e",
  text: "rgba(255, 255, 255, 0.85)",
  textSecondary: "rgba(255, 255, 255, 0.65)",
  split: "#323130",
  fontFamily: "sans-serif",
  fontSize: 14,
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

beforeEach(() => {
  initSpy.mockReturnValue({
    setOption: setOptionSpy,
    resize: resizeSpy,
    dispose: disposeSpy,
  });

  class ResizeObserverMock {
    constructor(callback: ResizeObserverCallback) {
      void callback;
    }

    observe = observeSpy;
    unobserve = vi.fn();
    disconnect = disconnectSpy;
  }

  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
});

describe("ValuationLineChart", () => {
  it("按日期正序生成价格与 NPV 图表配置", () => {
    const priceOption = buildValuationChartOption({
      data,
      metric: "price",
      currency: "CNY",
      locale: "zh-CN",
      theme: chartTheme,
    }) as {
      xAxis: Array<{
        position: "top" | "bottom";
        data: string[];
        axisLine: {
          show: boolean;
          onZero: boolean;
          lineStyle?: { color: string; type: string };
        };
        axisLabel: {
          show?: boolean;
          interval: number;
          rotate: number;
        };
      }>;
      yAxis: {
        min: number;
        max: number;
        splitLine: {
          showMinLine: boolean;
          showMaxLine: boolean;
          lineStyle: { type: number[] };
        };
      };
      tooltip: {
        backgroundColor: string;
        borderWidth: number;
        borderRadius: number;
        padding: number;
        textStyle: {
          color: string;
          fontFamily: string;
          fontSize: number;
        };
      };
      series: Array<{ data: Array<number | null>; xAxisIndex: number }>;
    };
    const npvOption = buildValuationChartOption({
      data,
      metric: "npv",
      currency: "CNY",
      locale: "zh-CN",
      theme: chartTheme,
    }) as {
      yAxis: { min: number; max: number };
      series: Array<{ data: Array<number | null> }>;
    };

    const [labelAxis, baselineAxis] = priceOption.xAxis;

    expect(labelAxis.data).toEqual(["26-07-16", "26-07-17"]);
    expect(labelAxis.position).toBe("bottom");
    expect(labelAxis.axisLine).toMatchObject({ show: false, onZero: false });
    expect(labelAxis.axisLabel).toMatchObject({
      interval: 0,
      rotate: 45,
    });
    expect(baselineAxis.position).toBe("bottom");
    expect(baselineAxis.axisLabel.show).toBe(false);
    expect(baselineAxis.axisLine).toMatchObject({
      show: true,
      onZero: false,
      lineStyle: { color: "#FFFFFF2E", type: "solid" },
    });
    expect(priceOption.yAxis.splitLine).toMatchObject({
      showMinLine: false,
      showMaxLine: false,
    });
    expect(priceOption.yAxis.splitLine.lineStyle.type).toEqual([8, 8]);
    expect(priceOption.tooltip).toMatchObject({
      backgroundColor: "#2e2e2e",
      borderWidth: 0,
      borderRadius: 4,
      padding: 12,
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontFamily: "sans-serif",
        fontSize: 14,
      },
    });
    expect(priceOption.series[0].xAxisIndex).toBe(0);
    expect(priceOption.series[0].data).toEqual([100, 110]);
    expect(npvOption.series[0].data).toEqual([200, 210]);
    expect(priceOption.yAxis).toMatchObject({ min: 99.5, max: 110.5 });
    expect(npvOption.yAxis).toMatchObject({ min: 199.5, max: 210.5 });
  });

  it("跨零时符号基准线吸附 0，且 0 不重复绘制网格虚线", () => {
    const option = buildValuationChartOption({
      data: [
        { date: "2026-07-16", price: "-100", npv: "-1000" },
        { date: "2026-07-17", price: "100", npv: "500" },
      ],
      metric: "price",
      currency: "CNY",
      locale: "zh-CN",
      theme: chartTheme,
    }) as {
      xAxis: Array<{
        position: "top" | "bottom";
        axisLine: {
          onZero: boolean;
          lineStyle?: { type: string };
        };
      }>;
      yAxis: { axisTick: { customValues: number[] } };
    };

    expect(option.xAxis[1]).toMatchObject({
      position: "bottom",
      axisLine: { onZero: true, lineStyle: { type: "solid" } },
    });
    expect(option.yAxis.axisTick.customValues).toEqual([
      -110, -90, -60, -30, 30, 60, 90, 110,
    ]);
    expect(option.yAxis.axisTick.customValues).not.toContain(0);
  });

  it("全正和全负时保留作为轴边界的 0", () => {
    const positiveOption = buildValuationChartOption({
      data: [
        { date: "2026-07-16", price: "1", npv: "10" },
        { date: "2026-07-17", price: "100", npv: "1000" },
      ],
      metric: "price",
      currency: "CNY",
      locale: "zh-CN",
      theme: chartTheme,
    }) as { yAxis: { axisTick: { customValues: number[] } } };
    const negativeOption = buildValuationChartOption({
      data: [
        { date: "2026-07-16", price: "-100", npv: "-1000" },
        { date: "2026-07-17", price: "-1", npv: "-10" },
      ],
      metric: "price",
      currency: "CNY",
      locale: "zh-CN",
      theme: chartTheme,
    }) as { yAxis: { axisTick: { customValues: number[] } } };

    expect(positiveOption.yAxis.axisTick.customValues).toEqual([
      0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 104.95,
    ]);
    expect(negativeOption.yAxis.axisTick.customValues).toEqual([
      -104.95, -100, -90, -80, -70, -60, -50, -40, -30, -20, -10, 0,
    ]);
  });

  it("按数据跨度处理全正、跨零和全负的价格与 NPV 纵轴范围", () => {
    const cases = [
      {
        data: [
          { date: "2026-07-16", price: "1", npv: "10" },
          { date: "2026-07-17", price: "100", npv: "1000" },
        ],
        priceRange: { min: 0, max: 104.95 },
        npvRange: { min: 0, max: 1049.5 },
        baselinePosition: "bottom",
        baselineOnZero: false,
      },
      {
        data: [
          { date: "2026-07-16", price: "-100", npv: "-1000" },
          { date: "2026-07-17", price: "100", npv: "500" },
        ],
        priceRange: { min: -110, max: 110 },
        npvRange: { min: -1075, max: 575 },
        baselinePosition: "bottom",
        baselineOnZero: true,
      },
      {
        data: [
          { date: "2026-07-16", price: "-100", npv: "-1000" },
          { date: "2026-07-17", price: "-1", npv: "-10" },
        ],
        priceRange: { min: -104.95, max: 0 },
        npvRange: { min: -1049.5, max: 0 },
        baselinePosition: "top",
        baselineOnZero: false,
      },
    ] satisfies Array<{
      data: ValuationLogItem[];
      priceRange: { min: number; max: number };
      npvRange: { min: number; max: number };
      baselinePosition: "top" | "bottom";
      baselineOnZero: boolean;
    }>;

    cases.forEach(
      ({
        data: caseData,
        priceRange,
        npvRange,
        baselinePosition,
        baselineOnZero,
      }) => {
        const priceOption = buildValuationChartOption({
          data: caseData,
          metric: "price",
          currency: "CNY",
          locale: "zh-CN",
          theme: chartTheme,
        }) as {
          xAxis: Array<{
            position: "top" | "bottom";
            axisLine: { onZero: boolean };
          }>;
          yAxis: { min: number; max: number };
        };
        const npvOption = buildValuationChartOption({
          data: caseData,
          metric: "npv",
          currency: "CNY",
          locale: "zh-CN",
          theme: chartTheme,
        }) as { yAxis: { min: number; max: number } };

        expect(priceOption.yAxis).toMatchObject(priceRange);
        expect(npvOption.yAxis).toMatchObject(npvRange);
        expect(priceOption.xAxis[1]).toMatchObject({
          position: baselinePosition,
          axisLine: { onZero: baselineOnZero },
        });
      },
    );
  });

  it("数据整体非空时把局部空价格和 NPV 绘制为 0", () => {
    const partialData: ValuationLogItem[] = [
      { date: "2026-07-16", price: null, npv: "200" },
      { date: "2026-07-17", price: "110", npv: undefined },
      { date: "2026-07-18", price: "", npv: " " },
    ];
    const priceOption = buildValuationChartOption({
      data: partialData,
      metric: "price",
      currency: "CNY",
      locale: "zh-CN",
      theme: chartTheme,
    }) as {
      yAxis: { min: number; max: number };
      series: Array<{ data: Array<number | null> }>;
    };
    const npvOption = buildValuationChartOption({
      data: partialData,
      metric: "npv",
      currency: "CNY",
      locale: "zh-CN",
      theme: chartTheme,
    }) as {
      yAxis: { min: number; max: number };
      series: Array<{ data: Array<number | null> }>;
    };

    expect(priceOption.series[0].data).toEqual([0, 110, 0]);
    expect(npvOption.series[0].data).toEqual([200, 0, 0]);
    expect(priceOption.yAxis).toMatchObject({ min: 0, max: 115.5 });
    expect(npvOption.yAxis).toMatchObject({ min: 0, max: 210 });
  });

  it("正负等值数据和全零数据仍保留有效纵轴范围", () => {
    const equalData: ValuationLogItem[] = [
      { date: "2026-07-16", price: "100", npv: "0" },
      { date: "2026-07-17", price: "100", npv: "0" },
    ];
    const negativeEqualData: ValuationLogItem[] = [
      { date: "2026-07-16", price: "-100", npv: "0" },
      { date: "2026-07-17", price: "-100", npv: "0" },
    ];
    const priceOption = buildValuationChartOption({
      data: equalData,
      metric: "price",
      currency: "CNY",
      locale: "zh-CN",
      theme: chartTheme,
    }) as { yAxis: { min: number; max: number } };
    const npvOption = buildValuationChartOption({
      data: equalData,
      metric: "npv",
      currency: "CNY",
      locale: "zh-CN",
      theme: chartTheme,
    }) as { yAxis: { min: number; max: number } };
    const negativePriceOption = buildValuationChartOption({
      data: negativeEqualData,
      metric: "price",
      currency: "CNY",
      locale: "zh-CN",
      theme: chartTheme,
    }) as { yAxis: { min: number; max: number } };

    expect(priceOption.yAxis).toMatchObject({ min: 95, max: 105 });
    expect(npvOption.yAxis).toMatchObject({ min: 0, max: 1 });
    expect(negativePriceOption.yAxis).toMatchObject({ min: -105, max: -95 });
  });

  it("数据超过单屏容量时扩展画布并默认滚动至最新日期", () => {
    const largeData = Array.from({ length: 30 }, (_, index) => ({
      date: `2026-07-${String(index + 1).padStart(2, "0")}`,
      price: index,
      npv: index,
    }));
    const { rerender } = render(
      <ValuationLineChart
        data={data}
        metric="price"
        currency="CNY"
        locale="zh-CN"
        theme={chartTheme}
      />,
    );
    const scrollContainer = document.querySelector('[role="img"]');
    if (!(scrollContainer instanceof HTMLDivElement)) {
      throw new Error("未找到折线图滚动容器");
    }
    Object.defineProperties(scrollContainer, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 300 },
    });

    rerender(
      <ValuationLineChart
        data={largeData}
        metric="price"
        currency="CNY"
        locale="zh-CN"
        theme={chartTheme}
      />,
    );

    expect(scrollContainer.dataset.scrollable).toBe("true");
    expect((scrollContainer.firstElementChild as HTMLElement).style.width).toBe(
      "300%",
    );
    expect(scrollContainer.scrollLeft).toBe(200);
  });

  it("滚动时展示滚动条并在停止滚动后自动隐藏", () => {
    vi.useFakeTimers();
    const largeData = Array.from({ length: 30 }, (_, index) => ({
      date: `2026-07-${String(index + 1).padStart(2, "0")}`,
      price: index,
      npv: index,
    }));
    render(
      <ValuationLineChart
        data={largeData}
        metric="price"
        currency="CNY"
        locale="zh-CN"
        theme={chartTheme}
      />,
    );
    const scrollContainer = document.querySelector('[role="img"]');
    if (!(scrollContainer instanceof HTMLDivElement)) {
      throw new Error("未找到折线图滚动容器");
    }

    fireEvent.scroll(scrollContainer);
    expect(scrollContainer.dataset.scrolling).toBe("true");

    act(() => vi.advanceTimersByTime(800));
    expect(scrollContainer.dataset.scrolling).toBeUndefined();
  });

  it("初始化、更新并在卸载时销毁 ECharts 实例", () => {
    const { rerender, unmount } = render(
      <ValuationLineChart
        data={data}
        metric="price"
        currency="CNY"
        locale="zh-CN"
        theme={chartTheme}
      />,
    );

    expect(initSpy).toHaveBeenCalledWith(expect.any(HTMLDivElement), undefined, {
      renderer: "canvas",
    });
    expect(observeSpy).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    expect(setOptionSpy).toHaveBeenCalledWith(
      expect.objectContaining({ series: expect.any(Array) }),
      { notMerge: true },
    );

    rerender(
      <ValuationLineChart
        data={data}
        metric="npv"
        currency="CNY"
        locale="zh-CN"
        theme={chartTheme}
      />,
    );
    expect(setOptionSpy).toHaveBeenCalledTimes(2);

    unmount();
    expect(disconnectSpy).toHaveBeenCalledTimes(1);
    expect(disposeSpy).toHaveBeenCalledTimes(1);
  });
});
