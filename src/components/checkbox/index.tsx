import { forwardRef } from 'react';
import { Checkbox as AntdCheckbox } from 'antd';
import type { CheckboxProps, CheckboxRef } from 'antd';
import Group, { type GZDCheckboxGroupProps } from './Group';

export type { GZDCheckboxGroupProps };
export interface GZDCheckboxProps extends CheckboxProps {}

const Checkbox = forwardRef<CheckboxRef, GZDCheckboxProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdCheckbox ref={ref} {...restProps}>
      {children}
    </AntdCheckbox>
  );
});

export type GZDCheckboxComponent = typeof Checkbox & {
  Group: typeof Group;
};

const TransCheckbox = Checkbox as GZDCheckboxComponent;

TransCheckbox.Group = Group;
TransCheckbox.displayName = 'GZDCheckbox';

export default TransCheckbox;
