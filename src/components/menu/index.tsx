import { Menu as AntdMenu } from "antd";
import Menu from "./Menu";

export type { GZDMenuProps } from "./Menu";

// 复用 Ant Design Menu 的内置子组件（因为新版推荐使用 items 属性传参，子组件主要为兼容）
export type GzdMenuComponent = typeof Menu & {
  Item: typeof AntdMenu.Item;
  SubMenu: typeof AntdMenu.SubMenu;
  Divider: typeof AntdMenu.Divider;
  ItemGroup: typeof AntdMenu.ItemGroup;
};

const TransMenu = Menu as GzdMenuComponent;

TransMenu.Item = AntdMenu.Item;
TransMenu.SubMenu = AntdMenu.SubMenu;
TransMenu.Divider = AntdMenu.Divider;
TransMenu.ItemGroup = AntdMenu.ItemGroup;

export default TransMenu;
