---
group: 通用
title: Button 按钮
---

# Button 按钮

按钮用于开始一个即时操作。

## 基础用法

未来放弃 `type` 语法糖的写法，直接使用 `颜色与变体`的写法。

```tsx
import React from "react";
import { Button, Flex } from "gzd";

const App = () => {
  return (
    <Flex gap="small" wrap>
      <Button color="primary" variant="solid">
        Primary Button
      </Button>
      <Button color="default" variant="filled">
        Default Button
      </Button>
      <Button color="default" variant="dashed">
        Dashed Button
      </Button>
      <Button color="default" variant="text">
        Text Button
      </Button>
      <Button color="primary" variant="link">
        Link Button
      </Button>
    </Flex>
  );
};

export default App;
```

## 颜色与变体

同时设置 `color` 和 `variant` 属性，可以衍生出更多的变体按钮。

```tsx
import React from "react";
import { Button, Flex } from "gzd";

const App: React.FC = () => {
  return (
    <Flex vertical gap="small">
      <Flex gap="small" wrap>
        <Button color="default" variant="solid">
          Solid
        </Button>
        <Button color="default" variant="outlined">
          Outlined
        </Button>
        <Button color="default" variant="dashed">
          Dashed
        </Button>
        <Button color="default" variant="filled">
          Filled
        </Button>
        <Button color="default" variant="text">
          Text
        </Button>
        <Button color="default" variant="link">
          Link
        </Button>
      </Flex>
      <Flex gap="small" wrap>
        <Button color="primary" variant="solid">
          Solid
        </Button>
        <Button color="primary" variant="outlined">
          Outlined
        </Button>
        <Button color="primary" variant="dashed">
          Dashed
        </Button>
        <Button color="primary" variant="filled">
          Filled
        </Button>
        <Button color="primary" variant="text">
          Text
        </Button>
        <Button color="primary" variant="link">
          Link
        </Button>
      </Flex>
      <Flex gap="small" wrap>
        <Button color="danger" variant="solid">
          Solid
        </Button>
        <Button color="danger" variant="outlined">
          Outlined
        </Button>
        <Button color="danger" variant="dashed">
          Dashed
        </Button>
        <Button color="danger" variant="filled">
          Filled
        </Button>
        <Button color="danger" variant="text">
          Text
        </Button>
        <Button color="danger" variant="link">
          Link
        </Button>
      </Flex>
    </Flex>
  );
};

export default App;
```

## 按钮图标

可以通过 `icon` 属性添加图标。

```tsx
import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Tooltip, Flex } from "gzd";

const App: React.FC = () => (
  <Flex gap="small" vertical>
    <Flex wrap gap="small">
      <Tooltip title="search">
        <Button
          color="primary"
          variant="solid"
          shape="circle"
          icon={<SearchOutlined />}
        />
      </Tooltip>
      <Button color="primary" variant="solid" shape="circle">
        A
      </Button>
      <Button color="primary" variant="solid" icon={<SearchOutlined />}>
        Search
      </Button>
      <Tooltip title="search">
        <Button
          color="default"
          variant="outlined"
          shape="circle"
          icon={<SearchOutlined />}
        />
      </Tooltip>
      <Button color="default" variant="outlined" icon={<SearchOutlined />}>
        Search
      </Button>
    </Flex>
    <Flex wrap gap="small">
      <Tooltip title="search">
        <Button
          color="default"
          variant="text"
          shape="circle"
          icon={<SearchOutlined />}
        />
      </Tooltip>
      <Button color="default" variant="text" icon={<SearchOutlined />}>
        Search
      </Button>
      <Tooltip title="search">
        <Button
          color="default"
          variant="dashed"
          shape="circle"
          icon={<SearchOutlined />}
        />
      </Tooltip>
      <Button color="default" variant="dashed" icon={<SearchOutlined />}>
        Search
      </Button>
      <Button
        color="default"
        variant="outlined"
        icon={<SearchOutlined />}
        href="https://www.google.com"
        target="_blank"
      />
    </Flex>
  </Flex>
);

export default App;
```

## 按钮图标位置

通过设置 `iconPlacement` 为 `start` 或 `end` 分别设置按钮图标的位置。

```tsx
import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Radio, Space, Tooltip } from "gzd";

const App: React.FC = () => {
  const [position, setPosition] = useState<"start" | "end">("end");

  return (
    <>
      <Space>
        <Radio.Group
          value={position}
          onChange={(e) => setPosition(e.target.value)}>
          <Radio.Button value="start">start</Radio.Button>
          <Radio.Button value="end">end</Radio.Button>
        </Radio.Group>
      </Space>
      <Divider titlePlacement="start" plain>
        Preview
      </Divider>
      <Flex gap="small" vertical>
        <Flex wrap gap="small">
          <Tooltip title="search">
            <Button
              color="primary"
              variant="solid"
              shape="circle"
              icon={<SearchOutlined />}
            />
          </Tooltip>
          <Button color="primary" variant="solid" shape="circle">
            A
          </Button>
          <Button
            color="primary"
            variant="solid"
            icon={<SearchOutlined />}
            iconPlacement={position}>
            Search
          </Button>
          <Tooltip title="search">
            <Button
              color="default"
              variant="outlined"
              shape="circle"
              icon={<SearchOutlined />}
            />
          </Tooltip>
          <Button
            color="default"
            variant="outlined"
            icon={<SearchOutlined />}
            iconPlacement={position}>
            Search
          </Button>
        </Flex>
        <Flex wrap gap="small">
          <Tooltip title="search">
            <Button
              color="default"
              variant="outlined"
              shape="circle"
              icon={<SearchOutlined />}
            />
          </Tooltip>
          <Button
            color="default"
            variant="text"
            icon={<SearchOutlined />}
            iconPlacement={position}>
            Search
          </Button>
          <Tooltip title="search">
            <Button
              color="default"
              variant="dashed"
              shape="circle"
              icon={<SearchOutlined />}
            />
          </Tooltip>
          <Button
            color="default"
            variant="dashed"
            icon={<SearchOutlined />}
            iconPlacement={position}>
            Search
          </Button>
          <Button
            color="default"
            variant="outlined"
            icon={<SearchOutlined />}
            href="https://www.google.com"
            target="_blank"
            iconPlacement={position}
          />
          <Button
            color="primary"
            variant="solid"
            loading
            iconPlacement={position}>
            Loading
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default App;
```

## 按钮尺寸

按钮有大、中、小三种尺寸。

通过设置 `size` 为 `large` 或 `small` 分别把按钮设为大、小尺寸。若不设置 `size`，则尺寸默认为中。

```tsx
import React, { useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Radio } from "gzd";
import type { ConfigProviderProps } from "antd";

type SizeType = ConfigProviderProps["componentSize"];

const App: React.FC = () => {
  const [size, setSize] = useState<SizeType>("large"); // default is 'middle'
  return (
    <>
      <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
        <Radio.Button value="large">Large</Radio.Button>
        <Radio.Button value="default">Default</Radio.Button>
        <Radio.Button value="small">Small</Radio.Button>
      </Radio.Group>
      <Divider titlePlacement="start" plain>
        Preview
      </Divider>
      <Flex gap="small" align="flex-start" vertical>
        <Flex gap="small" wrap>
          <Button color="primary" variant="solid" size={size}>
            Primary
          </Button>
          <Button color="default" variant="outlined" size={size}>
            Default
          </Button>
          <Button color="default" variant="dashed" size={size}>
            Dashed
          </Button>
        </Flex>
        <Button color="primary" variant="link" size={size}>
          Link
        </Button>
        <Flex gap="small" wrap>
          <Button
            color="primary"
            variant="solid"
            icon={<DownloadOutlined />}
            size={size}
          />
          <Button
            color="primary"
            variant="solid"
            shape="circle"
            icon={<DownloadOutlined />}
            size={size}
          />
          <Button
            color="primary"
            variant="solid"
            shape="round"
            icon={<DownloadOutlined />}
            size={size}
          />
          <Button
            color="primary"
            variant="solid"
            shape="round"
            icon={<DownloadOutlined />}
            size={size}>
            Download
          </Button>
          <Button
            color="primary"
            variant="solid"
            icon={<DownloadOutlined />}
            size={size}>
            Download
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default App;
```

## 不可用状态

添加 `disabled` 属性即可让按钮处于不可用状态，同时按钮样式也会改变。

```tsx
import React from "react";
import { Button, Flex } from "gzd";

const App: React.FC = () => (
  <Flex gap="small" align="flex-start" vertical>
    <Flex gap="small">
      <Button color="primary" variant="solid">
        Primary
      </Button>
      <Button color="primary" variant="solid" disabled>
        Primary(disabled)
      </Button>
    </Flex>
    <Flex gap="small">
      <Button color="default" variant="outlined">
        Default
      </Button>
      <Button color="default" variant="outlined" disabled>
        Default(disabled)
      </Button>
    </Flex>
    <Flex gap="small">
      <Button color="default" variant="dashed">
        Dashed
      </Button>
      <Button color="default" variant="dashed" disabled>
        Dashed(disabled)
      </Button>
    </Flex>
    <Flex gap="small">
      <Button color="default" variant="text">
        Text
      </Button>
      <Button color="default" variant="text" disabled>
        Text(disabled)
      </Button>
    </Flex>
    <Flex gap="small">
      <Button color="primary" variant="link">
        Link
      </Button>
      <Button color="primary" variant="link" disabled>
        Link(disabled)
      </Button>
    </Flex>
    <Flex gap="small">
      <Button
        color="primary"
        variant="solid"
        href="https://ant.design/index-cn">
        Href Primary
      </Button>
      <Button
        color="primary"
        variant="solid"
        href="https://ant.design/index-cn"
        disabled>
        Href Primary(disabled)
      </Button>
    </Flex>
    <Flex gap="small">
      <Button color="danger" variant="outlined">
        Danger Default
      </Button>
      <Button color="danger" variant="outlined" disabled>
        Danger Default(disabled)
      </Button>
    </Flex>
    <Flex gap="small">
      <Button color="danger" variant="text">
        Danger Text
      </Button>
      <Button color="danger" variant="text" disabled>
        Danger Text(disabled)
      </Button>
    </Flex>
    <Flex gap="small">
      <Button color="danger" variant="link">
        Danger Link
      </Button>
      <Button color="danger" variant="link" disabled>
        Danger Link(disabled)
      </Button>
    </Flex>
    <Flex gap="small" style={{ padding: 16, background: "rgb(190, 200, 200)" }}>
      <Button color="default" variant="outlined" ghost>
        Ghost
      </Button>
      <Button color="default" variant="outlined" ghost disabled>
        Ghost(disabled)
      </Button>
    </Flex>
  </Flex>
);

export default App;
```

## 加载中状态

添加 `loading` 属性即可让按钮处于加载状态，`loading.icon` 可以自定义加载图标，最后三个按钮演示点击后进入加载状态。

```tsx
import React, { useState } from "react";
import { PoweroffOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Flex } from "gzd";

const App: React.FC = () => {
  const [loadings, setLoadings] = useState<boolean[]>([]);

  const enterLoading = (index: number) => {
    console.log("Start loading:", index);

    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 3000);
  };

  return (
    <Flex gap="small" vertical>
      <Flex gap="small" align="center" wrap>
        <Button color="primary" variant="solid" loading>
          Loading
        </Button>
        <Button color="primary" variant="solid" size="small" loading>
          Loading
        </Button>
        <Button
          color="primary"
          variant="solid"
          icon={<PoweroffOutlined />}
          loading
        />
        <Button
          color="primary"
          variant="solid"
          loading={{ icon: <SyncOutlined spin /> }}>
          Loading Icon
        </Button>
      </Flex>
      <Flex gap="small" wrap>
        <Button
          color="primary"
          variant="solid"
          loading={loadings[0]}
          onClick={() => enterLoading(0)}>
          Icon Start
        </Button>
        <Button
          color="primary"
          variant="solid"
          loading={loadings[2]}
          onClick={() => enterLoading(2)}
          iconPlacement="end">
          Icon End
        </Button>
        <Button
          color="primary"
          variant="solid"
          icon={<PoweroffOutlined />}
          loading={loadings[1]}
          onClick={() => enterLoading(1)}>
          Icon Replace
        </Button>
        <Button
          color="primary"
          variant="solid"
          icon={<PoweroffOutlined />}
          loading={loadings[3]}
          onClick={() => enterLoading(3)}
        />
        <Button
          color="primary"
          variant="solid"
          icon={<PoweroffOutlined />}
          loading={loadings[3] && { icon: <SyncOutlined spin /> }}
          onClick={() => enterLoading(3)}>
          Loading Icon
        </Button>
      </Flex>
    </Flex>
  );
};

export default App;
```

## 多个按钮组合

按钮组合使用时，推荐使用 1 个主操作 + n 个次操作，3 个以上操作时把更多操作放到 `Dropdown` 中组合使用。

```tsx
import React from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown, Flex, Space } from "gzd";

const onMenuClick: MenuProps["onClick"] = (e) => {
  console.log("click", e);
};

const items = [
  {
    key: "1",
    label: "1st item",
  },
  {
    key: "2",
    label: "2nd item",
  },
  {
    key: "3",
    label: "3rd item",
  },
];

const App: React.FC = () => (
  <Flex align="flex-start" gap="small" vertical>
    <Button color="primary" variant="solid">
      primary
    </Button>
    <Button color="default" variant="outlined">
      secondary
    </Button>
    <Space.Compact>
      <Button color="default" variant="outlined">
        Actions
      </Button>
      <Dropdown menu={{ items, onClick: onMenuClick }} placement="bottomRight">
        <Button
          color="default"
          variant="outlined"
          icon={<EllipsisOutlined />}
        />
      </Dropdown>
    </Space.Compact>
  </Flex>
);

export default App;
```

## 幽灵按钮

幽灵按钮将按钮的内容反色，背景变为透明，常用在有色背景上。

```tsx
import React from "react";
import { Button, Flex } from "gzd";

const App: React.FC = () => (
  <Flex
    wrap
    gap="small"
    style={{ padding: 16, background: "rgb(190, 200, 200)" }}>
    <Button color="primary" variant="solid" ghost>
      Primary
    </Button>
    <Button color="default" variant="outlined" ghost>
      Default
    </Button>
    <Button color="default" variant="dashed" ghost>
      Dashed
    </Button>
    <Button color="danger" variant="solid" ghost>
      Danger
    </Button>
  </Flex>
);

export default App;
```

## 危险按钮

在 4.0 之后，危险成为一种按钮属性而不是按钮类型。

```tsx
import React from "react";
import { Button, Flex } from "gzd";

const App: React.FC = () => (
  <Flex wrap gap="small">
    <Button color="danger" variant="solid">
      Primary
    </Button>
    <Button color="danger" variant="outlined">
      Default
    </Button>
    <Button color="danger" variant="dashed">
      Dashed
    </Button>
    <Button color="danger" variant="text">
      Text
    </Button>
    <Button color="danger" variant="link">
      Link
    </Button>
  </Flex>
);

export default App;
```

## Block 按钮

`block` 属性将使按钮适合其父宽度。

```tsx
import React from "react";
import { Button, Flex } from "gzd";

const App: React.FC = () => (
  <Flex vertical gap="small" style={{ width: "100%" }}>
    <Button color="primary" variant="solid" block>
      Primary
    </Button>
    <Button color="default" variant="outlined" block>
      Default
    </Button>
    <Button color="default" variant="dashed" block>
      Dashed
    </Button>
    <Button color="default" variant="outlined" disabled block>
      disabled
    </Button>
    <Button color="default" variant="text" block>
      text
    </Button>
    <Button color="primary" variant="link" block>
      Link
    </Button>
  </Flex>
);

export default App;
```

## 渐变按钮

在 `ConfigProvider themeMode="gold-dark"` 下，`color="primary" variant="solid"` 的 Button 会自动使用金色主题暗色模式的渐变背景。默认态、悬浮态、激活态的渐变色来自 Button component token 中的 `primaryGradient*` 扩展字段。

```tsx
import React from "react";
import { AntDesignOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Flex } from "gzd";

const App: React.FC = () => {
  return (
    <ConfigProvider themeMode="gold-dark">
      <Flex gap="small" wrap>
        <Button
          color="primary"
          variant="solid"
          size="large"
          icon={<AntDesignOutlined />}>
          Gradient Button
        </Button>
        <Button color="primary" variant="solid" shape="round">
          Round
        </Button>
        <Button
          color="primary"
          variant="solid"
          shape="circle"
          icon={<AntDesignOutlined />}
        />
        <Button color="default" variant="outlined" size="large">
          Button
        </Button>
      </Flex>
    </ConfigProvider>
  );
};

export default App;
```

## 自定义按钮波纹

波纹效果带来了灵动性，你也可以使用 `@ant-design/happy-work-theme` 提供的 `HappyProvider` 实现动态波纹效果。

```tsx
import React from "react";
import { HappyProvider } from "@ant-design/happy-work-theme";
import { Button, ConfigProvider, Flex } from "gzd";
import type { ConfigProviderProps, GetProp } from "antd";

type WaveConfig = GetProp<ConfigProviderProps, "wave">;

// Prepare effect holder
const createHolder = (node: HTMLElement) => {
  const { borderWidth } = getComputedStyle(node);
  const borderWidthNum = Number.parseInt(borderWidth, 10);

  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.inset = `-${borderWidthNum}px`;
  div.style.borderRadius = "inherit";
  div.style.background = "transparent";
  div.style.zIndex = "999";
  div.style.pointerEvents = "none";
  div.style.overflow = "hidden";
  node.appendChild(div);

  return div;
};

const createDot = (
  holder: HTMLElement,
  color: string,
  left: number,
  top: number,
  size = 0,
) => {
  const dot = document.createElement("div");
  dot.style.position = "absolute";
  dot.style.left = `${left}px`;
  dot.style.top = `${top}px`;
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;
  dot.style.borderRadius = "50%";
  dot.style.background = color;
  dot.style.transform = "translate3d(-50%, -50%, 0)";
  dot.style.transition = "all 1s ease-out";
  holder.appendChild(dot);
  return dot;
};

// Inset Effect
const showInsetEffect: WaveConfig["showEffect"] = (
  node,
  { event, component },
) => {
  if (component !== "Button") {
    return;
  }

  const holder = createHolder(node);

  const rect = holder.getBoundingClientRect();

  const left = event.clientX - rect.left;
  const top = event.clientY - rect.top;

  const dot = createDot(holder, "rgba(255, 255, 255, 0.65)", left, top);

  // Motion
  requestAnimationFrame(() => {
    dot.ontransitionend = () => {
      holder.remove();
    };

    dot.style.width = "200px";
    dot.style.height = "200px";
    dot.style.opacity = "0";
  });
};

// Shake Effect
const showShakeEffect: WaveConfig["showEffect"] = (node, { component }) => {
  if (component !== "Button") {
    return;
  }

  const seq = [0, -15, 15, -5, 5, 0];
  const itv = 10;

  let steps = 0;

  const loop = () => {
    cancelAnimationFrame((node as any).effectTimeout);

    (node as any).effectTimeout = requestAnimationFrame(() => {
      const currentStep = Math.floor(steps / itv);
      const current = seq[currentStep];
      const next = seq[currentStep + 1];

      if (next === undefined || next === null) {
        node.style.transform = "";
        node.style.transition = "";
        return;
      }

      // Trans from current to next by itv
      const angle = current + ((next - current) / itv) * (steps % itv);

      node.style.transform = `rotate(${angle}deg)`;
      node.style.transition = "none";

      steps += 1;
      loop();
    });
  };

  loop();
};

// Component
const Wrapper: React.FC<WaveConfig & { name: string }> = ({
  name,
  ...wave
}) => (
  <ConfigProvider wave={wave}>
    <Button color="primary" variant="solid">
      {name}
    </Button>
  </ConfigProvider>
);

const Demo: React.FC = () => (
  <Flex gap="large" wrap>
    <Wrapper name="Disabled" disabled />
    <Wrapper name="Default" />
    <Wrapper name="Inset" showEffect={showInsetEffect} />
    <Wrapper name="Shake" showEffect={showShakeEffect} />
    <HappyProvider>
      <Button color="primary" variant="solid">
        Happy Work
      </Button>
    </HappyProvider>
  </Flex>
);

export default Demo;
```

## 移除两个汉字之间的空格

我们默认在两个汉字之间添加空格，可以通过设置 `autoInsertSpace` 为 `false` 关闭。

```tsx
import React from "react";
import { Button, Flex } from "gzd";

const App: React.FC = () => (
  <Flex gap="small" wrap>
    <Button color="primary" variant="solid" autoInsertSpace={false}>
      确定
    </Button>
    <Button color="primary" variant="solid" autoInsertSpace>
      确定
    </Button>
  </Flex>
);

export default App;
```

## 自定义禁用样式背景

自定义 `disabled` 状态下的背景颜色(适用 `default` 和 `dashed` 类型)

```tsx
import React from "react";
import { Button, ConfigProvider, Flex } from "gzd";

const App: React.FC = () => (
  <Flex gap="small" wrap>
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBgDisabled: "rgba(0,0,0,0.1)",
            dashedBgDisabled: "rgba(0,0,0,0.4)",
          },
        },
      }}>
      <Button color="primary" variant="solid" disabled>
        Primary Button
      </Button>
      <Button color="default" variant="outlined" disabled>
        Default Button
      </Button>
      <Button color="default" variant="dashed" disabled>
        Dashed Button
      </Button>
    </ConfigProvider>
  </Flex>
);

export default App;
```

## API

通用属性参考：[通用属性](/react/common-props)

通过设置 Button 的属性来产生不同的按钮样式，推荐顺序为：`color` -> `variant` -> `shape` -> `size` -> `loading` -> `disabled`。

按钮的属性说明如下：

| 属性            | 说明                                                                                                                            | 类型                                                                | 默认值      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------- |
| type            | 按钮类型。当设置 `variant` 与 `color` 时以后者为准                                                                              | `'primary'` \| `'dashed'` \| `'link'` \| `'text'` \| `'default'`    | `'default'` |
| autoInsertSpace | 我们默认提供两个汉字之间的空格，可以设置 `autoInsertSpace` 为 `false` 关闭                                                      | boolean                                                             | true        |
| block           | 将按钮宽度调整为其父宽度的选项                                                                                                  | boolean                                                             | false       |
| color           | 设置按钮的颜色                                                                                                                  | `default` \| `primary` \| `danger` \| [PresetColors](#presetcolors) | -           |
| danger          | 语法糖，设置危险按钮。当设置 `color` 时会以后者为准                                                                             | boolean                                                             | false       |
| disabled        | 设置按钮失效状态                                                                                                                | boolean                                                             | false       |
| ghost           | 幽灵属性，使按钮背景透明                                                                                                        | boolean                                                             | false       |
| href            | 点击跳转的地址，指定此属性 button 的行为和 a 链接一致                                                                           | string                                                              | -           |
| htmlType        | 设置 `button` 原生的 `type` 值，可选值请参考 [HTML 标准](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button#type) | `submit` \| `reset` \| `button`                                     | `button`    |
| icon            | 设置按钮的图标组件                                                                                                              | ReactNode                                                           | -           |
| iconPlacement   | 设置按钮图标组件的位置                                                                                                          | `start` \| `end`                                                    | `start`     |
| loading         | 设置按钮载入状态                                                                                                                | boolean \| { delay: number, icon: ReactNode }                       | false       |
| shape           | 设置按钮形状                                                                                                                    | `default` \| `circle` \| `round`                                    | `default`   |
| size            | 设置按钮大小                                                                                                                    | `large` \| `middle` \| `small`                                      | `middle`    |
| target          | 相当于 a 链接的 target 属性，href 存在时生效                                                                                    | string                                                              | -           |

### PresetColors

> type PresetColors = 'blue' | 'purple' | 'cyan' | 'green' | 'magenta' | 'pink' | 'red' | 'orange' | 'yellow' | 'volcano' | 'geekblue' | 'lime' | 'gold';

## FAQ

### 类型和颜色与变体如何选择？ {#faq-type-color-variant}

类型本质上是颜色与变体的语法糖，内部为其提供了一组颜色与变体的映射关系。如果两者同时存在，优先使用颜色与变体。

```
<Button color="primary" variant="solid">click</Button>
```

等同于

```
<Button color="primary" variant="solid">
  click
</Button>
```

### 如何关闭点击波纹效果？ {#faq-close-wave-effect}

如果你不需要这个特性，可以设置 `ConfigProvider` 的 `wave` 的 `disabled` 为 `true`。

```
<ConfigProvider wave={{ disabled: true }}>
  <Button color="primary" variant="solid">click</Button>
</ConfigProvider>
```
