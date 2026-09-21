import { forwardRef } from 'react';
import { Avatar as AntdAvatar } from 'antd';
import type { AvatarProps } from 'antd';
import Group, { type GZDAvatarGroupProps } from './Group';

export interface GZDAvatarProps extends AvatarProps {}
export type { GZDAvatarGroupProps as AvatarGroupProps };

const Avatar = forwardRef<HTMLSpanElement, GZDAvatarProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdAvatar ref={ref} {...restProps}>
      {children}
    </AntdAvatar>
  );
});

export type GZDAvatarComponent = typeof Avatar & {
  Group: typeof Group;
};

const TransAvatar = Avatar as GZDAvatarComponent;

TransAvatar.Group = Group;
TransAvatar.displayName = 'GZDAvatar';

export default TransAvatar;
