import type { TreeProps } from "antd";
import type {
  CalendarConfig,
  CascaderConfig,
  DatePickerConfig,
  SliderConfig,
  TreeConfig,
  TreeSelectConfig,
} from "antd/es/config-provider/context";
import type { CSSProperties } from "react";
import type { GZDThemeMode } from "../../styles/themes";
import {
  getButtonGradientStyleVars,
  getButtonGradientTokens,
  goldDarkButtonGradientClassName,
  hasPrimarySolidGradientTokens,
} from "../../styles/themes/buttonGradient";

// ============================================================
// gold-dark 主题下各组件自定义样式的 CSS 变量与类名映射
// 通过 CSS 变量注入主题色，配合全局样式表实现组件级别的主题切换
// ============================================================

/** Steps 组件 — 流程图标激活态文字颜色 */
const goldDarkStepsClassName = "gzd-steps-gold-dark";
const stepsProcessIconTextVar = "--gzd-steps-process-icon-active-text-color";

/** Checkbox 组件 — 选中态图标颜色 */
const goldDarkCheckboxClassName = "gzd-checkbox-gold-dark";

/** Radio 组件 — 选中态图标颜色 */
const goldDarkRadioClassName = "gzd-radio-gold-dark";

/** Switch 组件 — 选中态背景色 & 内部圆点颜色 */
const goldDarkSwitchClassName = "gzd-switch-gold-dark";
const switchCheckedBgVar = "--gzd-switch-checked-bg";
const switchInnerColorVar = "--gzd-switch-inner-color";

/** Slider 组件 — hover 状态滑块样式 */
const goldDarkSliderClassName = "gzd-slider-gold-dark";
const sliderHandleHoverOuterBgVar = "--gzd-slider-handle-hover-outer-bg";
const sliderHandleHoverRingColorVar = "--gzd-slider-handle-hover-ring-color";
const sliderHandleHoverInnerBgVar = "--gzd-slider-handle-hover-inner-bg";

/** Popconfirm 组件 — 仅注入类名，由样式表统一控制 */
const goldDarkPopconfirmClassName = "gzd-popconfirm-gold-dark";

/** Tag 组件 — 业务状态类 Tag 色彩适配 */
const goldDarkTagClassName = "gzd-tag-gold-dark";

/** DatePicker 组件 — 选中日期文字颜色 */
const goldDarkDatePickerClassName = "gzd-date-picker-gold-dark";
const datePickerSelectedCellTextVar =
  "--gzd-date-picker-selected-cell-text-color";

/** Calendar 组件 — 选中日期文字颜色 */
const goldDarkCalendarClassName = "gzd-calendar-gold-dark";
const calendarSelectedCellTextVar = "--gzd-calendar-selected-cell-text-color";

/** TreeSelect 组件 — treeCheckable 选中态图标颜色 */
const goldDarkTreeSelectClassName = "gzd-tree-select-gold-dark";

/** Tree 组件 — checkable 选中态勾选图标颜色 */
const goldDarkTreeClassName = "gzd-tree-gold-dark";

/** Cascader 组件 — 多选态勾选图标颜色 */
const goldDarkCascaderClassName = "gzd-cascader-gold-dark";

/**
 * 合并多个类名，过滤掉空值，返回合并后的字符串或 undefined
 */
const mergeClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(" ") || undefined;

// ============================================================
// 类型定义
// ============================================================

/** antd ConfigProvider 各组件的 className + style 配置 */
interface ComponentConfig {
  className?: string;
  style?: CSSProperties;
}

type DatePickerComponentConfig = DatePickerConfig;
type CalendarComponentConfig = CalendarConfig;
type CascaderComponentConfig = CascaderConfig;

/** 各组件自定义配置的入参 */
export interface GoldDarkComponentConfigs {
  button?: ComponentConfig;
  steps?: ComponentConfig;
  checkbox?: ComponentConfig;
  radio?: ComponentConfig;
  switch?: ComponentConfig;
  slider?: SliderConfig;
  popconfirm?: ComponentConfig;
  tag?: ComponentConfig;
  datePicker?: DatePickerComponentConfig;
  calendar?: CalendarComponentConfig;
  tree?: TreeConfig;
  treeSelect?: TreeSelectConfig;
  cascader?: CascaderComponentConfig;
}

/** 各组件处理后的配置 */
export interface GoldDarkComponentResults {
  button?: ComponentConfig;
  steps?: ComponentConfig;
  checkbox?: ComponentConfig;
  radio?: ComponentConfig;
  switch?: ComponentConfig;
  slider?: SliderConfig;
  popconfirm?: ComponentConfig;
  tag?: ComponentConfig;
  datePicker?: DatePickerComponentConfig;
  calendar?: CalendarComponentConfig;
  tree?: TreeConfig;
  treeSelect?: TreeSelectConfig;
  cascader?: CascaderComponentConfig;
}

// ============================================================
// 各组件 gold-dark 适配逻辑
// ============================================================

interface TokenValues {
  colorTextOnLight: unknown;
  colorPrimary: unknown;
  colorPrimaryBgHover: unknown;
  colorBgElevated: unknown;
}

/**
 * 判断是否为 gold-dark 模式
 */
const isGoldDark = (themeMode: GZDThemeMode) => themeMode === "gold-dark";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

type TreeSemanticInfo = { props: TreeProps };

const withGoldDarkTreeClassNames = (
  classNames: TreeConfig["classNames"],
): TreeConfig["classNames"] => {
  if (typeof classNames === "function") {
    return (info: TreeSemanticInfo) => {
      const resolvedClassNames = classNames(info);

      return {
        ...resolvedClassNames,
        root: mergeClassNames(goldDarkTreeClassName, resolvedClassNames?.root),
        itemIcon: mergeClassNames(
          goldDarkTreeClassName,
          resolvedClassNames?.itemIcon,
        ),
      };
    };
  }

  return {
    ...classNames,
    root: mergeClassNames(goldDarkTreeClassName, classNames?.root),
    itemIcon: mergeClassNames(goldDarkTreeClassName, classNames?.itemIcon),
  };
};

/**
 * Button：gradient 主题适配
 */
const adaptButton = (
  themeMode: GZDThemeMode,
  theme: Record<string, unknown>,
  custom?: ComponentConfig,
): ComponentConfig | undefined => {
  if (!isGoldDark(themeMode)) return custom;

  const gradientTokens = getButtonGradientTokens(theme);

  if (!hasPrimarySolidGradientTokens(gradientTokens)) return custom;

  return {
    ...custom,
    className: mergeClassNames(
      goldDarkButtonGradientClassName,
      custom?.className,
      "gzd-button-default-border-color",
    ),
    style: {
      ...getButtonGradientStyleVars(gradientTokens),
      ...custom?.style,
    },
  };
};

/**
 * Steps：流程图标激活态文字颜色
 */
const adaptSteps = (
  themeMode: GZDThemeMode,
  tokens: TokenValues,
  custom?: ComponentConfig,
): ComponentConfig | undefined => {
  if (!isGoldDark(themeMode) || typeof tokens.colorTextOnLight !== "string")
    return custom;

  return {
    ...custom,
    className: mergeClassNames(goldDarkStepsClassName, custom?.className),
    style: {
      [stepsProcessIconTextVar]: tokens.colorTextOnLight,
      ...custom?.style,
    } as CSSProperties,
  };
};

/**
 * Checkbox：选中态图标颜色
 */
const adaptCheckbox = (
  themeMode: GZDThemeMode,
  custom?: ComponentConfig,
): ComponentConfig | undefined => {
  if (!isGoldDark(themeMode)) return custom;

  return {
    ...custom,
    className: mergeClassNames(goldDarkCheckboxClassName, custom?.className),
  };
};

/**
 * Radio：选中态图标颜色
 */
const adaptRadio = (
  themeMode: GZDThemeMode,
  custom?: ComponentConfig,
): ComponentConfig | undefined => {
  if (!isGoldDark(themeMode)) return custom;

  return {
    ...custom,
    className: mergeClassNames(goldDarkRadioClassName, custom?.className),
  };
};

/**
 * Switch：选中态背景色 & 内部圆点颜色
 */
const adaptSwitch = (
  themeMode: GZDThemeMode,
  tokens: TokenValues,
  custom?: ComponentConfig,
): ComponentConfig | undefined => {
  if (
    !isGoldDark(themeMode) ||
    typeof tokens.colorPrimary !== "string" ||
    typeof tokens.colorTextOnLight !== "string"
  )
    return custom;

  return {
    ...custom,
    className: mergeClassNames(goldDarkSwitchClassName, custom?.className),
    style: {
      [switchCheckedBgVar]: tokens.colorPrimary,
      [switchInnerColorVar]: tokens.colorTextOnLight,
      ...custom?.style,
    } as CSSProperties,
  };
};

/**
 * Slider：hover 状态滑块样式
 */
const adaptSlider = (
  themeMode: GZDThemeMode,
  tokens: TokenValues,
  custom?: SliderConfig,
): SliderConfig | undefined => {
  if (
    !isGoldDark(themeMode) ||
    typeof tokens.colorPrimary !== "string" ||
    typeof tokens.colorPrimaryBgHover !== "string" ||
    typeof tokens.colorBgElevated !== "string"
  )
    return custom;

  return {
    ...custom,
    className: mergeClassNames(goldDarkSliderClassName, custom?.className),
    style: {
      [sliderHandleHoverOuterBgVar]: tokens.colorPrimaryBgHover,
      [sliderHandleHoverRingColorVar]: tokens.colorPrimary,
      [sliderHandleHoverInnerBgVar]: tokens.colorBgElevated,
      ...custom?.style,
    } as CSSProperties,
  };
};

/**
 * Popconfirm：仅注入 gold-dark 类名
 */
const adaptPopconfirm = (
  themeMode: GZDThemeMode,
  custom?: ComponentConfig,
): ComponentConfig | undefined => {
  if (!isGoldDark(themeMode)) return custom;

  return {
    ...custom,
    className: mergeClassNames(goldDarkPopconfirmClassName, custom?.className),
  };
};

/**
 * Tag：业务状态类 outlined Tag 色彩适配
 */
const adaptTag = (
  themeMode: GZDThemeMode,
  custom?: ComponentConfig,
): ComponentConfig | undefined => {
  if (!isGoldDark(themeMode)) return custom;

  return {
    ...custom,
    className: mergeClassNames(goldDarkTagClassName, custom?.className),
  };
};

/**
 * DatePicker：日期面板选中日期文字颜色
 */
const adaptDatePicker = (
  themeMode: GZDThemeMode,
  tokens: TokenValues,
  custom?: DatePickerComponentConfig,
): DatePickerComponentConfig | undefined => {
  if (!isGoldDark(themeMode) || typeof tokens.colorTextOnLight !== "string")
    return custom;

  const customClassNames = isRecord(custom?.classNames)
    ? custom.classNames
    : undefined;
  const customPopupClassNames = isRecord(customClassNames?.popup)
    ? customClassNames.popup
    : undefined;
  const customPopupRootClassName =
    typeof customClassNames?.popup === "string"
      ? customClassNames.popup
      : typeof customPopupClassNames?.root === "string"
        ? customPopupClassNames.root
        : undefined;
  const customStyles = isRecord(custom?.styles) ? custom.styles : undefined;
  const customPopupStyles = isRecord(customStyles?.popup)
    ? customStyles.popup
    : undefined;
  const customPopupRootStyle = isRecord(customPopupStyles?.root)
    ? customPopupStyles.root
    : undefined;

  return {
    ...custom,
    className: mergeClassNames(goldDarkDatePickerClassName, custom?.className),
    style: {
      [datePickerSelectedCellTextVar]: tokens.colorTextOnLight,
      ...custom?.style,
    } as CSSProperties,
    classNames: {
      ...customClassNames,
      popup: {
        ...customPopupClassNames,
        root: mergeClassNames(
          goldDarkDatePickerClassName,
          customPopupRootClassName,
        ),
      },
    },
    styles: {
      ...customStyles,
      popup: {
        ...customPopupStyles,
        root: {
          [datePickerSelectedCellTextVar]: tokens.colorTextOnLight,
          ...customPopupRootStyle,
        } as CSSProperties,
      },
    },
  };
};

/**
 * Calendar：日期面板选中日期文字颜色
 */
const adaptCalendar = (
  themeMode: GZDThemeMode,
  tokens: TokenValues,
  custom?: CalendarComponentConfig,
): CalendarComponentConfig | undefined => {
  if (!isGoldDark(themeMode) || typeof tokens.colorTextOnLight !== "string")
    return custom;

  return {
    ...custom,
    className: mergeClassNames(goldDarkCalendarClassName, custom?.className),
    style: {
      [calendarSelectedCellTextVar]: tokens.colorTextOnLight,
      ...custom?.style,
    } as CSSProperties,
  };
};

/**
 * TreeSelect：treeCheckable 下拉树选中态勾选图标颜色
 */
const adaptTreeSelect = (
  themeMode: GZDThemeMode,
  custom?: TreeSelectConfig,
): TreeSelectConfig | undefined => {
  if (!isGoldDark(themeMode)) return custom;

  const customClassNames = isRecord(custom?.classNames)
    ? custom.classNames
    : undefined;
  const customPopupClassNames = isRecord(customClassNames?.popup)
    ? customClassNames.popup
    : undefined;

  return {
    ...custom,
    classNames: {
      ...customClassNames,
      popup: {
        ...customPopupClassNames,
        root: mergeClassNames(
          goldDarkTreeSelectClassName,
          typeof customPopupClassNames?.root === "string"
            ? customPopupClassNames.root
            : undefined,
        ),
      },
    },
  };
};

/**
 * Tree：checkable 树选中态勾选图标颜色
 */
const adaptTree = (
  themeMode: GZDThemeMode,
  custom?: TreeConfig,
): TreeConfig | undefined => {
  if (!isGoldDark(themeMode)) return custom;

  return {
    ...custom,
    className: mergeClassNames(goldDarkTreeClassName, custom?.className),
    // Tree 的勾选图标对应 antd v6 itemIcon 语义节点；root 保留给当前 rc-tree DOM 作为兼容兜底。
    classNames: withGoldDarkTreeClassNames(custom?.classNames),
  };
};

/**
 * Cascader：multiple 下拉面板选中态勾选图标颜色
 */
const adaptCascader = (
  themeMode: GZDThemeMode,
  custom?: CascaderComponentConfig,
): CascaderComponentConfig | undefined => {
  if (!isGoldDark(themeMode)) return custom;

  const customClassNames = isRecord(custom?.classNames)
    ? custom.classNames
    : undefined;
  const customPopupClassNames = isRecord(customClassNames?.popup)
    ? customClassNames.popup
    : undefined;

  return {
    ...custom,
    className: mergeClassNames(goldDarkCascaderClassName, custom?.className),
    classNames: {
      ...customClassNames,
      popup: {
        ...customPopupClassNames,
        root: mergeClassNames(
          goldDarkCascaderClassName,
          typeof customPopupClassNames?.root === "string"
            ? customPopupClassNames.root
            : undefined,
        ),
      },
    },
  };
};

// ============================================================
// 统一入口
// ============================================================

/**
 * 根据主题模式（gold-dark / gold-light）为各组件注入对应的 CSS 变量与类名，
 * 实现组件级别的深色主题适配。
 *
 * @param mode      当前主题模式
 * @param theme     合并后的主题 token 配置
 * @param customs   各组件由业务侧传入的自定义配置
 * @returns         处理后的各组件配置
 */
export const applyGoldDarkAdapters = (
  themeMode: GZDThemeMode,
  theme: Record<string, unknown>,
  customs: GoldDarkComponentConfigs = {},
): GoldDarkComponentResults => {
  const globalToken =
    theme.token &&
    typeof theme.token === "object" &&
    !Array.isArray(theme.token)
      ? (theme.token as Record<string, unknown>)
      : theme;

  const tokens: TokenValues = {
    colorTextOnLight: globalToken.colorTextOnLight,
    colorPrimary: globalToken.colorPrimary,
    colorPrimaryBgHover: globalToken.colorPrimaryBgHover,
    colorBgElevated: globalToken.colorBgElevated,
  };

  return {
    button: adaptButton(themeMode, theme, customs.button),
    steps: adaptSteps(themeMode, tokens, customs.steps),
    checkbox: adaptCheckbox(themeMode, customs.checkbox),
    radio: adaptRadio(themeMode, customs.radio),
    switch: adaptSwitch(themeMode, tokens, customs.switch),
    slider: adaptSlider(themeMode, tokens, customs.slider),
    popconfirm: adaptPopconfirm(themeMode, customs.popconfirm),
    tag: adaptTag(themeMode, customs.tag),
    datePicker: adaptDatePicker(themeMode, tokens, customs.datePicker),
    calendar: adaptCalendar(themeMode, tokens, customs.calendar),
    tree: adaptTree(themeMode, customs.tree),
    treeSelect: adaptTreeSelect(themeMode, customs.treeSelect),
    cascader: adaptCascader(themeMode, customs.cascader),
  };
};
