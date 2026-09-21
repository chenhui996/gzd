import { forwardRef } from 'react';
import { Select as AntdSelect } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';

export interface GZDSelectOptionProps extends DefaultOptionType {}

const Option = forwardRef<HTMLElement, GZDSelectOptionProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdSelect.Option ref={ref as any} {...restProps}>
      {children}
    </AntdSelect.Option>
  );
});

Option.displayName = 'GZDSelectOption';

export default Option;
