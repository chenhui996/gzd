/**
 * title: 分段进度条
 * description: 分段展示进度，可以用于细化进度语义。
 */
import React from 'react';
import { Progress, Tooltip } from 'gzd';
import { Flex } from 'antd';;

const App: React.FC = () => (
  <Flex gap="small" vertical>
    <Tooltip title="3 done / 3 in progress / 4 to do">
      <Progress percent={60} success={{ percent: 30 }} />
    </Tooltip>
    <Flex gap="small" wrap>
      <Tooltip title="3 done / 3 in progress / 4 to do">
        <Progress percent={60} success={{ percent: 30 }} type="circle" />
      </Tooltip>
      <Tooltip title="3 done / 3 in progress / 4 to do">
        <Progress percent={60} success={{ percent: 30 }} type="dashboard" />
      </Tooltip>
    </Flex>
  </Flex>
);

export default App;
