/**
 * title: 正数、跨零与负数
 * description: 价格和 NPV 均支持全正、跨零和全负数据；纵轴按数据跨度留白，同号数据的范围不会跨过 0。
 */
import {
  App,
  ConfigProvider,
  ValuationLogDataChart,
  type FinancialData,
  type ValuationLogAdapter,
} from "gzd";

const createAdapter = (data: FinancialData[]): ValuationLogAdapter => ({
  getValuationLogs: async () => data,
});

const createLogs = (
  values: Array<[busnsDate: string, valtnPrice: string, mval: string]>,
): FinancialData[] =>
  values.map(([busnsDate, valtnPrice, mval]) => ({
    allVarCodeSnum: "340480468745060362",
    busnsDate,
    valtnPrice,
    mval,
    tradeCrrc: "CNY",
  }));

const cases = [
  {
    title: "数值全部为正数",
    adapter: createAdapter(
      createLogs([
        ["20260801", "1", "10"],
        ["20260802", "32", "340"],
        ["20260803", "18", "180"],
        ["20260804", "76", "720"],
        ["20260805", "100", "1000"],
      ]),
    ),
  },
  {
    title: "数值有正有负",
    adapter: createAdapter(
      createLogs([
        ["20260801", "-100", "-1000"],
        ["20260802", "-35", "-320"],
        ["20260803", "0", "0"],
        ["20260804", "48", "260"],
        ["20260805", "100", "500"],
      ]),
    ),
  },
  {
    title: "数值全部为负数",
    adapter: createAdapter(
      createLogs([
        ["20260801", "-100", "-1000"],
        ["20260802", "-68", "-760"],
        ["20260803", "-84", "-840"],
        ["20260804", "-20", "-180"],
        // ["20260805", "-1", "-10"],
      ]),
    ),
  },
];

export default function Demo() {
  return (
    <ConfigProvider themeMode="gold-dark">
      <App>
        {cases.map(({ title, adapter }) => (
          <section key={title} style={{ marginBottom: 24 }}>
            <h4>{title}</h4>
            <ValuationLogDataChart
              adapter={adapter}
              allVarCodeSnum="340480468745060362"
            />
          </section>
        ))}
      </App>
    </ConfigProvider>
  );
}
