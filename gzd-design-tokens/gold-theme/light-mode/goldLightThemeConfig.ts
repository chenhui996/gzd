import type { ThemeConfig } from 'antd/es/config-provider/context';
import { goldLightThemeTokens } from './goldLightThemeTokens';

export const goldLightThemeConfig: ThemeConfig = {
  token: goldLightThemeTokens.token as ThemeConfig['token'],
  components: goldLightThemeTokens.components as ThemeConfig['components'],
};

export const goldLightThemeCustomTokens = goldLightThemeTokens.custom;
