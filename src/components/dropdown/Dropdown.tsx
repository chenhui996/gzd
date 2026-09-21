import { forwardRef } from "react";
import { Dropdown as AntdDropdown } from "antd";
import type { DropdownProps } from "antd/es/dropdown";

// 下拉菜单组件属性
export type GZDDropdownProps = DropdownProps;

const Dropdown = forwardRef<HTMLElement, GZDDropdownProps>((props, ref) => {
  return <AntdDropdown ref={ref} {...props} />;
});

Dropdown.displayName = "GZDDropdown";

export default Dropdown;
