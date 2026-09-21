import { forwardRef } from 'react';
import { Upload as AntdUpload } from 'antd';
import type { DraggerProps } from 'antd/es/upload';

export interface GZDDraggerProps extends DraggerProps {}

const Dragger = forwardRef<any, GZDDraggerProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdUpload.Dragger ref={ref} {...restProps}>
      {children}
    </AntdUpload.Dragger>
  );
});

Dragger.displayName = 'GZDDragger';

export default Dragger;
