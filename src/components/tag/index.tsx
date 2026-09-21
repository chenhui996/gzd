import Tag from './Tag';
import CheckableTag from './CheckableTag';
import CheckableTagGroup from './CheckableTagGroup';

export type { GZDTagProps } from './Tag';
export type { GZDCheckableTagProps } from './CheckableTag';
export type { GZDCheckableTagGroupProps } from './CheckableTagGroup';

export type GZDTagComponent = typeof Tag & {
  CheckableTag: typeof CheckableTag;
  CheckableTagGroup: typeof CheckableTagGroup;
};

const TransTag = Tag as GZDTagComponent;

TransTag.CheckableTag = CheckableTag;
TransTag.CheckableTagGroup = CheckableTagGroup;

export default TransTag;
