---
group: 数据录入
title: Cascader 级联选择
---

# Cascader 级联选择

级联选择框。

## 何时使用

- 需要从一组相关联的数据集合进行选择，例如省市区，公司层级，事物分类等。
- 从一个较大的数据集合中进行选择时，用多级分类进行分隔，方便选择。
- 比起 Select 组件，可以在同一个浮层中完成选择，有较好的空间利用率。

## 代码演示

### 基本

省市区级联。

```tsx
import React from 'react';
import { Cascader } from 'gzd';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  const onChange = (value: string[]) => {
    console.log(value);
  };

  return <Cascader options={options} onChange={onChange as any} placeholder="Please select" />;
};

export default App;
```

### 默认值

默认值通过数组的方式指定。

```tsx
import React from 'react';
import { Cascader } from 'gzd';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => (
  <Cascader defaultValue={['zhejiang', 'hangzhou', 'xihu']} options={options} />
);

export default App;
```

### 可以自定义显示

切换按钮和结果分开。

```tsx
import React, { useState } from 'react';
import type { CascaderProps } from 'gzd';
import { Cascader } from 'gzd';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
      },
    ],
  },
];

const App: React.FC = () => {
  const [text, setText] = useState('Unselect');

  const onChange: CascaderProps<Option>['onChange'] = (_, selectedOptions) => {
    setText(selectedOptions.map((o) => o.label).join(', '));
  };

  return (
    <span>
      {text}
      &nbsp;
      <Cascader options={options} onChange={onChange}>
        <a>Change city</a>
      </Cascader>
    </span>
  );
};

export default App;
```

### 移入展开

通过移入展开下级菜单，点击完成选择。

```tsx
import React from 'react';
import { Cascader } from 'gzd';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const displayRender = (labels: string[]) => labels[labels.length - 1];

const App: React.FC = () => (
  <Cascader
    options={options}
    expandTrigger="hover"
    displayRender={displayRender}
    onChange={(value) => console.log(value)}
  />
);

export default App;
```

### 禁用选项

通过指定 options 里的 `disabled` 字段。

```tsx
import React from 'react';
import { Cascader } from 'gzd';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    disabled: true,
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => <Cascader options={options} />;

export default App;
```

### 选择即改变

这种交互允许只选中父级选项。

```tsx
import React from 'react';
import { Cascader } from 'gzd';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => (
  <Cascader options={options} onChange={(value) => console.log(value)} changeOnSelect />
);

export default App;
```

### 多选

支持多选节点。

```tsx
import React from 'react';
import { Cascader } from 'gzd';

const options = [
  {
    label: 'Light',
    value: 'light',
    children: new Array(20)
      .fill(null)
      .map((_, index) => ({ label: `Number ${index}`, value: index })),
  },
  {
    label: 'Bamboo',
    value: 'bamboo',
    children: [
      {
        label: 'Little',
        value: 'little',
        children: [
          {
            label: 'Toy Fish',
            value: 'fish',
          },
          {
            label: 'Toy Cards',
            value: 'cards',
          },
          {
            label: 'Toy Bird',
            value: 'bird',
          },
        ],
      },
    ],
  },
];

const onChange = (value: string[][]) => {
  console.log(value);
};

const App: React.FC = () => (
  <Cascader
    style={{ width: '100%' }}
    options={options}
    onChange={onChange as any}
    multiple
    maxTagCount="responsive"
  />
);

export default App;
```

### 自定义回填方式

通过 `showCheckedStrategy` 指定仅展示子节点还是展示全路径，默认仅展示子节点。

```tsx
import React from 'react';
import type { CascaderProps } from 'gzd';
import { Cascader } from 'gzd';

const { SHOW_CHILD } = Cascader;

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}
const options: Option[] = [
  {
    label: 'Light',
    value: 'light',
    children: Array.from({ length: 20 }).map((_, index) => ({
      label: `Number ${index}`,
      value: index,
    })),
  },
  {
    label: 'Bamboo',
    value: 'bamboo',
    children: [
      {
        label: 'Little',
        value: 'little',
        children: [
          {
            label: 'Toy Fish',
            value: 'fish',
          },
          {
            label: 'Toy Cards',
            value: 'cards',
          },
          {
            label: 'Toy Bird',
            value: 'bird',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  const onChange: CascaderProps<Option, 'value', true>['onChange'] = (value) => {
    console.log(value);
  };
  return (
    <>
      <Cascader
        style={{ width: '100%' }}
        options={options}
        onChange={onChange}
        multiple
        maxTagCount="responsive"
        showCheckedStrategy={SHOW_CHILD}
        defaultValue={[
          ['bamboo', 'little', 'fish'],
          ['bamboo', 'little', 'cards'],
          ['bamboo', 'little', 'bird'],
        ]}
      />
      <br />
      <br />
      <Cascader
        style={{ width: '100%' }}
        options={options}
        onChange={onChange}
        multiple
        maxTagCount="responsive"
        defaultValue={[['bamboo']]}
      />
    </>
  );
};

export default App;
```

### 大小

不同大小的级联选择器。

```tsx
import React from 'react';
import { Cascader, Space } from 'gzd';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Cascader size="large" options={options} placeholder="Please select" />
    <Cascader options={options} placeholder="Please select" />
    <Cascader size="small" options={options} placeholder="Please select" />
  </Space>
);

export default App;
```

### 自定义已选项

使用 `tagRender` 属性来自定义已选项的展示。

```tsx
import React from 'react';
import { Tag } from 'antd';
import { Cascader } from 'gzd';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const tagRender = (props: any) => {
  const { label, closable, onClose } = props;
  return (
    <Tag color="cyan" closable={closable} onClose={onClose} style={{ marginInlineEnd: 4 }}>
      {label}
    </Tag>
  );
};

const App: React.FC = () => (
  <Cascader
    multiple
    tagRender={tagRender}
    options={options}
    defaultValue={[['zhejiang', 'hangzhou', 'xihu']]}
    style={{ width: '100%' }}
  />
);

export default App;
```

### 搜索

可以直接搜索选项并选择。

```tsx
import React from 'react';
import { Cascader } from 'gzd';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
          {
            value: 'xiasha',
            label: 'Xia Sha',
            disabled: true,
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const filter = (inputValue: string, path: any[]) =>
  path.some((option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1);

const App: React.FC = () => (
  <Cascader
    options={options}
    showSearch={{ filter }}
    placeholder="Please select"
  />
);

export default App;
```

### 动态加载选项

使用 `loadData` 实现动态加载选项。

```tsx
import React, { useState } from 'react';
import { Cascader } from 'gzd';

interface Option {
  value: string;
  label: string;
  isLeaf?: boolean;
  children?: Option[];
}

const optionLists: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    isLeaf: false,
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    isLeaf: false,
  },
];

const App: React.FC = () => {
  const [options, setOptions] = useState<Option[]>(optionLists);

  const loadData = (selectedOptions: Option[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    // load options lazily
    setTimeout(() => {
      targetOption.children = [
        {
          label: `${targetOption.label} Dynamic 1`,
          value: 'dynamic1',
        },
        {
          label: `${targetOption.label} Dynamic 2`,
          value: 'dynamic2',
        },
      ];
      setOptions([...options]);
    }, 1000);
  };

  const onChange = (value: string[], selectedOptions: Option[]) => {
    console.log(value, selectedOptions);
  };

  return <Cascader options={options} loadData={loadData} onChange={onChange as any} changeOnSelect />;
};

export default App;
```

### 自定义字段名

自定义字段名。

```tsx
import React from 'react';
import { Cascader } from 'gzd';

const options = [
  {
    code: 'zhejiang',
    name: 'Zhejiang',
    items: [
      {
        code: 'hangzhou',
        name: 'Hangzhou',
        items: [
          {
            code: 'xihu',
            name: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    code: 'jiangsu',
    name: 'Jiangsu',
    items: [
      {
        code: 'nanjing',
        name: 'Nanjing',
        items: [
          {
            code: 'zhonghuamen',
            name: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => (
  <Cascader
    fieldNames={{ label: 'name', value: 'code', children: 'items' }}
    options={options}
    placeholder="Please select"
  />
);

export default App;
```

### 前后缀

通过 `prefix` 与 `suffixIcon` 来添加图标。

```tsx
import React from 'react';
import { SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Cascader, Space } from 'gzd';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Cascader options={options} prefix={<UserOutlined />} placeholder="Please select" />
    <Cascader options={options} suffixIcon={<SmileOutlined />} placeholder="Please select" />
  </Space>
);

export default App;
```

### 扩展菜单

使用 `dropdownRender` 对下拉菜单进行自由扩展。

```tsx
import React from 'react';
import { Cascader, Divider } from 'gzd';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const dropdownRender = (menus: React.ReactNode) => (
  <div>
    {menus}
    <Divider style={{ margin: 0 }} />
    <div style={{ padding: 8 }}>The footer is not very short.</div>
  </div>
);

const App: React.FC = () => (
  <Cascader options={options} dropdownRender={dropdownRender} placeholder="Please select" />
);

export default App;
```

### 弹出位置

可以通过 `placement` 手动指定弹出的位置。

```tsx
import React, { useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import { Cascader } from 'gzd';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  const [placement, setPlacement] = useState<'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'>(
    'topLeft',
  );

  const placementChange = (e: RadioChangeEvent) => {
    setPlacement(e.target.value);
  };

  return (
    <>
      <Radio.Group value={placement} onChange={placementChange}>
        <Radio.Button value="topLeft">topLeft</Radio.Button>
        <Radio.Button value="topRight">topRight</Radio.Button>
        <Radio.Button value="bottomLeft">bottomLeft</Radio.Button>
        <Radio.Button value="bottomRight">bottomRight</Radio.Button>
      </Radio.Group>
      <br />
      <br />
      <Cascader options={options} placeholder="Please select" placement={placement} />
    </>
  );
};

export default App;
```

### 形态变体

Cascader 形态变体，可选 `outlined` `filled` `borderless` `underlined` 四种形态。

```tsx
import React from 'react';
import { Flex } from 'antd';
import { Cascader } from 'gzd';

const App: React.FC = () => (
  <Flex vertical gap={16}>
    <Cascader placeholder="Please select" variant="borderless" />
    <Cascader placeholder="Please select" variant="filled" />
    <Cascader placeholder="Please select" variant="outlined" />
    <Cascader placeholder="Please select" variant="underlined" />
  </Flex>
);

export default App;
```

### 自定义状态

使用 `status` 为 Cascader 添加状态，可选值为 `error` 或者 `warning`。

```tsx
import React from 'react';
import { Cascader, Space } from 'gzd';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Cascader status="error" placeholder="Error" options={options} />
    <Cascader status="warning" multiple placeholder="Warning multiple" options={options} />
  </Space>
);

export default App;
```

### 面板使用

直接渲染面板。适用于一些需要内嵌适用的场景。

```tsx
import React, { useState } from 'react';
import type { CascaderProps } from 'gzd';
import { Flex, Switch } from 'antd';
import { Cascader } from 'gzd';



interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const onChange: CascaderProps<Option>['onChange'] = (value) => {
  console.log(value);
};

const onMultipleChange: CascaderProps<Option, 'value', true>['onChange'] = (value) => {
  console.log(value);
};

const App: React.FC = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <Flex vertical gap="small" align="flex-start">
      <Switch
        checked={disabled}
        checkedChildren="Enabled"
        unCheckedChildren="Disabled"
        onChange={setDisabled}
        aria-label="disabled switch"
      />
      <Cascader.Panel options={options} onChange={onChange} disabled={disabled} />
      <Cascader.Panel multiple options={options} onChange={onMultipleChange} disabled={disabled} />
      <Cascader.Panel />
    </Flex>
  );
};

export default App;
```

## API

```
<Cascader options={options} onChange={onChange} />
```

### Cascader

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| allowClear | 支持清除 | boolean \| { clearIcon?: ReactNode } | true |
| changeOnSelect | 单选时生效（multiple 下始终都可以选择），点选每级菜单选项值都会发生变化。 | boolean | false |
| className | 自定义类名 | string | - |
| defaultOpen | 是否默认展示浮层 | boolean | - |
| defaultValue | 默认的选中项 | string\[] \| number\[] | \[] |
| disabled | 禁用 | boolean | false |
| displayRender | 选择后展示的渲染函数 | (label, selectedOptions) => ReactNode | label => label.join(`/`) |
| tagRender | 自定义 tag 内容 render，仅在多选时生效 | ({ label: string, onClose: function, value: string }) => ReactNode | - |
| popupRender | 自定义下拉框内容 | (menus: ReactNode) => ReactNode | - |
| expandIcon | 自定义次级菜单展开图标 | ReactNode | - |
| expandTrigger | 次级菜单的展开方式，可选 'click' 和 'hover' | string | `click` |
| fieldNames | 自定义 options 中 label value children 的字段 | object | { label: `label`, value: `value`, children: `children` } |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。[示例](https://codepen.io/afc163/pen/zEjNOy?editors=0010) | function(triggerNode) | () => document.body |
| loadData | 用于动态加载选项，无法与 `showSearch` 一起使用 | (selectedOptions) => void | - |
| loadingIcon | 自定义的加载图标 | ReactNode | - |
| maxTagCount | 最多显示多少个 tag，响应式模式会对性能产生损耗 | number \| `responsive` | - |
| maxTagPlaceholder | 隐藏 tag 时显示的内容 | ReactNode \| function(omittedValues) | - |
| maxTagTextLength | 最大显示的 tag 文本长度 | number | - |
| notFoundContent | 当下拉列表为空时显示的内容 | ReactNode | `Not Found` |
| open | 控制浮层显隐 | boolean | - |
| options | 可选项数据源 | [Option](#option)\[] | - |
| placeholder | 输入框占位文本 | string | - |
| placement | 浮层预设位置 | `bottomLeft` `bottomRight` `topLeft` `topRight` | `bottomLeft` |
| prefix | 自定义前缀 | ReactNode | - |
| showSearch | 在选择框中显示搜索框 | boolean \| [Object](#showsearch) | false |
| size | 输入框大小 | `large` \| `medium` \| `small` | `medium` |
| status | 设置校验状态 | 'error' \| 'warning' | - |
| suffixIcon | 自定义的选择框后缀图标 | ReactNode | - |
| value | 指定选中项 | string\[] \| number\[] | - |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 5.13.0 \| `underlined`: 5.24.0 |
| onChange | 选择完成后的回调 | (value, selectedOptions) => void | - |
| onOpenChange | 显示/隐藏浮层的回调 | (value) => void | - |
| multiple | 支持多选节点 | boolean | - |
| removeIcon | 自定义的多选框清除图标 | ReactNode | - |
| showCheckedStrategy | 定义选中项回填的方式（仅在 `multiple` 为 `true` 时生效）。`Cascader.SHOW_CHILD`: 只显示选中的子节点。`Cascader.SHOW_PARENT`: 只显示父节点（当父节点下所有子节点都选中时）。 | `Cascader.SHOW_PARENT` \| `Cascader.SHOW_CHILD` | `Cascader.SHOW_PARENT` |
| optionRender | 自定义渲染下拉选项 | (option: Option) => React.ReactNode | - |

### showSearch

`showSearch` 为对象时，其中的字段：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| autoClearSearchValue | 是否在选中项后清空搜索框，只在 `multiple` 为 `true` 时有效 | boolean | true |
| filter | 接收 `inputValue` `path` 两个参数，当 `path` 符合筛选条件时，应返回 true，反之则返回 false | function(inputValue, path): boolean | - |
| limit | 搜索结果展示数量 | number \| false | 50 |
| matchInputWidth | 搜索结果列表是否与输入框同宽（[效果](https://github.com/ant-design/ant-design/issues/25779)） | boolean | true |
| render | 用于渲染 filter 后的选项 | function(inputValue, path): ReactNode | - |
| sort | 用于排序 filter 后的选项 | function(a, b, inputValue) | - |
| searchValue | 设置搜索的值，需要与 `showSearch` 配合使用 | string | - |
| onSearch | 监听搜索，返回输入的值 | (search: string) => void | - |

### Option

```typescript
interface Option {
  value: string | number;
  label?: React.ReactNode;
  disabled?: boolean;
  children?: Option[];
  // 标记是否为叶子节点，设置了 `loadData` 时有效
  // 设为 `false` 时会强制标记为父节点，即使当前节点没有 children，也会显示展开图标
  isLeaf?: boolean;
}
```


## 方法 {#methods}

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

> 注意，如果需要获得中国省市区数据，可以参考 [china-division](https://gist.github.com/afc163/7582f35654fd03d5be7009444345ea17)。
