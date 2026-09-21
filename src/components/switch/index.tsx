import { forwardRef } from 'react';
import { Switch as AntdSwitch, type SwitchProps as AntdSwitchProps } from 'antd';
import classNames from 'classnames';
import './style.less';

export type GZDSwitchProps = AntdSwitchProps;

const Switch = forwardRef<HTMLButtonElement, GZDSwitchProps>((props, ref) => {
  const { className, ...restProps } = props;
  
  return (
    <AntdSwitch
      ref={ref}
      className={classNames('gzd-switch', className)}
      {...restProps}
    />
  );
});

Switch.displayName = 'Switch';

export default Switch;
