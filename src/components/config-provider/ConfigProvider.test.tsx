import { cleanup, render, screen } from "@testing-library/react";
import { ConfigProvider as AntdConfigProvider, Select } from "antd";
import { useContext } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Button from "../button";
import ConfigProvider from "./index";
import { getDesignTokenCssVariables } from "../../styles/themes";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function ThemeProbe({ id }: { id: string }) {
  const { theme } = useContext(AntdConfigProvider.ConfigContext);
  return <output data-testid={id}>{JSON.stringify(theme?.cssVar)}</output>;
}

const readConfig = (id: string) =>
  JSON.parse(screen.getByTestId(id).textContent || "{}") as {
    prefix: string;
    key: string;
  };

// 默认命名空间：底层组件、自有主题标记与两套不同单位格式的变量。
describe("gzd style namespaces", () => {
  it("uses gz classes and keeps raw tokens separate from antd variables", () => {
    render(
      <ConfigProvider>
        <Button className="business-button">保存</Button>
        <ThemeProbe id="theme" />
      </ConfigProvider>,
    );
    const button = screen.getByRole("button");
    expect(button.classList.contains("gz-btn")).toBe(true);
    expect(button.classList.contains("gz-button")).toBe(true);
    expect(button.classList.contains("gz-button-gold-dark-gradient")).toBe(true);
    expect(button.classList.contains("business-button")).toBe(true);
    expect(readConfig("theme").prefix).toBe("gz-ant");
    expect(readConfig("theme").key).toMatch(/^gz-gold-dark-/);
    expect(getDesignTokenCssVariables({ themeMode: "gold-dark" })["--gz-font-size"])
      .toBe("14");
  });

  it("inherits a custom class prefix through nested providers", () => {
    render(
      <ConfigProvider prefixCls="business">
        <ConfigProvider themeMode="blue-light">
          <Button>保存</Button>
          <ThemeProbe id="theme" />
        </ConfigProvider>
      </ConfigProvider>,
    );
    expect(screen.getByRole("button").classList.contains("business-btn")).toBe(true);
    expect(readConfig("theme").prefix).toBe("business-ant");
  });

  it("preserves explicitly configured variable prefixes and keys", () => {
    render(
      <ConfigProvider theme={{ cssVar: { prefix: "custom", key: "custom-theme" } }}>
        <ThemeProbe id="theme" />
      </ConfigProvider>,
    );
    expect(readConfig("theme")).toEqual({ prefix: "custom", key: "custom-theme" });
  });

  it("supports a stable application scope", () => {
    render(
      <ConfigProvider cssVarScope="orderCenter">
        <ThemeProbe id="theme" />
      </ConfigProvider>,
    );
    expect(readConfig("theme")).toEqual({
      prefix: "gz-order-center",
      key: "gz-order-center-gold-dark",
    });
  });
});

// 隔离与弹层：相同主题模式的实例不能共享覆盖值，Portal 必须保留上下文。
describe("gzd theme scope", () => {
  it("isolates sibling providers even when their theme modes match", () => {
    render(
      <>
        <ConfigProvider theme={{ token: { colorPrimary: "#ff0000" } }}>
          <ThemeProbe id="first" />
        </ConfigProvider>
        <ConfigProvider theme={{ token: { colorPrimary: "#0000ff" } }}>
          <ThemeProbe id="second" />
        </ConfigProvider>
      </>,
    );
    expect(readConfig("first").key).not.toBe(readConfig("second").key);
  });

  it("uses gz classes for dropdowns rendered outside the provider DOM", () => {
    // jsdom 没有布局观察器；此用例只检查 Portal 的类名和上下文。
    vi.stubGlobal("ResizeObserver", class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
    const { container } = render(
      <ConfigProvider>
        <Select open options={[{ value: "a", label: "选项" }]} />
      </ConfigProvider>,
    );
    expect(document.querySelector(".gz-select-dropdown")).not.toBeNull();
    expect(container.querySelector(".gz-select-dropdown")).toBeNull();
  });
});
