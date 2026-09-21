import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    dts({
      include: ["src"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/**/*.stories.tsx",
        "src/**/demo/**",
        "tests/**",
      ],
      tsconfigPath: "./tsconfig.app.json",
      entryRoot: "src",
      outDir: "gzd-lib",
      rollupTypes: false,
    }),
  ],
  build: {
    // public/ 仅供 Dumi 文档站使用，不复制到组件库发布产物。
    copyPublicDir: false,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "gzd-table/index": resolve(__dirname, "src/gzd-table/index.ts"),
        "business-components/pcs/index": resolve(
          __dirname,
          "src/business-components/pcs/index.ts",
        ),
        "styles/index": resolve(__dirname, "src/styles/index.less"),
      },
      formats: ["es", "cjs"],
      cssFileName: "gzd",
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        "react",
        "react-dom",
        "antd",
        "ag-grid-react",
        "ag-grid-community",
        "ag-grid-enterprise",
        "big.js",
        /^echarts(?:\/.*)?$/,
        "react/jsx-runtime",
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          antd: "antd",
        },
      },
    },
    outDir: "gzd-lib",
  },
});
