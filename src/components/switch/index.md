---
group: 数据录入
title: Switch 开关
---

# Switch 开关

使用开关切换两种状态之间。

## 何时使用

- 需要表示开关状态/两种状态之间的切换时；
- 和 `checkbox` 的区别是，切换 `switch` 会直接触发状态改变，而 `checkbox` 一般用于状态标记，需要和提交操作配合。

## 代码演示

### 基本

最简单的用法。

```tsx
import React from 'react';
import { Switch } from 'gzd';

const onChange = (checked: boolean) => {
  console.log(`switch to ${checked}`);
};

const App: React.FC = () => <Switch defaultChecked onChange={onChange} />;

export default App;
```

### 不可用

Switch 失效状态。

```tsx
import React, { useState } from 'react';
import { Button, Space, Switch } from 'gzd';

const App: React.FC = () => {
  const [disabled, setDisabled] = useState(true);

  const toggle = () => {
    setDisabled(!disabled);
  };

  return (
    <Space vertical>
      <Switch disabled={disabled} defaultChecked />
      <Button type="primary" onClick={toggle}>
        Toggle disabled
      </Button>
    </Space>
  );
};

export default App;
```

### 文字和图标

带有文字和图标。

```tsx
import React from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Space, Switch } from 'gzd';

const App: React.FC = () => (
  <Space vertical>
    <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
    <Switch checkedChildren="1" unCheckedChildren="0" />
    <Switch
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
      defaultChecked
    />
  </Space>
);

export default App;
```

### 两种大小

`size="small"` 表示小号开关。

```tsx
import React from 'react';
import { Switch } from 'gzd';

const App: React.FC = () => (
  <>
    <Switch defaultChecked />
    <br />
    <Switch size="small" defaultChecked />
  </>
);

export default App;
```

### 加载中

标识开关操作仍在执行中。

```tsx
import React from 'react';
import { Switch } from 'gzd';

const App: React.FC = () => (
  <>
    <Switch loading defaultChecked />
    <br />
    <Switch size="small" loading />
  </>
);

export default App;
```



## API

通用属性参考：[通用属性](/react/common-props)

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 指定当前是否选中 | boolean | false |
| checkedChildren | 选中时的内容 | ReactNode | - |
| className | Switch 器类名 | string | - |
| defaultChecked | 初始是否选中 | boolean | false |
| defaultValue | `defaultChecked` 的别名 | boolean | - |
| disabled | 是否禁用 | boolean | false |
| loading | 加载中的开关 | boolean | false |
| size | 开关大小，可选值：`medium` `small` | string | `medium` |
| unCheckedChildren | 非选中时的内容 | ReactNode | - |
| value | `checked` 的别名 | boolean | - |
| onChange | 变化时的回调函数 | function(checked: boolean, event: Event) | - |
| onClick | 点击时的回调函数 | function(checked: boolean, event: Event) | - |

## 方法

| 名称    | 描述     |
| ------- | --- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |
