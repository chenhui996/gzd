/**
 * title: 多笔模式
 * description: 左侧字段列固定，每笔合约生成稳定动态列，并支持部分失败归属到合约列。
 */
import { App, ConfigProvider, IndicativePricingforSelectedContracts } from "gzd";
import { demoContracts, mockIndicativePricingDataSource } from "./mockDataSource";

export default function Demo() {
  return (
    <ConfigProvider themeMode="gold-dark">
      <App>
        <IndicativePricingforSelectedContracts
          mode="multiple"
          productType="carbon_future"
          contractData={demoContracts}
          dataSource={mockIndicativePricingDataSource}
        />
      </App>
    </ConfigProvider>
  );
}
