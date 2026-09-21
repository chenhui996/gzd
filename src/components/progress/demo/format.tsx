/**
 * title: 自定义文字格式
 * description: `format` 属性指定格式。
 */
import React from 'react';
import { Progress } from 'gzd';
import { Flex } from 'antd';;

const App: React.FC = () => (
  <Flex gap="small" wrap>
    <Progress type="circle" percent={75} format={(percent) => `${percent} Days`} />
    <Progress type="circle" percent={100} format={() => 'Done'} />
  </Flex>
);

export default App;
