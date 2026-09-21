import Timeline from './Timeline';
import Item from './Item';

export type { GZDTimelineProps } from './Timeline';
export type { GZDTimelineItemProps } from './Item';

export type GZDTimelineComponent = typeof Timeline & {
  Item: typeof Item;
};

const TransTimeline = Timeline as GZDTimelineComponent;

TransTimeline.Item = Item;

export default TransTimeline;
