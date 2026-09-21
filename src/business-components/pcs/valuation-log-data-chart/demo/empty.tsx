/**
 * title: 无估值数据
 * description: Adapter 返回空数组时，表格和图表展示统一的“暂无数据”空状态。
 */
import {
  App,
  ConfigProvider,
  ValuationLogDataChart,
  type ValuationLogAdapter,
} from "gzd";

const emptyAdapter: ValuationLogAdapter = {
  getValuationLogs: async () => [],
};

export default function Demo() {
  return (
    <ConfigProvider themeMode="gold-dark">
      <App>
        <ValuationLogDataChart
          adapter={emptyAdapter}
          allVarCodeSnum="340480468745060362"
        />
      </App>
    </ConfigProvider>
  );
}
