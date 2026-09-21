import { forwardRef } from 'react';
import { TimePicker as AntdTimePicker } from 'antd';
import type { TimePickerProps } from 'antd';
import RangePicker, { type GZDTimeRangePickerProps } from './RangePicker';

export interface GZDTimePickerProps extends TimePickerProps {}
export type { GZDTimeRangePickerProps as TimeRangePickerProps };

const TimePicker = forwardRef<any, GZDTimePickerProps>((props, ref) => {
  return <AntdTimePicker ref={ref} {...props} />;
});

export type GZDTimePickerComponent = typeof TimePicker & {
  RangePicker: typeof RangePicker;
};

const TransTimePicker = TimePicker as GZDTimePickerComponent;

TransTimePicker.RangePicker = RangePicker;
TransTimePicker.displayName = 'GZDTimePicker';

export default TransTimePicker;
