/**
 * title: 字段监听 Hooks
 * description: `useWatch` 允许你监听字段变化，同时仅当该字段变化时重新渲染。API 文档请[查阅此处](#formusewatch)。
 */

import React from 'react';
import { Typography } from "antd";
import { Form, Input } from "gzd";
import { InputNumber } from 'antd';;

const Demo: React.FC = () => {
  const [form] = Form.useForm<{ name: string; age: number }>();
  const nameValue = Form.useWatch('name', form);
  // The selector is static and does not support closures.
  const customValue = Form.useWatch((values) => `name: ${values.name || ''}`, form);

  return (
    <>
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item name="name" label="Name (Watch to trigger rerender)">
          <Input />
        </Form.Item>
        <Form.Item name="age" label="Age (Not Watch)">
          <InputNumber />
        </Form.Item>
      </Form>

      <Typography>
        <pre>Name Value: {nameValue}</pre>
        <pre>Custom Value: {customValue}</pre>
      </Typography>
    </>
  );
};

export default Demo;
