/**
 * title: 固定单笔模式下 - 计算结果错误
 * description: 示例加载后自动计算，接口失败原因会作为表格第三行横跨全部列展示。
 */
import {
  App,
  ConfigProvider,
  IndicativePricingforSelectedContracts,
  type IndicativePricingDataSource,
} from "gzd";
import {
  demoContracts,
  demoInitialContext,
  mockIndicativePricingDataSource,
} from "./mockDataSource";

const calculationErrorDataSource = {
  ...mockIndicativePricingDataSource,
  async calculate() {
    return [
      {
        code: "NO_RESULT",
        msg: "Wdi_01cjanc 10_ not found",
      },
    ];
  },
} satisfies IndicativePricingDataSource;

export default function Demo() {
  return (
    <ConfigProvider themeMode="gold-dark">
      <App>
        <IndicativePricingforSelectedContracts
          mode="fixedSingle"
          productType="carbon_future"
          contractData={demoContracts.slice(0, 1)}
          dataSource={calculationErrorDataSource}
          initialContext={demoInitialContext}
          autoCalculate
          onNavigateToPricingPage={() => console.log("跳转定价页面")}
        />
      </App>
    </ConfigProvider>
  );
}
