import { ConfigProvider as AntdConfigProvider } from "antd";
import type { ConfigProviderProps } from "antd/es/config-provider";
import zhCN from "antd/locale/zh_CN";
import type { GZDThemeMode } from "../../styles/themes";
import { getDesignTokens } from "../../styles/themes";
import { GZDConfigContext } from "./context";
import { applyGoldDarkAdapters } from "./goldDarkAdapters";

const DEFAULT_CSS_VAR_PREFIX = "gzd-ant";

const toKebabCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const getCssVarConfig = (themeMode: GZDThemeMode, cssVarScope?: string) => {
  const normalizedScope = cssVarScope ? toKebabCase(cssVarScope) : "";

  if (!normalizedScope) {
    return {
      key: `gzd-${themeMode}`,
      prefix: DEFAULT_CSS_VAR_PREFIX,
    };
  }

  const scopedPrefix = `gzd-${normalizedScope}`;

  return {
    key: `${scopedPrefix}-${themeMode}`,
    prefix: scopedPrefix,
  };
};

export interface GZDConfigProviderProps extends ConfigProviderProps {
  /**
   * 组件库的主题模式
   * @default 'gold-dark'
   */
  themeMode?: GZDThemeMode;
  /**
   * antd CSS 变量隔离作用域。
   *
   * 默认不需要传。仅当子应用需要独立主题、隔离运行或多版本共存时传入稳定的应用标识，
   * 组件库会据此生成成对的 `cssVar.key` 与 `cssVar.prefix`。
   */
  cssVarScope?: string;
}

/**
 * gzd 的 ConfigProvider，基于 antd ConfigProvider 封装。
 *
 * 主要职责：
 * 1. 根据 `themeMode` 获取预设的主题配置
 * 2. 合并业务侧传入的自定义主题 token 与 components 配置
 * 3. 在 gold-dark 模式下，自动为各组件注入对应的 CSS 变量与类名，
 *    实现组件级别的深色主题适配
 */
const ConfigProvider = ({
  themeMode = "gold-dark",
  cssVarScope,
  theme: customTheme,
  locale = zhCN,
  button: customButton,
  calendar: customCalendar,
  checkbox: customCheckbox,
  datePicker: customDatePicker,
  popconfirm: customPopconfirm,
  radio: customRadio,
  slider: customSlider,
  steps: customSteps,
  switch: customSwitch,
  tag: customTag,
  tree: customTree,
  treeSelect: customTreeSelect,
  cascader: customCascader,
  children,
  ...rest
}: GZDConfigProviderProps) => {
  // 获取当前模式的基础配置，并合并业务方传入的额外定制配置
  const baseTheme = getDesignTokens({ themeMode });
  const mergedTheme = {
    ...customTheme,
    token: {
      ...baseTheme.globalToken,
      ...customTheme?.token, // 允许业务侧继续覆盖
    },
    components: {
      ...baseTheme.components,
      ...customTheme?.components,
    },
    cssVar: getCssVarConfig(themeMode, cssVarScope),
  };

  // 对各组件应用 gold-dark 主题适配（CSS 变量与类名注入）
  const adaptedComponents = applyGoldDarkAdapters(themeMode, mergedTheme, {
    button: customButton as {
      className?: string;
      style?: React.CSSProperties;
    },
    calendar: customCalendar,
    steps: customSteps as { className?: string; style?: React.CSSProperties },
    checkbox: customCheckbox as {
      className?: string;
      style?: React.CSSProperties;
    },
    datePicker: customDatePicker,
    radio: customRadio as { className?: string; style?: React.CSSProperties },
    slider: customSlider,
    switch: customSwitch as {
      className?: string;
      style?: React.CSSProperties;
    },
    popconfirm: customPopconfirm as {
      className?: string;
      style?: React.CSSProperties;
    },
    tag: customTag as { className?: string; style?: React.CSSProperties },
    cascader: customCascader,
    tree: customTree,
    treeSelect: customTreeSelect,
  });

  return (
    <GZDConfigContext.Provider value={{ themeMode }}>
      <AntdConfigProvider
        theme={mergedTheme}
        locale={locale}
        button={adaptedComponents.button}
        cascader={adaptedComponents.cascader}
        calendar={adaptedComponents.calendar}
        checkbox={adaptedComponents.checkbox}
        datePicker={adaptedComponents.datePicker}
        popconfirm={adaptedComponents.popconfirm}
        radio={adaptedComponents.radio}
        slider={adaptedComponents.slider}
        steps={adaptedComponents.steps}
        switch={adaptedComponents.switch}
        tag={adaptedComponents.tag}
        tree={adaptedComponents.tree}
        treeSelect={adaptedComponents.treeSelect}
        {...rest}>
        {children}
      </AntdConfigProvider>
    </GZDConfigContext.Provider>
  );
};

export default ConfigProvider;
