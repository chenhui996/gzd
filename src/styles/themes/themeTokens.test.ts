import { describe, expect, it } from "vitest";
import { getDesignTokenCssVariables } from "./themeCssVariables";
import { getDesignTokens } from "./themeTokens";

describe("gold design tokens", () => {
  it("maps the Tabs divider to the global border color", () => {
    const lightTokens = getDesignTokens({ themeMode: "gold-light" });
    const darkTokens = getDesignTokens({ themeMode: "gold-dark" });

    expect(lightTokens.components.Tabs?.colorBorderSecondary).toBe(
      lightTokens.globalToken.colorBorder,
    );
    expect(lightTokens.components.Tabs?.colorBorderSecondary).toBe("#D9D9D9");
    expect(darkTokens.components.Tabs?.colorBorderSecondary).toBe(
      darkTokens.globalToken.colorBorder,
    );
  });

  it("exposes the refreshed light palette without unresolved aliases", () => {
    const tokens = getDesignTokens({ themeMode: "gold-light" });
    const globalToken = tokens.globalToken as Record<string, unknown>;

    expect(globalToken.colorPrimary).toBe("#0083FF");
    expect(globalToken["guotai blue6"]).toBe("#0083FF");
    expect(globalToken.colorLinkHover).toBe("#52B7FF");
    expect(globalToken.colorLinkActive).toBe("#0069D9");
  });

  it("keeps the new custom component groups available to token consumers", () => {
    const tokens = getDesignTokens({ themeMode: "gold-light" });
    const components = tokens.components as Record<
      string,
      Record<string, unknown>
    >;

    expect(components.Sidebar).toMatchObject({
      itemHoverBg: "rgba(0, 131, 255, 0.08)",
      itemSelectedColor: "#0083FF",
    });
    expect(components.PanelCollapse).toMatchObject({
      bg: "#F0F0F0",
      bgHover: "#D9D9D9",
    });
  });

  it("can emit CSS variables for the new component groups on demand", () => {
    const variables = getDesignTokenCssVariables({
      themeMode: "gold-light",
      includeComponents: true,
    });

    expect(variables["--gzd-components-sidebar-item-hover-bg"]).toBe(
      "rgba(0, 131, 255, 0.08)",
    );
    expect(variables["--gzd-components-panel-collapse-bg"]).toBe("#F0F0F0");
  });
});
