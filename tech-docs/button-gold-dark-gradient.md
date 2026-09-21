# Button 金色主题暗色模式渐变背景技术方案

## 背景

金色主题暗色模式下，Figma 设计稿要求 Button 的部分变体使用渐变背景。对应设计稿节点：

<https://www.figma.com/design/hsz4p6DAWcDQSzpL3CWW8s/My2?node-id=114-2917&m=dev>

目前 antd 的 Button component token 主要被消费到 `backgroundColor`、`borderColor`、`color` 等 CSS 属性中。

`linear-gradient(...)` 不是普通颜色值，直接写入 antd 标准 design token 会带来两个问题：

1. antd 的颜色派生算法和组件样式通常假设 token 是颜色值，渐变字符串无法参与颜色计算。

Button solid 变体的样式模板使用 `backgroundColor`，即使 token 字符串中存在渐变，也不会按背景图渲染。

因此渐变需要作为组件库自己的扩展语义处理，而不是强行塞进 antd 标准 token。

## 结论

采用“自定义扩展 token + ConfigProvider 注入 class/CSS 变量 + 全局样式选择器”的方案。

- 设计来源仍然是 Button component token 中的扩展字段，例如 `primaryGradientStart`、`primaryGradientEnd`。
- `ConfigProvider` 在 `themeMode="gold-dark"` 时读取合并后的 Button token，向 antd 的 `button` 全局配置注入 className 和 CSS 变量。
- Button 的 LESS 样式只命中 `gold-dark` 下被注入 class 的 `primary + solid` 变体。
- 业务侧仍然可以通过 `theme.components.Button.primaryGradient*` 覆盖渐变端点，也可以继续传入 `button.className`、`button.style`。

该方案没有把渐变放进 antd 标准 token，也没有要求每个 Button 调用方手动加 class。

## 为什么不直接使用 antd-style 的 createStyles

antd 官方示例中的 `createStyles` 方案适合业务页面局部定制：

```text
<ConfigProvider button={{ className: styles.linearGradientButton }}>
  <Button type="primary">Gradient Button</Button>
</ConfigProvider>
```

组件库默认主题能力需要更稳定的注入点：

1. 样式应随 `gzd` 的全局样式一起构建和发布，避免每个 Provider 实例运行时生成一份样式。
2. 渐变色来自主题 token，应该在主题合并后统一转换为 CSS 变量。
3. 该能力应覆盖 `gzd` Button 和同一 `GZDConfigProvider` 下的 antd Button。

因此本次实现保留官方示例的核心思路，即通过 `ConfigProvider.button.className` 挂载样式范围，但样式本身放到组件库 LESS 中。

## 作用范围

当前只覆盖金色主题暗色模式下的 primary solid Button：

```text
<ConfigProvider themeMode="gold-dark">
  <Button color="primary" variant="solid">Button</Button>
  <Button type="primary">Button</Button>
</ConfigProvider>
```

antd v6 会把 `type="primary"` 解析为 `color="primary" variant="solid"`，因此兼容旧写法。

以下场景不会套用渐变：

- `mode` 不是 `gold-dark` 或 `goldDark`
- `color` 不是 `primary`
- `variant` 不是 `solid`
- `danger` Button
- disabled Button

## Token 映射

Figma 当前节点读取到的 primary solid 渐变如下：

| 状态     | Figma 渐变方向           | 主题 token                                                 |
| ------ | -------------------- | -------------------------------------------------------- |
| 默认     | `#FFE7CB -> #FFCA9C` | `primaryGradientEnd -> primaryGradientStart`             |
| Hover  | `#FFF0DE -> #FFD6B4` | `primaryGradientEndHover -> primaryGradientStartHover`   |
| Active | `#F6C994 -> #E6AD6B` | `primaryGradientEndActive -> primaryGradientStartActive` |

注意：当前生成 token 中的 `Start` 是底部色，`End` 是顶部色。因此 CSS 使用：

```css
linear-gradient(180deg, var(--end) 0%, var(--start) 100%)
```

## 实现细节

### 1. 自定义 token 桥接

`src/styles/themes/buttonGradient.ts` 定义渐变 className、token 读取和 CSS 变量映射：

```ts
export const goldDarkButtonGradientClassName = 'gz-button-gold-dark-gradient';
```

它从合并后的 `ThemeConfig.components.Button` 中读取扩展字段，并转换为：

```css
--gz-button-primary-gradient-start
--gz-button-primary-gradient-end
--gz-button-primary-gradient-start-hover
--gz-button-primary-gradient-end-hover
--gz-button-primary-gradient-start-active
--gz-button-primary-gradient-end-active
--gz-button-primary-gradient-text
```

### 2. ConfigProvider 注入

`src/components/config-provider/index.tsx` 在主题合并后判断：

```ts
mode === 'gold-dark' || mode === 'goldDark'
```

当 Button 渐变 token 完整时，通过 antd `ConfigProvider` 的 `button` 配置注入：

```text
<AntdConfigProvider
  theme={mergedTheme}
  button={{
    className: 'gz-button-gold-dark-gradient',
    style: {
      '--gz-button-primary-gradient-start': '#FFCA9C',
      '--gz-button-primary-gradient-end': '#FFE7CB',
    },
  }}
>
```

实际代码会保留并合并业务方传入的 `button.className` 和 `button.style`。

### 3. Button 样式选择器

`src/components/button/style.less` 只命中被注入 class 的 primary solid Button：

```less
.gz-button-gold-dark-gradient.ant-btn.ant-btn-color-primary.ant-btn-variant-solid:not(:disabled):not(
    .ant-btn-disabled
  ):not(.ant-btn-dangerous) {
  background: linear-gradient(
    180deg,
    var(--gz-button-primary-gradient-end) 0%,
    var(--gz-button-primary-gradient-start) 100%
  );
}
```

选择器包含 `ant-btn-color-primary` 和 `ant-btn-variant-solid`，因此同一个 Provider 下的 default、outlined、filled、text、link 等 Button 不受影响。

## 扩展方式

如果后续其他主题或变体也需要渐变，建议按以下方式扩展：

1. 在对应主题的 Button component token 中增加明确命名的扩展字段。
2. 在 `buttonGradient.ts` 中增加该主题或变体的 token 映射。
3. 在 `style.less` 中新增目标变体选择器，保持选择器范围尽量窄。
4. 不要把渐变字符串写入 antd 标准颜色 token，例如 `colorPrimary`、`primaryColor`。

## 风险与约束

1. 该方案依赖 antd Button 的语义 class：`ant-btn-color-primary`、`ant-btn-variant-solid`。antd v6 已支持这些 class，升级主版本时需要回归验证。
2. CSS 变量挂在 Button root 上，业务方如果通过 inline style 覆盖同名变量，会覆盖组件库默认渐变。
3. 如果业务方在 `button.className` 中写了更高优先级的背景样式，可能覆盖渐变，这是符合预期的业务定制能力。
