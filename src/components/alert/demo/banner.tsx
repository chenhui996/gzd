/**
 * title: 顶部公告
 * description: 页面顶部通告形式，默认有图标且 `type` 为 'warning'。
 * iframe: 250
 */
import React from 'react';
import { Alert } from 'gzd';;

const App: React.FC = () => (
  <>
    <Alert title="Warning text" banner />
    <br />
    <Alert
      title="Very long warning text warning text text text text text text text"
      banner
      closable
    />
    <br />
    <Alert showIcon={false} title="Warning text without icon" banner />
    <br />
    <Alert type="error" title="Error text" banner />
  </>
);

export default App;
