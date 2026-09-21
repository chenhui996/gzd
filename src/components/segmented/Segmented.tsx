import { forwardRef } from 'react';
import { Segmented as AntdSegmented, type SegmentedProps } from 'antd';

export interface GZDSegmentedProps<ValueType = any> extends SegmentedProps<ValueType> {}

const Segmented = forwardRef<HTMLDivElement, GZDSegmentedProps>((props, ref) => {
  return <AntdSegmented ref={ref} {...props} />;
});

Segmented.displayName = 'GZDSegmented';

export default Segmented;
