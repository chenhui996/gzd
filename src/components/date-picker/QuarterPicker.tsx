import { forwardRef } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';

export type GZDQuarterPickerProps = React.ComponentProps<typeof AntdDatePicker.QuarterPicker>;

const QuarterPicker = forwardRef<any, GZDQuarterPickerProps>((props, ref) => {
  return <AntdDatePicker.QuarterPicker ref={ref} {...props} />;
});

QuarterPicker.displayName = 'GZDQuarterPicker';

export default QuarterPicker;
