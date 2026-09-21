import type { CSSProperties } from "react";

export type IndicativePricingMode = "fixedSingle" | "multiple";
export type TradeDirection = "L" | "S";
export type PhysicalDeliveryType = "1" | "2";
export type CurveKind = "discount" | "carbonForward";
export type CurveSource = "definition" | "custom";

/** 组件接收的单条合约数据。 */
export interface contractItem {
  /** 资产类型，当前固定传空字符串。 */
  astType: "";
  /** 标的全品种序号。 */
  targtAllVarCodeSum: string;
  /** 标的中文简称。 */
  scrtyCode: string;
  /** 币种。 */
  currency: string;
  /** 远期到期日，格式 YYYYMMDD。 */
  fwdMaturityDate: string;
  /** 结算支付日，格式 YYYYMMDD。 */
  settleDate: string;
  /** 交割方式，1 为实物交割，2 为现金交割。 */
  physicalDelivery: PhysicalDeliveryType;
  /** 买卖方向。S-short 卖出，L-long 买入。 */
  direction: TradeDirection;
  /** 远期交割价格。有值则传，没有值则传空字符串。 */
  fwdDlvPrice: string;
  /** 标的数量。 */
  targtVol: string;
  /** 合约全品种序号。非必填 */
  instrumentId?: string;
  /** 成交编号。非必填 */
  instrumentCode?: string;
  /** 合约名称。非必填 */
  instrumentName?: string;
  /** 交易对手 ID。非必填 */
  tradeContpId?: string;
  /** 产品类型。 */
  productType?: string;
}

/** 组件接收的合约数据列表。 */
export type contractData = contractItem[];

/** 组件内部带稳定结果键的合约快照。 */
export interface IndicativePricingContract extends contractItem {
  contractId: string;
}

export interface IndicativePricingRequestContext {
  signal?: AbortSignal;
}

/** 查询可用定价环境的固定参数。 */
export interface PricingEnvironmentQueryParams {
  /** 启用状态，固定传 true。 */
  status: true;
}

/** 查询即期利率曲线定义的固定参数。 */
export interface DiscountCurveDefinitionQueryParams {
  /** 曲线类型，固定传 "3"（无风险利率曲线利率曲线）。 */
  type: "3";
  /** 启用状态，固定传 true。 */
  status: true;
}

/** 查询自定义即期利率曲线的固定参数。 */
export interface CustomDiscountCurveQueryParams {
  /** 曲线类型，固定传 "3"（无风险利率曲线利率曲线）。 */
  type: "3";
  /** 是否仅查询自定义曲线，固定传 true。 */
  isCustom: true;
}

/** 查询碳金融远期价格曲线定义的固定参数。 */
export interface CarbonForwardCurveDefinitionQueryParams {
  /** 曲线类型，固定传 "11"（碳金融远期价格曲线）。 */
  type: "11";
  /** 启用状态，固定传 true。 */
  status: true;
}

/** 查询自定义碳金融远期价格曲线的固定参数。 */
export interface CustomCarbonForwardCurveQueryParams {
  /** 曲线类型，固定传 "11"（碳金融远期价格曲线）。 */
  type: "11";
  /** 是否仅查询自定义曲线，固定传 true。 */
  isCustom: true;
}

export interface PricingEnvironment {
  id: string;
  code: string;
  name: string;
  englishName: string | null;
  currency: string;
  /** 启用状态。 */
  status?: boolean;
  /** 创建时间，格式以接口返回为准。 */
  createDate?: string;
  /** 更新时间，格式以接口返回为准。 */
  updateDate?: string;
  /** 是否为默认定价环境，接口最多返回一个默认项。 */
  isDefault?: boolean;
}

/** 定价环境数据源可直接返回的后端字段结构。 */
export type PricingEnvironmentInput =
  | PricingEnvironment
  | (Omit<PricingEnvironment, "id" | "status"> & {
      id?: string;
      pricingEnvId: string | number;
      status: boolean;
    });

export type CurveRequestMapping =
  | { disCurveDefId: string }
  | { disCurveId: string }
  | { comCurveDefId: string }
  | { comCurveId: string };

export interface CurveCatalogItem {
  key: string;
  id: string;
  label: string;
  /** 曲线编码，用于生成选中态展示文案。 */
  code?: string;
  /** 曲线名称，用于生成选中态展示文案。 */
  name?: string;
  kind: CurveKind;
  source: CurveSource;
  currency: string;
  createDate?: string;
  /** 自定义曲线执行日，用于展示曲线日期，格式以接口返回为准。 */
  executeDay?: string;
  requestMapping: CurveRequestMapping;
}

interface CurveResponseItemBase {
  code: string;
  name: string;
  currency: string;
  createDate?: string;
}

/** 即期利率曲线定义接口返回项。 */
export interface DiscountCurveDefinitionInput extends CurveResponseItemBase {
  disCurveDefId: string | number;
}

/** 自定义即期利率曲线接口返回项。 */
export interface CustomDiscountCurveInput extends CurveResponseItemBase {
  disCurveId: string | number;
  /** 自定义曲线执行日。 */
  executeDay?: string;
}

/** 碳金融远期价格曲线定义接口返回项。 */
export interface CarbonForwardCurveDefinitionInput extends CurveResponseItemBase {
  comCurveDefId: string | number;
}

/** 自定义碳金融远期价格曲线接口返回项。 */
export interface CustomCarbonForwardCurveInput extends CurveResponseItemBase {
  comCurveId: string | number;
  /** 自定义曲线执行日。 */
  executeDay?: string;
}

export interface CurveSelectionReference {
  id: string;
  label: string;
  code?: string;
  name?: string;
  kind: CurveKind;
  source: CurveSource;
  requestMapping: CurveRequestMapping;
}

export interface EnvironmentCurveSelection {
  discountCurve: CurveSelectionReference;
  carbonForwardCurve: CurveSelectionReference;
}

/** 查询环境关联曲线接口返回项。 */
export interface EnvironmentCurveReferenceInput {
  curveId: string | number;
  curveCode: string;
  curveName: string;
  /** 曲线类型，3 为无风险利率曲线利率曲线，11 为碳金融远期价格曲线。 */
  curveType: string | number;
  /** 后端曲线分类。 */
  curveClass: string | number;
}

/** 环境关联曲线既兼容原始接口数组，也兼容已归一化的领域结构。 */
export type EnvironmentCurveSelectionInput =
  | readonly EnvironmentCurveReferenceInput[]
  | EnvironmentCurveSelection
  | null;

/** 计算接口单条请求项。 */
export interface PriceCalRequestItem extends contractItem {
  /** 估值日，格式 YYYYMMDD。 */
  valDate: string;
  /** 利率曲线定义 ID。 */
  disCurveDefId: string;
  /** 利率曲线实例 ID。 */
  disCurveId: string;
  /** 碳金融远期价格曲线定义 ID。 */
  comCurveDefId: string;
  /** 碳金融远期价格曲线实例 ID。 */
  comCurveId: string;
}

/** 计算接口请求体。 */
export type PriceCalRequest = PriceCalRequestItem[];

/** 计算接口单条响应项。 */
export interface PriceCalResponseItem {
  /** 计算结果数据唯一 ID。 */
  priceCalDataId?: string;
  /** 计算表 ID。 */
  priceCalId?: string;
  /** 交易编号。 */
  tradeId?: string;
  /** 资产类型。 */
  astType?: string;
  /** 产品类型。 */
  productType?: string;
  /** 到期年限。 */
  maturityTime?: string;
  /** 净现值。 */
  npv?: string;
  /** 贴现因子。 */
  discountFactor?: string;
  /** 远期价格。 */
  forwardPrice?: string;
  /** 单条计算业务错误码。 */
  code?: string | number;
  /** 单条计算错误或提示信息。 */
  msg?: string;
  /** 其它后端扩展字段。 */
  [property: string]: unknown;
}

/** 计算接口响应体。 */
export type PriceCalResponse = PriceCalResponseItem[];

/** @deprecated 请使用 PriceCalRequestItem。 */
export type IndicativePricingRequestItem = PriceCalRequestItem;

/** @deprecated 请使用 PriceCalResponseItem。 */
export type IndicativePricingResponseItem = PriceCalResponseItem;

export interface IndicativePricingDataSource {
  listPricingEnvironments(
    params: PricingEnvironmentQueryParams,
    context?: IndicativePricingRequestContext,
  ): Promise<readonly PricingEnvironmentInput[]>;
  listDiscountCurveDefinitions(
    params: DiscountCurveDefinitionQueryParams,
    context?: IndicativePricingRequestContext,
  ): Promise<readonly (DiscountCurveDefinitionInput | CurveCatalogItem)[]>;
  listCustomDiscountCurves(
    params: CustomDiscountCurveQueryParams,
    context?: IndicativePricingRequestContext,
  ): Promise<readonly (CustomDiscountCurveInput | CurveCatalogItem)[]>;
  listCarbonForwardCurveDefinitions(
    params: CarbonForwardCurveDefinitionQueryParams,
    context?: IndicativePricingRequestContext,
  ): Promise<readonly (CarbonForwardCurveDefinitionInput | CurveCatalogItem)[]>;
  listCustomCarbonForwardCurves(
    params: CustomCarbonForwardCurveQueryParams,
    context?: IndicativePricingRequestContext,
  ): Promise<readonly (CustomCarbonForwardCurveInput | CurveCatalogItem)[]>;
  getEnvironmentCurveSelection(
    params: { pricingEnvId: string; productType: string },
    context?: IndicativePricingRequestContext,
  ): Promise<EnvironmentCurveSelectionInput>;
  calculate(
    payload: PriceCalRequest,
    context?: IndicativePricingRequestContext,
  ): Promise<PriceCalResponse>;
}

export interface IndicativePricingforSelectedContractsProps {
  mode?: IndicativePricingMode;
  /** 查询环境关联曲线时使用的产品类型。 */
  productType: string;
  contractData: contractData;
  dataSource: IndicativePricingDataSource;
  /** 组件首次挂载时使用的定价上下文。 */
  initialContext?: Partial<IndicativePricingContextValues>;
  /** 初始定价上下文完整且资源加载完成后，自动执行一次计算。 */
  autoCalculate?: boolean;
  onNavigateToPricingPage?: () => void;
  className?: string;
  style?: CSSProperties;
}

export interface IndicativePricingContextValues {
  pricingEnvironment: PricingEnvironment | null;
  carbonForwardCurve: CurveCatalogItem | null;
  discountCurve: CurveCatalogItem | null;
  valuationDate: string | null;
}

export interface IndicativePricingResult {
  npv: string | null;
  forwardPrice: string | null;
  discountFactor: string | null;
  maturityTime: string | null;
}

export type ContractCalculationStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error";

export interface ContractCalculationState {
  contractId: string;
  status: ContractCalculationStatus;
  result: IndicativePricingResult | null;
  message: string | null;
  resultInputVersion: number | null;
}
