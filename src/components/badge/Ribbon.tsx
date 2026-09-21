import { forwardRef } from 'react';
import { Badge as AntdBadge } from 'antd';
import type { RibbonProps } from 'antd/es/badge/Ribbon';

export interface GZDBadgeRibbonProps extends RibbonProps {}

const Ribbon = forwardRef<HTMLDivElement, GZDBadgeRibbonProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <div ref={ref} style={{ display: 'contents' }}>
      <AntdBadge.Ribbon {...restProps}>
        {children}
      </AntdBadge.Ribbon>
    </div>
  );
});

Ribbon.displayName = 'GZDBadgeRibbon';

export default Ribbon;
