import { forwardRef } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';

export type GZDMonthPickerProps = React.ComponentProps<typeof AntdDatePicker.MonthPicker>;

const MonthPicker = forwardRef<any, GZDMonthPickerProps>((props, ref) => {
  return <AntdDatePicker.MonthPicker ref={ref} {...props} />;
});

MonthPicker.displayName = 'GZDMonthPicker';

export default MonthPicker;
