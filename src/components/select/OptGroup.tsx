import { forwardRef } from 'react';
import { Select as AntdSelect } from 'antd';

export interface GZDSelectOptGroupProps {
  label: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const OptGroup = forwardRef<HTMLElement, GZDSelectOptGroupProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdSelect.OptGroup ref={ref as any} {...restProps}>
      {children}
    </AntdSelect.OptGroup>
  );
});

OptGroup.displayName = 'GZDSelectOptGroup';

export default OptGroup;
