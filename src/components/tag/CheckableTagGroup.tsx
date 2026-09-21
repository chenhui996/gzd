import { forwardRef } from 'react';
import { Tag as AntdTag } from 'antd';
import type { CheckableTagGroupProps } from 'antd/es/tag/CheckableTagGroup';
import type { CheckableTagGroupRef } from 'antd/es/tag/CheckableTagGroup';

export type GZDCheckableTagGroupProps<T extends string | number = any> = CheckableTagGroupProps<T>;

const CheckableTagGroup = forwardRef<CheckableTagGroupRef, GZDCheckableTagGroupProps>((props, ref) => {
  return <AntdTag.CheckableTagGroup ref={ref} {...props} />;
});

CheckableTagGroup.displayName = 'GZDCheckableTagGroup';

export default CheckableTagGroup;
