import { forwardRef } from 'react';
import { TreeSelect as AntdTreeSelect } from 'antd';
import type { TreeSelectProps } from 'antd';
import TreeNode, { type GZDTreeNodeProps } from './TreeNode';

export interface GZDTreeSelectProps<ValueType = any> extends TreeSelectProps<ValueType> {}
export type { GZDTreeNodeProps as TreeNodeProps };

const TreeSelect = forwardRef<HTMLElement, GZDTreeSelectProps>((props, ref) => {
  return <AntdTreeSelect ref={ref as any} {...props} />;
}) as <ValueType = any>(
  props: React.PropsWithChildren<GZDTreeSelectProps<ValueType>> & React.RefAttributes<HTMLElement>
) => React.ReactElement;

export type GZDTreeSelectComponent = typeof TreeSelect & {
  TreeNode: typeof TreeNode;
  SHOW_ALL: typeof AntdTreeSelect.SHOW_ALL;
  SHOW_PARENT: typeof AntdTreeSelect.SHOW_PARENT;
  SHOW_CHILD: typeof AntdTreeSelect.SHOW_CHILD;
};

const TransTreeSelect = TreeSelect as GZDTreeSelectComponent;

TransTreeSelect.TreeNode = TreeNode;
TransTreeSelect.SHOW_ALL = AntdTreeSelect.SHOW_ALL;
TransTreeSelect.SHOW_PARENT = AntdTreeSelect.SHOW_PARENT;
TransTreeSelect.SHOW_CHILD = AntdTreeSelect.SHOW_CHILD;

(TransTreeSelect as any).displayName = 'GZDTreeSelect';

export default TransTreeSelect;
