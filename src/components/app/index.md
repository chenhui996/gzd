---
group: 其他
title: App 包裹组件
---

# App 包裹组件

提供可消费上下文的 `message`、`modal`、`notification` 实例，并提供基于 `.ant-app` 的默认重置样式。

## 何时使用

- 应用入口需要统一获取 `message`、`modal`、`notification` 的上下文实例。
- 希望静态反馈方法能够消费 `ConfigProvider` 提供的主题、国际化等上下文配置。

## 代码演示

### 基本用法

`App.useApp` 必须在 `App` 子组件中调用。

```tsx
import React from 'react';
import { App, Button, ConfigProvider, Space } from 'gzd';

const Page: React.FC = () => {
  const { message, modal, notification } = App.useApp();

  return (
    <Space wrap>
      <Button type="primary" onClick={() => message.success('保存成功')}>
        打开消息
      </Button>
      <Button
        onClick={() =>
          modal.warning({
            title: '操作提醒',
            content: '请确认当前操作是否符合预期。',
          })
        }>
        打开弹窗
      </Button>
      <Button
        onClick={() =>
          notification.info({
            message: '通知标题',
            description: '这是一条来自 App 上下文的通知。',
            placement: 'topLeft',
          })
        }>
        打开通知
      </Button>
    </Space>
  );
};

const Demo: React.FC = () => (
  <ConfigProvider>
    <App>
      <Page />
    </App>
  </ConfigProvider>
);

export default Demo;
```

### Hooks 配置

可通过 `message` 与 `notification` 属性配置 App 内部实例。

```tsx
import React from 'react';
import { App, Button, ConfigProvider, Space } from 'gzd';

const Page: React.FC = () => {
  const { message, notification } = App.useApp();

  return (
    <Space>
      <Button type="primary" onClick={() => message.success('仅展示一条消息')}>
        Message
      </Button>
      <Button
        onClick={() =>
          notification.success({
            message: '底部通知',
            description: '该通知使用 App 上的 notification 配置。',
          })
        }>
        Notification
      </Button>
    </Space>
  );
};

const Demo: React.FC = () => (
  <ConfigProvider>
    <App message={{ maxCount: 1 }} notification={{ placement: 'bottomLeft' }}>
      <Page />
    </App>
  </ConfigProvider>
);

export default Demo;
```

## API

通用属性参考：[通用属性](/react/common-props)

`App` 继承 Ant Design `App` 的全部属性。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| component | 设置渲染元素，为 `false` 时不创建 DOM 节点 | `ComponentType \| false` | `div` |
| message | App 内 Message 的全局配置 | `MessageConfig` | - |
| notification | App 内 Notification 的全局配置 | `NotificationConfig` | - |

### 静态方法

| 方法 | 说明 |
| --- | --- |
| App.useApp | 获取当前 App 上下文中的 `message`、`modal`、`notification` 实例 |

## 注意

- 推荐将 `App` 放在 `ConfigProvider` 内部，以便消费组件库主题与 antd Design Token。
- 当 `component={false}` 时不会创建额外 DOM 节点，也不会提供默认重置样式；启用 CSS Var 的场景建议保持默认 `div` 容器。
