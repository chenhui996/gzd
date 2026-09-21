---
group: 导航
title: Pagination 分页
---

# Pagination 分页

采用分页的形式分隔长列表，每次只加载一个页面。

## 何时使用

- 当加载/渲染所有数据将花费很多时间时；
- 可切换页码浏览数据。

## 代码演示

### 基本

基础分页。

```tsx
import React from 'react';
import { Pagination } from 'gzd';

export default () => <Pagination defaultCurrent={1} total={50} />;
```

### 方向

分页组件的对齐方向。你可以通过 `align` 属性控制分页的方向，比如 `start`、`center` 或 `end`。

```tsx
import React from 'react';
import { Pagination } from 'gzd';

export default () => (
  <>
    <Pagination align="start" defaultCurrent={1} total={50} />
    <br />
    <Pagination align="center" defaultCurrent={1} total={50} />
    <br />
    <Pagination align="end" defaultCurrent={1} total={50} />
  </>
);
```

### 更多

更多分页。

```tsx
import React from 'react';
import { Pagination } from 'gzd';

export default () => <Pagination defaultCurrent={6} total={500} />;
```

### 改变

改变每页显示条目数。

```tsx
import React from 'react';
import { Pagination } from 'gzd';
import type { PaginationProps } from 'antd';

export default () => {
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    console.log(current, pageSize);
  };

  return (
    <>
      <Pagination
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        defaultCurrent={3}
        total={500}
      />
      <br />
      <Pagination
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        defaultCurrent={3}
        total={500}
        disabled
      />
    </>
  );
};
```

### 跳转

快速跳转到某一页。

```tsx
import React from 'react';
import { Pagination } from 'gzd';
import type { PaginationProps } from 'antd';

export default () => {
  const onChange: PaginationProps['onChange'] = (pageNumber) => {
    console.log('Page: ', pageNumber);
  };

  return (
    <>
      <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChange} />
      <br />
      <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={onChange} disabled />
    </>
  );
};
```

### 尺寸

迷你版本。

```tsx
import React from 'react';
import { Flex } from 'antd';
import type { PaginationProps } from 'gzd';
import { Divider, Pagination } from 'gzd';

const showTotal: PaginationProps['showTotal'] = (total) => `Total ${total} items`;

const App: React.FC = () => (
  <Flex vertical gap={16}>
    <Divider titlePlacement="start">Small</Divider>

    <Pagination size="small" total={50} style={{marginBottom: 12}} />
    <Pagination size="small" total={50} showSizeChanger showQuickJumper style={{marginBottom: 12}} />
    <Pagination size="small" total={50} showTotal={showTotal} style={{marginBottom: 12}} />
    <Pagination
     style={{marginBottom: 12}}
      size="small"
      total={50}
      disabled
      showTotal={showTotal}
      showSizeChanger
      showQuickJumper
    />

    <Divider titlePlacement="start">Large</Divider>

    <Pagination size="large" total={50} style={{marginBottom: 12}} />
    <Pagination size="large" total={50} showSizeChanger showQuickJumper style={{marginBottom: 12}} />
    <Pagination size="large" total={50} showTotal={showTotal} style={{marginBottom: 12}} />
    <Pagination
      style={{marginBottom: 12}}
      size="large"
      total={50}
      disabled
      showTotal={showTotal}
      showSizeChanger
      showQuickJumper
    />
  </Flex>
);

export default App;
```

### 简洁

简单的翻页。

```tsx
import React from 'react';
import { Pagination } from 'gzd';

export default () => (
  <>
    <Pagination simple defaultCurrent={2} total={50} />
    <br />
    <Pagination disabled simple defaultCurrent={2} total={50} />
  </>
);
```

### 受控

受控制的页码。

```tsx
import React, { useState } from 'react';
import { Pagination } from 'gzd';
import type { PaginationProps } from 'antd';

export default () => {
  const [current, setCurrent] = useState(3);

  const onChange: PaginationProps['onChange'] = (page) => {
    console.log(page);
    setCurrent(page);
  };

  return <Pagination current={current} onChange={onChange} total={50} />;
};
```

### 总数

通过设置 `showTotal` 展示总共有多少数据。

```tsx
import React from 'react';
import { Pagination } from 'gzd';

export default () => (
  <>
    <Pagination
      total={85}
      showTotal={(total) => `Total ${total} items`}
      defaultPageSize={20}
      defaultCurrent={1}
    />
    <br />
    <Pagination
      total={85}
      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      defaultPageSize={20}
      defaultCurrent={1}
    />
  </>
);
```

### 全部展示

当设置 `showSizeChanger` 为 true 并且 `pageSizeOptions` 数组中不包含全部展示的选项时，可以通过向 `pageSizeOptions` 中插入一个特定项来提供展示所有数据的选项。

```tsx
import React from 'react';
import { Pagination } from 'gzd';

export default () => (
  <Pagination
    total={85}
    showSizeChanger
    showQuickJumper
    pageSizeOptions={['10', '20', '30', '40']}
    defaultPageSize={20}
    defaultCurrent={1}
  />
);
```

### 上一步和下一步

修改上一步和下一步为文字链接。

```tsx
import React from 'react';
import { Pagination } from 'gzd';
import type { PaginationProps } from 'antd';

const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
  if (type === 'prev') {
    return <a>Previous</a>;
  }
  if (type === 'next') {
    return <a>Next</a>;
  }
  return originalElement;
};

export default () => <Pagination total={500} itemRender={itemRender} />;
```

## API

| 参数             | 说明                                                         | 类型                                                                                            | 默认值              | 版本 |
| ---------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------- | ---- |
| align            | 分页组件的对齐方向                                           | `start` \| `center` \| `end`                                                                    | -                   |      |
| current          | 当前页数                                                     | number                                                                                          | -                   |      |
| defaultCurrent   | 默认的当前页数                                               | number                                                                                          | 1                   |      |
| defaultPageSize  | 默认的每页条数                                               | number                                                                                          | 10                  |      |
| disabled         | 禁用分页                                                     | boolean                                                                                         | false               |      |
| hideOnSinglePage | 只有一页时是否隐藏分页器                                     | boolean                                                                                         | false               |      |
| itemRender       | 用于自定义页码的结构，可用于优化 SEO                         | function(page, type: 'page' \| 'prev' \| 'next' \| 'jump-prev' \| 'jump-next', originalElement) | -                   |      |
| pageSize         | 每页条数                                                     | number                                                                                          | -                   |      |
| pageSizeOptions  | 指定每页可以显示多少条                                       | string\[] \| number\[]                                                                          | `[10, 20, 50, 100]` |      |
| responsive       | 当 size 未指定时，根据屏幕宽度自动调整尺寸                   | boolean                                                                                         | -                   |      |
| showLessItems    | 是否显示较少页面内容                                         | boolean                                                                                         | false               |      |
| showQuickJumper  | 是否可以快速跳转至某页                                       | boolean \| { goButton: ReactNode }                                                              | false               |      |
| showSizeChanger  | 是否展示 `pageSize` 切换器，当 `total` 大于 50 时默认为 true | boolean                                                                                         | -                   |      |
| showTitle        | 是否显示原生 tooltip 提示                                    | boolean                                                                                         | true                |      |
| showTotal        | 用于显示数据总量和当前数据顺序                               | function(total, range)                                                                          | -                   |      |
| simple           | 当添加该属性时，显示为简单分页                               | boolean                                                                                         | -                   |      |
| size             | 当为 `small` 时，是小尺寸分页                                | `default` \| `small`                                                                            | `default`           |      |
| total            | 数据总数                                                     | number                                                                                          | 0                   |      |
| onChange         | 页码或 `pageSize` 改变的回调，参数是改变后的页码及每页条数   | function(page, pageSize)                                                                        | -                   |      |
| onShowSizeChange | `pageSize` 变化的回调                                        | function(current, size)                                                                         | -                   |      |

更多属性请参考 [Ant Design Pagination](https://ant.design/components/pagination-cn/)。
