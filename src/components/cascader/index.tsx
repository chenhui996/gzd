import { forwardRef } from 'react';
import { Cascader as AntdCascader } from 'antd';
import type { CascaderProps } from 'antd';

export interface GZDCascaderProps extends CascaderProps<any> {}

const Cascader = forwardRef<any, GZDCascaderProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdCascader ref={ref as any} {...restProps}>
      {children}
    </AntdCascader>
  );
});

export type GZDCascaderComponent = typeof Cascader & {
  SHOW_PARENT: typeof AntdCascader.SHOW_PARENT;
  SHOW_CHILD: typeof AntdCascader.SHOW_CHILD;
  Panel: typeof AntdCascader.Panel;
};

const TransCascader = Cascader as GZDCascaderComponent;

TransCascader.SHOW_PARENT = AntdCascader.SHOW_PARENT;
TransCascader.SHOW_CHILD = AntdCascader.SHOW_CHILD;
TransCascader.Panel = AntdCascader.Panel;
TransCascader.displayName = 'GZDCascader';

export default TransCascader;
