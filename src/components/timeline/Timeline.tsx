import React from 'react';
import { Timeline as AntdTimeline, type TimelineProps } from 'antd';

export interface GZDTimelineProps extends TimelineProps {}

const Timeline: React.FC<GZDTimelineProps> = (props) => {
  return <AntdTimeline {...props} />;
};

Timeline.displayName = 'GZDTimeline';

export default Timeline;
