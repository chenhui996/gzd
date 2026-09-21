import { forwardRef } from 'react';
import { Checkbox as AntdCheckbox } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';

export interface GZDCheckboxGroupProps extends CheckboxGroupProps {}

const CheckboxGroup = forwardRef<HTMLDivElement, GZDCheckboxGroupProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdCheckbox.Group ref={ref} {...restProps}>
      {children}
    </AntdCheckbox.Group>
  );
});

CheckboxGroup.displayName = 'GZDCheckboxGroup';

export default CheckboxGroup;
