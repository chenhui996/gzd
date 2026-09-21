/**
 * title: 基础抽屉
 * description: 基础抽屉，点击触发按钮抽屉从右滑出，点击遮罩区关闭。
 */
import React, { useState } from 'react';
import { Button, Drawer } from 'gzd';;

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Drawer
        title="Basic Drawer"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        open={open}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
};

export default App;
