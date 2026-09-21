import { describe, expect, it } from "vitest";
import { createInitialState, indicativePricingReducer } from "./reducer";

describe("indicativePricingReducer", () => {
  it("hydrates the initial pricing context without changing default fields", () => {
    const initial = createInitialState(["c-1"], {
      valuationDate: "2026-08-12",
    });

    expect(initial.context).toEqual({
      pricingEnvironment: null,
      carbonForwardCurve: null,
      discountCurve: null,
      valuationDate: "2026-08-12",
    });
    expect(initial.resultByContractId["c-1"].status).toBe("idle");
  });

  it("clears stale results whenever a context field changes", () => {
    const initial = createInitialState(["c-1"]);
    const settled = indicativePricingReducer(initial, {
      type: "calculation/settled",
      results: {
        "c-1": {
          contractId: "c-1",
          status: "success",
          result: { npv: "1", forwardPrice: "2", discountFactor: "0.9", maturityTime: "1" },
          message: null,
          resultInputVersion: 0,
        },
      },
    });
    const changed = indicativePricingReducer(settled, {
      type: "context/set",
      field: "valuationDate",
      value: "2026-08-12",
    });
    expect(changed.resultByContractId["c-1"].status).toBe("idle");
    expect(changed.inputVersion).toBe(1);
  });

  it("keeps loaded catalogs when reset", () => {
    const loaded = indicativePricingReducer(createInitialState([]), {
      type: "resource/success",
      key: "environments",
      data: [
        { id: "env", code: "ENV", name: "环境", englishName: "Environment", currency: "CNY" },
      ],
    });
    const reset = indicativePricingReducer(loaded, { type: "reset" });
    expect(reset.resources.environments.data).toHaveLength(1);
    expect(reset.context.pricingEnvironment).toBeNull();
  });
});
