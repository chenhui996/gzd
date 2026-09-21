---
group: 数据展示
title: Segmented 分段控制器
---

# Segmented 分段控制器

## 何时使用 {#when-to-use}

- 用于展示多个选项并允许用户选择其中单个选项；
- 当切换选中选项时，关联区域的内容会发生变化。

## 代码演示

### 基本

最简单的用法。

```tsx
import React from 'react';
import { Segmented } from 'gzd';

const Demo: React.FC = () => (
  <Segmented<string>
    options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']}
    onChange={(value) => {
      console.log(value); // string
    }}
  />
);

export default Demo;
```

### 垂直方向

垂直方向。

```tsx
import React from 'react';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Segmented } from 'gzd';

const Demo: React.FC = () => (
  <Segmented
    orientation="vertical"
    options={[
      { value: 'List', icon: <BarsOutlined /> },
      { value: 'Kanban', icon: <AppstoreOutlined /> },
    ]}
  />
);

export default Demo;
```

### Block 分段选择器

`block` 属性使其适合父元素宽度。

```tsx
import React from 'react';
import { Segmented } from 'gzd';

const Demo: React.FC = () => (
  <Segmented<string | number> options={[123, 456, 'longtext-longtext-longtext-longtext']} block />
);

export default Demo;
```

### 胶囊形状

胶囊型的 Segmented。

```tsx
import React, { useState } from 'react';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import { Segmented } from 'gzd';
import type { SegmentedProps } from 'antd';

type SizeType = NonNullable<SegmentedProps['size']>;

const Demo: React.FC = () => {
  const [size, setSize] = useState<SizeType>('medium');
  return (
    <Flex gap="small" align="flex-start" vertical>
      <Segmented<SizeType> options={['small', 'medium', 'large']} value={size} onChange={setSize} />
      <Segmented
        size={size}
        shape="round"
        options={[
          { value: 'light', icon: <SunOutlined /> },
          { value: 'dark', icon: <MoonOutlined /> },
        ]}
      />
    </Flex>
  );
};

export default Demo;
```

### 不可用

Segmented 不可用。

```tsx
import React from 'react';
import { Flex } from 'antd';
import { Segmented } from 'gzd';

const App: React.FC = () => (
  <Flex gap="small" align="flex-start" vertical>
    <Segmented options={['Map', 'Transit', 'Satellite']} disabled />
    <Segmented
      options={[
        'Daily',
        { label: 'Weekly', value: 'Weekly', disabled: true },
        'Monthly',
        { label: 'Quarterly', value: 'Quarterly', disabled: true },
        'Yearly',
      ]}
    />
  </Flex>
);

export default App;
```

### 受控模式

受控的 Segmented。

```tsx
import React, { useState } from 'react';
import { Segmented } from 'gzd';

const Demo: React.FC = () => {
  const [value, setValue] = useState<string>('Map');
  return (
    <Segmented<string>
      options={['Map', 'Transit', 'Satellite']}
      value={value}
      onChange={setValue}
    />
  );
};

export default Demo;
```

### 自定义渲染

自定义渲染每一个 Segmented Item。

```tsx
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import { Avatar, Segmented } from 'gzd';

const App: React.FC = () => (
  <Flex gap="small" align="flex-start" vertical>
    <Segmented
      options={[
        {
          label: (
            <div style={{ padding: 4 }}>
              <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" alt="User 1" />
              <div>User 1</div>
            </div>
          ),
          value: 'user1',
          tooltip: { title: 'hello user1', color: 'gold' },
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <Avatar style={{ backgroundColor: '#f56a00' }} alt="User 2">
                K
              </Avatar>
              <div>User 2</div>
            </div>
          ),
          value: 'user2',
          tooltip: { title: 'hello user2', color: 'pink' },
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} alt="User 3" />
              <div>User 3</div>
            </div>
          ),
          value: 'user3',
          tooltip: { title: 'hello user3', color: 'geekblue' },
        },
      ]}
    />
    <Segmented
      options={[
        {
          label: (
            <div style={{ padding: 4 }}>
              <div>Spring</div>
              <div>Jan-Mar</div>
            </div>
          ),
          value: 'spring',
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <div>Summer</div>
              <div>Apr-Jun</div>
            </div>
          ),
          value: 'summer',
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <div>Autumn</div>
              <div>Jul-Sept</div>
            </div>
          ),
          value: 'autumn',
        },
        {
          label: (
            <div style={{ padding: 4 }}>
              <div>Winter</div>
              <div>Oct-Dec</div>
            </div>
          ),
          value: 'winter',
        },
      ]}
    />
  </Flex>
);

export default App;
```

### 动态数据

动态加载数据。

```tsx
import React, { useState } from 'react';
import { Flex } from 'antd';
import { Button, Segmented } from 'gzd';

const Demo: React.FC = () => {
  const [options, setOptions] = useState(['Daily', 'Weekly', 'Monthly']);
  const [moreLoaded, setMoreLoaded] = useState(false);

  const handleLoadOptions = () => {
    setOptions((prev) => [...prev, 'Quarterly', 'Yearly']);
    setMoreLoaded(true);
  };

  return (
    <Flex gap="small" align="flex-start" vertical>
      <Segmented options={options} />
      <Button type="primary" disabled={moreLoaded} onClick={handleLoadOptions}>
        Load more options
      </Button>
    </Flex>
  );
};

export default Demo;
```

### 三种大小

我们为 `<Segmented />` 组件定义了三种尺寸（大、中、小），高度分别为 `40px`、`32px` 和 `24px`。

```tsx
import React from 'react';
import { Flex } from 'antd';
import { Segmented } from 'gzd';

const App: React.FC = () => (
  <Flex gap="small" align="flex-start" vertical>
    <Segmented size="large" options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} />
    <Segmented options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} />
    <Segmented size="small" options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} />
  </Flex>
);

export default App;
```

### 设置图标

给 Segmented Item 设置 Icon。

```tsx
import React from 'react';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Segmented } from 'gzd';

const Demo: React.FC = () => (
  <Segmented
    options={[
      { label: 'List', value: 'List', icon: <BarsOutlined /> },
      { label: 'Kanban', value: 'Kanban', icon: <AppstoreOutlined /> },
    ]}
  />
);

export default Demo;
```

### 只设置图标

在 Segmented Item 选项中只设置 Icon。

```tsx
import React from 'react';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Segmented } from 'gzd';

const Demo: React.FC = () => (
  <Segmented
    options={[
      { value: 'List', icon: <BarsOutlined /> },
      { value: 'Kanban', icon: <AppstoreOutlined /> },
    ]}
  />
);

export default Demo;
```

### 配合 name 使用

可以为 Segmented 配置 `name` 参数，为组合内的 input 元素赋予相同的 `name` 属性，使浏览器把 Segmented 下的 input 真正看作是一组（例如可以通过方向键始终在同一组内更改选项）。

```tsx
import React from 'react';
import { Segmented } from 'gzd';

const Demo: React.FC = () => (
  <Segmented<string> options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} name="group" />
);

export default Demo;
```


## API

通用属性参考：[通用属性](/react/common-props)

### Segmented

| 参数 | 说明 | 类型 | 默认值  |
| --- | --- | --- | ---  |
| block | 将宽度调整为父元素宽度的选项 | boolean | false  |
| defaultValue | 默认选中的值 | string \| number |   |
| disabled | 是否禁用 | boolean | false  |
| onChange | 选项变化时的回调函数 | function(value: string \| number) |   |
| options | 数据化配置选项内容 | string\[] \| number\[] \| SegmentedItemType\[] | []  |
| orientation | 排列方向 | `horizontal` \| `vertical` | `horizontal`  |
| size | 控件尺寸 | `large` \| `medium` \| `small` | `medium`  |
| vertical | 排列方向，与 `orientation` 同时存在，以 `orientation` 优先 | boolean | `false`  |
| value | 当前选中的值 | string \| number |   |
| shape | 形状 | `default` \| `round` | `default`  |
| name | Segmented 下所有 `input[type="radio"]` 的 `name` 属性。若未设置，则将回退到随机生成的名称 | string |   |

### SegmentedItemType

| 属性 | 描述 | 类型 | 默认值  |
| --- | --- | --- | ---  |
| className | 自定义类名 | string | -  |
| disabled | 分段项的禁用状态 | boolean | false  |
| icon | 分段项的显示图标 | ReactNode | -  |
| label | 分段项的显示文本 | ReactNode | -  |
| tooltip | 分段项的工具提示 | string \| [TooltipProps](../tooltip/index.zh-CN.md#api) | -  |
| value | 分段项的值 | string \| number | -  |
