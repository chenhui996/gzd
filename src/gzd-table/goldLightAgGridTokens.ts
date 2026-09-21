import { goldLightAgGridTokens as generatedGoldLightAgGridTokens } from "../../gzd-design-tokens/gold-theme/light-mode/ag-grid/goldLightAgGridTokens";
import type { GZDAgGridTokens } from "./agGridTokens";

/**
 * Keep the generated source out of the public declaration path while exposing
 * a type-safe AG Grid parameter object to package consumers.
 */
export const goldLightAgGridTokens: GZDAgGridTokens =
  generatedGoldLightAgGridTokens;
