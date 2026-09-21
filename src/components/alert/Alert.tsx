import React, { forwardRef } from 'react';
import { Alert as AntdAlert, type AlertProps } from 'antd';

export interface GZDAlertProps extends AlertProps {}

// We need to extract the ref type from AntdAlert
type AlertRef = React.ElementRef<typeof AntdAlert>;

const Alert = forwardRef<AlertRef, GZDAlertProps>((props, ref) => {
  return <AntdAlert ref={ref} {...props} />;
});

Alert.displayName = 'GZDAlert';

export default Alert;
