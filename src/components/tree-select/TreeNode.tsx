import { forwardRef } from 'react';
import { TreeSelect as AntdTreeSelect } from 'antd';

export interface GZDTreeNodeProps extends React.ComponentProps<typeof AntdTreeSelect.TreeNode> {}

const TreeNode = forwardRef<HTMLElement, GZDTreeNodeProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdTreeSelect.TreeNode ref={ref as any} {...(restProps as any)}>
      {children}
    </AntdTreeSelect.TreeNode>
  );
});

TreeNode.displayName = 'GZDTreeNode';

export default TreeNode;

