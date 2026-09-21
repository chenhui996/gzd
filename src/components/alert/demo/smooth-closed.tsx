/**
 * title: 平滑地卸载
 * description: 平滑、自然的卸载提示。
 */
import React, { useState } from 'react';
import { Alert, Switch } from 'gzd';;

const App: React.FC = () => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
      {visible && (
        <Alert
          title="Alert Message Text"
          type="success"
          closable={{ closeIcon: true, afterClose: handleClose }}
        />
      )}
      <p>click the close button to see the effect</p>
      <Switch onChange={setVisible} checked={visible} disabled={visible} />
    </>
  );
};

export default App;
