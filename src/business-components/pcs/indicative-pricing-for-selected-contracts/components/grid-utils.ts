import {
  EMPTY_TABLE_CELL_PLACEHOLDER,
  type MultipleGridRowKey,
} from "../constants";
import type {
  IndicativePricingContract,
  IndicativePricingResult,
} from "../types";
import { formatCompactDate } from "../utils/date";
import { formatCurrency, formatDecimal } from "../utils/formatter";

export function contractFieldValue(
  contract: IndicativePricingContract,
  key: MultipleGridRowKey,
): string {
  switch (key) {
    case "instrumentCode":
      return contract.instrumentCode || EMPTY_TABLE_CELL_PLACEHOLDER;
    case "scrtyCode":
      return contract.scrtyCode || EMPTY_TABLE_CELL_PLACEHOLDER;
    case "fwdMaturityDate":
      return contract.fwdMaturityDate
        ? formatCompactDate(contract.fwdMaturityDate)
        : EMPTY_TABLE_CELL_PLACEHOLDER;
    case "settleDate":
      return contract.settleDate
        ? formatCompactDate(contract.settleDate)
        : EMPTY_TABLE_CELL_PLACEHOLDER;
    case "physicalDelivery":
      if (contract.physicalDelivery === "1") return "实物交割";
      if (contract.physicalDelivery === "2") return "现金交割";
      return EMPTY_TABLE_CELL_PLACEHOLDER;
    case "direction":
      if (contract.direction === "L") return "买入";
      if (contract.direction === "S") return "卖出";
      return "";
    case "fwdDlvPrice":
      return contract.fwdDlvPrice || EMPTY_TABLE_CELL_PLACEHOLDER;
    default:
      return EMPTY_TABLE_CELL_PLACEHOLDER;
  }
}

export function formatResultValue(
  result: IndicativePricingResult | null,
  key: "npv" | "forwardPrice" | "discountFactor",
  currency: string,
): string {
  if (key === "npv") return formatCurrency(result?.npv, currency);
  if (key === "forwardPrice") return formatCurrency(result?.forwardPrice, currency, 8);
  return formatDecimal(result?.discountFactor, 4);
}
