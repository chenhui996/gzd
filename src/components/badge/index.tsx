import { forwardRef } from 'react';
import { Badge as AntdBadge } from 'antd';
import type { BadgeProps } from 'antd';
import Ribbon, { type GZDBadgeRibbonProps } from './Ribbon';

export interface GZDBadgeProps extends BadgeProps {}
export type { GZDBadgeRibbonProps as BadgeRibbonProps };

const Badge = forwardRef<HTMLSpanElement, GZDBadgeProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdBadge ref={ref} {...restProps}>
      {children}
    </AntdBadge>
  );
});

export type GZDBadgeComponent = typeof Badge & {
  Ribbon: typeof Ribbon;
};

const TransBadge = Badge as GZDBadgeComponent;

TransBadge.Ribbon = Ribbon;
TransBadge.displayName = 'GZDBadge';

export default TransBadge;
