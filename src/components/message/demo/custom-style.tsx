/**
 * title: 自定义样式
 * description: 使用 `style` 和 `className` 来定义样式。
 */
import React from 'react';
import { Button, message } from 'gzd';;

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'This is a prompt message with custom className and style',
      className: 'custom-class',
      style: {
        marginTop: '20vh',
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Button onClick={success}>Customized style</Button>
    </>
  );
};

export default App;
