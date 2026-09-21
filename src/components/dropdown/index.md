---
group: 导航
title: Dropdown 下拉菜单
---

# Dropdown 下拉菜单

向下弹出的列表。

## 何时使用

当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。
- 用于收罗一组命令操作。
- Select 用于选择，而 Dropdown 是命令集合。

## 代码演示

### 基本

最简单的下拉菜单。

```tsx
import React from 'react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { type GZDMenuProps } from 'antd';
import { Dropdown, Space } from 'gzd';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item (disabled)
      </a>
    ),
    icon: <SmileOutlined />,
    disabled: true,
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default App;
```

### 额外节点

带有快捷方式的下拉菜单。

```tsx
import React from 'react';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'gzd';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'My Account',
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: '2',
    label: 'Profile',
    extra: '⌘P',
  },
  {
    key: '3',
    label: 'Billing',
    extra: '⌘B',
  },
  {
    key: '4',
    label: 'Settings',
    icon: <SettingOutlined />,
    extra: '⌘S',
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default App;
```

### 弹出位置

支持 6 个弹出位置。

```tsx
import React from 'react';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'gzd';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item
      </a>
    ),
  },
];

const App: React.FC = () => (
  <Space vertical>
    <Space wrap>
      <Dropdown menu={{ items }} placement="bottomLeft">
        <Button>bottomLeft</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="bottom">
        <Button>bottom</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Button>bottomRight</Button>
      </Dropdown>
    </Space>
    <Space wrap>
      <Dropdown menu={{ items }} placement="topLeft">
        <Button>topLeft</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="top">
        <Button>top</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="topRight">
        <Button>topRight</Button>
      </Dropdown>
    </Space>
  </Space>
);

export default App;
```

### 箭头

可以展示一个箭头。

```tsx
import React from 'react';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'gzd';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item
      </a>
    ),
  },
];

const App: React.FC = () => (
  <Space vertical>
    <Space wrap>
      <Dropdown menu={{ items }} placement="bottomLeft" arrow>
        <Button>bottomLeft</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="bottom" arrow>
        <Button>bottom</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="bottomRight" arrow>
        <Button>bottomRight</Button>
      </Dropdown>
    </Space>
    <Space wrap>
      <Dropdown menu={{ items }} placement="topLeft" arrow>
        <Button>topLeft</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="top" arrow>
        <Button>top</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="topRight" arrow>
        <Button>topRight</Button>
      </Dropdown>
    </Space>
  </Space>
);

export default App;
```

### 其他元素

分割线和不可用菜单项。

```tsx
import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'gzd';

const items: MenuProps['items'] = [
  {
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
    key: '0',
  },
  {
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item
      </a>
    ),
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: '3rd menu item（disabled）',
    key: '3',
    disabled: true,
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default App;
```

### 箭头指向

设置 `arrow` 为 { pointAtCenter: true } 后，箭头将指向目标元素的中心。

```tsx
import React from 'react';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'gzd';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item
      </a>
    ),
  },
];

const App: React.FC = () => (
  <Space vertical>
    <Space wrap>
      <Dropdown menu={{ items }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
        <Button>bottomLeft</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="bottom" arrow={{ pointAtCenter: true }}>
        <Button>bottom</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
        <Button>bottomRight</Button>
      </Dropdown>
    </Space>
    <Space wrap>
      <Dropdown menu={{ items }} placement="topLeft" arrow={{ pointAtCenter: true }}>
        <Button>topLeft</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="top" arrow={{ pointAtCenter: true }}>
        <Button>top</Button>
      </Dropdown>
      <Dropdown menu={{ items }} placement="topRight" arrow={{ pointAtCenter: true }}>
        <Button>topRight</Button>
      </Dropdown>
    </Space>
  </Space>
);

export default App;
```

### 触发方式

默认是移入触发菜单，可以点击触发。

```tsx
import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'gzd';

const items: MenuProps['items'] = [
  {
    label: (
      <a href="https://www.antgroup.com" target="_blank" rel="noopener noreferrer">
        1st menu item
      </a>
    ),
    key: '0',
  },
  {
    label: (
      <a href="https://www.aliyun.com" target="_blank" rel="noopener noreferrer">
        2nd menu item
      </a>
    ),
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items }} trigger={['click']}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Click me
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default App;
```

### 触发事件

点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作。

```tsx
import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, message, Space } from 'gzd';

const onClick: MenuProps['onClick'] = ({ key }) => {
  message.info(`Click on item ${key}`);
};

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items, onClick }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me, Click menu item
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default App;
```

### 带下拉框的按钮

左边是按钮，右边是额外的相关功能菜单。可设置 `icon` 属性来修改右边的图标。

```tsx
import React from 'react';
import { DownOutlined, EllipsisOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { message, Tooltip } from 'antd';
import { Button, Dropdown, Space } from 'gzd';

const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  message.info('Click on left button.');
  console.log('click left button', e);
};

const handleMenuClick: MenuProps['onClick'] = (e) => {
  message.info('Click on menu item.');
  console.log('click', e);
};

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
    icon: <UserOutlined />,
  },
  {
    label: '2nd menu item',
    key: '2',
    icon: <UserOutlined />,
  },
  {
    label: '3rd menu item',
    key: '3',
    icon: <UserOutlined />,
    danger: true,
  },
  {
    label: '4rd menu item',
    key: '4',
    icon: <UserOutlined />,
    danger: true,
    disabled: true,
  },
];

const menuProps = {
  items,
  onClick: handleMenuClick,
};

const App: React.FC = () => (
  <Space wrap>
    <Space.Compact>
      <Button onClick={handleButtonClick}>Dropdown</Button>
      <Dropdown menu={menuProps} placement="bottomRight">
        <Button icon={<EllipsisOutlined />} />
      </Dropdown>
    </Space.Compact>
    <Space.Compact>
      <Button onClick={handleButtonClick}>Dropdown</Button>
      <Dropdown menu={menuProps} placement="bottomRight">
        <Button icon={<UserOutlined />} />
      </Dropdown>
    </Space.Compact>
    <Space.Compact>
      <Button onClick={handleButtonClick} disabled>
        Dropdown
      </Button>
      <Dropdown menu={menuProps} placement="bottomRight" disabled>
        <Button icon={<EllipsisOutlined />} disabled />
      </Dropdown>
    </Space.Compact>
    <Space.Compact>
      <Tooltip title="tooltip">
        <Button onClick={handleButtonClick}>With Tooltip</Button>
      </Tooltip>
      <Dropdown menu={menuProps} placement="bottomRight">
        <Button loading />
      </Dropdown>
    </Space.Compact>
    <Dropdown menu={menuProps}>
      <Button onClick={handleButtonClick} icon={<DownOutlined />} iconPlacement="end">
        Button
      </Button>
    </Dropdown>
    <Space.Compact>
      <Button onClick={handleButtonClick} danger>
        Danger
      </Button>
      <Dropdown menu={menuProps} placement="bottomRight">
        <Button icon={<EllipsisOutlined />} danger />
      </Dropdown>
    </Space.Compact>
  </Space>
);

export default App;
```

### 扩展菜单

使用 `popupRender` 对下拉菜单进行自由扩展。如果你并不需要 Menu 内容，请直接使用 Popover 组件。

```tsx
import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { theme } from 'antd';
import { Button, Divider, Dropdown, Space } from 'gzd';

const { useToken } = theme;

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
];

const App: React.FC = () => {
  const { token } = useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  return (
    <Dropdown
      menu={{ items }}
      popupRender={(menu) => (
        <div style={contentStyle}>
          {React.cloneElement(
            menu as React.ReactElement<{
              style: React.CSSProperties;
            }>,
            { style: menuStyle },
          )}
          <Divider style={{ margin: 0 }} />
          <Space style={{ padding: 8 }}>
            <Button type="primary">Click me!</Button>
          </Space>
        </div>
      )}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          Hover me
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default App;
```

### 多级菜单

传入的菜单里有多个层级。

```tsx
import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'gzd';

const items: MenuProps['items'] = [
  {
    key: '1',
    type: 'group',
    label: 'Group title',
    children: [
      {
        key: '1-1',
        label: '1st menu item',
      },
      {
        key: '1-2',
        label: '2nd menu item',
      },
    ],
  },
  {
    key: '2',
    label: 'sub menu',
    children: [
      {
        key: '2-1',
        label: '3rd menu item',
      },
      {
        key: '2-2',
        label: '4th menu item',
      },
    ],
  },
  {
    key: '3',
    label: 'disabled sub menu',
    disabled: true,
    children: [
      {
        key: '3-1',
        label: '5d menu item',
      },
      {
        key: '3-2',
        label: '6th menu item',
      },
    ],
  },
];

const App: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Cascading menu
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default App;
```

### 菜单隐藏方式

默认是点击关闭菜单，可以关闭此功能。

```tsx
import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, type DropdownProps  } from 'gzd';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '3') {
      setOpen(false);
    }
  };

  const handleOpenChange: DropdownProps['onOpenChange'] = (nextOpen, info) => {
    if (info.source === 'trigger' || nextOpen) {
      setOpen(nextOpen);
    }
  };

  const items: MenuProps['items'] = [
    {
      label: 'Clicking me will not close the menu.',
      key: '1',
    },
    {
      label: 'Clicking me will not close the menu also.',
      key: '2',
    },
    {
      label: 'Clicking me will close the menu.',
      key: '3',
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}
      onOpenChange={handleOpenChange}
      open={open}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          Hover me
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default App;
```

### 右键菜单

默认是移入触发菜单，可以点击鼠标右键触发。弹出菜单位置会跟随右键点击位置变动。

```tsx
import React from 'react';
import { theme, type MenuProps } from 'antd';
import { Dropdown } from 'gzd';

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

const App: React.FC = () => {
  const {
    token: { colorBgLayout, colorTextTertiary },
  } = theme.useToken();

  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      <div
        style={{
          color: colorTextTertiary,
          background: colorBgLayout,
          height: 200,
          textAlign: 'center',
          lineHeight: '200px',
        }}
      >
        Right Click on here
      </div>
    </Dropdown>
  );
};

export default App;
```

### 加载中状态

添加 `loading` 属性即可让按钮处于加载状态，最后两个按钮演示点击后进入加载状态。

```tsx
import React, { useState } from 'react';
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'gzd';

const items: MenuProps['items'] = [
  {
    label: 'Submit and continue',
    key: '1',
  },
];

const App: React.FC = () => {
  const [loadings, setLoadings] = useState<boolean[]>([]);

  const enterLoading = (index: number) => {
    setLoadings((state) => {
      const newLoadings = [...state];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((state) => {
        const newLoadings = [...state];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };

  return (
    <Space vertical>
      <Space.Compact>
        <Button type="primary" loading>
          Submit
        </Button>
        <Dropdown menu={{ items }}>
          <Button type="primary" icon={<EllipsisOutlined />} />
        </Dropdown>
      </Space.Compact>
      <Space.Compact size="small">
        <Button type="primary" loading>
          Submit
        </Button>
        <Dropdown menu={{ items }}>
          <Button type="primary" icon={<EllipsisOutlined />} />
        </Dropdown>
      </Space.Compact>
      <Space.Compact>
        <Button type="primary" loading={loadings[0]} onClick={() => enterLoading(0)}>
          Submit
        </Button>
        <Dropdown menu={{ items }}>
          <Button type="primary" icon={<EllipsisOutlined />} />
        </Dropdown>
      </Space.Compact>
      <Space.Compact>
        <Button loading={loadings[1]} onClick={() => enterLoading(1)}>
          Submit
        </Button>
        <Dropdown menu={{ items }}>
          <Button icon={<DownOutlined />} />
        </Dropdown>
      </Space.Compact>
    </Space>
  );
};

export default App;
```

### 菜单可选选择

添加 `menu` 中的 `selectable` 属性可以开启选择能力。

```tsx
import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Typography } from 'antd';
import { Dropdown, Space } from 'gzd';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'Item 1',
  },
  {
    key: '2',
    label: 'Item 2',
  },
  {
    key: '3',
    label: 'Item 3',
  },
];

const App: React.FC = () => (
  <Dropdown
    menu={{
      items,
      selectable: true,
      defaultSelectedKeys: ['3'],
    }}
  >
    <Typography.Link>
      <Space>
        Selectable
        <DownOutlined />
      </Space>
    </Typography.Link>
  </Dropdown>
);

export default App;
```

## API

通用属性参考：[通用属性](/react/common-props)

### Dropdown

| 参数               | 说明                                                                                                 | 类型                                                           | 默认值              |
| ------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------- |
| arrow              | 下拉框箭头是否显示                                                                                   | boolean \| { pointAtCenter: boolean }                          | false               |
| autoAdjustOverflow | 下拉框被遮挡时自动调整位置                                                                           | boolean                                                        | true                |
| disabled           | 菜单是否禁用                                                                                         | boolean                                                        | -                   |  |
| destroyOnHidden    | 关闭后是否销毁 Dropdown                                                                              | boolean                                                        | false               |
| popupRender        | 自定义弹出框内容                                                                                     | (menus: ReactNode) => ReactNode                                | -                   |
| getPopupContainer  | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 | (triggerNode: HTMLElement) => HTMLElement                      | () => document.body |
| menu               | 菜单配置项                                                                                           | [MenuProps](/components/menu-cn#api)                           | -                   |
| placement          | 菜单弹出位置：`bottom` `bottomLeft` `bottomRight` `top` `topLeft` `topRight`                         | string                                                         | `bottomLeft`        |
| trigger            | 触发下拉的行为，移动端不支持 hover                                                                   | Array&lt;`click`\|`hover`\|`contextMenu`>                      | \[`hover`]          |
| open               | 菜单是否显示                                                                                         | boolean                                                        | -                   |
| onOpenChange       | 菜单显示状态改变时调用，点击菜单按钮导致的消失不会触发                                               | (open: boolean, info: { source: 'trigger' \| 'menu' }) => void | -                   |
| ref                | Dropdown 的触发元素                                                                                  | React.Ref&lt;HTMLElement&gt;                                    | -                   |

## 注意

请确保 `Dropdown` 的子元素能接受 `onMouseEnter`、`onMouseLeave`、`onFocus`、`onClick` 事件。

## FAQ

### Dropdown 在水平方向超出屏幕时会被挤压该怎么办？ {#faq-dropdown-squeezed}

你可以通过 `width: max-content` 来解决这个问题，参考 [#43025](https://github.com/ant-design/ant-design/issues/43025#issuecomment-1594394135)。(需打开github)
