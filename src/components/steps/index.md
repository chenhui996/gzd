---
group: 导航
title: Steps 步骤条
---

# Steps 步骤条

引导用户按照流程完成任务的导航条。

## 何时使用

当任务复杂或者先后顺序带有逻辑性时，将任务分解成一个个小步骤，可以帮助用户了解当前所在位置以及还需要多少步才能完成任务，避免用户在任务中迷失方向。

## 代码演示

### 基本用法

简单的步骤条。

```tsx
import React from 'react';
import { Steps } from 'gzd';

const content = 'This is a content.';

const App: React.FC = () => (
  <Steps
    current={1}
    items={[
      {
        title: 'Finished',
        content,
      },
      {
        title: 'In Progress',
        content,
        subTitle: 'Left 00:00:08',
      },
      {
        title: 'Waiting',
        content,
      },
    ]}
  />
);

export default App;
```

### 步骤运行错误

使用 Steps 的 `status` 属性来指定当前步骤的状态。

```tsx
import React from 'react';
import { Steps } from 'gzd';

const content = 'This is a content.';

const App: React.FC = () => (
  <Steps
    current={1}
    status="error"
    items={[
      {
        title: 'Finished',
        content,
      },
      {
        title: 'In Process',
        content,
      },
      {
        title: 'Waiting',
        content,
      },
    ]}
  />
);

export default App;
```

### 竖直方向的步骤条

简单的竖直方向的步骤条。

```tsx
import React from 'react';
import { Steps } from 'gzd';

const content = 'This is a content.';

const App: React.FC = () => (
  <Steps
    orientation="vertical"
    current={1}
    items={[
      {
        title: 'Finished',
        content,
      },
      {
        title: 'In Progress',
        content,
      },
      {
        title: 'Waiting',
        content,
      },
    ]}
  />
);

export default App;
```

### 可点击

设置 `onChange` 后，Steps 变为可点击状态。

```tsx
import React, { useState } from 'react';
import { Divider } from 'antd';
import { Steps } from 'gzd';

const content = 'This is a content.';

const App: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    console.log('onChange:', value);
    setCurrent(value);
  };

  return (
    <>
      <Steps
        current={current}
        onChange={onChange}
        items={[
          { title: 'Step 1', content },
          { title: 'Step 2', content },
          { title: 'Step 3', content },
        ]}
      />

      <Divider />

      <Steps
        current={current}
        onChange={onChange}
        orientation="vertical"
        items={[
          { title: 'Step 1', content },
          { title: 'Step 2', content },
          { title: 'Step 3', content },
        ]}
      />
    </>
  );
};

export default App;
```

### 面板式步骤

面板式步骤，配置 `type="panel"` 即可。

```tsx
import React, { useState } from 'react';
import { Steps } from 'gzd';

const content = 'This is a content.';

const App: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    console.log('onChange:', value);
    setCurrent(value);
  };

  return (
    <Steps
      type="panel"
      current={current}
      onChange={onChange}
      items={[
        { title: 'Step 1', content },
        { title: 'Step 2', content },
        { title: 'Step 3', content },
      ]}
    />
  );
};

export default App;
```

### 带图标的步骤条

通过设置 `Steps` `items` 的 `icon` 属性，可以启用带图标的步骤条。

```tsx
import React from 'react';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Steps } from 'gzd';

const App: React.FC = () => (
  <Steps
    items={[
      {
        title: 'Login',
        status: 'finish',
        icon: <UserOutlined />,
      },
      {
        title: 'Verification',
        status: 'finish',
        icon: <SolutionOutlined />,
      },
      {
        title: 'Pay',
        status: 'process',
        icon: <LoadingOutlined />,
      },
      {
        title: 'Done',
        status: 'wait',
        icon: <SmileOutlined />,
      },
    ]}
  />
);

export default App;
```

### 标签放置位置与图标

设置 `titlePlacement="vertical"`，将标签放置在图标下方。

```tsx
import React from 'react';
import { Steps } from 'gzd';

const content = 'This is a content.';
const items = [
  {
    title: 'Finished',
    content,
  },
  {
    title: 'In Progress',
    content,
  },
  {
    title: 'Waiting',
    content,
  },
];
const App: React.FC = () => (
  <>
    <Steps current={1} titlePlacement="vertical" items={items} ellipsis />
    <br />
    <Steps current={1} percent={60} titlePlacement="vertical" items={items} />
    <br />
    <Steps current={1} percent={80} size="small" titlePlacement="vertical" items={items} />
  </>
);

export default App;
```

### 点状步骤条

包含步骤点的进度条。

```tsx
import React from 'react';
import { Divider } from 'antd';
import { Steps } from 'gzd';

const content = 'This is a content.';

const App: React.FC = () => (
  <>
    <Steps
      type="dot"
      current={1}
      items={[
        { title: 'Finished', content },
        { title: 'In Progress', content },
        { title: 'Waiting', content },
      ]}
    />
    <Divider />
    <Steps
      type="dot"
      current={1}
      orientation="vertical"
      items={[
        { title: 'Finished', content: 'This is a content. This is a content.' },
        { title: 'Finished', content: 'This is a content. This is a content.' },
        { title: 'In Progress', content: 'This is a content. This is a content.' },
        { title: 'Waiting', content },
        { title: 'Waiting', content },
      ]}
    />
  </>
);

export default App;
```

### 导航步骤

导航类型的步骤条。

```tsx
import React, { useState } from 'react';
import { Steps } from 'gzd';
import { Flex }  from 'antd';

const App: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    console.log('onChange:', value);
    setCurrent(value);
  };

  return (
    <Flex vertical gap="large">
      <Steps
        type="navigation"
        size="small"
        current={current}
        onChange={onChange}
        items={[
          {
            title: 'Step 1',
            subTitle: '00:00:05',
            status: 'finish',
            content: 'This is a content.',
          },
          {
            title: 'Step 2',
            subTitle: '00:01:02',
            status: 'process',
            content: 'This is a content.',
          },
          {
            title: 'Step 3',
            subTitle: 'waiting for longlong time',
            status: 'wait',
            content: 'This is a content.',
          },
        ]}
      />

      <Steps
        type="navigation"
        current={current}
        onChange={onChange}
        items={[
          {
            status: 'finish',
            title: 'Step 1',
          },
          {
            status: 'process',
            title: 'Step 2',
          },
          {
            status: 'wait',
            title: 'Step 3',
          },
          {
            status: 'wait',
            title: 'Step 4',
          },
        ]}
      />

      <Steps
        type="navigation"
        size="small"
        current={current}
        onChange={onChange}
        items={[
          {
            status: 'finish',
            title: 'finish 1',
          },
          {
            status: 'finish',
            title: 'finish 2',
          },
          {
            status: 'process',
            title: 'current process',
          },
          {
            status: 'wait',
            title: 'wait',
            disabled: true,
          },
        ]}
      />
    </Flex>
  );
};

export default App;
```

### 内联步骤

内联类型的步骤条，适用于列表内容场景中展示对象所在流程、当前状态的情况。

```tsx
import React from 'react';
import {Steps, type StepsProps } from 'gzd';
import { Avatar, List  } from 'antd';

const data = [
  {
    title: 'Ant Design Title 1',
    current: 0,
  },
  {
    title: 'Ant Design Title 2',
    current: 1,
    status: 'error',
  },
  {
    title: 'Ant Design Title 3',
    current: 2,
  },
  {
    title: 'Ant Design Title 4',
    current: 1,
  },
];

const items = [
  {
    title: 'Step 1',
    content: 'This is Step 1',
  },
  {
    title: 'Step 2',
    content: 'This is Step 2',
  },
  {
    title: 'Step 3',
    content: 'This is Step 3',
  },
];

const App: React.FC = () => (
  <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item, index) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
          title={<a href="https://ant.design">{item.title}</a>}
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        />
        <Steps
          style={{ marginTop: 8 }}
          type="inline"
          current={item.current}
          status={item.status as StepsProps['status']}
          items={items}
        />
      </List.Item>
    )}
  />
);

export default App;
```

### 内联样式组合

内联步骤条修改样式，通过 offset 进行对齐。

```tsx
import React from 'react';
import { Steps, type StepsProps } from 'antd';
import { Flex, theme } from 'antd';

const items: StepsProps['items'] = Array.from({ length: 5 }, (_, index) => ({
  title: `Step ${index + 1}`,
  subTitle: 'Sub Title',
  content: `This is Step ${index + 1}`,
}));

const App: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Flex vertical>
      <Steps type="inline" current={1} items={items} />
      <Steps
        type="inline"
        current={4}
        items={items}
        status="finish"
        styles={{
          itemTitle: {
            color: token.colorPrimaryText,
          },
          itemSubtitle: {
            color: token.colorPrimaryTextActive,
          },
          itemRail: {
            background: token.colorTextDisabled,
          },
        }}
      />
      <Steps type="inline" current={1} items={items.slice(2)} offset={2} />
    </Flex>
  );
};

export default App;
```

## API

### Steps

| 参数           | 说明                                                                          | 类型                     | 默认值       | 版本 |
| -------------- | ----------------------------------------------------------------------------- | ------------------------ | ------------ | ---- |
| current        | 指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 `status` 属性覆盖状态 | number                   | 0            |      |
| orientation    | 指定步骤条方向。目前支持水平（`horizontal`）和竖直（`vertical`）两种方向      | string                   | `horizontal` |      |
| initial        | 起始序号，从 0 开始记数                                                       | number                   | 0            |      |
| items          | 配置选项                                                                      | [StepItem](#stepitem)\[] | \[]          |      |
| titlePlacement | 指定标签放置位置，默认水平放图标右侧，可选 `vertical` 放图标下方              | string                   | `horizontal` |      |
| percent        | 包含步骤点的进度条                                                            | number                   | -            |      |
| responsive     | 当屏幕宽度小于 532px 时自动变为垂直方向                                       | boolean                  | true         |      |
| size           | 指定大小，目前支持普通（`default`）和迷你（`small`）                          | string                   | `default`    |      |
| status         | 指定当前步骤的状态，可选 `wait` `process` `finish` `error`                    | string                   | `process`    |      |
| type           | 步骤条类型，有 `default`、`navigation`、`inline`、`panel`、`dot` 等           | string                   | `default`    |      |
| variant        | 步骤条形态变体，有 `filled` 和 `outlined` 两种                                | string                   | `filled`     |      |
| onChange       | 点击切换步骤时触发                                                            | (current) => void        | -            |      |

### StepItem

| 参数     | 说明                                                                                                          | 类型      | 默认值 | 版本 |
| -------- | ------------------------------------------------------------------------------------------------------------- | --------- | ------ | ---- |
| content  | 步骤的详情内容，可选                                                                                          | ReactNode | -      |      |
| disabled | 禁用点击                                                                                                      | boolean   | false  |      |
| icon     | 步骤图标的类型，可选                                                                                          | ReactNode | -      |      |
| status   | 指定状态。当不配置该属性时，会使用 Steps 的 `current` 来自动指定状态。可选：`wait` `process` `finish` `error` | string    | `wait` |      |
| subTitle | 子标题                                                                                                        | ReactNode | -      |      |
| title    | 标题                                                                                                          | ReactNode | -      |      |
