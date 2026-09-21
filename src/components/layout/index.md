---
group: 布局
title: Layout 布局
---

# Layout 布局

协助进行页面级整体布局。

## 何时使用

- 需要搭建页面整体框架时，例如顶部导航、侧边栏、内容区、页脚。
- 需要将页面拆分为稳定的结构区域，并在各区域中承载业务内容。

## 代码演示

### 基本结构

典型的上中下页面布局。

```tsx
import React from 'react';
import { Layout } from 'gzd';

const { Header, Content, Footer } = Layout;

const layoutStyle: React.CSSProperties = {
  borderRadius: 8,
  overflow: 'hidden',
  width: '100%',
};

const headerStyle: React.CSSProperties = {
  color: '#fff',
  height: 64,
  paddingInline: 24,
  lineHeight: '64px',
  backgroundColor: '#1677ff',
};

const contentStyle: React.CSSProperties = {
  minHeight: 160,
  padding: 24,
  backgroundColor: '#e6f4ff',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
};

const App: React.FC = () => (
  <Layout style={layoutStyle}>
    <Header style={headerStyle}>Header</Header>
    <Content style={contentStyle}>Content</Content>
    <Footer style={footerStyle}>Footer</Footer>
  </Layout>
);

export default App;
```

### 侧边栏布局

使用 `Sider` 构建左侧导航、右侧内容的常见后台布局。

```tsx
import React from 'react';
import { Layout } from 'gzd';

const { Sider, Content } = Layout;

const siderStyle: React.CSSProperties = {
  color: '#fff',
  padding: 24,
  backgroundColor: '#001529',
};

const contentStyle: React.CSSProperties = {
  minHeight: 160,
  padding: 24,
  backgroundColor: '#e6f4ff',
};

const App: React.FC = () => (
  <Layout>
    <Sider width={200} style={siderStyle}>
      Sider
    </Sider>
    <Content style={contentStyle}>Content</Content>
  </Layout>
);

export default App;
```

### 顶部与侧边栏组合

顶部导航、侧边栏、内容区组合使用。

```tsx
import React from 'react';
import { Layout } from 'gzd';

const { Header, Sider, Content } = Layout;

const headerStyle: React.CSSProperties = {
  color: '#fff',
  height: 64,
  paddingInline: 24,
  lineHeight: '64px',
  backgroundColor: '#1677ff',
};

const siderStyle: React.CSSProperties = {
  color: '#fff',
  padding: 24,
  backgroundColor: '#001529',
};

const contentStyle: React.CSSProperties = {
  minHeight: 200,
  padding: 24,
  backgroundColor: '#e6f4ff',
};

const App: React.FC = () => (
  <Layout>
    <Header style={headerStyle}>Header</Header>
    <Layout>
      <Sider width={200} style={siderStyle}>
        Sider
      </Sider>
      <Content style={contentStyle}>Content</Content>
    </Layout>
  </Layout>
);

export default App;
```

### 可折叠侧边栏

设置 `collapsible` 后，侧边栏支持展开与收起。

```tsx
import React from 'react';
import { Layout } from 'gzd';

const { Sider, Content } = Layout;

const contentStyle: React.CSSProperties = {
  minHeight: 160,
  padding: 24,
  backgroundColor: '#e6f4ff',
};

const App: React.FC = () => (
  <Layout>
    <Sider collapsible>
      <div style={{ color: '#fff', padding: 24 }}>Sider</div>
    </Sider>
    <Content style={contentStyle}>Content</Content>
  </Layout>
);

export default App;
```

## API

通用属性参考：[通用属性](/react/common-props)

### Layout

| 属性      | 说明               | 类型          | 默认值 |
| --------- | ------------------ | ------------- | ------ |
| children  | 布局内容           | ReactNode     | -      |
| className | 容器样式类         | string        | -      |
| hasSider  | 是否包含侧边栏     | boolean       | -      |
| style     | 指定样式           | CSSProperties | -      |

### Layout.Sider

| 属性                  | 说明                 | 类型                                           | 默认值 |
| --------------------- | -------------------- | ---------------------------------------------- | ------ |
| breakpoint            | 触发响应式布局的断点 | `xs` \| `sm` \| `md` \| `lg` \| `xl` \| `xxl` | -      |
| collapsed             | 当前收起状态         | boolean                                        | -      |
| collapsedWidth        | 收缩宽度             | number                                         | 80     |
| collapsible           | 是否可收起           | boolean                                        | false  |
| defaultCollapsed      | 是否默认收起         | boolean                                        | false  |
| reverseArrow          | 翻转折叠提示箭头方向 | boolean                                        | false  |
| theme                 | 主题颜色             | `light` \| `dark`                             | `dark` |
| trigger               | 自定义触发器         | ReactNode                                      | -      |
| width                 | 宽度                 | number \| string                               | 200    |
| onBreakpoint          | 触发响应式断点回调   | (broken) => void                               | -      |
| onCollapse            | 展开收起回调         | (collapsed, type) => void                      | -      |
