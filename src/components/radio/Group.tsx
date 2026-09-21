import { forwardRef } from 'react';
import { Radio as AntdRadio } from 'antd';
import type { RadioGroupProps } from 'antd';

export interface GZDRadioGroupProps extends RadioGroupProps {}

const Group = forwardRef<HTMLDivElement, GZDRadioGroupProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdRadio.Group ref={ref} {...restProps}>
      {children}
    </AntdRadio.Group>
  );
});

Group.displayName = 'GZDRadioGroup';

export default Group;
