import { forwardRef } from 'react';
import { Calendar as AntdCalendar } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';

export interface GZDCalendarProps<DateType = Dayjs> extends CalendarProps<DateType> {}

const Calendar = forwardRef<HTMLDivElement, GZDCalendarProps>((props, ref) => {
  return (
    <div ref={ref}>
      <AntdCalendar {...props} />
    </div>
  );
});

Calendar.displayName = 'GZDCalendar';

export default Calendar;
