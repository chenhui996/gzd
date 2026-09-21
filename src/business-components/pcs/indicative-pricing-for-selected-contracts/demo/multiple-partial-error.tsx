/**
 * title: 多笔合约 - 部分计算失败
 * description: 示例加载后自动计算；成功结果正常展示，失败原因纵向合并在对应合约列中。
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
  priceCalculateFailResponse,
  priceCalculateSuccessResponse,
} from "./mockDataSource";

const partialFailureContracts = Array.from({ length: 5 }, (_, index) => ({
  ...demoContracts[index % demoContracts.length],
  instrumentId: `contract-demo-${index + 1}`,
  instrumentCode: `1224411230${index + 1}`,
  scrtyCode: `10062${index + 1}`,
}));

const partialFailureDataSource = {
  ...mockIndicativePricingDataSource,
  async calculate(payload) {
    return payload.map((item, index) => ({
      ...(index < 3
        ? priceCalculateSuccessResponse[0]
        : priceCalculateFailResponse[0]),
      tradeId: item.instrumentId,
    }));
  },
} satisfies IndicativePricingDataSource;

export default function Demo() {
  return (
    <ConfigProvider themeMode="gold-dark">
      <App>
        <IndicativePricingforSelectedContracts
          mode="multiple"
          productType="carbon_future"
          contractData={partialFailureContracts}
          dataSource={partialFailureDataSource}
          initialContext={demoInitialContext}
          autoCalculate
        />
      </App>
    </ConfigProvider>
  );
}
