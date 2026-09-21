/**
 * title: 遮罩
 * description: 遮罩效果。
 */
import React from 'react';
import { Button, Modal, Space } from 'gzd';;

const modalConfig = {
  title: 'Title',
  content: 'Some contents...',
};

const App: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();

  return (
    <>
      <Space>
        <Button
          onClick={() => {
            modal.confirm({ ...modalConfig, mask: { blur: true } });
          }}
        >
          blur
        </Button>
        <Button
          onClick={() => {
            modal.confirm(modalConfig);
          }}
        >
          Dimmed mask
        </Button>
        <Button
          onClick={() => {
            modal.confirm({ ...modalConfig, mask: false });
          }}
        >
          No mask
        </Button>
      </Space>

      {contextHolder}
    </>
  );
};

export default App;
