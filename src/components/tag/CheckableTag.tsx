import { forwardRef } from 'react';
import { Tag as AntdTag } from 'antd';
import type { CheckableTagProps } from 'antd/es/tag';

export interface GZDCheckableTagProps extends CheckableTagProps {}

const CheckableTag = forwardRef<HTMLSpanElement, GZDCheckableTagProps>((props, ref) => {
  return <AntdTag.CheckableTag ref={ref} {...props} />;
});

CheckableTag.displayName = 'GZDCheckableTag';

export default CheckableTag;
