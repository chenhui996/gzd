/**
 * title: 轮播的公告
 * description: 配合 [react-text-loop-next](https://npmjs.com/package/react-text-loop-next) 或 [react-fast-marquee](https://npmjs.com/package/react-fast-marquee) 实现消息轮播通知栏。
 */
import React from 'react';
import { Alert } from 'gzd';;
import Marquee from 'react-fast-marquee';

const App: React.FC = () => (
  <Alert
    banner
    title={
      <Marquee pauseOnHover gradient={false}>
        I can be a React component, multiple React components, or just some text.
      </Marquee>
    }
  />
);

export default App;
