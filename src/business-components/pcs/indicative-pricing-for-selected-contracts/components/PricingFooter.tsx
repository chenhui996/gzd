import Button from "../../../../components/button";
import styles from "../style.module.less";

export interface PricingFooterProps {
  mode: "fixedSingle" | "multiple";
  allDisabled: boolean;
  calculateDisabled: boolean;
  submitting: boolean;
  onReset: () => void;
  onNavigateToPricingPage?: () => void;
  onCalculate: () => void;
}

export default function PricingFooter({
  mode,
  allDisabled,
  calculateDisabled,
  submitting,
  onReset,
  onNavigateToPricingPage,
  onCalculate,
}: PricingFooterProps) {
  return (
    <div className={styles.footer}>
      <Button disabled={allDisabled || submitting} onClick={onReset}>
        重置
      </Button>
      {mode === "fixedSingle" ? (
        <Button
          disabled={allDisabled || submitting || !onNavigateToPricingPage}
          onClick={onNavigateToPricingPage}
        >
          转定价界面
        </Button>
      ) : null}
      <Button
        type="primary"
        loading={submitting}
        disabled={allDisabled || calculateDisabled}
        onClick={onCalculate}
      >
        计算
      </Button>
    </div>
  );
}
