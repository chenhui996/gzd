import Tabs, { type GZDTabsProps } from './Tabs';
import { Tabs as AntdTabs } from 'antd';

export type { GZDTabsProps };

export type GZDTabsComponent = typeof Tabs & {
  TabPane: typeof AntdTabs.TabPane;
};

const TransTabs = Tabs as GZDTabsComponent;
TransTabs.TabPane = AntdTabs.TabPane;

export default TransTabs;
