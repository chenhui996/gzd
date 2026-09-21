/**
 * title: 自定义预览内容
 * description: 可以自定义预览内容。
 */
import React from 'react';
import { Image } from 'gzd';;

const App: React.FC = () => (
  <Image
    width={200}
    alt="basic image"
    preview={{
      imageRender: () => (
        <video
          muted
          width="100%"
          controls
          src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*uYT7SZwhJnUAAAAAAAAAAAAADgCCAQ"
        />
      ),
      actionsRender: () => null,
    }}
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
  />
);

export default App;
