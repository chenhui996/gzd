---
group: 数据展示
title: Tag 标签
---

# Tag 标签

## 何时使用 {#when-to-use}

- 用于标记事物的属性和维度。
- 进行分类。

## 代码演示

### 基本

基本标签的用法，可以通过设置 `closeIcon` 变为可关闭标签并自定义关闭按钮，设置为 `true` 时将使用默认关闭按钮。可关闭标签具有 `onClose` 事件。

```tsx
import React from "react";
import { CloseCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { Tag } from "gzd";

const preventDefault = (e: React.MouseEvent<HTMLElement>) => {
  e.preventDefault();
  console.log("Clicked! But prevent default.");
};

const App: React.FC = () => (
  <Flex gap="small" align="center" wrap>
    <Tag>Tag 1</Tag>
    <Tag>
      <a
        href="https://github.com/ant-design/ant-design/issues/1862"
        target="_blank"
        rel="noopener noreferrer">
        Link
      </a>
    </Tag>
    <Tag closeIcon onClose={preventDefault}>
      Prevent Default
    </Tag>
    <Tag closeIcon={<CloseCircleOutlined />} onClose={console.log}>
      Tag 2
    </Tag>
    <Tag
      closable={{
        closeIcon: <DeleteOutlined />,
        "aria-label": "Close Button",
      }}
      onClose={console.log}>
      Tag 3
    </Tag>
  </Flex>
);

export default App;
```

### 多彩标签

我们提供了多种标签色彩及 `filled`、`outlined`、`solid` 三种样式。如果这些色彩不能满足你的需求，也可以设置为具体的色值。

```tsx
import React from "react";
import { Flex } from "antd";
import { Divider, Tag } from "gzd";

const variants = ["filled", "outlined", "solid"] as const;
const colors = [
  "primary",
  "default",
  "red",
  "volcano",
  "orange",
  "gold",
  "yellow",
  "lime",
  "green",
  "cyan",
  "geekblue",
  "purple",
  "magenta",
];
const customs = ["#f50", "#2db7f5", "#87d068", "#108ee9"];

const App: React.FC = () => (
  <>
    {variants.map((variant) => (
      <div key={variant}>
        <Divider titlePlacement="start">Colors ({variant})</Divider>
        <Flex gap="small" align="center" wrap>
          {colors.map((color) => (
            <Tag key={color} color={color} variant={variant}>
              {color}
            </Tag>
          ))}
        </Flex>
      </div>
    ))}
    {variants.map((variant) => (
      <div key={variant}>
        <Divider titlePlacement="start">Custom ({variant})</Divider>
        <Flex gap="small" align="center" wrap>
          {customs.map((color) => (
            <Tag key={color} color={color} variant={variant}>
              {color}
            </Tag>
          ))}
        </Flex>
      </div>
    ))}
  </>
);

export default App;
```

### 动态添加和删除

用数组生成一组标签，可以动态添加和删除。

```tsx
import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Flex, theme, Tooltip } from "antd";
import { Input, Tag } from "gzd";

const tagInputStyle: React.CSSProperties = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: "top",
};

const App: React.FC = () => {
  const { token } = theme.useToken();
  const [tags, setTags] = useState<string[]>(["Unremovable", "Tag 2", "Tag 3"]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue("");
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  return (
    <Flex gap="small" align="center" wrap>
      {tags.map<React.ReactNode>((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              style={tagInputStyle}
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            key={tag}
            closable={index !== 0}
            style={{ userSelect: "none" }}
            onClose={() => handleClose(tag)}>
            <span
              onDoubleClick={(e) => {
                if (index !== 0) {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  e.preventDefault();
                }
              }}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={tagInputStyle}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
          New Tag
        </Tag>
      )}
    </Flex>
  );
};

export default App;
```

### 可选择标签

可通过 `CheckableTag` 实现类似 Checkbox 的效果，点击切换选中效果。而 `CheckableTagGroup` 则提供了类似 `CheckboxGroup` 或 `RadioGroup` 的功能。

> CheckableTag 为完全受控组件，不支持非受控用法。

```tsx
import React, { useState } from "react";
import { Form, Tag } from "gzd";

const tagsData = ["Movies", "Books", "Music", "Sports"];

const App: React.FC = () => {
  const [checked, setChecked] = useState(true);
  const [singleSelected, setSingleSelected] = useState<string | null>("Books");
  const [multipleSelected, setMultipleSelected] = useState<string[]>([
    "Movies",
    "Music",
  ]);

  return (
    <Form labelCol={{ span: 6 }}>
      <Form.Item label="Checkable">
        <Tag.CheckableTag checked={checked} onChange={setChecked}>
          Yes
        </Tag.CheckableTag>
      </Form.Item>
      <Form.Item label="Single">
        <Tag.CheckableTagGroup
          options={tagsData}
          value={singleSelected}
          onChange={setSingleSelected}
        />
      </Form.Item>
      <Form.Item label="Multiple">
        <Tag.CheckableTagGroup
          multiple
          options={tagsData}
          value={multipleSelected}
          onChange={setMultipleSelected}
        />
      </Form.Item>
    </Form>
  );
};

export default App;
```

### 添加动画

使用 `rc-tween-one` 给标签增加添加或删除动画。

```tsx
import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { theme } from "antd";
import { Input, Tag } from "gzd";
import { TweenOneGroup } from "rc-tween-one";

const tagGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 8,
};

const App: React.FC = () => {
  const { token } = theme.useToken();
  const [tags, setTags] = useState(["Tag 1", "Tag 2", "Tag 3"]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const tagPlusStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  return (
    <>
      <TweenOneGroup
        appear={false}
        style={tagGroupStyle}
        enter={{ scale: 0.8, opacity: 0, type: "from", duration: 100 }}
        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
        onEnd={(e) => {
          if (e.type === "appear" || e.type === "enter") {
            (e.target as any).style = "display: inline-block";
          }
        }}>
        {tags.map((tag) => (
          <Tag
            key={tag}
            closable
            onClose={(e) => {
              e.preventDefault();
              handleClose(tag);
            }}>
            {tag}
          </Tag>
        ))}
      </TweenOneGroup>
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag onClick={showInput} style={tagPlusStyle}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </>
  );
};

export default App;
```

### 图标按钮

你可以通过 `icon` 属性为标签添加自定义图标。

若需要控制图标的位置，请在 `children` 中直接使用 `<XXXIcon />` 组件，而非通过 `icon` 属性实现。

```tsx
import React from "react";
import {
  FacebookOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Flex } from "antd";
import { Divider, Tag } from "gzd";

const App: React.FC = () => {
  const [checked, setChecked] = React.useState<Array<boolean>>([
    true,
    false,
    false,
    false,
  ]);

  const handleChange = (index: number, value: boolean) => {
    const newChecked = [...checked];
    newChecked[index] = value;
    setChecked(newChecked);
  };

  return (
    <>
      <Divider titlePlacement="start">Tag with icon</Divider>
      <Flex gap="small" wrap align="center">
        <Tag icon={<TwitterOutlined />} color="#55acee">
          Twitter
        </Tag>
        <Tag icon={<YoutubeOutlined />} color="#cd201f">
          Youtube
        </Tag>
        <Tag icon={<FacebookOutlined />} color="#3b5999">
          Facebook
        </Tag>
        <Tag icon={<LinkedinOutlined />} color="#55acee">
          LinkedIn
        </Tag>
      </Flex>
      <Divider titlePlacement="start">CheckableTag with icon</Divider>
      <Flex gap="small" wrap align="center">
        <Tag.CheckableTag
          icon={<TwitterOutlined />}
          checked={checked[0]}
          onChange={(checked) => handleChange(0, checked)}>
          Twitter
        </Tag.CheckableTag>
        <Tag.CheckableTag
          icon={<YoutubeOutlined />}
          checked={checked[1]}
          onChange={(checked) => handleChange(1, checked)}>
          Youtube
        </Tag.CheckableTag>
        <Tag.CheckableTag
          icon={<FacebookOutlined />}
          checked={checked[2]}
          onChange={(checked) => handleChange(2, checked)}>
          Facebook
        </Tag.CheckableTag>
        <Tag.CheckableTag
          icon={<LinkedinOutlined />}
          checked={checked[3]}
          onChange={(checked) => handleChange(3, checked)}>
          LinkedIn
        </Tag.CheckableTag>
      </Flex>
    </>
  );
};

export default App;
```

### 预设状态的标签

预设五种状态颜色，可以通过设置 `color` 为 `success`、 `processing`、`error`、`default`、`warning` 来代表不同的状态。

```tsx
import React from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Flex } from "antd";
import { Divider, Tag } from "gzd";

const variants = ["filled", "solid", "outlined"] as const;
const presets = [
  { status: "success", icon: <CheckCircleOutlined /> },
  { status: "processing", icon: <SyncOutlined spin /> },
  { status: "warning", icon: <ExclamationCircleOutlined /> },
  { status: "error", icon: <CloseCircleOutlined /> },
  { status: "default", icon: <ClockCircleOutlined /> },
];

const App: React.FC = () => (
  <>
    {variants.map((variant) => (
      <div key={variant}>
        <Divider titlePlacement="start">Status ({variant})</Divider>
        <Flex gap="small" align="center" wrap>
          {presets.map(({ status, icon }) => (
            <Tag key={status} color={status} icon={icon} variant={variant}>
              {status}
            </Tag>
          ))}
        </Flex>
      </div>
    ))}
  </>
);

export default App;
```

### 可拖拽标签

使用 dnd kit 实现的可拖拽标签。

```tsx
import React, { useState } from "react";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { Flex } from "antd";
import { Tag } from "gzd";

interface Item {
  id: number;
  text: string;
}

interface DraggableTagProps {
  tag: Item;
}

const commonStyle: React.CSSProperties = {
  cursor: "move",
  transition: "unset", // Prevent element from shaking after drag
};

const DraggableTag: React.FC<DraggableTagProps> = (props) => {
  const { tag } = props;
  const { listeners, transform, transition, isDragging, setNodeRef } =
    useSortable({ id: tag.id });

  const style = transform
    ? {
        ...commonStyle,
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: isDragging ? "unset" : transition, // Improve performance/visual effect when dragging
      }
    : commonStyle;

  return (
    <Tag style={style} ref={setNodeRef} {...listeners}>
      {tag.text}
    </Tag>
  );
};

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, text: "Tag 1" },
    { id: 2, text: "Tag 2" },
    { id: 3, text: "Tag 3" },
  ]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    if (active.id !== over.id) {
      setItems((data) => {
        const oldIndex = data.findIndex((item) => item.id === active.id);
        const newIndex = data.findIndex((item) => item.id === over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}>
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <Flex gap="small" align="center" wrap>
          {items.map<React.ReactNode>((item) => (
            <DraggableTag tag={item} key={item.id} />
          ))}
        </Flex>
      </SortableContext>
    </DndContext>
  );
};

export default App;
```

## API

通用属性参考：[通用属性](/react/common-props)

### Tag

| 参数      | 说明                                                       | 类型                                                   | 默认值     |
| --------- | ---------------------------------------------------------- | ------------------------------------------------------ | ---------- |
| closeIcon | 自定义关闭按钮。                                           | ReactNode                                              | false      |
| color     | 标签色                                                     | string                                                 | -          |
| disabled  | 是否禁用标签                                               | boolean                                                | false      |
| href      | 点击跳转的地址，指定此属性`tag`组件会渲染成 `<a>` 标签     | string                                                 | -          |
| icon      | 设置图标                                                   | ReactNode                                              | -          |
| onClose   | 关闭时的回调（可通过 `e.preventDefault()` 来阻止默认行为） | (e: React.MouseEvent<HTMLElement, MouseEvent>) => void | -          |
| target    | 相当于 a 标签的 target 属性，href 存在时生效               | string                                                 | -          |
| variant   | 标签变体                                                   | `'filled' \| 'solid' \| 'outlined'`                    | `'filled'` |

### Tag.CheckableTag

| 参数     | 说明                 | 类型              | 默认值 |
| -------- | -------------------- | ----------------- | ------ |
| checked  | 设置标签的选中状态   | boolean           | false  |
| icon     | 设置图标             | ReactNode         | -      |
| onChange | 点击标签时触发的回调 | (checked) => void | -      |

### Tag.CheckableTagGroup

| 参数         | 说明                 | 类型                                                                       | 默认值 |
| ------------ | -------------------- | -------------------------------------------------------------------------- | ------ |
| defaultValue | 初始选中值           | `string \| number \| Array<string \| number> \| null`                      | -      |
| disabled     | 禁用选中             | `boolean`                                                                  | -      |
| multiple     | 多选模式             | `boolean`                                                                  | -      |
| options      | 选项列表             | `Array<{ label: ReactNode; value: string \| number } \| string \| number>` | -      |
| value        | 选中值               | `string \| number \| Array<string \| number> \| null`                      | -      |
| onChange     | 点击标签时触发的回调 | `(value: string \| number \| Array<string \| number> \| null) => void`     | -      |
