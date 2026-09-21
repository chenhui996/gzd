import { describe, expect, it } from "vitest";
import type { FinancialData, ValuationLogItem } from "./types";
import {
  formatChartDate,
  formatCurrency,
  formatValuationLogEndTime,
  isNegativeValue,
  mapFinancialData,
  sortValuationLogs,
  toChartNumber,
} from "./utils";

const logs: ValuationLogItem[] = [
  { date: "2026-07-16", price: "100", npv: "200" },
  { date: "2026-07-17", price: "110", npv: "210" },
];

describe("估值日志数据处理", () => {
  it("把 T-1 日格式化为接口要求的 YYYYMMDD，并正确处理跨月跨年", () => {
    expect(formatValuationLogEndTime(new Date(2026, 7, 18))).toBe("20260817");
    expect(formatValuationLogEndTime(new Date(2026, 2, 1))).toBe("20260228");
    expect(formatValuationLogEndTime(new Date(2026, 0, 1))).toBe("20251231");
  });

  it("把查询估值日志接口响应映射为图表领域数据", () => {
    const financialData: FinancialData[] = [
      {
        allVarCodeSnum: "340480468745060362",
        busnsDate: "20260804",
        valtnPrice: "0",
        mval: "0",
        tradeCrrc: "CNY",
      },
    ];

    expect(mapFinancialData(financialData)).toEqual([
      {
        date: "2026-08-04",
        price: "0",
        npv: "0",
        currency: "CNY",
      },
    ]);
  });

  it("保留接口中的局部空价格和 NPV", () => {
    const financialData: FinancialData[] = [
      {
        allVarCodeSnum: "340480468745060362",
        busnsDate: "20260804",
        valtnPrice: null,
        tradeCrrc: "CNY",
      },
    ];

    expect(mapFinancialData(financialData)).toEqual([
      {
        date: "2026-08-04",
        price: null,
        npv: undefined,
        currency: "CNY",
      },
    ]);
  });

  it("分别为表格和折线图生成倒序与正序数据且不修改输入", () => {
    expect(sortValuationLogs(logs, "descending").map(({ date }) => date)).toEqual([
      "2026-07-17",
      "2026-07-16",
    ]);
    expect(sortValuationLogs(logs, "ascending").map(({ date }) => date)).toEqual([
      "2026-07-16",
      "2026-07-17",
    ]);
    expect(logs.map(({ date }) => date)).toEqual(["2026-07-16", "2026-07-17"]);
  });

  it("格式化金额、图表日期与数值", () => {
    expect(formatCurrency("65000", "CNY", "zh-CN")).toBe("¥65,000.00");
    expect(formatCurrency("invalid", "CNY", "zh-CN")).toBe("-");
    expect(formatChartDate("2026-07-17")).toBe("26-07-17");
    expect(toChartNumber("68.2")).toBe(68.2);
    expect(toChartNumber("")).toBe(0);
    expect(toChartNumber("  ")).toBe(0);
    expect(toChartNumber(null)).toBe(0);
    expect(toChartNumber(undefined)).toBe(0);
    expect(toChartNumber("invalid")).toBeNull();
  });

  it("仅把有限负数识别为负值", () => {
    expect(isNegativeValue("-12500.5")).toBe(true);
    expect(isNegativeValue(-0.01)).toBe(true);
    expect(isNegativeValue("-0")).toBe(false);
    expect(isNegativeValue("0")).toBe(false);
    expect(isNegativeValue("12500.5")).toBe(false);
    expect(isNegativeValue("")).toBe(false);
    expect(isNegativeValue("invalid")).toBe(false);
    expect(isNegativeValue(null)).toBe(false);
  });
});
