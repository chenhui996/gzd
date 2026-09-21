import type { CSSProperties } from "react";

export type ValuationLogMetric = "price" | "npv";
export type ValuationLogValue = string | number | null | undefined;

export interface ValuationLogRequestParams {
  allVarCodeSnum: string;
  endTime: string;
  size: "30";
}

export interface FinancialData {
  allVarCodeSnum: string;
  busnsDate: string;
  valtnPrice?: string | null;
  mval?: string | null;
  tradeCrrc: string;
}

export interface ValuationLogItem {
  date: string;
  price: ValuationLogValue;
  npv: ValuationLogValue;
  currency?: string;
}

export interface ValuationLogRequestContext {
  signal?: AbortSignal;
}

export interface ValuationLogAdapter {
  getValuationLogs(
    params: ValuationLogRequestParams,
    context?: ValuationLogRequestContext,
  ): Promise<readonly FinancialData[]>;
}

export interface ValuationLogDataChartProps {
  adapter: ValuationLogAdapter;
  allVarCodeSnum: string;
  className?: string;
  style?: CSSProperties;
}
