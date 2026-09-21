---
group: 数据录入
title: TimePicker 时间选择框
---

# TimePicker 时间选择框

## 何时使用 {#when-to-use}

当用户需要输入一个时间，可以点击标准输入框，弹出时间面板进行选择。

## 代码演示

### 基本

点击 TimePicker，然后可以在浮层中选择或者输入某一时间。

```tsx
import React from 'react';
import type { TimePickerProps } from 'gzd';
import { TimePicker } from 'gzd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => (
  <TimePicker onChange={onChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
);

export default App;
```

### 受控组件

value 和 onChange 需要配合使用。

```tsx
import React, { useState } from 'react';
import { TimePicker } from 'gzd';
import type { Dayjs } from 'dayjs';

const App: React.FC = () => {
  const [value, setValue] = useState<Dayjs | null>(null);

  const onChange = (time: Dayjs | null) => {
    setValue(time);
  };

  return <TimePicker value={value} onChange={onChange} />;
};

export default App;
```

### 三种大小

三种大小的输入框，大的用在表单中，中的为默认。

```tsx
import React from 'react';
import { Space, TimePicker } from 'gzd';
import dayjs from 'dayjs';

const App: React.FC = () => (
  <Space wrap>
    <TimePicker defaultValue={dayjs('12:08:23', 'HH:mm:ss')} size="large" />
    <TimePicker defaultValue={dayjs('12:08:23', 'HH:mm:ss')} />
    <TimePicker defaultValue={dayjs('12:08:23', 'HH:mm:ss')} size="small" />
  </Space>
);

export default App;
```

### 选择确认

TimePicker 默认会根据 `picker` 的交互行为，自动选择是否需要确认按钮。你也可以通过 `needConfirm` 属性来手动设置是否需要确认按钮。当有 needConfirm 时，用户始终需要点击确认按钮才能完成选择。反之，则会在选择或者失去焦点时提交。

```tsx
import React from 'react';
import type { TimePickerProps } from 'gzd';
import { TimePicker } from 'gzd';

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => <TimePicker onChange={onChange} needConfirm />;

export default App;
```

### 禁用

禁用时间选择。

```tsx
import React from 'react';
import { TimePicker } from 'gzd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const App: React.FC = () => <TimePicker defaultValue={dayjs('12:08:23', 'HH:mm:ss')} disabled />;

export default App;
```

### 选择时分

TimePicker 浮层中的列会随着 `format` 变化，当略去 `format` 中的某部分时，浮层中对应的列也会消失。

```tsx
import React from 'react';
import { TimePicker } from 'gzd';
import dayjs from 'dayjs';

const format = 'HH:mm';

const App: React.FC = () => <TimePicker defaultValue={dayjs('12:08', format)} format={format} />;

export default App;
```

### 步长选项

可以使用 `hourStep` `minuteStep` `secondStep` 按步长展示可选的时分秒。

```tsx
import React from 'react';
import { TimePicker } from 'gzd';

const App: React.FC = () => <TimePicker minuteStep={15} secondStep={10} hourStep={1} />;

export default App;
```

### 附加内容

在 TimePicker 选择框底部显示自定义的内容。

```tsx
import React, { useState } from 'react';
import { Button, TimePicker } from 'gzd';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <TimePicker
      open={open}
      onOpenChange={setOpen}
      renderExtraFooter={() => (
        <Button size="small" type="primary" onClick={() => setOpen(false)}>
          OK
        </Button>
      )}
    />
  );
};

export default App;
```

### 12 小时制

12 小时制的时间选择器，默认的 format 为 `h:mm:ss a`。

```tsx
import React from 'react';
import type { TimePickerProps } from 'gzd';
import { Space, TimePicker } from 'gzd';

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => (
  <Space wrap>
    <TimePicker use12Hours onChange={onChange} />
    <TimePicker use12Hours format="h:mm:ss A" onChange={onChange} />
    <TimePicker use12Hours format="h:mm a" onChange={onChange} />
  </Space>
);

export default App;
```

### 滚动即改变

通过 `changeOnScroll` 与 `needConfirm` 使其滚动时改变数值。

```tsx
import React from 'react';
import type { TimePickerProps } from 'gzd';
import { TimePicker } from 'gzd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => <TimePicker onChange={onChange} changeOnScroll needConfirm={false} />;

export default App;
```

### 范围选择器

通过 `TimePicker.RangePicker` 使用时间范围选择器。

```tsx
import React from 'react';
import { TimePicker } from 'gzd';
import dayjs from 'dayjs';

const format = 'HH:mm:ss';

const App: React.FC = () => {
  const startTime = dayjs('12:08:23', 'HH:mm:ss');
  const endTime = dayjs('12:08:23', 'HH:mm:ss');

  return <TimePicker.RangePicker defaultValue={[startTime, endTime]} format={format} />;
};

export default App;
```

### 形态变体

TimePicker 形态变体，可选 `outlined` `filled` `borderless` `underlined` 四种形态。

```tsx
import React from 'react';
import { Flex } from 'antd';
import { TimePicker } from 'gzd';

const { RangePicker } = TimePicker;

const App: React.FC = () => (
  <Flex vertical gap={12}>
    <Flex gap={8}>
      <TimePicker placeholder="Outlined" />
      <RangePicker placeholder={['Outlined Start', 'Outlined End']} />
    </Flex>
    <Flex gap={8}>
      <TimePicker variant="filled" placeholder="Filled" />
      <RangePicker variant="filled" placeholder={['Filled Start', 'Filled End']} />
    </Flex>
    <Flex gap={8}>
      <TimePicker variant="borderless" placeholder="Borderless" />
      <RangePicker variant="borderless" placeholder={['Borderless Start', 'Borderless End']} />
    </Flex>
    <Flex gap={8}>
      <TimePicker variant="underlined" placeholder="Underlined" />
      <RangePicker variant="underlined" placeholder={['Underlined Start', 'Underlined End']} />
    </Flex>
  </Flex>
);

export default App;
```

### 自定义状态

使用 `status` 为 TimePicker 添加状态，可选 `error` 或者 `warning`。

```tsx
import React from 'react';
import { Space, TimePicker } from 'gzd';

const App: React.FC = () => (
  <Space vertical>
    <TimePicker status="error" />
    <TimePicker status="warning" />
    <TimePicker.RangePicker status="error" />
    <TimePicker.RangePicker status="warning" />
  </Space>
);

export default App;
```

### 前后缀

自定义前缀 `prefix` 和后缀图标 `suffixIcon`。

```tsx
import React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Space, TimePicker } from 'gzd';
import type { TimePickerProps } from 'gzd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const onChange: TimePickerProps['onChange'] = (time, timeString) => {
  console.log(time, timeString);
};

const App: React.FC = () => (
  <Space vertical size={12}>
    <TimePicker
      suffixIcon={<SmileOutlined />}
      onChange={onChange}
      defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
    />
    <TimePicker prefix={<SmileOutlined />} />
    <TimePicker.RangePicker prefix={<SmileOutlined />} />
  </Space>
);

export default App;
```



## API

---

通用属性参考：[通用属性](/react/common-props)

```
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)
<TimePicker defaultValue={dayjs('13:30:56', 'HH:mm:ss')} />;
```

| 参数 | 说明 | 类型 | 默认值 
| --- | --- | --- | --- |
| allowClear | 自定义清除按钮 | boolean \ | { clearIcon?: ReactNode } | true |
| cellRender | 自定义单元格的内容 | (current: number, info: { originNode: React.ReactNode, today: dayjs, range?: 'start' \ | 'end', subType: 'hour' \ | 'minute' \ | 'second' \ | 'meridiem' }) => React.ReactNode | - |
| changeOnScroll | 在滚动时改变选择值 | boolean | false |
| className | 选择器类名 | string | - |
| defaultValue | 默认时间 | [dayjs](http://day.js.org/) | - |
| disabled | 禁用全部操作 | boolean | false |
| disabledTime | 不可选择的时间 | [DisabledTime](#disabledtime) | - |
| format | 展示的时间格式 | string | `HH:mm:ss` |
| getPopupContainer | 定义浮层的容器，默认为 body 上新建 div | function(trigger) | - |
| hideDisabledOptions | 隐藏禁止选择的选项 | boolean | false |
| hourStep | 小时选项间隔 | number | 1 |
| inputReadOnly | 设置输入框为只读（避免在移动设备上打开虚拟键盘） | boolean | false |
| minuteStep | 分钟选项间隔 | number | 1 |
| needConfirm | 是否需要确认按钮，为 `false` 时失去焦点即代表选择 | boolean | - |
| open | 面板是否打开 | boolean | false |
| placeholder | 没有值的时候显示的内容 | string \ | \[string, string] | `请选择时间` |
| placement | 选择框弹出的位置 | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft |
| prefix | 自定义前缀 | ReactNode | - |
| previewValue | 当用户选择时间悬停选项时，输入字段的值会发生临��更改 | false \ | hover | hover |
| renderExtraFooter | 选择框底部显示自定义的内容 | () => ReactNode | - |
| secondStep | 秒选项间隔 | number | 1 |
| showNow | 面板是否显示“此刻”按钮 | boolean | - |
| size | 输入框大小，`large` 高度为 40px，`small` 为 24px，默认是 32px | `large` \ | `medium` \ | `small` | - |
| status | 设置校验状态 | 'error' \| 'warning' | - |
| suffixIcon | 自定义的选择框后缀图标 | ReactNode | - |
| use12Hours | 使用 12 小时制，为 true 时 `format` 默认为 `h:mm:ss a` | boolean | false |
| value | 当前时间 | [dayjs](http://day.js.org/) | - |
| variant | 形态变体 | `outlined` \ | `borderless` \ | `filled` \ | `underlined` | `outlined` | 5.13.0 \ |
| onCalendarChange | 待选日期发生变化的回调。`info` 参数自 4.4.0 添加 | function(dates: \[dayjs, dayjs], dateStrings: \[string, string], info: { range:`start`\ | `end` }) | - |
| onChange | 时间发生变化的回调 | function(time: dayjs, timeString: string): void | - |
| onOpenChange | 面板打开/关闭时的回调 | (open: boolean) => void | - |

#### DisabledTime

```
type DisabledTime = (now: Dayjs) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
  disabledMilliseconds?: (
    selectedHour: number,
    selectedMinute: number,
    selectedSecond: number,
  ) => number[];
};
```

注意：`disabledMilliseconds` 为 `5.14.0` 新增。

## 方法

| 名称    | 描述     
| ------- | -------- |
| blur()  | 移除焦点 |      |
| focus() | 获取焦点 |      |

## RangePicker

属性与 DatePicker 的 [RangePicker](/components/date-picker-cn#rangepicker) 相同。还包含以下属性：

| 参数         | 说明                 | 类型                                    | 默认值 
| ------------ | -------------------- | --------------------------------------- | ------ |
| disabledTime | 不可选择的时间 | [RangeDisabledTime](#rangedisabledtime) | - |
| order | 始末时间是否自动排序 | boolean | true |

### RangeDisabledTime

```
type RangeDisabledTime = (
  now: Dayjs,
  type = 'start' | 'end',
) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};
```
