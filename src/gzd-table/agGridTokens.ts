import type {
  ColorValue,
  ImageValue,
  LengthValue,
  ThemeDefaultParams,
} from "ag-grid-community";

/** gzd 从设计 Token 保留的 AG Grid 兼容参数。 */
export interface GZDAgGridExtensionTokens {
  checkboxCheckedColor: ColorValue;
  chromeForegroundColor: ColorValue;
  dropdownBorderRadius: LengthValue;
  headerBorderColor: ColorValue;
  inputDisabledBorderLegacy: LengthValue;
  inputRightIconVisible: LengthValue;
  radioCheckedShapeImage: ImageValue;
  rowGroupBgColor: ColorValue;
  rowGroupBgHoverColor: ColorValue;
  scrollbarThumbColor: ColorValue;
  scrollbarThumbHoverColor: ColorValue;
  tabBorderColor: ColorValue;
  widgetContainerBorderRadius: LengthValue;
  widgetContainerVerticalSpacing: LengthValue;
}

/** Gold Table 公开的 AG Grid 原生参数与 gzd 兼容参数集合。 */
export type GZDAgGridTokens = Partial<ThemeDefaultParams> &
  GZDAgGridExtensionTokens;
