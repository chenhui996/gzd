import Image, { type GZDImageProps } from './Image';
import PreviewGroup, { type GZDImagePreviewGroupProps } from './PreviewGroup';
import { Image as AntdImage } from 'antd';

export type { GZDImageProps, GZDImagePreviewGroupProps };

export type GZDImageComponent = typeof Image & Omit<typeof AntdImage, keyof typeof Image> & {
  PreviewGroup: typeof PreviewGroup;
};

const TransImage = Image as GZDImageComponent;

// inherit static properties
Object.assign(TransImage, AntdImage);

TransImage.PreviewGroup = PreviewGroup;

export default TransImage;
