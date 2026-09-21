export interface AgGridTokenConversionStats {
  sourceTokenCount: number;
  selectedTokenCount: number;
  skippedTokenCount: number;
  generatedParamCount: number;
  generatedReferenceCount: number;
}

export interface AgGridTokenConversionResult {
  tokens: Record<string, unknown>;
  stats: AgGridTokenConversionStats;
}

export declare const convertTokensWithStats: (
  source: Record<string, unknown>,
  validKeys: ReadonlySet<string>,
) => AgGridTokenConversionResult;
export declare const convertTokens: (
  source: Record<string, unknown>,
  validKeys: ReadonlySet<string>,
) => Record<string, unknown>;
export declare const loadValidThemeParamNames: () => Set<string>;
export declare const generateAgGridTokens: (
  mode?: "dark" | "light",
) => Record<string, unknown>;
export declare const generateGoldDarkAgGridTokens: () => Record<string, unknown>;
export declare const generateGoldLightAgGridTokens: () => Record<string, unknown>;
