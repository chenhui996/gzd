import { expect, test } from "@playwright/experimental-ct-react";
import IndicativePricingTestHarness from "./IndicativePricingTestHarness";

// ============================================================================
// 测试用例 1: 验证 fixedSingle 模式下，空结果的显示状态、按钮交互及表单布局
// ============================================================================
test("uses normal text color and a single dash for empty fixed-single results", async ({
  mount,
  page,
}) => {
  // 1. 挂载测试桩组件 (使用单笔合约模式)
  const component = await mount(
    <IndicativePricingTestHarness mode="fixedSingle" />,
  );

  // 2. 验证“转定价界面”按钮的可用性及点击后的控制台日志
  const navigateButton = component.getByRole("button", {
    name: "转定价界面",
  });
  await expect(navigateButton).toBeEnabled();
  
  const navigationLog = page.waitForEvent(
    "console",
    (message) => message.text() === "跳转定价页面",
  );
  await navigateButton.click();
  expect((await navigationLog).text()).toBe("跳转定价页面");

  // 3. 定位表单项，准备验证表单布局宽度 (验证设计稿 CSS 变量是否生效)
  const formItemFor = (label: string) =>
    component
      .getByText(label, { exact: true })
      .locator(
        "xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' ant-form-item ')][1]",
      );
      
  const pricingEnvironmentItem = formItemFor("定价环境");
  const carbonCurveItem = formItemFor("碳远期价格曲线");
  const discountCurveItem = formItemFor("即期无风险利率曲线");
  const valuationDateItem = formItemFor("估值日");
  
  const itemBoxes = await Promise.all(
    [
      pricingEnvironmentItem,
      carbonCurveItem,
      discountCurveItem,
      valuationDateItem,
    ].map((item) => item.boundingBox()),
  );
  const [environmentBox, carbonBox, discountBox, valuationBox] = itemBoxes;

  // 4. 断言表单项宽度是否符合预期 (当前固定为 350px) 及 Y 轴对齐情况
  expect(environmentBox?.width).toBeCloseTo(350, 0);
  expect(carbonBox?.width).toBeCloseTo(350, 0);
  expect(discountBox?.width).toBeCloseTo(350, 0);
  expect(valuationBox?.width).toBeCloseTo(350, 0);
  expect(carbonBox?.y).toBeCloseTo(environmentBox?.y ?? 0, 0);
  expect(discountBox?.y).toBeCloseTo(environmentBox?.y ?? 0, 0);
  expect(valuationBox?.y).toBeGreaterThan(environmentBox?.y ?? 0);

  // 5. 验证表单 Label 的对齐方式 (应为右对齐)
  const labelAlignment = await component
    .getByText("定价环境", { exact: true })
    .evaluate((element) => {
      const label = element.closest("label");
      if (!label) throw new Error("未找到表单项 label");
      return {
        justifyContent: getComputedStyle(label).justifyContent,
        textAlign: getComputedStyle(label).textAlign,
      };
    });
  expect(labelAlignment).toEqual({
    justifyContent: "flex-end",
    textAlign: "right",
  });

  // 6. 验证超长文本的 Label 是否被正确截断，并展示必填的星号 (*)
  const truncatedFormLabel = component.getByText("即期无风险利率曲线", {
    exact: true,
  });
  const truncatedFormLabelState = await truncatedFormLabel.evaluate((element) => {
    const label = element.closest("label");
    if (!label) throw new Error("未找到表单项 label");
    const requiredMarkStyle = getComputedStyle(label, "::before");
    return {
      textTruncated: element.scrollWidth > element.clientWidth,
      requiredMarkContent: requiredMarkStyle.content,
      requiredMarkFlexShrink: requiredMarkStyle.flexShrink,
    };
  });
  expect(truncatedFormLabelState).toEqual({
    textTruncated: true,
    requiredMarkContent: '"*"',
    requiredMarkFlexShrink: "0",
  });
  
  // 7. 模拟鼠标悬停，验证超长 Label 是否会弹出 Tooltip
  await truncatedFormLabel.hover();
  await expect(
    page.locator(".ant-tooltip").filter({
      hasText: "即期无风险利率曲线",
    }),
  ).toBeVisible();

  // 8. 验证结果表格 (AG Grid) 中的表头是否没有被截断
  const resultGrid = component.getByLabel("单笔合约定价结果");
  for (const headerText of [
    "净现值NPV（估值日）",
    "远期价格（远期到期日）",
    "支付日贴现因子",
  ]) {
    const header = resultGrid.getByText(headerText, { exact: true });
    expect(
      await header.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
  }

  // 9. 验证空数据的显示 (应显示单破折号 "-" 而不是 "--"，并且颜色与正常数据一致)
  const emptyResults = resultGrid.getByText("-", { exact: true });
  await expect(emptyResults).toHaveCount(4);
  await expect(resultGrid.getByText("--", { exact: true })).toHaveCount(0);

  const emptyResultColor = await emptyResults.first().evaluate(
    (element) => getComputedStyle(element).color,
  );
  const contractValueColor = await resultGrid
    .getByText("76.25", { exact: true })
    .evaluate((element) => getComputedStyle(element).color);
  expect(emptyResultColor).toBe(contractValueColor);
});

// ============================================================================
// 测试用例 2: 验证计算失败时的错误提示，是否作为表格的第三行正确渲染
// ============================================================================
test("renders a fixed-single calculation error as the third table row", async ({
  mount,
  page,
}) => {
  // 1. 挂载测试组件 (启用 withCalculationError 模拟计算报错)
  const component = await mount(
    <IndicativePricingTestHarness mode="fixedSingle" withCalculationError />,
  );

  // 2. 填写必填表单项，触发计算
  await component.getByRole("combobox", { name: "定价环境" }).click();
  await page.getByText("PCE-CNY（人民币定价环境）", { exact: true }).click();
  const valuationDate = component.getByLabel("估值日");
  await valuationDate.fill("2026-08-12");
  await valuationDate.press("Enter");
  await component.getByRole("button", { name: /计\s*算/ }).click();

  // 3. 验证表格区域显示了具体的失败原因，且顶部的全局错误提示被隐藏
  const resultGrid = component.getByLabel("单笔合约定价结果");
  const errorMessage = resultGrid.getByText(
    "计算失败，失败原因：Wdi_01cjanc 10_ not found",
    { exact: true },
  );
  await expect(errorMessage).toBeVisible();
  await expect(
    page.getByText("定价计算失败，请检查参数后重试", { exact: true }),
  ).toHaveCount(0);

  // 4. 验证错误信息渲染在了指定的表格行 (row-index="1" 即第二行/第三行逻辑位置)
  const errorRow = errorMessage.locator(
    "xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' ag-row ')][1]",
  );
  await expect(errorRow).toHaveAttribute("row-index", "1");

  // 5. 验证错误提示框的 UI 布局 (无边框、高度 28px、跨满整行等)
  const errorLayout = await errorMessage.evaluate((message) => {
    const alert = message.closest("[role='alert']");
    const row = message.closest(".ag-row");
    if (!alert || !row) throw new Error("错误行 DOM 结构不完整");
    const alertBox = alert.getBoundingClientRect();
    const rowBox = row.getBoundingClientRect();
    const alertStyle = getComputedStyle(alert);
    return {
      alertBorderWidth: alertStyle.borderTopWidth,
      alertHeight: alertBox.height,
      alertLeft: alertBox.left,
      hasGridCell: Boolean(message.closest(".ag-cell")),
      isFullWidthRow: row.classList.contains("ag-full-width-row"),
      rowLeft: rowBox.left,
      rowHeight: rowBox.height,
    };
  });
  expect(errorLayout).toMatchObject({
    alertBorderWidth: "0px",
    alertHeight: 28,
    hasGridCell: false,
    isFullWidthRow: true,
    rowHeight: 28,
  });
  expect(errorLayout.alertLeft - errorLayout.rowLeft).toBeLessThanOrEqual(1);
});

// ============================================================================
// 测试用例 3: 验证未填完必填项时点击计算，顶部会保留全局错误提示
// ============================================================================
test("keeps the top message for pricing context validation errors", async ({
  mount,
  page,
}) => {
  const component = await mount(
    <IndicativePricingTestHarness mode="fixedSingle" />,
  );

  // 1. 直接点击计算按钮 (未填写必填项)
  await component.getByRole("button", { name: /计\s*算/ }).click();

  // 2. 验证页面顶部弹出了错误提示
  await expect(
    page.getByText("请完成所有定价要素配置", { exact: true }),
  ).toBeVisible();
});

// ============================================================================
// 测试用例 4: 验证多笔合约 (multiple) 模式下，表格的布局、交互及缺失数据的处理
// ============================================================================
test("renders the gold-dark multiple layout with stable contract columns", async ({
  mount,
  page,
}) => {
  // 1. 挂载组件 (使用 withMissingContractData 模拟缺失部分合约数据)
  const component = await mount(
    <IndicativePricingTestHarness withMissingContractData />,
  );

  // 2. 验证基础渲染
  await expect(component.getByRole("heading", { name: "定价要素" })).toBeVisible();
  await expect(component.getByText("001", { exact: true })).toBeVisible();
  await expect(component.getByText("003", { exact: true })).toBeVisible();
  
  // 3. 验证缺失字段渲染为单破折号 "-"
  const missingContractFieldRow = component
    .getByText("远期交割价格", { exact: true })
    .locator(
      "xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' ag-row ')][1]",
    );
  await expect(missingContractFieldRow.getByText("-", { exact: true })).toHaveCount(1);
  await expect(component.getByText("--", { exact: true })).toHaveCount(0);

  // 4. 验证列宽和文本未截断状态
  const forwardPriceFieldCell = component
    .getByText("远期价格（远期到期日）", { exact: true })
    .locator(
      "xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' ag-cell ')][1]",
    );
  const forwardPriceFieldLayout = await forwardPriceFieldCell.evaluate((cell) => {
    const value = cell.querySelector<HTMLElement>(".ag-cell-value");
    if (!value) throw new Error("未找到字段列单元格内容");
    return {
      cellWidth: cell.getBoundingClientRect().width,
      textTruncated: value.scrollWidth > value.clientWidth,
    };
  });
  expect(forwardPriceFieldLayout.cellWidth).toBeCloseTo(180, 0);
  expect(forwardPriceFieldLayout.textTruncated).toBe(false);
  await expect(component.getByLabel("多笔合约定价结果")).toHaveCSS(
    "--pricing-field-column-width",
    "180px",
  );

  // 5. 验证表格行的 Hover 悬停效果 (包括固定列的样式)
  const firstFieldCell = component
    .getByText("成交编号", { exact: true })
    .locator(
      "xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' ag-cell ')][1]",
    );
  await firstFieldCell.hover();
  
  const hoveredRow = firstFieldCell.locator(
    "xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' ag-row ')][1]",
  );
  await expect(hoveredRow).toHaveClass(/ag-row-hover/);
  
  const hoverStyles = await firstFieldCell.evaluate((cell) => {
    const row = cell.closest(".ag-row");
    const pinnedCells = row?.querySelector(".ag-grid-pinned-left-cells");
    const scrollingCells = row?.querySelector(".ag-grid-scrolling-cells");
    return {
      fieldBackground: getComputedStyle(cell).backgroundColor,
      pinnedHoverBackground: pinnedCells
        ? getComputedStyle(pinnedCells, "::before").backgroundColor
        : "",
      scrollingHoverBackground: scrollingCells
        ? getComputedStyle(scrollingCells, "::before").backgroundColor
        : "",
    };
  });
  expect(hoverStyles.fieldBackground).toBe("rgba(0, 0, 0, 0)");
  expect(hoverStyles.pinnedHoverBackground).toBe(
    hoverStyles.scrollingHoverBackground,
  );
  expect(hoverStyles.pinnedHoverBackground).not.toBe("rgba(0, 0, 0, 0)");

  // 6. 验证滚动条样式是否符合定制的设计规范
  const scrollbarStyles = await component
    .locator(".ag-body-horizontal-scroll-viewport")
    .evaluate((viewport) => ({
      height: getComputedStyle(viewport, "::-webkit-scrollbar").height,
      thumbBorderWidth: getComputedStyle(
        viewport,
        "::-webkit-scrollbar-thumb",
      ).borderTopWidth,
      thumbBackgroundClip: getComputedStyle(
        viewport,
        "::-webkit-scrollbar-thumb",
      ).backgroundClip,
    }));
  expect(scrollbarStyles).toEqual({
    height: "18px",
    thumbBorderWidth: "5px",
    thumbBackgroundClip: "padding-box",
  });

  // 7. 走通完整的计算流程并断言计算结果数字展示
  const calculateButton = component.getByRole("button", { name: /计\s*算/ });
  await expect(calculateButton).toBeEnabled();
  
  await component.getByRole("combobox", { name: "定价环境" }).click();
  await page.getByText("PCE-CNY（人民币定价环境）", { exact: true }).click();
  await expect(
    component.getByTitle("CEA-FWD(全国碳配额远期曲线)"),
  ).toBeVisible();
  
  const valuationDate = component.getByLabel("估值日");
  await valuationDate.fill("2026-08-12");
  await valuationDate.press("Enter");
  
  await calculateButton.click();
  await expect(component.getByText("¥183,500.25", { exact: true })).toBeVisible();
  await expect(component.getByText("-¥12,500.50", { exact: true })).toBeVisible();
});

// ============================================================================
// 测试用例 5: 验证在选择定价环境前，价格曲线和利率曲线选择框依然可用
// ============================================================================
test("keeps both curve fields enabled before selecting a pricing environment", async ({
  mount,
  page,
}) => {
  const component = await mount(<IndicativePricingTestHarness />);
  const carbonCurve = component.getByRole("combobox", {
    name: "碳远期价格曲线",
  });
  const discountCurve = component.getByRole("combobox", {
    name: "即期无风险利率曲线",
  });

  // 1. 验证三个下拉框默认都是启用状态
  await expect(component.getByRole("combobox", { name: "定价环境" })).toBeEnabled();
  await expect(carbonCurve).toBeEnabled();
  await expect(discountCurve).toBeEnabled();

  // 2. 验证下拉选项列表的宽度及文本换行规则
  await carbonCurve.click();
  const customCarbonCurveOption = page.getByText(
    "CEA-FWD(全国碳配额远期曲线)-2026-08-12",
    { exact: true },
  );
  await expect(customCarbonCurveOption).toBeVisible();
  
  const carbonSelectRoot = carbonCurve.locator(
    "xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' ant-select ')][1]",
  );
  const carbonPopup = page.locator(".ant-select-dropdown:visible").last();
  const [carbonTriggerBox, carbonPopupBox] = await Promise.all([
    carbonSelectRoot.boundingBox(),
    carbonPopup.boundingBox(),
  ]);
  
  expect(carbonPopupBox?.width).toBeGreaterThanOrEqual(
    carbonTriggerBox?.width ?? 0,
  );
  expect(carbonPopupBox?.width).toBeLessThanOrEqual(
    (carbonTriggerBox?.width ?? 0) * 2 + 1,
  );
  
  const optionWrapping = await customCarbonCurveOption.evaluate((element) => ({
    overflow: getComputedStyle(element).overflow,
    overflowWrap: getComputedStyle(element).overflowWrap,
    textOverflow: getComputedStyle(element).textOverflow,
    whiteSpace: getComputedStyle(element).whiteSpace,
  }));
  expect(optionWrapping).toEqual({
    overflow: "visible",
    overflowWrap: "anywhere",
    textOverflow: "clip",
    whiteSpace: "normal",
  });
  
  // 3. 选择选项并验证显示
  await page
    .getByText("CEA-FWD(全国碳配额远期曲线)", { exact: true })
    .click();
  await expect(
    component.getByTitle("CEA-FWD(全国碳配额远期曲线)"),
  ).toBeVisible();

  // 4. 验证另一个曲线下拉框的选择
  await discountCurve.click();
  await expect(
    page.getByText("CNY-DR001(人民币即期无风险利率曲线)-2026-08-12", {
      exact: true,
    }),
  ).toBeVisible();
  await page.keyboard.press("Escape");

  // 5. 验证最终选择环境后，曲线的显示不被覆盖
  await component.getByRole("combobox", { name: "定价环境" }).click();
  await page.getByText("PCE-CNY（人民币定价环境）", { exact: true }).click();
  await expect(
    component.getByTitle("CEA-FWD(全国碳配额远期曲线)"),
  ).toBeVisible();
  await expect(
    component.getByTitle("CNY-DR001(人民币即期无风险利率曲线)"),
  ).toBeVisible();
});

// ============================================================================
// 测试用例 6: 验证后端返回 pricingEnvId 时，能够正确回显并选中对应的环境
// ============================================================================
test("selects an environment returned with the backend pricingEnvId field", async ({
  mount,
  page,
}) => {
  const component = await mount(
    <IndicativePricingTestHarness withBackendEnvironmentId />,
  );

  // 1. 点击选择环境
  await component.getByRole("combobox", { name: "定价环境" }).click();
  await page.getByText("PCE-CNY（人民币定价环境）", { exact: true }).click();

  // 2. 验证环境和曲线都正确带出
  await expect(
    component.getByTitle("PCE-CNY（人民币定价环境）"),
  ).toBeVisible();
  await expect(
    component.getByTitle("CEA-FWD(全国碳配额远期曲线)"),
  ).toBeVisible();
});

// ============================================================================
// 测试用例 7: 验证当合约数量超限 (如 > 1000) 时，阻止计算并提示错误
// ============================================================================
test("blocks dynamic columns when the multiple limit is exceeded", async ({ mount }) => {
  // 1. 挂载组件 (启用 overLimit 模拟超限场景)
  const component = await mount(<IndicativePricingTestHarness overLimit />);

  // 2. 验证页面出现了超限的文字提示
  await expect(component.getByText("最多支持1000笔，当前1001笔，请返回重新选择")).toBeVisible();
  
  // 3. 验证计算按钮被禁用
  await expect(component.getByRole("button", { name: /计\s*算/ })).toBeDisabled();
});
