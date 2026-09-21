import type { ThemeConfig } from "antd/es/config-provider/context";
import { blueDarkThemeTokens } from "../../../gzd-design-tokens/blue-theme/dark-mode/blueDarkThemeTokens";
import { blueLightThemeTokens } from "../../../gzd-design-tokens/blue-theme/light-mode/blueLightThemeTokens";
import { goldDarkThemeTokens } from "../../../gzd-design-tokens/gold-theme/dark-mode/goldDarkThemeTokens";
import { goldLightThemeTokens } from "../../../gzd-design-tokens/gold-theme/light-mode/goldLightThemeTokens";
import type { GZDDesignTokenBundle, GZDThemeMode, GZDThemeOptions } from "./types";

/**
 * 原始主题 Token 集合的数据结构。
 * 对应从 Figma 导出的 JSON 结构，主要包含：
 * - token: 全局基础变量（如颜色、字体、间距）
 * - components: 针对各个组件（如 Button、Table）定制的组件级别变量
 * - custom: gzd 业务侧自定义的非标准 Token
 */
type RawThemeTokenBundle = {
  token: unknown;
  components: unknown;
  custom?: unknown;
};

/**
 * 将原始生成的 Token 集合转换为组件库内部使用的强类型 GZDDesignTokenBundle。
 * 在这里，你可以对由脚本生成的原始 Token 进行一些人工的拦截、补充和映射调整，
 * 比如强制覆盖某些 Ant Design 内部的不合理映射。
 *
 * @param themeTokens 原始的主题 Token 集合
 * @returns 经过处理并符合 GZDDesignTokenBundle 类型定义的主题集合
 */
const toDesignTokenBundle = (
  themeTokens: RawThemeTokenBundle,
): GZDDesignTokenBundle => {
  const globalToken = themeTokens.token as NonNullable<ThemeConfig["token"]>;
  const components = themeTokens.components as NonNullable<
    ThemeConfig["components"]
  >;

  return {
    globalToken,
    components: {
      ...components,
      Tabs: {
        ...components.Tabs,
        // 样式硬编码映射修复：
        // antd 默认使用 colorBorderSecondary 绘制 Tabs 导航的底部分割线。
        // 但根据当前设计稿要求，需要将其强制映射为全局的 colorBorder。
        colorBorderSecondary: globalToken.colorBorder,
      },
    },
    ...(themeTokens.custom
      ? {
          custom: {
            ...themeTokens.custom,
          } as Record<string, unknown>,
        }
      : {}),
  };
};

/**
 * 缓存所有主题（金/蓝）与模式（亮/暗）的映射关系。
 * 这个字典会在应用启动时一次性建立好，方便后续根据当前选中的主题模式快速读取。
 */
const themeTokenMap = {
  "gold-dark": toDesignTokenBundle(goldDarkThemeTokens),
  "gold-light": toDesignTokenBundle(goldLightThemeTokens),
  "blue-dark": toDesignTokenBundle(blueDarkThemeTokens),
  "blue-light": toDesignTokenBundle(blueLightThemeTokens),
} satisfies Record<GZDThemeMode, GZDDesignTokenBundle>;

/**
 * 获取指定主题模式下的 Design Tokens。
 * 这是整个组件库读取主题变量的核心入口函数。
 * 
 * @param options 主题配置项，包含当前需要的 themeMode（如 'gold-dark'）
 * @returns 对应主题的所有 Design Tokens (全局、组件、自定义)
 */
export const getDesignTokens = ({
  themeMode,
}: GZDThemeOptions): GZDDesignTokenBundle => themeTokenMap[themeMode];
