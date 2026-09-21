import { forwardRef } from "react";
import { Input as AntdInput } from "antd";
import type { TextAreaProps } from "antd/es/input";
import type { TextAreaRef } from "antd/es/input/TextArea";

export interface GZDTextAreaProps extends TextAreaProps {}

const TextArea = forwardRef<TextAreaRef, GZDTextAreaProps>((props, ref) => {
  return <AntdInput.TextArea ref={ref} {...props} />;
});

TextArea.displayName = "GZDTextArea";

export default TextArea;
