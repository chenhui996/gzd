/**
 * description: 显示自动关闭通知框的进度条。
 */
import React from 'react';
import { Button, notification, Space } from 'gzd';

const App: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (pauseOnHover: boolean) => () => {
    api.open({
      title: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      showProgress: true,
      pauseOnHover,
    });
  };

  return (
    <>
      {contextHolder}
      <Space>
        <Button type="primary" onClick={openNotification(true)}>
          Pause on hover
        </Button>
        <Button type="primary" onClick={openNotification(false)}>
          Don&apos;t pause on hover
        </Button>
      </Space>
    </>
  );
};

export default App;