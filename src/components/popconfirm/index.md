---
category: Components
group: 反馈
title: Popconfirm 气泡确认框
subtitle: 气泡确认框
description: 点击元素，弹出气泡式的确认框。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*a7tqQ6wrdeAAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*iwYsQpeFcB0AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用

目标元素的操作需要用户进一步的确认时，在目标元素附近弹出浮层提示，询问用户。

和 `confirm` 弹出的全屏居中模态对话框相比，交互形式更轻量。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/locale.tsx">国际化</code>
<code src="./demo/placement.tsx">位置</code>
<code src="./demo/shift.tsx" iframe="300">贴边偏移</code>
<code src="./demo/dynamic-trigger.tsx">条件触发</code>
<code src="./demo/icon.tsx">自定义 Icon 图标</code>
<code src="./demo/async.tsx">异步关闭</code>
<code src="./demo/promise.tsx">基于 Promise 的异步关闭</code>

## API

通用属性参考：[通用属性](/react/common-props)

| 参数 | 说明 | 类型 | 默认值 
| --- | --- | --- | --- |
| cancelButtonProps | cancel 按钮 props | [ButtonProps](/components/button-cn#api) | - |  |
| cancelText | 取消按钮文字 | string | `取消` |  |
| disabled | 阻止点击 Popconfirm 子元素时弹出确认框 | boolean | false |  |
| icon | 自定义弹出气泡 Icon 图标 | ReactNode | &lt;ExclamationCircle /> |  |
| okButtonProps | ok 按钮 props | [ButtonProps](/components/button-cn#api) | - |  |
| okText | 确认按钮文字 | string | `确定` |  |
| okType | 确认按钮类型 | string | `primary` |  |
| showCancel | 是否显示取消按钮 | boolean | true | 4.18.0 |
| title | 确认框标题 | ReactNode \| () => ReactNode | - |  |
| description | 确认内容的详细描述 | ReactNode \| () => ReactNode | - | 5.1.0 |
| onCancel | 点击取消的回调 | function(e) | - |  |
| onConfirm | 点击确认的回调 | function(e) | - |  |
| onPopupClick | 弹出气泡点击事件 | function(e) | - | 5.5.0 |

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
