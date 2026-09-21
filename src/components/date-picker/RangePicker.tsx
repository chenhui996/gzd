import { forwardRef } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

export interface GZDRangePickerProps extends RangePickerProps {}

const RangePicker = forwardRef<any, GZDRangePickerProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdDatePicker.RangePicker ref={ref} {...restProps}>
      {children}
    </AntdDatePicker.RangePicker>
  );
});

RangePicker.displayName = 'GZDRangePicker';

export default RangePicker;
