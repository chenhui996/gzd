/**
 * title: 固定单笔模式
 * description: 单笔合约采用固定字段列布局；定价环境接口模拟返回一个默认环境和多个非默认环境，默认项会自动填入。
 */
import { App, ConfigProvider, IndicativePricingforSelectedContracts } from "gzd";
import { demoContracts, mockIndicativePricingDataSource } from "./mockDataSource";

export default function Demo() {
  return (
    <ConfigProvider themeMode="gold-dark">
      <App>
        <IndicativePricingforSelectedContracts
          mode="fixedSingle"
          productType="carbon_future"
          contractData={demoContracts.slice(0, 1)}
          dataSource={mockIndicativePricingDataSource}
          onNavigateToPricingPage={() => console.log("跳转定价页面")}
        />
      </App>
    </ConfigProvider>
  );
}
