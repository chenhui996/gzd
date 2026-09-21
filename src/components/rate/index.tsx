import { forwardRef } from 'react';
import { Rate as AntdRate } from 'antd';
import type { RateProps } from 'antd';

export interface GZDRateProps extends RateProps {}

const Rate = forwardRef<HTMLElement, GZDRateProps>((props, ref) => {
  return <AntdRate ref={ref as any} {...props} />;
});

Rate.displayName = 'GZDRate';

export default Rate;
