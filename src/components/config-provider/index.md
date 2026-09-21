---
group: 通用
title: ConfigProvider 全局配置
---

# GZDConfigProvider 全局配置

为了提供统一的样式，`gzd` 提供了一个全局配置组件 `ConfigProvider`。

这个组件内部封装了 Ant Design 的 `ConfigProvider`，并集成了 UI 部门提供的 Design Tokens，支持金色主题、蓝色主题以及亮色/暗色模式切换。

## 基础用法

在您的应用入口处，使用 `ConfigProvider` 包裹整个应用。默认情况下它会应用金色主题暗色模式。

```tsx
import React, { useState } from "react";
import { ConfigProvider, Button } from "gzd";
import { Flex, Switch } from "antd";

const App = () => {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const isDark = mode === "dark";
  const themeMode = `gold-${mode}` as const;

  return (
    <ConfigProvider themeMode={themeMode}>
      <div
        style={{
          padding: 24,
          background: isDark ? "#141414" : "#fff",
          color: isDark ? "#fff" : "#000",
          minHeight: 200,
          transition: "all 0.3s",
        }}>
        <Flex vertical gap="middle" align="flex-start">
          <Flex align="center" gap="small">
            <span>暗色模式:</span>
            <Switch
              checked={isDark}
              onChange={(checked) => setMode(checked ? "dark" : "light")}
            />
          </Flex>

          <Button type="primary">Primary Button</Button>
          <Button>Default Button</Button>
          <Button type="dashed">Dashed Button</Button>
        </Flex>
      </div>
    </ConfigProvider>
  );
};

export default App;
```

## 暗金色深色主题

```tsx
import React from "react";
import {
  Alert,
  Button,
  ConfigProvider,
  Flex,
  Input,
  Tag,
  Tabs,
} from "gzd";
import { theme } from "antd";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Tab 1",
    children: "Content of Tab Pane 1",
  },
  {
    key: "2",
    label: "Tab 2",
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "Tab 3",
    children: "Content of Tab Pane 3",
  },
];

const App = () => (
  <ConfigProvider themeMode="gold-dark">
    <div style={{ padding: 24, background: "#000", minHeight: 280 }}>
      <Flex vertical gap="middle" align="flex-start">
        <Flex gap="small" wrap>
          <Button color="primary" variant="solid">
            Primary Solid
          </Button>
          <Button color="primary" variant="outlined">
            Primary Outlined
          </Button>
          <Button color="default" variant="filled">
            Default Filled
          </Button>
          <Button color="danger" variant="solid">
            Danger Solid
          </Button>
        </Flex>
        <Input placeholder="Gold dark input" style={{ maxWidth: 320 }} />
        <Flex gap="small" wrap>
          <Tag color="gold">Gold Tag</Tag>
          <Tag color="blue">Blue Tag</Tag>
          <Tag color="error">Error Tag</Tag>
        </Flex>
        <Alert
          showIcon
          type="warning"
          message="Gold dark warning"
          description="This demo is rendered with the generated gold dark design tokens."
        />
        <Tabs defaultActiveKey="1" items={items} />
      </Flex>
    </div>
  </ConfigProvider>
);

export default App;
```

## API

`GZDConfigProvider` 继承了 Ant Design `ConfigProvider` 的所有属性，并在此基础上扩展了以下属性：

| 属性        | 说明                      | 类型                                                         | 默认值        |
| ----------- | ------------------------- | ------------------------------------------------------------ | ------------- |
| themeMode   | 组件库的主题模式          | `'gold-dark' \| 'gold-light' \| 'blue-dark' \| 'blue-light'` | `'gold-dark'` |
| cssVarScope | antd CSS 变量隔离作用域。默认不需要传，仅在子应用独立主题、隔离运行或多版本共存时传入稳定应用标识 | `string` | - |

> 备注：`themeMode` 由主应用根据部署客户主题色和当前用户明暗模式映射后下发。antd CSS 变量的 `key` 和 `prefix` 由组件库根据 `themeMode` 自动生成；隔离场景使用 `cssVarScope`，不要在业务侧直接维护 `theme.cssVar.key` 和 `theme.cssVar.prefix`。如果传入了不同的 `theme.token` 或 `theme.components` 覆盖，并且同屏还有其他应用实例，应同时设置 `cssVarScope`。
