import React from 'react';
import { Skeleton as AntdSkeleton } from 'antd';
import type { SkeletonInputProps as AntdSkeletonInputProps } from 'antd/es/skeleton/Input';

export interface GZDSkeletonInputProps extends AntdSkeletonInputProps {}

const SkeletonInput: React.FC<GZDSkeletonInputProps> = (props) => {
  return <AntdSkeleton.Input {...props} />;
};

SkeletonInput.displayName = 'GZDSkeletonInput';

export default SkeletonInput;
