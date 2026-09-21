import type { ThemeConfig } from 'antd/es/config-provider/context';
import { blueDarkThemeTokens } from './blueDarkThemeTokens';

export const blueDarkThemeConfig: ThemeConfig = {
  token: blueDarkThemeTokens.token as ThemeConfig['token'],
  components: blueDarkThemeTokens.components as ThemeConfig['components'],
};

export const blueDarkThemeCustomTokens = blueDarkThemeTokens.custom;
