---
title: 交易合约试定价
group:
  title: PCS-定价管理业务组件
  order: 1
order: 1
---

# 交易合约试定价

`IndicativePricingforSelectedContracts` 为已选择远期合约提供共享定价要素配置、批量试算及逐合约结果反馈。组件提供 `fixedSingle` 与 `multiple` 两种明确布局模式。

该组件遵循“UI/业务编排与基础设施分离”：组件库负责表单、校验、资源联动、请求 DTO 映射、结果分类和展示；宿主应用通过必填 `dataSource` 传入真实请求实现。组件内部不包含请求 URL、axios 实例、鉴权或微前端运行时依赖。

## 固定单笔

<code src="./demo/fixed-single.tsx"></code>

<code src="./demo/fixed-single-error.tsx"></code>

## 多笔合约

<code src="./demo/multiple.tsx"></code>

<code src="./demo/multiple-partial-error.tsx"></code>

## 安装与导入

组件及公开类型均支持从包根入口导入。原有 `gzd/business-components/pcs` 子路径继续兼容；仓库内 Demo 的 `gzd` 是源码别名。

```tsx | pure
import {
  IndicativePricingforSelectedContracts,
  type IndicativePricingDataSource,
} from 'gzd';
import 'gzd/gzd.css';
```

组件需要位于 gzd `ConfigProvider` 和 `App` 内，以继承金色主题 Design Tokens，并通过 `App.useApp()` 获得上下文内消息实例。

## 后端请求层

消费应用的 `dataSource` 只负责复用宿主 request 实例调用真实接口，不需要转换接口数据。组件内部负责把定价环境、四类曲线目录和环境关联曲线的原始 DTO 统一转换为表单使用的稳定结构。

定价环境列表直接接收后端数组结构，读取 `pricingEnvId`（字符串或数字）并统一归一化为字符串 `id`，同时保留 `status`、`createDate`、`updateDate` 和 `isDefault`。当列表中存在 `isDefault: true` 的环境时，组件会自动填入“定价环境”选择框；没有默认环境时保持为空，等待用户手动选择。环境选中态统一展示为“环境名称（环境 code）”。文档示例的模拟接口返回一个默认环境和多个非默认环境。曲线定义分别读取 `disCurveDefId`、`comCurveDefId`，自定义曲线分别读取 `disCurveId`、`comCurveId`。曲线 Select 的候选项与选中态使用相同格式：曲线定义展示为“曲线名称（曲线 code）”，自定义曲线使用接口响应的 `executeDay` 展示为“曲线名称（曲线 code）-YYYY-MM-DD”。环境关联曲线接口直接返回数组，组件按 `curveType='3'` 提取无风险利率曲线利率曲线，按 `curveType='11'` 提取碳金融远期价格曲线；`curveClass` 不再用于判断曲线类型。

```ts | pure
import type { IndicativePricingDataSource } from 'gzd';
import { request } from '@/services/request';

export const indicativePricingDataSource: IndicativePricingDataSource = {
  listPricingEnvironments: (params, { signal } = {}) =>
    request.get('/gztech/pcs/api/v1/pricing-env', { params, signal }),
  listDiscountCurveDefinitions: (payload, { signal } = {}) =>
    request.post('/gztech/pcs/api/v1/curve-define-discount/query', payload, { signal }),
  listCustomDiscountCurves: (payload, { signal } = {}) =>
    request.post('/gztech/pcs/api/v1/curve-discount/query', payload, { signal }),
  listCarbonForwardCurveDefinitions: (payload, { signal } = {}) =>
    request.post('/gztech/pcs/api/v1/curve-define-commodity/query', payload, { signal }),
  listCustomCarbonForwardCurves: (payload, { signal } = {}) =>
    request.post('/gztech/pcs/api/v1/curve-commodity/query', payload, { signal }),
  getEnvironmentCurveSelection: (params, { signal } = {}) =>
    request.get('/gztech/pcs/api/v1/curve-brief-info', { params, signal }),
  calculate: (payload, { signal } = {}) =>
    request.post('/gztech/pcs/api/v1/price-cal', payload, { signal }),
};
```

上述五个资源方法的首个参数由组件固定传入：定价环境为 `{ status: true }`；即期利率曲线定义为 `{ type: '3', status: true }`；自定义即期利率曲线为 `{ type: '3', isCustom: true }`；碳金融远期价格曲线定义为 `{ type: '11', status: true }`；自定义碳金融远期价格曲线为 `{ type: '11', isCustom: true }`。计算请求中的 `astType` 同样由组件固定为 `''`。

宿主仍保有 URL、网关、token、错误码处理、监控及环境切换能力；与组件展示和计算请求有关的 DTO 字段转换集中维护在组件内部，避免不同消费应用重复实现。

### 计算接口 DTO

组件通过 `contractData` 接收接口字段结构的合约数组。组件级 `productType` 用于查询环境关联曲线，不从合约数据推导；用户在定价要素表单中选择的估值日和曲线 ID 会作为共享字段合并到每条合约，形成 `PriceCalRequest`。`dataSource.calculate` 返回 `Promise<PriceCalResponse>`。

```ts | pure
interface contractItem {
  astType: '';
  targtAllVarCodeSum: string;
  scrtyCode: string;
  currency: string;
  fwdMaturityDate: string;
  settleDate: string;
  physicalDelivery: '1' | '2';
  direction: 'S' | 'L';
  fwdDlvPrice: string;
  targtVol: string;
  instrumentId?: string;
  instrumentCode?: string;
  instrumentName?: string;
  tradeContpId?: string;
  productType?: string;
}

type contractData = contractItem[];

interface PriceCalRequestItem extends contractItem {
  valDate: string;
  disCurveDefId: string;
  disCurveId: string;
  comCurveDefId: string;
  comCurveId: string;
}

type PriceCalRequest = PriceCalRequestItem[];

interface PriceCalResponseItem {
  priceCalDataId?: string;
  priceCalId?: string;
  tradeId?: string;
  astType?: string;
  productType?: string;
  maturityTime?: string;
  npv?: string;
  discountFactor?: string;
  forwardPrice?: string;
  code?: string | number;
  msg?: string;
  [property: string]: unknown;
}

type PriceCalResponse = PriceCalResponseItem[];
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `mode` | 明确布局模式，不根据合约数量推断 | `'fixedSingle' \| 'multiple'` | `'multiple'` |
| `productType` | 查询环境关联曲线时使用的产品类型 | `string` | - |
| `contractData` | 实例挂载时固化的合约数据 | `contractData` | - |
| `dataSource` | 宿主提供的后端能力端口 | `IndicativePricingDataSource` | - |
| `initialContext` | 首次挂载时使用的定价上下文，可用于预填定价要素 | `Partial<IndicativePricingContextValues>` | - |
| `autoCalculate` | 初始定价上下文完整且资源加载完成后，自动执行一次计算 | `boolean` | `false` |
| `onNavigateToPricingPage` | 单笔模式下点击“转定价界面”时调用的宿主方法；未传入时按钮禁用 | `() => void` | - |
| `className` | 根容器类名 | `string` | - |
| `style` | 根容器样式 | `React.CSSProperties` | - |

## 关键行为

- `multiple` 最多支持 1000 笔；超限时不创建动态列，也不发起计算。
- 四项定价要素错误一次性全部展示；配置不完整时整批阻断。
- 资源请求分别记录最多 3 次尝试，失败资源可独立重试，成功资源不重复加载。
- 未传 `initialContext` 时，组件会自动选择定价环境列表中唯一的 `isDefault: true` 项；接口未返回默认环境时保持为空。显式传入的初始定价环境优先于接口默认项。
- 碳金融远期价格曲线和无风险利率曲线利率曲线目录独立加载；未选择定价环境时两个曲线下拉保持可用，可由用户手工选择。
- 曲线目录和环境关联曲线的原始接口响应由组件内部归一化，`dataSource` 无需构造 `kind`、`source`、`key` 或 `requestMapping`。
- 环境切换立即清空曲线和旧结果，再查询并回填环境关联曲线；关联查询按环境与产品类型做实例内缓存，并忽略过期响应。
- 一次计算只调用一次 `dataSource.calculate`，响应严格按请求索引匹配；缺失项转为逐合约错误，多余项忽略并警告。
- NPV、远期价格、贴现因子分别固定为 2、8、4 位；精度处理使用 `big.js`，负值使用 Design Token。
- `Reset` 清空定价上下文、校验和计算结果，但保留已加载目录和外部合约快照。
- `fixedSingle` 模式通过 `onNavigateToPricingPage` 将页面跳转交给宿主应用处理，组件内部不绑定路由或微前端运行时。

## 主题

设计稿基于金色暗色主题。组件颜色、边框、圆角、间距和字号主要读取 `--gzd-*` Design Token；不要在消费应用覆写内部 AG Grid 结构类，主题调整应通过 gzd `ConfigProvider` 或 Design Token 完成。
