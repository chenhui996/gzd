/**
 * title: 自定义 Icon 图标
 * description: 自定义提示 `icon`。
 */
import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'gzd';;

const App: React.FC = () => (
  <Popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
  >
    <Button danger>Delete</Button>
  </Popconfirm>
);

export default App;
