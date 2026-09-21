import type {
  CarbonForwardCurveDefinitionInput,
  contractData,
  CustomCarbonForwardCurveInput,
  CustomDiscountCurveInput,
  DiscountCurveDefinitionInput,
  EnvironmentCurveReferenceInput,
  IndicativePricingContextValues,
  IndicativePricingDataSource,
  PriceCalResponse,
  PriceCalResponseItem,
  PricingEnvironmentInput,
} from "gzd";

export const priceCalculateSuccessResponse = [
  {
    priceCalDataId: "1",
    priceCalId: "1",
    tradeId: "TRADE001",
    astType: "Forward",
    maturityTime: "1.5",
    npv: "12568.32612",
    discountFactor: "0.9652",
    forwardPrice: "-58.62",
    msg: "计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg计算成功msg",
  },
] satisfies PriceCalResponse;

export const priceCalculateFailResponse = [
  {
    tradeId: "TRADE001",
    msg: "计算失败msg计算失败msg计算失败msg计算失败msg计算失败msg",
    code: "NO_RESULT",
  },
] satisfies PriceCalResponse;

const calculateResponseTemplates: readonly PriceCalResponseItem[] = [
  ...priceCalculateSuccessResponse,
  ...priceCalculateFailResponse,
];

export const demoContracts: contractData = [
  {
    astType: "",
    targtAllVarCodeSum: "CEA",
    scrtyCode: "CEA",
    currency: "CNY",
    fwdMaturityDate: "20261130",
    settleDate: "20261202",
    physicalDelivery: "1",
    direction: "L",
    fwdDlvPrice: "76.25",
    targtVol: "10000",
  },
  {
    astType: "",
    targtAllVarCodeSum: "CEA",
    scrtyCode: "CEA",
    currency: "CNY",
    fwdMaturityDate: "20261215",
    settleDate: "20261218",
    physicalDelivery: "2",
    direction: "S",
    fwdDlvPrice: "78.30",
    targtVol: "8000",
  },
  {
    astType: "",
    targtAllVarCodeSum: "CEA",
    scrtyCode: "CEA",
    currency: "CNY",
    fwdMaturityDate: "20270115",
    settleDate: "20270118",
    physicalDelivery: "1",
    direction: "L",
    fwdDlvPrice: "80.00",
    targtVol: "12000",
  },
];

const environments = [
  {
    pricingEnvId: "pricing-env-001",
    code: "PCE-CNY",
    name: "默认定价环境",
    englishName: "CNY pricing environment",
    currency: "CNY",
    status: true,
    createDate: "2026-06-12 13:22:11",
    updateDate: "2026-06-12 13:22:11",
    isDefault: true,
  },
  {
    pricingEnvId: "pricing-env-002",
    code: "PCE-CNY-ALT",
    name: "人民币备选定价环境",
    englishName: "CNY alternative pricing environment",
    currency: "CNY",
    status: true,
  },
  {
    pricingEnvId: "pricing-env-003",
    code: "PCE-CNY-STRESS",
    name: "人民币压力定价环境",
    englishName: "CNY stress pricing environment",
    currency: "CNY",
    status: true,
  },
] satisfies readonly PricingEnvironmentInput[];

export const demoInitialContext = {
  pricingEnvironment: {
    id: "pricing-env-001",
    code: "PCE-CNY",
    name: "人民币定价环境",
    englishName: "CNY pricing environment",
    currency: "CNY",
  },
  discountCurve: {
    key: "discount:definition:discount-001",
    id: "discount-001",
    label: "人民币无风险利率曲线利率曲线（CNY-DR001）",
    code: "CNY-DR001",
    name: "人民币无风险利率曲线利率曲线",
    kind: "discount",
    source: "definition",
    currency: "CNY",
    requestMapping: { disCurveDefId: "discount-001" },
  },
  carbonForwardCurve: {
    key: "carbonForward:definition:carbon-001",
    id: "carbon-001",
    label: "全国碳配额远期曲线（CEA-FWD）",
    code: "CEA-FWD",
    name: "全国碳配额远期曲线",
    kind: "carbonForward",
    source: "definition",
    currency: "CNY",
    requestMapping: { comCurveDefId: "carbon-001" },
  },
  valuationDate: "2026-08-12",
} satisfies IndicativePricingContextValues;

const discountCurve: DiscountCurveDefinitionInput = {
  disCurveDefId: "discount-001",
  code: "CNY-DR001",
  name: "人民币无风险利率曲线利率曲线",
  currency: "CNY",
};

const customDiscountCurveCreateDate = "2026-06-13 13:22:11";
const customDiscountCurveExecuteDay = "2026-08-12";
const customDiscountCurve: CustomDiscountCurveInput = {
  disCurveId: "discount-custom-001",
  code: "CNY-DR001",
  name: "人民币无风险利率曲线利率曲线",
  currency: "CNY",
  createDate: customDiscountCurveCreateDate,
  executeDay: customDiscountCurveExecuteDay,
};

const carbonCurve: CarbonForwardCurveDefinitionInput = {
  comCurveDefId: "carbon-001",
  code: "CEA-FWD",
  name: "全国碳配额远期曲线",
  currency: "CNY",
};

const customCarbonCurveCreateDate = "2026-06-13 13:22:11";
const customCarbonCurveExecuteDay = "2026-08-12";
const customCarbonCurve: CustomCarbonForwardCurveInput = {
  comCurveId: "carbon-custom-001",
  code: "CEA-FWD",
  name: "全国碳配额远期曲线",
  currency: "CNY",
  createDate: customCarbonCurveCreateDate,
  executeDay: customCarbonCurveExecuteDay,
};

const environmentCurves: readonly EnvironmentCurveReferenceInput[] = [
  {
    curveId: discountCurve.disCurveDefId,
    curveCode: discountCurve.code,
    curveName: discountCurve.name,
    curveType: "3",
    curveClass: "1",
  },
  {
    curveId: carbonCurve.comCurveDefId,
    curveCode: carbonCurve.code,
    curveName: carbonCurve.name,
    curveType: "11",
    curveClass: "4",
  },
];

export const mockIndicativePricingDataSource: IndicativePricingDataSource = {
  async listPricingEnvironments() {
    return environments;
  },
  async listDiscountCurveDefinitions() {
    return [discountCurve];
  },
  async listCustomDiscountCurves() {
    return [customDiscountCurve];
  },
  async listCarbonForwardCurveDefinitions() {
    return [carbonCurve];
  },
  async listCustomCarbonForwardCurves() {
    return [customCarbonCurve];
  },
  async getEnvironmentCurveSelection() {
    return environmentCurves;
  },
  async calculate(payload) {
    return payload.map((item, index) => ({
      ...calculateResponseTemplates[index % calculateResponseTemplates.length],
      tradeId: item.instrumentId,
    }));
  },
};
