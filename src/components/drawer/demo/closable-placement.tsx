/**
 * description: 自定义抽屉的关闭按钮位置，放到右侧，默认为左侧。
 */
import React, { useState } from 'react';
import { Button, Drawer } from 'antd';

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
        title="Drawer Closable Placement"
        closable={{ placement: 'end' }}
        onClose={onClose}
        open={open}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Take a look at the top-right corner...</p>
      </Drawer>
    </>
  );
};

export default App;