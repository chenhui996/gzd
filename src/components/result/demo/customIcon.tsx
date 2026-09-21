/**
 * title: 自定义 icon
 * description: 自定义 icon。
 */
import React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Result } from 'gzd';;

const App: React.FC = () => (
  <Result
    icon={<SmileOutlined />}
    title="Great, we have done all the operations!"
    extra={<Button type="primary">Next</Button>}
  />
);

export default App;
