import { forwardRef } from 'react';
import { InputNumber as AntdInputNumber } from 'antd';
import type { InputNumberProps } from 'antd';

export interface GZDInputNumberProps<T extends number | string = any> extends InputNumberProps<T> {}

const InputNumber = forwardRef<HTMLInputElement, GZDInputNumberProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdInputNumber ref={ref as any} {...restProps}>
      {children}
    </AntdInputNumber>
  );
}) as <T extends number | string = any>(
  props: React.PropsWithChildren<GZDInputNumberProps<T>> & React.RefAttributes<HTMLInputElement>
) => React.ReactElement;

(InputNumber as any).displayName = 'GZDInputNumber';

export default InputNumber;
