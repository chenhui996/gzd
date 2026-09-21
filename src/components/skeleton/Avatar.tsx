import React from 'react';
import { Skeleton as AntdSkeleton } from 'antd';
import type { AvatarProps as AntdSkeletonAvatarProps } from 'antd/es/skeleton/Avatar';

export interface GZDSkeletonAvatarProps extends AntdSkeletonAvatarProps {}

const SkeletonAvatar: React.FC<GZDSkeletonAvatarProps> = (props) => {
  return <AntdSkeleton.Avatar {...props} />;
};

SkeletonAvatar.displayName = 'GZDSkeletonAvatar';

export default SkeletonAvatar;
