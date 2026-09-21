/**
 * 通过正式包名验证主入口和更名后的公开类型，不使用源码路径或本地别名。
 */
import {
  Button,
  ConfigProvider,
  getDesignTokenCssVariables,
  getDesignTokens,
  type ButtonProps,
  type GZDConfigProviderProps,
  type GZDDesignTokenBundle,
  type GZDThemeCssVariablesOptions,
  type GZDThemeMode,
} from "gzd";

const themeMode: GZDThemeMode = "gold-dark";
const config: GZDConfigProviderProps = { themeMode };
const button: ButtonProps = { type: "primary" };
const options: GZDThemeCssVariablesOptions = {
  themeMode,
  includeComponents: true,
};
const tokens: GZDDesignTokenBundle = getDesignTokens({ themeMode });
const variables: Record<string, string> = getDesignTokenCssVariables(options);

void [Button, ConfigProvider, config, button, tokens, variables];
