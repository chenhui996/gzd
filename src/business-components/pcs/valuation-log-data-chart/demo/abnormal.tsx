/**
 * title: 异常展示
 * description: 响应数组整体非空，但部分日期的价格或 NPV 为空时，表格显示“-”，图表在当天按 0 绘制。
 */
import {
  App,
  ConfigProvider,
  ValuationLogDataChart,
  type FinancialData,
  type ValuationLogAdapter,
} from "gzd";

const valuationLogs: FinancialData[] = [
  {
    allVarCodeSnum: "340480468745060362",
    busnsDate: "20260801",
    valtnPrice: "37500",
    mval: "59000",
    tradeCrrc: "CNY",
  },
  {
    allVarCodeSnum: "340480468745060362",
    busnsDate: "20260802",
    valtnPrice: null,
    mval: "57600",
    tradeCrrc: "CNY",
  },
  {
    allVarCodeSnum: "340480468745060362",
    busnsDate: "20260803",
    valtnPrice: "39000",
    mval: null,
    tradeCrrc: "CNY",
  },
  {
    allVarCodeSnum: "340480468745060362",
    busnsDate: "20260804",
    valtnPrice: "",
    mval: "",
    tradeCrrc: "CNY",
  },
  {
    allVarCodeSnum: "340480468745060362",
    busnsDate: "20260805",
    valtnPrice: "39500",
    mval: "62400",
    tradeCrrc: "CNY",
  },
];

const abnormalAdapter: ValuationLogAdapter = {
  getValuationLogs: async () => valuationLogs,
};

export default function Demo() {
  return (
    <ConfigProvider themeMode="gold-dark">
      <App>
        <ValuationLogDataChart
          adapter={abnormalAdapter}
          allVarCodeSnum="340480468745060362"
        />
      </App>
    </ConfigProvider>
  );
}
