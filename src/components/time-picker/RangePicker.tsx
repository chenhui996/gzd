import { forwardRef } from 'react';
import { TimePicker as AntdTimePicker } from 'antd';
import type { TimeRangePickerProps } from 'antd';
export interface GZDTimeRangePickerProps extends TimeRangePickerProps {}

const RangePicker = forwardRef<any, GZDTimeRangePickerProps>((props, ref) => {
  return <AntdTimePicker.RangePicker ref={ref} {...props} />;
});

RangePicker.displayName = 'GZDTimeRangePicker';

export default RangePicker;
