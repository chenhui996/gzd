import { forwardRef } from 'react';
import { Radio as AntdRadio } from 'antd';
import type { RadioProps } from 'antd';

import Group, { type GZDRadioGroupProps } from './Group';
import Button, { type GZDRadioButtonProps } from './Button';

export interface GZDRadioProps extends RadioProps {}
export type { GZDRadioGroupProps as RadioGroupProps, GZDRadioButtonProps as RadioButtonProps };

const Radio = forwardRef<HTMLElement, GZDRadioProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdRadio ref={ref as any} {...restProps}>
      {children}
    </AntdRadio>
  );
});

export type GZDRadioComponent = typeof Radio & {
  Group: typeof Group;
  Button: typeof Button;
};

const TransRadio = Radio as GZDRadioComponent;

TransRadio.Group = Group;
TransRadio.Button = Button;
TransRadio.displayName = 'GZDRadio';

export default TransRadio;
