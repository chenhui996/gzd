import type {
  contractItem,
  CurveRequestMapping,
  IndicativePricingContextValues,
  PriceCalRequest,
} from "../types";
import { toCompactDate } from "./date";

function curveIds(mapping: CurveRequestMapping) {
  return {
    disCurveDefId: "disCurveDefId" in mapping ? mapping.disCurveDefId : "",
    disCurveId: "disCurveId" in mapping ? mapping.disCurveId : "",
    comCurveDefId: "comCurveDefId" in mapping ? mapping.comCurveDefId : "",
    comCurveId: "comCurveId" in mapping ? mapping.comCurveId : "",
  };
}

export function mapIndicativePricingRequest(
  contracts: readonly contractItem[],
  context: IndicativePricingContextValues,
): PriceCalRequest {
  const {
    pricingEnvironment,
    discountCurve,
    carbonForwardCurve,
    valuationDate,
  } = context;
  if (
    !pricingEnvironment ||
    !discountCurve ||
    !carbonForwardCurve ||
    !valuationDate
  ) {
    return [];
  }

  const discountCurveIds = curveIds(discountCurve.requestMapping);
  const carbonCurveIds = curveIds(carbonForwardCurve.requestMapping);
  // 表单上下文在批次外解析一次，保证每条合约共享同一估值日和曲线组合。
  const sharedFields = {
    valDate: toCompactDate(valuationDate),
    disCurveDefId: discountCurveIds.disCurveDefId,
    disCurveId: discountCurveIds.disCurveId,
    comCurveDefId: carbonCurveIds.comCurveDefId,
    comCurveId: carbonCurveIds.comCurveId,
  };

  return contracts.map((contract) => ({
    astType: "",
    targtAllVarCodeSum: contract.targtAllVarCodeSum,
    scrtyCode: contract.scrtyCode,
    currency: contract.currency,
    fwdMaturityDate: contract.fwdMaturityDate,
    settleDate: contract.settleDate,
    physicalDelivery: contract.physicalDelivery,
    direction: contract.direction,
    fwdDlvPrice: contract.fwdDlvPrice,
    targtVol: contract.targtVol,
    ...(contract.productType ? { productType: contract.productType } : {}),
    ...(contract.instrumentId ? { instrumentId: contract.instrumentId } : {}),
    ...(contract.instrumentCode ? { instrumentCode: contract.instrumentCode } : {}),
    ...(contract.instrumentName ? { instrumentName: contract.instrumentName } : {}),
    ...(contract.tradeContpId ? { tradeContpId: contract.tradeContpId } : {}),
    ...sharedFields,
  }));
}
