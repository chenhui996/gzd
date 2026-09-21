import { useThemeStore } from "dumi-theme-antd-style/dist/store/useThemeStore";
import type { GZDThemeMode } from "../../src/styles/themes";

export type GZDDocsThemeName = "gold" | "blue";
export type GZDDocsThemeVariant = "light" | "dark";
export type GZDDocsThemeSelection = [GZDDocsThemeName, GZDDocsThemeVariant];

export const GZD_DOCS_THEME_STORAGE_KEY = "gzd-docs-theme";
export const GZD_DOCS_THEME_EVENT = "gzd-docs-theme-change";
export const DEFAULT_GZD_DOCS_THEME: GZDDocsThemeSelection = ["gold", "dark"];

const themeNames = ["gold", "blue"] as const;
const themeVariants = ["light", "dark"] as const;

const isThemeName = (value: unknown): value is GZDDocsThemeName =>
  themeNames.includes(value as GZDDocsThemeName);

const isThemeVariant = (value: unknown): value is GZDDocsThemeVariant =>
  themeVariants.includes(value as GZDDocsThemeVariant);

export const isDocsThemeSelection = (
  value: unknown,
): value is GZDDocsThemeSelection =>
  Array.isArray(value) &&
  value.length === 2 &&
  isThemeName(value[0]) &&
  isThemeVariant(value[1]);

export const cloneDefaultDocsThemeSelection = (): GZDDocsThemeSelection => [
  ...DEFAULT_GZD_DOCS_THEME,
];

export const parseDocsThemeSelection = (
  value: unknown,
): GZDDocsThemeSelection => {
  if (isDocsThemeSelection(value)) {
    return [...value];
  }

  if (typeof value === "string") {
    try {
      const parsedValue: unknown = JSON.parse(value);
      if (isDocsThemeSelection(parsedValue)) {
        return [...parsedValue];
      }
    } catch {
      return cloneDefaultDocsThemeSelection();
    }
  }

  return cloneDefaultDocsThemeSelection();
};

export const readDocsThemeSelection = (): GZDDocsThemeSelection => {
  if (typeof window === "undefined") {
    return cloneDefaultDocsThemeSelection();
  }

  return parseDocsThemeSelection(
    window.localStorage.getItem(GZD_DOCS_THEME_STORAGE_KEY),
  );
};

export const docsThemeSelectionToMode = (
  selection: GZDDocsThemeSelection,
): GZDThemeMode => `${selection[0]}-${selection[1]}` as GZDThemeMode;

export const applyDocsThemeSelection = (
  selection: GZDDocsThemeSelection,
): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.setAttribute("data-prefers-color", selection[1]);
  document.documentElement.setAttribute("data-gzd-theme", selection[0]);
  document.documentElement.setAttribute("data-gzd-theme-mode", selection[1]);
  useThemeStore.setState({ themeMode: selection[1] });
};

export const persistDocsThemeSelection = (
  selection: GZDDocsThemeSelection,
): void => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      GZD_DOCS_THEME_STORAGE_KEY,
      JSON.stringify(selection),
    );
  }

  applyDocsThemeSelection(selection);
};

export const dispatchDocsThemeSelectionChange = (
  selection: GZDDocsThemeSelection,
): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(GZD_DOCS_THEME_EVENT, { detail: selection }),
  );
};
