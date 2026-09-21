import { describe, expect, it } from "vitest";
import {
  normalizeCustomCarbonForwardCurves,
  normalizeCustomDiscountCurves,
  normalizeEnvironmentCurveSelection,
  normalizePricingEnvironments,
} from "./data-source-normalizer";

describe("定价环境归一化", () => {
  it("保留默认环境标识并将 pricingEnvId 转为字符串 id", () => {
    const environments = normalizePricingEnvironments([
      {
        pricingEnvId: 1112,
        code: "PCE-CNY",
        name: "人民币定价环境",
        englishName: "CNY pricing environment",
        currency: "CNY",
        status: true,
        createDate: "2026-06-12 13:22:11",
        updateDate: "2026-06-12 13:22:11",
        isDefault: true,
      },
    ]);

    expect(environments[0]).toMatchObject({
      id: "1112",
      status: true,
      createDate: "2026-06-12 13:22:11",
      updateDate: "2026-06-12 13:22:11",
      isDefault: true,
    });
  });
});

describe("自定义曲线目录归一化", () => {
  it("将紧凑格式的执行日按 YYYY-MM-DD 展示在曲线名称中", () => {
    const discountCurve = normalizeCustomDiscountCurves([
      {
        disCurveId: "discount-custom-001",
        code: "CNY-DR001",
        name: "人民币无风险利率曲线利率曲线",
        currency: "CNY",
        executeDay: "20260903",
      },
    ]);
    const carbonCurve = normalizeCustomCarbonForwardCurves([
      {
        comCurveId: "carbon-custom-001",
        code: "CEA-FWD",
        name: "全国碳配额远期曲线",
        currency: "CNY",
        executeDay: "20260903",
      },
    ]);

    expect(discountCurve[0].label).toBe(
      "人民币无风险利率曲线利率曲线（CNY-DR001）-2026-09-03",
    );
    expect(discountCurve[0]).toMatchObject({
      code: "CNY-DR001",
      name: "人民币无风险利率曲线利率曲线",
    });
    expect(carbonCurve[0].label).toBe(
      "全国碳配额远期曲线（CEA-FWD）-2026-09-03",
    );
    expect(carbonCurve[0]).toMatchObject({
      code: "CEA-FWD",
      name: "全国碳配额远期曲线",
    });
  });
});

describe("环境关联曲线归一化", () => {
  it("按 curveType 提取两类曲线，不再使用 curveClass 判断类型", () => {
    const selection = normalizeEnvironmentCurveSelection([
      {
        curveId: "5",
        curveCode: "disCurve02",
        curveName: "利率曲线2",
        curveType: "3",
        curveClass: "1",
      },
      {
        curveId: "4",
        curveCode: "comCurve01",
        curveName: "碳金融远期价格曲线2",
        curveType: "11",
        curveClass: "4",
      },
    ]);

    expect(selection).toEqual({
      discountCurve: {
        id: "5",
        label: "利率曲线2（disCurve02）",
        code: "disCurve02",
        name: "利率曲线2",
        kind: "discount",
        source: "definition",
        requestMapping: { disCurveDefId: "5" },
      },
      carbonForwardCurve: {
        id: "4",
        label: "碳金融远期价格曲线2（comCurve01）",
        code: "comCurve01",
        name: "碳金融远期价格曲线2",
        kind: "carbonForward",
        source: "definition",
        requestMapping: { comCurveDefId: "4" },
      },
    });
  });
});
