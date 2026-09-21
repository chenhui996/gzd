---
group: 数据录入
title: InputNumber 数字输入框
---

# InputNumber 数字输入框

通过鼠标或键盘，输入范围内的数值。

## 何时使用

当需要获取标准数值时。

## 代码演示

### 基本

数字输入框。

```tsx
import React from 'react';
import type { InputNumberProps } from 'antd';
import { InputNumber } from 'gzd';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const App: React.FC = () => <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />;

export default App;

```

### 三种大小

三种大小的数字输入框，当 size 分别为 `large` 和 `small` 时，输入框高度为 `40px` 和 `24px` ，默认高度为 `32px`。

```tsx
import React from 'react';
import type { InputNumberProps } from 'antd';
import { InputNumber, Space } from 'gzd';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const App: React.FC = () => (
  <Space wrap>
    <InputNumber size="large" min={1} max={100000} defaultValue={3} onChange={onChange} />
    <InputNumber min={1} max={100000} defaultValue={3} onChange={onChange} />
    <InputNumber size="small" min={1} max={100000} defaultValue={3} onChange={onChange} />
  </Space>
);

export default App;

```

### 不可用

点击按钮切换可用状态。

```tsx
import React, { useState } from 'react';
import { Button, InputNumber } from 'gzd';

const App: React.FC = () => {
  const [disabled, setDisabled] = useState(true);

  const toggle = () => {
    setDisabled(!disabled);
  };

  return (
    <>
      <InputNumber min={1} max={10} disabled={disabled} defaultValue={3} />
      <div style={{ marginTop: 20 }}>
        <Button onClick={toggle} type="primary">
          Toggle disabled
        </Button>
      </div>
    </>
  );
};

export default App;

```

### 高精度小数

通过 `stringMode` 开启高精度小数支持，`onChange` 事件将返回 string 类型。对于旧版浏览器，你需要 BigInt polyfill。

```tsx
import React from 'react';
import type { InputNumberProps } from 'antd';
import { InputNumber } from 'gzd';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const App: React.FC = () => (
  <InputNumber<string>
    style={{ width: 200 }}
    defaultValue="1"
    min="0"
    max="10"
    step="0.00000000000001"
    onChange={onChange}
    stringMode
  />
);

export default App;

```

### 格式化展示

通过 `formatter` 格式化数字，以展示具有具体含义的数据，往往需要配合 `parser` 一起使用。

> 这里有一个更复杂的货币格式化输入框：[https://codesandbox.io/s/currency-wrapper-antd-input-3ynzo](https://codesandbox.io/s/currency-wrapper-antd-input-3ynzo)

```tsx
import React from 'react';
import type { InputNumberProps } from 'antd';
import { InputNumber, Space } from 'gzd';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const formatter: InputNumberProps<number>['formatter'] = (value) => {
  const [start, end] = `${value}`.split('.') || [];
  const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `$ ${end ? `${v}.${end}` : `${v}`}`;
};

const App: React.FC = () => (
  <Space>
    <InputNumber<number>
      defaultValue={1000}
      formatter={formatter}
      parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
      onChange={onChange}
    />
    <InputNumber<number>
      defaultValue={100}
      min={0}
      max={100}
      formatter={(value) => `${value}%`}
      parser={(value) => value?.replace('%', '') as unknown as number}
      onChange={onChange}
    />
  </Space>
);

export default App;

```

### 键盘行为

使用 `keyboard` 属性可以控制键盘行为。

```tsx
import React, { useState } from 'react';
import { Checkbox, InputNumber, Space } from 'gzd';

const App: React.FC = () => {
  const [keyboard, setKeyboard] = useState(true);

  return (
    <Space>
      <InputNumber min={1} max={10} keyboard={keyboard} defaultValue={3} />
      <Checkbox
        onChange={() => {
          setKeyboard(!keyboard);
        }}
        checked={keyboard}
      >
        Toggle keyboard
      </Checkbox>
    </Space>
  );
};

export default App;

```

### 鼠标滚轮

启用鼠标滚轮控制。

```tsx
import React from 'react';
import type { InputNumberProps } from 'antd';
import { InputNumber } from 'gzd';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const onStep: InputNumberProps['onStep'] = (value, info) => {
  console.log('onStep', value, info);
};

const App: React.FC = () => (
  <InputNumber
    min={1}
    max={10}
    defaultValue={3}
    onChange={onChange}
    onStep={onStep}
    changeOnWheel
  />
);

export default App;

```

### 形态变体

InputNumber 形态变体，可选 `outlined` `filled` `borderless` `underlined` 四种形态。

```tsx
import React from 'react';
import { InputNumber } from 'gzd';
import { Flex } from 'antd';

const App: React.FC = () => (
  <Flex vertical gap={12}>
    <InputNumber placeholder="Outlined" style={{ width: 200 }} />
    <InputNumber placeholder="Filled" variant="filled" style={{ width: 200 }} />
    <InputNumber placeholder="Borderless" variant="borderless" style={{ width: 200 }} />
    <InputNumber placeholder="Underlined" variant="underlined" style={{ width: 200 }} />
  </Flex>
);

export default App;

```

### 拨轮

数字拨轮。

```tsx
import React from 'react';
import type { InputNumberProps } from 'antd';
import { InputNumber } from 'gzd';
import { Flex } from 'antd';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const sharedProps = {
  mode: 'spinner' as const,
  min: 1,
  max: 10,
  defaultValue: 3,
  onChange,
  style: { width: 150 },
};

const App: React.FC = () => (
  <Flex vertical gap={16}>
    <InputNumber {...sharedProps} placeholder="Outlined" />
    <InputNumber {...sharedProps} variant="filled" placeholder="Filled" />
  </Flex>
);

export default App;

```

### 超出边界

当通过受控将 `value` 超出边界时，提供警告样式。

```tsx
import React, { useState } from 'react';
import { Button, InputNumber, Space } from 'gzd';

const App: React.FC = () => {
  const [value, setValue] = useState<string | number | null>('99');

  return (
    <Space>
      <InputNumber min={1} max={10} value={value} onChange={setValue} />
      <Button
        type="primary"
        onClick={() => {
          setValue(99);
        }}
      >
        Reset
      </Button>
    </Space>
  );
};

export default App;

```

### 前缀/后缀

在输入框上添加前缀或后缀图标。

```tsx
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Flex, InputNumber, Space } from 'antd';

const App: React.FC = () => (
  <Flex vertical gap={16}>
    <InputNumber prefix="￥" style={{ width: '100%' }} />

    <Space.Compact block>
      <Space.Addon>
        <UserOutlined />
      </Space.Addon>
      <InputNumber prefix="￥" style={{ width: '100%' }} />
    </Space.Compact>

    <InputNumber prefix="￥" disabled style={{ width: '100%' }} />

    <InputNumber suffix="RMB" style={{ width: '100%' }} />
  </Flex>
);

export default App;
```


### 自定义状态

使用 `status` 为 InputNumber 添加状态，可选 `error` 或者 `warning`。

```tsx
import React from 'react';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import { InputNumber, Space } from 'gzd';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }}>
    <InputNumber status="error" style={{ width: '100%' }} />
    <InputNumber status="warning" style={{ width: '100%' }} />
    <InputNumber status="error" style={{ width: '100%' }} prefix={<ClockCircleOutlined />} />
    <InputNumber status="warning" style={{ width: '100%' }} prefix={<ClockCircleOutlined />} />
  </Space>
);

export default App;

```

### 聚焦

聚焦额外配置属性。

```tsx
import React, { useRef } from 'react';
import type { GetRef } from 'antd';
import { Button, InputNumber, Space } from 'gzd';

type InputNumberRef = GetRef<typeof InputNumber>;

const App: React.FC = () => {
  const inputRef = useRef<InputNumberRef>(null);
  return (
    <Space vertical style={{ width: '100%' }}>
      <Space wrap>
        <Button
          onClick={() => {
            inputRef.current?.focus({ cursor: 'start' });
          }}
        >
          Focus at first
        </Button>
        <Button
          onClick={() => {
            inputRef.current?.focus({ cursor: 'end' });
          }}
        >
          Focus at last
        </Button>
        <Button
          onClick={() => {
            inputRef.current?.focus({ cursor: 'all' });
          }}
        >
          Focus to select all
        </Button>
        <Button
          onClick={() => {
            inputRef.current?.focus({ preventScroll: true });
          }}
        >
          Focus prevent scroll
        </Button>
      </Space>
      <InputNumber style={{ width: '100%' }} defaultValue={999} ref={inputRef} />
    </Space>
  );
};

export default App;

```


## API

通用属性参考：[通用属性](/react/common-props)

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| changeOnBlur | 是否在失去焦点时，触发 `onChange` 事件（例如值超出范围时，重新限制回范围并触发事件） | boolean | true |
| changeOnWheel | 允许鼠标滚轮改变数值 | boolean | - |
| controls | 是否显示增减按钮，也可设置自定义箭头图标 | boolean \ | { upIcon?: React.ReactNode; downIcon?: React.ReactNode; } |  |
| decimalSeparator | 小数点 | string | - |
| placeholder | 占位符 | string | - |
| defaultValue | 初始值 | number | - |
| disabled | 禁用 | boolean | false |
| formatter | 指定输入框展示值的格式 | function(value: number \ | string, info: { userTyping: boolean, input: string }): string |  |
| keyboard | 是否启用键盘快捷行为 | boolean | true |
| max | 最大值 | number | [Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) |
| min | 最小值 | number | [Number.MIN_SAFE_INTEGER](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER) |
| parser | 指定从 `formatter` 里转换回数字的方式，和 `formatter` 搭配使用 | function(string): number | - |
| precision | 数值精度，配置 `formatter` 时会以 `formatter` 为准 | number | - |
| readOnly | 只读 | boolean | false |
| status | 设置校验状态 | 'error' \ | 'warning' |  |
| prefix | 带有前缀图标的 input | ReactNode | - |
| suffix | 带有后缀图标的 input | ReactNode | - |
| size | 输入框大小 | `large` \ | `medium` \ | - | - |
| step | 每次改变步数，可以为小数 | number \ | string | - |
| stringMode | 字符值模式，开启后支持高精度小数。同时 `onChange` 将返回 string 类型 | boolean | false |
| mode | 展示输入框或拨轮 | `'input' \ | 'spinner'` |  |
| value | 当前值 | number | - |
| variant | 形态变体 | `outlined` \ | `borderless` \ | `underlined` | `outlined` | 5.13.0 \ | `underlined`: 5.24.0 |
| onChange | 变化回调 | function(value: number \ | string \ | - | - |
| onPressEnter | 按下回车的回调 | function(e) | - |
| onStep | 点击上下箭头、键盘、滚轮的回调 | (value: number, info: { offset: number, type: 'up' \ | 'down', emitter: 'handler' \ | 'wheel' }) => void | - | 4.7.0 |

## Ref

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| blur() | 移除焦点 | - |
| focus() | 获取焦点 | (option?: { preventScroll?: boolean, cursor?: 'start' \ | 'all' }) | cursor - 5.22.0 |
| nativeElement | 获取原生 DOM 元素 | - |

## FAQ

### 为何受控模式下，`value` 可以超出 `min` 和 `max` 范围？ {#faq-controlled-range}

在受控模式下，开发者可能自行存储相关数据。如果组件将数据约束回范围内，会导致展示数据与实际存储数据不一致的情况。这使得一些如表单场景存在潜在的数据问题。

### 为何动态修改 `min` 和 `max` 让 `value` 超出范围不会触发 `onChange` 事件？ {#faq-dynamic-range-change}

`onChange` 事件为用户触发事件，自行触发会导致表单库误以为变更来自用户操作。我们以错误样式展示超出范围的数值。

### 为何 `onBlur` 等事件获取不到正确的 value？ {#faq-onblur-value}

InputNumber 的值由内部逻辑封装而成，通过 `onBlur` 等事件获取的 `event.target.value` 仅为 DOM 元素的 `value` 而非 InputNumber 的实际值。例如通过 `formatter` 或者 `decimalSeparator` 更改展示格式，DOM 中得到的就是格式化后的字符串。你总是应该通过 `onChange` 获取当前值。

### 为何 `changeOnWheel` 无法控制鼠标滚轮是否改变数值？ {#faq-change-on-wheel}

> 不建议使用 `type` 属性

InputNumber 组件允许你使用 input 元素的所有属性最终透传至 input 元素，当你传入 `type="number"` 时 input 元素也会添加这个属性，这会使 input 元素触发原生特性（允许鼠标滚轮改变数值），从而导致 `changeOnWheel` 无法控制鼠标滚轮是否改变数值。
