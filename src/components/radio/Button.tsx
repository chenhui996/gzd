import { forwardRef } from 'react';
import { Radio as AntdRadio } from 'antd';
import type { RadioProps } from 'antd';

export interface GZDRadioButtonProps extends RadioProps {}

const Button = forwardRef<HTMLElement, GZDRadioButtonProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdRadio.Button ref={ref as any} {...restProps}>
      {children}
    </AntdRadio.Button>
  );
});

Button.displayName = 'GZDRadioButton';

export default Button;
