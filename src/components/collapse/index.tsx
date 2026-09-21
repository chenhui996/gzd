import Collapse from './Collapse';
import Panel from './Panel';

export type { GZDCollapseProps } from './Collapse';
export type { GZDCollapsePanelProps } from './Panel';

export type GZDCollapseComponent = typeof Collapse & {
  Panel: typeof Panel;
};

const TransCollapse = Collapse as GZDCollapseComponent;

TransCollapse.Panel = Panel;

export default TransCollapse;
