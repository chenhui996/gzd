import { forwardRef } from "react";
import { Menu as AntdMenu } from "antd";
import type { MenuProps, MenuRef } from "antd";

export interface GZDMenuProps extends MenuProps {}

const Menu = forwardRef<MenuRef, GZDMenuProps>((props, ref) => {
  return <AntdMenu ref={ref} {...props} />;
});

Menu.displayName = "GZDMenu";

export default Menu;
