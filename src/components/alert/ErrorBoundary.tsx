import React from 'react';
import { Alert as AntdAlert } from 'antd';

const AntdErrorBoundary = AntdAlert.ErrorBoundary;

export type GZDAlertErrorBoundaryProps = React.ComponentProps<typeof AntdErrorBoundary>;

const ErrorBoundary: React.FC<GZDAlertErrorBoundaryProps> = (props) => {
  return <AntdErrorBoundary {...props} />;
};

ErrorBoundary.displayName = 'GZDAlertErrorBoundary';

export default ErrorBoundary;
