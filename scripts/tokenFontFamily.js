/**
 * UI 设计稿只支持单一字体名，不支持 CSS fallback chain。
 * 这里把 fontFamily 兜底成 CSS 多级 fallback，供：
 *   - scripts/transformAllTokens.js：覆盖主包 token.fontFamily（antd 主链路）
 *   - scripts/transformAgGridTokens.js：覆盖 AG Grid token.fontFamily（gzd-table 子入口）
 * 共同引用，保证组件库最终产物里所有 fontFamily 字段都使用同一份兜底链。
 *
 * 修改此文件后请运行：
 *   npm run tokens:transform
 * 以同步刷新 gzd-design-tokens/ 下的 JSON、TS 产物以及 docs/tokens*.md。
 */
export const fixedFontFamilyDesignToken = {
  $type: "string",
  $value:
    "'Source Han Sans CN VF', 'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'custom-pingfang', 'Noto Sans CJK SC', sans-serif",
  $description:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  $extensions: {
    "com.figma.variableId": "VariableID:174:3893",
    "com.figma.scopes": ["ALL_SCOPES"],
    "com.figma.type": "string",
  },
};

/** 供 transformAgGridTokens 使用的纯字符串版本，避免在产物中携带 Figma 元信息。 */
export const fixedFontFamilyCssValue = fixedFontFamilyDesignToken.$value;
