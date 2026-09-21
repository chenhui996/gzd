import React from 'react';
import { Skeleton as AntdSkeleton } from 'antd';
import type { SkeletonButtonProps as AntdSkeletonButtonProps } from 'antd/es/skeleton/Button';

export interface GZDSkeletonButtonProps extends AntdSkeletonButtonProps {}

const SkeletonButton: React.FC<GZDSkeletonButtonProps> = (props) => {
  return <AntdSkeleton.Button {...props} />;
};

SkeletonButton.displayName = 'GZDSkeletonButton';

export default SkeletonButton;
