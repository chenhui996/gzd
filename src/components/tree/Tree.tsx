import React, { forwardRef, useContext } from 'react';
import { Tree as AntdTree, type TreeProps } from 'antd';
import classNames from 'classnames';
import { GZDConfigContext } from '../config-provider/context';
import './style.less';

export type GZDTreeProps = TreeProps;

// Extract the ref type from AntdTree
type TreeRef = React.ElementRef<typeof AntdTree>;

const GOLD_DARK_TREE_CLASS_NAME = 'gz-tree-gold-dark';

const Tree = forwardRef<TreeRef, GZDTreeProps>((props, ref) => {
  const { className, style, ...restProps } = props;
  const { themeMode } = useContext(GZDConfigContext);
  const isGoldDark = themeMode === 'gold-dark';
  const mergedClassName = isGoldDark
    ? classNames(GOLD_DARK_TREE_CLASS_NAME, className)
    : className;

  return (
    <AntdTree
      ref={ref}
      className={mergedClassName}
      style={style}
      {...restProps}
    />
  );
});

Tree.displayName = 'GZDTree';

export default Tree;
