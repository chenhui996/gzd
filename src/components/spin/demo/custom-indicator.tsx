/**
 * title: 自定义指示符
 * description: 使用自定义指示符。
 */
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'gzd';
import { Flex } from 'antd';;

const App: React.FC = () => (
  <Flex align="center" gap={16}>
    <Spin indicator={<LoadingOutlined spin />} size="small" />
    <Spin indicator={<LoadingOutlined spin />} />
    <Spin indicator={<LoadingOutlined spin />} size="large" />
    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
  </Flex>
);

export default App;
