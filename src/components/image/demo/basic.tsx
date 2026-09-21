/**
 * title: 基本用法
 * description: 单击图像可以放大显示。
 */
import React from 'react';
import { Image } from 'gzd';;

const App: React.FC = () => (
  <Image
    width={200}
    alt="basic"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
  />
);

export default App;
