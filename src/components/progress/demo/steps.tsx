/**
 * title: 步骤进度条
 * description: 带步骤的进度条。
 */
import React from 'react';
import { green, red } from '@ant-design/colors';
import { Progress } from 'gzd';
import { Flex } from 'antd';;

const App: React.FC = () => (
  <Flex gap="small" vertical>
    <Progress percent={50} steps={3} />
    <Progress percent={30} steps={5} />
    <Progress percent={100} steps={5} size="small" strokeColor={green[6]} />
    <Progress percent={60} steps={5} strokeColor={[green[6], green[6], red[5]]} />
  </Flex>
);

export default App;
