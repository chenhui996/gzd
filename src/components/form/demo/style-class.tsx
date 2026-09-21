/**
 * title: 自定义语义结构的样式和类
 * description: 通过 `classNames` 和 `styles` 传入对象/函数可以自定义 Form 的[语义化结构](#semantic-dom)样式。
 */

import React from 'react';
import { Button, Form, Input, Space } from 'gzd';;
import type { FormProps } from 'antd';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  root: {
    padding: token.padding,
    maxWidth: 800,
    marginTop: 32,
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadius,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
}));

const stylesObject: FormProps['styles'] = {
  label: {
    textAlign: 'end',
    color: '#333',
    fontWeight: 500,
  },
  content: {
    paddingInlineStart: 12,
  },
};

const stylesFunction: FormProps['styles'] = (info) => {
  if (info.props.variant === 'filled') {
    return {
      root: {
        border: '1px solid #1677FF',
      },
      label: {
        textAlign: 'end',
        color: '#1677FF',
      },
      content: {
        paddingInlineStart: 12,
      },
    } satisfies FormProps['styles'];
  }
  return {};
};

const App: React.FC = () => {
  const { styles: classNames } = useStyles();

  const sharedProps: FormProps = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
    autoComplete: 'off',
    classNames,
  };

  const sharedFormContent = (
    <>
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please enter username!' }]}
      >
        <Input placeholder="Please enter username" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please enter email!' }]}
      >
        <Input placeholder="Please enter email" />
      </Form.Item>

      <Form.Item label={null}>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="reset">reset</Button>
        </Space>
      </Form.Item>
    </>
  );

  return (
    <>
      <Form {...sharedProps} styles={stylesObject}>
        {sharedFormContent}
      </Form>
      <Form {...sharedProps} styles={stylesFunction} variant="filled">
        {sharedFormContent}
      </Form>
    </>
  );
};

export default App;
