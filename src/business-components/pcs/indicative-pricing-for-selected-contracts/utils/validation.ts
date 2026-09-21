import { CONTEXT_REQUIRED_MESSAGES } from "../constants";
import type {
  IndicativePricingContextValues,
  IndicativePricingContract,
} from "../types";
import { isStrictCompactDate, isStrictDate, toCompactDate } from "./date";

export type PricingContextField = keyof IndicativePricingContextValues;
export type PricingContextErrors = Partial<Record<PricingContextField, string[]>>;

export function validatePricingContext(
  context: IndicativePricingContextValues,
): PricingContextErrors {
  const errors: PricingContextErrors = {};

  (Object.keys(CONTEXT_REQUIRED_MESSAGES) as PricingContextField[]).forEach(
    (field) => {
      if (!context[field]) {
        errors[field] = [CONTEXT_REQUIRED_MESSAGES[field]];
      }
    },
  );

  if (context.valuationDate && !isStrictDate(context.valuationDate)) {
    errors.valuationDate = ["估值日格式必须为 YYYY-MM-DD"];
  }

  return errors;
}

export function validateValuationDateAgainstLatestSettlement(
  valuationDate: string | null,
  contracts: readonly IndicativePricingContract[],
): { latestSettlementDate: string | null; valid: boolean; message: string | null } {
  if (!valuationDate || !isStrictDate(valuationDate) || contracts.length === 0) {
    return { latestSettlementDate: null, valid: true, message: null };
  }
  const dates = contracts.map((contract) => contract.settleDate);
  if (dates.some((date) => !isStrictCompactDate(date))) {
    return { latestSettlementDate: null, valid: true, message: null };
  }
  const latestSettlementDate = dates.reduce((latest, date) =>
    date > latest ? date : latest,
  );
  const valid = toCompactDate(valuationDate) <= latestSettlementDate;
  return {
    latestSettlementDate,
    valid,
    message: valid ? null : "估值日必须小于或等于所选合约最久的结算支付日",
  };
}
