import App from "../../src/components/app";
import ConfigProvider from "../../src/components/config-provider";
import IndicativePricingforSelectedContracts from "../../src/business-components/pcs/indicative-pricing-for-selected-contracts/IndicativePricingforSelectedContracts";
import type { IndicativePricingMode } from "../../src/business-components/pcs/indicative-pricing-for-selected-contracts/types";
import {
  demoContracts,
  mockIndicativePricingDataSource,
} from "../../src/business-components/pcs/indicative-pricing-for-selected-contracts/demo/mockDataSource";

const browserDataSource = {
  ...mockIndicativePricingDataSource,
  async calculate() {
    return [
      {
        code: 200,
        npv: "183500.25",
        forwardPrice: "79.12654321",
        discountFactor: "0.9826",
      },
      {
        code: 200,
        npv: "-12500.5",
        forwardPrice: "80.12654321",
        discountFactor: "0.9796",
      },
      {
        code: 200,
        npv: "193500.25",
        forwardPrice: "81.12654321",
        discountFactor: "0.9766",
      },
    ];
  },
};

const backendEnvironmentDataSource = {
  ...browserDataSource,
  async listPricingEnvironments() {
    return [
      {
        pricingEnvId: 1,
        code: "PCE-CNY",
        name: "人民币定价环境",
        englishName: null,
        currency: "CNY",
      },
    ];
  },
};

const calculationErrorDataSource = {
  ...browserDataSource,
  async calculate() {
    return [
      {
        code: "NO_RESULT",
        msg: "Wdi_01cjanc 10_ not found",
      },
    ];
  },
};

export default function IndicativePricingTestHarness({
  mode = "multiple",
  overLimit = false,
  withMissingContractData = false,
  withBackendEnvironmentId = false,
  withCalculationError = false,
}: {
  mode?: IndicativePricingMode;
  overLimit?: boolean;
  withMissingContractData?: boolean;
  withBackendEnvironmentId?: boolean;
  withCalculationError?: boolean;
}) {
  const sourceContracts = overLimit
    ? Array.from({ length: 1001 }, (_, index) => ({
        ...demoContracts[0],
        instrumentId: `instrument-${index}`,
      }))
    : demoContracts;
  const contracts = withMissingContractData
    ? sourceContracts.map((contract, index) =>
        index === 0 ? { ...contract, fwdDlvPrice: "" } : contract,
      )
    : sourceContracts;

  return (
    <ConfigProvider themeMode="gold-dark">
      <App>
        <IndicativePricingforSelectedContracts
          mode={mode}
          productType="carbon_future"
          contractData={contracts}
          dataSource={
            withCalculationError
              ? calculationErrorDataSource
              : withBackendEnvironmentId
              ? backendEnvironmentDataSource
              : browserDataSource
          }
          onNavigateToPricingPage={() => console.log("跳转定价页面")}
        />
      </App>
    </ConfigProvider>
  );
}
