/**
 * title: 各种大小
 * description: 小的用于文本加载，默认用于卡片容器级加载，大的用于**页面级**加载。
 */
import React from 'react';
import { Spin } from 'gzd';
import { Flex } from 'antd';;

const App: React.FC = () => (
  <Flex align="center" gap={16}>
    <Spin size="small" />
    <Spin />
    <Spin size="large" />
  </Flex>
);

export default App;
