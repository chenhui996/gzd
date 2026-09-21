---
group: 数据展示
title: Avatar 头像
---

# Avatar 头像

## 设计师专属 {#designers-exclusive}

安装 [Kitchen Sketch 插件 💎](https://kitchen.alipay.com)，一键填充高逼格头像和文本。

## 代码演示

### 基本

头像有三种尺寸，两种形状可选。

```tsx
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'gzd';

const App: React.FC = () => (
  <Space vertical size={16}>
    <Space wrap size={16}>
      <Avatar size={64} icon={<UserOutlined />} />
      <Avatar size="large" icon={<UserOutlined />} />
      <Avatar icon={<UserOutlined />} />
      <Avatar size="small" icon={<UserOutlined />} />
      <Avatar size={14} icon={<UserOutlined />} />
    </Space>
    <Space wrap size={16}>
      <Avatar shape="square" size={64} icon={<UserOutlined />} />
      <Avatar shape="square" size="large" icon={<UserOutlined />} />
      <Avatar shape="square" icon={<UserOutlined />} />
      <Avatar shape="square" size="small" icon={<UserOutlined />} />
      <Avatar shape="square" size={14} icon={<UserOutlined />} />
    </Space>
  </Space>
);

export default App;
```

### 类型

支持三种类型：图片、Icon 以及字符，其中 Icon 和字符型可以自定义图标颜色及背景色。

```tsx
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'gzd';

const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

const App: React.FC = () => (
  <Space size={16} wrap>
    <Avatar icon={<UserOutlined />} />
    <Avatar>U</Avatar>
    <Avatar size={40}>USER</Avatar>
    <Avatar src={url} />
    <Avatar src={<img draggable={false} src={url} alt="avatar" />} />
    <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>U</Avatar>
    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
  </Space>
);

export default App;
```

### 自动调整字符大小

对于字符型的头像，当字符串较长时，字体大小可以根据头像宽度自动调整。也可使用 `gap` 来设置字符距离左右两侧边界单位像素。

```tsx
import React, { useState } from 'react';
import { Avatar, Button } from 'gzd';

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];

const App: React.FC = () => {
  const [user, setUser] = useState(UserList[0]);
  const [color, setColor] = useState(ColorList[0]);
  const [gap, setGap] = useState(GapList[0]);

  const changeUser = () => {
    const index = UserList.indexOf(user);
    setUser(index < UserList.length - 1 ? UserList[index + 1] : UserList[0]);
    setColor(index < ColorList.length - 1 ? ColorList[index + 1] : ColorList[0]);
  };

  const changeGap = () => {
    const index = GapList.indexOf(gap);
    setGap(index < GapList.length - 1 ? GapList[index + 1] : GapList[0]);
  };

  return (
    <>
      <Avatar style={{ backgroundColor: color, verticalAlign: 'middle' }} size="large" gap={gap}>
        {user}
      </Avatar>
      <Button
        size="small"
        style={{ margin: '0 16px', verticalAlign: 'middle' }}
        onClick={changeUser}
      >
        ChangeUser
      </Button>
      <Button size="small" style={{ verticalAlign: 'middle' }} onClick={changeGap}>
        changeGap
      </Button>
    </>
  );
};

export default App;
```

### 带徽标的头像

通常用于消息提示。

```tsx
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import { Avatar, Space } from 'gzd';

const App: React.FC = () => (
  <Space size={24}>
    <Badge count={1}>
      <Avatar shape="square" icon={<UserOutlined />} />
    </Badge>
    <Badge dot>
      <Avatar shape="square" icon={<UserOutlined />} />
    </Badge>
  </Space>
);

export default App;
```

### Avatar.Group

头像组合展现。

```tsx
import React from 'react';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Avatar, Divider } from 'gzd';

const App: React.FC = () => (
  <>
    <Avatar.Group>
      <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
      <a href="https://ant.design">
        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      </a>
      <Tooltip title="Ant User" placement="top">
        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
      </Tooltip>
      <Avatar style={{ backgroundColor: '#1677ff' }} icon={<AntDesignOutlined />} />
    </Avatar.Group>
    <Divider />
    <Avatar.Group
      max={{
        count: 2,
        style: { color: '#f56a00', backgroundColor: '#fde3cf' },
      }}
    >
      <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
      <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      <Tooltip title="Ant User" placement="top">
        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
      </Tooltip>
      <Avatar style={{ backgroundColor: '#1677ff' }} icon={<AntDesignOutlined />} />
    </Avatar.Group>
    <Divider />
    <Avatar.Group
      size="large"
      max={{
        count: 2,
        style: { color: '#f56a00', backgroundColor: '#fde3cf' },
      }}
    >
      <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=3" />
      <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      <Tooltip title="Ant User" placement="top">
        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
      </Tooltip>
      <Avatar style={{ backgroundColor: '#1677ff' }} icon={<AntDesignOutlined />} />
    </Avatar.Group>
    <Divider />
    <Avatar.Group
      size="large"
      max={{
        count: 2,
        style: { color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' },
        popover: { trigger: 'click' },
      }}
    >
      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      <Tooltip title="Ant User" placement="top">
        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
      </Tooltip>
      <Avatar style={{ backgroundColor: '#1677ff' }} icon={<AntDesignOutlined />} />
    </Avatar.Group>
    <Divider />
    <Avatar.Group shape="square">
      <Avatar style={{ backgroundColor: '#fde3cf' }}>A</Avatar>
      <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
      <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
      <Avatar style={{ backgroundColor: '#1677ff' }} icon={<AntDesignOutlined />} />
    </Avatar.Group>
  </>
);

export default App;
```

### 响应式尺寸

头像大小可以根据屏幕大小自动调整。

```tsx
import React from 'react';
import { AntDesignOutlined } from '@ant-design/icons';
import { Avatar } from 'gzd';

const App: React.FC = () => (
  <Avatar
    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
    icon={<AntDesignOutlined />}
  />
);

export default App;
```



## API

通用属性参考：[通用属性](/react/common-props)

### Avatar

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| alt | 图像无法显示时的替代文本 | string | - |
| gap | 字符��型距离左右两侧边界单位像素 | number | 4 |
| icon | 设置头像的自定义图标 | ReactNode | - |
| shape | 指定头像的形状 | `circle` \ | `square` | `circle` |
| size | 设置头像的大小 | number \ | `large` \ | `medium` \ | `small` \ | { xs: number, sm: number, ...} | `medium` |
| src | 图片类头像的资源地址或者图片元素 | string \ | ReactNode | - |
| srcSet | 设置图片类头像响应式资源地址 | string | - |
| draggable | 图片是否允许拖动 | boolean \ | `'true'` \ | `'false'` | true |
| crossOrigin | CORS 属性设置 | `'anonymous'` \ | `'use-credentials'` \ | `''` | - |
| onError | 图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为 | () => boolean | - |

> Tip：你可以设置 `icon` 或 `children` 作为图片加载失败的默认 fallback 行为，优先级为 `icon` > `children`

### Avatar.Group

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| max | 设置最多显示相关配置 | `{ count?: number; style?: CSSProperties; popover?: PopoverProps }` | - |
| size | 设置头像的大小 | number \ | `large` \ | `medium` \ | `small` \ | { xs: number, sm: number, ...} | `medium` |
| shape | 设置头像的形状 | `circle` \ | `square` | `circle` |
