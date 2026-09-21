---
group: 数据展示
title: Card 卡片
---

# Card 卡片

## 何时使用 {#when-to-use}

最基础的卡片容器，可承载文字、列表、图片、段落，常用于后台概览页面。

## 代码演示

### 典型卡片

包含标题、内容、操作区域。

```tsx
import React from 'react';
import { Card, Space } from 'gzd';

const App: React.FC = () => (
  <Space vertical size={16}>
    <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
    <Card size="small" title="Small size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  </Space>
);

export default App;
```

### 无边框

在灰色背景上使用无边框的卡片。

```tsx
/**
 * background: '#f5f5f5' 
 */
import React from 'react';
import { Card } from 'gzd';

const App: React.FC = () => (
    <Card title="Card title" variant="borderless" style={{ width: 300 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
);

export default App;
```

### 简洁卡片

只包含内容区域。

```tsx
import React from 'react';
import { Card } from 'gzd';

const App: React.FC = () => (
  <Card style={{ width: 300 }}>
    <p>Card content</p>
    <p>Card content</p>
    <p>Card content</p>
  </Card>
);

export default App;
```

### 更灵活的内容展示

可以利用 `Card.Meta` 支持更灵活的内容。

```tsx
import React from 'react';
import { Card } from 'gzd';

const { Meta } = Card;

const App: React.FC = () => (
  <Card
    hoverable
    style={{ width: 240 }}
    cover={
      <img
        draggable={false}
        alt="example"
        src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
      />
    }
  >
    <Meta title="Europe Street beat" description="www.instagram.com" />
  </Card>
);

export default App;
```

### 栅格卡片

在系统概览页面常常和栅格进行配合。

```tsx
/**
 * background: '#f5f5f5' 
 */
import React from 'react';
import { Col, Row } from 'antd';
import { Card } from 'gzd';

const App: React.FC = () => (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Card title" variant="borderless">
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" variant="borderless">
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" variant="borderless">
          Card content
        </Card>
      </Col>
    </Row>
);

export default App;
```

### 预加载的卡片

数据读入前会有文本块样式。

```tsx
import React, { useState } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import { Avatar, Card, Switch } from 'gzd';

const actions: React.ReactNode[] = [
  <EditOutlined key="edit" />,
  <SettingOutlined key="setting" />,
  <EllipsisOutlined key="ellipsis" />,
];

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  return (
    <Flex gap={16} align="start" vertical>
      <Switch checked={!loading} onChange={(checked) => setLoading(!checked)} />
      <Card loading={loading} actions={actions} style={{ minWidth: 300 }}>
        <Card.Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
          title="Card title"
          description={
            <>
              <p>This is the description</p>
              <p>This is the description</p>
            </>
          }
        />
      </Card>
      <Card loading={loading} actions={actions} style={{ minWidth: 300 }}>
        <Card.Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />}
          title="Card title"
          description={
            <>
              <p>This is the description</p>
              <p>This is the description</p>
            </>
          }
        />
      </Card>
    </Flex>
  );
};

export default App;
```

### 网格型内嵌卡片

一种常见的卡片内容区隔模式。

```tsx
import React from 'react';
import { Card } from 'gzd';

const gridStyle: React.CSSProperties = {
  width: '25%',
  textAlign: 'center',
};

const App: React.FC = () => (
  <Card title="Card Title">
    <Card.Grid style={gridStyle}>Content</Card.Grid>
    <Card.Grid hoverable={false} style={gridStyle}>
      Content
    </Card.Grid>
    <Card.Grid style={gridStyle}>Content</Card.Grid>
    <Card.Grid style={gridStyle}>Content</Card.Grid>
    <Card.Grid style={gridStyle}>Content</Card.Grid>
    <Card.Grid style={gridStyle}>Content</Card.Grid>
    <Card.Grid style={gridStyle}>Content</Card.Grid>
  </Card>
);

export default App;
```

### 内部卡片

可以放在普通卡片内部，展示多层级结构的信息。

```tsx
import React from 'react';
import { Card } from 'gzd';

const App: React.FC = () => (
  <Card title="Card title">
    <Card type="inner" title="Inner Card title" extra={<a href="#">More</a>}>
      Inner Card content
    </Card>
    <Card
      style={{ marginTop: 16 }}
      type="inner"
      title="Inner Card title"
      extra={<a href="#">More</a>}
    >
      Inner Card content
    </Card>
  </Card>
);

export default App;
```

### 带页签的卡片

可承载更多内容。

```tsx
import React, { useState } from 'react';
import { Card } from 'gzd';

const tabList = [
  {
    key: 'tab1',
    tab: 'tab1',
  },
  {
    key: 'tab2',
    tab: 'tab2',
  },
];

const contentList: Record<string, React.ReactNode> = {
  tab1: <p>content1</p>,
  tab2: <p>content2</p>,
};

const tabListNoTitle = [
  {
    key: 'article',
    label: 'article',
  },
  {
    key: 'app',
    label: 'app',
  },
  {
    key: 'project',
    label: 'project',
  },
];

const contentListNoTitle: Record<string, React.ReactNode> = {
  article: <p>article content</p>,
  app: <p>app content</p>,
  project: <p>project content</p>,
};

const App: React.FC = () => {
  const [activeTabKey1, setActiveTabKey1] = useState<string>('tab1');
  const [activeTabKey2, setActiveTabKey2] = useState<string>('app');

  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
  };
  const onTab2Change = (key: string) => {
    setActiveTabKey2(key);
  };

  return (
    <>
      <Card
        style={{ width: '100%' }}
        title="Card title"
        extra={<a href="#">More</a>}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>
      <br />
      <br />
      <Card
        style={{ width: '100%' }}
        tabList={tabListNoTitle}
        activeTabKey={activeTabKey2}
        tabBarExtraContent={<a href="#">More</a>}
        onTabChange={onTab2Change}
        tabProps={{ size: 'medium' }}
      >
        {contentListNoTitle[activeTabKey2]}
      </Card>
    </>
  );
};

export default App;
```

### 支持更多内容配置

一种支持封面、头像、标题和描述信息的卡片。

```tsx
import React from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'gzd';

const { Meta } = Card;

const App: React.FC = () => (
  <Card
    style={{ width: 300 }}
    cover={
      <img
        draggable={false}
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
      title="Card title"
      description="This is the description"
    />
  </Card>
);

export default App;
```

## API

通用属性参考：[通用属性](/react/common-props)

```
<Card title="卡片标题">卡片内容</Card>
```

| 参数 | 说明 | 类型 | 默认值  |
| --- | --- | --- | ---  |
| actions | 卡片操作组，位置在卡片底部 | Array&lt;ReactNode> | -  |
| activeTabKey | 当前激活页签的 key | string | -  |
| variant | 形态变体 | `outlined` \| `borderless` \| | `outlined`  |
| cover | 卡片封面 | ReactNode | -  |
| defaultActiveTabKey | 初始化选中页签的 key，如果没有设置 activeTabKey | string | `第一个页签的 key`  |
| extra | 卡片右上角的操作区域 | ReactNode | -  |
| hoverable | 鼠标移过时可浮起 | boolean | false  |
| loading | 当卡片内容还在加载中时，可以用 loading 展示一个占位 | boolean | false  |
| size | card 的尺寸 | `medium` \| `small` | `medium`  |
| tabBarExtraContent | tab bar 上额外的元素 | ReactNode | -  |
| tabList | 页签标题列表 | [TabItemType](/components/tabs-cn#tabitemtype)[] | -  |
| tabProps | [Tabs](/components/tabs-cn#tabs) | - | -  |
| title | 卡片标题 | ReactNode | -  |
| type | 卡片类型，可设置为 `inner` 或 不设置 | string | -  |
| onTabChange | 页签切换的回调 | (key) => void | -  |

### Card.Grid

| 参数      | 说明                   | 类型          | 默认值  |
| --------- | ---------------------- | ------------- | ------  |
| className | 网格容器类名           | string        | -       |
| hoverable | 鼠标移过时可浮起       | boolean       | true    |
| style     | 定义网格容器类名的样式 | CSSProperties | -       |

### Card.Meta

| 参数        | 说明               | 类型          | 默认值  |
| ----------- | ------------------ | ------------- | ------  |
| avatar      | 头像/图标          | ReactNode     | -       |
| className   | 容器类名           | string        | -       |
| description | 描述内容           | ReactNode     | -       |
| style       | 定义容器类名的样式 | CSSProperties | -       |
| title       | 标题内容           | ReactNode     | -       |
