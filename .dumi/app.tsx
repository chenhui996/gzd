/* eslint-disable react-refresh/only-export-components -- Dumi 要求在此文件导出运行时钩子。 */
import * as React from "react";
import ConfigProvider from "../src/components/config-provider";
import { applyDesignTokenCssVariables } from "../src/styles/themes";
import {
  applyDocsThemeSelection,
  docsThemeSelectionToMode,
  GZD_DOCS_THEME_EVENT,
  GZD_DOCS_THEME_STORAGE_KEY,
  parseDocsThemeSelection,
  readDocsThemeSelection,
  type GZDDocsThemeSelection,
} from "./theme/gzd-theme";
import "./theme/token-docs.less";

function useDocsThemeSelection() {
  const [selection, setSelection] = React.useState<GZDDocsThemeSelection>(() =>
    readDocsThemeSelection(),
  );

  React.useEffect(() => {
    const updateSelection = (nextSelection: GZDDocsThemeSelection) => {
      setSelection(nextSelection);
      applyDocsThemeSelection(nextSelection);
    };

    updateSelection(readDocsThemeSelection());

    const handleThemeChange = (event: Event) => {
      updateSelection(
        parseDocsThemeSelection((event as CustomEvent<unknown>).detail),
      );
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== GZD_DOCS_THEME_STORAGE_KEY) {
        return;
      }

      updateSelection(parseDocsThemeSelection(event.newValue));
    };

    window.addEventListener(GZD_DOCS_THEME_EVENT, handleThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(GZD_DOCS_THEME_EVENT, handleThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return selection;
}

export function rootContainer(container: React.ReactNode) {
  return React.createElement(ThemeWrapper, null, container);
}

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const selection = useDocsThemeSelection();

  applyDesignTokenCssVariables({
    themeMode: docsThemeSelectionToMode(selection),
    includeCustom: true,
    includeComponents: true,
  });

  return (
    <ConfigProvider themeMode={docsThemeSelectionToMode(selection)}>
      {children}
    </ConfigProvider>
  );
}
