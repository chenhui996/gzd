---
group: 数据展示
title: Popover 气泡卡片
---

# Popover 气泡卡片

## 何时使用 {#when-to-use}

当目标元素有进一步的描述和相关操作时，可以收纳到卡片中，根据用户的操作行为进行展现。

和 `Tooltip` 的区别是，用户可以对浮层上的元素进行操作，因此它可以承载更复杂的内容，比如链接或按钮等。

## 代码演示

### 基本

最简单的用法，浮层的大小由内容区域决定。

```tsx
import React from 'react';
import { Button, Popover } from 'gzd';

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const App: React.FC = () => (
  <Popover content={content} title="Title">
    <Button type="primary">Hover me</Button>
  </Popover>
);

export default App;
```

### 三种触发方式

鼠标移入、聚集、点击。

```tsx
import React from 'react';
import { Button, Popover, Space } from 'gzd';

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const App: React.FC = () => (
  <Space wrap>
    <Popover content={content} title="Title" trigger="hover">
      <Button>Hover me</Button>
    </Popover>
    <Popover content={content} title="Title" trigger="focus">
      <Button>Focus me</Button>
    </Popover>
    <Popover content={content} title="Title" trigger="click">
      <Button>Click me</Button>
    </Popover>
  </Space>
);

export default App;
```

### 位置

位置有十二个方向。

```tsx
import React from 'react';
import { Flex } from 'antd';
import { Button, ConfigProvider, Popover } from 'gzd';

const text = <span>Title</span>;

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const buttonWidth = 80;

const App: React.FC = () => (
  <ConfigProvider button={{ style: { width: buttonWidth, margin: 4 } }}>
    <Flex vertical justify="center" align="center" className="demo">
      <Flex justify="center" align="center" style={{ whiteSpace: 'nowrap' }}>
        <Popover placement="topLeft" title={text} content={content}>
          <Button>TL</Button>
        </Popover>
        <Popover placement="top" title={text} content={content}>
          <Button>Top</Button>
        </Popover>
        <Popover placement="topRight" title={text} content={content}>
          <Button>TR</Button>
        </Popover>
      </Flex>
      <Flex style={{ width: buttonWidth * 5 + 32 }} justify="space-between" align="center">
        <Flex align="center" vertical>
          <Popover placement="leftTop" title={text} content={content}>
            <Button>LT</Button>
          </Popover>
          <Popover placement="left" title={text} content={content}>
            <Button>Left</Button>
          </Popover>
          <Popover placement="leftBottom" title={text} content={content}>
            <Button>LB</Button>
          </Popover>
        </Flex>
        <Flex align="center" vertical>
          <Popover placement="rightTop" title={text} content={content}>
            <Button>RT</Button>
          </Popover>
          <Popover placement="right" title={text} content={content}>
            <Button>Right</Button>
          </Popover>
          <Popover placement="rightBottom" title={text} content={content}>
            <Button>RB</Button>
          </Popover>
        </Flex>
      </Flex>
      <Flex justify="center" align="center" style={{ whiteSpace: 'nowrap' }}>
        <Popover placement="bottomLeft" title={text} content={content}>
          <Button>BL</Button>
        </Popover>
        <Popover placement="bottom" title={text} content={content}>
          <Button>Bottom</Button>
        </Popover>
        <Popover placement="bottomRight" title={text} content={content}>
          <Button>BR</Button>
        </Popover>
      </Flex>
    </Flex>
  </ConfigProvider>
);

export default App;
```

### 箭头展示

通过 `arrow` 属性隐藏箭头。

```tsx
import React, { useMemo, useState } from 'react';
import { Flex, Segmented } from 'antd';
import { Button, ConfigProvider, Popover } from 'gzd';
import type { PopoverProps } from 'antd';

const text = <span>Title</span>;

const buttonWidth = 80;

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const App: React.FC = () => {
  const [arrow, setArrow] = useState<'Show' | 'Hide' | 'Center'>('Show');

  const mergedArrow = useMemo<PopoverProps['arrow']>(() => {
    if (arrow === 'Hide') {
      return false;
    }

    if (arrow === 'Show') {
      return true;
    }

    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  return (
    <ConfigProvider button={{ style: { width: buttonWidth, margin: 4 } }}>
      <Segmented
        options={['Show', 'Hide', 'Center']}
        onChange={setArrow}
        style={{ marginBottom: 24 }}
      />
      <Flex vertical justify="center" align="center" className="demo">
        <Flex justify="center" align="center" style={{ whiteSpace: 'nowrap' }}>
          <Popover placement="topLeft" title={text} content={content} arrow={mergedArrow}>
            <Button>TL</Button>
          </Popover>
          <Popover placement="top" title={text} content={content} arrow={mergedArrow}>
            <Button>Top</Button>
          </Popover>
          <Popover placement="topRight" title={text} content={content} arrow={mergedArrow}>
            <Button>TR</Button>
          </Popover>
        </Flex>
        <Flex style={{ width: buttonWidth * 5 + 32 }} justify="space-between" align="center">
          <Flex align="center" vertical>
            <Popover placement="leftTop" title={text} content={content} arrow={mergedArrow}>
              <Button>LT</Button>
            </Popover>
            <Popover placement="left" title={text} content={content} arrow={mergedArrow}>
              <Button>Left</Button>
            </Popover>
            <Popover placement="leftBottom" title={text} content={content} arrow={mergedArrow}>
              <Button>LB</Button>
            </Popover>
          </Flex>
          <Flex align="center" vertical>
            <Popover placement="rightTop" title={text} content={content} arrow={mergedArrow}>
              <Button>RT</Button>
            </Popover>
            <Popover placement="right" title={text} content={content} arrow={mergedArrow}>
              <Button>Right</Button>
            </Popover>
            <Popover placement="rightBottom" title={text} content={content} arrow={mergedArrow}>
              <Button>RB</Button>
            </Popover>
          </Flex>
        </Flex>
        <Flex justify="center" align="center" style={{ whiteSpace: 'nowrap' }}>
          <Popover placement="bottomLeft" title={text} content={content} arrow={mergedArrow}>
            <Button>BL</Button>
          </Popover>
          <Popover placement="bottom" title={text} content={content} arrow={mergedArrow}>
            <Button>Bottom</Button>
          </Popover>
          <Popover placement="bottomRight" title={text} content={content} arrow={mergedArrow}>
            <Button>BR</Button>
          </Popover>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default App;
```


### 贴边偏移

当 Popover 贴边时，自动偏移并且调整箭头位置。当超出过多时，则一同滚出屏幕。

```tsx
/**
 * iframe: 300
 */
import React from 'react';
import { Button, Popover } from 'gzd';

const style: React.CSSProperties = {
  width: '300vw',
  height: '300vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const App: React.FC = () => {
  React.useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);
  return (
    <div style={style}>
      <Popover content="Thanks for using antd. Have a nice day !" open>
        <Button type="primary">Scroll The Window</Button>
      </Popover>
    </div>
  );
};

export default App;
```

### 从浮层内关闭

使用 `open` 属性控制浮层显示。

```tsx
import React, { useState } from 'react';
import { Button, Popover } from 'gzd';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Popover
      content={<a onClick={hide}>Close</a>}
      title="Title"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button type="primary">Click me</Button>
    </Popover>
  );
};

export default App;
```

### 悬停点击弹出窗口

以下示例显示如何创建可悬停和单击的弹出窗口。

```tsx
import React, { useState } from 'react';
import { Button, Popover } from 'gzd';

const hoverContent = <div>This is hover content.</div>;

const clickContent = <div>This is click content.</div>;

const App: React.FC = () => {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const hide = () => {
    setClicked(false);
    setHovered(false);
  };

  const handleHoverChange = (open: boolean) => {
    setHovered(open);
    setClicked(false);
  };

  const handleClickChange = (open: boolean) => {
    setHovered(false);
    setClicked(open);
  };

  return (
    <Popover
      style={{ width: 500 }}
      content={hoverContent}
      title="Hover title"
      trigger="hover"
      open={hovered}
      onOpenChange={handleHoverChange}
    >
      <Popover
        content={
          <div>
            {clickContent}
            <a onClick={hide}>Close</a>
          </div>
        }
        title="Click title"
        trigger="click"
        open={clicked}
        onOpenChange={handleClickChange}
      >
        <Button>Hover and click</Button>
      </Popover>
    </Popover>
  );
};

export default App;
```


## API

通用属性参考：[通用属性](/react/common-props)

| 参数 | 说明 | 类型 | 默认值  |
| --- | --- | --- | ---  |
| content | 卡片内容 | ReactNode \| () => ReactNode | -  |
| title | 卡片标题 | ReactNode \| () => ReactNode | -  |

## 共同的 API

> 更多通用属性参考 `Tooltip` 组件的 API。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| align | 请参考 [dom-align](https://github.com/yiminghe/dom-align) 进行配置 | object | - |
| arrow | 修改箭头的显示状态以及修改箭头是否指向目标元素中心 | boolean \| { pointAtCenter: boolean } | true |
| autoAdjustOverflow | 气泡被遮挡时自动调整位置 | boolean | true |
| color | 背景颜色 | string | - |
| defaultOpen | 默认是否显隐 | boolean | false |
| destroyOnHidden | 关闭后是否销毁 dom | boolean | false |
| fresh | 默认情况下，Tooltip 在关闭时会缓存内容。设置该属性后会始终保持更新 | boolean | false |
| getPopupContainer | 浮层渲染父节点，默认渲染到 body 上 | (triggerNode: HTMLElement) => HTMLElement | () => document.body |
| mouseEnterDelay | 鼠标移入后延时多少才显示 Tooltip，单位：秒 | number | 0.1 |
| mouseLeaveDelay | 鼠标移出后延时多少才隐藏 Tooltip，单位：秒 | number | 0.1 |
| placement | 气泡框位置，可选 `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom` | string | `top` |
| trigger | 触发行为，可选 `hover` \| `focus` \| `click` \| `contextMenu`，可使用数组设置多个触发行为 | string \| string\[] | `hover` |
| open | 用于手动控制浮层显隐，小于 4.23.0 使用 `visible`（[为什么?](/docs/react/faq#弹层类组件为什么要统一至-open-属性)） | boolean | false |
| zIndex | 设置 Tooltip 的 `z-index` | number | - |
| onOpenChange | 显示隐藏的回调 | (open: boolean) => void | - |

## 注意

请确保 `Popover` 的子元素能接受 `onMouseEnter`、`onMouseLeave`、`onFocus`、`onClick` 事件。
