import { describe, expect, it } from "vitest";
import type { IndicativePricingContract } from "../types";
import {
  validatePricingContext,
  validateValuationDateAgainstLatestSettlement,
} from "./validation";

const contract: IndicativePricingContract = {
  contractId: "c-1",
  astType: "",
  productType: "carbon_future",
  targtAllVarCodeSum: "CEA",
  scrtyCode: "CEA",
  currency: "CNY",
  fwdMaturityDate: "20261130",
  settleDate: "20261202",
  physicalDelivery: "1",
  direction: "L",
  fwdDlvPrice: "76.25",
  targtVol: "10000",
  instrumentCode: "CF-001",
  tradeContpId: "counterparty-001",
};

describe("indicative pricing validation", () => {
  it("collects all missing context fields", () => {
    expect(
      Object.keys(
        validatePricingContext({
          pricingEnvironment: null,
          discountCurve: null,
          carbonForwardCurve: null,
          valuationDate: null,
        }),
      ),
    ).toEqual([
      "pricingEnvironment",
      "carbonForwardCurve",
      "discountCurve",
      "valuationDate",
    ]);
  });

  it("compares valuation date with the latest settlement date", () => {
    expect(
      validateValuationDateAgainstLatestSettlement("2026-12-03", [
        contract,
        { ...contract, contractId: "c-2", settleDate: "20270102" },
      ]).valid,
    ).toBe(true);
    expect(
      validateValuationDateAgainstLatestSettlement("2027-01-03", [
        contract,
        { ...contract, contractId: "c-2", settleDate: "20270102" },
      ]).message,
    ).toContain("最久的结算支付日");
  });
});
