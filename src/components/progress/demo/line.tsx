/**
 * title: 进度条
 * description: 标准的进度条。
 */
import React from 'react';
import { Progress } from 'gzd';
import { Flex } from 'antd';;

const App: React.FC = () => (
  <Flex gap="small" vertical>
    <Progress percent={30} />
    <Progress percent={50} status="active" />
    <Progress percent={70} status="exception" />
    <Progress percent={100} />
    <Progress percent={50} showInfo={false} />
  </Flex>
);

export default App;
