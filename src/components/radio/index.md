---
group: 数据录入
title: Radio 单选框
---

# Radio 单选框

单选框。

## 何时使用

- 用于在多个备选项中选中单个状态。
- 和 Select 的区别是，Radio 所有选项默认可见，方便用户在比较中选择，因此选项不宜过多。

## 代码演示

### 基本

最简单的用法。

```tsx
import React from 'react';
import { Radio } from 'gzd';

const App: React.FC = () => <Radio>Radio</Radio>;

export default App;

```



### 不可用

Radio 不可用。

```tsx
import React, { useState } from 'react';
import { Button, Radio } from 'gzd';

const App: React.FC = () => {
  const [disabled, setDisabled] = useState(true);

  const toggleDisabled = () => {
    setDisabled(!disabled);
  };

  return (
    <>
      <Radio defaultChecked={false} disabled={disabled}>
        Disabled
      </Radio>
      <Radio defaultChecked disabled={disabled}>
        Disabled
      </Radio>
      <br />
      <Button type="primary" onClick={toggleDisabled} style={{ marginTop: 16 }}>
        Toggle disabled
      </Button>
    </>
  );
};

export default App;

```

### 单选组合

一组互斥的 Radio 配合使用。

```tsx
import React, { useState } from 'react';
import {
  BarChartOutlined,
  DotChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'gzd';
import { Flex } from 'antd';

const App: React.FC = () => {
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  return (
    <Radio.Group
      onChange={onChange}
      value={value}
      options={[
        {
          value: 1,
          className: 'option-1',
          label: (
            <Flex gap="small" justify="center" align="center" vertical>
              <LineChartOutlined style={{ fontSize: 18 }} />
              LineChart
            </Flex>
          ),
        },
        {
          value: 2,
          className: 'option-2',
          label: (
            <Flex gap="small" justify="center" align="center" vertical>
              <DotChartOutlined style={{ fontSize: 18 }} />
              DotChart
            </Flex>
          ),
        },
        {
          value: 3,
          className: 'option-3',
          label: (
            <Flex gap="small" justify="center" align="center" vertical>
              <BarChartOutlined style={{ fontSize: 18 }} />
              BarChart
            </Flex>
          ),
        },
        {
          value: 4,
          className: 'option-4',
          label: (
            <Flex gap="small" justify="center" align="center" vertical>
              <PieChartOutlined style={{ fontSize: 18 }} />
              PieChart
            </Flex>
          ),
        },
      ]}
    />
  );
};

export default App;

```

### Radio.Group 垂直

垂直的 Radio.Group，配合更多输入框选项。

```tsx
import React, { useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Input, Radio } from 'gzd';

const labelStyle: React.CSSProperties = {
  height: 32,
  lineHeight: '32px',
};

const App: React.FC = () => {
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  return (
    <Radio.Group
      vertical
      onChange={onChange}
      value={value}
      options={[
        { value: 1, style: labelStyle, label: 'Option A' },
        { value: 2, style: labelStyle, label: 'Option B' },
        { value: 3, style: labelStyle, label: 'Option C' },
        {
          value: 4,
          style: labelStyle,
          label: (
            <>
              More...
              {value === 4 && (
                <Input
                  variant="filled"
                  placeholder="please input"
                  style={{ width: 120, marginInlineStart: 12 }}
                />
              )}
            </>
          ),
        },
      ]}
    />
  );
};

export default App;

```

### Block 单选组合

`block` 属性将使 Radio.Group 撑满父容器。

```tsx
import React from 'react';
import { Radio } from 'gzd';
import { Flex } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';

const options: CheckboxGroupProps<string>['options'] = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

const App: React.FC = () => (
  <Flex vertical gap={16}>
    <Radio.Group block options={options} defaultValue="Apple" />
    <Radio.Group
      block
      options={options}
      defaultValue="Apple"
      optionType="button"
      buttonStyle="solid"
    />
    <Radio.Group block options={options} defaultValue="Pear" optionType="button" />
  </Flex>
);

export default App;

```


### Radio.Group 组合 - 配置方式

通过配置 `options` 参数来渲染单选框。也可通过 `optionType` 参数来设置 Radio 类型。

```tsx
import React, { useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'gzd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';

const plainOptions: CheckboxGroupProps<string>['options'] = ['Apple', 'Pear', 'Orange'];

const options: CheckboxGroupProps<string>['options'] = [
  { label: 'Apple', value: 'Apple', className: 'label-1' },
  { label: 'Pear', value: 'Pear', className: 'label-2' },
  { label: 'Orange', value: 'Orange', title: 'Orange', className: 'label-3' },
];

const optionsWithDisabled: CheckboxGroupProps<string>['options'] = [
  { label: 'Apple', value: 'Apple', className: 'label-1' },
  { label: 'Pear', value: 'Pear', className: 'label-2' },
  { label: 'Orange', value: 'Orange', className: 'label-3', disabled: true },
];

const App: React.FC = () => {
  const [value1, setValue1] = useState('Apple');
  const [value2, setValue2] = useState('Apple');
  const [value3, setValue3] = useState('Apple');
  const [value4, setValue4] = useState('Apple');

  const onChange1 = ({ target: { value } }: RadioChangeEvent) => {
    console.log('radio1 checked', value);
    setValue1(value);
  };

  const onChange2 = ({ target: { value } }: RadioChangeEvent) => {
    console.log('radio2 checked', value);
    setValue2(value);
  };

  const onChange3 = ({ target: { value } }: RadioChangeEvent) => {
    console.log('radio3 checked', value);
    setValue3(value);
  };

  const onChange4 = ({ target: { value } }: RadioChangeEvent) => {
    console.log('radio4 checked', value);
    setValue4(value);
  };

  return (
    <>
      <Radio.Group options={plainOptions} onChange={onChange1} value={value1} />
      <br />
      <Radio.Group options={optionsWithDisabled} onChange={onChange2} value={value2} />
      <br />
      <br />
      <Radio.Group options={options} onChange={onChange3} value={value3} optionType="button" />
      <br />
      <br />
      <Radio.Group
        options={optionsWithDisabled}
        onChange={onChange4}
        value={value4}
        optionType="button"
        buttonStyle="solid"
      />
    </>
  );
};

export default App;

```

### 按钮样式

按钮样式的单选组合。

```tsx
import React from 'react';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'gzd';
import { Flex } from 'antd';

const onChange = (e: RadioChangeEvent) => {
  console.log(`radio checked:${e.target.value}`);
};

const App: React.FC = () => (
  <Flex vertical gap={16}>
    <Radio.Group onChange={onChange} defaultValue="a">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>
    <Radio.Group onChange={onChange} defaultValue="a">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b" disabled>
        Shanghai
      </Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>
    <Radio.Group disabled onChange={onChange} defaultValue="a">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>
  </Flex>
);

export default App;

```


### 单选组合 - 配合 name 使用

可以为 Radio.Group 配置 `name` 参数，为组合内的 input 元素赋予相同的 `name` 属性，使浏览器把 Radio.Group 下的 Radio 真正看作是一组（例如可以通过方向键始终**在同一组内**更改选项）。

```tsx
import React from 'react';
import { Radio } from 'gzd';

const App: React.FC = () => (
  <Radio.Group
    name="radiogroup"
    defaultValue={1}
    options={[
      { value: 1, label: 'A' },
      { value: 2, label: 'B' },
      { value: 3, label: 'C' },
      { value: 4, label: 'D' },
    ]}
  />
);

export default App;

```


### 大小

大中小三种组合，可以和表单输入框进行对应配合。

```tsx
import React from 'react';
import { Radio } from 'gzd';
import { Flex } from 'antd';

const App: React.FC = () => (
  <Flex vertical gap={16}>
    <Radio.Group defaultValue="a" size="large">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>
    <Radio.Group defaultValue="a">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>
    <Radio.Group defaultValue="a" size="small">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>
  </Flex>
);

export default App;

```

### 填底的按钮样式

实色填底的单选按钮样式。

```tsx
import React from 'react';
import { Radio } from 'gzd';
import { Flex } from 'antd';

const App: React.FC = () => (
  <Flex vertical gap={16}>
    <Radio.Group defaultValue="a" buttonStyle="solid">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b">Shanghai</Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>
    <Radio.Group defaultValue="c" buttonStyle="solid">
      <Radio.Button value="a">Hangzhou</Radio.Button>
      <Radio.Button value="b" disabled>
        Shanghai
      </Radio.Button>
      <Radio.Button value="c">Beijing</Radio.Button>
      <Radio.Button value="d">Chengdu</Radio.Button>
    </Radio.Group>
  </Flex>
);

export default App;

```

## API

通用属性参考：[通用属性](/react/common-props)

### Radio/Radio.Button

<!-- prettier-ignore -->
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 指定当前是否选中 | boolean | false |
| defaultChecked | 初始是否选中 | boolean | false |
| disabled | 禁用 Radio | boolean | false |
| value | 根据 value 进行比较，判断是否选中 | any | - |

### Radio.Group

单选框组合，用于包裹一组 `Radio`。

<!-- prettier-ignore -->
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| block | 将 RadioGroup 宽度调整为其父宽度的选项 | boolean | false |
| buttonStyle | RadioButton 的风格样式，目前有描边和填色两种风格 | `outline` \ | `solid` |  |
| defaultValue | 默认选中的值 | any | - |
| disabled | 禁选所有子单选器 | boolean | false |
| name | RadioGroup 下所有 `input[type="radio"]` 的 `name` 属性。若未设置，则将回退到随机生成的名称 | string | - |
| options | 以配置形式设置子元素 | string\[] \ | number\[] \ | - |  |
| optionType | 用于设置 Radio `options` 类型 | `default` \ | `button` | 4.4.0 |
| orientation | 排列方向 | `horizontal` \ | `vertical` |  |
| size | 大小，只对按钮样式生效 | `large` \ | `medium` \ | - |  |
| value | 用于设置当前选中的值 | any | - |
| vertical | 值为 true，Radio Group 为垂直方向。与 `orientation` 同时存在，以 `orientation` 优先 | boolean | false |
| onChange | 选项变化时的回调函数 | function(e:Event) | - |

### CheckboxOptionType

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 用于作为 Radio 选项展示的文本 | `string` | - |
| value | 关联 Radio 选项的值 | `string` \ | `number` \ | - | 4.4.0 |
| style | 应用到 Radio 选项的 style | `React.CSSProperties` | - |
| className | Radio 选项的类名 | `string` | - |
| disabled | 指定 Radio 选项是否要禁用 | `boolean` | `false` |
| title | 添加 Title 属性值 | `string` | - |
| id | 添加 Radio Id 属性值 | `string` | - |
| onChange | 当 Radio Group 的值发送改变时触发 | `(e: CheckboxChangeEvent) => void;` | - |
| required | 指定 Radio 选项是否必填 | `boolean` | `false` |

## 方法

### Radio

| 名称 | 描述 |
| ------- | -------- |
| blur() | 移除焦点 |
| focus() | 获取焦点 |
