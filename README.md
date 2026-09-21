# gzd 组件库

基于 Ant Design v6 和 AG Grid 36 的 React 组件库，统一组件样式、主题和业务组件。

包名、仓库内部导入与文档示例统一使用 `gzd`。主入口为 `gzd`，样式入口为
`gzd/gzd.css`，AG Grid 扩展入口为 `gzd/gzd-table`，PCS 业务组件入口为
`gzd/business-components/pcs`。

整体更名后，有品牌前缀的类型统一使用 `GZD`（如 `GZDThemeMode`），自有 CSS
变量和类名使用 `gz-` 前缀。已有业务项目需要同步调整导入、类型和自定义样式，
并重新选择文档站主题；组件的 `Button`、`Table` 等名称及常规 Props 保持不变。

与 antd 区分包名和样式前缀的方式一致，`ConfigProvider` 默认使用 `prefixCls="gz"`。
自有变量为 `--gz-*`，antd 计算后变量为 `--gz-ant-*`，避免无单位数值与带单位
尺寸互相覆盖。图标 `anticon` 和 AG Grid 的 `ag-*` 前缀不变。

## 安装

要求项目使用 React `^19.2.5`、ReactDOM `^19.2.5` 和 Ant Design `^6.5.1`。

普通组件项目安装主包：

```shell
npm install gzd
```

项目使用 `Table` 或 `gzd/gzd-table` 时，还要安装表格相关的 peer dependencies：

```shell
npm install ag-grid-community@36.0.1 ag-grid-enterprise@36.0.1 ag-grid-react@36.0.1
```

## 使用

### 1. 根组件包裹（main.tsx）

```ts
import 'gzd/gzd.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, type GZDThemeMode } from 'gzd';
import { router } from '@/router';

const themeMode: GZDThemeMode = 'gold-dark';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider themeMode={themeMode}>
    <RouterProvider router={router} />
  </ConfigProvider>,
);
```


### 2. 组件使用

- 以 Button 组件为例

```ts
import { Button } from 'gzd';

const App = () => {
  return (
    <div>
      <Button>默认按钮</Button>
    </div>
  );
};
```

### 3. Table 和 AG Grid API

`Table` 从主包导入；AG Grid 类型、底层 API 和 gzd 生成的 Grid Token 从 `gzd-table` 子入口导入：

```tsx
import { Table } from 'gzd';
import {
  goldDarkAgGridTokens,
  type ColDef,
} from 'gzd/gzd-table';
```

`Table` 在 Gold 主题下会自动使用对应的 AG Grid Token。详见 [Table 文档](./src/components/table/index.md) 和 [AG Grid Token 文档](./docs/tokens/ag-grid-table.md)。

项目图表技术栈统一使用 ECharts，不单独维护图表 Token。图表颜色、文字和背景直接通过 `getDesignTokens({ themeMode }).globalToken` 获取，完整示例见 [全局 Tokens](./docs/tokens.md)。

## 导入 UI Design Tokens

在仓库根目录执行，一次完成 UI 交付包导入与 Token、文档生成：

```shell
npm run tokens:import -- "/path/to/UI 交付包目录"
```

这是日常导入的唯一入口，已包含 Token 转换和文档生成，无需再执行其他生成命令。

自动导入交付目录中 `gold-theme/`、`blue-theme/` 下的所有主题及明暗模式，统一生成一次；追加 `--dry-run` 可只预览。没有主题标识的单主题旧包需用 `--theme gold` 或 `--theme blue` 指明归属。交付包结构、失败恢复及验证说明见 [Design Tokens 源文件维护指南](./gzd-design-tokens-origin/README.md)。
