/**
 * 发布子路径的消费者契约配置。
 *
 * 新增公开子路径时，在 subpaths 中声明产物位置及需要保持稳定的导出；
 * 通用验证器会统一检查 package exports、构建文件、声明文件和运行时模块。
 */
export const packageExportsConfig = {
  packageName: "gzd",
  subpaths: [
    {
      label: "Root business component exports",
      subpath: ".",
      targets: {
        types: "./gzd-lib/index.d.ts",
        import: "./gzd-lib/index.js",
        require: "./gzd-lib/index.cjs",
      },
      declaration: {
        requiredSymbols: [
          "IndicativePricingforSelectedContracts",
          "ValuationLogDataChart",
          "FinancialData",
          "IndicativePricingDataSource",
          "ValuationLogAdapter",
        ],
      },
      runtime: {
        exportTypes: {
          IndicativePricingforSelectedContracts: "function",
          ValuationLogDataChart: "function",
        },
      },
    },
    {
      label: "gzd-table",
      subpath: "./gzd-table",
      targets: {
        types: "./gzd-lib/gzd-table/index.d.ts",
        import: "./gzd-lib/gzd-table/index.js",
        require: "./gzd-lib/gzd-table/index.cjs",
      },
      declaration: {
        reExports: [
          "ag-grid-community",
          "ag-grid-enterprise",
          "ag-grid-react",
        ],
        requiredSymbols: ["goldDarkAgGridTokens"],
        forbiddenSymbols: ["goldDarkAgChartThemes"],
      },
      runtime: {
        requiredExports: [
          "ModuleRegistry",
          "AllEnterpriseModule",
          "AgGridReact",
          "goldDarkAgGridTokens",
          "goldLightAgGridTokens",
        ],
        forbiddenExports: [
          "goldDarkAgChartThemes",
          "goldLightAgChartThemes",
        ],
      },
    },
    {
      label: "PCS business components",
      subpath: "./business-components/pcs",
      targets: {
        types: "./gzd-lib/business-components/pcs/index.d.ts",
        import: "./gzd-lib/business-components/pcs/index.js",
        require: "./gzd-lib/business-components/pcs/index.cjs",
      },
      declaration: {
        reExports: [
          "./indicative-pricing-for-selected-contracts",
          "./valuation-log-data-chart",
        ],
      },
      runtime: {
        exportTypes: {
          IndicativePricingforSelectedContracts: "function",
          ValuationLogDataChart: "function",
        },
      },
    },
  ],
};
