import { describe, expect, it } from "vitest";
import { demoContracts } from "../demo/mockDataSource";
import type { IndicativePricingContextValues } from "../types";
import { mapIndicativePricingRequest } from "./request-mapper";

const context: IndicativePricingContextValues = {
  pricingEnvironment: {
    id: "env-1",
    code: "ENV",
    name: "环境",
    englishName: "Environment",
    currency: "CNY",
  },
  valuationDate: "2026-08-12",
  discountCurve: {
    key: "discount",
    id: "discount",
    label: "Discount",
    kind: "discount",
    source: "custom",
    currency: "CNY",
    requestMapping: { disCurveId: "discount-instance" },
  },
  carbonForwardCurve: {
    key: "carbon",
    id: "carbon",
    label: "Carbon",
    kind: "carbonForward",
    source: "definition",
    currency: "CNY",
    requestMapping: { comCurveDefId: "carbon-definition" },
  },
};

describe("mapIndicativePricingRequest", () => {
  it("maps valuation date and mutually exclusive curve ids", () => {
    const original = structuredClone(demoContracts[0]);
    const [payload] = mapIndicativePricingRequest(
      demoContracts.slice(0, 1),
      context,
    );
    expect(payload).toEqual({
      astType: "",
      targtAllVarCodeSum: "CEA",
      scrtyCode: "CEA",
      currency: "CNY",
      fwdMaturityDate: "20261130",
      settleDate: "20261202",
      physicalDelivery: "1",
      direction: "L",
      valDate: "20260812",
      fwdDlvPrice: "76.25",
      targtVol: "10000",
      disCurveDefId: "",
      disCurveId: "discount-instance",
      comCurveDefId: "carbon-definition",
      comCurveId: "",
    });
    expect(demoContracts[0]).toEqual(original);
  });

  it("固定将 astType 映射为空字符串而不透传运行时输入", () => {
    const contract = structuredClone(demoContracts[0]);
    Reflect.set(contract, "astType", "Forward");

    const [payload] = mapIndicativePricingRequest([contract], context);

    expect(payload.astType).toBe("");
  });

  it("sends an empty price and omits all absent optional contract fields", () => {
    const [payload] = mapIndicativePricingRequest(
      [
        {
          ...demoContracts[0],
          instrumentId: undefined,
          instrumentName: undefined,
          fwdDlvPrice: "",
        },
      ],
      context,
    );

    expect(payload.fwdDlvPrice).toBe("");
    expect(payload).not.toHaveProperty("productType");
    expect(payload).not.toHaveProperty("instrumentId");
    expect(payload).not.toHaveProperty("instrumentCode");
    expect(payload).not.toHaveProperty("instrumentName");
    expect(payload).not.toHaveProperty("tradeContpId");
  });

  it("combines every contract item with the same form context fields", () => {
    const payload = mapIndicativePricingRequest(
      demoContracts.slice(0, 2),
      context,
    );

    expect(payload).toHaveLength(2);
    expect(
      payload.map(
        ({ valDate, disCurveDefId, disCurveId, comCurveDefId, comCurveId }) => ({
          valDate,
          disCurveDefId,
          disCurveId,
          comCurveDefId,
          comCurveId,
        }),
      ),
    ).toEqual([
      {
        valDate: "20260812",
        disCurveDefId: "",
        disCurveId: "discount-instance",
        comCurveDefId: "carbon-definition",
        comCurveId: "",
      },
      {
        valDate: "20260812",
        disCurveDefId: "",
        disCurveId: "discount-instance",
        comCurveDefId: "carbon-definition",
        comCurveId: "",
      },
    ]);
    expect(payload[1].targtVol).toBe("8000");
  });
});
