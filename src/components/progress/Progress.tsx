import React, { forwardRef } from 'react';
import { Progress as AntdProgress, type ProgressProps } from 'antd';

export interface GZDProgressProps extends ProgressProps {}

type ProgressRef = React.ElementRef<typeof AntdProgress>;

const Progress = forwardRef<ProgressRef, GZDProgressProps>((props, ref) => {
  return <AntdProgress ref={ref} {...props} />;
});

Progress.displayName = 'GZDProgress';

export default Progress;
