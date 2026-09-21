import { forwardRef, useState } from "react";
import { Input as AntdInput } from "antd";
import type { InputProps, InputRef } from "antd";

export interface GZDInputProps extends InputProps {
  trim?: boolean;
}

const trimValue = <T,>(value: T): T => {
  return typeof value === "string" ? (value.trim() as T) : value;
};

const Input = forwardRef<InputRef, GZDInputProps>((props, ref) => {
  const {
    trim = false,
    onChange,
    value,
    defaultValue,
    ...restProps
  } = props;
  const [innerValue, setInnerValue] = useState<InputProps["value"]>(
    trimValue(defaultValue),
  );
  const mergedValue = value !== undefined ? trimValue(value) : innerValue;

  const handleChange: InputProps["onChange"] = (event) => {
    if (trim) {
      const trimmedValue = event.target.value.trim();

      event.target.value = trimmedValue;
      event.currentTarget.value = trimmedValue;

      if (value === undefined) {
        setInnerValue(trimmedValue);
      }
    }

    onChange?.(event);
  };

  return (
    <AntdInput
      ref={ref}
      {...restProps}
      value={trim ? (mergedValue ?? "") : value}
      defaultValue={trim ? undefined : defaultValue}
      onChange={trim ? handleChange : onChange}
    />
  );
});

Input.displayName = "GZDInput";

export default Input;
