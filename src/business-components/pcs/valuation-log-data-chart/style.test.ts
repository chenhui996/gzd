/// <reference types="node" />

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(
    process.cwd(),
    "src/business-components/pcs/valuation-log-data-chart/style.module.less",
  ),
  "utf8",
);

const getRule = (selector: string) => {
  const match = styles.match(new RegExp(`\\.${selector}\\s*\\{([\\s\\S]*?)\\}`));
  return match?.[1] ?? "";
};

describe("ValuationLogDataChart style contract", () => {
  it("keeps the table and chart in an equal-width horizontal layout", () => {
    expect(getRule("content")).toContain(
      "grid-template-columns: repeat(2, minmax(0, 1fr));",
    );
  });

  it("keeps the root transparent and uses the secondary title color", () => {
    expect(getRule("root")).toContain("background: transparent;");
    expect(getRule("title")).toContain(
      "color: var(--gzd-color-text-secondary);",
    );
  });

  it("uses the error token for negative table values", () => {
    expect(getRule("negativeValue")).toContain(
      "color: var(--gzd-red-6, var(--gzd-color-error));",
    );
  });

  it("uses an auto-hiding chart scrollbar without Windows arrow buttons", () => {
    expect(styles).toContain("overflow-x: auto;");
    expect(styles).toContain("scrollbar-color: transparent transparent;");
    expect(styles).toContain('&::-webkit-scrollbar-button {');
    expect(styles).toContain('&[data-scrolling="true"]::-webkit-scrollbar-thumb');
  });
});
