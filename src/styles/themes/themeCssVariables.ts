import type { GZDThemeCssVariablesOptions } from "./types";
import { getDesignTokens } from "./themeTokens";

type CssVariableValue = string | number | boolean;

const isCssVariableValue = (value: unknown): value is CssVariableValue =>
  ["string", "number", "boolean"].includes(typeof value);

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
  toKebabCase(prefix).replace(/^-+|-+$/g, "") || "gz";

const appendCssVariables = (
  output: Record<string, string>,
  value: unknown,
  path: string[],
  prefix: string,
): void => {
  if (isCssVariableValue(value)) {
    const variableName = ["", "", prefix, ...path.map(toKebabCase)].join("-");
    output[variableName] = String(value);
    return;
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return;
  }

  Object.entries(value as Record<string, unknown>).forEach(([key, nestedValue]) => {
    appendCssVariables(output, nestedValue, [...path, key], prefix);
  });
};

export const getDesignTokenCssVariables = ({
  prefix = "gz",
  includeComponents = false,
  includeCustom = true,
  ...themeOptions
}: GZDThemeCssVariablesOptions): Record<string, string> => {
  const normalizedPrefix = normalizeCssVariablePrefix(prefix);
  const themeTokens = getDesignTokens(themeOptions);
  const variables: Record<string, string> = {};

  appendCssVariables(variables, themeTokens.globalToken, [], normalizedPrefix);

  if (includeCustom) {
    appendCssVariables(variables, themeTokens.custom, ["custom"], normalizedPrefix);
  }

  if (includeComponents) {
    appendCssVariables(
      variables,
      themeTokens.components,
      ["components"],
      normalizedPrefix,
    );
  }

  return variables;
};

export const applyDesignTokenCssVariables = ({
  target,
  ...options
}: GZDThemeCssVariablesOptions): (() => void) => {
  const cssVariables = getDesignTokenCssVariables(options);
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
