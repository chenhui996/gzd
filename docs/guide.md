# 介绍

**gzd** 是基于 [Ant Design v6](https://ant.design/) 封装的 React 组件库，旨在统一业务视觉规范，提升开发效率。

## 特性

- 🛡 **TypeScript**: 全量 TypeScript 编写，提供完整的类型定义。
- ⚛️ **React 19**: 基于 React 19 Compiler 构建，要求 React 和 ReactDOM `^19.2.5`。
- 🎨 **Theme**: 基于 CSS Variables 的主题定制能力。

## 安装

项目需预先安装 React `^19.2.5`、ReactDOM `^19.2.5` 和 Ant Design `^6.5.1`。

```shell
npm install gzd
```

## 使用

### 1. 根组件包裹（main.tsx）

```tsx | pure
import 'gzd/gzd.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, type GZDThemeMode } from 'gzd';
import { router } from '@/router';

const themeMode: GZDThemeMode = 'gold-dark';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider themeMode={themeMode}>
    <RouterProvider router={router} />
  </ConfigProvider>,
);
```


### 2. 组件使用

- 以 Button 组件为例

```tsx | pure
import { Button } from 'gzd';

const App = () => {
  return (
    <div>
      <Button>默认按钮</Button>
    </div>
  );
};
```
