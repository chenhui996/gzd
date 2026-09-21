import { forwardRef } from "react";
import { Divider as AntdDivider, type DividerProps } from "antd";

// 分割线组件属性
export interface GZDDividerProps extends DividerProps {}

const Divider = forwardRef<HTMLDivElement, GZDDividerProps>((props, ref) => {
  const { children, ...restProps } = props;

  // Ant Design 的 Divider 目前不支持直接传递 ref，它主要是一个无交互的静态元素
  // 我们可以通过包裹一个 span 或者不传递 ref 来解决 TS 报错
  return (
    <div ref={ref}>
      <AntdDivider {...restProps}>
        {children}
      </AntdDivider>
    </div>
  );
});

Divider.displayName = "GZDDivider";

export default Divider;
