import { forwardRef } from 'react';
import { Collapse as AntdCollapse } from 'antd';
import type { CollapsePanelProps } from 'antd';

export interface GZDCollapsePanelProps extends CollapsePanelProps {}

const Panel = forwardRef<HTMLDivElement, GZDCollapsePanelProps>((props, ref) => {
  return <AntdCollapse.Panel ref={ref} {...props} />;
});

Panel.displayName = 'GZDCollapsePanel';

export default Panel;
