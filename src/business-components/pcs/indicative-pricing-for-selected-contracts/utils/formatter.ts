import Big from "big.js";
import { EMPTY_TABLE_CELL_PLACEHOLDER } from "../constants";

function fixed(value: string | null | undefined, precision: number): string {
  if (value == null || value === "") return EMPTY_TABLE_CELL_PLACEHOLDER;
  try {
    return new Big(value).toFixed(precision);
  } catch {
    return EMPTY_TABLE_CELL_PLACEHOLDER;
  }
}

export function formatDecimal(
  value: string | null | undefined,
  precision: number,
): string {
  const normalized = fixed(value, precision);
  if (normalized === EMPTY_TABLE_CELL_PLACEHOLDER) return normalized;
  const [integer, decimal] = normalized.split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal == null ? grouped : `${grouped}.${decimal}`;
}

export function formatCurrency(
  value: string | null | undefined,
  currency: string,
  precision = 2,
): string {
  const normalized = fixed(value, precision);
  if (normalized === EMPTY_TABLE_CELL_PLACEHOLDER) return normalized;
  const absolute = normalized.startsWith("-") ? normalized.slice(1) : normalized;
  const grouped = formatDecimal(absolute, precision);
  try {
    const parts = new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).formatToParts(0);
    const symbol = parts.find((part) => part.type === "currency")?.value ?? currency;
    return `${normalized.startsWith("-") ? "-" : ""}${symbol}${grouped}`;
  } catch {
    return `${currency} ${normalized}`.trim();
  }
}

export function isNegative(value: string | null | undefined): boolean {
  try {
    return value != null && new Big(value).lt(0);
  } catch {
    return false;
  }
}
