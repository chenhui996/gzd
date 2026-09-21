import React from 'react';
import { Form as AntdForm } from 'antd';
import type { ErrorListProps } from 'antd/es/form';

export interface GZDErrorListProps extends ErrorListProps {}

const ErrorList: React.FC<GZDErrorListProps> = (props) => {
  return <AntdForm.ErrorList {...props} />;
};

ErrorList.displayName = 'GZDErrorList';

export default ErrorList;
