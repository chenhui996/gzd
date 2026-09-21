import type {
  ContractCalculationState,
  PriceCalResponseItem,
} from "../types";

function stringValue(value: unknown): string | null {
  return value == null || value === "" ? null : String(value);
}

export function classifyCalculationResult(
  contractId: string,
  response: PriceCalResponseItem | null | undefined,
  inputVersion: number,
): ContractCalculationState {
  if (!response || typeof response !== "object") {
    return {
      contractId,
      status: "error",
      result: null,
      message: "未返回计算结果",
      resultInputVersion: inputVersion,
    };
  }

  const code = response.code;
  const codeIsSuccess =
    code == null || code === 0 || code === 200 || code === "0" || code === "200";
  const hasValue = [
    response.npv,
    response.forwardPrice,
    response.discountFactor,
    response.maturityTime,
  ].some((value) => value != null && value !== "");

  if (!codeIsSuccess || !hasValue) {
    return {
      contractId,
      status: "error",
      result: null,
      message: response.msg ?? "定价计算失败",
      resultInputVersion: inputVersion,
    };
  }

  return {
    contractId,
    status: "success",
    result: {
      npv: stringValue(response.npv),
      forwardPrice: stringValue(response.forwardPrice),
      discountFactor: stringValue(response.discountFactor),
      maturityTime: stringValue(response.maturityTime),
    },
    message: response.msg ?? null,
    resultInputVersion: inputVersion,
  };
}

export function classifyCalculationBatch(
  contractIds: readonly string[],
  response: readonly PriceCalResponseItem[],
  inputVersion: number,
): Record<string, ContractCalculationState> {
  return Object.fromEntries(
    contractIds.map((contractId, index) => [
      contractId,
      classifyCalculationResult(contractId, response[index], inputVersion),
    ]),
  );
}
