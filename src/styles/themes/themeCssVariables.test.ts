import { describe, expect, it } from "vitest";
import {
  applyDesignTokenCssVariables,
  getDesignTokenCssVariables,
} from "./themeCssVariables";
import { getDesignTokens } from "./themeTokens";
import type { GZDThemeMode } from "./types";

const themeModes: GZDThemeMode[] = [
  "gold-dark",
  "gold-light",
  "blue-dark",
  "blue-light",
];

// 默认命名空间：四种主题的全局、组件及自定义变量必须使用同一前缀。
describe("gzd theme CSS namespace", () => {
  it.each(themeModes)("uses gzd variables in %s", (themeMode) => {
    const variables = getDesignTokenCssVariables({
      themeMode,
      includeComponents: true,
      includeCustom: true,
    });

    expect(Object.keys(variables).length).toBeGreaterThan(0);
    expect(Object.keys(variables).every((key) => key.startsWith("--gzd-"))).toBe(true);
    expect(variables["--gzd-color-primary"]).toBe(
      getDesignTokens({ themeMode }).globalToken.colorPrimary,
    );
    expect(Object.keys(variables).some((key) => key.startsWith("--gzd-components-"))).toBe(true);
    expect(Object.keys(variables).some((key) => key.startsWith("--gzd-custom-"))).toBe(true);
  });

  it("uses gzd when the supplied prefix normalizes to empty", () => {
    const variables = getDesignTokenCssVariables({
      themeMode: "gold-dark",
      prefix: " -- ",
    });
    expect(Object.keys(variables).every((key) => key.startsWith("--gzd-"))).toBe(true);
  });

  it("preserves consumer-defined namespaces", () => {
    const variables = getDesignTokenCssVariables({
      themeMode: "gold-dark",
      prefix: "PricingApp",
    });
    expect(Object.keys(variables).every((key) => key.startsWith("--pricing-app-"))).toBe(true);
  });
});

// 应用与清理：更名后的变量仍应正确恢复调用前的内联值。
describe("gzd theme CSS lifecycle", () => {
  it("restores previous values without touching unrelated styles", () => {
    const target = document.createElement("div");
    target.style.setProperty("--gzd-color-primary", "red");
    target.style.setProperty("--business-color", "green");
    const cleanup = applyDesignTokenCssVariables({
      target,
      themeMode: "gold-dark",
    });

    expect(target.style.getPropertyValue("--gzd-color-primary")).toBe(
      getDesignTokens({ themeMode: "gold-dark" }).globalToken.colorPrimary,
    );
    cleanup();
    expect(target.style.getPropertyValue("--gzd-color-primary")).toBe("red");
    expect(target.style.getPropertyValue("--business-color")).toBe("green");
    expect(target.style.getPropertyValue("--gzd-color-text")).toBe("");
  });
});
