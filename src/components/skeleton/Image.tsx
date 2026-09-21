import React from 'react';
import { Skeleton as AntdSkeleton } from 'antd';
import type { SkeletonImageProps as AntdSkeletonImageProps } from 'antd/es/skeleton/Image';

export interface GZDSkeletonImageProps extends AntdSkeletonImageProps {}

const SkeletonImage: React.FC<GZDSkeletonImageProps> = (props) => {
  return <AntdSkeleton.Image {...props} />;
};

SkeletonImage.displayName = 'GZDSkeletonImage';

export default SkeletonImage;
