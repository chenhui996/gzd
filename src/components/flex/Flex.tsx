import { forwardRef } from 'react';
import { Flex as AntdFlex, type FlexProps } from 'antd';

export interface GZDFlexProps extends FlexProps {}

const Flex = forwardRef<HTMLDivElement, GZDFlexProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdFlex ref={ref} {...restProps}>
      {children}
    </AntdFlex>
  );
});

Flex.displayName = 'GZDFlex';

export default Flex;
