import React from 'react';
import { Skeleton as AntdSkeleton } from 'antd';
import type { SkeletonProps as AntdSkeletonProps } from 'antd';

export interface GZDSkeletonProps extends AntdSkeletonProps {
  children?: React.ReactNode;
}

// The main Skeleton component doesn't inherently forward ref in Antd,
// but we will try with React.FC based on standard Antd behavior for the top-level Skeleton wrapper.
const Skeleton: React.FC<GZDSkeletonProps> = (props) => {
  return <AntdSkeleton {...props} />;
};

Skeleton.displayName = 'GZDSkeleton';

export default Skeleton;
