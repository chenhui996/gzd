import React from 'react';
import { Drawer as AntdDrawer, type DrawerProps } from 'antd';

export interface GZDDrawerProps extends DrawerProps {}

// According to antd-wrapper skill, if TS complains about "ref does not exist on type IntrinsicAttributes & Props",
// we fallback to a normal React.FC to do a pure pass-through without breaking things.
const Drawer: React.FC<GZDDrawerProps> = (props) => {
  return <AntdDrawer {...props} />;
};

Drawer.displayName = 'GZDDrawer';

export default Drawer;
