import React from 'react';
import { Card as AntdCard } from 'antd';
import type { CardGridProps } from 'antd/es/card';

export interface GZDCardGridProps extends CardGridProps {}

const Grid: React.FC<GZDCardGridProps> = (props) => {
  return <AntdCard.Grid {...props} />;
};

Grid.displayName = 'GZDCardGrid';

export default Grid;
