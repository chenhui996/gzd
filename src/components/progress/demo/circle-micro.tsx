/**
 * title: 响应式进度圈
 * description: 响应式的圈形进度，当 `width` 小于等于 20 的时候，进度信息将不会显示在进度圈里面，而是以 Tooltip 的形式显示。
 */
import React from 'react';
import { Progress } from 'gzd';
import { Flex } from 'antd';;

const App: React.FC = () => (
  <Flex align="center" gap="small">
    <Progress
      type="circle"
      railColor="#e6f4ff"
      percent={60}
      strokeWidth={20}
      size={14}
      format={(number) => `进行中，已完成${number}%`}
    />
    <span>代码发布</span>
  </Flex>
);

export default App;
