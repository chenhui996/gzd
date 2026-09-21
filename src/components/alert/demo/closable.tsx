/**
 * title: 可关闭的警告提示
 * description: 显示关闭按钮，点击可关闭警告提示。
 */
import React from 'react';
import { Alert } from 'gzd';;

const onClose: React.MouseEventHandler<HTMLButtonElement> = (e) => {
  console.log(e, 'I was closed.');
};

const App: React.FC = () => (
  <>
    <Alert
      title="Warning Title"
      type="warning"
      closable={{ closeIcon: true, onClose, 'aria-label': 'close' }}
    />
    <br />
    <Alert
      title="Success Title"
      type="success"
      closable={{ closeIcon: true, onClose, 'aria-label': 'close' }}
    />
    <br />
    <Alert
      title="Info Title"
      type="info"
      closable={{ closeIcon: true, onClose, 'aria-label': 'close' }}
    />
    <br />
    <Alert
      title="Error Title"
      type="error"
      closable={{ closeIcon: true, onClose, 'aria-label': 'close' }}
    />
  </>
);

export default App;
