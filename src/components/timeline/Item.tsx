import React from 'react';
import { Timeline as AntdTimeline } from 'antd';
import type { TimelineItemProps } from 'antd/es/timeline';

export interface GZDTimelineItemProps extends TimelineItemProps {}

const Item: React.FC<GZDTimelineItemProps> = (props) => {
  return <AntdTimeline.Item {...props} />;
};

Item.displayName = 'GZDTimelineItem';

export default Item;
