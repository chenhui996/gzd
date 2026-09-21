import { forwardRef } from 'react';
import { Upload as AntdUpload } from 'antd';
import type { UploadProps, UploadRef } from 'antd/es/upload';

import Dragger, { type GZDDraggerProps } from './Dragger';

export interface GZDUploadProps<T = any> extends UploadProps<T> {}
export type { GZDDraggerProps as DraggerProps };

const Upload = forwardRef<UploadRef, GZDUploadProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdUpload ref={ref as any} {...restProps}>
      {children}
    </AntdUpload>
  );
}) as <T = any>(
  props: React.PropsWithChildren<GZDUploadProps<T>> & React.RefAttributes<UploadRef<T>>
) => React.ReactElement;

export type GZDUploadComponent = typeof Upload & {
  Dragger: typeof Dragger;
  LIST_IGNORE: string;
};

const TransUpload = Upload as GZDUploadComponent;

TransUpload.Dragger = Dragger;
TransUpload.LIST_IGNORE = AntdUpload.LIST_IGNORE;
(TransUpload as any).displayName = 'GZDUpload';

export default TransUpload;
