import { forwardRef } from "react";
import { Space as AntdSpace, type SpaceProps } from "antd";

// 间距组件属性
export interface GZDSpaceProps extends SpaceProps {}

const Space = forwardRef<HTMLDivElement, GZDSpaceProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdSpace ref={ref} {...restProps}>
      {children}
    </AntdSpace>
  );
});

Space.displayName = "GZDSpace";

export default Space;
