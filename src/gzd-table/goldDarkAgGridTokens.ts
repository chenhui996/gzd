import { goldDarkAgGridTokens as generatedGoldDarkAgGridTokens } from "../../gzd-design-tokens/gold-theme/dark-mode/ag-grid/goldDarkAgGridTokens";
import type { GZDAgGridTokens } from "./agGridTokens";

/**
 * Keep the generated source out of the public declaration path while exposing
 * a type-safe AG Grid parameter object to package consumers.
 */
export const goldDarkAgGridTokens: GZDAgGridTokens = generatedGoldDarkAgGridTokens;
