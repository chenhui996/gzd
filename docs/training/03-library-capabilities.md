---
title: 组件库能力
order: 3
group: 新人培训
---

# 组件库能力

这一页回答三个问题：

1. 业务项目怎样接入 gzd？
2. gzd 现在提供了哪些组件？
3. 它和直接使用 Ant Design 有什么不同？

先记住一句话：**gzd 大多基于 Ant Design 6 封装；Table 是基于 AG Grid 36 的例外。组件、主题和 gzd 类型从 `gzd` 导入，Table 使用的 AG Grid API 从 `gzd/gzd-table` 导入。**

## 在业务项目中接入

### 1. 确认基础版本

当前组件库要求：

- React `^19.2.5`
- ReactDOM `^19.2.5`
- Ant Design `^6.5.1`
- AG Grid Community `36.0.1`
- AG Grid Enterprise `36.0.1`
- AG Grid React `36.0.1`

三个 AG Grid 包是 Table 的 peer dependencies，版本需要与组件库声明保持一致。完整安装命令如下：

```shell
npm install gzd antd@^6.5.1 react@^19.2.5 react-dom@^19.2.5 ag-grid-community@36.0.1 ag-grid-enterprise@36.0.1 ag-grid-react@36.0.1
```

### 2. 在应用入口导入 CSS

CSS 只需要导入一次，通常放在 `main.tsx` 或 `index.tsx`：

```tsx | pure
import 'gzd/gzd.css';
```

包内也保留了 `style.css` 这个同内容入口，但新代码统一使用 `gzd.css`，不要两个都导入。

### 3. 包裹应用

推荐的根节点顺序是 `ConfigProvider` 在外，`App` 在内：

```tsx | pure
import 'gzd/gzd.css';
import { createRoot } from 'react-dom/client';
import {
  App,
  ConfigProvider,
  type GZDThemeMode,
} from 'gzd';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

const themeMode: GZDThemeMode = 'gold-dark';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider themeMode={themeMode}>
    <App>
      <RouterProvider router={router} />
    </App>
  </ConfigProvider>,
);
```

两个根组件的分工不同：

| 组件 | 主要作用 |
| --- | --- |
| `ConfigProvider` | 选择主题、注入 Design Token、默认使用中文语言，并继续支持 Ant Design 的全局配置 |
| `App` | 给 `message`、`modal`、`notification` 提供上下文，并提供 `.ant-app` 默认重置样式 |

`App.useApp()` 必须在 `App` 的子组件中调用：

```tsx | pure
import { App, Button } from 'gzd';

export function SaveButton() {
  const { message } = App.useApp();

  return (
    <Button type="primary" onClick={() => message.success('保存成功')}>
      保存
    </Button>
  );
}
```

组件库也直接导出了 `message`、`notification` 和 `Modal` 静态方法。它们适合简单场景；需要读取当前主题、语言或其他 React 上下文时，优先使用 `App.useApp()`。

> 如果给 `App` 设置 `component={false}`，它不会创建 `.ant-app` 容器，也不会提供该容器上的默认重置样式。一般保持默认值即可。

### 4. 使用组件和类型

组件与公开类型都从包根入口导入：

```tsx | pure
import {
  Button,
  Input,
  Space,
  type ButtonProps,
  type InputProps,
} from 'gzd';

const buttonProps: ButtonProps = {
  type: 'primary',
};

export function SearchBar() {
  return (
    <Space>
      <Input placeholder="请输入关键字" />
      <Button {...buttonProps}>查询</Button>
    </Space>
  );
}
```

// chenhui996 待解决疑问

### 5. 使用 Table 和 AG Grid API

Table 组件及其 Props 从包根入口导入：

```tsx | pure
import { Table, type TableProps } from 'gzd';
```

列定义、事件、模块、主题和底层 Grid API 从公开子路径导入：

```tsx | pure
import {
  AllEnterpriseModule,
  themeQuartz,
  type ColDef,
  type GridReadyEvent,
} from 'gzd/gzd-table';
```

除 `package.json` 明确声明的 `gzd/gzd-table` 和 CSS 入口外，不要从 `src/components`、`gzd-lib/components` 或包内任意文件做深层导入。包根能力以 `src/index.ts` 为准，AG Grid 子路径能力以 `src/gzd-table/index.ts` 为准。

## 这层封装做了什么

### 保留 Ant Design 的主要用法

下面的约定适用于大多数 Ant Design 封装。Table 不使用 Ant Design Table，而是保留 `AgGridReact` 的 Props 和 ref 能力，并增加统一主题、中文文案、分页布局、空状态和交互默认值。

- 绝大多数组件的 Props 直接继承对应的 Ant Design v6 Props。
- 常用组件支持 `ref` 转发。
- 常用子组件和静态方法被挂回主组件，原有组合写法可以继续使用。
- 组件、Props 类型和主题工具由一个入口统一导出。

因此，已经会用 Ant Design 的同学通常可以直接上手。不过要先查看 gzd 的组件文档，因为项目可能增加默认值、样式或少量能力。

### 加入项目统一约定

当前比较重要的差异如下：

- `ConfigProvider` 默认使用 `gold-dark` 主题和中文语言。
- `ConfigProvider` 会应用四套项目 Design Token，并处理暗金主题下的特殊视觉效果。
- `Input` 新增可选的 `trim` 属性；设为 `true` 时，会在输入过程中去掉首尾空格，默认是 `false`。
- `DatePicker` 默认格式是 `YYYY-MM-DD`，仍可通过 `format` 覆盖。
- `Modal` 默认居中展示，仍可通过 `centered={false}` 覆盖。
- `Transfer` 外层默认占满可用宽度。
- `Table` 基于 AG Grid 36 封装，AG Grid 类型和 API 统一从 `gzd/gzd-table` 导入。
- 暗金主题下，Button、Tag、Steps、Checkbox、Radio、Switch、Slider、Popconfirm、DatePicker、Calendar、Tree、TreeSelect、Cascader 有额外的视觉适配。

少数组件为了提供 `ref`，会增加一个透明或普通容器。业务样式应优先使用组件 Props、`className`、`styles` 和 Design Token，不要依赖组件内部的 DOM 层级。

### 保留组合组件和静态能力

下面这些写法在当前封装中可以使用：

| 主入口 | 子组件或静态能力 |
| --- | --- |
| `App` | `App.useApp` 等 Ant Design App 静态能力 |
| `Alert` | `Alert.ErrorBoundary` |
| `Avatar` | `Avatar.Group` |
| `Badge` | `Badge.Ribbon` |
| `Card` | `Card.Grid`、`Card.Meta` |
| `Cascader` | `Cascader.Panel`、`Cascader.SHOW_PARENT`、`Cascader.SHOW_CHILD` |
| `Checkbox` | `Checkbox.Group` |
| `Collapse` | `Collapse.Panel` |
| `DatePicker` | `RangePicker`、`WeekPicker`、`MonthPicker`、`YearPicker`、`QuarterPicker`、`TimePicker` |
| `Descriptions` | `Descriptions.Item` |
| `Empty` | 默认空状态图片和简洁空状态图片 |
| `Form` | `Item`、`List`、`ErrorList`、`Provider`、`useForm`、`useFormInstance`、`useWatch` |
| `Image` | `Image.PreviewGroup` 等图片静态能力 |
| `Input` | `Password`、`TextArea`、`Search`、`OTP` |
| `Layout` | `Header`、`Footer`、`Content`、`Sider` |
| `Menu` | `Item`、`SubMenu`、`Divider`、`ItemGroup`，新代码优先使用 `items` |
| `Modal` | `info`、`success`、`error`、`warning`、`confirm`、`destroyAll`、`useModal` 等 |
| `Radio` | `Radio.Group`、`Radio.Button` |
| `Result` | Ant Design Result 的预设图片等静态能力 |
| `Select` | `Select.Option`、`Select.OptGroup`，新代码优先使用 `options` |
| `Skeleton` | `Button`、`Avatar`、`Input`、`Image`、`Node` |
| `Space` | `Space.Compact`、`Space.Addon` |
| `Spin` | `Spin.setDefaultIndicator` 等静态能力 |
| `Tabs` | `Tabs.TabPane`，新代码优先使用 `items` |
| `Tag` | `Tag.CheckableTag`、`Tag.CheckableTagGroup` |
| `TimePicker` | `TimePicker.RangePicker` |
| `Timeline` | `Timeline.Item` |
| `Transfer` | `List`、`Search`、`Operation` |
| `Tree` | `Tree.DirectoryTree` |
| `TreeSelect` | `TreeNode`、`SHOW_ALL`、`SHOW_PARENT`、`SHOW_CHILD` |
| `Upload` | `Upload.Dragger`、`Upload.LIST_IGNORE` |

不要仅凭 Ant Design 文档猜测某个静态方法一定存在。先看上表和当前组件源码；Props 能力则以对应组件文档为准。

## 全部公开入口

当前包根入口一共导出 54 个组件或反馈入口。下面的分类是为了方便新人查找，不会改变代码中的导入方式。

### 应用入口与通用

| 入口 | 用途 |
| --- | --- |
| [ConfigProvider](/components/config-provider) | 设置主题、语言和全局组件配置 |
| [App](/components/app) | 提供反馈上下文和应用级重置样式 |
| [Button](/components/button) | 触发提交、保存、删除等操作 |

### 布局

| 组件 | 用途 |
| --- | --- |
| [Divider](/components/divider) | 分隔内容 |
| [Flex](/components/flex) | 使用弹性布局排列内容 |
| [Layout](/components/layout) | 搭建页面级头部、侧栏、内容区和底部 |
| [Space](/components/space) | 统一控制组件之间的间距和紧凑组合 |

### 导航

| 组件 | 用途 |
| --- | --- |
| [Breadcrumb](/components/breadcrumb) | 显示当前页面所在层级 |
| [Dropdown](/components/dropdown) | 从触发元素打开下拉菜单 |
| [Menu](/components/menu) | 展示页面或功能导航菜单 |
| [Pagination](/components/pagination) | 对长列表进行分页 |
| [Steps](/components/steps) | 展示多步骤流程及当前进度 |
| [Tabs](/components/tabs) | 在多个内容面板之间切换 |

### 数据录入

| 组件 | 用途 |
| --- | --- |
| [AutoComplete](/components/auto-complete) | 输入时给出候选内容 |
| [Cascader](/components/cascader) | 从多级关联数据中选择 |
| [Checkbox](/components/checkbox) | 选择一个或多个选项 |
| [DatePicker](/components/date-picker) | 选择日期、日期范围、月份、季度等 |
| [Form](/components/form) | 管理字段、校验、提交和表单状态 |
| [Input](/components/input) | 输入文本、密码、搜索词、验证码或多行内容 |
| [InputNumber](/components/input-number) | 输入数字和高精度数值 |
| [Radio](/components/radio) | 从一组选项中单选 |
| [Rate](/components/rate) | 录入评分 |
| [Select](/components/select) | 从下拉列表中选择 |
| [Slider](/components/slider) | 通过滑动选择数值或范围 |
| [Switch](/components/switch) | 在开和关两种状态间切换 |
| [TimePicker](/components/time-picker) | 选择时间或时间范围 |
| [Transfer](/components/transfer) | 在两个列表之间移动选项 |
| [TreeSelect](/components/tree-select) | 从树形结构中选择 |
| [Upload](/components/upload) | 选择、拖拽和上传文件 |

### 数据展示

| 组件 | 用途 |
| --- | --- |
| [Avatar](/components/avatar) | 展示用户或对象头像 |
| [Badge](/components/badge) | 展示数量、状态点或缎带 |
| [Calendar](/components/calendar) | 用日历方式展示和选择日期 |
| [Card](/components/card) | 承载一组相关内容和操作 |
| [Collapse](/components/collapse) | 折叠和展开内容面板 |
| [Descriptions](/components/descriptions) | 成组展示只读字段 |
| [Empty](/components/empty) | 展示无数据状态 |
| [Image](/components/image) | 展示和预览图片 |
| [Popover](/components/popover) | 在气泡卡片中展示更多内容 |
| [Segmented](/components/segmented) | 在少量选项之间快速切换 |
| [Table](/components/table) | 展示和操作结构化行列数据，支持排序、筛选、分页、选择和编辑 |
| [Tag](/components/tag) | 展示分类、状态和可选择标签 |
| [Timeline](/components/timeline) | 按时间顺序展示事件 |
| [Tooltip](/components/tooltip) | 用短文字解释元素 |
| [Tree](/components/tree) | 展示可展开的层级数据 |

### 反馈

| 入口 | 用途 |
| --- | --- |
| [Alert](/components/alert) | 展示需要关注的提示信息 |
| [Drawer](/components/drawer) | 从屏幕边缘打开操作面板 |
| [message](/components/message) | 短暂展示操作结果 |
| [Modal](/components/modal) | 展示对话框、确认框和重要操作 |
| [notification](/components/notification) | 展示信息较多的通知 |
| [Popconfirm](/components/popconfirm) | 在操作附近进行轻量确认 |
| [Progress](/components/progress) | 展示任务进度 |
| [Result](/components/result) | 展示成功、失败、无权限等结果页 |
| [Skeleton](/components/skeleton) | 内容加载前展示占位结构 |
| [Spin](/components/spin) | 展示页面或区块加载状态 |

## 怎样查组件文档

组件目录名和文档地址是一一对应的：

```text
src/components/date-picker/index.md
                  ↓
/components/date-picker
```

查找顺序建议如下：

1. 先打开上面的组件链接，看示例、API 和项目约定。
2. 再看同目录中的 `index.tsx`、具体组件文件和 `demo/`。
3. Table 的完整 Grid Props、事件和 API 再查当前使用的 AG Grid 36 文档；其他组件的通用 Props 再查 Ant Design 6 文档。
4. 文档和代码不一致时，根入口以 `src/index.ts` 为准，AG Grid 子路径以 `src/gzd-table/index.ts` 和 `package.json#exports` 为准，并顺手修正文档。

文档站里的 demo 常使用 `gzd`；Table demo 还会使用 `gzd/gzd-table`。它们分别指向 `src/index.ts` 和 `src/gzd-table/index.ts`。真实业务项目必须使用对应的 `gzd` 包入口，例如：

```tsx | pure
import { Button } from 'gzd';
```

## 学完本页，你应该会什么

- 能在业务项目中正确导入 CSS，并按正确顺序放置 `ConfigProvider` 和 `App`。
- 知道全部 54 个公开入口分别解决什么问题。
- 知道组合组件、反馈 API 和 Props 类型从哪里使用。
- 知道先查 gzd 文档，再按需查 Ant Design 6 文档。
- 不会在业务项目中深层导入仓库内部文件。

下一章：[主题与 Design Token](/training/04-theme-and-tokens)。
