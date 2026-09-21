import type { ThemeConfig } from 'antd/es/config-provider/context';
import { goldDarkThemeTokens } from './goldDarkThemeTokens';

export const goldDarkThemeConfig: ThemeConfig = {
  token: goldDarkThemeTokens.token as ThemeConfig['token'],
  components: goldDarkThemeTokens.components as ThemeConfig['components'],
};

export const goldDarkThemeCustomTokens = goldDarkThemeTokens.custom;
