/**
 * title: 边缘形状
 * description: 通过设定 `strokeLinecap="butt"` 可以将进度条边缘的形状从闭合的圆形的圆弧调整为断口，详见 [stroke-linecap](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap)。
 */
import React from 'react';
import { Progress } from 'gzd';
import { Flex } from 'antd';;

const App: React.FC = () => (
  <Flex vertical gap="small">
    <Progress strokeLinecap="butt" percent={75} />
    <Flex wrap gap="small">
      <Progress strokeLinecap="butt" type="circle" percent={75} />
      <Progress strokeLinecap="butt" type="dashboard" percent={75} />
    </Flex>
  </Flex>
);

export default App;
