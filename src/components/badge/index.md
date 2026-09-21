---
group: 数据展示
title: Badge 徽标数
---

# Badge 徽标数

## 何时使用 {#when-to-use}

一般出现在通知图标或头像的右上角，用于显示需要处理的消息条数，通过醒目视觉形式吸引用户处理。

## 代码演示

### 基本

简单的徽章展示，当 `count` 为 `0` 时，默认不显示，但是可以使用 `showZero` 修改为显示。

```tsx
import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Avatar, Badge, Space } from 'gzd';

const App: React.FC = () => (
  <Space size={16}>
    <Badge count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge count={0} showZero>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge count={<ClockCircleOutlined style={{ color: '#f5222d' }} />}>
      <Avatar shape="square" size="large" />
    </Badge>
  </Space>
);

export default App;
```

### 独立使用

不包裹任何元素即是独立使用，可自定样式展现。

> 在右上角的 badge 则限定为红色。

```tsx
import React, { useState } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Badge, Space, Switch } from 'gzd';

const App: React.FC = () => {
  const [show, setShow] = useState(true);

  return (
    <Space>
      <Switch checked={show} onChange={() => setShow(!show)} />
      <Badge count={show ? 11 : 0} showZero color="#faad14" />
      <Badge count={show ? 25 : 0} />
      <Badge count={show ? <ClockCircleOutlined style={{ color: '#f5222d' }} /> : 0} />
      <Badge
        className="site-badge-count-109"
        count={show ? 109 : 0}
        style={{ backgroundColor: '#52c41a' }}
      />
    </Space>
  );
};

export default App;
```

### 封顶数字

超过 `overflowCount` 的会显示为 `${overflowCount}+`，默认的 `overflowCount` 为 `99`。

```tsx
import React from 'react';
import { Avatar, Badge, Space } from 'gzd';

const App: React.FC = () => (
  <Space size="large">
    <Badge count={99}>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge count={100}>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge count={99} overflowCount={10}>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge count={1000} overflowCount={999}>
      <Avatar shape="square" size="large" />
    </Badge>
  </Space>
);

export default App;
```

### 讨嫌的小红点

没有具体的数字。

```tsx
import React from 'react';
import { NotificationOutlined } from '@ant-design/icons';
import { Badge, Space } from 'gzd';

const App: React.FC = () => (
  <Space>
    <Badge dot>
      <NotificationOutlined style={{ fontSize: 16 }} />
    </Badge>
    <Badge dot>
      <a href="#">Link something</a>
    </Badge>
  </Space>
);

export default App;
```

### 动态

展示动态变化的效果。

```tsx
import React, { useState } from 'react';
import { MinusOutlined, PlusOutlined, QuestionOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Space, Switch } from 'gzd';

const App: React.FC = () => {
  const [count, setCount] = useState(5);
  const [show, setShow] = useState(true);

  const increase = () => {
    setCount(count + 1);
  };

  const decline = () => {
    let newCount = count - 1;
    if (newCount < 0) {
      newCount = 0;
    }
    setCount(newCount);
  };

  const random = () => {
    const newCount = Math.floor(Math.random() * 100);
    setCount(newCount);
  };

  const onChange = (checked: boolean) => {
    setShow(checked);
  };

  return (
    <Space vertical>
      <Space size="large">
        <Badge count={count}>
          <Avatar shape="square" size="large" />
        </Badge>
        <Space.Compact>
          <Button onClick={decline} icon={<MinusOutlined />} />
          <Button onClick={increase} icon={<PlusOutlined />} />
          <Button onClick={random} icon={<QuestionOutlined />} />
        </Space.Compact>
      </Space>
      <Space size="large">
        <Badge dot={show}>
          <Avatar shape="square" size="large" />
        </Badge>
        <Switch onChange={onChange} checked={show} />
      </Space>
    </Space>
  );
};

export default App;
```

### 可点击

用 a 标签进行包裹即可。

```tsx
import React from 'react';
import { Avatar, Badge } from 'gzd';

const App: React.FC = () => (
  <a href="#">
    <Badge count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
  </a>
);

export default App;
```

### 自定义位置偏移

设置状态点的位置偏移，格式为 `[left, top]`，表示状态点距默认位置左侧、上方的偏移量。

```tsx
import React from 'react';
import { Avatar, Badge } from 'gzd';

const App: React.FC = () => (
  <Badge count={5} offset={[10, 10]}>
    <Avatar shape="square" size="large" />
  </Badge>
);

export default App;
```

### 大小

可以设置有数字徽标的大小。

```tsx
import React from 'react';
import { Avatar, Badge, Space } from 'gzd';

const App: React.FC = () => (
  <Space size={16}>
    <Badge size={16} count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
    <Badge size="small" count={5}>
      <Avatar shape="square" size="large" />
    </Badge>
  </Space>
);

export default App;
```

### 状态点

用于表示状态的小圆点。

```tsx
import React from 'react';
import { Badge, Space } from 'gzd';

const App: React.FC = () => (
  <>
    <Space>
      <Badge status="success" />
      <Badge status="error" />
      <Badge status="default" />
      <Badge status="processing" />
      <Badge status="warning" />
    </Space>
    <br />
    <Space vertical>
      <Badge status="success" text="Success" />
      <Badge status="error" text="Error" />
      <Badge status="default" text="Default" />
      <Badge status="processing" text="Processing" />
      <Badge status="warning" text="Warning" />
    </Space>
  </>
);

export default App;
```

### 多彩徽标

我们添加了多种预设色彩的徽标样式，用作不同场景使用。如果预设值不能满足你的需求，可以设置为具体的色值。

```tsx
import React from 'react';
import { Badge, Divider, Space } from 'gzd';

const colors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];

const App: React.FC = () => (
  <>
    <Divider titlePlacement="start">Presets</Divider>
    <Space vertical>
      {colors.map((color) => (
        <Badge key={color} color={color} text={color} />
      ))}
    </Space>
    <Divider titlePlacement="start">Custom</Divider>
    <Space vertical>
      <Badge color="#f50" text="#f50" />
      <Badge color="rgb(45, 183, 245)" text="rgb(45, 183, 245)" />
      <Badge color="hsl(102, 53%, 61%)" text="hsl(102, 53%, 61%)" />
      <Badge color="hwb(205 6% 9%)" text="hwb(205 6% 9%)" />
    </Space>
  </>
);

export default App;
```

### 缎带

使用缎带型的徽标。

```tsx
import React from 'react';
import { Card } from 'antd';
import { Badge, Space } from 'gzd';

const App: React.FC = () => (
  <Space vertical size={16} style={{ width: '100%' }}>
    <Badge.Ribbon text="Hippies">
      <Card title="Pushes open the window" size="small">
        and raises the spyglass.
      </Card>
    </Badge.Ribbon>
    <Badge.Ribbon text="Hippies" color="pink">
      <Card title="Pushes open the window" size="small">
        and raises the spyglass.
      </Card>
    </Badge.Ribbon>
    <Badge.Ribbon text="Hippies" color="red">
      <Card title="Pushes open the window" size="small">
        and raises the spyglass.
      </Card>
    </Badge.Ribbon>
    <Badge.Ribbon text="Hippies" color="cyan">
      <Card title="Pushes open the window" size="small">
        and raises the spyglass.
      </Card>
    </Badge.Ribbon>
    <Badge.Ribbon text="Hippies" color="green">
      <Card title="Pushes open the window" size="small">
        and raises the spyglass.
      </Card>
    </Badge.Ribbon>
    <Badge.Ribbon text="Hippies" color="purple">
      <Card title="Pushes open the window" size="small">
        and raises the spyglass.
      </Card>
    </Badge.Ribbon>
    <Badge.Ribbon text="Hippies" color="volcano">
      <Card title="Pushes open the window" size="small">
        and raises the spyglass.
      </Card>
    </Badge.Ribbon>
    <Badge.Ribbon text="Hippies" color="magenta">
      <Card title="Pushes open the window" size="small">
        and raises the spyglass.
      </Card>
    </Badge.Ribbon>
  </Space>
);

export default App;
```



## API

通用属性参考：[通用属性](/react/common-props)

### Badge

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 自定义小圆点的颜色 | string | - |
| count | 展示的数字，大于 overflowCount 时显示为 `${overflowCount}+`，为 0 时隐藏 | ReactNode | - |
| dot | 不展示数字，只有一个小红点 | boolean | false |
| offset | 设置状态点的位置偏移 | \[number, number] | - |
| overflowCount | 展示封顶的数字值 | number | 99 |
| showZero | 当数值为 0 时，是否展示 Badge | boolean | false |
| size | 在设置了 `count` 的前提下有效，设置小圆点的大小 | `medium` \| `small` | - |
| status | 设置 Badge 为状态点 | `success` \| `processing` \| `default` \| `error` \| `warning` | - |
| text | 在设置了 `status` 的前提下有效，设置状态点的文本 | ReactNode | - |
| title | 设置鼠标放在状态点上时显示的文字 | string | - |

### Badge.Ribbon

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 自定义缎带的颜色 | string | - |
| placement | 缎带的位置，`start` 和 `end` 随文字方向（RTL 或 LTR）变动 | `start` \| `end` | `end` |
| text | 缎带中填入的内容 | ReactNode | - |
