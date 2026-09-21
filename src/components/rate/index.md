---
group: 数据录入
title: Rate 评分
---

# Rate 评分

评分组件。

## 何时使用

- 对评价进行展示。
- 对事物进行快速的评级操作。

## 代码演示

### 基本

最简单的用法。

```tsx
import React from 'react';
import { Rate } from 'gzd';

const App: React.FC = () => <Rate />;

export default App;

```

### 尺寸

三种尺寸。

```tsx
import React from 'react';
import { Rate } from 'gzd';
import { Flex } from 'antd';

const App: React.FC = () => (
  <Flex vertical gap={16}>
    <Rate size="large" />
    <Rate />
    <Rate size="small" />
  </Flex>
);

export default App;

```

### 半星

支持选中半星。

```tsx
import React from 'react';
import { Rate } from 'gzd';

const App: React.FC = () => <Rate allowHalf defaultValue={2.5} />;

export default App;

```



### 文案展现

给评分组件加上文案展示。

```tsx
import React, { useState } from 'react';
import { Rate } from 'gzd';
import { Flex } from 'antd';
import type { RateProps } from 'antd';

const desc: RateProps['tooltips'] = [
  'terrible',
  { placement: 'top', title: 'bad', trigger: 'hover' },
  'normal',
  'good',
  'wonderful',
];

function getDescTitle(value: number, desc: RateProps['tooltips']) {
  const item = desc?.[value - 1];
  return typeof item === 'object' ? item.title : item;
}

const App: React.FC = () => {
  const [value, setValue] = useState(3);
  return (
    <Flex gap={16} vertical>
      <Rate tooltips={desc} onChange={setValue} value={value} />
      {value ? <span>{getDescTitle(value, desc) as React.ReactNode}</span> : null}
    </Flex>
  );
};

export default App;

```

### 只读

只读，无法进行鼠标交互。

```tsx
import React from 'react';
import { Rate } from 'gzd';

const App: React.FC = () => <Rate disabled defaultValue={2} />;

export default App;

```

### 清除

支持允许或者禁用清除。

```tsx
import React from 'react';
import { Rate } from 'gzd';
import { Flex } from 'antd';

const App: React.FC = () => (
  <Flex gap={16} vertical>
    <Flex gap={16}>
      <Rate defaultValue={3} />
      <span>allowClear: true</span>
    </Flex>
    <Flex gap={16}>
      <Rate defaultValue={3} allowClear={false} />
      <span>allowClear: false</span>
    </Flex>
  </Flex>
);

export default App;

```

### 其他字符

可以将星星替换为其他字符，比如字母，数字，字体图标甚至中文。

```tsx
import React from 'react';
import { HeartOutlined } from '@ant-design/icons';
import { Rate } from 'gzd';
import { Flex } from 'antd';

const App: React.FC = () => (
  <Flex vertical gap={16}>
    <Rate character={<HeartOutlined />} allowHalf />
    <Rate character="A" allowHalf style={{ fontSize: 36 }} />
    <Rate character="好" allowHalf />
  </Flex>
);

export default App;

```

### 自定义字符

可以使用 `(RateProps) => ReactNode` 的方式自定义每一个字符。

```tsx
import React from 'react';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import { Rate } from 'gzd';
import { Flex } from 'antd';

const customIcons: Record<number, React.ReactNode> = {
  1: <FrownOutlined />,
  2: <FrownOutlined />,
  3: <MehOutlined />,
  4: <SmileOutlined />,
  5: <SmileOutlined />,
};

const App: React.FC = () => (
  <Flex gap={16} vertical>
    <Rate defaultValue={2} character={({ index = 0 }) => index + 1} />
    <Rate defaultValue={3} character={({ index = 0 }) => customIcons[index + 1]} />
  </Flex>
);

export default App;

```



## API

通用属性参考：[通用属性](/react/common-props)

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| allowClear | 是否允许再次点击后清除 | boolean | true |
| allowHalf | 是否允许半选 | boolean | false |
| character | 自定义字符 | ReactNode \ | (RateProps) => ReactNode | function(): 4.4.0 |
| className | 自定义样式类名 | string | - |
| count | star 总数 | number | 5 |
| defaultValue | 默认值 | number | 0 |
| disabled | 只读，无法进行交互 | boolean | false |
| keyboard | 支持使用键盘操作 | boolean | true |
| size | 星星尺寸 | 'small' \ | 'medium' \ | 'medium' |  |
| style | 自定义样式对象 | CSSProperties | - |
| tooltips | 自定义每项的提示信息 | [TooltipProps](/components/tooltip-cn#api)[] \ | string\[] |  |
| value | 当前数，受控值 | number | - |
| onBlur | 失去焦点时的回调 | function() | - |
| onChange | 选择时的回调 | function(value: number) | - |
| onFocus | 获取焦点时的回调 | function() | - |
| onHoverChange | 鼠标经过时数值变化的回调 | function(value: number) | - |
| onKeyDown | 按键回调 | function(event) | - |

## 方法

| 名称 | 描述 |
| ------- | -------- |
| blur() | 移除焦点 |
| focus() | 获取焦点 |
