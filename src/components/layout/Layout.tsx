import { forwardRef } from 'react';
import { Layout as AntdLayout, type LayoutProps } from 'antd';

export interface GZDLayoutProps extends LayoutProps {}

const Layout = forwardRef<HTMLDivElement, GZDLayoutProps>((props, ref) => {
  return <AntdLayout ref={ref} {...props} />;
});

Layout.displayName = 'GZDLayout';

export default Layout;
