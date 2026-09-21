import React, { type ReactNode } from "react";
import { Space as AntdSpace, type SpaceProps } from "antd";

const { Addon: AntdSpaceAddon } = AntdSpace;

// 间距:紧凑布局，组件属性
export interface GZDSpaceAddonProps extends SpaceProps {
  /** 自定义内容 */
  children?: ReactNode;
}

const Addon: React.FC<GZDSpaceAddonProps> = (props) => {
  const { children, ...restProps } = props;

  return <AntdSpaceAddon {...restProps}>{children}</AntdSpaceAddon>;
};

export default Addon;
