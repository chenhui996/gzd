import { Cascader } from "antd";
import * as React from "react";
import {
  applyDocsThemeSelection,
  dispatchDocsThemeSelectionChange,
  GZD_DOCS_THEME_EVENT,
  GZD_DOCS_THEME_STORAGE_KEY,
  parseDocsThemeSelection,
  persistDocsThemeSelection,
  readDocsThemeSelection,
  type GZDDocsThemeSelection,
} from "../../gzd-theme";
import "./index.less";

const themeOptions = [
  {
    value: "gold",
    label: "金色主题",
    children: [
      { value: "light", label: "亮色模式" },
      { value: "dark", label: "暗色模式" },
    ],
  },
  {
    value: "blue",
    label: "蓝色主题",
    children: [
      { value: "light", label: "亮色模式" },
      { value: "dark", label: "暗色模式" },
    ],
  },
];

const ColorSwitch = () => {
  const [value, setValue] = React.useState<GZDDocsThemeSelection>(() =>
    readDocsThemeSelection(),
  );

  React.useEffect(() => {
    applyDocsThemeSelection(value);

    const handleThemeChange = (event: Event) => {
      const nextValue = parseDocsThemeSelection(
        (event as CustomEvent<unknown>).detail,
      );
      setValue(nextValue);
      applyDocsThemeSelection(nextValue);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== GZD_DOCS_THEME_STORAGE_KEY) {
        return;
      }

      const nextValue = parseDocsThemeSelection(event.newValue);
      setValue(nextValue);
      applyDocsThemeSelection(nextValue);
    };

    window.addEventListener(GZD_DOCS_THEME_EVENT, handleThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(GZD_DOCS_THEME_EVENT, handleThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [value]);

  const handleChange = (nextValue: (string | number)[]) => {
    const nextSelection = parseDocsThemeSelection(nextValue);
    setValue(nextSelection);
    persistDocsThemeSelection(nextSelection);
    dispatchDocsThemeSelectionChange(nextSelection);
  };

  return (
    <span
      className="gz-docs-theme-switch"
      onClick={(event) => event.stopPropagation()}
    >
      <Cascader
        allowClear={false}
        displayRender={(labels) => labels.join(" / ")}
        onChange={handleChange}
        options={themeOptions}
        placement="bottomRight"
        size="small"
        value={value}
        variant="outlined"
      />
    </span>
  );
};

export default ColorSwitch;
