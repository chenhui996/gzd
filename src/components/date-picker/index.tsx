import type { DatePickerProps } from "antd";
import { DatePicker as AntdDatePicker } from "antd";
import { forwardRef } from "react";

import MonthPicker, { type GZDMonthPickerProps } from "./MonthPicker";
import QuarterPicker, { type GZDQuarterPickerProps } from "./QuarterPicker";
import RangePicker, { type GZDRangePickerProps } from "./RangePicker";
import TimePicker, { type GZDTimePickerProps } from "./TimePicker";
import WeekPicker, { type GZDWeekPickerProps } from "./WeekPicker";
import YearPicker, { type GZDYearPickerProps } from "./YearPicker";

export type {
  GZDMonthPickerProps,
  GZDQuarterPickerProps,
  GZDRangePickerProps,
  GZDTimePickerProps,
  GZDWeekPickerProps,
  GZDYearPickerProps
};

export interface GZDDatePickerProps extends DatePickerProps {}

const DatePicker = forwardRef<any, GZDDatePickerProps>((props, ref) => {
  return <AntdDatePicker format="YYYY-MM-DD" ref={ref} {...props} />;
});

export type GZDDatePickerComponent = typeof DatePicker & {
  RangePicker: typeof RangePicker;
  WeekPicker: typeof WeekPicker;
  MonthPicker: typeof MonthPicker;
  YearPicker: typeof YearPicker;
  QuarterPicker: typeof QuarterPicker;
  TimePicker: typeof TimePicker;
};

const TransDatePicker = DatePicker as GZDDatePickerComponent;

TransDatePicker.RangePicker = RangePicker;
TransDatePicker.WeekPicker = WeekPicker;
TransDatePicker.MonthPicker = MonthPicker;
TransDatePicker.YearPicker = YearPicker;
TransDatePicker.QuarterPicker = QuarterPicker;
TransDatePicker.TimePicker = TimePicker;
TransDatePicker.displayName = "GZDDatePicker";

export default TransDatePicker;
