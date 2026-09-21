import Tree, { type GZDTreeProps } from './Tree';
import DirectoryTree, { type GZDDirectoryTreeProps } from './DirectoryTree';
import type { DataNode, EventDataNode, TreeProps } from 'antd/es/tree';

export type { GZDTreeProps, GZDDirectoryTreeProps, DataNode, EventDataNode, TreeProps };

export type GZDTreeComponent = typeof Tree & {
  DirectoryTree: typeof DirectoryTree;
};

const TransTree = Tree as GZDTreeComponent;

TransTree.DirectoryTree = DirectoryTree;

export default TransTree;
