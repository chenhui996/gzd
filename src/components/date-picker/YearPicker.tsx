import { forwardRef } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';

export type GZDYearPickerProps = React.ComponentProps<typeof AntdDatePicker.YearPicker>;

const YearPicker = forwardRef<any, GZDYearPickerProps>((props, ref) => {
  return <AntdDatePicker.YearPicker ref={ref} {...props} />;
});

YearPicker.displayName = 'GZDYearPicker';

export default YearPicker;
