/**
 * title: 基本
 * description: 最简单的用法，支持确认标题和描述。<br /><br />> `description` 在 `5.1.0` 版本中支持。
 */
import React from 'react';
import type { PopconfirmProps } from 'antd';
import { Button, message, Popconfirm } from 'gzd';;

const App: React.FC = () => {
  const [messageApi, holder] = message.useMessage();

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    console.log(e);
    messageApi.success('Click on Yes');
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
    messageApi.error('Click on No');
  };

  return (
    <>
      {holder}
      <Popconfirm
        title="Delete the task"
        description="Are you sure to delete this task?"
        onConfirm={confirm}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Button danger>Delete</Button>
      </Popconfirm>
    </>
  );
};

export default App;
