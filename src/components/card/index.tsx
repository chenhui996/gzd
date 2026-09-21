import Card from './Card';
import Grid from './Grid';
import Meta from './Meta';

export type { GZDCardProps } from './Card';
export type { GZDCardGridProps } from './Grid';
export type { GZDCardMetaProps } from './Meta';

export type GZDCardComponent = typeof Card & {
  Grid: typeof Grid;
  Meta: typeof Meta;
};

const TransCard = Card as GZDCardComponent;

TransCard.Grid = Grid;
TransCard.Meta = Meta;

export default TransCard;
