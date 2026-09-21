import React from 'react';
import { Descriptions as AntdDescriptions } from 'antd';
import type { DescriptionsProps } from 'antd';

export interface GZDDescriptionsProps extends DescriptionsProps {}

export type GZDDescriptionsItemProps = React.ComponentProps<typeof AntdDescriptions.Item>;

const Descriptions: React.FC<GZDDescriptionsProps> = (props) => {
  return <AntdDescriptions {...props} />;
};

Descriptions.displayName = 'GZDDescriptions';

export type GZDDescriptionsComponent = typeof Descriptions & {
  Item: typeof AntdDescriptions.Item;
};

const TransDescriptions = Descriptions as GZDDescriptionsComponent;

TransDescriptions.Item = AntdDescriptions.Item;

export default TransDescriptions;
