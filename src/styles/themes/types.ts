import type { ThemeConfig } from "antd/es/config-provider/context";

export type GZDThemeName = "gold" | "blue";
export type GZDThemeVariant = "light" | "dark";
export type GZDThemeMode = `${GZDThemeName}-${GZDThemeVariant}`;

export interface GZDThemeOptions {
  themeMode: GZDThemeMode;
}

export interface GZDDesignTokenBundle {
  globalToken: NonNullable<ThemeConfig["token"]>;
  components: NonNullable<ThemeConfig["components"]>;
  custom?: Record<string, unknown>;
}

export interface GZDThemeCssVariablesOptions extends GZDThemeOptions {
  prefix?: string;
  target?: HTMLElement;
  includeComponents?: boolean;
  includeCustom?: boolean;
}
