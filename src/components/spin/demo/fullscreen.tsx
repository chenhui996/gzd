/**
 * description: 属性 `fullscreen` 非常适合创建流畅的页面加载器。它添加了半透明覆盖层，并在其中心放置了一个旋转加载符号。
 */
import React from 'react';
import { Button, Spin } from 'gzd';

const App: React.FC = () => {
  const [spinning, setSpinning] = React.useState(false);
  const [percent, setPercent] = React.useState(0);

  const showLoader = () => {
    setSpinning(true);
    let ptg = -10;

    const interval = setInterval(() => {
      ptg += 5;
      setPercent(ptg);

      if (ptg > 120) {
        clearInterval(interval);
        setSpinning(false);
        setPercent(0);
      }
    }, 100);
  };

  return (
    <>
      <Button onClick={showLoader}>Show fullscreen</Button>
      <Spin spinning={spinning} percent={percent} fullscreen />
    </>
  );
};

export default App;
