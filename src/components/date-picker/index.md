---
group: 数据录入
title: DatePicker 日期选择框
---

# DatePicker 日期选择框

输入或选择日期的控件。

## 何时使用

当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。

## 代码演示

### 基本

最简单的用法，在浮层中可以选择或者输入日期。

```tsx
import React from "react";
import { DatePicker, Space } from "gzd";

const onChange = (date: any, dateString: string | string[]) => {
  console.log(date, dateString);
};

const App: React.FC = () => (
  <Space direction="vertical">
    <DatePicker onChange={onChange} />
    <DatePicker picker="week" onChange={onChange} />
    <DatePicker picker="month" onChange={onChange} />
    <DatePicker picker="quarter" onChange={onChange} />
    <DatePicker picker="year" onChange={onChange} />
  </Space>
);

export default App;
```

### 范围选择器

通过设置 `picker` 属性，指定范围选择器类型。

```tsx
import React from "react";
import { DatePicker, Space } from "gzd";

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space direction="vertical" size={12}>
    <RangePicker />
    <RangePicker picker="week" />
    <RangePicker picker="month" />
    <RangePicker picker="quarter" />
    <RangePicker picker="year" />
  </Space>
);

export default App;
```

### 多选

通过 `multiple` 属性可以开启多选模式。不支持 showTime 以及 picker="time"。

```tsx
import React from "react";
import { DatePicker, type DatePickerProps } from "gzd";
import { Flex } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const onChange: DatePickerProps<Dayjs, true>["onChange"] = (
  date,
  dateString,
) => {
  console.log(date, dateString);
};

const defaultValue = [
  dayjs("2000-01-01"),
  dayjs("2000-01-03"),
  dayjs("2000-01-05"),
];

const App: React.FC = () => (
  <Flex vertical gap="small">
    <DatePicker
      multiple
      onChange={onChange}
      maxTagCount="responsive"
      defaultValue={defaultValue}
      size="small"
    />
    <DatePicker
      multiple
      onChange={onChange}
      maxTagCount="responsive"
      defaultValue={defaultValue}
    />
    <DatePicker
      multiple
      onChange={onChange}
      maxTagCount="responsive"
      defaultValue={defaultValue}
      size="large"
    />
  </Flex>
);

export default App;
```

### 选择确认

DatePicker 默认会根据 picker 的交互行为，自动选择是否需要确认按钮。
你也可以通过 needConfirm 属性来手动设置是否需要确认按钮。当有 needConfirm 时，用户始终需要点击确认按钮才能完成选择。
反之，则会在选择或者失去焦点时提交。

```tsx
import React from "react";
import { DatePicker, Space } from "gzd";

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space direction="vertical" size={12}>
    <DatePicker needConfirm />
    <RangePicker needConfirm />
  </Space>
);

export default App;
```

### 切换不同的选择器

配合 Select 组件切换不同的选择器。

```tsx
import React, { useState } from "react";
import { DatePicker, Space } from "gzd";
import { Select } from "antd";

const App: React.FC = () => {
  const [type, setType] = useState<any>("date");
  return (
    <Space>
      <Select
        value={type}
        onChange={setType}
        options={[
          { label: "Time", value: "time" },
          { label: "Date", value: "date" },
          { label: "Week", value: "week" },
          { label: "Month", value: "month" },
          { label: "Quarter", value: "quarter" },
          { label: "Year", value: "year" },
        ]}
      />
      <DatePicker picker={type} />
    </Space>
  );
};

export default App;
```

### 日期格式

使用 format 属性，可以自定义日期显示格式。当 format 为数组时，选择器输入框可以输入数组中任意一个有效格式。

```tsx
import React from "react";
import type { DatePickerProps } from "gzd";
import { DatePicker, Space } from "gzd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = "YYYY/MM/DD";
const weekFormat = "MM/DD";
const monthFormat = "YYYY/MM";

/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

const customFormat: DatePickerProps["format"] = (value) =>
  `custom format: ${value.format(dateFormat)}`;

const customWeekStartEndFormat: DatePickerProps["format"] = (value) =>
  `${dayjs(value).startOf("week").format(weekFormat)} ~ ${dayjs(value)
    .endOf("week")
    .format(weekFormat)}`;

const App: React.FC = () => (
  <Space vertical size={12}>
    <DatePicker
      defaultValue={dayjs("2015/01/01", dateFormat)}
      format={dateFormat}
    />
    <DatePicker
      defaultValue={dayjs("01/01/2015", dateFormatList[0])}
      format={dateFormatList}
    />
    <DatePicker
      defaultValue={dayjs("2015/01", monthFormat)}
      format={monthFormat}
      picker="month"
    />
    <DatePicker
      defaultValue={dayjs()}
      format={customWeekStartEndFormat}
      picker="week"
    />
    <RangePicker
      defaultValue={[
        dayjs("2015/01/01", dateFormat),
        dayjs("2015/01/01", dateFormat),
      ]}
      format={dateFormat}
    />
    <DatePicker
      defaultValue={dayjs("2015/01/01", dateFormat)}
      format={customFormat}
    />
  </Space>
);

export default App;
```

### 日期时间选择

增加选择时间功能，当 `showTime` 为一个对象时，其属性会传递给内建的 `TimePicker`。

```tsx
import React from "react";
import { DatePicker, Space } from "gzd";

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space direction="vertical" size={12}>
    <DatePicker showTime />
    <RangePicker showTime />
  </Space>
);

export default App;
```

### 格式对齐

输入格式对齐，通过键盘左右切换焦点。失去焦点时会尝试对齐到最后合法的日期。

```tsx
import React from "react";
import { DatePicker, Space } from "gzd";

const App: React.FC = () => (
  <Space direction="vertical" size={12}>
    <DatePicker format={{ format: "YYYY-MM-DD", type: "mask" }} />
  </Space>
);

export default App;
```

### 日期限定范围

可以通过 `minDate` 和 `maxDate` 限制可选择的日期范围。

```tsx
import React from "react";
import { DatePicker, Space } from "gzd";
import dayjs from "dayjs";

const App: React.FC = () => (
  <Space direction="vertical" size={12}>
    <DatePicker minDate={dayjs("2023-01-01")} maxDate={dayjs("2023-12-31")} />
  </Space>
);

export default App;
```

### 禁用

选择框的不可用状态。

```tsx
import React from "react";
import { DatePicker, Space } from "gzd";

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space direction="vertical" size={12}>
    <DatePicker disabled />
    <RangePicker disabled />
    <RangePicker disabled={[false, true]} />
  </Space>
);

export default App;
```

### 不可选择日期和时间

可用 `disabledDate` 和 `disabledTime` 分别禁止选择部分日期和时间，其中 `disabledTime` 需要和 showTime 一起使用。

```tsx
import React from "react";
import { DatePicker, Space } from "gzd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const range = (start: number, end: number) => {
  const result: number[] = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf("day");
};

const disabledDateForMonth: RangePickerProps["disabledDate"] = (current) => {
  // Can not select months before this month
  return current && current < dayjs().startOf("month");
};

const disabledDateTime = () => ({
  disabledHours: () => range(0, 24).splice(4, 20),
  disabledMinutes: () => range(30, 60),
  disabledSeconds: () => [55, 56],
});

const disabledRangeTime: RangePickerProps["disabledTime"] = (_, type) => {
  if (type === "start") {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  };
};

const App: React.FC = () => (
  <Space vertical size={12}>
    <DatePicker
      format="YYYY-MM-DD HH:mm:ss"
      disabledDate={disabledDate}
      disabledTime={disabledDateTime}
      showTime={{ defaultOpenValue: dayjs("00:00:00", "HH:mm:ss") }}
    />
    <DatePicker picker="month" disabledDate={disabledDateForMonth} />
    <RangePicker disabledDate={disabledDate} />
    <RangePicker
      disabledDate={disabledDate}
      disabledTime={disabledRangeTime}
      showTime={{
        hideDisabledOptions: true,
        defaultOpenValue: [
          dayjs("00:00:00", "HH:mm:ss"),
          dayjs("11:59:59", "HH:mm:ss"),
        ],
      }}
      format="YYYY-MM-DD HH:mm:ss"
    />
  </Space>
);

export default App;
```

### 允许留空

在范围选择时，可以允许留空。这对于需要保留“至今”日期项颇为有用。

```tsx
import React from "react";
import { DatePicker } from "gzd";

const { RangePicker } = DatePicker;

const App: React.FC = () => <RangePicker allowEmpty={[false, true]} />;

export default App;
```

### 选择不超过一定的范围

使用 `disabledDate` 的 `info.from` 来限制动态的日期区间选择。

```tsx
import React from "react";
import { Typography } from "antd";
import { DatePicker, Space } from "gzd";
import type { DatePickerProps } from "gzd";
import type { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();

// Disabled 7 days from the selected date
const disabled7DaysDate: DatePickerProps["disabledDate"] = (
  current,
  { from, type },
) => {
  if (from) {
    const minDate = from.add(-6, "days");
    const maxDate = from.add(6, "days");

    switch (type) {
      case "year":
        return (
          current.year() < minDate.year() || current.year() > maxDate.year()
        );

      case "month":
        return (
          getYearMonth(current) < getYearMonth(minDate) ||
          getYearMonth(current) > getYearMonth(maxDate)
        );

      default:
        return Math.abs(current.diff(from, "days")) >= 7;
    }
  }

  return false;
};

// Disabled 6 months from the selected date
const disabled6MonthsDate: DatePickerProps["disabledDate"] = (
  current,
  { from, type },
) => {
  if (from) {
    const minDate = from.add(-5, "months");
    const maxDate = from.add(5, "months");

    switch (type) {
      case "year":
        return (
          current.year() < minDate.year() || current.year() > maxDate.year()
        );

      default:
        return (
          getYearMonth(current) < getYearMonth(minDate) ||
          getYearMonth(current) > getYearMonth(maxDate)
        );
    }
  }

  return false;
};

const App: React.FC = () => (
  <Space vertical>
    <Typography.Title level={5}>7 days range</Typography.Title>
    <RangePicker disabledDate={disabled7DaysDate} />

    <Typography.Title level={5}>6 months range</Typography.Title>
    <RangePicker disabledDate={disabled6MonthsDate} picker="month" />
  </Space>
);

export default App;
```

### 预设范围

可以预设常用的日期范围以提高用户体验。preset value 支持回调函数返回值方式。

```tsx
import React from "react";
import type { TimeRangePickerProps } from "gzd";
import { DatePicker, Space } from "gzd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

const onChange = (date: Dayjs | null) => {
  if (date) {
    console.log("Date: ", date);
  } else {
    console.log("Clear");
  }
};

const onRangeChange = (
  dates: null | (Dayjs | null)[],
  dateStrings: string[],
) => {
  if (dates) {
    console.log("From: ", dates[0], ", to: ", dates[1]);
    console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
  } else {
    console.log("Clear");
  }
};

const rangePresets: TimeRangePickerProps["presets"] = [
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];

const App: React.FC = () => (
  <Space vertical size={12}>
    <DatePicker
      presets={[
        { label: "Yesterday", value: dayjs().add(-1, "d") },
        { label: "Last Week", value: dayjs().add(-7, "d") },
        { label: "Last Month", value: dayjs().add(-1, "month") },
      ]}
      onChange={onChange}
    />
    <RangePicker presets={rangePresets} onChange={onRangeChange} />
    <RangePicker
      presets={[
        {
          label: <span aria-label="Current Time to End of Day">Now ~ EOD</span>,
          value: () => [dayjs(), dayjs().endOf("day")], // 5.8.0+ support function
        },
        ...rangePresets,
      ]}
      showTime
      format="YYYY/MM/DD HH:mm:ss"
      onChange={onRangeChange}
    />
  </Space>
);

export default App;
```

### 额外的页脚

在浮层中加入额外的页脚，以满足某些定制信息的需求。

```tsx
import React from "react";
import { DatePicker, Space } from "gzd";

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space direction="vertical" size={12}>
    <DatePicker renderExtraFooter={() => "extra footer"} />
    <RangePicker renderExtraFooter={() => "extra footer"} />
  </Space>
);

export default App;
```

### 三种大小

三种大小的输入框。

```tsx
import React from "react";
import { DatePicker, Space } from "gzd";

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space direction="vertical" size={12}>
    <DatePicker size="large" />
    <DatePicker />
    <DatePicker size="small" />
  </Space>
);

export default App;
```

### 定制单元格

使用 `cellRender` 来自定义单元格内容。

```tsx
import React from "react";
import type { DatePickerProps } from "gzd";
import { theme } from "antd";
import { DatePicker, Space } from "gzd";
import type { Dayjs } from "dayjs";

const App: React.FC = () => {
  const { token } = theme.useToken();
  const style: React.CSSProperties = {
    border: `1px solid ${token.colorPrimary}`,
    borderRadius: "50%",
  };
  const cellRender: DatePickerProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type !== "date") {
      return info.originNode;
    }
    if (typeof current === "number" || typeof current === "string") {
      return <div className="ant-picker-cell-inner">{current}</div>;
    }
    return (
      <div
        className="ant-picker-cell-inner"
        style={current.date() === 1 ? style : {}}>
        {current.date()}
      </div>
    );
  };
  return (
    <Space size={12} vertical>
      <DatePicker cellRender={cellRender} />
      <DatePicker.RangePicker cellRender={cellRender} />
    </Space>
  );
};

export default App;
```

### 定制面板

使用 `components` 来自定义整个面板渲染。

```tsx
import React from "react";
import type { DatePickerProps } from "gzd";
import { Button, DatePicker, Space } from "gzd";
import { Flex, Slider, Typography } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const onChange: DatePickerProps["onChange"] = (date, dateString) => {
  console.log(date, dateString);
};

type DateComponent = Required<
  NonNullable<DatePickerProps<Dayjs>["components"]>
>["date"];
type GetProps<T> = T extends React.ComponentType<infer P> ? P : never;

const MyDatePanel = (props: GetProps<DateComponent>) => {
  const { value, onSelect, onHover } = props;

  // Value
  const startDate = React.useMemo(() => dayjs().date(1).month(0), []);
  const [innerValue, setInnerValue] = React.useState(value || startDate);

  React.useEffect(() => {
    if (value) {
      setInnerValue(value);
    }
  }, [value]);

  // Range
  const dateCount = React.useMemo(() => {
    const endDate = startDate.add(1, "year").add(-1, "day");
    return endDate.diff(startDate, "day");
  }, [startDate]);

  const sliderValue = Math.min(
    Math.max(0, innerValue.diff(startDate, "day")),
    dateCount,
  );

  // Render
  return (
    <Flex vertical gap="small" style={{ padding: 16 }}>
      <Typography.Title level={4} style={{ margin: 0 }} title="no, it's not">
        The BEST Picker Panel
      </Typography.Title>
      <Slider
        min={0}
        max={dateCount}
        value={sliderValue}
        onChange={(nextValue) => {
          const nextDate = startDate.add(nextValue, "day");
          setInnerValue(nextDate);
          onHover?.(nextDate);
        }}
        tooltip={{
          formatter: (nextValue) =>
            startDate.add(nextValue || 0, "day").format("YYYY-MM-DD"),
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          onSelect(innerValue);
        }}>{`That's It!`}</Button>
    </Flex>
  );
};

const App: React.FC = () => (
  <Space vertical>
    <DatePicker
      showNow={false}
      onChange={onChange}
      components={{
        date: MyDatePanel,
      }}
    />
  </Space>
);

export default App;
```

### 外部使用面板

可以通过内部的组件直接渲染面板（这里以常规 DatePicker 替代展示）。

```tsx
import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { DatePicker, Dropdown, Space } from "gzd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const DatePickerDemo: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [panelVisible, setPanelVisible] = React.useState(false);

  const [date, setDate] = React.useState<Dayjs | null>(() => dayjs());

  return (
    <Dropdown
      arrow
      open={visible}
      trigger={["click"]}
      destroyOnHidden
      onOpenChange={(open) => {
        setVisible(open);
        if (!open) {
          setPanelVisible(false);
        }
      }}
      menu={{
        items: [
          {
            key: "today",
            label: "Today",
            onClick() {
              setDate(dayjs());
              setVisible(false);
            },
          },
          {
            key: "tomorrow",
            label: "Tomorrow",
            onClick() {
              setDate(dayjs().add(1, "day"));
              setVisible(false);
            },
          },
          {
            key: "custom-date",
            label: (
              <div
                style={{ position: "relative", overflow: "hidden" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setPanelVisible(true);
                }}>
                <div>Customize</div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}>
                  <DatePicker
                    open={panelVisible}
                    styles={{
                      root: {
                        pointerEvents: "none",
                        opacity: 0,
                        position: "absolute",
                        bottom: -12,
                        insetInlineStart: 0,
                      },
                    }}
                    onChange={(date) => {
                      setDate(date);
                      setVisible(false);
                      setPanelVisible(false);
                    }}
                  />
                </div>
              </div>
            ),
          },
        ],
      }}>
      <Space>
        <span>{date?.format("YYYY-MM-DD")}</span>
        <DownOutlined />
      </Space>
    </Dropdown>
  );
};

const RangePickerDemo: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [panelVisible, setPanelVisible] = React.useState(false);

  const [dates, setDates] = React.useState<[Dayjs, Dayjs] | null>(() => [
    dayjs(),
    dayjs().add(1, "day"),
  ]);

  return (
    <Dropdown
      arrow
      open={visible}
      trigger={["click"]}
      destroyOnHidden
      onOpenChange={(open) => {
        setVisible(open);
        if (!open) {
          setPanelVisible(false);
        }
      }}
      menu={{
        items: [
          {
            key: "7",
            label: "7 days",
            onClick() {
              setDates([dayjs(), dayjs().add(7, "day")]);
              setVisible(false);
            },
          },
          {
            key: "30",
            label: "30 days",
            onClick() {
              setDates([dayjs(), dayjs().add(30, "day")]);
              setVisible(false);
            },
          },
          {
            key: "custom-date",
            label: (
              <div
                style={{ position: "relative", overflow: "hidden" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setPanelVisible(true);
                }}>
                <div>Customize</div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}>
                  <DatePicker.RangePicker
                    open={panelVisible}
                    styles={{
                      root: {
                        pointerEvents: "none",
                        opacity: 0,
                        position: "absolute",
                        bottom: 0, // RangePicker use this style
                        insetInlineStart: 0,
                      },
                    }}
                    onChange={(ranges) => {
                      if (ranges?.[0] && ranges?.[1]) {
                        setDates([ranges[0], ranges[1]]);
                      } else {
                        setDates(null);
                      }
                      setVisible(false);
                      setPanelVisible(false);
                    }}
                  />
                </div>
              </div>
            ),
          },
        ],
      }}>
      <Space>
        <span>
          {dates
            ? `${dates[0].format("YYYY-MM-DD")} ~ ${dates[1].format("YYYY-MM-DD")}`
            : "Select range"}
        </span>
        <DownOutlined />
      </Space>
    </Dropdown>
  );
};

const Demo = () => {
  return (
    <div style={{ display: "flex", gap: "20%" }}>
      <div>
        <div style={{ marginBottom: 12 }}>DatePicker</div>
        <DatePickerDemo />
      </div>

      <div>
        <div style={{ marginBottom: 12 }}>RangePicker</div>
        <RangePickerDemo />
      </div>
    </div>
  );
};

export default Demo;
```

### 佛历格式

通过 `locale` 配置支持特殊的年历格式。

```tsx
import React from "react";
import { ConfigProvider, DatePicker, Space } from "gzd";
import { Typography } from "antd";
import type { DatePickerProps } from "gzd";
import en from "antd/es/date-picker/locale/en_US";
import enUS from "antd/es/locale/en_US";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";

dayjs.extend(buddhistEra);

const { Title } = Typography;

// Component level locale
const buddhistLocale: typeof en = {
  ...en,
  lang: {
    ...en.lang,
    fieldDateFormat: "BBBB-MM-DD",
    fieldDateTimeFormat: "BBBB-MM-DD HH:mm:ss",
    yearFormat: "BBBB",
    cellYearFormat: "BBBB",
  },
};

// ConfigProvider level locale
const globalBuddhistLocale: typeof enUS = {
  ...enUS,
  DatePicker: {
    ...enUS.DatePicker!,
    lang: buddhistLocale.lang,
  },
};

const defaultValue = dayjs("2024-01-01");

const App: React.FC = () => {
  const onChange: DatePickerProps["onChange"] = (_, dateStr) => {
    console.log("onChange:", dateStr);
  };

  return (
    <Space vertical>
      <Title level={4}>By locale props</Title>
      <DatePicker
        defaultValue={defaultValue}
        locale={buddhistLocale}
        onChange={onChange}
      />
      <DatePicker
        defaultValue={defaultValue}
        showTime
        locale={buddhistLocale}
        onChange={onChange}
      />

      <Title level={4}>By ConfigProvider</Title>
      <ConfigProvider locale={globalBuddhistLocale}>
        <Space vertical>
          <DatePicker defaultValue={defaultValue} onChange={onChange} />
          <DatePicker
            defaultValue={defaultValue}
            showTime
            onChange={onChange}
          />
        </Space>
      </ConfigProvider>
    </Space>
  );
};

export default App;
```

### 自定义状态

使用 `status` 属性自定义组件状态。

```tsx
import React from "react";
import { DatePicker, Space } from "gzd";

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space direction="vertical" size={12}>
    <DatePicker status="error" />
    <DatePicker status="warning" />
    <RangePicker status="error" />
    <RangePicker status="warning" />
  </Space>
);

export default App;
```

### 形态变体

提供 `outlined`、`filled`、`borderless` 和 `underlined` 等多种外观形态。

```tsx
import React from "react";
import { DatePicker, Space } from "gzd";

const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space direction="vertical" size={12}>
    <DatePicker placeholder="Outlined" />
    <DatePicker placeholder="Filled" variant="filled" />
    <DatePicker placeholder="Borderless" variant="borderless" />
    <DatePicker placeholder="Underlined" variant="underlined" />
  </Space>
);

export default App;
```

### 弹出位置

可以通过 `placement` 手动指定弹出的位置。

```tsx
import React, { useState } from "react";
import type { DatePickerProps } from "gzd";
import type { RadioChangeEvent } from "antd";
import { DatePicker } from "gzd";
import { Radio } from "antd";

const { RangePicker } = DatePicker;

const App: React.FC = () => {
  const [placement, setPlacement] =
    useState<DatePickerProps["placement"]>("topLeft");

  const placementChange = (e: RadioChangeEvent) => {
    setPlacement(e.target.value);
  };

  return (
    <>
      <Radio.Group value={placement} onChange={placementChange}>
        <Radio.Button value="topLeft">topLeft</Radio.Button>
        <Radio.Button value="topRight">topRight</Radio.Button>
        <Radio.Button value="bottomLeft">bottomLeft</Radio.Button>
        <Radio.Button value="bottomRight">bottomRight</Radio.Button>
      </Radio.Group>
      <br />
      <br />
      <DatePicker placement={placement} />
      <br />
      <br />
      <RangePicker placement={placement} />
    </>
  );
};

export default App;
```

### 前后缀

可以通过 `prefix` 和 `suffixIcon` 属性自定义选择器的前后缀图标。

```tsx
import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { DatePicker, Space } from "gzd";
import type { Dayjs } from "dayjs";

const smileIcon = <SmileOutlined />;
const { RangePicker } = DatePicker;

const onChange = (
  date: Dayjs | (Dayjs | null)[] | null,
  dateString: string | string[] | null,
) => {
  console.log(date, dateString);
};

const App: React.FC = () => (
  <Space vertical size={12}>
    <DatePicker suffixIcon={smileIcon} onChange={onChange} />
    <DatePicker suffixIcon={smileIcon} onChange={onChange} picker="month" />
    <RangePicker suffixIcon={smileIcon} onChange={onChange} />
    <DatePicker suffixIcon={smileIcon} onChange={onChange} picker="week" />
    <DatePicker suffixIcon="ab" onChange={onChange} />
    <DatePicker suffixIcon="ab" onChange={onChange} picker="month" />
    <RangePicker suffixIcon="ab" onChange={onChange} />
    <DatePicker suffixIcon="ab" onChange={onChange} picker="week" />
    <DatePicker prefix={smileIcon} onChange={onChange} picker="week" />
    <DatePicker prefix="Event Period" onChange={onChange} picker="week" />
    <RangePicker prefix={smileIcon} onChange={onChange} picker="week" />
    <RangePicker prefix="Event Period" onChange={onChange} picker="week" />
  </Space>
);

export default App;
```

## API

日期类组件包括以下五种形式。

- DatePicker
- DatePicker\[picker="month"]
- DatePicker\[picker="week"]
- DatePicker\[picker="year"]
- DatePicker\[picker="quarter"]
- RangePicker

以下 API 为 DatePicker、 RangePicker 共享的 API。

| 参数                  | 说明                                                                                  | 类型                                                                                                                                                                                                              | 默认值     |
| --------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| allowClear            | 自定义清除按钮                                                                        | boolean \| { clearIcon?: ReactNode }                                                                                                                                                                              | true       |
| className             | 选择器 className                                                                      | string                                                                                                                                                                                                            | -          |
| cellRender            | 自定义单元格的内容                                                                    | (current: dayjs, info: { originNode: React.ReactElement,today: DateType, range?: 'start' \| 'end', type: PanelMode, locale?: Locale, subType?: 'hour' \| 'minute' \| 'second' \| 'meridiem' }) => React.ReactNode | -          |
| components            | 自定义面板                                                                            | Record<Panel \| 'input', React.ComponentType>                                                                                                                                                                     | -          |
| defaultOpen           | 是否默认展开控制弹层                                                                  | boolean                                                                                                                                                                                                           | -          |
| disabled              | 禁用                                                                                  | boolean                                                                                                                                                                                                           | false      |
| disabledDate          | 不可选择的日期                                                                        | (currentDate: dayjs, info: { from?: dayjs, type: Picker }) => boolean                                                                                                                                             | -          |
| format                | 设置日期格式，为数组时支持多格式匹配，展示以第一个为准。                              | [formatType](#formattype)                                                                                                                                                                                         | -          |
| order                 | 多选、范围时是否自动排序                                                              | boolean                                                                                                                                                                                                           | true       |
| preserveInvalidOnBlur | 失去焦点是否要清空输入框内无效内容                                                    | boolean                                                                                                                                                                                                           | false      |
| getPopupContainer     | 定义浮层的容器，默认为 body 上新建 div                                                | function(trigger)                                                                                                                                                                                                 | -          |
| inputReadOnly         | 设置输入框为只读（避免在移动设备上打开虚拟键盘）                                      | boolean                                                                                                                                                                                                           | false      |
| locale                | 国际化配置                                                                            | object                                                                                                                                                                                                            | -          |
| minDate               | 最小日期，同样会限制面板的切换范围                                                    | dayjs                                                                                                                                                                                                             | -          |
| maxDate               | 最大日期，同样会限制面板的切换范围                                                    | dayjs                                                                                                                                                                                                             | -          |
| mode                  | 日期面板的状态                                                                        | `time` \| `date` \| `month` \| `year` \| `decade`                                                                                                                                                                 | -          |
| needConfirm           | 是否需要确认按钮，为 `false` 时失去焦点即代表选择。当设置 `multiple` 时默认为 `false` | boolean                                                                                                                                                                                                           | -          |
| nextIcon              | 自定义下一个图标                                                                      | ReactNode                                                                                                                                                                                                         | -          |
| open                  | 控制弹层是否展开                                                                      | boolean                                                                                                                                                                                                           | -          |
| panelRender           | 自定义渲染面板                                                                        | (panelNode) => ReactNode                                                                                                                                                                                          | -          |
| picker                | 设置选择器类型                                                                        | `date` \| `week` \| `month` \| `quarter` \| `year`                                                                                                                                                                | `date`     |
| placeholder           | 输入框提示文字                                                                        | string \| \[string, string]                                                                                                                                                                                       | -          |
| placement             | 选择框弹出的位置                                                                      | `bottomLeft` `bottomRight` `topLeft` `topRight`                                                                                                                                                                   | bottomLeft |
| prefix                | 自定义前缀                                                                            | ReactNode                                                                                                                                                                                                         | -          |
| prevIcon              | 自定义上一个图标                                                                      | ReactNode                                                                                                                                                                                                         | -          |
| previewValue          | 当用户选择日期悬停选项时，输入字段的值会发生临时更改                                  | false \| hover                                                                                                                                                                                                    | hover      |
| presets               | 预设时间范围快捷选择, 支持函数返回值                                                  | { label: React.ReactNode, value: Dayjs \| (() => Dayjs) }\[]                                                                                                                                                      | -          |
| size                  | 输入框大小，`large` 高度为 40px，`small` 为 24px，默认是 32px                         | `large` \| `medium` \| `small`                                                                                                                                                                                    | -          |
| status                | 设置校验状态                                                                          | 'error' \| 'warning'                                                                                                                                                                                              | -          |
| style                 | 自定义输入框样式                                                                      | CSSProperties                                                                                                                                                                                                     | {}         |
| suffixIcon            | 自定义的选择框后缀图标                                                                | ReactNode                                                                                                                                                                                                         | -          |
| superNextIcon         | 自定义 `>>` 切换图标                                                                  | ReactNode                                                                                                                                                                                                         | -          |
| superPrevIcon         | 自定义 `<<` 切换图标                                                                  | ReactNode                                                                                                                                                                                                         | -          |
| variant               | 形态变体                                                                              | `outlined` \| `borderless` \| `filled` \| `underlined`                                                                                                                                                            | `outlined` |
| onOpenChange          | 弹出日历和关闭日历的回调                                                              | function(open)                                                                                                                                                                                                    | -          |
| onPanelChange         | 日历面板切换的回调                                                                    | function(value, mode)                                                                                                                                                                                             | -          |

### 共同的方法

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

### DatePicker

| 参数                      | 说明                                                                               | 类型                                                      | 默认值       |
| ------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------ |
| defaultPickerValue        | 默认面板日期，每次面板打开时会被重置到该日期                                       | dayjs                                                     | -            |
| defaultValue              | 默认日期，如果开始时间或结束时间为 `null` 或者 `undefined`，日期范围将是一个开区间 | dayjs                                                     | -            |
| disabledTime              | 不可选择的时间                                                                     | function(date)                                            | -            |
| format                    | 展示的日期格式                                                                     | [formatType](#formattype)                                 | `YYYY-MM-DD` |
| multiple                  | 是否为多选，不支持 `showTime`                                                      | boolean                                                   | false        |
| pickerValue               | 面板日期，可以用于受控切换面板所在日期。配合 `onPanelChange` 使用。                | dayjs                                                     | -            |
| renderExtraFooter         | 在面板中添加额外的页脚                                                             | (mode) => React.ReactNode                                 | -            |
| showNow                   | 显示当前日期时间的快捷选择                                                         | boolean                                                   | -            |
| showTime                  | 增加时间选择功能                                                                   | Object \| boolean                                         | -            |
| showTime.defaultOpenValue | 设置用户选择日期时默认的时分秒                                                     | dayjs                                                     | dayjs()      |
| showWeek                  | DatePicker 下展示当前周                                                            | boolean                                                   | false        |
| value                     | 日期                                                                               | dayjs                                                     | -            |
| onChange                  | 时间发生变化的回调                                                                 | function(date: dayjs \| null, dateString: string \| null) | -            |
| onOk                      | 点击确定按钮的回调                                                                 | function()                                                | -            |
| onPanelChange             | 日期面板变化时的回调                                                               | function(value, mode)                                     | -            |

### DatePicker\[picker=year]

| 参数              | 说明                                     | 类型                                                      | 默认值 |
| ----------------- | ---------------------------------------- | --------------------------------------------------------- | ------ |
| defaultValue      | 默认日期                                 | dayjs                                                     | -      |
| format            | 展示的日期格式                           | [formatType](#formattype)                                 | `YYYY` |
| multiple          | 是否为多选                               | boolean                                                   | false  |
| renderExtraFooter | 在面板中添加额外的页脚                   | () => React.ReactNode                                     | -      |
| value             | 日期                                     | dayjs                                                     | -      |
| onChange          | 时间发生变化的回调，发生在用户选择时间时 | function(date: dayjs \| null, dateString: string \| null) | -      |

### DatePicker\[picker=quarter]

| 参数              | 说明                                     | 类型                                                      | 默认值     |
| ----------------- | ---------------------------------------- | --------------------------------------------------------- | ---------- |
| defaultValue      | 默认日期                                 | dayjs                                                     | -          |
| format            | 展示的日期格式                           | [formatType](#formattype)                                 | `YYYY-\QQ` |
| multiple          | 是否为多选                               | boolean                                                   | false      |
| renderExtraFooter | 在面板中添加额外的页脚                   | () => React.ReactNode                                     | -          |
| value             | 日期                                     | dayjs                                                     | -          |
| onChange          | 时间发生变化的回调，发生在用户选择时间时 | function(date: dayjs \| null, dateString: string \| null) | -          |

### DatePicker\[picker=month]

| 参数              | 说明                                     | 类型                                                      | 默认值    |
| ----------------- | ---------------------------------------- | --------------------------------------------------------- | --------- |
| defaultValue      | 默认日期                                 | dayjs                                                     | -         |
| format            | 展示的日期格式                           | [formatType](#formattype)                                 | `YYYY-MM` |
| multiple          | 是否为多选                               | boolean                                                   | false     |
| renderExtraFooter | 在面板中添加额外的页脚                   | () => React.ReactNode                                     | -         |
| value             | 日期                                     | dayjs                                                     | -         |
| onChange          | 时间发生变化的回调，发生在用户选择时间时 | function(date: dayjs \| null, dateString: string \| null) | -         |

### DatePicker\[picker=week]

| 参数              | 说明                                     | 类型                                                      | 默认值    |
| ----------------- | ---------------------------------------- | --------------------------------------------------------- | --------- |
| defaultValue      | 默认日期                                 | dayjs                                                     | -         |
| format            | 展示的日期格式                           | [formatType](#formattype)                                 | `YYYY-wo` |
| multiple          | 是否为多选                               | boolean                                                   | false     |
| renderExtraFooter | 在面板中添加额外的页脚                   | (mode) => React.ReactNode                                 | -         |
| value             | 日期                                     | dayjs                                                     | -         |
| onChange          | 时间发生变化的回调，发生在用户选择时间时 | function(date: dayjs \| null, dateString: string \| null) | -         |
| showWeek          | DatePicker 下展示当前周                  | boolean                                                   | true      |

### RangePicker

| 参数                      | 说明                                                                | 类型                                                                                                                                                                                                              | 默认值                  |
| ------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| allowEmpty                | 允许起始项部分为空                                                  | \[boolean, boolean]                                                                                                                                                                                               | \[false, false]         |
| cellRender                | 自定义单元格的内容。                                                | (current: dayjs, info: { originNode: React.ReactElement,today: DateType, range?: 'start' \| 'end', type: PanelMode, locale?: Locale, subType?: 'hour' \| 'minute' \| 'second' \| 'meridiem' }) => React.ReactNode | -                       |
| defaultPickerValue        | 默认面板日期，每次面板打开时会被重置到该日期                        | dayjs\[]                                                                                                                                                                                                          | -                       |
| defaultValue              | 默认日期                                                            | dayjs\[]                                                                                                                                                                                                          | -                       |
| disabled                  | 禁用起始项                                                          | \[boolean, boolean]                                                                                                                                                                                               | -                       |
| disabledTime              | 不可选择的时间                                                      | function(date: dayjs, partial: `start` \| `end`, info: { from?: dayjs })                                                                                                                                          | -                       |
| format                    | 展示的日期格式                                                      | [formatType](#formattype)                                                                                                                                                                                         | `YYYY-MM-DD HH:mm:ss`   |
| id                        | 设置输入框 `id` 属性。                                              | { start?: string, end?: string }                                                                                                                                                                                  | -                       |
| pickerValue               | 面板日期，可以用于受控切换面板所在日期。配合 `onPanelChange` 使用。 | dayjs\[]                                                                                                                                                                                                          | -                       |
| presets                   | 预设时间范围快捷选择                                                | { label: React.ReactNode, value: (Dayjs \| (() => Dayjs))\[] }\[]                                                                                                                                                 | -                       |
| renderExtraFooter         | 在面板中添加额外的页脚                                              | () => React.ReactNode                                                                                                                                                                                             | -                       |
| separator                 | 设置分隔符                                                          | React.ReactNode                                                                                                                                                                                                   | `<SwapRightOutlined />` |
| showTime                  | 增加时间选择功能                                                    | Object\|boolean                                                                                                                                                                                                   | -                       |
| showTime.defaultOpenValue | 设置用户选择日期时默认的时分秒                                      | dayjs\[]                                                                                                                                                                                                          | \[dayjs(), dayjs()]     |
| value                     | 日期                                                                | dayjs\[]                                                                                                                                                                                                          | -                       |
| onCalendarChange          | 待选日期发生变化的回调                                              | function(dates: \[dayjs, dayjs], dateStrings: \[string, string], info: { range:`start`\|`end` })                                                                                                                  | -                       |
| onChange                  | 日期范围发生变化的回调                                              | function(dates: \[dayjs, dayjs] \| null, dateStrings: \[string, string] \| null)                                                                                                                                  | -                       |
| onFocus                   | 聚焦时回调                                                          | function(event, { range: 'start' \| 'end' })                                                                                                                                                                      | -                       |
| onBlur                    | 失焦时回调                                                          | function(event, { range: 'start' \| 'end' })                                                                                                                                                                      | -                       |

#### formatType

```typescript
import type { Dayjs } from "dayjs";

type Generic = string;
type GenericFn = (value: Dayjs) => string;

export type FormatType =
  | Generic
  | GenericFn
  | Array<Generic | GenericFn>
  | {
      format: string;
      type?: "mask";
    };
```
