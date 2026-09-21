import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Alert from "../../../components/alert";
import App from "../../../components/app";
import Button from "../../../components/button";
import Empty from "../../../components/empty";
import Spin from "../../../components/spin";
import { MAX_CONTRACT_COUNT } from "./constants";
import FixedSingleResultGrid from "./components/FixedSingleResultGrid";
import MultipleResultGrid from "./components/MultipleResultGrid";
import PricingContextForm from "./components/PricingContextForm";
import PricingFooter from "./components/PricingFooter";
import ResourceIssues from "./components/ResourceIssues";
import { useIndicativePricingController } from "./hooks/useIndicativePricingController";
import type {
  IndicativePricingContract,
  IndicativePricingforSelectedContractsProps,
} from "./types";
import styles from "./style.module.less";

export default function IndicativePricingforSelectedContracts(
  props: IndicativePricingforSelectedContractsProps,
) {
  const {
    mode = "multiple",
    productType,
    contractData,
    dataSource,
    initialContext,
    autoCalculate = false,
    onNavigateToPricingPage,
    className,
    style,
  } = props;
  const { message } = App.useApp();
  console.info("511: contractData", contractData);
  const [contractSnapshot] = useState<readonly IndicativePricingContract[]>(() =>
    Object.freeze(
      (mode === "fixedSingle" ? contractData.slice(0, 1) : [...contractData]).map(
        (contract, index) =>
          Object.freeze({
            ...contract,
            contractId: `contract-${String(index + 1).padStart(3, "0")}`,
          }),
      ),
    ),
  );
  const [sourceCount] = useState(() => contractData.length);

  const overLimit = mode === "multiple" && sourceCount > MAX_CONTRACT_COUNT;
  const contracts = overLimit ? [] : contractSnapshot;
  const controller = useIndicativePricingController({
    contracts,
    productType,
    dataSource,
    initialContext,
  });
  const { calculate, initialized, state } = controller;
  const emptyToastShownRef = useRef(false);
  const autoCalculationStartedRef = useRef(false);

  useEffect(() => {
    if (contracts.length === 0 && !overLimit && !emptyToastShownRef.current) {
      emptyToastShownRef.current = true;
      void message.warning("请先选择一笔合约");
    }
  }, [contracts.length, message, overLimit]);

  const allDisabled = contracts.length === 0 || overLimit;
  const calculationDisabled =
    !controller.initialized ||
    state.submitting ||
    state.environmentCurvesStatus === "loading";
  const curveCatalogsLoading = [
    state.resources.discountDefinitions.status,
    state.resources.customDiscountCurves.status,
    state.resources.carbonDefinitions.status,
    state.resources.customCarbonCurves.status,
  ].some((status) => status === "loading");
  const environmentCurvesLoading =
    state.environmentCurvesStatus === "loading";

  useEffect(() => {
    if (
      !autoCalculate ||
      autoCalculationStartedRef.current ||
      contracts.length === 0 ||
      overLimit ||
      !initialized ||
      state.environmentCurvesStatus === "loading" ||
      state.submitting ||
      Object.values(state.context).some((value) => value == null)
    ) {
      return;
    }
    autoCalculationStartedRef.current = true;
    void calculate();
  }, [
    autoCalculate,
    calculate,
    contracts.length,
    initialized,
    overLimit,
    state.context,
    state.environmentCurvesStatus,
    state.submitting,
  ]);

  const handleCalculate = async () => {
    const outcome = await calculate();
    if (outcome.kind === "invalid") {
      void message.error("请完成所有定价要素配置");
    } else if (outcome.kind === "success" && outcome.hasExtraItems) {
      void message.warning("定价服务返回了多余结果，已按请求顺序忽略");
    }
  };

  const resultContent = (() => {
    if (overLimit) {
      return (
        <div className={styles.emptyState}>
          <Empty description="合约数量超出支持范围" />
        </div>
      );
    }
    if (contracts.length === 0) {
      return (
        <div className={styles.emptyState}>
          <Empty description="请先选择一笔合约" />
        </div>
      );
    }
    if (mode === "fixedSingle") {
      const contract = contracts[0];
      return (
        <FixedSingleResultGrid
          contract={contract}
          calculation={state.resultByContractId[contract.contractId]}
          loading={!controller.initialized || state.submitting}
        />
      );
    }
    return (
      <MultipleResultGrid
        contracts={contracts}
        results={state.resultByContractId}
        loading={!controller.initialized || state.submitting}
      />
    );
  })();

  return (
    <section
      className={clsx(styles.root, styles[mode], className)}
      style={style}
      aria-label="交易合约试定价"
      data-status={state.submitting ? "submitting" : controller.initialized ? "ready" : "loading"}
    >
      <Spin spinning={!controller.initialized} description="定价资源加载中">
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>定价要素</h3>
          {overLimit ? (
            <Alert
              className={styles.limitAlert}
              type="error"
              showIcon
              title={`最多支持1000笔，当前${sourceCount}笔，请返回重新选择`}
            />
          ) : null}
          <ResourceIssues
            resources={state.resources}
            onRetry={(key) => void controller.retryResource(key)}
          />
          {state.environmentCurvesStatus === "error" ? (
            <Alert
              type="error"
              showIcon
              title="环境关联曲线加载失败"
              description={state.environmentCurvesError}
              action={
                <Button
                  size="small"
                  disabled={state.environmentCurvesAttempts >= 3}
                  onClick={controller.retryEnvironmentCurves}
                >
                  重试
                </Button>
              }
            />
          ) : null}
          <PricingContextForm
            mode={mode}
            value={state.context}
            errors={state.contextErrors}
            environments={state.resources.environments.data}
            discountCurves={controller.discountCurves}
            carbonForwardCurves={controller.carbonForwardCurves}
            environmentsLoading={state.resources.environments.status === "loading"}
            curvesLoading={curveCatalogsLoading || environmentCurvesLoading}
            curvesDisabled={environmentCurvesLoading}
            disabled={state.submitting}
            onChange={controller.setContext}
          />
        </div>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>定价结果</h3>
          {resultContent}
        </div>
        <PricingFooter
          mode={mode}
          allDisabled={allDisabled}
          calculateDisabled={calculationDisabled}
          submitting={state.submitting}
          onReset={controller.reset}
          onNavigateToPricingPage={onNavigateToPricingPage}
          onCalculate={() => void handleCalculate()}
        />
      </Spin>
    </section>
  );
}
