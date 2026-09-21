import React  from "react";
import { Space as AntdSpace, type SpaceProps } from "antd";

const { Compact: AntdSpaceCompact } = AntdSpace;

// 间距:紧凑布局，组件属性
export interface GZDSpaceCompactProps extends SpaceProps {
  /** 将宽度调整为父元素宽度的选项 */
  block?: boolean;
  /** 指定排列方向 */
  orientation?: 'vertical' | 'horizontal'	;
  /** 子组件大小 */
  size?: 'large' | 'middle' | 'small'	;
  /** 是否垂直，和 orientation 同时配置以 orientation 优先 */
  vertical?: boolean;
}

const Compact: React.FC<GZDSpaceCompactProps> = (props) => {
  const { children, ...restProps } = props;

  return <AntdSpaceCompact {...restProps}>{children}</AntdSpaceCompact>;
};

export default Compact;
