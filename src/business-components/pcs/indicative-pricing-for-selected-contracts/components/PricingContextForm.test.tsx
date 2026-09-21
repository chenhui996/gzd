import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
  CurveCatalogItem,
  IndicativePricingContextValues,
  PricingEnvironment,
} from "../types";
import PricingContextForm from "./PricingContextForm";

const customDiscountCurve: CurveCatalogItem = {
  key: "discount:custom:discount-custom-001",
  id: "discount-custom-001",
  label: "CNY-DR001(人民币无风险利率曲线利率曲线)-2026-09-03",
  code: "CNY-DR001",
  name: "人民币无风险利率曲线利率曲线",
  kind: "discount",
  source: "custom",
  currency: "CNY",
  executeDay: "20260903",
  createDate: "2026-08-01 12:00:00",
  requestMapping: { disCurveId: "discount-custom-001" },
};

const definitionDiscountCurve: CurveCatalogItem = {
  key: "discount:definition:discount-001",
  id: "discount-001",
  label: "CNY-DR000(旧格式曲线定义)",
  code: "CNY-DR000",
  name: "人民币无风险利率曲线定义",
  kind: "discount",
  source: "definition",
  currency: "CNY",
  requestMapping: { disCurveDefId: "discount-001" },
};

const pricingEnvironment: PricingEnvironment = {
  id: "pricing-env-001",
  code: "PCE-CNY",
  name: "人民币定价环境",
  englishName: "CNY pricing environment",
  currency: "CNY",
};

function renderPricingContextForm(
  context: Partial<IndicativePricingContextValues>,
) {
  const value: IndicativePricingContextValues = {
    pricingEnvironment: null,
    carbonForwardCurve: null,
    discountCurve: null,
    valuationDate: null,
    ...context,
  };

  return render(
    <PricingContextForm
      mode="multiple"
      value={value}
      errors={{}}
      environments={[pricingEnvironment]}
      discountCurves={[definitionDiscountCurve, customDiscountCurve]}
      carbonForwardCurves={[]}
      environmentsLoading={false}
      curvesLoading={false}
      curvesDisabled={false}
      disabled={false}
      onChange={vi.fn()}
    />,
  );
}

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class ResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("曲线日与估值日提示", () => {
  it("格式化 executeDay 后与估值日为同一天时不展示提示", () => {
    renderPricingContextForm({
      discountCurve: customDiscountCurve,
      valuationDate: "2026-09-03",
    });

    expect(screen.queryByText("曲线日与估值日非同一日")).toBeNull();
  });

  it("格式化 executeDay 后与估值日不同时展示提示", () => {
    renderPricingContextForm({
      discountCurve: customDiscountCurve,
      valuationDate: "2026-09-04",
    });

    expect(screen.getByText("曲线日与估值日非同一日")).toBeTruthy();
  });

  it("executeDay 缺失时不使用 createDate，并展示提示", () => {
    renderPricingContextForm({
      discountCurve: {
        ...customDiscountCurve,
        executeDay: undefined,
        createDate: "2026-09-02 12:00:00",
      },
      valuationDate: "2026-09-03",
    });

    expect(screen.getByText("曲线日与估值日非同一日")).toBeTruthy();
  });
});

describe("Select 展示文案", () => {
  it("按名称在前、编码在后的格式展示环境和自定义曲线选中态", () => {
    renderPricingContextForm({
      pricingEnvironment,
      discountCurve: customDiscountCurve,
    });

    expect(screen.getByText("人民币定价环境（PCE-CNY）")).toBeTruthy();
    expect(
      screen.getByText(
        "人民币无风险利率曲线利率曲线（CNY-DR001）-2026-09-03",
      ),
    ).toBeTruthy();
  });

  it("候选项分别展示曲线定义格式和带日期的自定义曲线格式", async () => {
    const user = userEvent.setup();
    renderPricingContextForm({ discountCurve: customDiscountCurve });

    await user.click(screen.getByLabelText("无风险利率曲线利率曲线"));

    expect(
      await screen.findByText("人民币无风险利率曲线定义（CNY-DR000）"),
    ).toBeTruthy();
    expect(
      screen.getAllByText(
        "人民币无风险利率曲线利率曲线（CNY-DR001）-2026-09-03",
      ),
    ).toHaveLength(2);
  });
});
