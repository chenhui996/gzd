import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  demoContracts,
  demoInitialContext,
  mockIndicativePricingDataSource,
} from "../demo/mockDataSource";
import type { IndicativePricingDataSource } from "../types";
import { useIndicativePricingController } from "./useIndicativePricingController";

const controllerContracts = demoContracts.map((contract, index) => ({
  ...contract,
  contractId: `contract-${String(index + 1).padStart(3, "0")}`,
}));

describe("useIndicativePricingController", () => {
  it("加载定价资源时传入后端要求的固定参数", async () => {
    const listPricingEnvironments = vi.fn(
      mockIndicativePricingDataSource.listPricingEnvironments,
    );
    const listDiscountCurveDefinitions = vi.fn(
      mockIndicativePricingDataSource.listDiscountCurveDefinitions,
    );
    const listCustomDiscountCurves = vi.fn(
      mockIndicativePricingDataSource.listCustomDiscountCurves,
    );
    const listCarbonForwardCurveDefinitions = vi.fn(
      mockIndicativePricingDataSource.listCarbonForwardCurveDefinitions,
    );
    const listCustomCarbonForwardCurves = vi.fn(
      mockIndicativePricingDataSource.listCustomCarbonForwardCurves,
    );
    const dataSource: IndicativePricingDataSource = {
      ...mockIndicativePricingDataSource,
      listPricingEnvironments,
      listDiscountCurveDefinitions,
      listCustomDiscountCurves,
      listCarbonForwardCurveDefinitions,
      listCustomCarbonForwardCurves,
    };

    const { result } = renderHook(() =>
      useIndicativePricingController({
        contracts: controllerContracts.slice(0, 1),
        productType: "carbon_future",
        dataSource,
      }),
    );

    await waitFor(() => expect(result.current.initialized).toBe(true));
    const requestContext = expect.objectContaining({
      signal: expect.any(AbortSignal),
    });
    expect(listPricingEnvironments).toHaveBeenCalledWith(
      { status: true },
      requestContext,
    );
    expect(listDiscountCurveDefinitions).toHaveBeenCalledWith(
      { type: "3", status: true },
      requestContext,
    );
    expect(listCustomDiscountCurves).toHaveBeenCalledWith(
      { type: "3", isCustom: true },
      requestContext,
    );
    expect(listCarbonForwardCurveDefinitions).toHaveBeenCalledWith(
      { type: "11", status: true },
      requestContext,
    );
    expect(listCustomCarbonForwardCurves).toHaveBeenCalledWith(
      { type: "11", isCustom: true },
      requestContext,
    );
  });

  it("自动选择接口返回的默认环境并使用归一化后的 id 查询关联曲线", async () => {
    const getEnvironmentCurveSelection = vi.fn(
      mockIndicativePricingDataSource.getEnvironmentCurveSelection,
    );
    const dataSource: IndicativePricingDataSource = {
      ...mockIndicativePricingDataSource,
      async listPricingEnvironments() {
        return [
          {
            pricingEnvId: 1,
            code: "manual-env",
            name: "非默认环境",
            englishName: null,
            currency: "CNY",
            status: true,
          },
          {
            pricingEnvId: 2,
            code: "default-env",
            name: "默认环境",
            englishName: null,
            currency: "CNY",
            status: true,
            isDefault: true,
          },
        ];
      },
      getEnvironmentCurveSelection,
    };
    const { result } = renderHook(() =>
      useIndicativePricingController({
        contracts: controllerContracts.slice(0, 1),
        productType: "carbon_future",
        dataSource,
      }),
    );

    await waitFor(() => expect(result.current.initialized).toBe(true));
    await waitFor(() =>
      expect(result.current.state.context.pricingEnvironment?.id).toBe("2"),
    );
    await waitFor(() =>
      expect(getEnvironmentCurveSelection).toHaveBeenCalledWith(
        { pricingEnvId: "2", productType: "carbon_future" },
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      ),
    );

    act(() => result.current.setContext("pricingEnvironment", null));
    await waitFor(() =>
      expect(result.current.state.context.pricingEnvironment).toBeNull(),
    );
  });

  it("接口未返回默认环境时保持定价环境为空", async () => {
    const getEnvironmentCurveSelection = vi.fn(
      mockIndicativePricingDataSource.getEnvironmentCurveSelection,
    );
    const dataSource: IndicativePricingDataSource = {
      ...mockIndicativePricingDataSource,
      async listPricingEnvironments() {
        return [
          {
            pricingEnvId: "manual-only",
            code: "manual-env",
            name: "手动选择环境",
            englishName: null,
            currency: "CNY",
            status: true,
          },
        ];
      },
      getEnvironmentCurveSelection,
    };
    const { result } = renderHook(() =>
      useIndicativePricingController({
        contracts: controllerContracts.slice(0, 1),
        productType: "carbon_future",
        dataSource,
      }),
    );

    await waitFor(() => expect(result.current.initialized).toBe(true));
    expect(result.current.state.context.pricingEnvironment).toBeNull();
    expect(getEnvironmentCurveSelection).not.toHaveBeenCalled();
  });

  it("normalizes raw curve responses and backfills linked curves after selection", async () => {
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const listDiscountCurveDefinitions = vi.fn(
      mockIndicativePricingDataSource.listDiscountCurveDefinitions,
    );
    const listCustomDiscountCurves = vi.fn(
      mockIndicativePricingDataSource.listCustomDiscountCurves,
    );
    const listCarbonForwardCurveDefinitions = vi.fn(
      mockIndicativePricingDataSource.listCarbonForwardCurveDefinitions,
    );
    const listCustomCarbonForwardCurves = vi.fn(
      mockIndicativePricingDataSource.listCustomCarbonForwardCurves,
    );
    const getEnvironmentCurveSelection = vi.fn(
      mockIndicativePricingDataSource.getEnvironmentCurveSelection,
    );
    const dataSource: IndicativePricingDataSource = {
      ...mockIndicativePricingDataSource,
      listDiscountCurveDefinitions,
      listCustomDiscountCurves,
      listCarbonForwardCurveDefinitions,
      listCustomCarbonForwardCurves,
      getEnvironmentCurveSelection,
    };
    const { result } = renderHook(() =>
      useIndicativePricingController({
        contracts: controllerContracts.slice(0, 1),
        productType: "carbon_future",
        dataSource,
      }),
    );

    await waitFor(() => expect(result.current.initialized).toBe(true));
    expect(listDiscountCurveDefinitions).toHaveBeenCalledTimes(1);
    expect(listCustomDiscountCurves).toHaveBeenCalledTimes(1);
    expect(listCarbonForwardCurveDefinitions).toHaveBeenCalledTimes(1);
    expect(listCustomCarbonForwardCurves).toHaveBeenCalledTimes(1);
    expect(result.current.state.context.pricingEnvironment?.id).toBe(
      "pricing-env-001",
    );
    expect(result.current.discountCurves).toHaveLength(2);
    expect(result.current.carbonForwardCurves).toHaveLength(2);
    expect(result.current.discountCurves[0]).toMatchObject({
      key: "discount:definition:discount-001",
      id: "discount-001",
      label: "人民币无风险利率曲线利率曲线（CNY-DR001）",
      kind: "discount",
      source: "definition",
      requestMapping: { disCurveDefId: "discount-001" },
    });
    expect(result.current.discountCurves[1]).toMatchObject({
      key: "discount:custom:discount-custom-001",
      id: "discount-custom-001",
      label: "人民币无风险利率曲线利率曲线（CNY-DR001）-2026-08-12",
      source: "custom",
      executeDay: "2026-08-12",
      requestMapping: { disCurveId: "discount-custom-001" },
    });
    expect(result.current.carbonForwardCurves[0]).toMatchObject({
      key: "carbonForward:definition:carbon-001",
      id: "carbon-001",
      kind: "carbonForward",
      source: "definition",
      requestMapping: { comCurveDefId: "carbon-001" },
    });
    expect(result.current.carbonForwardCurves[1]).toMatchObject({
      key: "carbonForward:custom:carbon-custom-001",
      id: "carbon-custom-001",
      label: "全国碳配额远期曲线（CEA-FWD）-2026-08-12",
      source: "custom",
      executeDay: "2026-08-12",
      requestMapping: { comCurveId: "carbon-custom-001" },
    });
    await waitFor(() =>
      expect(getEnvironmentCurveSelection).toHaveBeenCalledWith(
        {
          pricingEnvId: "pricing-env-001",
          productType: "carbon_future",
        },
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      ),
    );
    expect(consoleLog).toHaveBeenCalledWith(
      "[IndicativePricingforSelectedContracts] selected pricing environment id:",
      "pricing-env-001",
    );
    await waitFor(() => {
      expect(result.current.state.environmentCurvesStatus).toBe("success");
      expect(result.current.state.environmentCurvesError).toBeNull();
      expect(result.current.state.context.carbonForwardCurve?.id).toBe(
        result.current.carbonForwardCurves[0].id,
      );
      expect(result.current.state.context.discountCurve?.id).toBe(
        result.current.discountCurves[0].id,
      );
    });
    consoleLog.mockRestore();
  });

  it("loads resources, fills linked curves after environment selection and submits one ordered batch", async () => {
    const calculate = vi.fn(mockIndicativePricingDataSource.calculate);
    const dataSource: IndicativePricingDataSource = {
      ...mockIndicativePricingDataSource,
      calculate,
    };
    const { result } = renderHook(() =>
      useIndicativePricingController({
        contracts: controllerContracts.slice(0, 2),
        productType: "carbon_future",
        dataSource,
      }),
    );

    await waitFor(() => expect(result.current.initialized).toBe(true));
    await waitFor(() =>
      expect(result.current.state.context.pricingEnvironment?.id).toBe(
        "pricing-env-001",
      ),
    );
    await waitFor(() => expect(result.current.state.context.discountCurve).not.toBeNull());
    act(() => result.current.setContext("valuationDate", "2026-08-12"));

    let outcome: Awaited<ReturnType<typeof result.current.calculate>> | undefined;
    await act(async () => {
      outcome = await result.current.calculate();
    });
    expect(outcome?.kind).toBe("success");
    expect(calculate).toHaveBeenCalledTimes(1);
    expect(calculate.mock.calls[0][0]).toHaveLength(2);
    expect(calculate.mock.calls[0][0][0].astType).toBe("");
    expect(calculate.mock.calls[0][0][0].valDate).toBe("20260812");
    expect(result.current.state.resultByContractId["contract-001"].status).toBe("success");
  });

  it.each([400, 401, 403, 404, 409, 422, 500, 502, 515])(
    "uses the response body msg when the calculation request fails with HTTP %i",
    async (status) => {
      const backendMessage = `请求失败（HTTP ${status}）`;
      const requestError = Object.assign(
        new Error(`Request failed with status code ${status}`),
        {
          response: {
            status,
            data: {
              msg: backendMessage,
              path: "/gztech/pcs/api/v1/price-calculation",
              timestamp: "2026-08-25T18:00:00",
            },
          },
        },
      );
      const calculate = vi.fn().mockRejectedValue(requestError);
      const dataSource: IndicativePricingDataSource = {
        ...mockIndicativePricingDataSource,
        calculate,
      };
      const { result } = renderHook(() =>
        useIndicativePricingController({
          contracts: controllerContracts.slice(0, 2),
          productType: "carbon_future",
          dataSource,
          initialContext: demoInitialContext,
        }),
      );

      await waitFor(() => expect(result.current.initialized).toBe(true));
      await waitFor(() =>
        expect(result.current.state.environmentCurvesStatus).toBe("success"),
      );

      let outcome: Awaited<ReturnType<typeof result.current.calculate>> | undefined;
      await act(async () => {
        outcome = await result.current.calculate();
      });

      expect(outcome?.kind).toBe("requestError");
      expect(calculate).toHaveBeenCalledTimes(1);
      expect(result.current.state.resultByContractId).toMatchObject({
        "contract-001": { status: "error", message: backendMessage },
        "contract-002": { status: "error", message: backendMessage },
      });
    },
  );
});
