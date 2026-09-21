import { themeQuartz } from "ag-grid-community";
import { goldDarkAgGridTokens } from "./goldDarkAgGridTokens";
import { goldLightAgGridTokens } from "./goldLightAgGridTokens";
import type { GZDAgGridTokens } from "./agGridTokens";

export type GZDAgGridThemeMode = "gold-dark" | "gold-light";

export interface GZDAgGridThemeCssVariablesOptions {
  themeMode: GZDAgGridThemeMode;
  prefix?: string;
  target?: HTMLElement;
}

interface AgGridThemeWithParamsCss {
  _getParamsCss: () => string;
}

const agGridTokensByThemeMode: Record<GZDAgGridThemeMode, GZDAgGridTokens> = {
  "gold-dark": goldDarkAgGridTokens,
  "gold-light": goldLightAgGridTokens,
};

const toKebabCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/([a-zA-Z])(\d)/g, "$1-$2")
    .replace(/(\d)([a-zA-Z])/g, "$1-$2")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const normalizeCssVariablePrefix = (prefix: string): string =>
  toKebabCase(prefix).replace(/^-+|-+$/g, "") || "ag";

const getAgGridCssValueMap = (
  tokens: GZDAgGridTokens,
): Record<string, string> => {
  // AG Grid 的参数包含长度、边框和 token 引用等复合值。复用其主题转换结果，
  // 确保导出的 CSS 值与 themeQuartz.withParams() 实际使用的值保持一致。
  const theme = themeQuartz.withParams(tokens) as unknown as AgGridThemeWithParamsCss;
  const variables: Record<string, string> = {};

  theme
    ._getParamsCss()
    .split("\n")
    .forEach((line) => {
      const match = line.match(
        /^\s*(--ag-[a-z0-9-]+):\s*var\(--ag-inherited-[a-z0-9-]+,\s*(.*)\);\s*$/,
      );

      if (match) {
        variables[match[1]] = match[2];
      }
    });

  return variables;
};

export const getAgGridDesignTokenCssVariables = ({
  themeMode,
  prefix = "ag",
}: GZDAgGridThemeCssVariablesOptions): Record<string, string> => {
  const normalizedPrefix = normalizeCssVariablePrefix(prefix);
  const sourcePrefix = "--ag-";
  const targetPrefix = `--${normalizedPrefix}-`;
  const tokens = agGridTokensByThemeMode[themeMode];
  const agGridVariables = getAgGridCssValueMap(tokens);
  const variables: Record<string, string> = {};

  Object.keys(tokens).forEach((tokenName) => {
    const agGridVariableName = `${sourcePrefix}${toKebabCase(tokenName)}`;
    const value = agGridVariables[agGridVariableName];

    if (value === undefined) {
      throw new Error(
        `Unable to convert AG Grid design token "${tokenName}" to a CSS variable.`,
      );
    }

    variables[agGridVariableName.replace(sourcePrefix, targetPrefix)] =
      value.replaceAll(sourcePrefix, targetPrefix);
  });

  return variables;
};

export const applyAgGridDesignTokenCssVariables = ({
  target,
  ...options
}: GZDAgGridThemeCssVariablesOptions): (() => void) => {
  const cssVariables = getAgGridDesignTokenCssVariables(options);
  const targetElement =
    target ?? (typeof document === "undefined" ? undefined : document.documentElement);

  if (!targetElement) {
    return () => {};
  }

  const previousValues = new Map<string, string>();

  Object.entries(cssVariables).forEach(([property, value]) => {
    previousValues.set(property, targetElement.style.getPropertyValue(property));
    targetElement.style.setProperty(property, value);
  });

  return () => {
    Object.entries(cssVariables).forEach(([property, appliedValue]) => {
      if (targetElement.style.getPropertyValue(property) !== appliedValue) {
        return;
      }

      const previousValue = previousValues.get(property);

      if (previousValue) {
        targetElement.style.setProperty(property, previousValue);
      } else {
        targetElement.style.removeProperty(property);
      }
    });
  };
};
