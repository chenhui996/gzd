import React from 'react';
import { Spin as AntdSpin } from 'antd';
import type { SpinProps as AntdSpinProps } from 'antd';

export interface GZDSpinProps extends AntdSpinProps {
  children?: React.ReactNode;
}

const Spin: React.FC<GZDSpinProps> = (props) => {
  return <AntdSpin {...props} />;
};

Spin.displayName = 'GZDSpin';

export default Spin;
