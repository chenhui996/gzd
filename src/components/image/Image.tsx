import React from 'react';
import { Image as AntdImage } from 'antd';
import type { ImageProps as AntdImageProps } from 'antd';

export interface GZDImageProps extends AntdImageProps {}

// According to Antd's type definition, Image doesn't inherently accept a ref property in TS
const Image: React.FC<GZDImageProps> = (props) => {
  return <AntdImage {...props} />;
};

Image.displayName = 'GZDImage';

export default Image;
