import { forwardRef } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';

export type GZDWeekPickerProps = React.ComponentProps<typeof AntdDatePicker.WeekPicker>;

const WeekPicker = forwardRef<any, GZDWeekPickerProps>((props, ref) => {
  return <AntdDatePicker.WeekPicker ref={ref} {...props} />;
});

WeekPicker.displayName = 'GZDWeekPicker';

export default WeekPicker;
