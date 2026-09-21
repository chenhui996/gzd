import { forwardRef } from "react";
import { Input as AntdInput } from "antd";
import type { OTPProps, OTPRef } from "antd/es/input/OTP";

export interface GZDOTPProps extends OTPProps {}

const OTP = forwardRef<OTPRef, GZDOTPProps>((props, ref) => {
  return <AntdInput.OTP ref={ref} {...props} />;
});

OTP.displayName = "GZDOTP";

export default OTP;
