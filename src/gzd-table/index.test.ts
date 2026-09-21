import { describe, expect, it } from "vitest";
import {
  AgGridReact,
  AllEnterpriseModule,
  ModuleRegistry,
  applyAgGridDesignTokenCssVariables,
  getAgGridDesignTokenCssVariables,
  goldDarkAgGridTokens,
  goldLightAgGridTokens,
  themeQuartz,
  type AgGridReactProps,
  type ColDef,
  type ICellRendererParams,
} from "./index";

interface RowData {
  id: string;
  name: string;
}

const columnDefs: ColDef<RowData>[] = [
  {
    field: "name",
    cellRenderer: ({ value }: ICellRendererParams<RowData, string>) => value,
  },
];

const reactProps: AgGridReactProps<RowData> = {
  rowData: [{ id: "1", name: "Soleil" }],
  columnDefs,
};

const extensionTokenNames = [
  "checkboxCheckedColor",
  "chromeForegroundColor",
  "dropdownBorderRadius",
  "headerBorderColor",
  "inputDisabledBorderLegacy",
  "inputRightIconVisible",
  "radioCheckedShapeImage",
  "rowGroupBgColor",
  "rowGroupBgHoverColor",
  "scrollbarThumbColor",
  "scrollbarThumbHoverColor",
  "tabBorderColor",
  "widgetContainerBorderRadius",
  "widgetContainerVerticalSpacing",
] as const;

const toCssVariableName = (tokenName: string) =>
  `--ag-${tokenName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;

describe("gzd-table public API", () => {
  it("re-exports representative Community, Enterprise, and React values", () => {
    expect(ModuleRegistry).toBeDefined();
    expect(themeQuartz).toBeDefined();
    expect(AllEnterpriseModule).toBeDefined();
    expect(AgGridReact).toBeDefined();
  });

  it("exports gold-dark tokens that can be applied to an AG Grid theme", () => {
    const themedGrid = themeQuartz.withParams(goldDarkAgGridTokens);
    const themeCss = (
      themedGrid as unknown as { _getParamsCss: () => string }
    )._getParamsCss();

    expect(goldDarkAgGridTokens.accentColor).toBe("#FFE7CB");
    expect(goldDarkAgGridTokens.browserColorScheme).toBe("dark");
    expect(goldDarkAgGridTokens.headerColumnBorder).toBe(false);
    expect(goldDarkAgGridTokens.headerColumnBorderHeight).toBe(0);
    expect(goldDarkAgGridTokens.pinnedColumnBorder).toBe(false);
    expect(goldDarkAgGridTokens.rowBorder).toEqual({
      style: "solid",
      width: 1,
      color: { ref: "borderColor" },
    });
    expect(goldDarkAgGridTokens.headerColumnResizeHandleColor).toBe("#474747");
    expect(goldDarkAgGridTokens.checkboxIndeterminateBackgroundColor).toEqual({
      ref: "accentColor",
    });
    expect(goldDarkAgGridTokens.checkboxIndeterminateShapeColor).toBe(
      "#763800",
    );
    expect(goldDarkAgGridTokens.checkboxCheckedShapeColor).toBe("#763800");
    expect(goldDarkAgGridTokens.checkboxUncheckedBorderColor).toBe("#333333");
    expect(goldDarkAgGridTokens.rowGroupBgColor).toBe("#242424");
    expect(goldDarkAgGridTokens.rowGroupBgHoverColor).toBe(
      "rgba(255, 231, 203, 0.15)",
    );
    expect(goldDarkAgGridTokens.radioCheckedShapeImage).toBe("none");
    expect(themeCss).toContain(
      "--ag-accent-color: var(--ag-inherited-accent-color, #FFE7CB)",
    );
    expect(themeCss).toContain(
      "--ag-row-group-bg-color: var(--ag-inherited-row-group-bg-color, #242424)",
    );
    expect(themeCss).toContain(
      "--ag-radio-checked-shape-image: var(--ag-inherited-radio-checked-shape-image, none)",
    );
  });

  it("exports gold-light tokens that can be applied to an AG Grid theme", () => {
    const themedGrid = themeQuartz.withParams(goldLightAgGridTokens);
    const themeCss = (
      themedGrid as unknown as { _getParamsCss: () => string }
    )._getParamsCss();

    expect(goldLightAgGridTokens.accentColor).toBe("#0083FF");
    expect(goldLightAgGridTokens.browserColorScheme).toBe("light");
    expect(goldLightAgGridTokens.checkboxIndeterminateShapeColor).toEqual({
      ref: "backgroundColor",
    });
    expect(goldLightAgGridTokens.checkboxIndeterminateBackgroundColor).toEqual({
      ref: "accentColor",
    });
    expect(goldLightAgGridTokens.checkboxUncheckedBorderColor).toBe("#D9D9D9");
    expect(goldLightAgGridTokens.rowGroupBgColor).toBe("#FAFAFA");
    expect(themeCss).toContain(
      "--ag-accent-color: var(--ag-inherited-accent-color, #0083FF)",
    );
  });

  it("exports every gzd extension token and emits its AG CSS variable", () => {
    const darkThemeCss = (
      themeQuartz.withParams(goldDarkAgGridTokens) as unknown as {
        _getParamsCss: () => string;
      }
    )._getParamsCss();

    for (const tokenName of extensionTokenNames) {
      expect(goldDarkAgGridTokens[tokenName], tokenName).toBeDefined();
      expect(darkThemeCss, tokenName).toContain(
        `${toCssVariableName(tokenName)}:`,
      );
    }
  });

  it("exports gold AG Grid tokens as native CSS variables", () => {
    const darkVariables = getAgGridDesignTokenCssVariables({
      themeMode: "gold-dark",
    });
    const lightVariables = getAgGridDesignTokenCssVariables({
      themeMode: "gold-light",
    });

    expect(darkVariables["--ag-accent-color"]).toBe("#FFE7CB");
    expect(darkVariables["--ag-row-border"]).toBe(
      "solid 1px var(--ag-border-color)",
    );
    expect(darkVariables["--ag-checkbox-indeterminate-background-color"]).toBe(
      "var(--ag-accent-color)",
    );
    expect(darkVariables["--ag-header-column-border"]).toBe("none");
    expect(lightVariables["--ag-accent-color"]).toBe("#0083FF");
    expect(Object.keys(darkVariables)).toHaveLength(
      Object.keys(goldDarkAgGridTokens).length,
    );
  });

  it("should contain correct fallback font family values", () => {
    const darkVariables = getAgGridDesignTokenCssVariables({
      themeMode: "gold-dark",
    });

    expect(darkVariables["--ag-font-family"]).toBe("var(--gzd-font-family)");
    expect(darkVariables["--ag-cell-font-family"]).toBe("var(--gzd-font-family)");
    expect(darkVariables["--ag-header-font-family"]).toBe("var(--gzd-font-family)");
  });

  it("supports custom AG Grid CSS variable prefixes and rewrites references", () => {
    const variables = getAgGridDesignTokenCssVariables({
      themeMode: "gold-dark",
      prefix: "Business Grid",
    });

    expect(variables["--business-grid-accent-color"]).toBe("#FFE7CB");
    expect(
      variables["--business-grid-checkbox-indeterminate-background-color"],
    ).toBe("var(--business-grid-accent-color)");
    expect(variables["--ag-accent-color"]).toBeUndefined();
  });

  it("applies AG Grid CSS variables and restores previous values on cleanup", () => {
    const target = document.createElement("div");
    target.style.setProperty("--ag-accent-color", "rebeccapurple");

    const cleanup = applyAgGridDesignTokenCssVariables({
      themeMode: "gold-dark",
      target,
    });

    expect(target.style.getPropertyValue("--ag-accent-color")).toBe("#FFE7CB");
    expect(target.style.getPropertyValue("--ag-row-border")).toBe(
      "solid 1px var(--ag-border-color)",
    );

    cleanup();

    expect(target.style.getPropertyValue("--ag-accent-color")).toBe(
      "rebeccapurple",
    );
    expect(target.style.getPropertyValue("--ag-row-border")).toBe("");
  });

  it("does not overwrite a newer AG Grid CSS variable during cleanup", () => {
    const target = document.createElement("div");
    const cleanup = applyAgGridDesignTokenCssVariables({
      themeMode: "gold-light",
      target,
    });

    target.style.setProperty("--ag-accent-color", "hotpink");
    cleanup();

    expect(target.style.getPropertyValue("--ag-accent-color")).toBe("hotpink");
  });

  it("uses the document root as the default AG Grid CSS variable target", () => {
    const previousAccentColor = document.documentElement.style.getPropertyValue(
      "--ag-accent-color",
    );
    const cleanup = applyAgGridDesignTokenCssVariables({
      themeMode: "gold-light",
    });

    expect(
      document.documentElement.style.getPropertyValue("--ag-accent-color"),
    ).toBe("#0083FF");

    cleanup();

    expect(
      document.documentElement.style.getPropertyValue("--ag-accent-color"),
    ).toBe(previousAccentColor);
  });

  it("preserves generic Community and React types", () => {
    expect(reactProps.rowData?.[0]?.name).toBe("Soleil");
    expect(reactProps.columnDefs).toBe(columnDefs);
  });
});
