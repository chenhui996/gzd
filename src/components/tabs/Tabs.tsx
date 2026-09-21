import { forwardRef } from 'react';
import { Tabs as AntdTabs, type TabsProps } from 'antd';

export interface GZDTabsProps extends TabsProps {}

// Antd Tabs supports ref through React.ForwardRefExoticComponent
const Tabs = forwardRef<HTMLDivElement, GZDTabsProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdTabs ref={ref as any} {...restProps}>
      {children}
    </AntdTabs>
  );
});

Tabs.displayName = 'GZDTabs';

export default Tabs;
