import React, { forwardRef } from 'react';
import { Tree as AntdTree } from 'antd';

const AntdDirectoryTree = AntdTree.DirectoryTree;

export type GZDDirectoryTreeProps = React.ComponentProps<typeof AntdDirectoryTree>;

type DirectoryTreeRef = React.ElementRef<typeof AntdDirectoryTree>;

const DirectoryTree = forwardRef<DirectoryTreeRef, GZDDirectoryTreeProps>((props, ref) => {
  return <AntdDirectoryTree ref={ref} {...props} />;
});

DirectoryTree.displayName = 'GZDDirectoryTree';

export default DirectoryTree;
