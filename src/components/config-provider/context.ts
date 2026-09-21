import { createContext } from "react";
import type { GZDThemeMode } from "../../styles/themes";

export interface GZDConfigContextValue {
  themeMode?: GZDThemeMode;
}

export const GZDConfigContext = createContext<GZDConfigContextValue>({});
