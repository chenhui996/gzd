---
group: 数据展示
title: Timeline 时间轴
---

# Timeline 时间轴

## 何时使用 {#when-to-use}

- 当有一系列信息需按时间排列时，可正序和倒序。
- 需要有一条时间轴进行视觉上的串联时。

## 代码演示

### 基本用法

基本的时间轴。

```tsx
import React from 'react';
import { Timeline } from 'gzd';

const App: React.FC = () => (
  <Timeline
    items={[
      {
        content: 'Create a services site 2015-09-01',
      },
      {
        content: 'Solve initial network problems 2015-09-01',
      },
      {
        content: 'Technical testing 2015-09-01',
      },
      {
        content: 'Network problems being solved 2015-09-01',
      },
    ]}
  />
);

export default App;
```

### 变体样式

通过 `variant` 设置时间轴的样式。

```tsx
import React from 'react';
import { Timeline } from 'gzd';

const App: React.FC = () => (
  <Timeline
    variant="filled"
    items={[
      {
        content: 'Create a services site 2015-09-01',
      },
      {
        content: 'Solve initial network problems 2015-09-01',
      },
      {
        content: 'Technical testing 2015-09-01',
      },
      {
        content: 'Network problems being solved 2015-09-01',
      },
    ]}
  />
);

export default App;
```

### 等待及排序

节点支持 `loading` 属性表示加载，`reverse` 属性用于控制节点排序。

```tsx
import React, { useState } from 'react';
import { Flex } from 'antd';
import { Button, Timeline } from 'gzd';

const App: React.FC = () => {
  const [reverse, setReverse] = useState(false);

  const handleClick = () => {
    setReverse(!reverse);
  };

  return (
    <Flex vertical gap={16} align="flex-start">
      <Timeline
        reverse={reverse}
        items={[
          {
            content: 'Create a services site 2015-09-01',
          },
          {
            content: 'Solve initial network problems 2015-09-01',
          },
          {
            content: 'Technical testing 2015-09-01',
          },
          {
            loading: true,
            content: 'Recording...',
          },
        ]}
      />
      <Button type="primary" onClick={handleClick}>
        Toggle Reverse
      </Button>
    </Flex>
  );
};

export default App;
```


### 交替展现

内容在时间轴两侧轮流出现。

```tsx
import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Timeline } from 'gzd';

const App: React.FC = () => (
  <Timeline
    mode="alternate"
    items={[
      {
        content: 'Create a services site 2015-09-01',
      },
      {
        content: 'Solve initial network problems 2015-09-01',
        color: 'green',
      },
      {
        icon: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
        content: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
      },
      {
        color: 'red',
        content: 'Network problems being solved 2015-09-01',
      },
      {
        content: 'Create a services site 2015-09-01',
      },
      {
        icon: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
        content: 'Technical testing 2015-09-01',
      },
    ]}
  />
);

export default App;
```

### 水平布局

水平方向的时间线。

```tsx
import React from 'react';
import { Flex } from 'antd';
import { Divider, Timeline } from 'gzd';
import type { TimelineProps } from 'antd';

const sharedProps: TimelineProps = {
  orientation: 'horizontal',
  items: [
    {
      content: 'Init',
    },
    {
      content: 'Start',
    },
    {
      content: 'Pending',
    },
    {
      content: 'Complete',
    },
  ],
};

const App: React.FC = () => (
  <Flex vertical>
    <Timeline {...sharedProps} mode="start" />
    <Divider />
    <Timeline {...sharedProps} mode="end" />
    <Divider />
    <Timeline {...sharedProps} mode="alternate" />
  </Flex>
);

export default App;
```


### 自定义时间轴点

可以设置为图标或其他自定义元素。

```tsx
import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { theme } from 'antd';
import { Timeline } from 'gzd';

const App: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Timeline
      items={[
        {
          content: 'Create a services site 2015-09-01',
        },
        {
          content: 'Solve initial network problems 2015-09-01',
        },
        {
          icon: (
            <ClockCircleOutlined
              style={{
                fontSize: 20,
                // Only need to set when `fontSize` is customized
                background: token.colorBgContainer,
              }}
            />
          ),
          color: 'red',
          content: 'Technical testing 2015-09-01',
        },
        {
          content: 'Network problems being solved 2015-09-01',
        },
      ]}
    />
  );
};

export default App;
```

### 另一侧时间轴点

时间轴点可以在另一侧。

```tsx
import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Timeline } from 'gzd';

const App: React.FC = () => (
  <Timeline
    mode="end"
    items={[
      {
        content: 'Create a services site 2015-09-01',
      },
      {
        content: 'Solve initial network problems 2015-09-01',
      },
      {
        icon: <ClockCircleOutlined />,
        color: 'red',
        content: 'Technical testing 2015-09-01',
      },
      {
        content: 'Network problems being solved 2015-09-01',
      },
    ]}
  />
);

export default App;
```

### 标题

使用 `title` 标签单独展示时间。

```tsx
import React, { useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Radio, Timeline } from 'gzd';

const App: React.FC = () => {
  const [mode, setMode] = useState<'start' | 'alternate' | 'end'>('start');

  const onChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  return (
    <>
      <Radio.Group
        onChange={onChange}
        value={mode}
        style={{
          marginBottom: 20,
        }}
      >
        <Radio value="start">Start</Radio>
        <Radio value="end">End</Radio>
        <Radio value="alternate">Alternate</Radio>
      </Radio.Group>
      <Timeline
        mode={mode}
        items={[
          {
            title: '2015-09-01',
            content: 'Create a services',
          },
          {
            title: '2015-09-01 09:12:11',
            content: 'Solve initial network problems',
          },
          {
            content: 'Technical testing',
          },
          {
            title: '2015-09-01 09:12:11',
            content: 'Network problems being solved',
          },
        ]}
      />
    </>
  );
};

export default App;
```

### 标题占比

使用 `titleSpan` 设置标题占比空间。

```tsx
import React from 'react';
import { Flex, Typography } from 'antd';
import { Timeline } from 'gzd';
import type { TimelineProps } from 'antd';

const items: TimelineProps['items'] = [
  { title: '05:10', content: 'Create a services' },
  { title: '09:03', content: 'Solve initial network problems' },
  { content: 'Technical testing' },
  { title: '11:28', content: 'Network problems being solved' },
];

const App: React.FC = () => {
  return (
    <Flex vertical gap={16}>
      <Typography.Title level={5} style={{ margin: 0 }}>
        titleSpan = 100px
      </Typography.Title>
      <Timeline items={items} titleSpan="100px" />
      <Typography.Title level={5} style={{ margin: 0 }}>
        titleSpan = 25%
      </Typography.Title>
      <Timeline items={items} titleSpan="25%" />
      <Typography.Title level={5} style={{ margin: 0 }}>
        titleSpan = 18, mode = end
      </Typography.Title>
      <Timeline items={items} titleSpan={18} mode="end" />
    </Flex>
  );
};

export default App;
```

### 语义化自定义

通过语义化结构，可以实现更丰富的定制样式。

```tsx
import React from 'react';
import { Timeline } from 'gzd';

const App: React.FC = () => (
  <Timeline
    items={[
      {
        content: 'Create a services site 2015-09-01',
      },
      {
        content: 'Solve initial network problems 2015-09-01',
        styles: {
          root: {
            height: 100,
          },
          rail: {
            borderStyle: 'dashed',
          },
        },
      },
      {
        content: '...for a long time...',
        styles: {
          root: {
            height: 100,
          },
          rail: {
            borderStyle: 'dashed',
          },
          content: {
            opacity: 0.45,
          },
        },
      },
      {
        content: 'Technical testing 2015-09-01',
      },

      {
        content: 'Network problems being solved 2015-09-01',
      },
    ]}
  />
);

export default App;
```

## API

通用属性参考：[通用属性](/react/common-props)

### Timeline

| 参数 | 说明 | 类型 | 默认值  |
| --- | --- | --- | ---  |
| items | 选项配置 | [Items](#Items)[] | -  |
| mode | 通过设置 `mode` 可以改变时间轴和内容的相对位置 | `start` \| `alternate` \| `end` | `start`  |
| orientation | 设置时间轴的方向 | `vertical` \| `horizontal` | `vertical`  |
| reverse | 节点排序 | boolean | false  |
| titleSpan | 设置标题占比空间，为到 dot 中心点距离 | number \| string | 12  |
| variant | 设置样式变体 | `filled` \| `outlined` | `outlined`  |

### Items

时间轴的每一个节点。

| 参数 | 说明 | 类型  |
| --- | --- | ---  |
| color | 指定圆圈颜色 `blue`、`red`、`green`、`gray`，或自定义的色值 | string  |
| content | 设置内容 | ReactNode  |
| icon | 自定义节点图标 | ReactNode  |
| loading | 设置加载状态 | boolean  |
| placement | 自定义节点位置 | `start` \| `end`  |
| title | 设置标题 | ReactNode  |
