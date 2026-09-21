// import { type FC } from "react";
import Compact from "./Compact";
import Space from "./Space";
import Addon from "./Addon";

export type { GZDSpaceProps } from "./Space";

export type GzdSpaceComponent = typeof Space & {
  Compact: typeof Compact;
  Addon: typeof Addon;
};

const TransSpace = Space as GzdSpaceComponent;

TransSpace.Compact = Compact;
TransSpace.Addon = Addon;

export default TransSpace;
