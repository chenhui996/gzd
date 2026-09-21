---
group: 导航
title: Breadcrumb 面包屑
---

# Breadcrumb 面包屑

显示当前页面在系统层级结构中的位置，并能向上返回。

## 何时使用

- 当系统拥有超过两级以上的层级结构时；
- 当需要告知用户『你在哪里』时；
- 当需要向上导航的功能时。

## 代码演示

### 基本

最简单的用法。

```tsx
import React from 'react';
import { Breadcrumb } from 'gzd';

const App: React.FC = () => {
  return (
    <Breadcrumb
      items={[
        {
          title: 'Home',
        },
        {
          title: <a href="">Application Center</a>,
        },
        {
          title: <a href="">Application List</a>,
        },
        {
          title: 'An Application',
        },
      ]}
    />
  );
};

export default App;
```


### 带有图标的

图标放在文字前面。

```tsx
import React from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'gzd';

const App: React.FC = () => (
  <Breadcrumb
    items={[
      {
        href: '',
        title: <HomeOutlined />,
      },
      {
        href: '',
        title: (
          <>
            <UserOutlined />
            <span>Application List</span>
          </>
        ),
      },
      {
        title: 'Application',
      },
    ]}
  />
);

export default App;
```

### 带有参数的

带有路由参数的。

```tsx
import React from 'react';
import { Breadcrumb } from 'gzd';

const App: React.FC = () => (
  <Breadcrumb
    items={[
      {
        title: 'Users',
      },
      {
        title: ':id',
        href: '',
      },
    ]}
    params={{ id: 1 }}
  />
);

export default App;
```

### 分隔符

使用 `separator=">"` 可以自定义分隔符。

```tsx
import React from 'react';
import { Breadcrumb } from 'gzd';

const App: React.FC = () => (
  <Breadcrumb
    separator=">"
    items={[
      {
        title: 'Home',
      },
      {
        title: 'Application Center',
        href: '',
      },
      {
        title: 'Application List',
        href: '',
      },
      {
        title: 'An Application',
      },
    ]}
  />
);

export default App;
```

### Debug Routes

原 `routes` 调试。

```tsx
import React from 'react';
import { Breadcrumb } from 'gzd';

export default () => (
  <Breadcrumb
    routes={[
      {
        path: '/home',
        breadcrumbName: 'Home',
      },
      {
        path: '/user',
        breadcrumbName: 'User',
        children: [
          {
            path: '/user1',
            breadcrumbName: 'User1',
          },
          {
            path: '/user2',
            breadcrumbName: 'User2',
          },
        ],
      },
    ]}
  />
);
```

## API

通用属性参考：[通用属性](/react/common-props)

### Breadcrumb

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dropdownIcon | 自定义下拉图标 | ReactNode | `<DownOutlined />` |
| itemRender | 自定义链接函数，和 react-router 配置使用 | (route, params, routes, paths) => ReactNode | - |
| params | 路由的参数 | object | - |
| items | 路由栈信息 | [items\[\]](#itemtype) | - |
| separator | 分隔符自定义 | ReactNode | `/` |
| ref | Breadcrumb 根元素（`nav`） | React.Ref&lt;HTMLElement&gt; | - |

### ItemType

> type ItemType = Omit<[RouteItemType](#routeitemtype), 'title' | 'path'> | [SeparatorType](#separatortype)

### RouteItemType

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | 自定义类名 | string | - |
| dropdownProps | 弹出下拉菜单的自定义配置 | [Dropdown](/components/dropdown-cn), tips：链接暂无，查看 antd 官网 | - |
| href | 链接的目的地，不能和 `path` 共用 | string | - |
| path | 拼接路径，每一层都会拼接前一个 `path` 信息。不能和 `href` 共用 | string | - |
| menu | 菜单配置项 | [MenuProps](/components/menu-cn/#api), tips：链接暂无，查看 antd 官网 | - |
| onClick | 单击事件 | (e:MouseEvent) => void | - |
| title | 名称 | ReactNode | - |

### SeparatorType

```ts
const item = {
  type: 'separator', // Must have
  separator: '/',
};
```

| 参数      | 说明           | 类型        | 默认值 |
| --------- | -------------- | ----------- | ------ |
| type      | 标记为分隔符   | `separator` |        |
| separator | 要显示的分隔符 | ReactNode   | `/`    |

### 和 browserHistory 配合 {#use-with-browserhistory}

和 react-router 一起使用时，默认生成的 url 路径是带有 `#` 的，如果和 browserHistory 一起使用的话，你可以使用 `itemRender` 属性定义面包屑链接。

```
import { Breadcrumb } from 'gzd';
import { Link } from 'react-router';

const items = [
  {
    path: '/index',
    title: 'home',
  },
  {
    path: '/first',
    title: 'first',
    children: [
      {
        path: '/general',
        title: 'General',
      },
      {
        path: '/layout',
        title: 'Layout',
      },
      {
        path: '/navigation',
        title: 'Navigation',
      },
    ],
  },
  {
    path: '/second',
    title: 'second',
  },
];

function itemRender(currentRoute, params, items, paths) {
  const isLast = currentRoute?.path === items[items.length - 1]?.path;

  return isLast ? (
    <span>{currentRoute.title}</span>
  ) : (
    <Link to={`/${paths.join('/')}`}>{currentRoute.title}</Link>
  );
}

return <Breadcrumb itemRender={itemRender} items={items} />;
```
