/**
 * title: 修改延时
 * description: 自定义时长 `10s`，默认时长为 `3s`。
 */
import React from 'react';
import { Button, message } from 'gzd';;

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'This is a prompt message for success, and it will disappear in 10 seconds',
      duration: 10,
    });
  };

  return (
    <>
      {contextHolder}
      <Button onClick={success}>Customized display duration</Button>
    </>
  );
};

export default App;
