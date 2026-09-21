---
group: 导航
title: Tabs 标签页
---

# Tabs 标签页

选项卡切换组件。

## 何时使用

提供平级的区域将大块内容进行收纳和展现，保持界面整洁。
Ant Design 依次提供了三级选项卡，分别用于不同的场景。

- 卡片式的页签，提供可关闭的样式，常用于容器顶部。
- 标准线条式页签，用于容器内部的主功能切换，这是最常用的 Tabs。
- Radio/RadioButton 可作为更次级的页签来使用。

## 代码演示

### 基本用法

默认选中第一项。

```tsx
import React from "react";
import { Tabs } from "gzd";
import type { TabsProps } from "antd";

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

const App: React.FC = () => <Tabs defaultActiveKey="1" items={items} />;

export default App;
```

### 禁用

禁用某一项。

```tsx
import React from "react";
import { Tabs } from "gzd";

const App: React.FC = () => (
  <Tabs
    defaultActiveKey="1"
    items={[
      {
        label: "Tab 1",
        key: "1",
        children: "Tab 1",
      },
      {
        label: "Tab 2",
        key: "2",
        children: "Tab 2",
        disabled: true,
      },
      {
        label: "Tab 3",
        key: "3",
        children: "Tab 3",
      },
    ]}
  />
);

export default App;
```

### 居中

标签居中展示。

```tsx
import React from "react";
import { Tabs } from "gzd";

const App: React.FC = () => (
  <Tabs
    defaultActiveKey="1"
    centered
    items={[
      {
        label: "Tab 1",
        key: "1",
        children: "Content of Tab Pane 1",
      },
      {
        label: "Tab 2",
        key: "2",
        children: "Content of Tab Pane 2",
      },
      {
        label: "Tab 3",
        key: "3",
        children: "Content of Tab Pane 3",
      },
    ]}
  />
);

export default App;
```

### 图标

有图标的标签。

```tsx
import React from "react";
import { AndroidOutlined, AppleOutlined } from "@ant-design/icons";
import { Tabs } from "gzd";

const App: React.FC = () => (
  <Tabs
    defaultActiveKey="2"
    items={[
      {
        label: "Tab 1",
        key: "1",
        icon: <AppleOutlined />,
        children: "Tab 1",
      },
      {
        label: "Tab 2",
        key: "2",
        icon: <AndroidOutlined />,
        children: "Tab 2",
      },
    ]}
  />
);

export default App;
```

### 指示条

设置 `indicator` 属性，自定义指示条宽度和对齐方式。

```tsx
import React from "react";
import { Segmented } from "antd";
import { Tabs, type TabsProps } from "gzd";

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  { key: "1", label: "Tab 1", children: "Content of Tab Pane 1" },
  { key: "2", label: "Tab 2", children: "Content of Tab Pane 2" },
  { key: "3", label: "Tab 3", children: "Content of Tab Pane 3" },
];

type Align = "start" | "center" | "end";

const App: React.FC = () => {
  const [alignValue, setAlignValue] = React.useState<Align>("center");
  return (
    <>
      <Segmented
        value={alignValue}
        style={{ marginBottom: 8 }}
        onChange={setAlignValue}
        options={["start", "center", "end"]}
      />
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        indicator={{ size: (origin) => origin - 20, align: alignValue }}
      />
    </>
  );
};

export default App;
```

### 滑动

可以左右、上下滑动，容纳更多标签。

```tsx
import React, { useState } from "react";
import { Radio } from "antd";
import { Tabs } from "gzd";

const App: React.FC = () => {
  const [mode, setMode] = useState<"top" | "left" | "right" | "bottom">("top");

  const handleModeChange = (e: any) => {
    setMode(e.target.value);
  };

  return (
    <div>
      <Radio.Group
        onChange={handleModeChange}
        value={mode}
        style={{ marginBottom: 8 }}
      >
        <Radio.Button value="top">Horizontal</Radio.Button>
        <Radio.Button value="left">Vertical</Radio.Button>
      </Radio.Group>
      <Tabs
        defaultActiveKey="1"
        tabPosition={mode}
        style={{ height: 220 }}
        items={new Array(30).fill(null).map((_, i) => {
          const id = String(i);
          return {
            label: `Tab-${id}`,
            key: id,
            disabled: i === 28,
            children: `Content of tab ${id}`,
          };
        })}
      />
    </div>
  );
};

export default App;
```

### 附加内容

可以在页签两边添加附加操作。

```tsx
import React, { useMemo, useState } from "react";
import type { TabBarExtraMap } from "@rc-component/tabs/es/interface";
import { Button, Divider, Tabs } from "gzd";
import { Checkbox } from "antd";

const CheckboxGroup = Checkbox.Group;

const operations = <Button>Extra Action</Button>;

const operationsSlot: Record<PositionType, React.ReactNode> = {
  left: <Button style={{ marginRight: 16 }}>Left Extra Action</Button>,
  right: <Button>Right Extra Action</Button>,
};

const options = ["left", "right"];

type PositionType = "left" | "right";

const items = Array.from({ length: 3 }).map((_, i) => {
  const id = String(i + 1);
  return {
    label: `Tab ${id}`,
    key: id,
    children: `Content of tab ${id}`,
  };
});

const App: React.FC = () => {
  const [position, setPosition] = useState<PositionType[]>(["left", "right"]);

  const slot = useMemo(() => {
    if (position.length === 0) {
      return null;
    }
    return position.reduce<TabBarExtraMap>(
      (acc, direction) => ({ ...acc, [direction]: operationsSlot[direction] }),
      {},
    );
  }, [position]);

  return (
    <>
      <Tabs tabBarExtraContent={operations} items={items} />
      <br />
      <br />
      <br />
      <div>You can also specify its direction or both side</div>
      <Divider />
      <CheckboxGroup<PositionType>
        options={options}
        value={position}
        onChange={setPosition}
      />
      <br />
      <br />
      <Tabs tabBarExtraContent={slot} items={items} />
    </>
  );
};

export default App;
```

### 大小

大号页签用在页头区域，小号用在弹出框等较狭窄的容器内。

```tsx
import React, { useRef, useState } from "react";
import type { RadioChangeEvent } from "antd";
import { Radio } from "antd";
import type { TabsProps } from "gzd";
import { Tabs } from "gzd";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const App: React.FC = () => {
  const [size, setSize] = useState<"small" | "medium" | "large">("small");
  const [activeKey, setActiveKey] = useState("1");
  const [items, setItems] = useState<TabsProps["items"]>([
    {
      label: "Tab 1",
      key: "1",
      children: "Content of editable tab 1",
    },
    {
      label: "Tab 2",
      key: "2",
      children: "Content of editable tab 2",
    },
    {
      label: "Tab 3",
      key: "3",
      children: "Content of editable tab 3",
    },
  ]);
  const newTabIndex = useRef(0);

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    setItems([
      ...(items || []),
      {
        label: "New Tab",
        key: newActiveKey,
        children: "Content of new Tab",
      },
    ]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    if (!items) {
      return;
    }
    const targetIndex = items.findIndex((item) => item.key === targetKey);
    const newItems = items.filter((item) => item.key !== targetKey);

    if (newItems.length && targetKey === activeKey) {
      const newActiveKey =
        newItems[
          targetIndex === newItems.length ? targetIndex - 1 : targetIndex
        ].key;
      setActiveKey(newActiveKey);
    }

    setItems(newItems);
  };

  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  const onChange = (e: RadioChangeEvent) => {
    setSize(e.target.value);
  };

  return (
    <div>
      <Radio.Group
        value={size}
        onChange={onChange}
        style={{ marginBottom: 16 }}
      >
        <Radio.Button value="small">Small</Radio.Button>
        <Radio.Button value="medium">Medium</Radio.Button>
        <Radio.Button value="large">Large</Radio.Button>
      </Radio.Group>
      <Tabs
        defaultActiveKey="1"
        size={size}
        style={{ marginBottom: 32 }}
        items={Array.from({ length: 3 }).map((_, i) => {
          const id = String(i + 1);
          return {
            label: `Tab ${id}`,
            key: id,
            children: `Content of tab ${id}`,
          };
        })}
      />
      <Tabs
        defaultActiveKey="1"
        type="card"
        size={size}
        style={{ marginBottom: 32 }}
        items={Array.from({ length: 3 }).map((_, i) => {
          const id = String(i + 1);
          return {
            label: `Card Tab ${id}`,
            key: id,
            children: `Content of card tab ${id}`,
          };
        })}
      />
      <Tabs
        type="editable-card"
        size={size}
        activeKey={activeKey}
        onChange={setActiveKey}
        onEdit={onEdit}
        items={items}
      />
    </div>
  );
};

export default App;
```

### 位置

有四个位置，`tabPlacement="start|end|top|bottom"`。在移动端下，`start|end` 会自动切换成 `top`。

```tsx
import React, { useState } from "react";
import type { RadioChangeEvent } from "antd";
import { Radio } from "antd";
import type { TabsProps } from "gzd";
import { Space, Tabs } from "gzd";

const App: React.FC = () => {
  const [tabPlacement, setTabPlacement] =
    useState<TabsProps["tabPlacement"]>("start");

  const changeTabPlacement = (e: RadioChangeEvent) => {
    setTabPlacement(e.target.value);
  };

  return (
    <>
      <Space style={{ marginBottom: 24 }}>
        Tab placement:
        <Radio.Group value={tabPlacement} onChange={changeTabPlacement}>
          <Radio.Button value="top">top</Radio.Button>
          <Radio.Button value="bottom">bottom</Radio.Button>
          <Radio.Button value="start">start</Radio.Button>
          <Radio.Button value="end">end</Radio.Button>
        </Radio.Group>
      </Space>
      <Tabs
        tabPlacement={tabPlacement}
        items={Array.from({ length: 3 }).map((_, i) => {
          const id = String(i + 1);
          return {
            label: `Tab ${id}`,
            key: id,
            children: `Content of Tab ${id}`,
          };
        })}
      />
    </>
  );
};

export default App;
```

### 卡片式页签

另一种样式的页签，不提供对应的垂直样式。

```tsx
import React from "react";
import { Tabs } from "gzd";

const App: React.FC = () => (
  <Tabs
    type="card"
    items={new Array(3).fill(null).map((_, i) => {
      const id = String(i + 1);
      return {
        label: `Tab ${id}`,
        key: id,
        children: `Content of Tab Pane ${id}`,
      };
    })}
  />
);

export default App;
```

### 新增和关闭页签

只有卡片样式的页签支持新增和关闭选项。使用 `closable={false}` 禁止关闭。

```tsx
import React, { useRef, useState } from "react";
import { Tabs } from "gzd";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const initialItems = [
  { label: "Tab 1", children: "Content of Tab 1", key: "1" },
  { label: "Tab 2", children: "Content of Tab 2", key: "2" },
  {
    label: "Tab 3",
    children: "Content of Tab 3",
    key: "3",
    closable: false,
  },
];

const App: React.FC = () => {
  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: "New Tab",
      children: "Content of new Tab",
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove",
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
      items={items}
    />
  );
};

export default App;
```

### 自定义新增页签触发器

隐藏默认的页签增加图标，给自定义触发器绑定事件。

```tsx
import React, { useRef, useState } from "react";
import { Button } from "antd";
import { Tabs } from "gzd";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const initialItems = [
  { label: "Tab 1", children: "Content of Tab 1", key: "1" },
  { label: "Tab 2", children: "Content of Tab 2", key: "2" },
];

const App: React.FC = () => {
  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: "New Tab",
      children: "Content of new Tab",
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove",
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={add}>ADD</Button>
      </div>
      <Tabs
        hideAdd
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
      />
    </div>
  );
};

export default App;
```

### 自定义页签头

使用 react-sticky-box 和 renderTabBar 实现吸顶效果。

```tsx
import React from "react";
import type { TabsProps } from "antd";
import { Tabs, theme } from "antd";
import StickyBox from "react-sticky-box";

const items = Array.from({ length: 3 }).map((_, i) => {
  const id = String(i + 1);
  return {
    label: `Tab ${id}`,
    key: id,
    children: `Content of Tab Pane ${id}`,
    style: i === 0 ? { height: 200 } : undefined,
  };
});

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const renderTabBar: TabsProps["renderTabBar"] = (props, DefaultTabBar) => (
    <StickyBox offsetTop={64} offsetBottom={20} style={{ zIndex: 1 }}>
      <DefaultTabBar {...props} style={{ background: colorBgContainer }} />
    </StickyBox>
  );
  return (
    <Tabs defaultActiveKey="1" renderTabBar={renderTabBar} items={items} />
  );
};

export default App;
```

### 可拖拽标签

使用 `@dnd-kit/core` 实现标签可拖拽。

```tsx
import React, { useRef, useState } from "react";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tabs } from "gzd";
import type { TabsProps } from "antd";

const DraggableTabNode = ({
  className,
  "data-node-key": key,
  ...props
}: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: key,
    });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "move",
  };

  return React.cloneElement(props.children as React.ReactElement, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners,
  });
};

const App: React.FC = () => {
  const [items, setItems] = useState<TabsProps["items"]>([
    { key: "1", label: "Tab 1", children: "Content of Tab Pane 1" },
    { key: "2", label: "Tab 2", children: "Content of Tab Pane 2" },
    { key: "3", label: "Tab 3", children: "Content of Tab Pane 3" },
  ]);

  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  const onDragEnd = ({ active, over }: any) => {
    if (active.id !== over?.id) {
      setItems((prev) => {
        const activeIndex = prev!.findIndex((i) => i.key === active.id);
        const overIndex = prev!.findIndex((i) => i.key === over?.id);
        return arrayMove(prev!, activeIndex, overIndex);
      });
    }
  };

  return (
    <Tabs
      items={items}
      renderTabBar={(tabBarProps, DefaultTabBar) => (
        <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
          <SortableContext
            items={items!.map((i) => i.key)}
            strategy={horizontalListSortingStrategy}
          >
            <DefaultTabBar {...tabBarProps}>
              {(node) => (
                <DraggableTabNode {...node.props} key={node.key}>
                  {node}
                </DraggableTabNode>
              )}
            </DefaultTabBar>
          </SortableContext>
        </DndContext>
      )}
    />
  );
};

export default App;
```

## API

### Tabs

| 参数             | 说明                                                                          | 类型                                                                                            | 默认值                           |
| ---------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------- | 
| activeKey        | 当前激活 tab 面板的 key                                                       | string                                                                                          | -                                |
| addIcon          | 自定义添加按钮                                                                | ReactNode                                                                                       | -                                |
| animated         | 是否使用动画切换 Tabs，在 `tabPosition="top" \| "bottom"` 时有效              | boolean \| { inkBar: boolean, tabPane: boolean }                                                | { inkBar: true, tabPane: false } |
| centered         | 标签居中展示                                                                  | boolean                                                                                         | false                            |
| defaultActiveKey | 初始化选中面板的 key，如果没有设置 activeKey                                  | string                                                                                          | 第一个面板                       |
| hideAdd          | 是否隐藏加号图标，在 `type="editable-card"` 时有效                            | boolean                                                                                         | false                            |
| indicator        | 包含 `size` 及 `align` 属性的对象，可以用来控制指示条的宽度以及位置           | { size: number \| ((origin: number) => number); align: `start` \| `center` \| `end` }           | -                                |
| items            | 配置选项卡内容                                                                | [TabItemType](#tabitemtype)\[]                                                                  | \[]                              |
| more             | 自定义折叠菜单属性                                                            | [MoreProps](#moreprops)                                                                         | -                                |
| removeIcon       | 自定义删除按钮                                                                | ReactNode                                                                                       | -                                |
| renderTabBar     | 替换 TabBar，用于二次封装标签头                                               | (props: DefaultTabBarProps, DefaultTabBar: React.ComponentClass) => React.ReactElement          | -                                |
| size             | 大小，提供 `large` `default` 和 `small` 三种大小                              | string                                                                                          | `default`                        |
| tabBarExtraContent | tab bar 上额外的元素 | ReactNode \| {left?: ReactNode, right?: ReactNode} | - |
| tabBarGutter | tabs 之间的间隙 | number | - |
| tabBarStyle | tab bar 的样式对象 | CSSProperties | - |
| tabPlacement | 页签位置，可选值有 `top` `end` `bottom` `start` | string | `top` |
| destroyOnHidden | 被隐藏时是否销毁 DOM 结构 | boolean | false |
| type | 页签的基本样式，可选 `line`、`card` `editable-card` 类型 | string | `line` |
| onChange | 切换面板的回调 | (activeKey: string) => void | - |
| onEdit | 新增和删除页签的回调，在 `type="editable-card"` 时有效 | (action === 'add' ? event : targetKey, action) => void | - |
| onTabClick | tab 被点击的回调 | (key: string, event: MouseEvent) => void | - |
| onTabScroll | tab 滚动时触发 | ({ direction: `left` \| `right` \| `top` \| `bottom` }) => void | - |

### TabItemType

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| closeIcon | 自定义关闭图标，在 `type="editable-card"` 时有效。5.7.0：设置为 `null` 或 `false` 时隐藏关闭按钮 | ReactNode | - |
| destroyOnHidden | 被隐藏时是否销毁 DOM 结构 | boolean | false |
| disabled | 禁用某一项 | boolean | false |
| forceRender | 被隐藏时是否渲染 DOM 结构 | boolean | false |
| key | 对应 activeKey | string | - |
| label | 选项卡头部文字元素 | ReactNode | - |
| icon | 选项卡头部图标元素 | ReactNode | - |
| children | 选项卡内容元素 | ReactNode | - |
| closable | 是否显示选项卡的关闭按钮，在 `type="editable-card"` 时有效 | boolean | true |

### MoreProps

| 参数                                                           | 说明                 | 类型                                                           | 默认值 |
| -------------------------------------------------------------- | -------------------- | -------------------------------------------------------------- | ------ |
| icon                                                           | 自定义折叠图标       | ReactNode                                                      | -      | 
| [DropdownProps](https://ant.design/components/dropdown-cn#api) | 透传 Dropdown 的属性 | [DropdownProps](https://ant.design/components/dropdown-cn#api) | -      |
