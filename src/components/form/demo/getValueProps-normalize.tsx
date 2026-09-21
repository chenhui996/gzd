/**
 * title: getValueProps + normalize
 * description: 配合 `getValueProps` 和 `normalize`，可以转换 `value` 的格式，如将时间戳转成 `dayjs` 对象再传给 `DatePicker`。
 */

import React from 'react';
import type { FormProps } from 'antd';
import { Button, Form } from 'gzd';
import { DatePicker } from 'antd';;
import dayjs from 'dayjs';

const dateTimestamp = dayjs('2024-01-01').valueOf();

type FieldType = {
  date?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values);
};

const App: React.FC = () => (
  <Form
    name="getValueProps"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ date: dateTimestamp }}
    onFinish={onFinish}
    autoComplete="off"
  >
    <Form.Item<FieldType>
      label="Date"
      name="date"
      rules={[{ required: true }]}
      getValueProps={(value) => ({ value: value && dayjs(Number(value)) })}
      normalize={(value) => value && `${dayjs(value).valueOf()}`}
    >
      <DatePicker />
    </Form.Item>

    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

export default App;
