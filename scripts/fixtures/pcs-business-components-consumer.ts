/**
 * PCS-定价管理业务组件发布子路径的最小消费者契约。
 *
 * 本文件由 `npm run verify:exports` 单独编译，用正式包名验证组件和值类型
 * 都能从 `gzd/business-components/pcs` 被业务项目解析。
 * 真实 ESM/CJS 产物的运行时加载另由 `verify-package-exports.js` 检查。
 */
import {
  IndicativePricingforSelectedContracts,
  ValuationLogDataChart,
  type contractData,
  type contractItem,
  type IndicativePricingDataSource,
  type PriceCalRequest,
  type PriceCalResponse,
  type ValuationLogAdapter,
} from "gzd/business-components/pcs";
import {
  IndicativePricingforSelectedContracts as RootIndicativePricing,
  ValuationLogDataChart as RootValuationLogDataChart,
  type FinancialData,
  type IndicativePricingDataSource as RootPricingDataSource,
  type ValuationLogAdapter as RootValuationLogAdapter,
  type ValuationLogDataChartProps,
} from "gzd";

// 根入口与原子路径共享同一组件和类型契约。
const rootPricing: typeof IndicativePricingforSelectedContracts = RootIndicativePricing;
const rootChart: typeof ValuationLogDataChart = RootValuationLogDataChart;
const rootDataSource: RootPricingDataSource = {} as IndicativePricingDataSource;
const rootAdapter: RootValuationLogAdapter = {} as ValuationLogAdapter;
const financialData: FinancialData[] = [];
const chartProps: ValuationLogDataChartProps = {
  adapter: rootAdapter,
  allVarCodeSnum: "example-contract",
};
void rootPricing;
void rootChart;
void rootDataSource;
void financialData;
void chartProps;

// 不渲染组件，只要求两个具名值导出能通过消费者侧类型检查。
void IndicativePricingforSelectedContracts;
void ValuationLogDataChart;

// 不伪造完整实现，只验证两个公开契约类型可以被消费者导入和引用。
const dataSource = {} as IndicativePricingDataSource;
const contract = {} as contractItem;
const contracts = [] as contractData;
const priceCalRequest = [] as PriceCalRequest;
const priceCalResponse = [] as PriceCalResponse;
const valuationLogAdapter = {} as ValuationLogAdapter;
void dataSource;
void contract;
void contracts;
void priceCalRequest;
void priceCalResponse;
void valuationLogAdapter;
