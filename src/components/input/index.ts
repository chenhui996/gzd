import Input from "./Input";
import Password from "./Password";
import TextArea from "./TextArea";
import Search from "./Search";
import OTP from "./OTP";

export type { GZDInputProps } from "./Input";
export type { GZDPasswordProps } from "./Password";
export type { GZDTextAreaProps } from "./TextArea";
export type { GZDSearchProps } from "./Search";
export type { GZDOTPProps } from "./OTP";

export type GzdInputComponent = typeof Input & {
  Password: typeof Password;
  TextArea: typeof TextArea;
  Search: typeof Search;
  OTP: typeof OTP;
};

const TransInput = Input as GzdInputComponent;

TransInput.Password = Password;
TransInput.TextArea = TextArea;
TransInput.Search = Search;
TransInput.OTP = OTP;

export default TransInput;
