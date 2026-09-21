import { forwardRef } from 'react';
import { Avatar as AntdAvatar } from 'antd';
import type { AvatarGroupProps } from 'antd/es/avatar/AvatarGroup';

export interface GZDAvatarGroupProps extends AvatarGroupProps {}

const Group = forwardRef<HTMLDivElement, GZDAvatarGroupProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <div ref={ref} style={{ display: 'inline-flex' }}>
      <AntdAvatar.Group {...restProps}>
        {children}
      </AntdAvatar.Group>
    </div>
  );
});

Group.displayName = 'GZDAvatarGroup';

export default Group;
