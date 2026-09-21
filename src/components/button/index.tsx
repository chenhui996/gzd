import { forwardRef } from "react";
import { Button as AntdButton } from "antd";
import { type ButtonProps } from "antd/es/button";

// 按钮组件属性
export interface GZDButtonProps extends ButtonProps {}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, GZDButtonProps>((props, ref) => {
  const { children, type = "default", ...restProps } = props;

  return (
    <AntdButton ref={ref} type={type} {...restProps}>
      {children}
    </AntdButton>
  );
});

// 设置 displayName 方便在 React DevTools 中调试
Button.displayName = "GZDButton";

export default Button;
