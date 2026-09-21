---
group: 数据展示
title: Tooltip 文字提示
---

# Tooltip 文字提示

## 何时使用 {#when-to-use}

鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作。

可用来代替系统默认的 `title` 提示，提供一个 `按钮/文字/操作` 的文案解释。

## 代码演示

### 基本

最简单的用法。

```tsx
import React from 'react';
import { Tooltip } from 'gzd';

const App: React.FC = () => (
  <Tooltip title="prompt text">
    <span>Tooltip will show on mouse enter.</span>
  </Tooltip>
);

export default App;
```

### 平滑过渡

通过 ConfigProvider 全局配置 实现同一时间只显示一个 Tooltip 的平滑过渡效果。

> **注意**：在 Dumi 等文档演示环境中，由于按需挂载机制的限制，**首次悬停时可能无法正确计算并执行平滑动画**，且开发者工具中可能无法观察到弹层的初始宽高属性。此现象仅存在于演示沙盒环境，在真实业务应用中（如 SPA）将表现正常。

```tsx
import React from 'react';
import { Flex } from 'antd';
import { Button, ConfigProvider, Tooltip } from 'gzd';

const SharedButton = ({ placement = 'top' }: { placement?: 'top' | 'bottom' }) => (
  <Tooltip title="Hello, Ant Design!" placement={placement}>
    <Button type="primary">Button</Button>
  </Tooltip>
);

const App: React.FC = () => {
  return (
    <ConfigProvider
      tooltip={{
        unique: true,
      }}
    >
      <Flex vertical gap="small">
        <Flex gap="small" justify="center">
          <SharedButton />
          <SharedButton />
        </Flex>
        <Flex gap="small" justify="center">
          <SharedButton placement="bottom" />
          <SharedButton placement="bottom" />
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default App;
```

### 位置

置有 12 个方向。

```tsx
import React from 'react';
import { Flex } from 'antd';
import { Button, ConfigProvider, Tooltip } from 'gzd';

const text = <span>prompt text</span>;

const buttonWidth = 80;

const App: React.FC = () => (
  <ConfigProvider button={{ style: { width: buttonWidth, margin: 4 } }}>
    <Flex vertical justify="center" align="center" className="demo">
      <Flex justify="center" align="center" style={{ whiteSpace: 'nowrap' }}>
        <Tooltip placement="topLeft" title={text}>
          <Button>TL</Button>
        </Tooltip>
        <Tooltip placement="top" title={text}>
          <Button>Top</Button>
        </Tooltip>
        <Tooltip placement="topRight" title={text}>
          <Button>TR</Button>
        </Tooltip>
      </Flex>
      <Flex style={{ width: buttonWidth * 5 + 32 }} justify="space-between" align="center">
        <Flex align="center" vertical>
          <Tooltip placement="leftTop" title={text}>
            <Button>LT</Button>
          </Tooltip>
          <Tooltip placement="left" title={text}>
            <Button>Left</Button>
          </Tooltip>
          <Tooltip placement="leftBottom" title={text}>
            <Button>LB</Button>
          </Tooltip>
        </Flex>
        <Flex align="center" vertical>
          <Tooltip placement="rightTop" title={text}>
            <Button>RT</Button>
          </Tooltip>
          <Tooltip placement="right" title={text}>
            <Button>Right</Button>
          </Tooltip>
          <Tooltip placement="rightBottom" title={text}>
            <Button>RB</Button>
          </Tooltip>
        </Flex>
      </Flex>
      <Flex justify="center" align="center" style={{ whiteSpace: 'nowrap' }}>
        <Tooltip placement="bottomLeft" title={text}>
          <Button>BL</Button>
        </Tooltip>
        <Tooltip placement="bottom" title={text}>
          <Button>Bottom</Button>
        </Tooltip>
        <Tooltip placement="bottomRight" title={text}>
          <Button>BR</Button>
        </Tooltip>
      </Flex>
    </Flex>
  </ConfigProvider>
);

export default App;
```

### 箭头展示

支持显示、隐藏以及将箭头保持居中定位。

```tsx
import React, { useMemo, useState } from 'react';
import { Flex } from 'antd';
import { Button, ConfigProvider, Segmented, Tooltip } from 'gzd';
import type { TooltipProps } from 'antd';

const text = <span>prompt text</span>;

const buttonWidth = 80;

const App: React.FC = () => {
  const [arrow, setArrow] = useState<'Show' | 'Hide' | 'Center'>('Show');

  const mergedArrow = useMemo<TooltipProps['arrow']>(() => {
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
        value={arrow}
        options={['Show', 'Hide', 'Center']}
        onChange={setArrow}
        style={{ marginBottom: 24 }}
      />
      <Flex vertical justify="center" align="center" className="demo">
        <Flex justify="center" align="center" style={{ whiteSpace: 'nowrap' }}>
          <Tooltip placement="topLeft" title={text} arrow={mergedArrow}>
            <Button>TL</Button>
          </Tooltip>
          <Tooltip placement="top" title={text} arrow={mergedArrow}>
            <Button>Top</Button>
          </Tooltip>
          <Tooltip placement="topRight" title={text} arrow={mergedArrow}>
            <Button>TR</Button>
          </Tooltip>
        </Flex>
        <Flex style={{ width: buttonWidth * 5 + 32 }} justify="space-between" align="center">
          <Flex align="center" vertical>
            <Tooltip placement="leftTop" title={text} arrow={mergedArrow}>
              <Button>LT</Button>
            </Tooltip>
            <Tooltip placement="left" title={text} arrow={mergedArrow}>
              <Button>Left</Button>
            </Tooltip>
            <Tooltip placement="leftBottom" title={text} arrow={mergedArrow}>
              <Button>LB</Button>
            </Tooltip>
          </Flex>
          <Flex align="center" vertical>
            <Tooltip placement="rightTop" title={text} arrow={mergedArrow}>
              <Button>RT</Button>
            </Tooltip>
            <Tooltip placement="right" title={text} arrow={mergedArrow}>
              <Button>Right</Button>
            </Tooltip>
            <Tooltip placement="rightBottom" title={text} arrow={mergedArrow}>
              <Button>RB</Button>
            </Tooltip>
          </Flex>
        </Flex>
        <Flex justify="center" align="center" style={{ whiteSpace: 'nowrap' }}>
          <Tooltip placement="bottomLeft" title={text} arrow={mergedArrow}>
            <Button>BL</Button>
          </Tooltip>
          <Tooltip placement="bottom" title={text} arrow={mergedArrow}>
            <Button>Bottom</Button>
          </Tooltip>
          <Tooltip placement="bottomRight" title={text} arrow={mergedArrow}>
            <Button>BR</Button>
          </Tooltip>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default App;
```

### 贴边偏移

当 Tooltip 贴边时，自动偏移并且调整箭头位置。当超出过多时，则一同滚出屏幕。

```tsx
/**
 * iframe: 300
 */
import React from 'react';
import { Button, Tooltip } from 'gzd';

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
      <Tooltip title="Thanks for using antd. Have a nice day !" open>
        <Button type="primary">Scroll The Window</Button>
      </Tooltip>
    </div>
  );
};

export default App;
```



### 多彩文字提示

我们添加了多种预设色彩的文字提示样式，用作不同场景使用。

```tsx
import React from 'react';
import { Button, Divider, Space, Tooltip } from 'gzd';

const colors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];

const customColors = ['#f50', '#2db7f5', '#87d068', '#108ee9'];

const App: React.FC = () => (
  <>
    <Divider titlePlacement="start">Presets</Divider>
    <Space wrap>
      {colors.map((color) => (
        <Tooltip title="prompt text" color={color} key={color}>
          <Button>{color}</Button>
        </Tooltip>
      ))}
    </Space>
    <Divider titlePlacement="start">Custom</Divider>
    <Space wrap>
      {customColors.map((color) => (
        <Tooltip title="prompt text" color={color} key={color}>
          <Button>{color}</Button>
        </Tooltip>
      ))}
    </Space>
  </>
);

export default App;
```


### 禁用

通过设置 `title={null}` 或者 `title=""` 可以禁用 Tooltip。

```tsx
import React, { useState } from 'react';
import { Button, Tooltip } from 'gzd';

const App: React.FC = () => {
  const [disabled, setDisabled] = useState(true);

  return (
    <Tooltip title={disabled ? null : 'prompt text'}>
      <Button onClick={() => setDisabled(!disabled)}>{disabled ? 'Enable' : 'Disable'}</Button>
    </Tooltip>
  );
};

export default App;
```


### 自定义子组件

与自定义组件一起使用.

```tsx
import React from 'react';
import { Tooltip } from 'gzd';

const ComponentWithEvents = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => (
    <span ref={ref} {...props}>
      This text is inside a component with the necessary events exposed.
    </span>
  ),
);

const App: React.FC = () => (
  <Tooltip title="prompt text">
    <ComponentWithEvents />
  </Tooltip>
);

export default App;
```

## API

通用属性参考：[通用属性](/react/common-props)

| 参数 | 说明 | 类型 | 默认值  |
| --- | --- | --- | ---  |
| title | 提示文字 | ReactNode \| () => ReactNode | -  |
| color | 设置背景颜色，使用该属性后内部文字颜色将自适应 | string | -  |

### 共同的 API

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

### ConfigProvider - tooltip.unique {#config-provider-tooltip-unique}

可以通过 ConfigProvider 全局配置 Tooltip 的唯一性显示。当 `unique` 设置为 `true` 时，同一时间 ConfigProvider 下的 Tooltip 只会显示一个，提供更好的用户体验和平滑的过渡效果。

注意：配置后 `getContainer`、`arrow` 等属性将会失效。

```
import { Button, ConfigProvider, Space, Tooltip } from 'gzd';

export default () => (
  <ConfigProvider
    tooltip={{
      unique: true,
    }}
  >
    <Space>
      <Tooltip title="第一个提示">
        <Button>按钮 1</Button>
      </Tooltip>
      <Tooltip title="第二个提示">
        <Button>按钮 2</Button>
      </Tooltip>
    </Space>
  </ConfigProvider>
);
```
