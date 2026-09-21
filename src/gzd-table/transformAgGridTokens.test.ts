import { describe, expect, it } from "vitest";
import {
  convertTokens,
  convertTokensWithStats,
} from "../../scripts/transformAgGridTokens.js";

const validKeys = new Set([
  "accentColor",
  "browserColorScheme",
  "borderColor",
  "buttonBorder",
  "buttonBorderRadius",
  "buttonTextColor",
  "checkboxInputRightIconVisible",
  "foregroundColor",
]);

const extensionKeys = new Set([
  "checkboxCheckedColor",
  "inputRightIconVisible",
  "radioCheckedShapeImage",
  "rowGroupBgColor",
]);

describe("convertTokens", () => {
  it("normalizes colors, aliases, booleans, and composite borders", () => {
    const result = convertTokens(
      {
        foundations: {
          accentColor: {
            $type: "color",
            $value: {
              hex: "#FFE7CB",
              components: [1, 0.9, 0.8],
              alpha: 1,
            },
          },
          browserColorScheme: { $type: "string", $value: "Dark" },
          foregroundColor: {
            $type: "color",
            $value: {
              hex: "#FFFFFF",
              components: [1, 1, 1],
              alpha: 1,
            },
          },
          chromeForegroundColor: {
            $type: "color",
            $value: "{foundations.foregroundColor}",
          },
        },
        borders: {
          borderColor: {
            $type: "color",
            $value: { hex: "#323130", components: [0.1, 0.1, 0.1], alpha: 1 },
          },
        },
        buttons: {
          buttonBorder: { $type: "number", $value: 1 },
          buttonBorderColor: { $type: "color", $value: "{borders.borderColor}" },
          buttonBorderWidth: { $type: "number", $value: 1 },
          buttonBorderRadius: { $type: "number", $value: 4 },
          buttonTextColor: {
            $type: "color",
            $value: "{foundations.chromeForegroundColor}",
          },
        },
        checkboxes: {
          checkboxInputRightIconVisible: {
            $type: "number",
            $value: 1,
            $extensions: { "com.figma.type": "boolean" },
          },
        },
        ignored: {
          unknownColor: { $type: "color", $value: { hex: "#000000" } },
        },
      },
      validKeys,
    );

    expect(result).toEqual({
      accentColor: "#FFE7CB",
      browserColorScheme: "dark",
      borderColor: "#323130",
      buttonBorder: {
        style: "solid",
        width: 1,
        color: { ref: "borderColor" },
      },
      buttonBorderRadius: 4,
      buttonTextColor: { ref: "foregroundColor" },
      checkboxInputRightIconVisible: true,
      foregroundColor: "#FFFFFF",
    });
  });

  it("converts transparent colors to rgba and ignores unsupported chart data", () => {
    const result = convertTokens(
      {
        charts: {
          chartMenuPanelWidth: { $type: "number", $value: 260 },
          "ui-color": {
            accentColor: {
              $type: "color",
              $value: {
                hex: "#FFFFFF",
                components: [1, 1, 1],
                alpha: 0.15,
              },
            },
          },
        },
        cells: {
          cellTextColor: {
            $type: "color",
            $value: {
              hex: "#FFFFFF",
              components: [1, 1, 1],
              alpha: 0.5,
            },
          },
        },
      },
      new Set(["chartMenuPanelWidth", "accentColor", "cellTextColor"]),
    );

    expect(result).toEqual({
      chartMenuPanelWidth: 260,
      cellTextColor: "rgba(255, 255, 255, 0.5)",
    });
  });

  it("reports conversion statistics", () => {
    const { tokens, stats } = convertTokensWithStats(
      {
        foundations: {
          accentColor: {
            $type: "color",
            $value: { hex: "#FFE7CB" },
          },
        },
        charts: {
          ignoredColor: {
            $type: "color",
            $value: { hex: "#000000" },
          },
        },
      },
      new Set(["accentColor"]),
    );

    expect(tokens).toEqual({ accentColor: "#FFE7CB" });
    expect(stats).toEqual({
      sourceTokenCount: 2,
      selectedTokenCount: 1,
      skippedTokenCount: 1,
      generatedParamCount: 1,
      generatedReferenceCount: 0,
    });
  });

  it("keeps gzd extension tokens and normalizes legacy values", () => {
    const result = convertTokens(
      {
        foundations: {
          accentColor: {
            $type: "color",
            $value: { hex: "#FFE7CB" },
          },
        },
        checkboxes: {
          checkboxCheckedColor: {
            $type: "color",
            $value: "{foundations.accentColor}",
          },
          radioCheckedShapeImage: {
            $type: "number",
            $value: 0,
          },
        },
        inputs: {
          inputRightIconVisible: {
            $type: "number",
            $value: 1,
            $extensions: { "com.figma.type": "boolean" },
          },
        },
        rows: {
          rowGroupBgColor: {
            $type: "color",
            $value: { hex: "#242424" },
          },
        },
      },
      extensionKeys,
    );

    expect(result).toEqual({
      checkboxCheckedColor: "#FFE7CB",
      inputRightIconVisible: 1,
      radioCheckedShapeImage: "none",
      rowGroupBgColor: "#242424",
    });
  });

  it("rejects duplicate selected token basenames", () => {
    expect(() =>
      convertTokens(
        {
          first: {
            accentColor: {
              $type: "color",
              $value: { hex: "#FFE7CB" },
            },
          },
          second: {
            accentColor: {
              $type: "color",
              $value: { hex: "#0083FF" },
            },
          },
        },
        new Set(["accentColor"]),
      ),
    ).toThrow(/Duplicate AG Grid token basenames.*first\.accentColor.*second\.accentColor/);
  });

  it("rejects missing and circular source references", () => {
    expect(() =>
      convertTokens(
        {
          foundations: {
            accentColor: {
              $type: "color",
              $value: "{foundations.missingColor}",
            },
          },
        },
        new Set(["accentColor"]),
      ),
    ).toThrow(/Missing AG Grid token reference "foundations\.missingColor"/);

    expect(() =>
      convertTokens(
        {
          foundations: {
            accentColor: {
              $type: "color",
              $value: "{foundations.foregroundColor}",
            },
            foregroundColor: {
              $type: "color",
              $value: "{foundations.accentColor}",
            },
          },
        },
        new Set(["accentColor", "foregroundColor"]),
      ),
    ).toThrow(/Circular AG Grid token reference/);
  });

  it("rejects generated refs that are not ThemeDefaultParams", () => {
    expect(() =>
      convertTokens(
        {
          buttons: {
            buttonBorderWidth: { $type: "number", $value: 1 },
          },
        },
        new Set(["buttonBorder"]),
      ),
    ).toThrow(/not ThemeDefaultParams: borderColor/);
  });
});
