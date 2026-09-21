import { forwardRef } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';

export type GZDTimePickerProps = React.ComponentProps<typeof AntdDatePicker.TimePicker>;

const TimePicker = forwardRef<any, GZDTimePickerProps>((props, ref) => {
  return <AntdDatePicker.TimePicker ref={ref} {...props} />;
});

TimePicker.displayName = 'GZDTimePicker';

export default TimePicker;
