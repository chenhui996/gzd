import { forwardRef } from "react";
import { Input as AntdInput } from "antd";
import type { InputRef } from "antd";
import type { PasswordProps } from "antd/es/input";

export interface GZDPasswordProps extends PasswordProps {}

const Password = forwardRef<InputRef, GZDPasswordProps>((props, ref) => {
  return <AntdInput.Password ref={ref} {...props} />;
});

Password.displayName = "GZDPassword";

export default Password;
