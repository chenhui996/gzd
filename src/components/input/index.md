---
group: 数据录入
title: Input 输入框
---

# Input 输入框

通过鼠标或键盘输入内容，是最基础的表单域的包装。

## 何时使用

- 需要用户输入表单域内容时。
- 提供组合型输入框，带搜索的输入框，还可以进行大小选择。

## 代码演示

### 基本使用

基本使用。

```tsx
import React from 'react';
import { Input } from 'gzd';

export default () => <Input placeholder="Basic usage" />;
```

### 自动去除首尾空格

设置 `trim` 后，输入内容会自动去除前后空格，`onChange` 回调中拿到的 `e.target.value` 也是处理后的值。

```tsx
import React, { useState } from 'react';
import { Input, Space, Button } from 'gzd';

export default () => {
  const [value, setValue] = useState('');

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input
        trim
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Try typing spaces before or after text"
      />
      <div>Value: {value || '-'}</div>
    </Space>
  );
};
```

### 三种大小

我们为 `<Input />` 输入框定义了三种尺寸（大、默认、小），高度分别为 `40px`、`32px` 和 `24px`。

```tsx
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Input, Space } from 'gzd';

export default () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Input size="large" placeholder="large size" prefix={<UserOutlined />} />
    <Input placeholder="default size" prefix={<UserOutlined />} />
    <Input size="small" placeholder="small size" prefix={<UserOutlined />} />
  </Space>
);
```

### 形态变体

可以配置不同的组件变体，包含无边框、填充等。

```tsx
import React from 'react';
import { Input, Space } from 'gzd';

export default () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Input placeholder="Outlined" variant="outlined" />
    <Input placeholder="Filled" variant="filled" />
    <Input placeholder="Borderless" variant="borderless" />
  </Space>
);
```

### 紧凑模式

使用 `Space.Compact` 让多个输入框组合更加紧凑。

```tsx
import React from 'react';
import { Input, Space, Button } from 'gzd';

export default () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Space.Compact style={{ width: '100%' }}>
      <Input defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact style={{ width: '100%' }}>
      <Input style={{ width: '20%' }} defaultValue="0571" />
      <Input style={{ width: '80%' }} defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact style={{ width: '100%' }}>
      <Input defaultValue="git@github.com:ant-design/ant-design.git" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
  </Space>
);
```

### 搜索框

带有搜索按钮的输入框。

```tsx
import React from 'react';
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'gzd';

const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1677ff',
    }}
  />
);

const onSearch = (value: string) => console.log(value);

export default () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
    <Search placeholder="input search text" allowClear onSearch={onSearch} style={{ width: 200 }} />
    <Search
      addonBefore="https://"
      placeholder="input search text"
      allowClear
      onSearch={onSearch}
      style={{ width: 304 }}
    />
    <Search placeholder="input search text" onSearch={onSearch} enterButton />
    <Search
      placeholder="input search text"
      allowClear
      enterButton="Search"
      size="large"
      onSearch={onSearch}
    />
    <Search
      placeholder="input search text"
      enterButton="Search"
      size="large"
      suffix={suffix}
      onSearch={onSearch}
    />
  </Space>
);
```

### 搜索框 loading

用于 `onSearch` 的时候展示 `loading`。

```tsx
import React from 'react';
import { Input, Space } from 'gzd';

const { Search } = Input;

export default () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Search placeholder="input search loading default" loading />
    <Search placeholder="input search loading with enterButton" loading enterButton />
    <Search placeholder="input search loading with enterButton" enterButton="Search" size="large" loading />
  </Space>
);
```

### 文本域

用于多行输入。

```tsx
import React from 'react';
import { Input } from 'gzd';

const { TextArea } = Input;

export default () => (
  <>
    <TextArea rows={4} />
    <br />
    <br />
    <TextArea rows={4} placeholder="maxLength is 6" maxLength={6} />
  </>
);
```

### 适应文本高度的文本域

`autoSize` 属性适用于 `textarea` 节点，并且可以通过 `autoSize={{ minRows: 2, maxRows: 6 }}` 指定最小行数和最大行数。

```tsx
import React, { useState } from 'react';
import { Input } from 'gzd';

const { TextArea } = Input;

export default () => {
  const [value, setValue] = useState('');

  return (
    <>
      <TextArea
        placeholder="Autosize height based on content lines"
        autoSize
      />
      <div style={{ margin: '24px 0' }} />
      <TextArea
        placeholder="Autosize height with minimum and maximum number of lines"
        autoSize={{ minRows: 2, maxRows: 6 }}
      />
      <div style={{ margin: '24px 0' }} />
      <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Controlled autosize"
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
    </>
  );
};
```

### 一次性密码框

使用 `<Input.OTP />` 用于验证码/安全码的输入场景。

```tsx
import React from 'react';
import { Input } from 'gzd';

const onChange = (text: string) => {
  console.log('onChange:', text);
};

const sharedProps = {
  onChange,
};

export default () => (
  <Input.OTP formatter={(str) => str.toUpperCase()} {...sharedProps} />
);
```

### 输入时格式化展示

结合组件实现格式化数字输入，或者通过受控模式进行内容的实时格式化。

```tsx
import React, { useState } from 'react';
import { Input } from 'gzd';

export default () => {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      setValue(inputValue);
    }
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      placeholder="Input a number"
      maxLength={16}
    />
  );
};
```

### 前缀和后缀

在输入框上添加前缀或后缀图标。

```tsx
import React from 'react';
import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Input, Space } from 'gzd';

export default () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Input
      placeholder="Enter your username"
      prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
      suffix={
        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
      }
    />
    <Input prefix="￥" suffix="RMB" />
    <Input prefix="￥" suffix="RMB" disabled />
  </Space>
);
```

### 密码框

密码框。

```tsx
import React, { useState } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, Space, Button } from 'gzd';

export default () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input.Password placeholder="input password" />
      <Input.Password
        placeholder="input password"
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
      <Space direction="horizontal">
        <Input.Password
          placeholder="input password"
          visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
        />
        <Button style={{ width: 80 }} onClick={() => setPasswordVisible((prevState) => !prevState)}>
          {passwordVisible ? 'Hide' : 'Show'}
        </Button>
      </Space>
    </Space>
  );
};
```

### 带移除图标

带移除图标的输入框，点击图标删除所有内容。

```tsx
import React from 'react';
import { Input, Space } from 'gzd';

const { TextArea } = Input;

export default () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Input placeholder="input with clear icon" allowClear />
    <TextArea placeholder="textarea with clear icon" allowClear />
  </Space>
);
```

### 带字数提示

展示字数提示。

```tsx
import React from 'react';
import { Input } from 'gzd';

const { TextArea } = Input;

const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  console.log('Change:', e.target.value);
};

export default () => (
  <>
    <Input showCount maxLength={20} onChange={onChange} />
    <br />
    <br />
    <TextArea showCount maxLength={100} onChange={onChange} placeholder="can resize" />
    <br />
    <br />
    <TextArea
      showCount
      maxLength={100}
      onChange={onChange}
      placeholder="disable resize"
      style={{ height: 120, resize: 'none' }}
    />
  </>
);
```

### 定制计数能力

通过 `count` 属性来自定义计数策略、展示与否以及超长后的展示格式。

```tsx
import React from 'react';
import { Input } from 'gzd';

export default () => (
  <Input
    count={{
      show: true,
      max: 10,
      strategy: (txt) => txt.length,
      exceedFormatter: (txt, { max }) => txt.substring(0, max),
    }}
    defaultValue="Hello"
  />
);
```

### 自定义状态

使用 `status` 为 Input 添加自定义状态。

```tsx
import React from 'react';
import { Input, Space } from 'gzd';

export default () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Input status="error" placeholder="Error" />
    <Input status="warning" placeholder="Warning" />
  </Space>
);
```

### 聚焦

你可以通过 ref 控制聚焦与失焦。

```tsx
import React, { useRef } from 'react';
import { Input, Button, Space } from 'gzd';
import type { InputRef } from 'antd';

export default () => {
  const inputRef = useRef<InputRef>(null);

  return (
    <Space>
      <Input ref={inputRef} placeholder="Basic usage" />
      <Button onClick={() => inputRef.current!.focus()}>Focus</Button>
      <Button onClick={() => inputRef.current!.blur()}>Blur</Button>
    </Space>
  );
};
```

## API

### Input

| 参数         | 说明                                                                       | 类型                                                                                          | 默认值     | 版本 |
| ------------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------- | ---- |
| addonAfter   | 带标签的 input，设置后置标签                                               | ReactNode                                                                                     | -          |      |
| addonBefore  | 带标签的 input，设置前置标签                                               | ReactNode                                                                                     | -          |      |
| allowClear   | 可以点击清除图标删除内容                                                   | boolean \| { clearIcon?: ReactNode }                                                          | false      |      |
| bordered     | 是否有边框                                                                 | boolean                                                                                       | true       |      |
| count        | 自定义字数展示和最大长度                                                   | { show?: boolean \| function, max?: number, strategy?: function, exceedFormatter?: function } | -          |      |
| defaultValue | 输入框默认内容                                                             | string                                                                                        | -          |      |
| disabled     | 是否禁用状态，默认为 false                                                 | boolean                                                                                       | false      |      |
| id           | 输入框的 id                                                                | string                                                                                        | -          |      |
| maxLength    | 最大长度                                                                   | number                                                                                        | -          |      |
| prefix       | 带有前缀图标的 input                                                       | ReactNode                                                                                     | -          |      |
| size         | 控件大小                                                                   | `large` \| `middle` \| `small`                                                                | `middle`   |      |
| status       | 设置校验状态                                                               | 'error' \| 'warning'                                                                          | -          |      |
| suffix       | 带有后缀图标的 input                                                       | ReactNode                                                                                     | -          |      |
| trim         | 是否自动去除输入值的前后空格，开启后 `onChange` 回调值也会同步去除前后空格 | boolean                                                                                       | false      |      |
| type         | 声明 input 类型，同原生 input 标签                                         | string                                                                                        | `text`     |      |
| value        | 输入框内容                                                                 | string                                                                                        | -          |      |
| variant      | 形态变体                                                                   | `outlined` \| `borderless` \| `filled`                                                        | `outlined` |      |
| onChange     | 输入框内容变化时的回调                                                     | function(e)                                                                                   | -          |      |
| onPressEnter | 按下回车的回调                                                             | function(e)                                                                                   | -          |      |

### Input.TextArea

| 参数         | 说明                                                                            | 类型                        | 默认值 | 版本 |
| ------------ | ------------------------------------------------------------------------------- | --------------------------- | ------ | ---- |
| autoSize     | 自适应内容高度，可设置为 `true` \| `false` 或对象：`{ minRows: 2, maxRows: 6 }` | boolean \| object           | false  |      |
| onPressEnter | 按下回车的回调                                                                  | function(e)                 | -      |      |
| onResize     | resize 回调                                                                     | function({ width, height }) | -      |      |

### Input.Search

| 参数        | 说明                                                       | 类型                         | 默认值 | 版本 |
| ----------- | ---------------------------------------------------------- | ---------------------------- | ------ | ---- |
| enterButton | 是否有确认按钮，可设为按钮文字。该属性会与 addonAfter 冲突 | boolean \| ReactNode         | false  |      |
| loading     | 搜索 loading                                               | boolean                      | false  |      |
| onSearch    | 点击搜索图标、清除图标，或按下回车键时的回调               | function(value, event, info) | -      |      |

### Input.Password

| 参数             | 说明                                 | 类型                                                         | 默认值                                                                          | 版本 |
| ---------------- | ------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------- | ---- |
| iconRender       | 自定义切换按钮                       | (visible) => ReactNode                                       | (visible) => (visible ? &lt;EyeOutlined /&gt; : &lt;EyeInvisibleOutlined /&gt;) |      |
| visibilityToggle | 是否显示切换按钮，或控制密码是否可见 | boolean \| { visible?: boolean, onVisibleChange?: function } | true                                                                            |      |

### Input.OTP

| 参数         | 说明                               | 类型                                        | 默认值     | 版本 |
| ------------ | ---------------------------------- | ------------------------------------------- | ---------- | ---- |
| defaultValue | 默认值                             | string                                      | -          |      |
| disabled     | 是否禁用                           | boolean                                     | false      |      |
| formatter    | 格式化函数                         | (value: string) => string                   | -          |      |
| length       | OTP 长度                           | number                                      | 6          |      |
| mask         | 是否隐藏密码                       | boolean \| string                           | false      |      |
| separator    | 自定义分隔符                       | ReactNode \| ((index: number) => ReactNode) | -          |      |
| size         | 控件大小                           | `large` \| `middle` \| `small`              | `middle`   |      |
| status       | 设置校验状态                       | 'error' \| 'warning'                        | -          |      |
| type         | 声明 input 类型，同原生 input 标签 | string                                      | `text`     |      |
| value        | OTP 的值                           | string                                      | -          |      |
| variant      | 形态变体                           | `outlined` \| `borderless` \| `filled`      | `outlined` |      |
| onChange     | OTP 值变化时的回调                 | (value: string) => void                     | -          |      |
| onInput      | 每个输入框输入时的回调             | (value: string[]) => void                   | -          |      |

更多属性请参考 [Ant Design Input](https://ant.design/components/input-cn/)。
