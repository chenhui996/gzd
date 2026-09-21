/**
 * title: 基于 Promise 的异步关闭
 * description: 点击确定后异步关闭 Popconfirm，例如提交表单。
 */
import React from 'react';
import { Button, Popconfirm } from 'gzd';;

const App: React.FC = () => {
  const confirm = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(null), 3000);
    });

  return (
    <Popconfirm
      title="Title"
      description="Open Popconfirm with Promise"
      onConfirm={confirm}
      onOpenChange={() => console.log('open change')}
    >
      <Button type="primary">Open Popconfirm with Promise</Button>
    </Popconfirm>
  );
};

export default App;
