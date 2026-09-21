import type { IndicativePricingContextValues } from "./types";

export const MAX_CONTRACT_COUNT = 1000;
export const MAX_RESOURCE_ATTEMPTS = 3;
export const EMPTY_TABLE_CELL_PLACEHOLDER = "-";

export const EMPTY_CONTEXT: IndicativePricingContextValues = {
  pricingEnvironment: null,
  carbonForwardCurve: null,
  discountCurve: null,
  valuationDate: null,
};

export const CONTEXT_REQUIRED_MESSAGES = {
  pricingEnvironment: "请选择定价环境",
  carbonForwardCurve: "请选择碳金融远期价格曲线",
  discountCurve: "请选择无风险利率曲线利率曲线",
  valuationDate: "请选择估值日",
} as const;

export const MULTIPLE_GRID_ROWS = [
  { key: "instrumentCode", label: "成交编号", kind: "contract" },
  { key: "scrtyCode", label: "标的代码", kind: "contract" },
  { key: "fwdMaturityDate", label: "远期到期日", kind: "contract" },
  { key: "settleDate", label: "结算支付日", kind: "contract" },
  { key: "physicalDelivery", label: "交割方式", kind: "contract" },
  { key: "direction", label: "买入/卖出", kind: "contract" },
  { key: "fwdDlvPrice", label: "远期交割价格", kind: "contract" },
  { key: "npv", label: "净现值NPV（估值日）", kind: "result" },
  { key: "forwardPrice", label: "远期价格（远期到期日）", kind: "result" },
  { key: "discountFactor", label: "支付日贴现因子", kind: "result" },
] as const;

export type MultipleGridRowKey = (typeof MULTIPLE_GRID_ROWS)[number]["key"];
