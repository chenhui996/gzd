/**
 * title: 四种样式
 * description: 共有四种样式 `success`、`info`、`warning`、`error`。
 */
import React from 'react';
import { Alert } from 'gzd';;

const App: React.FC = () => (
  <>
    <Alert title="Success Text" type="success" />
    <br />
    <Alert title="Info Text" type="info" />
    <br />
    <Alert title="Warning Text" type="warning" />
    <br />
    <Alert title="Error Text" type="error" />
  </>
);

export default App;
