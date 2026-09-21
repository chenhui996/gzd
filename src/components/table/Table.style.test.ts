/// <reference types="node" />

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const tableStyles = readFileSync(
  resolve(process.cwd(), "src/components/table/style.less"),
  "utf8",
);
const tableDemoStyles = readFileSync(
  resolve(process.cwd(), "src/components/table/demo/style.less"),
  "utf8",
);

// 这是一个极其特殊的“契约测试”（Contract Test）。
// 因为我们深度定制了 AG Grid 的样式，而 AG Grid 的 DOM 结构和内部类名对我们来说是“黑盒”。
// 如果未来升级 AG Grid 版本（例如 36 升 37），官方悄悄改了这些内部类名，我们的样式就会全部失效。
// 所以，这里直接读取 `.less` 源码文本，用正则/字符串匹配强行检查关键的“内部类名覆盖”是否还在。
// 一旦不小心删掉或升级导致类名变化，测试会立即报警，防止发生“样式雪崩”。
describe("Table style maintenance contract", () => {
  it("documents the AG Grid internal style compatibility boundary", () => {
    // 确保我们在注释里标明了这是针对哪个版本的兼容（当前是 36.0.1）
    expect(tableStyles).toContain("AG Grid 36.0.1");
    // 确保我们依然保留了对未公开内部变量（以 --ag-internal- 开头）的覆盖
    expect(tableStyles).toContain("--ag-internal-");
  });

  it("does not contain obsolete or theme-incompatible scrollbar values", () => {
    // 防止混入过时或写死的滚动条颜色，必须严格使用主题 Token
    expect(tableStyles).not.toContain("--gz-table-scrollbar-width");
    expect(tableStyles).not.toContain("#333");
    expect(tableStyles).toContain(
      "--gz-table-scrollbar-background-color: var(--gz-color-border)",
    );
  });

  it("uses generated AG Grid variables for visual overrides", () => {
    // 确保我们在覆盖视觉样式时，使用的是 AG Grid 生成的标准变量
    expect(tableStyles).toContain("var(--ag-range-selection-border-color)");
    expect(tableStyles).toContain(
      "var(--ag-range-selection-background-color)",
    );
  });

  it("defines token-aligned scrollbar styles for the light demo", () => {
    // 确保亮色模式 Demo 里的滚动条透明度符合设计规范
    expect(tableDemoStyles).toContain(
      ".gz-table-demo-scrollbar-scope .gz-table-gold-light",
    );
    expect(tableDemoStyles).toContain("rgba(0, 0, 0, 0.18)");
    expect(tableDemoStyles).toContain("rgba(0, 0, 0, 0.25)");
  });

  it("keeps row separators on AG Grid scrolling and pinned cell containers", () => {
    // 核心契约防御：确保我们仍然覆盖了这些深层的 DOM 容器类名
    // 这些类名控制着滚动区和固定列的边框，非常容易在 AG Grid 升级时发生改变
    expect(tableStyles).toContain(".ag-grid-scrolling-cells");
    expect(tableStyles).toContain(".ag-grid-pinned-left-cells");
    expect(tableStyles).toContain(".ag-grid-pinned-right-cells");
    expect(tableStyles).toContain("border-bottom: var(--ag-row-border)");
    expect(tableStyles).toContain(
      "border-bottom-color: var(--ag-border-color)",
    );
  });

  it("keeps component-owned styles semantic and scoped", () => {
    expect(tableStyles).toContain(".gz-table-no-rows-overlay");
    expect(tableStyles).toContain(".gz-table-default-pagination-layout");
  });

  it("rounds only the data area bottom corners when pagination is enabled", () => {
    const paginationStyles = tableStyles.slice(
      tableStyles.indexOf(".gz-table-pagination"),
      tableStyles.indexOf(".gz-table-default-pagination-layout"),
    );

    expect(paginationStyles).toContain(".ag-root-wrapper-body");
    expect(paginationStyles).toContain("overflow: hidden");
    expect(paginationStyles).toContain("border-end-start-radius");
    expect(paginationStyles).toContain("border-end-end-radius");
  });

  it("scopes grouped header refinements to group-specific elements", () => {
    expect(tableStyles).toContain(".ag-header-row-group");
    expect(tableStyles).toContain(".ag-header-group-cell::before");
    expect(tableStyles).toContain(".ag-header-group-cell-label");
    expect(tableStyles).toContain(
      ".ag-header-row-group .ag-header-cell::before",
    );
    expect(tableStyles).toContain(
      ".ag-header-row-column.ag-header-row-not-first .ag-header-cell::before",
    );
  });
});
