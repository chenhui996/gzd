import React from 'react';
import { Skeleton as AntdSkeleton } from 'antd';
import type { SkeletonNodeProps as AntdSkeletonNodeProps } from 'antd/es/skeleton/Node';

export interface GZDSkeletonNodeProps extends AntdSkeletonNodeProps {}

const SkeletonNode: React.FC<GZDSkeletonNodeProps> = (props) => {
  return <AntdSkeleton.Node {...props} />;
};

SkeletonNode.displayName = 'GZDSkeletonNode';

export default SkeletonNode;
