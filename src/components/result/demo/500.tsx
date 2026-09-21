/**
 * title: 500
 * description: 服务器发生了错误。
 */
import React from 'react';
import { Button, Result } from 'gzd';;

const App: React.FC = () => (
  <Result
    status="500"
    title="500"
    subTitle="Sorry, something went wrong."
    extra={<Button type="primary">Back Home</Button>}
  />
);

export default App;
