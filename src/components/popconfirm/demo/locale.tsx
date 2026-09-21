/**
 * title: 国际化
 * description: 使用 `okText` 和 `cancelText` 自定义按钮文字。
 */
import React from 'react';
import { Button, Popconfirm } from 'gzd';;

const App: React.FC = () => (
  <Popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    okText="Yes"
    cancelText="No"
  >
    <Button danger>Delete</Button>
  </Popconfirm>
);

export default App;
