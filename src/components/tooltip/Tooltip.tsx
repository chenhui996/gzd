import { forwardRef } from 'react';
import { Tooltip as AntdTooltip, type TooltipProps } from 'antd';
import type { TooltipRef } from 'antd/es/tooltip';

export interface GZDTooltipProps extends TooltipProps {}

const Tooltip = forwardRef<TooltipRef, GZDTooltipProps>((props, ref) => {
  return <AntdTooltip ref={ref} {...props} />;
});

Tooltip.displayName = 'GZDTooltip';

export default Tooltip;
