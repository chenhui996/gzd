---
group: 数据录入
title: Select 选择器
---

# Select 选择器

下拉选择器。

## 何时使用

- 弹出一个下拉菜单给用户选择操作，用于代替原生的选择器，或者需要一个更优雅的多选器时。
- 当选项少时（少于 5 项），建议直接将选项平铺，使用 Radio 是更好的选择。

## 代码演示

### 基本使用

基本使用。

```tsx
import React from "react";
import { Select, Space } from "gzd";

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <Space wrap>
    <Select
      defaultValue="lucy"
      style={{ width: 120 }}
      onChange={handleChange}
      options={[
        { value: "jack", label: "JackJackJackJackJackJack" },
        { value: "lucy", label: "Lucy" },
        { value: "Yiminghe", label: "yiminghe" },
        { value: "disabled", label: "Disabled", disabled: true },
      ]}
    />
    <Select
      defaultValue="lucy"
      style={{ width: 120 }}
      disabled
      options={[{ value: "lucy", label: "Lucy" }]}
    />
    <Select
      defaultValue="lucy"
      style={{ width: 120 }}
      loading
      options={[{ value: "lucy", label: "Lucy" }]}
    />
    <Select
      defaultValue="lucy"
      style={{ width: 120 }}
      allowClear
      options={[{ value: "lucy", label: "Lucy" }]}
      placeholder="select it"
    />
  </Space>
);

export default App;
```

### 带搜索框

展开后可对选项进行搜索。

```tsx
import React from "react";
import { Select } from "gzd";

const onChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
  console.log("search:", value);
};

const App: React.FC = () => (
  <Select
    showSearch={{ optionFilterProp: "label", onSearch }}
    placeholder="Select a person"
    onChange={onChange}
    options={[
      {
        value: "jack",
        label: "Jack",
      },
      {
        value: "lucy",
        label: "Lucy",
      },
      {
        value: "tom",
        label: "Tom",
      },
    ]}
  />
);

export default App;
```

### 自定义搜索

使用 `filterOption` 自定义搜索。

```tsx
import React from "react";
import { Select } from "gzd";

const App: React.FC = () => (
  <Select
    showSearch={{
      filterOption: (input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
    }}
    placeholder="Select a person"
    options={[
      { value: "1", label: "Jack" },
      { value: "2", label: "Lucy" },
      { value: "3", label: "Tom" },
    ]}
  />
);

export default App;
```

### 多字段搜索

使用 `optionFilterProp` 多字段搜索。

```tsx
import React from "react";
import { Select } from "gzd";

const App: React.FC = () => (
  <Select
    placeholder="Select an option"
    showSearch={{
      optionFilterProp: ["label", "otherField"],
    }}
    options={[
      { value: "a11", label: "a11", otherField: "c11" },
      { value: "b22", label: "b22", otherField: "b11" },
      { value: "c33", label: "c33", otherField: "b33" },
      { value: "d44", label: "d44", otherField: "d44" },
    ]}
  />
);

export default App;
```

### 多选

多选，从已有条目中选择。

```tsx
import React from "react";
import { Select, Space } from "gzd";
import type { SelectProps } from "antd";

const options: SelectProps["options"] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <Space style={{ width: "100%" }} vertical>
    <Select
      mode="multiple"
      allowClear
      style={{ width: "100%" }}
      placeholder="Please select"
      defaultValue={["a10", "c12"]}
      onChange={handleChange}
      options={options}
    />
    <Select
      mode="multiple"
      disabled
      style={{ width: "100%" }}
      placeholder="Please select"
      defaultValue={["a10", "c12"]}
      onChange={handleChange}
      options={options}
    />
  </Space>
);

export default App;
```

### 三种大小

三种大小的选择框，当 size 分别为 `large` 和 `small` 时，输入框高度为 `40px` 和 `24px` ，默认高度为 `32px`。

```tsx
import React, { useState } from "react";
import { Radio, Select, Space } from "gzd";
import type { ConfigProviderProps, RadioChangeEvent, SelectProps } from "antd";

type SizeType = ConfigProviderProps["componentSize"];

const options: SelectProps["options"] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

const handleChange = (value: string | string[]) => {
  console.log(`Selected: ${value}`);
};

const App: React.FC = () => {
  const [size, setSize] = useState<SizeType>("medium");

  const handleSizeChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  return (
    <>
      <Radio.Group value={size} onChange={handleSizeChange}>
        <Radio.Button value="large">Large</Radio.Button>
        <Radio.Button value="medium">Medium</Radio.Button>
        <Radio.Button value="small">Small</Radio.Button>
      </Radio.Group>
      <br />
      <br />
      <Space vertical style={{ width: "100%" }}>
        <Select
          size={size}
          defaultValue="a1"
          onChange={handleChange}
          style={{ width: 200 }}
          options={options}
        />
        <Select
          mode="multiple"
          size={size}
          placeholder="Please select"
          defaultValue={["a10", "c12"]}
          onChange={handleChange}
          style={{ width: "100%" }}
          options={options}
        />
        <Select
          mode="tags"
          size={size}
          placeholder="Please select"
          defaultValue={["a10", "c12"]}
          onChange={handleChange}
          style={{ width: "100%" }}
          options={options}
        />
      </Space>
    </>
  );
};

export default App;
```

### 自定义下拉选项

使用 `optionRender` 自定义渲染下拉选项。

```tsx
import React from "react";
import { Select, Space } from "gzd";

const options = [
  {
    label: "Happy",
    value: "happy",
    emoji: "😄",
    desc: "Feeling Good",
  },
  {
    label: "Sad",
    value: "sad",
    emoji: "😢",
    desc: "Feeling Blue",
  },
  {
    label: "Angry",
    value: "angry",
    emoji: "😡",
    desc: "Furious",
  },
  {
    label: "Cool",
    value: "cool",
    emoji: "😎",
    desc: "Chilling",
  },
  {
    label: "Sleepy",
    value: "sleepy",
    emoji: "😴",
    desc: "Need Sleep",
  },
];

const App: React.FC = () => (
  <Select
    mode="multiple"
    style={{ width: "100%" }}
    placeholder="Please select your current mood."
    defaultValue={["happy"]}
    onChange={(value) => {
      console.log(`selected ${value}`);
    }}
    options={options}
    optionRender={(option) => (
      <Space>
        <span role="img" aria-label={option.data.label}>
          {option.data.emoji}
        </span>
        {`${option.data.label} (${option.data.desc})`}
      </Space>
    )}
  />
);

export default App;
```

### 带排序的搜索

在搜索模式下对过滤结果项进行排序。

```tsx
import React from "react";
import { Select } from "gzd";

const App: React.FC = () => (
  <Select
    showSearch={{
      optionFilterProp: "label",
      filterSort: (optionA, optionB) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase()),
    }}
    style={{ width: 200 }}
    placeholder="Search to Select"
    options={[
      {
        value: "1",
        label: "Not Identified",
      },
      {
        value: "2",
        label: "Closed",
      },
      {
        value: "3",
        label: "Communicated",
      },
      {
        value: "4",
        label: "Identified",
      },
      {
        value: "5",
        label: "Resolved",
      },
      {
        value: "6",
        label: "Cancelled",
      },
    ]}
  />
);

export default App;
```

### 标签

标签形式的多选框，用户亦可自由输入。

```tsx
import React from "react";
import { Select } from "gzd";
import type { SelectProps } from "antd";

const options: SelectProps["options"] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <Select
    mode="tags"
    style={{ width: "100%" }}
    placeholder="Tags Mode"
    onChange={handleChange}
    options={options}
  />
);

export default App;
```

### 分组

用 `OptGroup` 进行选项分组。

```tsx
import React from "react";
import { Select } from "gzd";

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <Select
    defaultValue="lucy"
    style={{ width: 200 }}
    onChange={handleChange}
    options={[
      {
        label: <span>manager</span>,
        title: "manager",
        options: [
          { label: <span>Jack</span>, value: "Jack" },
          { label: <span>Lucy</span>, value: "Lucy" },
        ],
      },
      {
        label: <span>engineer</span>,
        title: "engineer",
        options: [
          { label: <span>Chloe</span>, value: "Chloe" },
          { label: <span>Lucas</span>, value: "Lucas" },
        ],
      },
    ]}
  />
);

export default App;
```

### 联动

省市联动是典型的例子，联动场景我们更推荐使用 [Cascader](/components/cascader-cn/) 组件。

```tsx
import React, { useState } from "react";
import { Select, Space } from "gzd";

const cityData = {
  Zhejiang: ["Hangzhou", "Ningbo", "Wenzhou"],
  Jiangsu: ["Nanjing", "Suzhou", "Zhenjiang"],
};

type CityName = keyof typeof cityData;

const provinceData: CityName[] = ["Zhejiang", "Jiangsu"];

const App: React.FC = () => {
  const [cities, setCities] = useState(cityData[provinceData[0] as CityName]);
  const [secondCity, setSecondCity] = useState(
    cityData[provinceData[0]][0] as CityName,
  );

  const handleProvinceChange = (value: CityName) => {
    setCities(cityData[value]);
    setSecondCity(cityData[value][0] as CityName);
  };

  const onSecondCityChange = (value: CityName) => {
    setSecondCity(value);
  };

  return (
    <Space wrap>
      <Select
        defaultValue={provinceData[0]}
        style={{ width: 120 }}
        onChange={handleProvinceChange}
        options={provinceData.map((province) => ({
          label: province,
          value: province,
        }))}
      />
      <Select
        style={{ width: 120 }}
        value={secondCity}
        onChange={onSecondCityChange}
        options={cities.map((city) => ({ label: city, value: city }))}
      />
    </Space>
  );
};

export default App;
```

### 搜索框

搜索和远程数据结合。

```tsx
import React, { useState } from "react";
import { Select } from "gzd";
import type { SelectProps } from "antd";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const toURLSearchParams = <T extends Record<string, any>>(record: T) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    params.append(key, value);
  }
  return params;
};

const fetchData = (
  value: string,
  callback: (data: { value: string; text: string }[]) => void,
) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const params = toURLSearchParams({ code: "utf-8", q: value });

  const fake = () => {
    fetch(`https://suggest.taobao.com/sug?${params.toString()}`)
      .then((response) => response.json())
      .then(({ result }) => {
        if (currentValue === value) {
          const data = result.map((item: any) => ({
            value: item[0],
            text: item[0],
          }));
          callback(data);
        }
      });
  };
  if (value) {
    timeout = setTimeout(fake, 300);
  } else {
    callback([]);
  }
};

const SearchInput: React.FC<{
  placeholder: string;
  style: React.CSSProperties;
}> = (props) => {
  const [data, setData] = useState<SelectProps["options"]>([]);
  const [value, setValue] = useState<string>();

  const handleSearch = (newValue: string) => {
    fetchData(newValue, setData);
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <Select
      showSearch={{ filterOption: false, onSearch: handleSearch }}
      value={value}
      placeholder={props.placeholder}
      style={props.style}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      onChange={handleChange}
      notFoundContent={null}
      options={(data || []).map((d) => ({
        value: d.value,
        label: d.text,
      }))}
    />
  );
};

const App: React.FC = () => (
  <SearchInput placeholder="input search text" style={{ width: 200 }} />
);

export default App;
```

### 获得选项的文本

默认情况下 `onChange` 里只能拿到 `value`，如果需要拿到选中的节点文本 `label`，可以使用 `labelInValue` 属性。

选中项的 `label` 会被包装到 `value` 中传递给 `onChange` 等函数，此时 `value` 是一个对象。

```tsx
import React from "react";
import { Select } from "gzd";

const handleChange = (value: { value: string; label: React.ReactNode }) => {
  console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
};

const App: React.FC = () => (
  <Select
    labelInValue
    defaultValue={{ value: "lucy", label: "Lucy (101)" }}
    style={{ width: 120 }}
    onChange={handleChange}
    options={[
      {
        value: "jack",
        label: "Jack (100)",
      },
      {
        value: "lucy",
        label: "Lucy (101)",
      },
    ]}
  />
);

export default App;
```

### 自动分词

试下复制 `露西,杰克` 并粘贴到输入框里。只在 tags 和 multiple 模式下可用。

```tsx
import React from "react";
import { Select } from "gzd";
import type { SelectProps } from "antd";

const options: SelectProps["options"] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <Select
    mode="tags"
    style={{ width: "100%" }}
    onChange={handleChange}
    tokenSeparators={[","]}
    options={options}
  />
);

export default App;
```

### 搜索用户

一个带有远程搜索，防抖控制，请求时序控制，加载状态的多选示例。

```tsx
import React, { useMemo, useRef, useState } from "react";
import { Select } from "gzd";
import { Avatar, Spin } from "antd";
import type { SelectProps } from "antd";
import debounce from "lodash/debounce";

export interface DebounceSelectProps<ValueType = any> extends Omit<
  SelectProps<ValueType | ValueType[]>,
  "options" | "children"
> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
    avatar?: string;
  } = any,
>({
  fetchOptions,
  debounceTimeout = 300,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      showSearch={{ filterOption: false, onSearch: debounceFetcher }}
      notFoundContent={fetching ? <Spin size="small" /> : "No results found"}
      {...props}
      options={options}
      optionRender={(option) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {option.data.avatar && (
            <Avatar src={option.data.avatar} style={{ marginInlineEnd: 8 }} />
          )}
          {option.label}
        </div>
      )}
    />
  );
}

// Usage of DebounceSelect
interface UserValue {
  label: string;
  value: string;
  avatar?: string;
}

async function fetchUserList(username: string): Promise<UserValue[]> {
  console.log("fetching user", username);
  return fetch(
    `https://660d2bd96ddfa2943b33731c.mockapi.io/api/users/?search=${username}`,
  )
    .then((res) => res.json())
    .then((res) => {
      const results = Array.isArray(res) ? res : [];
      return results.map<UserValue>((user) => ({
        label: user.name,
        value: user.id,
        avatar: user.avatar,
      }));
    })
    .catch(() => {
      console.log("fetch mock data failed");
      return [];
    });
}

const App: React.FC = () => {
  const [value, setValue] = useState<UserValue[]>([]);

  return (
    <DebounceSelect
      mode="multiple"
      value={value}
      placeholder="Select users"
      fetchOptions={fetchUserList}
      style={{ width: "100%" }}
      onChange={(newValue) => {
        if (Array.isArray(newValue)) {
          setValue(newValue);
        }
      }}
    />
  );
};

export default App;
```

### 前后缀

自定义前缀 `prefix` 和后缀图标 `suffixIcon`。

```tsx
import React from "react";
import { MehOutlined, SmileOutlined } from "@ant-design/icons";
import { Select, Space } from "gzd";

const smileIcon = <SmileOutlined />;
const mehIcon = <MehOutlined />;

const handleChange = (value: string | string[]) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <Space wrap>
    <Select
      prefix="User"
      defaultValue="lucy"
      placeholder="Select User"
      style={{ width: 200 }}
      onChange={handleChange}
      options={[
        { value: "jack", label: "Jack" },
        { value: "lucy", label: "Lucy" },
        { value: "Yiminghe", label: "yiminghe" },
        { value: "disabled", label: "Disabled", disabled: true },
      ]}
      allowClear
      showSearch
    />
    <Select
      suffixIcon={smileIcon}
      defaultValue="lucy"
      placeholder="Select"
      style={{ width: 120 }}
      onChange={handleChange}
      options={[
        { value: "jack", label: "Jack" },
        { value: "lucy", label: "Lucy" },
        { value: "Yiminghe", label: "yiminghe" },
        { value: "disabled", label: "Disabled", disabled: true },
      ]}
    />
    <Select
      suffixIcon={mehIcon}
      defaultValue="lucy"
      placeholder="Select"
      style={{ width: 120 }}
      disabled
      options={[{ value: "lucy", label: "Lucy" }]}
    />
    <br />
    <Select
      prefix="User"
      defaultValue={["lucy"]}
      placeholder="Select"
      mode="multiple"
      style={{ width: 200 }}
      onChange={handleChange}
      options={[
        { value: "jack", label: "Jack" },
        { value: "lucy", label: "Lucy" },
        { value: "Yiminghe", label: "yiminghe" },
        { value: "disabled", label: "Disabled", disabled: true },
      ]}
    />
    <Select
      suffixIcon={smileIcon}
      defaultValue={["lucy"]}
      placeholder="Select"
      mode="multiple"
      style={{ width: 120 }}
      onChange={handleChange}
      options={[
        { value: "jack", label: "Jack" },
        { value: "lucy", label: "Lucy" },
        { value: "Yiminghe", label: "yiminghe" },
        { value: "disabled", label: "Disabled", disabled: true },
      ]}
    />
    <Select
      suffixIcon={mehIcon}
      defaultValue={["lucy"]}
      placeholder="Select"
      mode="multiple"
      style={{ width: 120 }}
      disabled
      options={[{ value: "lucy", label: "Lucy" }]}
    />
  </Space>
);

export default App;
```

### 扩展菜单

使用 `popupRender` 对下拉菜单进行自由扩展。如果希望点击自定义内容后关闭浮层，你需要使用受控模式自行控制（[codesandbox](https://codesandbox.io/s/ji-ben-shi-yong-antd-4-21-7-forked-gnp4cy?file=/demo.js)）。

```tsx
import React, { useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Select, Space } from "gzd";
import type { InputRef } from "antd";

let index = 0;

const App: React.FC = () => {
  const [items, setItems] = useState(["jack", "lucy"]);
  const [name, setName] = useState("");
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Select
      style={{ width: 300 }}
      placeholder="custom dropdown render"
      popupRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          <Space style={{ padding: "0 8px 4px" }}>
            <Input
              placeholder="Please enter item"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
              Add item
            </Button>
          </Space>
        </>
      )}
      options={items.map((item) => ({ label: item, value: item }))}
    />
  );
};

export default App;
```

### 隐藏已选择选项

隐藏下拉列表中已选择的选项。

```tsx
import React, { useState } from "react";
import { Select } from "gzd";

const OPTIONS = ["Apples", "Nails", "Bananas", "Helicopters"];

const App: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

  return (
    <Select
      mode="multiple"
      placeholder="Inserted are removed"
      value={selectedItems}
      onChange={setSelectedItems}
      style={{ width: "100%" }}
      options={filteredOptions.map((item) => ({
        value: item,
        label: item,
      }))}
    />
  );
};

export default App;
```

### 形态变体

Select 形态变体，可选 `outlined` `filled` `borderless` `underlined` 四种形态。

```tsx
import React from "react";
import { Select } from "gzd";
import { Flex } from "antd";

const App: React.FC = () => (
  <Flex gap={12} vertical>
    <Flex gap={8}>
      <Select
        placeholder="Outlined"
        style={{ flex: 1 }}
        options={[
          { value: "jack", label: "Jack" },
          { value: "lucy", label: "Lucy" },
          { value: "Yiminghe", label: "yiminghe" },
        ]}
      />
      <Select
        mode="multiple"
        defaultValue={["lucy"]}
        placeholder="Outlined"
        style={{ flex: 1 }}
        options={[
          { value: "jack", label: "Jack" },
          { value: "lucy", label: "Lucy" },
          { value: "Yiminghe", label: "yiminghe" },
        ]}
      />
    </Flex>
    <Flex gap={8}>
      <Select
        placeholder="Filled"
        variant="filled"
        style={{ flex: 1 }}
        options={[
          { value: "jack", label: "Jack" },
          { value: "lucy", label: "Lucy" },
          { value: "Yiminghe", label: "yiminghe" },
        ]}
      />
      <Select
        mode="multiple"
        defaultValue={["lucy"]}
        placeholder="Filled"
        variant="filled"
        style={{ flex: 1 }}
        options={[
          { value: "jack", label: "Jack" },
          { value: "lucy", label: "Lucy" },
          { value: "Yiminghe", label: "yiminghe" },
        ]}
      />
    </Flex>
    <Flex gap={8}>
      <Select
        placeholder="Borderless"
        variant="borderless"
        style={{ flex: 1 }}
        options={[
          { value: "jack", label: "Jack" },
          { value: "lucy", label: "Lucy" },
          { value: "Yiminghe", label: "yiminghe" },
        ]}
      />
      <Select
        mode="multiple"
        defaultValue={["lucy"]}
        placeholder="Borderless"
        variant="borderless"
        style={{ flex: 1 }}
        options={[
          { value: "jack", label: "Jack" },
          { value: "lucy", label: "Lucy" },
          { value: "Yiminghe", label: "yiminghe" },
        ]}
      />
    </Flex>
    <Flex gap={8}>
      <Select
        placeholder="Underlined"
        variant="underlined"
        style={{ flex: 1 }}
        options={[
          { value: "jack", label: "Jack" },
          { value: "lucy", label: "Lucy" },
          { value: "Yiminghe", label: "yiminghe" },
        ]}
      />
      <Select
        mode="multiple"
        defaultValue={["lucy"]}
        placeholder="Underlined"
        variant="underlined"
        style={{ flex: 1 }}
        options={[
          { value: "jack", label: "Jack" },
          { value: "lucy", label: "Lucy" },
          { value: "Yiminghe", label: "yiminghe" },
        ]}
      />
    </Flex>
  </Flex>
);

export default App;
```

### 自定义选择标签

允许自定义选择标签的样式。

```tsx
import React from "react";
import { Select } from "gzd";
import { Tag } from "antd";
import type { SelectProps } from "antd";

type TagRender = SelectProps["tagRender"];

const options: SelectProps["options"] = [
  { value: "gold" },
  { value: "lime" },
  { value: "green" },
  { value: "cyan" },
];

const tagRender: TagRender = (props) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={value}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}>
      {label}
    </Tag>
  );
};

const App: React.FC = () => (
  <Select
    mode="multiple"
    tagRender={tagRender}
    defaultValue={["gold", "cyan"]}
    style={{ width: "100%" }}
    options={options}
  />
);

export default App;
```

### 自定义选中 label

允许自定义渲染当前选中的 label, 可用于 value 回填但对应选项缺失而不想直接渲染 value 的场景。

```tsx
import React from "react";
import { Select } from "gzd";
import type { SelectProps } from "antd";

type LabelRender = SelectProps["labelRender"];

const options = [
  { label: "gold", value: "gold" },
  { label: "lime", value: "lime" },
  { label: "green", value: "green" },
  { label: "cyan", value: "cyan" },
];

const labelRender: LabelRender = (props) => {
  const { label, value } = props;

  if (label) {
    return value;
  }
  return <span>No option match</span>;
};

const App: React.FC = () => (
  <Select
    labelRender={labelRender}
    defaultValue="1"
    style={{ width: "100%" }}
    options={options}
  />
);

export default App;
```

### 响应式 maxTagCount

多选下通过响应式布局让选项自动收缩。该功能对性能有所消耗，不推荐在大表单场景下使用。

```tsx
import React, { useState } from "react";
import type { SelectProps } from "antd";
import { Select, Space } from "gzd";
import { Tooltip } from "antd";

interface ItemProps {
  label: string;
  value: string;
}

const options: ItemProps[] = [];

for (let i = 10; i < 36; i++) {
  const value = i.toString(36) + i;
  options.push({
    label: `Long Label: ${value}`,
    value,
  });
}

const sharedProps: SelectProps = {
  mode: "multiple",
  style: { width: "100%" },
  options,
  placeholder: "Select Item...",
  maxTagCount: "responsive",
};

const App: React.FC = () => {
  const [value, setValue] = useState(["a10", "c12", "h17", "j19", "k20"]);

  const selectProps: SelectProps = {
    value,
    onChange: setValue,
  };

  return (
    <Space vertical style={{ width: "100%" }}>
      <Select {...sharedProps} {...selectProps} />
      <Select {...sharedProps} disabled />
      <Select
        {...sharedProps}
        {...selectProps}
        maxTagPlaceholder={(omittedValues) => (
          <Tooltip
            styles={{ root: { pointerEvents: "none" } }}
            title={omittedValues.map(({ label }) => label).join(", ")}>
            <span>Hover Me</span>
          </Tooltip>
        )}
      />
    </Space>
  );
};

export default App;
```

### 大数据

Select 默认针对大数据开启了[虚拟滚动](https://github.com/react-component/virtual-list)，因而获得了更好的性能，可以通过 `virtual={false}` 关闭。

```tsx
import React from "react";
import type { SelectProps } from "antd";
import { Select } from "gzd";
import { Typography } from "antd";

const { Title } = Typography;

const options: SelectProps["options"] = [];

for (let i = 0; i < 100000; i++) {
  const value = `${i.toString(36)}${i}`;
  options.push({
    label: value,
    value,
    disabled: i === 10,
  });
}

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <>
    <Title level={4}>{options.length} Items</Title>
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder="Please select"
      defaultValue={["a10", "c12"]}
      onChange={handleChange}
      options={options}
    />
  </>
);

export default App;
```

### 自定义状态

使用 `status` 为 Select 添加状态，可选 `error` 或者 `warning`。

```tsx
import React from "react";
import { Select, Space } from "gzd";

const App: React.FC = () => (
  <Space vertical style={{ width: "100%" }}>
    <Select status="error" style={{ width: "100%" }} />
    <Select status="warning" style={{ width: "100%" }} />
  </Space>
);

export default App;
```

### 弹出位置

可以通过 `placement` 手动指定弹出的位置。

```tsx
import React, { useState } from "react";
import type { RadioChangeEvent, SelectProps } from "antd";
import { Radio, Select } from "gzd";

type SelectCommonPlacement = SelectProps["placement"];

const App: React.FC = () => {
  const [placement, setPlacement] = useState<SelectCommonPlacement>("topLeft");

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
      <Select
        defaultValue="HangZhou"
        style={{ width: 120 }}
        popupMatchSelectWidth={false}
        placement={placement}
        options={[
          {
            value: "HangZhou",
            label: "HangZhou #310000",
          },
          {
            value: "NingBo",
            label: "NingBo #315000",
          },
          {
            value: "WenZhou",
            label: "WenZhou #325000",
          },
        ]}
      />
    </>
  );
};

export default App;
```

### 最大选中数量

你可以通过设置 `maxCount` 约束最多可选中的数量，当超出限制时会变成禁止选中状态。

```tsx
import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Select } from "gzd";

const MAX_COUNT = 3;

const App: React.FC = () => {
  const [value, setValue] = React.useState<string[]>(["Ava Swift"]);

  const suffix = (
    <>
      <span>
        {value.length} / {MAX_COUNT}
      </span>
      <DownOutlined />
    </>
  );

  return (
    <Select
      mode="multiple"
      maxCount={MAX_COUNT}
      value={value}
      style={{ width: "100%" }}
      onChange={setValue}
      suffixIcon={suffix}
      placeholder="Please select"
      options={[
        { value: "Ava Swift", label: "Ava Swift" },
        { value: "Cole Reed", label: "Cole Reed" },
        { value: "Mia Blake", label: "Mia Blake" },
        { value: "Jake Stone", label: "Jake Stone" },
        { value: "Lily Lane", label: "Lily Lane" },
        { value: "Ryan Chase", label: "Ryan Chase" },
        { value: "Zoe Fox", label: "Zoe Fox" },
        { value: "Alex Grey", label: "Alex Grey" },
        { value: "Elle Blair", label: "Elle Blair" },
      ]}
    />
  );
};

export default App;
```

## API

通用属性参考：[通用属性](/react/common-props)

### Select props

| 参数                     | 说明                                                                                                                                                                                           | 类型                                                                                       | 默认值                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------- | --------------------- | --------------- | -------------------- | --- |
| allowClear               | 自定义清除按钮                                                                                                                                                                                 | boolean \                                                                                  | { clearIcon?: ReactNode }                                                   | 5.8.0: 支持对象类型 |
| defaultActiveFirstOption | 是否默认高亮第一个选项                                                                                                                                                                         | boolean                                                                                    | true                                                                        |
| defaultOpen              | 是否默认展开下拉菜单                                                                                                                                                                           | boolean                                                                                    | -                                                                           |
| defaultValue             | 指定默认选中的条目                                                                                                                                                                             | string \                                                                                   | string\[] \                                                                 | number\[] \         | <br />LabeledValue \  | LabeledValue\[] | -                    |     |
| disabled                 | 是否禁用                                                                                                                                                                                       | boolean                                                                                    | false                                                                       |
| popupMatchSelectWidth    | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动                                                                                             | boolean \                                                                                  | number                                                                      | 5.5.0               |
| popupRender              | 自定义下拉框内容                                                                                                                                                                               | (originNode: ReactNode) => ReactNode                                                       | -                                                                           |
| fieldNames               | 自定义节点 label、value、options、groupLabel 的字段                                                                                                                                            | object                                                                                     | { label: `label`, value: `value`, options: `options`, groupLabel: `label` } |
| getPopupContainer        | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。[示例](https://codesandbox.io/s/4j168r7jw0)                                                | function(triggerNode)                                                                      | () => document.body                                                         |
| labelInValue             | 是否把每个选项的 label 包装到 value 中，会把 Select 的 value 类型从 `string` 变为 { value: string, label: ReactNode } 的格式                                                                   | boolean                                                                                    | false                                                                       |
| listHeight               | 设置弹窗滚动高度                                                                                                                                                                               | number                                                                                     | 256                                                                         |
| loading                  | 加载中状态                                                                                                                                                                                     | boolean                                                                                    | false                                                                       |
| maxCount                 | 指定可选中的最多 items 数量，仅在 `mode` 为 `multiple` 或 `tags` 时生效                                                                                                                        | number                                                                                     | -                                                                           |
| maxTagCount              | 最多显示多少个 tag，响应式模式会对性能产生损耗                                                                                                                                                 | number \                                                                                   | `responsive`                                                                | responsive: 4.10    |
| maxTagPlaceholder        | 隐藏 tag 时显示的内容                                                                                                                                                                          | ReactNode \                                                                                | function(omittedValues)                                                     |                     |
| maxTagTextLength         | 最大显示的 tag 文本长度                                                                                                                                                                        | number                                                                                     | -                                                                           |
| menuItemSelectedIcon     | 自定义多选时当前选中的条目图标                                                                                                                                                                 | ReactNode                                                                                  | -                                                                           |
| mode                     | 设置 Select 的模式为多选或标签                                                                                                                                                                 | `multiple` \                                                                               | `tags`                                                                      |                     |
| notFoundContent          | 当下拉列表为空时显示的内容                                                                                                                                                                     | ReactNode                                                                                  | `Not Found`                                                                 |
| open                     | 是否展开下拉菜单                                                                                                                                                                               | boolean                                                                                    | -                                                                           |
| optionLabelProp          | 回填到选择框的 Option 的属性值，默认是 Option 的子元素。比如在子元素需要高亮效果时，此值可以设为 `value`。[示例](https://codesandbox.io/s/antd-reproduction-template-tk678)                    | string                                                                                     | `children`                                                                  |
| options                  | 数据化配置选项内容，相比 jsx 定义会获得更好的渲染性能                                                                                                                                          | { label, value }\[]                                                                        | -                                                                           |
| optionRender             | 自定义渲染下拉选项                                                                                                                                                                             | (option: FlattenOptionData\<BaseOptionType\> , info: { index: number }) => React.ReactNode | -                                                                           |
| placeholder              | 选择框默认文本                                                                                                                                                                                 | string                                                                                     | -                                                                           |
| placement                | 选择框弹出的位置                                                                                                                                                                               | `bottomLeft` `bottomRight` `topLeft` `topRight`                                            | bottomLeft                                                                  |
| prefix                   | 自定义前缀                                                                                                                                                                                     | ReactNode                                                                                  | -                                                                           |
| removeIcon               | 自定义的多选框清除图标                                                                                                                                                                         | ReactNode                                                                                  | -                                                                           |
| showSearch               | 配置是否可搜索                                                                                                                                                                                 | boolean \                                                                                  | [Object](#showsearch)                                                       |                     |
| size                     | 选择框大小                                                                                                                                                                                     | `large` \                                                                                  | `medium` \                                                                  | `medium`            |                       |
| status                   | 设置校验状态                                                                                                                                                                                   | 'error' \                                                                                  | 'warning'                                                                   | 4.19.0              |
| suffixIcon               | 自定义的选择框后缀图标。以防止图标被用于其他交互，替换的图标默认不会响应展开、收缩事件，可以通过添加 `pointer-events: none` 样式透传。                                                         | ReactNode                                                                                  | `<DownOutlined />`                                                          |
| tagRender                | 自定义 tag 内容 render，仅在 `mode` 为 `multiple` 或 `tags` 时生效                                                                                                                             | (props) => ReactNode                                                                       | -                                                                           |
| labelRender              | 自定义当前选中的 label 内容 render （LabelInValueType的定义见 [LabelInValueType](https://github.com/react-component/select/blob/b39c28aa2a94e7754ebc570f200ab5fd33bd31e7/src/Select.tsx#L70)） | (props: LabelInValueType) => ReactNode                                                     | -                                                                           |
| tokenSeparators          | 自动分词的分隔符，仅在 `mode="tags"` 时生效                                                                                                                                                    | string\[]                                                                                  | -                                                                           |
| value                    | 指定当前选中的条目，多选时为一个数组。（value 数组引用未变化时，Select 不会更新）                                                                                                              | string \                                                                                   | string\[] \                                                                 | number\[] \         | <br />LabeledValue \  | LabeledValue\[] | -                    |     |
| variant                  | 形态变体                                                                                                                                                                                       | `outlined` \                                                                               | `borderless` \                                                              | `underlined`        | `outlined`            | 5.13.0 \        | `underlined`: 5.24.0 |
| virtual                  | 设置 false 时关闭虚拟滚动                                                                                                                                                                      | boolean                                                                                    | true                                                                        |
| onActive                 | 键盘和鼠标交互时触发                                                                                                                                                                           | function(value: string \                                                                   | number \                                                                    | -                   |                       |
| onBlur                   | 失去焦点时回调                                                                                                                                                                                 | function                                                                                   | -                                                                           |
| onChange                 | 选中 option，或 input 的 value 变化时，调用此函数                                                                                                                                              | function(value, option:Option \                                                            | Array&lt;Option>)                                                           |                     |
| onClear                  | 清除内容时回调                                                                                                                                                                                 | function                                                                                   | -                                                                           |
| onDeselect               | 取消选中时调用，参数为选中项的 value (或 key) 值，仅在 `multiple` 或 `tags` 模式下生效                                                                                                         | function(value: string \                                                                   | number \                                                                    | -                   |                       |
| onOpenChange             | 展开下拉菜单的回调                                                                                                                                                                             | (open: boolean) => void                                                                    | -                                                                           |
| onFocus                  | 获得焦点时回调                                                                                                                                                                                 | (event: FocusEvent) => void                                                                | -                                                                           |
| onInputKeyDown           | 按键按下时回调                                                                                                                                                                                 | (event: KeyboardEvent) => void                                                             | -                                                                           |
| onPopupScroll            | 下拉列表滚动时的回调                                                                                                                                                                           | (event: UIEvent) => void                                                                   | -                                                                           |
| onSelect                 | 被选中时调用，参数为选中项的 value (或 key) 值                                                                                                                                                 | function(value: string \                                                                   | number \                                                                    | -                   |                       |

> 注意，如果发现下拉菜单跟随页面滚动，或者需要在其他弹层中触发 Select，请尝试使用 `getPopupContainer={triggerNode => triggerNode.parentElement}` 将下拉弹层渲染节点固定在触发器的父元素中。

### showSearch

| 参数                 | 说明                                                                                                                                                                                                                          | 类型                                                                        | 默认值                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------- | ----------------- |
| autoClearSearchValue | 是否在选中项后清空搜索框，只在 `mode` 为 `multiple` 或 `tags` 时有效                                                                                                                                                          | boolean                                                                     | true                         |
| filterOption         | 是否根据输入项进行筛选。当其为一个函数时，会接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 true，反之则返回 false。[示例](#select-demo-search)                                                       | boolean \                                                                   | function(inputValue, option) |                   |
| filterSort           | 搜索时对筛选结果项的排序函数, 类似[Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)里的 compareFunction                                                               | (optionA: Option, optionB: Option, info: { searchValue: string }) => number | -                            |
| optionFilterProp     | 搜索时过滤对应的 `option` 属性，如设置为 `children` 表示对内嵌内容进行搜索。<br/> 若通过 `options` 属性配置选项内容，建议设置 `optionFilterProp="label"` 来对内容进行搜索。<br/> 当传入 `string[]` 时多个字段进行 OR 匹配搜索 | string \                                                                    | string[]                     | `string[]`: 6.1.0 |
| searchValue          | 控制搜索文本                                                                                                                                                                                                                  | string                                                                      | -                            |
| onSearch             | 文本框值变化时回调                                                                                                                                                                                                            | function(value: string)                                                     | -                            |

### Select Methods

| 名称    | 说明     |
| ------- | -------- |
| blur()  | 取消焦点 |
| focus() | 获取焦点 |

### Option props

| 参数      | 说明                     | 类型      | 默认值 |
| --------- | ------------------------ | --------- | ------ | --- |
| className | Option 器类名            | string    | -      |
| disabled  | 是否禁用                 | boolean   | false  |
| title     | 选项上的原生 title 提示  | string    | -      |
| value     | 默认根据此属性值进行筛选 | string \  | number |     |

### OptGroup props

| 参数      | 说明                    | 类型            | 默认值 |
| --------- | ----------------------- | --------------- | ------ |
| key       | Key                     | string          | -      |
| label     | 组名                    | React.ReactNode | -      |
| className | Option 器类名           | string          | -      |
| title     | 选项上的原生 title 提示 | string          | -      |

## FAQ

### `mode="tags"` 模式下为何搜索有时会出现两个相同选项？ {#faq-tags-mode-duplicate}

这一般是 `options` 中的 `label` 和 `value` 不同导致的，你可以通过 `optionFilterProp="label"` 将过滤设置为展示值以避免这种情况。

### 点击 `popupRender` 里的元素，下拉菜单不会自动消失？ {#faq-popup-not-close}

你可以使用受控模式，手动设置 `open` 属性：[codesandbox](https://codesandbox.io/s/ji-ben-shi-yong-antd-4-21-7-forked-gnp4cy?file=/demo.js)。

### 反过来希望点击 `popupRender` 里元素不消失该怎么办？ {#faq-popup-keep-open}

Select 当失去焦点时会关闭下拉框，如果你可以通过阻止默认行为避免丢失焦点导致的关闭：

```
<Select
  popupRender={() => (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      Some Content
    </div>
  )}
/>
```

### 自定义 Option 样式导致滚动异常怎么办？ {#faq-custom-option-scroll}

这是由于虚拟滚动默认选项高度为 `24px`，如果你的选项高度小于该值则需要通过 `listItemHeight` 属性调整，而 `listHeight` 用于设置滚动容器高度：

```
<Select listItemHeight={10} listHeight={250} />
```

注意：`listItemHeight` 和 `listHeight` 为内部属性，如无必要，请勿修改该值。

### 为何无障碍测试会报缺失 `aria-` 属性？ {#faq-aria-attribute}

Select 无障碍辅助元素仅在弹��展开时创建，因而当你在进行无障碍检测时请先打开下拉后再进行测试。对于 `aria-label` 与 `aria-labelledby` 属性缺失警告，请自行为 Select 组件添加相应无障碍属性。

Select 虚拟滚动会模拟无障碍绑定元素。如果需要读屏器完整获取全部列表，你可以设置 `virtual={false}` 关闭虚拟滚动，无障碍选项将会绑定到真实元素上。

### 使用 `tagRender` 生成的自定义标签，点击关闭时会呼出下拉框 {#faq-tagrender-dropdown}

如果你不希望点击某个元素后下拉框自动出现（例如关闭按钮），可以在其上阻止 `MouseDown` 事件的传播。

```
<Select
  tagRender={(props) => {
    const { closable, label, onClose } = props;
    return (
      <span className="border">
        {label}
        {closable ? (
          <span
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onClose}
            className="cursor-pointer"
          >
            ❎
          </span>
        ) : null}
      </span>
    );
  }}
/>
```
