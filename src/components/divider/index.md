---
group: 布局
title: Divider 分割线
---

# Divider 分割线

区隔内容的分割线。

## 何时使用

- 对不同章节的文本段落进行分割。
- 对行内文字/链接进行分割，例如表格的操作列。

## 代码演示

### 水平分割线

默认为水平分割线，可在中间加入文字。

```tsx
import React from 'react';
import { Divider } from 'antd';

const App: React.FC = () => (
  <>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider />
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider dashed />
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
  </>
);

export default App;
```

### 带文字的分割线

分割线中带有文字，可以用 `titlePlacement` 指定文字位置。

```tsx
import React from 'react';
import { Divider } from 'antd';

const App: React.FC = () => (
  <>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider>Text</Divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider titlePlacement="start">Left Text</Divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider titlePlacement="end">Right Text</Divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider titlePlacement="start" styles={{ content: { margin: 0 } }}>
      Left Text margin with 0
    </Divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider titlePlacement="end" styles={{ content: { margin: '0 50px' } }}>
      Right Text margin with 50px
    </Divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
  </>
);

export default App;
```

### 设置分割线的间距大小

间距的大小。

```tsx
import React from 'react';
import { Divider } from 'antd';

const App: React.FC = () => (
  <>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider size="small" />
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider size="middle" />
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider size="large" />
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
  </>
);

export default App;
```

### 分割文字使用正文样式

使用 `plain` 可以设置为更轻量的分割文字样式。

```tsx
import React from 'react';
import { Divider } from 'antd';

const App: React.FC = () => (
  <>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider plain>Text</Divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider titlePlacement="start" plain>
      Left Text
    </Divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider titlePlacement="end" plain>
      Right Text
    </Divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
  </>
);

export default App;
```

### 垂直分割线

使用 `orientation="vertical"` 或者 `vertical` 设置为行内的垂直分割线。

```tsx
import React from 'react';
import { Divider } from 'antd';

const App: React.FC = () => (
  <>
    Text
    <Divider orientation="vertical" />
    <a href="#">Link</a>
    <Divider vertical />
    <a href="#">Link</a>
  </>
);

export default App;
```

### 变体

分隔线默认为 `solid`（实线）变体。您可以将其更改为 `dashed`（虚线）或 `dotted`（点线）。

```tsx
import React from 'react';
import { Divider } from 'antd';

const App: React.FC = () => (
  <>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider style={{ borderColor: '#7cb305' }}>Solid</Divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider variant="dotted" style={{ borderColor: '#7cb305' }}>
      Dotted
    </Divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
    <Divider variant="dashed" style={{ borderColor: '#7cb305' }} dashed>
      Dashed
    </Divider>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
      probare, quae sunt a te dicta? Refert tamen, quo modo.
    </p>
  </>
);

export default App;
```

## API

通用属性参考：[通用属性](/react/common-props)

| 属性           | 说明                                                 | 类型                            | 默认值       |
| -------------- | ---------------------------------------------------- | ------------------------------- | ------------ |
| children       | 嵌套的标题                                           | ReactNode                       | -            |
| className      | 分割线样式类                                         | string                          | -            |
| dashed         | 是否虚线                                             | boolean                         | false        |
| orientation    | 水平或垂直类型                                       | `horizontal` \| `vertical`      | `horizontal` |
| plain          | 文字是否显示为普通正文样式                           | boolean                         | false        |
| style          | 分割线样式对象                                       | CSSProperties                   | -            |
| size           | 间距大小，仅对水平布局有效                           | `small` \| `medium` \| `large`  | -            |
| titlePlacement | 分割线标题的位置                                     | `start` \| `end` \| `center`    | `center`     |
| variant        | 分割线是虚线、点线还是实线                           | `dashed` \| `dotted` \| `solid` | solid        |
| vertical       | 是否垂直，和 orientation 同时配置以 orientation 优先 | boolean                         | false        |