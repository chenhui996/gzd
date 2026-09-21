/**
 * title: 多层抽屉
 * description: 在抽屉内打开新的抽屉，用以解决多分支任务的复杂状况。
 */
import React, { useState } from 'react';
import { Button, Drawer } from 'gzd';;

const App: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [childrenDrawer, setChildrenDrawer] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Open drawer
      </Button>
      <Drawer title="Multi-level drawer" size={520} closable={false} onClose={onClose} open={open}>
        <Button type="primary" onClick={showChildrenDrawer}>
          Two-level drawer
        </Button>
        <Drawer
          title="Two-level Drawer"
          size={320}
          closable={false}
          onClose={onChildrenDrawerClose}
          open={childrenDrawer}
        >
          This is two-level drawer
        </Drawer>
      </Drawer>
    </>
  );
};

export default App;
