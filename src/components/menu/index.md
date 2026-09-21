---
group: 导航
title: Menu 导航菜单
---

# Menu 导航菜单

为页面和功能提供导航的菜单列表。

## 何时使用

导航菜单是一个网站的灵魂，用户依赖导航在各个页面中进行跳转。一般分为顶部导航和侧边导航，顶部导航提供全局性的类目和功能，侧边导航提供多级结构来收纳和排列网站架构。

## 开发者注意事项

- 强烈推荐使用 `items` 属性来配置菜单的数据结构，摒弃传统的 `Menu.Item` 等 JSX 标签的形式。
- 使用数据化配置可以获得更好的 TypeScript 类型提示、显著的性能提升，也更符合 `gzd` 追求统一化与可控性的设计规范。

## 代码演示

### 顶部导航

水平的顶部导航菜单。

```tsx
import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'gzd';

const items: MenuProps['items'] = [
  {
    label: 'Navigation One',
    key: 'mail',
    icon: <MailOutlined />,
  },
  {
    label: 'Navigation Two',
    key: 'app',
    icon: <AppstoreOutlined />,
    disabled: true,
  },
  {
    label: 'Navigation Three - Submenu',
    key: 'SubMenu',
    icon: <SettingOutlined />,
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          { label: 'Option 1', key: 'setting:1' },
          { label: 'Option 2', key: 'setting:2' },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          { label: 'Option 3', key: 'setting:3' },
          { label: 'Option 4', key: 'setting:4' },
        ],
      },
    ],
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        Navigation Four - Link
      </a>
    ),
    key: 'alipay',
  },
];

export default () => {
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};
```

### 内嵌菜单

垂直菜单，子菜单内嵌在菜单区域。

```tsx
import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'gzd';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
    getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
  ]),

  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),

  getItem('Navigation Three', 'sub4', <SettingOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),
];

export default () => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  return (
    <Menu
      onClick={onClick}
      style={{ width: 256 }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};
```

### 缩起内嵌菜单

内嵌菜单可以被缩起/展开。

```tsx
import React, { useState } from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'gzd';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('Option 3', '3', <ContainerOutlined />),

  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Option 7', '7'),
    getItem('Option 8', '8'),
  ]),

  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Submenu', 'sub3', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
  ]),
];

export default () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ width: 256 }}>
      <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};
```

### 菜单项提示

在内嵌菜单收起时，默认会使用 `label` 作为 `title` 提示。如果需要自定义，可以使用 `title` 属性（设置 `title={null}` 隐藏提示）。

```tsx
import React from 'react';
import { PieChartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'gzd';

const items: MenuProps['items'] = [
  {
    key: '1',
    icon: <PieChartOutlined />,
    label: 'Option 1 (No Tooltip)',
    title: null, // 禁用自带的 tooltip
  },
  {
    key: '2',
    icon: <PieChartOutlined />,
    label: 'Option 2',
    title: 'Custom Tooltip Title', // 自定义 tooltip 文字
  },
];

export default () => (
  <div style={{ width: 256 }}>
    <Menu defaultSelectedKeys={['1']} mode="inline" inlineCollapsed={true} items={items} />
  </div>
);
```

### 只展开当前父级菜单

点击菜单，收起其他展开的所有菜单，保持菜单聚焦简洁。

```tsx
import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'gzd';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Option 1', '1'),
    getItem('Option 2', '2'),
    getItem('Option 3', '3'),
    getItem('Option 4', '4'),
  ]),
  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),
  getItem('Navigation Three', 'sub4', <SettingOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),
];

// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

export default () => {
  const [openKeys, setOpenKeys] = useState(['sub1']);

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      style={{ width: 256 }}
      items={items}
    />
  );
};
```

### 垂直菜单

子菜单是弹出的形式。

```tsx
import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'gzd';

const items: MenuProps['items'] = [
  {
    key: 'sub1',
    icon: <MailOutlined />,
    label: 'Navigation One',
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' },
        ],
      },
      {
        key: 'g2',
        label: 'Item 2',
        type: 'group',
        children: [
          { key: '3', label: 'Option 3' },
          { key: '4', label: 'Option 4' },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    icon: <AppstoreOutlined />,
    label: 'Navigation Two',
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '7', label: 'Option 7' },
          { key: '8', label: 'Option 8' },
        ],
      },
    ],
  },
  {
    key: 'sub4',
    icon: <SettingOutlined />,
    label: 'Navigation Three',
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
];

export default () => (
  <Menu
    onClick={(e) => console.log('click ', e)}
    style={{ width: 256 }}
    mode="vertical"
    items={items}
  />
);
```

### 主题

内建了两套主题 `light` 和 `dark`，默认 `light`。

```tsx
import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import type { MenuProps, MenuTheme } from 'antd';
import { Menu } from 'gzd';

const items: MenuProps['items'] = [
  {
    key: 'sub1',
    icon: <MailOutlined />,
    label: 'Navigation One',
    children: [
      { key: '1', label: 'Option 1' },
      { key: '2', label: 'Option 2' },
      { key: '3', label: 'Option 3' },
      { key: '4', label: 'Option 4' },
    ],
  },
  {
    key: 'sub2',
    icon: <AppstoreOutlined />,
    label: 'Navigation Two',
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '7', label: 'Option 7' },
          { key: '8', label: 'Option 8' },
        ],
      },
    ],
  },
  {
    key: 'sub4',
    icon: <SettingOutlined />,
    label: 'Navigation Three',
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
];

export default () => {
  const [theme, setTheme] = useState<MenuTheme>('dark');
  const [current, setCurrent] = useState('1');

  const changeTheme = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return (
    <>
      <Switch
        checked={theme === 'dark'}
        onChange={changeTheme}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      />
      <br />
      <br />
      <Menu
        theme={theme}
        onClick={onClick}
        style={{ width: 256 }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[current]}
        mode="inline"
        items={items}
      />
    </>
  );
};
```

### 子菜单主题

你可以在 `items` 的子菜单项中单独设置 `theme`。

```tsx
import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'gzd';

const items: MenuProps['items'] = [
  {
    key: 'sub1',
    icon: <MailOutlined />,
    label: 'Navigation One',
    children: [
      { key: '1', label: 'Option 1' },
      { key: '2', label: 'Option 2' },
      { key: '3', label: 'Option 3' },
      { key: '4', label: 'Option 4' },
    ],
  },
  {
    key: 'sub2',
    icon: <AppstoreOutlined />,
    label: 'Navigation Two (Dark)',
    theme: 'dark',
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
    ],
  },
  {
    key: 'sub4',
    icon: <SettingOutlined />,
    label: 'Navigation Three',
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
];

export default () => (
  <Menu
    style={{ width: 256 }}
    defaultOpenKeys={['sub1', 'sub2']}
    mode="inline"
    items={items}
  />
);
```

### 切换菜单类型

展示动态切换模式。

```tsx
import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Radio, Switch, Divider } from 'antd';
import type { MenuProps, MenuTheme } from 'antd';
import { Menu } from 'gzd';

const items: MenuProps['items'] = [
  {
    key: '1',
    icon: <MailOutlined />,
    label: 'Navigation One',
  },
  {
    key: '2',
    icon: <AppstoreOutlined />,
    label: 'Navigation Two',
  },
  {
    key: 'sub1',
    icon: <SettingOutlined />,
    label: 'Navigation Three - Submenu',
    children: [
      { key: '3', label: 'Option 3' },
      { key: '4', label: 'Option 4' },
    ],
  },
];

export default () => {
  const [mode, setMode] = useState<'vertical' | 'inline' | 'horizontal'>('inline');
  const [theme, setTheme] = useState<MenuTheme>('light');

  return (
    <>
      <Radio.Group onChange={(e) => setMode(e.target.value)} value={mode} style={{ marginBottom: 8 }}>
        <Radio.Button value="horizontal">Horizontal</Radio.Button>
        <Radio.Button value="vertical">Vertical</Radio.Button>
        <Radio.Button value="inline">Inline</Radio.Button>
      </Radio.Group>
      <Divider type="vertical" />
      <Switch
        checked={theme === 'dark'}
        onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      />
      <br />
      <br />
      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode={mode}
        theme={theme}
        items={items}
      />
    </>
  );
};
```

### 自定义弹出框

通过 `popupClassName` 和 `popupOffset` 自定义弹出层类名与偏移量。

```tsx
import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'gzd';

const items: MenuProps['items'] = [
  {
    key: 'sub1',
    icon: <MailOutlined />,
    label: 'Navigation One (offset [20, 20])',
    popupOffset: [20, 20],
    children: [
      { key: '1', label: 'Option 1' },
      { key: '2', label: 'Option 2' },
    ],
  },
  {
    key: 'sub2',
    icon: <AppstoreOutlined />,
    label: 'Navigation Two',
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
    ],
  },
];

export default () => (
  <Menu
    style={{ width: 256 }}
    mode="vertical"
    items={items}
  />
);
```

## API

### Menu

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultOpenKeys | 初始展开的 SubMenu 菜单项 key 数组 | string\[] | - | |
| defaultSelectedKeys | 初始选中的菜单项 key 数组 | string\[] | - | |
| forceSubMenuRender | 在子菜单隐藏之前是否渲染到 DOM 中 | boolean | false | |
| inlineCollapsed | inline 时菜单是否收起状态 | boolean | - | |
| inlineIndent | inline 模式的菜单缩进宽度 | number | 24 | |
| items | 菜单内容 | [ItemType](#itemtype)\[] | - | |
| mode | 菜单类型，现在支持垂直、水平、和内嵌模式三种 | `vertical` \| `horizontal` \| `inline` | `vertical` | |
| multiple | 是否允许多选 | boolean | false | |
| openKeys | 当前展开的 SubMenu 菜单项 key 数组 | string\[] | - | |
| selectable | 是否允许选中 | boolean | true | |
| selectedKeys | 当前选中的菜单项 key 数组 | string\[] | - | |
| theme | 主题颜色 | `light` \| `dark` | `light` | |
| triggerSubMenuAction | 展开/关闭子菜单的触发行为 | `hover` \| `click` | `hover` | |
| onClick | 点击 MenuItem 调用此函数 | function({ item, key, keyPath, domEvent }) | - | |
| onDeselect | 取消选中时调用，仅在 multiple 生效 | function({ item, key, keyPath, selectedKeys, domEvent }) | - | |
| onOpenChange | SubMenu 展开/关闭的回调 | function(openKeys: string\[]) | - | |
| onSelect | 被选中时调用 | function({ item, key, keyPath, selectedKeys, domEvent }) | - | |

### ItemType

`items` 属性的数据类型，可包含以下配置：

#### MenuItemType

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| danger | 是否展示为危险菜单项 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| icon | 菜单图标 | ReactNode | - |
| key | item 的唯一标志 | string | - |
| label | 菜单项标题 | ReactNode | - |
| title | 设置收起时展示的悬浮标题 | string | - |

#### SubMenuType

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 子菜单的菜单项 | ItemType\[] | - |
| disabled | 是否禁用 | boolean | false |
| icon | 菜单图标 | ReactNode | - |
| key | item 的唯一标志 | string | - |
| label | 菜单项标题 | ReactNode | - |
| popupClassName | 子菜单样式，仅在 `mode="horizontal"` 或 `mode="vertical"` 时有效 | string | - |
| popupOffset | 子菜单偏移量，仅在 `mode="horizontal"` 或 `mode="vertical"` 时有效 | \[number, number] | - |
| theme | 设置子菜单的主题，默认从 Menu 继承 | `light` \| `dark` | - |
| onTitleClick | 点击子菜单标题 | function({ key, domEvent }) | - |

#### MenuItemGroupType

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 分组的菜单项 | ItemType\[] | - |
| label | 分组标题 | ReactNode | - |
| type | 指定为分组类型 | `group` | - |

#### MenuDividerType

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dashed | 是否虚线 | boolean | false |
| type | 指定为分割线类型 | `divider` | - |

更多属性请参考 [Ant Design Menu](https://ant.design/components/menu-cn/)。
