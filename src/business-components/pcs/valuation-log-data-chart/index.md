---
title: 估值日志数据图表
group:
  title: PCS-定价管理业务组件
  order: 1
order: 2
---

# 估值日志数据图表

`ValuationLogDataChart` 展示近 30 日估值日志的完整日期、价格和 NPV 数据，并提供价格/NPV 折线图切换。组件负责请求状态和数据展示，真实接口由宿主通过 Adapter 注入。

## 何时使用

- 需要同时查看估值日志明细与日期趋势时。
- 业务应用需要保留自身请求实例、鉴权和错误码处理时。

## 代码演示

<code src="./demo/basic.tsx"></code>

<code src="./demo/empty.tsx"></code>

<code src="./demo/abnormal.tsx"></code>

<code src="./demo/value-ranges.tsx"></code>

折线图的符号基准线、纵轴范围、金额格式和主题 Token 设计详见：[折线图功能说明](/business-components/valuation-log-data-chart-line-chart-guide)。

## 安装与导入

组件及公开类型均支持从包根入口导入。原有 `gzd/business-components/pcs` 子路径继续兼容；仓库内 Demo 的 `gzd` 是源码别名。

```tsx | pure
import {
  ValuationLogDataChart,
  type ValuationLogAdapter,
} from 'gzd';
import 'gzd/gzd.css';
```

组件应位于 gzd `ConfigProvider` 和 `App` 内，以继承 Design Tokens，并通过 `App.useApp()` 展示请求失败 Toast。

```tsx | pure
<ValuationLogDataChart
  adapter={valuationLogAdapter}
  allVarCodeSnum="340480468745060362"
/>
```

## Adapter

Adapter 在宿主应用中复用已有请求实例。组件接收接口原始 `FinancialData[]`，并在内部转换为稳定的 `ValuationLogItem`：

```tsx | pure
import type {
  FinancialData,
  ValuationLogAdapter,
} from 'gzd';
import { request } from '@/services/request';

export const valuationLogAdapter: ValuationLogAdapter = {
  getValuationLogs: (params, { signal } = {}) =>
    request.get<FinancialData[]>(
      '/gztech/pcs/api/v1/ast-sob-ast-detl',
      { params, signal },
    ).then(({ data }) => data),
};
```

该接口使用 GET 请求。组件初始化时将 `allVarCodeSnum` 属性、格式为 `YYYYMMDD` 的 T-1 日（前一日）日期以及固定字符串 `'30'` 组合为 `{ allVarCodeSnum, endTime, size }`，再调用 Adapter。Adapter 只负责使用宿主请求实例发送请求。

组件把响应中的 `busnsDate / valtnPrice / mval / tradeCrrc` 分别映射为领域数据的 `date / price / npv / currency`，其中 `busnsDate` 从 `YYYYMMDD` 格式化为 `YYYY-MM-DD`。

组件挂载或 `adapter`、`allVarCodeSnum` 变化时调用一次 `getValuationLogs`。初始化期间展示 Loading；查询超时或其他非中止错误通过 Toast 提示“数据加载失败，请稍后重试”；卸载或查询条件变化会中止旧请求。

## API

### ValuationLogDataChart

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `adapter` | 获取近 30 日估值日志的宿主 Adapter | `ValuationLogAdapter` | - |
| `allVarCodeSnum` | 合约全品种代码序号；作为查询接口的同名参数 | `string` | - |
| `className` | 根容器类名 | `string` | - |
| `style` | 根容器样式 | `React.CSSProperties` | - |

### ValuationLogAdapter

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| `getValuationLogs` | 使用组件生成的查询参数获取近 30 日数据并返回接口原始数据；应透传可选 `AbortSignal` | `(params: ValuationLogRequestParams, context?: { signal?: AbortSignal }) => Promise<readonly FinancialData[]>` |

### ValuationLogRequestParams

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `allVarCodeSnum` | 合约全品种代码序号 | `string` |
| `endTime` | 查询截止日期，取 T-1 日并格式化为 `YYYYMMDD` | `string` |
| `size` | 查询条数 | `'30'` |

### FinancialData

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `allVarCodeSnum` | 合约全品种代码序号 | `string` |
| `busnsDate` | 业务日期 | `string` |
| `valtnPrice` | 价格；接口无值时可为空 | `string \| null \| undefined` |
| `mval` | NPV；接口无值时可为空 | `string \| null \| undefined` |
| `tradeCrrc` | 币种 | `string` |

### ValuationLogItem

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `date` | 估值日期，推荐 `YYYY-MM-DD` | `string` |
| `price` | 价格；字符串可避免接口大数在 Adapter 层损失精度 | `string \| number \| null \| undefined` |
| `npv` | NPV；字符串可避免接口大数在 Adapter 层损失精度 | `string \| number \| null \| undefined` |
| `currency` | 接口返回的 ISO 4217 币种代码 | `string \| undefined` |

## 展示规则

- 表格固定 32px 表头和 28px 行高，不分页，数据超过可视区时纵向滚动；价格或 NPV 为负数时使用错误色展示。
- 接口返回空数组时，表格和图表区域均显示“暂无数据”。
- 表格按日期倒序展示；折线图按日期正序展示，默认显示价格。数据超过 10 条时默认展示最新 10 条，可通过底部滚动条左右浏览其余日期；横轴日期保持 `YY-MM-DD` 格式并倾斜展示。
- 金额按接口首条数据的 `tradeCrrc` 映射币种符号并统一展示两位小数，无数据时币种回退为 `CNY`；格式化区域固定为 `zh-CN`。响应数组非空时，单个日期的价格或 NPV 为空会在图表中按 `0` 绘制，表格中仍显示 `-`；非空但无法转换为有限数值的点会断开。
- 价格和 NPV 的纵轴分别根据当前指标的最终绘图值计算，按数据跨度的 `5%` 在上下两端对称留白：数据全部为正数时下限不小于 `0`，有正有负时 `0` 位于纵轴范围内，数据全部为负数时上限不大于 `0`。正负等值数据按数值绝对值的 `5%` 留白，全零数据使用 `0～1` 的可视范围。
- 符号基准线在全正数据时位于绘图区底部、全负数据时位于顶部、跨零数据时吸附 `0`；纵轴最大、最小端点及 `0` 不重复绘制虚线。
- 表格和图表固定按 1:1 横向双栏排列；宿主应为组件预留足够的横向展示空间。
- 组件根节点背景透明，标题使用次级文字色；面板背景、文字、边框、圆角、间距、折线和网格颜色均读取 gzd Design Tokens。

通用属性参考：[通用属性](/react/common-props)。
