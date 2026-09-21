/**
 * title: Info
 * description: 展示处理结果。
 */
import React from 'react';
import { Button, Result } from 'gzd';;

const App: React.FC = () => (
  <Result
    title="Your operation has been executed"
    extra={
      <Button type="primary" key="console">
        Go Console
      </Button>
    }
  />
);

export default App;
