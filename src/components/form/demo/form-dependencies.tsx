/**
 * title: 校验与更新依赖
 * description: Form.Item 可以通过 `dependencies` 属性，设置关联字段。当关联字段的值发生变化时，会触发校验与更新。
 */

import React from 'react';
import { Typography } from "antd";
import { Alert, Form, Input } from "gzd";

const App: React.FC = () => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      name="dependenciesDemo"
      autoComplete="off"
      style={{ maxWidth: 600 }}
      layout="vertical"
    >
      <Alert title=" Try modify `Password2` and then modify `Password`" type="info" showIcon />

      <Form.Item label="Password" name="password" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      {/* Field */}
      <Form.Item
        label="Confirm Password"
        name="password2"
        dependencies={['password']}
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>

      {/* Render Props */}
      <Form.Item noStyle dependencies={['password2']}>
        {() => (
          <Typography>
            <p>
              Only Update when <code>password2</code> updated:
            </p>
            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
          </Typography>
        )}
      </Form.Item>
    </Form>
  );
};

export default App;
