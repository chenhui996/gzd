---
group: 通用
title: ConfigProvider 全局配置
---

# ConfigProvider 全局配置

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

`ConfigProvider` 继承 Ant Design 的配置能力，公开类型仍为 `GZDConfigProviderProps`。以下列出新增属性和调整的默认行为：

| 属性        | 说明                      | 类型                                                         | 默认值        |
| ----------- | ------------------------- | ------------------------------------------------------------ | ------------- |
| themeMode   | 组件库的主题模式          | `'gold-dark' \| 'gold-light' \| 'blue-dark' \| 'blue-light'` | `'gold-dark'` |
| cssVarScope | antd CSS 变量隔离作用域。默认不需要传，仅在子应用独立主题、隔离运行或多版本共存时传入稳定应用标识 | `string` | - |
| prefixCls | 底层 antd 组件类名前缀；嵌套 gzd Provider 默认继承父级配置 | `string` | `'gz'` |
| theme.cssVar | 显式覆盖 antd 变量的 `prefix` 或主题作用域 `key`；通常无需设置 | `{ prefix?: string; key?: string }` | 自动生成 |

## 样式命名空间

包名和导入路径保持 `gzd`；在本组件包裹的子树中，按钮等底层组件默认生成
`gz-btn`、`gz-select` 等类名，自有主题类名使用 `gz-*`。
未使用本组件时，底层 antd 仍使用它自己的默认前缀 `ant`。图标前缀保持 `anticon`，
AG Grid 的原生类名和变量保持 `ag-*`、`--ag-*`。

自有 Token 导出函数默认生成 `--gz-*`；antd 的计算后变量默认生成 `--gz-ant-*`。
两者的尺寸值格式不同：自有 Token 保留原始数字，antd 的尺寸变量可能带 `px`。
因此不要把这两套变量配置为同一前缀，否则现有 `calc(... * 1px)` 样式可能失效。

默认主题作用域包含 React `useId` 生成的实例标识，同屏两个 Provider 使用不同
`theme.token` 时不会复用同一个变量作用域。`cssVarScope` 可指定稳定的应用作用域；
显式指定相同作用域或 `theme.cssVar.key` 时，应保证该作用域内的主题配置一致。
`prefixCls="my-app"` 会生成 `my-app-btn` 和 `--my-app-ant-*`，自有主题标记和
自有 Token 默认前缀仍为 `gz`，不会随底层 antd 的前缀一起变化。

通过 Portal 渲染的 Select、Modal 等组件继承 Provider 的前缀。
静态 `message.xxx`、`Modal.xxx` 不自动继承此上下文，优先使用 `App.useApp()` 或 Hooks API。
