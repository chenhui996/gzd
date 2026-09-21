import { describe, expect, it } from "vitest";
import { demoContracts } from "../demo/mockDataSource";
import type { IndicativePricingContract } from "../types";
import { contractFieldValue } from "./grid-utils";

describe("定价表格合约字段显示", () => {
  it("将缺失字段和无效枚举统一显示为单个短横线", () => {
    const contract = {
      ...demoContracts[0],
      contractId: "contract-001",
      instrumentCode: "",
      scrtyCode: "",
      fwdMaturityDate: "",
      settleDate: "",
      physicalDelivery: undefined,
      direction: undefined,
      fwdDlvPrice: "",
    } as unknown as IndicativePricingContract;

    expect(contractFieldValue(contract, "instrumentCode")).toBe("-");
    expect(contractFieldValue(contract, "scrtyCode")).toBe("-");
    expect(contractFieldValue(contract, "fwdMaturityDate")).toBe("-");
    expect(contractFieldValue(contract, "settleDate")).toBe("-");
    expect(contractFieldValue(contract, "physicalDelivery")).toBe("-");
    expect(contractFieldValue(contract, "direction")).toBe("-");
    expect(contractFieldValue(contract, "fwdDlvPrice")).toBe("-");
  });
});
