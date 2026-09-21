import React, { forwardRef } from 'react';
import { Popconfirm as AntdPopconfirm, type PopconfirmProps } from 'antd';
import './style.less';

export interface GZDPopconfirmProps extends PopconfirmProps {}

// Popconfirm typically forwards its ref to the trigger element or tooltip overlay
type PopconfirmRef = React.ElementRef<typeof AntdPopconfirm>;

const Popconfirm = forwardRef<PopconfirmRef, GZDPopconfirmProps>((props, ref) => {
  return <AntdPopconfirm ref={ref} {...props} />;
});

Popconfirm.displayName = 'GZDPopconfirm';

export default Popconfirm;
