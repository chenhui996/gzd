/**
 * title: 贴边偏移
 * description: 当 Popconfirm 贴边时，自动偏移并且调整箭头位置。当超出过多时，则一同滚出屏幕。
 * iframe: 300
 */
import React from 'react';
import { Button, Popconfirm } from 'gzd';;

const style: React.CSSProperties = {
  width: '300vw',
  height: '300vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const App: React.FC = () => {
  React.useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);
  return (
    <div style={style}>
      <Popconfirm title="Thanks for using antd. Have a nice day !" open>
        <Button type="primary">Scroll The Window</Button>
      </Popconfirm>
    </div>
  );
};

export default App;
