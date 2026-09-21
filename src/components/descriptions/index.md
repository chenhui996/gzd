---
group: 数据展示
title: Descriptions 描述列表
---

# Descriptions 描述列表

成组展示多个只读字段。

## 何时使用

- 需要展示详情页、审核信息、基础资料等只读字段。
- 需要将字段按列、边框或垂直布局组织展示。

## 代码演示

### 基本

通过 `items` 配置描述项。

```tsx
import React from 'react';
import { Descriptions } from 'gzd';

const App: React.FC = () => (
  <Descriptions
    title="用户信息"
    items={[
      {
        key: 'name',
        label: '姓名',
        children: '张三',
      },
      {
        key: 'phone',
        label: '手机号',
        children: '13800000000',
      },
      {
        key: 'address',
        label: '地址',
        children: '浙江省杭州市西湖区',
      },
    ]}
  />
);

export default App;
```

### 带边框

设置 `bordered` 展示更明确的字段边界。

```tsx
import React from 'react';
import { Descriptions } from 'gzd';

const App: React.FC = () => (
  <Descriptions
    bordered
    title="订单信息"
    items={[
      {
        key: 'orderNo',
        label: '订单号',
        children: 'GZ202607010001',
      },
      {
        key: 'status',
        label: '状态',
        children: '已完成',
      },
      {
        key: 'amount',
        label: '金额',
        children: '¥ 1,280.00',
      },
      {
        key: 'remark',
        label: '备注',
        span: 3,
        children: '客户要求工作日配送。',
      },
    ]}
  />
);

export default App;
```

### 垂直布局

设置 `layout="vertical"` 后，标签与内容上下排列。

```tsx
import React from 'react';
import { Descriptions } from 'gzd';

const App: React.FC = () => (
  <Descriptions
    title="项目信息"
    layout="vertical"
    column={2}
    items={[
      {
        key: 'project',
        label: '项目名称',
        children: '组件库建设',
      },
      {
        key: 'owner',
        label: '负责人',
        children: '产品研发部',
      },
      {
        key: 'cycle',
        label: '周期',
        children: '2026-07-01 至 2026-07-31',
      },
      {
        key: 'priority',
        label: '优先级',
        children: '高',
      },
    ]}
  />
);

export default App;
```

### 使用子组件

也可以通过 `Descriptions.Item` 声明描述项。

```tsx
import React from 'react';
import { Descriptions } from 'gzd';

const App: React.FC = () => (
  <Descriptions title="服务信息" bordered>
    <Descriptions.Item label="服务名称">数据同步</Descriptions.Item>
    <Descriptions.Item label="运行状态">运行中</Descriptions.Item>
    <Descriptions.Item label="最近执行">2026-07-01 10:30:00</Descriptions.Item>
  </Descriptions>
);

export default App;
```

## API

通用属性参考：[通用属性](/react/common-props)

### Descriptions

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| bordered | 是否展示边框 | boolean | false |
| className | 自定义样式类名 | string | - |
| colon | 是否显示冒号 | boolean | true |
| column | 一行的描述项数量 | number \| Record<Breakpoint, number> | 3 |
| extra | 右上角扩展内容 | ReactNode | - |
| items | 描述项配置 | DescriptionsItemType[] | - |
| layout | 描述布局 | `horizontal` \| `vertical` | `horizontal` |
| size | 设置列表尺寸 | `large` \| `medium` \| `small` | `large` |
| style | 自定义样式对象 | CSSProperties | - |
| title | 描述列表标题 | ReactNode | - |

### Descriptions.Item

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 内容标签 | ReactNode | - |
| span | 包含列的数量 | number \| `filled` \| Record<Breakpoint, number> | 1 |
| children | 描述内容 | ReactNode | - |
