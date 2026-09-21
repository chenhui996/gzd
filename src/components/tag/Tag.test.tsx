import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ConfigProvider from "../config-provider";
import Tag from "./Tag";

afterEach(cleanup);

const renderGoldDarkTag = (props: React.ComponentProps<typeof Tag>) =>
  render(
    <ConfigProvider themeMode="gold-dark">
      <Tag data-testid="tag" {...props}>
        Tag
      </Tag>
    </ConfigProvider>,
  );

const renderGoldLightTag = (props: React.ComponentProps<typeof Tag>) =>
  render(
    <ConfigProvider themeMode="gold-light">
      <Tag data-testid="tag" {...props}>
        Tag
      </Tag>
    </ConfigProvider>,
  );

describe("Tag gold-dark styles", () => {
  it("uses the Guotai gold palette", () => {
    renderGoldDarkTag({ color: "gold", variant: "outlined" });

    const tag = screen.getByTestId("tag");
    expect(tag.style.color).toBe("rgb(230, 173, 107)");
    expect(tag.style.backgroundColor).toBe("rgb(42, 27, 15)");
    expect(tag.style.borderColor).toBe("rgb(90, 58, 29)");
  });

  it("uses the galaxy blue palette for geekblue", () => {
    renderGoldDarkTag({ color: "geekblue", variant: "solid" });

    const tag = screen.getByTestId("tag");
    expect(tag.style.color).toBe("rgb(255, 255, 255)");
    expect(tag.style.backgroundColor).toBe("rgb(53, 101, 204)");
    expect(tag.style.borderColor).toBe("rgb(53, 101, 204)");
  });

  it("uses the Figma-specific lime outlined border", () => {
    renderGoldDarkTag({ color: "lime", variant: "outlined" });

    expect(screen.getByTestId("tag").style.borderColor).toBe(
      "rgb(83, 109, 19)",
    );
  });

  it("styles primary and default solid tags with on-light text", () => {
    const { rerender } = renderGoldDarkTag({
      closeIcon: true,
      color: "primary",
      variant: "solid",
    });

    let tag = screen.getByTestId("tag");
    expect(tag.style.color).toBe("rgb(118, 56, 0)");
    expect(tag.style.backgroundColor).toBe("rgb(255, 231, 203)");
    expect(tag.querySelector(".ant-tag-close-icon")).toHaveProperty(
      "style.color",
      "rgb(118, 56, 0)",
    );

    rerender(
      <ConfigProvider themeMode="gold-dark">
        <Tag data-testid="tag" color="default" variant="solid">
          Tag
        </Tag>
      </ConfigProvider>,
    );

    tag = screen.getByTestId("tag");
    expect(tag.style.color).toBe("rgb(118, 56, 0)");
    expect(tag.style.backgroundColor).toBe("rgba(255, 255, 255, 0.95)");
  });

  it("keeps instance styles at the highest priority", () => {
    renderGoldDarkTag({
      color: "gold",
      style: { backgroundColor: "hotpink" },
      variant: "filled",
    });

    expect(screen.getByTestId("tag").style.backgroundColor).toBe("hotpink");
  });
});

describe("Tag gold-light styles", () => {
  it("uses the Figma primary palette", () => {
    renderGoldLightTag({
      closeIcon: true,
      color: "primary",
      variant: "outlined",
    });

    const tag = screen.getByTestId("tag");
    expect(tag.style.color).toBe("rgb(255, 255, 255)");
    expect(tag.style.backgroundColor).toBe("rgb(0, 131, 255)");
    expect(tag.style.borderColor).toBe("transparent");
    expect(tag.querySelector(".ant-tag-close-icon")).toHaveProperty(
      "style.color",
      "rgb(255, 255, 255)",
    );
  });

  it("keeps instance styles at the highest priority", () => {
    renderGoldLightTag({
      color: "primary",
      style: { backgroundColor: "hotpink" },
    });

    expect(screen.getByTestId("tag").style.backgroundColor).toBe("hotpink");
  });
});
