import { Layout as AntdLayout, type SiderProps } from 'antd';
import Layout from './Layout';

export type { GZDLayoutProps } from './Layout';
export type { SiderProps };

export type GZDLayoutComponent = typeof Layout & {
  Header: typeof AntdLayout.Header;
  Footer: typeof AntdLayout.Footer;
  Content: typeof AntdLayout.Content;
  Sider: typeof AntdLayout.Sider;
};

const TransLayout = Layout as GZDLayoutComponent;

TransLayout.Header = AntdLayout.Header;
TransLayout.Footer = AntdLayout.Footer;
TransLayout.Content = AntdLayout.Content;
TransLayout.Sider = AntdLayout.Sider;

export default TransLayout;
