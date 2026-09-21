---
group: 数据展示
title: Collapse 折叠面板
---

# Collapse 折叠面板

## 何时使用 {#when-to-use}

- 对复杂区域进行分组和隐藏，保持页面的整洁。
- `手风琴` 是一种特殊的折叠面板，只允许单个内容区域展开。

## 代码演示

### 折叠面板

可以同时展开多个面板，这个例子默认展开了第一个。

```tsx
import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'gzd';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
  },
];

const App: React.FC = () => {
  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} />;
};

export default App;
```

### 面板尺寸

折叠面板有大、中、小三种尺寸。

通过设置 `size` 为 `large` `small` 分别把折叠面板设为大、小尺寸。若不设置 `size`，则尺寸默认为中。

```tsx
import React from 'react';
import { Collapse, Divider } from 'gzd';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const App: React.FC = () => (
  <>
    <Divider titlePlacement="start">Medium Size</Divider>
    <Collapse
      items={[{ key: '1', label: 'This is medium size panel header', children: <p>{text}</p> }]}
    />
    <Divider titlePlacement="start">Small Size</Divider>
    <Collapse
      size="small"
      items={[{ key: '1', label: 'This is small size panel header', children: <p>{text}</p> }]}
    />
    <Divider titlePlacement="start">Large Size</Divider>
    <Collapse
      size="large"
      items={[{ key: '1', label: 'This is large size panel header', children: <p>{text}</p> }]}
    />
  </>
);

export default App;
```

### 手风琴

手风琴模式，始终只有一个面板处在激活状态。

```tsx
import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'gzd';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
  },
];

const App: React.FC = () => <Collapse accordion items={items} />;

export default App;
```

### 面板嵌套

嵌套折叠面板。

```tsx
import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'gzd';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const itemsNest: CollapseProps['items'] = [
  {
    key: '1',
    label: 'This is panel nest panel',
    children: <p>{text}</p>,
  },
];

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <Collapse defaultActiveKey="1" items={itemsNest} />,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
  },
];

const App: React.FC = () => {
  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return <Collapse onChange={onChange} items={items} />;
};

export default App;
```

### 简洁风格

一套没有边框的简洁样式。

```tsx
import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'gzd';

const text = (
  <p style={{ paddingInlineStart: 24 }}>
    A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found
    as a welcome guest in many households across the world.
  </p>
);

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: text,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: text,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: text,
  },
];

const App: React.FC = () => <Collapse items={items} bordered={false} defaultActiveKey={['1']} />;

export default App;
```

### 自定义面板

自定义各个面板的背景色、圆角、边距和图标。

```tsx
import type { CSSProperties } from 'react';
import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { theme } from 'antd';
import { Collapse } from 'gzd';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <p>{text}</p>,
    style: panelStyle,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
    style: panelStyle,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
    style: panelStyle,
  },
];

const App: React.FC = () => {
  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['1']}
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      style={{ background: token.colorBgContainer }}
      items={getItems(panelStyle)}
    />
  );
};

export default App;
```

### 隐藏箭头

你可以通过 `showArrow={false}` 隐藏 `CollapsePanel` 组件的箭头图标。

```tsx
import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'gzd';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'This is panel header with arrow icon',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: 'This is panel header with no arrow icon',
    children: <p>{text}</p>,
    showArrow: false,
  },
];

const App: React.FC = () => {
  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return <Collapse defaultActiveKey={['1']} onChange={onChange} items={items} />;
};

export default App;
```

### 额外节点

自定义渲染每个面板右上角的内容。

```tsx
import React, { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Collapse, Select } from 'gzd';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const App: React.FC = () => {
  const [expandIconPlacement, setExpandIconPlacement] =
    useState<CollapseProps['expandIconPlacement']>('start');

  const onPlacementChange = (newExpandIconPlacement: CollapseProps['expandIconPlacement']) => {
    setExpandIconPlacement(newExpandIconPlacement);
  };

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  const genExtra = () => (
    <SettingOutlined
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'This is panel header 1',
      children: <div>{text}</div>,
      extra: genExtra(),
    },
    {
      key: '2',
      label: 'This is panel header 2',
      children: <div>{text}</div>,
      extra: genExtra(),
    },
    {
      key: '3',
      label: 'This is panel header 3',
      children: <div>{text}</div>,
      extra: genExtra(),
    },
  ];

  return (
    <>
      <Collapse
        defaultActiveKey={['1']}
        onChange={onChange}
        expandIconPlacement={expandIconPlacement}
        items={items}
      />
      <br />
      <span>Expand Icon Placement: </span>
      <Select
        value={expandIconPlacement}
        style={{ margin: '0 8px' }}
        onChange={onPlacementChange}
        options={[
          { label: 'start', value: 'start' },
          { label: 'end', value: 'end' },
        ]}
      />
    </>
  );
};

export default App;
```

### 幽灵折叠面板

将折叠面板的背景变成透明。

```tsx
import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'gzd';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
  },
];

const App: React.FC = () => <Collapse defaultActiveKey={['1']} ghost items={items} />;

export default App;
```

### 可折叠触发区域

通过 `collapsible` 属性，可以设置面板的可折叠触发区域。

```tsx
import React from 'react';
import { Collapse, Space } from 'gzd';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const App: React.FC = () => (
  <Space vertical>
    <Collapse
      collapsible="header"
      defaultActiveKey={['1']}
      items={[
        {
          key: '1',
          label: 'This panel can be collapsed by clicking text or icon',
          children: <p>{text}</p>,
        },
      ]}
    />
    <Collapse
      collapsible="icon"
      defaultActiveKey={['1']}
      items={[
        {
          key: '1',
          label: 'This panel can only be collapsed by clicking icon',
          children: <p>{text}</p>,
        },
      ]}
    />
    <Collapse
      collapsible="disabled"
      items={[
        {
          key: '1',
          label: "This panel can't be collapsed",
          children: <p>{text}</p>,
        },
      ]}
    />
  </Space>
);

export default App;
```

## API

通用属性参考：[通用属性](/react/common-props)

### Collapse

| 参数 | 说明 | 类型 | 默认值  |
| --- | --- | --- | ---  |
| accordion | 手风琴模式 | boolean | false  |
| activeKey | 当前激活 tab 面板的 key | string\[] \| string <br/> number\[] \| number | [手风琴模式](#collapse-demo-accordion)下默认第一个元素  |
| bordered | 带边框风格的折叠面板 | boolean | true  |
| collapsible | 所有子面板是否可折叠或指定可折叠触发区域 | `header` \| `icon` \| `disabled` | -  |
| defaultActiveKey | 初始化选中面板的 key | string\[] \| string<br/> number\[] \| number | -  |
| destroyOnHidden | 销毁折叠隐藏的面板 | boolean | false  |
| expandIcon | 自定义切换图标 | (panelProps) => ReactNode | -  |
| expandIconPlacement | 设置图标位置 | `start` \| `end` | `start`  |
| ghost | 使折叠面板透明且无边框 | boolean | false  |
| size | 设置折叠面板大小 | `large` \| `medium` \| `small` | `medium`  |
| onChange | 切换面板的回调 | function | -  |
| items | 折叠项目内容 | [ItemType](#itemtype) | -  |

### ItemType

| 参数 | 说明 | 类型 | 默认值  |
| --- | --- | --- | ---  |
| collapsible | 是否可折叠或指定可折叠触发区域 | `header` \| `icon` \| `disabled` | -  |
| children | body 区域内容 | ReactNode | -  |
| extra | 自定义渲染每个面板右上角的内容 | ReactNode | -  |
| forceRender | 被隐藏时是否渲染 body 区域 DOM 结构 | boolean | false  |
| key | 对应 activeKey | string \| number | -  |
| label | 面板标题 | ReactNode | -  |
| showArrow | 是否展示当前面板上的箭头（为 false 时，collapsible 不能设为 icon） | boolean | true  |

### Collapse.Panel

<!-- prettier-ignore -->
:::warning{title=已废弃}
版本 >= 5.6.0 时请使用 items 方式配置面板。
:::

| 参数 | 说明 | 类型 | 默认值  |
| --- | --- | --- | ---  |
| collapsible | 是否可折叠或指定可折叠触发区域 | `header` \| `icon` \| `disabled` | -  |
| extra | 自定义渲染每个面板右上角的内容 | ReactNode | -  |
| forceRender | 被隐藏时是否渲染 body 区域 DOM 结构 | boolean | false  |
| header | 面板标题 | ReactNode | -  |
| key | 对应 activeKey | string \| number | -  |
| showArrow | 是否展示当前面板上的箭头（为 false 时，collapsible 不能设为 icon） | boolean | true  |
