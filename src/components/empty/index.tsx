import Empty from './Empty';
import { Empty as AntdEmpty } from 'antd';

export type { GZDEmptyProps } from './Empty';

export type GZDEmptyComponent = typeof Empty & {
  PRESENTED_IMAGE_DEFAULT: typeof AntdEmpty.PRESENTED_IMAGE_DEFAULT;
  PRESENTED_IMAGE_SIMPLE: typeof AntdEmpty.PRESENTED_IMAGE_SIMPLE;
};

const TransEmpty = Empty as GZDEmptyComponent;

TransEmpty.PRESENTED_IMAGE_DEFAULT = AntdEmpty.PRESENTED_IMAGE_DEFAULT;
TransEmpty.PRESENTED_IMAGE_SIMPLE = AntdEmpty.PRESENTED_IMAGE_SIMPLE;

export default TransEmpty;
