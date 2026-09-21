import { describe, expect, it } from "vitest";
import { formatCurrency, formatDecimal, isNegative } from "./formatter";

describe("定价结果格式化", () => {
  it("将空值和非法值统一显示为单个短横线", () => {
    expect(formatDecimal(null, 4)).toBe("-");
    expect(formatDecimal("invalid", 4)).toBe("-");
    expect(formatCurrency(undefined, "CNY")).toBe("-");
  });

  it("保留真实负数的格式化及负值判断", () => {
    expect(formatCurrency("-12500.5", "CNY")).toBe("-¥12,500.50");
    expect(isNegative("-12500.5")).toBe(true);
    expect(isNegative("-")).toBe(false);
  });
});
