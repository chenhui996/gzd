import Alert from "../../../../components/alert";
import Button from "../../../../components/button";
import { MAX_RESOURCE_ATTEMPTS } from "../constants";
import type { PricingResources, ResourceKey } from "../reducer";
import styles from "../style.module.less";

const LABELS: Record<ResourceKey, string> = {
  environments: "定价环境",
  discountDefinitions: "无风险利率曲线利率曲线定义",
  customDiscountCurves: "自定义无风险利率曲线利率曲线",
  carbonDefinitions: "碳金融远期价格曲线定义",
  customCarbonCurves: "自定义碳金融远期价格曲线",
};

export interface ResourceIssuesProps {
  resources: PricingResources;
  onRetry: (key: ResourceKey) => void;
}

export default function ResourceIssues({ resources, onRetry }: ResourceIssuesProps) {
  const failedKeys = (Object.keys(resources) as ResourceKey[]).filter(
    (key) => resources[key].status === "error",
  );
  if (failedKeys.length === 0) return null;

  return (
    <div className={styles.resourceIssues} aria-label="资源加载异常">
      {failedKeys.map((key) => {
        const resource = resources[key];
        const exhausted = resource.attempts >= MAX_RESOURCE_ATTEMPTS;
        return (
          <Alert
            key={key}
            type="error"
            showIcon
            title={`${LABELS[key]}加载失败`}
            description={
              exhausted
                ? `${resource.error ?? "未知错误"}（已达到 3 次尝试上限）`
                : resource.error
            }
            action={
              <Button
                size="small"
                disabled={exhausted}
                onClick={() => onRetry(key)}
              >
                重试
              </Button>
            }
          />
        );
      })}
    </div>
  );
}
