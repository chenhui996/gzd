---
group: 反馈
category: Components
title: Drawer 抽屉
subtitle: 抽屉
description: 屏幕边缘滑出的浮层面板。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*BD2JSKm8I-kAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*r29rQ51bNdwAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用

抽屉从父窗体边缘滑入，覆盖住部分父窗体内容。用户在抽屉内操作时不必离开当前任务，操作完成后，可以平滑地回到原任务。

- 当需要一个附加的面板来控制父窗体内容，这个面板在需要时呼出。比如，控制界面展示样式，往界面中添加内容。
- 当需要在当前任务流中插入临时任务，创建或预览附加内容。比如展示协议条款，创建子对象。

> 开发者注意事项：
>
> 自 `5.17.0`，我们提供了 `loading` 属性，内置 Spin 组件作为加载状态，但是自 `5.18.0`开始，我们修复了设计失误，将内置的 Spin 组件替换成了 Skeleton 组件，同时收窄了 `loading` api 的类型范围，只能接收 boolean 类型。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic-right.tsx">基础抽屉</code>
<code src="./demo/placement.tsx">自定义位置</code>
<code src="./demo/resizable.tsx">可调整大小</code>
<code src="./demo/loading.tsx">加载中</code>
<code src="./demo/extra.tsx">额外操作</code>
<code src="./demo/render-in-current.tsx">渲染在当前 DOM</code>
<code src="./demo/form-in-drawer.tsx">抽屉表单</code>
<code src="./demo/user-profile.tsx">信息预览抽屉</code>
<code src="./demo/multi-level-drawer.tsx">多层抽屉</code>
<code src="./demo/size.tsx">预设宽度</code>
<code src="./demo/mask.tsx">遮罩</code>
<code src="./demo/closable-placement.tsx">关闭按钮位置</code>

## API

通用属性参考：[通用属性](/react/common-props)

| 参数 | 说明 | 类型 | 默认值 
| --- | --- | --- | --- |
| afterOpenChange | 切换抽屉时动画结束后的回调 | function(open) | - |
| className | Drawer 容器外层 className 设置，如果需要设置最外层，请使用 rootClassName | string | - |
| closable | 是否显示关闭按钮。可通过 `placement` 配置其位置 | boolean \| { closeIcon?: React.ReactNode; disabled?: boolean; placement?: 'start' \| 'end' } | true |
| destroyOnHidden | 关闭时销毁 Drawer 里的子元素 | boolean | false |
| extra | 抽屉右上角的操作区域 | ReactNode | - |
| footer | 抽屉的页脚 | ReactNode | - |
| forceRender | 预渲染 Drawer 内元素 | boolean | false |
| focusable | 抽屉内焦点管理的配置 | `{ trap?: boolean, focusTriggerAfterClose?: boolean }` | - |
| getContainer | 指定 Drawer 挂载的节点，**并在容器内展现**，`false` 为挂载在当前位置 | HTMLElement \| () => HTMLElement \| Selectors \| false | body |
| keyboard | 是否支持键盘 esc 关闭 | boolean | true |
| loading | 显示骨架屏 | boolean | false |
| mask | 遮罩效果 | boolean \| `{ enabled?: boolean, blur?: boolean, closable?: boolean }` | true |
| maxSize | 可拖拽的最大尺寸（宽度或高度，取决于 `placement`） | number | - |
| open | Drawer 是否可见 | boolean | false |
| placement | 抽屉的方向 | `top` \| `right` \| `bottom` \| `left` | `right` |
| push | 用于设置多层 Drawer 的推动行为 | boolean \| { distance: string \| number } | { distance: 180 } |
| resizable | 是否启用拖拽改变尺寸 | boolean \| [ResizableConfig](#resizableconfig) | - |
| rootStyle | 可用于设置 Drawer 最外层容器的样式，和 `style` 的区别是作用节点包括 `mask` | CSSProperties | - | 
| size | 预设抽屉宽度（或高度），default `378px` 和 large `736px`，或自定义数字 | 'default' \| 'large' \| number \| string | 'default' | 
| style | Drawer 面板的样式，如需仅配置 body 部分，请使用 `styles.body` | CSSProperties | - |
| title | 标题 | ReactNode | - |  |
| zIndex | 设置 Drawer 的 `z-index` | number | 1000 |
| onClose | 点击遮罩层或左上角叉或取消按钮的回调 | function(e) | - |
| drawerRender | 自定义渲染抽屉 | (node: ReactNode) => ReactNode | - | 

### ResizableConfig

| 参数          | 说明                     | 类型                   | 默认值 
| ------------- | ------------------------ | ---------------------- | ------ |
| onResizeStart | 开始拖拽调整大小时的回调 | () => void             | -      |
| onResize      | 拖拽调整大小时的回调     | (size: number) => void | -      | 
| onResizeEnd   | 结束拖拽调整大小时的回调 | () => void             | -      |
