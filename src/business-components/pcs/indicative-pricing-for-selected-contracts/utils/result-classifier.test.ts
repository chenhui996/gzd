import { describe, expect, it } from "vitest";
import {
  priceCalculateFailResponse,
  priceCalculateSuccessResponse,
} from "../demo/mockDataSource";
import { classifyCalculationBatch, classifyCalculationResult } from "./result-classifier";

describe("calculation result classifier", () => {
  it("accepts the successful calculation response mock", () => {
    expect(
      classifyCalculationResult(
        "c-1",
        priceCalculateSuccessResponse[0],
        2,
      ),
    ).toMatchObject({
      status: "success",
      message: "计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg",
      resultInputVersion: 2,
    });
  });

  it("classifies the failed calculation response mock and missing items by index", () => {
    const results = classifyCalculationBatch(
      ["c-1", "c-2"],
      priceCalculateFailResponse,
      3,
    );
    expect(results["c-1"]).toMatchObject({
      status: "error",
      message: "计算失败msg计算失败msg计算失败msg计算失败msg计算失败msg",
    });
    expect(results["c-2"]).toMatchObject({ status: "error", message: "未返回计算结果" });
  });
});
