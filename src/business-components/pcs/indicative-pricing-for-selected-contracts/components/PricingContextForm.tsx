import { useRef, useState } from "react";
import dayjs from "dayjs";
import DatePicker from "../../../../components/date-picker";
import Form from "../../../../components/form";
import Select, { type GZDSelectProps } from "../../../../components/select";
import Tooltip from "../../../../components/tooltip";
import type {
  CurveCatalogItem,
  IndicativePricingContextValues,
  PricingEnvironment,
} from "../types";
import { formatCurveDate } from "../utils/date";
import type { PricingContextErrors } from "../utils/validation";
import styles from "../style.module.less";

export interface PricingContextFormProps {
  mode: "fixedSingle" | "multiple";
  value: IndicativePricingContextValues;
  errors: PricingContextErrors;
  environments: readonly PricingEnvironment[];
  discountCurves: readonly CurveCatalogItem[];
  carbonForwardCurves: readonly CurveCatalogItem[];
  environmentsLoading: boolean;
  curvesLoading: boolean;
  curvesDisabled: boolean;
  disabled: boolean;
  onChange: <K extends keyof IndicativePricingContextValues>(
    field: K,
    value: IndicativePricingContextValues[K],
  ) => void;
}

function fieldState(errors: string[] | undefined) {
  return {
    validateStatus: errors?.length ? ("error" as const) : undefined,
    help: errors?.join("；"),
  };
}

function selectedLabel(
  name: string | null | undefined,
  code: string | null | undefined,
  fallback = "",
) {
  if (name && code) return `${name}（${code}）`;
  return name || code || fallback;
}

function curveDisplayLabel(curve: CurveCatalogItem | null | undefined) {
  if (!curve) return "";

  const label = selectedLabel(curve.name, curve.code, curve.label);
  return curve.source === "custom" && curve.executeDay
    ? `${label}-${formatCurveDate(curve.executeDay)}`
    : label;
}

function customCurveWarning(
  curve: CurveCatalogItem | null,
  valuationDate: string | null,
) {
  if (curve?.source !== "custom" || !valuationDate) return undefined;

  const curveDay = curve?.executeDay
    ? formatCurveDate(curve.executeDay)
    : undefined;
  return !curveDay || curveDay !== valuationDate
    ? "曲线日与估值日非同一日"
    : undefined;
}

// 文案单独参与省略计算，避免 antd 的必填伪元素随长文案一起被裁切。
function PricingFormLabel({ text }: { text: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Tooltip
      title={text}
      open={tooltipOpen}
      onOpenChange={(open) => {
        const textElement = textRef.current;
        const isTruncated = Boolean(
          textElement && textElement.scrollWidth > textElement.clientWidth,
        );
        setTooltipOpen(open && isTruncated);
      }}
    >
      <span ref={textRef} className={styles.contextFormLabelText}>
        {text}
      </span>
    </Tooltip>
  );
}

export default function PricingContextForm(props: PricingContextFormProps) {
  const {
    mode,
    value,
    errors,
    environments,
    discountCurves,
    carbonForwardCurves,
    environmentsLoading,
    curvesLoading,
    curvesDisabled,
    disabled,
    onChange,
  } = props;
  const environmentOptions = environments.map((item) => ({
    label: `${item.code}（${item.name}）`,
    value: item.id,
  }));
  const curveOptions = (curves: readonly CurveCatalogItem[]) =>
    curves.map((item) => ({
      label: curveDisplayLabel(item),
      value: item.key,
    }));
  const selectPopupConfig = {
    popupMatchSelectWidth: false,
    classNames: {
      popup: {
        root: styles.selectPopup,
        listItem: styles.selectPopupListItem,
      },
    },
    styles: {
      popup: {
        root: {
          maxWidth: mode === "fixedSingle" ? 420 : 432,
        },
      },
    },
  } satisfies Pick<
    GZDSelectProps<string>,
    "popupMatchSelectWidth" | "classNames" | "styles"
  >;

  return (
    <Form
      component="div"
      layout="horizontal"
      labelAlign="right"
      labelCol={{ flex: "0 0 var(--pricing-form-label-width)" }}
      wrapperCol={{ flex: "0 0 var(--pricing-form-control-width)" }}
      colon={false}
      requiredMark
      className={`${styles.contextForm} ${styles[mode]}`}
      classNames={{
        label: styles.contextFormLabel,
        content: styles.contextFormContent,
      }}
    >
      <Form.Item
        className={styles.contextFormItem}
        label={<PricingFormLabel text="定价环境" />}
        required
        {...fieldState(errors.pricingEnvironment)}
      >
        <Select<string>
          {...selectPopupConfig}
          aria-label="定价环境"
          allowClear
          showSearch
          optionFilterProp="label"
          loading={environmentsLoading}
          disabled={disabled}
          placeholder="请选择定价环境"
          options={environmentOptions}
          value={value.pricingEnvironment?.id}
          labelRender={() =>
            selectedLabel(
              value.pricingEnvironment?.name,
              value.pricingEnvironment?.code,
            )
          }
          onChange={(id) =>
            onChange(
              "pricingEnvironment",
              environments.find((item) => item.id === id) ?? null,
            )
          }
          onClear={() => onChange("pricingEnvironment", null)}
        />
      </Form.Item>
      <Form.Item
        className={styles.contextFormItem}
        label={<PricingFormLabel text="碳金融远期价格曲线" />}
        required
        extra={customCurveWarning(value.carbonForwardCurve, value.valuationDate)}
        {...fieldState(errors.carbonForwardCurve)}
      >
        <Select<string>
          {...selectPopupConfig}
          aria-label="碳金融远期价格曲线"
          allowClear
          showSearch
          optionFilterProp="label"
          loading={curvesLoading}
          disabled={disabled || curvesDisabled}
          placeholder="请选择碳金融远期价格曲线"
          options={curveOptions(carbonForwardCurves)}
          value={value.carbonForwardCurve?.key}
          labelRender={() => curveDisplayLabel(value.carbonForwardCurve)}
          onChange={(key) =>
            onChange(
              "carbonForwardCurve",
              carbonForwardCurves.find((item) => item.key === key) ?? null,
            )
          }
          onClear={() => onChange("carbonForwardCurve", null)}
        />
      </Form.Item>
      <Form.Item
        className={styles.contextFormItem}
        label={<PricingFormLabel text="无风险利率曲线利率曲线" />}
        required
        extra={customCurveWarning(value.discountCurve, value.valuationDate)}
        {...fieldState(errors.discountCurve)}
      >
        <Select<string>
          {...selectPopupConfig}
          aria-label="无风险利率曲线利率曲线"
          allowClear
          showSearch
          optionFilterProp="label"
          loading={curvesLoading}
          disabled={disabled || curvesDisabled}
          placeholder="请选择无风险利率曲线利率曲线"
          options={curveOptions(discountCurves)}
          value={value.discountCurve?.key}
          labelRender={() => curveDisplayLabel(value.discountCurve)}
          onChange={(key) =>
            onChange(
              "discountCurve",
              discountCurves.find((item) => item.key === key) ?? null,
            )
          }
          onClear={() => onChange("discountCurve", null)}
        />
      </Form.Item>
      <Form.Item
        className={styles.contextFormItem}
        label={<PricingFormLabel text="估值日" />}
        required
        {...fieldState(errors.valuationDate)}
      >
        <DatePicker
          aria-label="估值日"
          allowClear
          disabled={disabled}
          value={value.valuationDate ? dayjs(value.valuationDate) : null}
          onChange={(date) => {
            const selectedDate = Array.isArray(date) ? date[0] : date;
            onChange("valuationDate", selectedDate?.format("YYYY-MM-DD") ?? null);
          }}
        />
      </Form.Item>
    </Form>
  );
}
