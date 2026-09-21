/**
 * title: 自定义预览图片
 * description: 可以设置不同的预览图片。
 */
import React from 'react';
import { Image } from 'gzd';;

const App: React.FC = () => (
  <Image
    width={200}
    alt="basic image"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
    preview={{
      src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }}
  />
);

export default App;
