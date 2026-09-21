/**
 * description: 步骤进度圈，支持颜色分段展示，默认间隔为 2px。
 */
import React from 'react';
import { Flex, Slider, Typography } from 'antd';
import { Progress } from 'gzd';

const App: React.FC = () => {
  const [stepsCount, setStepsCount] = React.useState<number>(5);
  const [stepsGap, setStepsGap] = React.useState<number>(7);
  return (
    <>
      <Typography.Title level={5}>Custom count:</Typography.Title>
      <Slider min={2} max={10} value={stepsCount} onChange={setStepsCount} />
      <Typography.Title level={5}>Custom gap:</Typography.Title>
      <Slider step={4} min={0} max={40} value={stepsGap} onChange={setStepsGap} />
      <Flex wrap gap={16} style={{ marginTop: 16 }}>
        <Progress
          type="dashboard"
          steps={8}
          percent={50}
          railColor="rgba(0, 0, 0, 0.06)"
          strokeWidth={20}
        />
        <Progress
          type="circle"
          percent={100}
          steps={{ count: stepsCount, gap: stepsGap }}
          railColor="rgba(0, 0, 0, 0.06)"
          strokeWidth={20}
        />
      </Flex>
    </>
  );
};

export default App;