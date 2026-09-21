---
group: 布局
title: Space 间距
---

# Space 间距

设置组件之间的间距。

## 何时使用

避免组件紧贴在一起，拉开统一的空间。

- 适合行内元素的水平间距。
- 可以设置各种水平对齐方式。
- 需要表单组件之间紧凑连接且合并边框时，使用 Space.Compact。

## 与 Flex 组件的区别

- Space 为内联元素提供间距，其本身会为每一个子元素添加包裹元素用于内联对齐。适用于行、列中多个子元素的等距排列。
- Flex 为块级元素提供间距，其本身不会添加包裹元素。适用于垂直或水平方向上的子元素布局，并提供了更多的灵活性和控制能力。

## 代码演示

### 基本用法

相邻组件水平间距。

```tsx
import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Popconfirm, Upload } from 'antd';
import { Space, Button } from 'gzd';

const App: React.FC = () => (
  <Space>
    Space
    <Button type="primary">Button</Button>
    <Upload>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
    <Popconfirm title="Are you sure delete this task?" okText="Yes" cancelText="No">
      <Button>Confirm</Button>
    </Popconfirm>
  </Space>
);

export default App;
```

### 垂直间距

相邻组件垂直间距。

```tsx
import React from 'react';
import { Card } from 'antd';
import { Space } from 'gzd';

const App: React.FC = () => (
  <Space orientation="vertical" size="middle" style={{ display: 'flex' }}>
    <Card title="Card" size="small">
      <p>Card content</p>
      <p>Card content</p>
    </Card>
    <Card title="Card" size="small">
      <p>Card content</p>
      <p>Card content</p>
    </Card>
    <Card title="Card" size="small">
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  </Space>
);

export default App;
```

### 间距大小

使用 `size` 设置元素之间的间距，预设了 `small`、`medium`、`large` 三种尺寸，也可以自定义间距，若不设置 size，则默认为 `small`。

```tsx
import React, { useState } from 'react';
import { Radio, Slider } from 'antd';
import type { ConfigProviderProps } from 'antd';

import { Space, Button } from 'gzd';

type SizeType = ConfigProviderProps['componentSize'];

const App: React.FC = () => {
  const [size, setSize] = useState<SizeType | [SizeType, SizeType] | 'customize'>('small');
  const [customSize, setCustomSize] = React.useState<number>(0);
  return (
    <>
      <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
        {['small', 'middle', 'large', 'customize'].map((item) => (
          <Radio key={item} value={item}>
            {item}
          </Radio>
        ))}
      </Radio.Group>
      <br />
      <br />
      {size === 'customize' && (
        <>
          <Slider value={customSize} onChange={setCustomSize} />
          <br />
        </>
      )}
      <Space size={size !== 'customize' ? size : customSize}>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="link">Link</Button>
      </Space>
    </>
  );
};

export default App;
```

### 对齐

设置对齐模式。

```tsx
import React from 'react';
import { Button, Space } from 'gzd';
import './style.less' // demo 样式

const App: React.FC = () => (
  <div className="space-align-container">
    <div className="space-align-block">
      <Space align="center">
        center
        <Button type="primary">Primary</Button>
        <span className="mock-block">Block</span>
      </Space>
    </div>
    <div className="space-align-block">
      <Space align="start">
        start
        <Button type="primary">Primary</Button>
        <span className="mock-block">Block</span>
      </Space>
    </div>
    <div className="space-align-block">
      <Space align="end">
        end
        <Button type="primary">Primary</Button>
        <span className="mock-block">Block</span>
      </Space>
    </div>
    <div className="space-align-block">
      <Space align="baseline">
        baseline
        <Button type="primary">Primary</Button>
        <span className="mock-block">Block</span>
      </Space>
    </div>
  </div>
);

export default App;
```

### 自动换行

自动换行。

```tsx
import React from 'react';
import { Button, Space } from 'gzd';

const App: React.FC = () => (
  <Space size={[8, 16]} wrap>
    {Array.from({ length: 20 }).map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Button key={index}>Button</Button>
    ))}
  </Space>
);

export default App;
```

### 分隔符

相邻组件分隔符。

```tsx
import React from 'react';
import { Typography } from 'antd';
import { Divider, Space } from 'gzd';

const App: React.FC = () => (
  <Space separator={<Divider vertical />}>
    <Typography.Link>Link</Typography.Link>
    <Typography.Link>Link</Typography.Link>
    <Typography.Link>Link</Typography.Link>
  </Space>
);

export default App;
```

### 紧凑布局组合

使用 Space.Compact 让表单组件之间紧凑连接且合并边框。

```tsx
import React from 'react';
import { CopyOutlined } from '@ant-design/icons';
import {Space, Button} from 'gzd';
import {
  AutoComplete,
  Cascader,
  ColorPicker,
  DatePicker,
  Input,
  InputNumber,
  Select,
  TimePicker,
  Tooltip,
  TreeSelect,
} from 'antd';

const { TreeNode } = TreeSelect;

const App: React.FC = () => (
  <Space orientation="vertical">
    <Space.Compact block>
      <Input style={{ width: '20%' }} defaultValue="0571" />
      <Input style={{ width: '30%' }} defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact block size="small">
      <Input style={{ width: 'calc(100% - 200px)' }} defaultValue="https://ant.design" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact block>
      <Input style={{ width: 'calc(100% - 200px)' }} defaultValue="https://ant.design" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact block>
      <Input
        style={{ width: 'calc(100% - 200px)' }}
        defaultValue="git@github.com:ant-design/ant-design.git"
      />
      <Tooltip title="copy git url">
        <Button icon={<CopyOutlined />} />
      </Tooltip>
    </Space.Compact>
    <Space.Compact block>
      <Select
        allowClear
        defaultValue="Zhejiang"
        options={[
          { label: 'Zhejiang', value: 'Zhejiang' },
          { label: 'Jiangsu', value: 'Jiangsu' },
        ]}
      />
      <Input style={{ width: '50%' }} defaultValue="Xihu District, Hangzhou" />
    </Space.Compact>
    <Space.Compact block>
      <Select
        allowClear
        mode="multiple"
        defaultValue="Zhejiang"
        style={{ width: '50%' }}
        options={[
          { label: 'Zhejiang', value: 'Zhejiang' },
          { label: 'Jiangsu', value: 'Jiangsu' },
        ]}
      />
      <Input style={{ width: '50%' }} defaultValue="Xihu District, Hangzhou" />
    </Space.Compact>
    <Space.Compact block>
      <Input.Search style={{ width: '30%' }} defaultValue="0571" />
      <Input.Search allowClear style={{ width: '50%' }} defaultValue="26888888" />
      <Input.Search style={{ width: '20%' }} defaultValue="+1" />
    </Space.Compact>
    <Space.Compact block>
      <Select
        defaultValue="Option1"
        options={[
          { label: 'Option1', value: 'Option1' },
          { label: 'Option2', value: 'Option2' },
        ]}
      />
      <Input style={{ width: '50%' }} defaultValue="input content" />
      <InputNumber defaultValue={12} />
    </Space.Compact>
    <Space.Compact block>
      <Input style={{ width: '50%' }} defaultValue="input content" />
      <DatePicker style={{ width: '50%' }} />
    </Space.Compact>
    <Space.Compact block>
      <DatePicker.RangePicker style={{ width: '70%' }} />
      <Input style={{ width: '30%' }} defaultValue="input content" />
      <Button type="primary">查询</Button>
    </Space.Compact>
    <Space.Compact block>
      <Input style={{ width: '30%' }} defaultValue="input content" />
      <DatePicker.RangePicker style={{ width: '70%' }} />
    </Space.Compact>
    <Space.Compact block>
      <Select
        defaultValue="Option1-1"
        options={[
          { label: 'Option1-1', value: 'Option1-1' },
          { label: 'Option1-2', value: 'Option1-2' },
        ]}
      />
      <Select
        defaultValue="Option2-2"
        options={[
          { label: 'Option2-1', value: 'Option2-1' },
          { label: 'Option2-2', value: 'Option2-2' },
        ]}
      />
    </Space.Compact>
    <Space.Compact block>
      <Select
        defaultValue="1"
        options={[
          { label: 'Between', value: '1' },
          { label: 'Except', value: '2' },
        ]}
      />
      <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
      <Input
        className="site-input-split"
        style={{
          width: 30,
          borderInlineStart: 0,
          borderInlineEnd: 0,
          pointerEvents: 'none',
        }}
        placeholder="~"
        disabled
      />
      <Input
        className="site-input-right"
        style={{
          width: 100,
          textAlign: 'center',
        }}
        placeholder="Maximum"
      />
    </Space.Compact>
    <Space.Compact block>
      <Select
        defaultValue="Sign Up"
        style={{ width: '30%' }}
        options={[
          { label: 'Sign Up', value: 'Sign Up' },
          { label: 'Sign In', value: 'Sign In' },
        ]}
      />
      <AutoComplete
        style={{ width: '70%' }}
        placeholder="Email"
        options={[{ value: 'text 1' }, { value: 'text 2' }]}
      />
    </Space.Compact>
    <Space.Compact block>
      <TimePicker style={{ width: '70%' }} />
      <Cascader
        style={{ width: '70%' }}
        options={[
          {
            value: 'zhejiang',
            label: 'Zhejiang',
            children: [
              {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                  {
                    value: 'xihu',
                    label: 'West Lake',
                  },
                ],
              },
            ],
          },
          {
            value: 'jiangsu',
            label: 'Jiangsu',
            children: [
              {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                  {
                    value: 'zhonghuamen',
                    label: 'Zhong Hua Men',
                  },
                ],
              },
            ],
          },
        ]}
        placeholder="Select Address"
      />
    </Space.Compact>
    <Space.Compact block>
      <TimePicker.RangePicker />
      <TreeSelect
        showSearch
        style={{ width: '60%' }}
        value="leaf1"
        styles={{
          popup: {
            root: { maxHeight: 400, overflow: 'auto' },
          },
        }}
        placeholder="Please select"
        allowClear
        treeDefaultExpandAll
        onChange={() => {}}
      >
        <TreeNode value="parent 1" title="parent 1">
          <TreeNode value="parent 1-0" title="parent 1-0">
            <TreeNode value="leaf1" title="leaf1" />
            <TreeNode value="leaf2" title="leaf2" />
          </TreeNode>
          <TreeNode value="parent 1-1" title="parent 1-1">
            <TreeNode value="leaf3" title={<b style={{ color: '#08c' }}>leaf3</b>} />
          </TreeNode>
        </TreeNode>
      </TreeSelect>
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact>
      <Input placeholder="input here" />
      <Space.Addon>$</Space.Addon>
      <InputNumber placeholder="another input" style={{ width: '100%' }} />
      <InputNumber placeholder="another input" style={{ width: '100%' }} />
      <Space.Addon>$</Space.Addon>
    </Space.Compact>
    <Space.Compact>
      <Input placeholder="input here" />
      <ColorPicker />
    </Space.Compact>
    <Space.Compact>
      <Button type="primary">Button</Button>
      <Input placeholder="input here" />
      <Space.Addon>$</Space.Addon>
    </Space.Compact>
  </Space>
);

export default App;
```


### Button 紧凑布局

Button 组件紧凑排列的示例。

```tsx
import React from 'react';
import {
  CommentOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  HeartOutlined,
  LikeOutlined,
  MailOutlined,
  MobileOutlined,
  ShareAltOutlined,
  StarOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Dropdown, Tooltip } from 'antd';
import { Button, Space } from 'gzd';

const App: React.FC = () => (
  <div>
    <Space.Compact block>
      <Tooltip title="Like">
        <Button icon={<LikeOutlined />} />
      </Tooltip>
      <Tooltip title="Comment">
        <Button icon={<CommentOutlined />} />
      </Tooltip>
      <Tooltip title="Star">
        <Button icon={<StarOutlined />} />
      </Tooltip>
      <Tooltip title="Heart">
        <Button icon={<HeartOutlined />} />
      </Tooltip>
      <Tooltip title="Share">
        <Button icon={<ShareAltOutlined />} />
      </Tooltip>
      <Tooltip title="Download">
        <Button icon={<DownloadOutlined />} />
      </Tooltip>
      <Dropdown
        placement="bottomRight"
        menu={{
          items: [
            {
              key: '1',
              label: 'Report',
              icon: <WarningOutlined />,
            },
            {
              key: '2',
              label: 'Mail',
              icon: <MailOutlined />,
            },
            {
              key: '3',
              label: 'Mobile',
              icon: <MobileOutlined />,
            },
          ],
        }}
        trigger={['click']}
      >
        <Button icon={<EllipsisOutlined />} />
      </Dropdown>
    </Space.Compact>
    <br />
    <Space.Compact block>
      <Button type="primary">Button 1</Button>
      <Button type="primary">Button 2</Button>
      <Button type="primary">Button 3</Button>
      <Button type="primary">Button 4</Button>
      <Tooltip title="Tooltip">
        <Button type="primary" icon={<DownloadOutlined />} disabled />
      </Tooltip>
      <Tooltip title="Tooltip">
        <Button type="primary" icon={<DownloadOutlined />} />
      </Tooltip>
    </Space.Compact>
    <br />
    <Space.Compact block>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
      <Tooltip title="Tooltip">
        <Button icon={<DownloadOutlined />} disabled />
      </Tooltip>
      <Tooltip title="Tooltip">
        <Button icon={<DownloadOutlined />} />
      </Tooltip>
      <Button type="primary">Button 4</Button>
      <Dropdown
        placement="bottomRight"
        menu={{
          items: [
            {
              key: '1',
              label: '1st item',
            },
            {
              key: '2',
              label: '2nd item',
            },
            {
              key: '3',
              label: '3rd item',
            },
          ],
        }}
        trigger={['click']}
      >
        <Button type="primary" icon={<EllipsisOutlined />} />
      </Dropdown>
    </Space.Compact>
  </div>
);

export default App;
```

### 垂直方向紧凑布局

垂直方向的紧凑布局，目前仅支持 Button 组合。

```tsx
import React from 'react';
import { Button, Space } from 'gzd';

const App: React.FC = () => (
  <Space>
    <Space.Compact orientation="vertical">
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Space.Compact>
    <Space.Compact orientation="vertical">
      <Button type="dashed">Button 1</Button>
      <Button type="dashed">Button 2</Button>
      <Button type="dashed">Button 3</Button>
    </Space.Compact>
    <Space.Compact orientation="vertical">
      <Button type="primary">Button 1</Button>
      <Button type="primary">Button 2</Button>
      <Button type="primary">Button 3</Button>
    </Space.Compact>
    <Space.Compact orientation="vertical">
      <Button variant="outlined">Button 1</Button>
      <Button variant="outlined">Button 2</Button>
      <Button variant="outlined">Button 3</Button>
    </Space.Compact>
  </Space>
);

export default App;
```


## API

通用属性参考：[通用属性](/react/common-props)

### Space

| 参数        | 说明                                                     | 类型                                     | 默认值       |
| ----------- | -------------------------------------------------------- | ---------------------------------------- | ------------ |
| align       | 对齐方式                                                 | `start` \| `end` \|`center` \|`baseline` | -            |
| orientation | 间距方向                                                 | `vertical` \| `horizontal`               | `horizontal` |
| size        | 间距大小                                                 | [Size](#size) \| [Size\[\]](#size)       | `small`      | 4.1.0 \ |
| separator   | 设置分隔符                                               | ReactNode                                | -            |
| vertical    | 是否垂直，和 `orientation` 同时配置以 `orientation` 优先 | boolean                                  | false        |
| wrap        | 是否自动换行，仅在 `horizontal` 时有效                   | boolean                                  | false        |

### Size

`'small' | 'medium' | 'large' | number`

### Space.Compact

需要表单组件之间紧凑连接且合并边框时，使用 Space.Compact，支持的组件有：

- Button
- AutoComplete
- Cascader
- DatePicker
- Input/Input.Search
- InputNumber
- Select
- TimePicker
- TreeSelect

| 参数        | 说明                                                     | 类型                           | 默认值       |
| ----------- | -------------------------------------------------------- | ------------------------------ | ------------ |
| block       | 将宽度调整为父元素宽度的选项                             | boolean                        | false        |
| orientation | 指定排列方向                                             | `vertical` \| `horizontal`     | `horizontal` |
| size        | 子组件大小                                               | `large` \| `medium` \| `small` | `medium`     |
| vertical    | 是否垂直，和 `orientation` 同时配置以 `orientation` 优先 | boolean                        | false        |

### Space.Addon

用于在紧凑布局中创建自定义单元格。

| 参数     | 说明       | 类型      | 默认值 |
| -------- | ---------- | --------- | ------ |
| children | 自定义内容 | ReactNode | -      |