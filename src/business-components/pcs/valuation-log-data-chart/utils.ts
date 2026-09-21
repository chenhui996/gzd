import Big from "big.js";
import type {
  FinancialData,
  ValuationLogItem,
  ValuationLogValue,
} from "./types";

const EMPTY_VALUE = "-";

function compareDate(left: string, right: string): number {
  const leftTime = Date.parse(left);
  const rightTime = Date.parse(right);
  if (Number.isFinite(leftTime) && Number.isFinite(rightTime)) {
    return leftTime - rightTime;
  }
  return left.localeCompare(right);
}

function formatBusinessDate(date: string): string {
  return date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
}

export function formatValuationLogEndTime(currentDate: Date): string {
  const endTime = new Date(currentDate);
  endTime.setDate(endTime.getDate() - 1);

  const year = endTime.getFullYear();
  const month = String(endTime.getMonth() + 1).padStart(2, "0");
  const day = String(endTime.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export function mapFinancialData(
  data: readonly FinancialData[],
): ValuationLogItem[] {
  return data.map(({ busnsDate, valtnPrice, mval, tradeCrrc }) => ({
    date: formatBusinessDate(busnsDate),
    price: valtnPrice,
    npv: mval,
    currency: tradeCrrc,
  }));
}

export function sortValuationLogs(
  data: readonly ValuationLogItem[],
  direction: "ascending" | "descending",
): ValuationLogItem[] {
  const sign = direction === "ascending" ? 1 : -1;
  return [...data].sort((left, right) => sign * compareDate(left.date, right.date));
}

export function toChartNumber(value: ValuationLogValue): number | null {
  // 局部空值仍需保留当天的横轴点位，并按产品约定在纵轴绘制为 0。
  if (value == null || (typeof value === "string" && value.trim() === "")) {
    return 0;
  }

  try {
    const normalized = new Big(value).toNumber();
    return Number.isFinite(normalized) ? normalized : null;
  } catch {
    return null;
  }
}

export function isNegativeValue(value: ValuationLogValue): boolean {
  try {
    return value != null && new Big(value).lt(0);
  } catch {
    return false;
  }
}

export function formatCurrency(
  value: ValuationLogValue,
  currency: string,
  locale: string,
): string {
  if (value == null || value === "") return EMPTY_VALUE;

  let normalized: string;
  try {
    normalized = new Big(value).toFixed(2);
  } catch {
    return EMPTY_VALUE;
  }

  const negative = normalized.startsWith("-");
  const [integer, decimal] = (negative ? normalized.slice(1) : normalized).split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  try {
    const currencySymbol = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value;
    return `${negative ? "-" : ""}${currencySymbol ?? currency}${grouped}.${decimal}`;
  } catch {
    return `${negative ? "-" : ""}${currency} ${grouped}.${decimal}`;
  }
}

export function formatChartDate(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  return match ? `${match[1].slice(2)}-${match[2]}-${match[3]}` : date;
}
