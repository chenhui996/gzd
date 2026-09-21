---
group: 数据录入
title: Slider 滑动输入条
---

# Slider 滑动输入条

滑动型输入器，展示当前值和可选范围。

## 何时使用

- 需要在连续区间内选择数值时。
- 需要以拖拽方式选择单个值或范围值时。

## 代码演示

### 基本

最简单的滑动输入条。

```tsx
import React from 'react';
import { Slider } from 'gzd';

const App: React.FC = () => <Slider defaultValue={30} />;

export default App;
```

### 区间选择

设置 `range` 后可选择一个数值范围。

```tsx
import React from 'react';
import { Slider } from 'gzd';

const App: React.FC = () => <Slider range defaultValue={[20, 50]} />;

export default App;
```

### 带刻度

通过 `marks` 设置刻度标记。

```tsx
import React from 'react';
import { Slider } from 'gzd';

const marks = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: {
    style: {
      color: '#f5222d',
    },
    label: <strong>100°C</strong>,
  },
};

const App: React.FC = () => <Slider marks={marks} defaultValue={26} />;

export default App;
```

### 禁用

设置 `disabled` 后不可操作。

```tsx
import React from 'react';
import { Slider, Space } from 'gzd';

const App: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Slider defaultValue={30} disabled />
    <Slider range defaultValue={[20, 50]} disabled />
  </Space>
);

export default App;
```

### 垂直方向

使用 `vertical` 展示垂直滑动条。

```tsx
import React from 'react';
import { Slider, Space } from 'gzd';

const App: React.FC = () => (
  <Space style={{ height: 160 }}>
    <Slider vertical defaultValue={30} />
    <Slider vertical range defaultValue={[20, 50]} />
  </Space>
);

export default App;
```

## API

通用属性参考：[通用属性](/react/common-props)

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultValue | 设置初始取值 | number \| number[] | 0 |
| disabled | 是否禁用 | boolean | false |
| dots | 是否只能拖拽到刻度上 | boolean | false |
| included | 是否包含当前取值范围 | boolean | true |
| keyboard | 是否支持键盘操作 | boolean | true |
| marks | 刻度标记 | object | - |
| max | 最大值 | number | 100 |
| min | 最小值 | number | 0 |
| range | 是否为范围选择 | boolean \| object | false |
| reverse | 是否反向坐标轴 | boolean | false |
| step | 步长，为 `null` 时只能选择 marks 标记值 | number \| null | 1 |
| tooltip | 设置 Tooltip 相关属性 | object | - |
| value | 设置当前取值 | number \| number[] | - |
| vertical | 是否垂直方向 | boolean | false |
| onChange | 值变化时的回调 | (value) => void | - |
| onChangeComplete | 拖拽结束后的回调 | (value) => void | - |
