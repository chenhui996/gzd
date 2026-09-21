/**
 * description: 改变进度数值位置，可使用 percentPosition 调整，使进度条数值在进度条内部、外部或底部。
 */
import React from 'react';
import { Flex } from 'antd';
import { Progress } from 'gzd';

const App: React.FC = () => (
  <Flex gap="small" vertical>
    <Progress
      percent={0}
      percentPosition={{ align: 'center', type: 'inner' }}
      size={[200, 20]}
      strokeColor="#E6F4FF"
    />
    <Progress percent={10} percentPosition={{ align: 'center', type: 'inner' }} size={[300, 20]} />
    <Progress
      percent={50}
      percentPosition={{ align: 'start', type: 'inner' }}
      size={[300, 20]}
      strokeColor="#B7EB8F"
    />
    <Progress
      percent={60}
      percentPosition={{ align: 'end', type: 'inner' }}
      size={[300, 20]}
      strokeColor="#001342"
    />
    <Progress percent={100} percentPosition={{ align: 'center', type: 'inner' }} size={[400, 20]} />
    <Progress percent={60} percentPosition={{ align: 'start', type: 'outer' }} />
    <Progress percent={100} percentPosition={{ align: 'start', type: 'outer' }} />
    <Progress percent={60} percentPosition={{ align: 'center', type: 'outer' }} size="small" />
    <Progress percent={100} percentPosition={{ align: 'center', type: 'outer' }} />
  </Flex>
);

export default App;