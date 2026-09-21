import { forwardRef } from 'react';
import { Collapse as AntdCollapse, type CollapseProps } from 'antd';

export interface GZDCollapseProps extends CollapseProps {}

const Collapse = forwardRef<HTMLDivElement, GZDCollapseProps>((props, ref) => {
  return <AntdCollapse ref={ref} {...props} />;
});

Collapse.displayName = 'GZDCollapse';

export default Collapse;
