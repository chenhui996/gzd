import React from 'react';
import { Empty as AntdEmpty } from 'antd';
import type { EmptyProps } from 'antd';

export interface GZDEmptyProps extends EmptyProps {}

const Empty: React.FC<GZDEmptyProps> = (props) => {
  return <AntdEmpty {...props} />;
};

Empty.displayName = 'GZDEmpty';

export default Empty;
