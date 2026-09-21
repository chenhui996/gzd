---
group: 数据录入
title: AutoComplete 自动完成
---

# AutoComplete 自动完成

输入框自动完成功能。

## 何时使用

- 需要一个输入框而不是选择器。
- 需要输入建议/辅助提示。

和 Select 的区别是：

- AutoComplete 是一个带提示的文本输入框，用户可以自由输入，关键词是受控的。
- Select 是在限定的可选项中进行选择，关键词是不可控的。

## 代码演示

### 基本使用

基本使用。通过 `options` 设置自动完成的数据源。

```tsx
import React, { useState } from 'react';
import { AutoComplete } from 'gzd';
import type { AutoCompleteProps } from 'gzd';

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

const App: React.FC = () => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const [anotherOptions, setAnotherOptions] = useState<AutoCompleteProps['options']>([]);

  const getPanelValue = (searchText: string) =>
    !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];

  const onSelect = (data: string) => {
    console.log('onSelect', data);
  };

  const onChange = (data: string) => {
    setValue(data);
  };

  return (
    <>
      <AutoComplete
        options={options}
        style={{ width: 200 }}
        onSelect={onSelect}
        showSearch={{
          onSearch: (text) => setOptions(getPanelValue(text)),
        }}
        placeholder="input here"
      />
      <br />
      <br />
      <AutoComplete
        value={value}
        showSearch={{ onSearch: (text) => setAnotherOptions(getPanelValue(text)) }}
        options={anotherOptions}
        style={{ width: 200 }}
        onSelect={onSelect}
        onChange={onChange}
        placeholder="control mode"
      />
    </>
  );
};

export default App;
```

### 自定义选项

也可以直接传 `ReactNode` 作为 option 的 `label` 属性来自定义显示效果。

```tsx
import React, { useState } from 'react';
import { AutoComplete } from 'gzd';

const App: React.FC = () => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const handleSearch = (value: string) => {
    let res: { value: string; label: string }[] = [];
    if (!value || value.indexOf('@') >= 0) {
      res = [];
    } else {
      res = ['gmail.com', '163.com', 'qq.com'].map((domain) => ({
        value: `${value}@${domain}`,
        label: `${value}@${domain}`,
      }));
    }
    setOptions(res);
  };

  return (
    <AutoComplete
      style={{ width: 200 }}
      onSearch={handleSearch}
      placeholder="input here"
      options={options}
    />
  );
};

export default App;
```

### 自定义输入组件

自定义输入组件。

```tsx
import React, { useState } from 'react';
import { AutoComplete, Input } from 'gzd';

const { TextArea } = Input;

const App: React.FC = () => {
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const handleSearch = (value: string) => {
    setOptions(
      !value
        ? []
        : [
            { value },
            { value: value + value },
            { value: value + value + value },
          ],
    );
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log('onKeyPress', event);
  };

  const onSelect = (value: string) => {
    console.log('onSelect', value);
  };

  return (
    <AutoComplete
      options={options}
      style={{ width: 200 }}
      onSelect={onSelect}
      onSearch={handleSearch}
    >
      <TextArea
        placeholder="input here"
        className="custom"
        style={{ height: 50 }}
        onKeyPress={onKeyPress}
      />
    </AutoComplete>
  );
};

export default App;
```

### 不区分大小写

不区分大小写的 AutoComplete，主要展示 `filterOption` 的用法。

```tsx
import React from 'react';
import { AutoComplete } from 'gzd';

const options = [
  { value: 'Burns Bay Road' },
  { value: 'Downing Street' },
  { value: 'Wall Street' },
];

const App: React.FC = () => (
  <AutoComplete
    style={{ width: 200 }}
    options={options}
    placeholder="try to type `b`"
    filterOption={(inputValue, option) =>
      option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
    }
  />
);

export default App;
```

### 查询模式 - 确定类目

查询模式 - 确定类目。

```tsx
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'gzd';

const renderTitle = (title: string) => (
  <span>
    {title}
    <a
      style={{ float: 'right' }}
      href="https://www.google.com/search?q=antd"
      target="_blank"
      rel="noopener noreferrer"
    >
      更多
    </a>
  </span>
);

const renderItem = (title: string, count: number) => ({
  value: title,
  label: (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {title}
      <span>
        <UserOutlined /> {count}
      </span>
    </div>
  ),
});

const options = [
  {
    label: renderTitle('Libraries'),
    options: [renderItem('AntDesign', 10000), renderItem('AntDesign UI', 10600)],
  },
  {
    label: renderTitle('Solutions'),
    options: [renderItem('AntDesign UI FAQ', 60100), renderItem('AntDesign FAQ', 30010)],
  },
  {
    label: renderTitle('Articles'),
    options: [renderItem('AntDesign design language', 100000)],
  },
];

const App: React.FC = () => (
  <AutoComplete
    popupMatchSelectWidth={500}
    style={{ width: 250 }}
    options={options}
    size="large"
  >
    <Input.Search size="large" placeholder="input here" />
  </AutoComplete>
);

export default App;
```

### 查询模式 - 不确定类目

查询模式 - 不确定类目。

```tsx
import React, { useState } from 'react';
import { AutoComplete, Input } from 'gzd';

const getRandomInt = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const searchResult = (query: string) =>
  new Array(getRandomInt(5))
    .join('.')
    .split('.')
    .map((_, idx) => {
      const category = `${query}${idx}`;
      return {
        value: category,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              Found {query} on{' '}
              <a
                href={`https://s.taobao.com/search?q=${query}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {category}
              </a>
            </span>
            <span>{getRandomInt(200, 100)} results</span>
          </div>
        ),
      };
    });

const App: React.FC = () => {
  const [options, setOptions] = useState<{ value: string; label: React.ReactNode }[]>([]);

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (value: string) => {
    console.log('onSelect', value);
  };

  return (
    <AutoComplete
      popupMatchSelectWidth={252}
      style={{ width: 300 }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
      size="large"
    >
      <Input.Search size="large" placeholder="input here" enterButton />
    </AutoComplete>
  );
};

export default App;
```

### 自定义状态

使用 `status` 属性为输入框添加状态，可选值为 `error` 或者 `warning`。

```tsx
import React from 'react';
import { Space, AutoComplete } from 'gzd';

const options = [{ value: 'Burns Bay Road' }, { value: 'Downing Street' }, { value: 'Wall Street' }];

const App: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <AutoComplete status="error" options={options} style={{ width: 200 }} placeholder="error status" />
    <AutoComplete status="warning" options={options} style={{ width: 200 }} placeholder="warning status" />
  </Space>
);

export default App;
```

### 多种形态

可选 `outlined` `filled` `borderless` `underlined` 四种形态。

```tsx
import React, { useState } from 'react';
import { Flex } from 'antd';
import { AutoComplete } from 'gzd';
import type { AutoCompleteProps } from 'gzd';

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

const App: React.FC = () => {
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);

  const getPanelValue = (searchText: string) =>
    !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];

  return (
    <Flex vertical gap={12}>
      <AutoComplete
        options={options}
        style={{ width: 200 }}
        placeholder="Outlined"
        showSearch={{ onSearch: (text) => setOptions(getPanelValue(text)) }}
        onSelect={globalThis.console.log}
      />
      <AutoComplete
        options={options}
        style={{ width: 200 }}
        placeholder="Filled"
        showSearch={{ onSearch: (text) => setOptions(getPanelValue(text)) }}
        onSelect={globalThis.console.log}
        variant="filled"
      />
      <AutoComplete
        options={options}
        style={{ width: 200 }}
        placeholder="Borderless"
        showSearch={{ onSearch: (text) => setOptions(getPanelValue(text)) }}
        onSelect={globalThis.console.log}
        variant="borderless"
      />
      <AutoComplete
        options={options}
        style={{ width: 200 }}
        placeholder="Underlined"
        onSearch={(text) => setOptions(getPanelValue(text))}
        onSelect={globalThis.console.log}
        variant="underlined"
      />
    </Flex>
  );
};

export default App;
```

### 自定义清除按钮

自定义清除按钮图标。

```tsx
import React from 'react';
import { CloseSquareFilled } from '@ant-design/icons';
import { AutoComplete } from 'gzd';

const options = [{ value: 'Burns Bay Road' }, { value: 'Downing Street' }, { value: 'Wall Street' }];

const App: React.FC = () => (
  <AutoComplete
    options={options}
    style={{ width: 200 }}
    placeholder="Custom clear icon"
    allowClear={{ clearIcon: <CloseSquareFilled /> }}
  />
);

export default App;
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| allowClear | 支持清除 | boolean \| { clearIcon?: ReactNode } | false |
| backfill | 使用键盘选择选项的时候把选中项回填到输入框中 | boolean | false |
| children | 自定义输入框 | HTMLInputElement \| HTMLTextAreaElement \| React.ReactElement&lt;InputProps> | &lt;Input /> |
| defaultActiveFirstOption | 是否默认高亮第一个选项 | boolean | true |
| defaultOpen | 是否默认展开下拉菜单 | boolean | - |
| defaultValue | 指定默认选中的条目 | string | - |
| disabled | 是否禁用 | boolean | false |
| popupRender | 自定义下拉框内容 | (originNode: ReactNode) => ReactNode | - |
| popupMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动 | boolean \| number | true |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。[示例](https://codesandbox.io/s/4j168r7jw0) | function(triggerNode) | () => document.body |
| notFoundContent | 当下拉列表为空时显示的内容 | ReactNode | - |
| open | 是否展开下拉菜单 | boolean | - |
| options | 数据化配置选项内容，相比 jsx 定义会获得更好的渲染性能 | { label, value }\[] | - |
| placeholder | 输入框提示 | string | - |
| showSearch | 搜索配置 | true \| [Object](#showsearch) | true |
| status | 设置校验状态 | 'error' \| 'warning' | - |
| size | 控件大小 | `large` \| `medium` \| `small` | - |
| value | 指定当前选中的条目 | string | - |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` |
| virtual | 设置 false 时关闭虚拟滚动 | boolean | true |
| onBlur | 失去焦点时的回调 | function() | - |
| onChange | 选中 option，或 input 的 value 变化时，调用此函数 | function(value) | - |
| onOpenChange | 展开下拉菜单的回调 | (open: boolean) => void | - |
| onFocus | 获得焦点时的回调 | function() | - |
| onSelect | 被选中时调用，参数为选中项的 value 值 | function(value, option) | - |
| onClear | 清除内容时的回调 | function | - |
| onInputKeyDown | 按键按下时回调 | (event: KeyboardEvent) => void | - |
| onPopupScroll | 下拉列表滚动时的回调 | (event: UIEvent) => void | - |

### showSearch

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| filterOption | 是否根据输入项进行筛选。当其为一个函数时，会接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 true，反之则返回 false | boolean \| function(inputValue, option) | true |
| onSearch | 搜索补全项的时候调用 | function(value) | - |

## 方法 {#methods}

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 | 
