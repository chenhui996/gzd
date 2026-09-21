/**
 * description: 展示进度，当设置 `percent="auto"` 时会预估一个永远不会停止的进度条。
 */
import React from 'react';
import { Flex } from 'antd';
import { Spin, Switch } from 'gzd';

const App: React.FC = () => {
  const [auto, setAuto] = React.useState(false);
  const [percent, setPercent] = React.useState(-50);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(null);

  React.useEffect(() => {
    timerRef.current = setTimeout(() => {
      setPercent((v) => {
        const nextPercent = v + 5;
        return nextPercent > 150 ? -50 : nextPercent;
      });
    }, 100);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [percent]);

  const mergedPercent = auto ? 'auto' : percent;

  return (
    <Flex align="center" gap={16}>
      <Switch
        checkedChildren="Auto"
        unCheckedChildren="Auto"
        checked={auto}
        onChange={() => {
          setAuto(!auto);
          setPercent(-50);
        }}
      />
      <Spin percent={mergedPercent} size="small" />
      <Spin percent={mergedPercent} />
      <Spin percent={mergedPercent} size="large" />
    </Flex>
  );
};

export default App;