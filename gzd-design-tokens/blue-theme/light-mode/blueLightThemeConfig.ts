import type { ThemeConfig } from 'antd/es/config-provider/context';
import { blueLightThemeTokens } from './blueLightThemeTokens';

export const blueLightThemeConfig: ThemeConfig = {
  token: blueLightThemeTokens.token as ThemeConfig['token'],
  components: blueLightThemeTokens.components as ThemeConfig['components'],
};

export const blueLightThemeCustomTokens = blueLightThemeTokens.custom;
