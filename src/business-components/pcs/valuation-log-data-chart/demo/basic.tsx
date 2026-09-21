/**
 * title: 近 30 日估值数据
 * description: 组件挂载时通过 Adapter 加载近 30 日估值日志，可在价格和 NPV 折线图之间切换。
 */
import {
  App,
  ConfigProvider,
  ValuationLogDataChart,
  type FinancialData,
  type ValuationLogAdapter,
} from "gzd";

const valuationLogs: FinancialData[] = [
  ["20260708", "65000", "27300"],
  ["20260709", "65000", "39900"],
  ["20260710", "65000", "50000"],
  ["20260711", "65000", "19750"],
  ["20260712", "65000", "45200"],
  ["20260713", "30000", "28500"],
  ["20260714", "10000", "32000"],
  ["20260715", "15500", "33500"],
  ["20260716", "62000", "28000"],
  ["20260717", "12500", "32000"],
  ["20260718", "18500", "36000"],
  ["20260719", "21000", "39000"],
  ["20260720", "25000", "42000"],
  ["20260721", "21000", "40000"],
  ["20260722", "26000", "46000"],
  ["20260723", "24000", "44000"],
  ["20260724", "28500", "47500"],
  ["20260725", "27000", "46800"],
  ["20260726", "31000", "50500"],
  ["20260727", "29500", "49200"],
  ["20260728", "33000", "53000"],
  ["20260729", "34500", "54800"],
  ["20260730", "32000", "52500"],
  ["20260731", "36000", "57200"],
  ["20260801", "37500", "59000"],
  ["20260802", "35500", "57600"],
  ["20260803", "39000", "61500"],
  ["20260804", "41000", "63800"],
  ["20260805", "39500", "62400"],
  ["20260806", "43000", "66000"],
].map(([busnsDate, valtnPrice, mval]) => ({
  allVarCodeSnum: "340480468745060362",
  busnsDate,
  valtnPrice,
  mval,
  tradeCrrc: "CNY",
}));

const adapter: ValuationLogAdapter = {
  getValuationLogs: (_params, { signal } = {}) =>
    new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => resolve(valuationLogs), 450);
      signal?.addEventListener("abort", () => {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      });
    }),
};

export default function Demo() {
  return (
    <ConfigProvider themeMode="gold-dark">
      <App>
        <ValuationLogDataChart
          adapter={adapter}
          allVarCodeSnum="340480468745060362"
        />
      </App>
    </ConfigProvider>
  );
}
