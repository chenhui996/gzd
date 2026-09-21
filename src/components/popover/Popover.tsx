import { forwardRef } from 'react';
import { Popover as AntdPopover, type PopoverProps } from 'antd';
import type { TooltipRef } from 'antd/es/tooltip';

export interface GZDPopoverProps extends PopoverProps {}

const Popover = forwardRef<TooltipRef, GZDPopoverProps>((props, ref) => {
  return <AntdPopover ref={ref} {...props} />;
});

Popover.displayName = 'GZDPopover';

export default Popover;
