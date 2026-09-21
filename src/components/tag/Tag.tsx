import { Tag as AntdTag, theme, type TagProps } from "antd";
import { forwardRef, useContext, type CSSProperties } from "react";
import { GZDConfigContext } from "../config-provider/context";

export type GZDTagProps = TagProps;

type GoldDarkPresetColor =
  | "red"
  | "volcano"
  | "orange"
  | "gold"
  | "yellow"
  | "lime"
  | "green"
  | "cyan"
  | "geekblue"
  | "purple"
  | "magenta";

type TagVariant = NonNullable<TagProps["variant"]>;
type TokenValue = string | number;
type GoldThemeToken = Record<string, TokenValue | undefined>;

/**
 * 金色暗色主题下的 Figma 色板映射。
 *
 * 每个颜色按以下顺序保存四个 token：
 * [浅背景色, 描边色, 实心背景色, 彩色文字色]
 *
 * 三种 variant 的消费规则：
 * - filled:  浅背景色 + 彩色文字色
 * - outlined: 浅背景色 + 描边色 + 彩色文字色
 * - solid:   实心背景色 + colorTextLightSolid
 *
 * 通常对应色板的 1 / 3 / 6 / 7 阶；gold 和 geekblue 使用项目扩展色板，
 * lime 的 outlined 边框则按 Figma 设计使用第 4 阶。
 */
const goldDarkPaletteTokens: Record<
  GoldDarkPresetColor,
  readonly [background: string, border: string, solid: string, text: string]
> = {
  red: ["red1", "red3", "red6", "red7"],
  volcano: ["volcano1", "volcano3", "volcano6", "volcano7"],
  orange: ["orange1", "orange3", "orange6", "orange7"],
  gold: ["guotai gold1", "guotai gold3", "guotai gold6", "guotai gold7"],
  yellow: ["yellow1", "yellow3", "yellow6", "yellow7"],
  // Figma 中 lime outlined 使用 lime4，其余预设色使用色板第 3 阶作为边框色。
  lime: ["lime1", "lime4", "lime6", "lime7"],
  green: ["green1", "green3", "green6", "green7"],
  cyan: ["cyan1", "cyan3", "cyan6", "cyan7"],
  geekblue: ["galaxy blue1", "galaxy blue3", "galaxy blue6", "galaxy blue7"],
  purple: ["purple1", "purple3", "purple6", "purple7"],
  magenta: ["magenta1", "magenta3", "magenta6", "magenta7"],
};

const getStringToken = (token: GoldThemeToken, key: string) => {
  const value = token[key];
  return typeof value === "string" ? value : undefined;
};

const isGoldDarkPresetColor = (color: string): color is GoldDarkPresetColor =>
  Object.prototype.hasOwnProperty.call(goldDarkPaletteTokens, color);

const getGoldDarkStyle = (
  color: TagProps["color"],
  variant: TagVariant,
  token: GoldThemeToken,
): CSSProperties | undefined => {
  // default 的 filled / outlined 直接复用 antd Tag 组件 token，仅修正 solid 配色。
  if (color === "default" || color === undefined) {
    if (variant !== "solid") return undefined;

    const backgroundColor = getStringToken(token, "colorBgSolid");
    return {
      color: getStringToken(token, "colorTextOnLight"),
      backgroundColor,
      borderColor: backgroundColor,
    };
  }

  // primary 不是 antd Tag 的预设色，需要按 Figma 单独映射三种 variant。
  if (color === "primary") {
    const backgroundColor = getStringToken(token, "colorPrimary");
    return {
      // primary 三种 variant 都使用浅色背景和 on-light 文字色。
      color: getStringToken(token, "colorTextOnLight"),
      backgroundColor,
      // outlined 使用设计描边色；solid 的边框与背景保持一致；filled 不额外设置边框。
      ...(variant === "outlined"
        ? { borderColor: getStringToken(token, "colorPrimaryBorder") }
        : variant === "solid"
          ? { borderColor: backgroundColor }
          : undefined),
    };
  }

  // 自定义色值和状态色不在设计稿映射范围内，保持 antd 原有处理逻辑。
  if (!isGoldDarkPresetColor(color)) return undefined;

  const palette = goldDarkPaletteTokens[color];
  // 四元组依次解构为：浅背景、描边、实心背景、彩色文字。
  const [backgroundToken, borderToken, solidToken, textToken] = palette;

  if (variant === "solid") {
    // solid 使用色板第 6 阶作为背景和边框，文字统一使用浅色文字 token。
    const backgroundColor = getStringToken(token, solidToken);
    return {
      color: getStringToken(token, "colorTextLightSolid"),
      backgroundColor,
      borderColor: backgroundColor,
    };
  }

  // filled 和 outlined 共用浅背景及彩色文字，只有 outlined 需要补充描边色。
  return {
    color: getStringToken(token, textToken),
    backgroundColor: getStringToken(token, backgroundToken),
    ...(variant === "outlined"
      ? { borderColor: getStringToken(token, borderToken) }
      : undefined),
  };
};

const getGoldLightPrimaryStyle = (
  color: TagProps["color"],
  token: GoldThemeToken,
): CSSProperties | undefined => {
  if (color !== "primary") return undefined;

  // Figma 的 outlined primary Tag 使用 primary 填充且无可见描边。
  return {
    color: getStringToken(token, "colorTextOnLight"),
    backgroundColor: getStringToken(token, "colorPrimary"),
    borderColor: "transparent",
  };
};

const Tag = forwardRef<HTMLSpanElement, GZDTagProps>((props, ref) => {
  const { color, style, styles, variant = "solid", ...restProps } = props;
  const { themeMode } = useContext(GZDConfigContext);
  const { token } = theme.useToken();

  // 主题中包含国泰金、galaxy blue 等扩展 token，antd 的 GlobalToken 类型未声明这些键。
  const goldThemeToken = token as unknown as GoldThemeToken;

  // 金色主题按明暗模式分别映射 Figma 配色，其他主题保持 antd 默认行为。
  const goldThemeStyle =
    themeMode === "gold-dark"
      ? getGoldDarkStyle(color, variant, goldThemeToken)
      : themeMode === "gold-light"
        ? getGoldLightPrimaryStyle(color, goldThemeToken)
        : undefined;

  // default / primary 的 solid 背景较亮，关闭图标需使用 on-light 文字色。
  const goldDarkCloseStyle =
    themeMode === "gold-dark" &&
    variant === "solid" &&
    (color === "primary" || color === "default" || color === undefined)
      ? { color: getStringToken(goldThemeToken, "colorTextOnLight") }
      : undefined;

  const goldLightCloseStyle =
    themeMode === "gold-light" && color === "primary"
      ? { color: getStringToken(goldThemeToken, "colorTextOnLight") }
      : undefined;
  const goldThemeCloseStyle = goldDarkCloseStyle ?? goldLightCloseStyle;

  // 业务侧传入的实例 style 优先于主题适配样式。
  const mergedStyle = goldThemeStyle
    ? {
        ...goldThemeStyle,
        ...style,
      }
    : style;

  // styles 支持对象和函数两种写法，合并时同样保留业务侧 close 样式的最高优先级。
  const mergedStyles = goldThemeCloseStyle
    ? typeof styles === "function"
      ? (info: Parameters<typeof styles>[0]) => {
          const resolvedStyles = styles(info);
          return {
            ...resolvedStyles,
            close: {
              ...goldThemeCloseStyle,
              ...resolvedStyles?.close,
            },
          };
        }
      : {
          ...styles,
          close: {
            ...goldThemeCloseStyle,
            ...styles?.close,
          },
        }
    : styles;

  // antd 不把 "default" 识别为预设色；Figma 的 default 对应未传 color 的基础 Tag。
  // 该归一化仅限 gold-dark，避免改变其他主题的既有行为。
  const antdColor =
    themeMode === "gold-dark" && color === "default" ? undefined : color;

  return (
    <AntdTag
      ref={ref}
      color={antdColor}
      variant={variant}
      style={mergedStyle}
      styles={mergedStyles}
      {...restProps}
    />
  );
});

Tag.displayName = "GZDTag";

export default Tag;
