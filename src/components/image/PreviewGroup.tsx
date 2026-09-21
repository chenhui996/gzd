import React from 'react';
import { Image as AntdImage } from 'antd';

// Extract the PreviewGroup props type directly from AntdImage if possible
type AntdImagePreviewGroupProps = React.ComponentProps<typeof AntdImage.PreviewGroup>;

export interface GZDImagePreviewGroupProps extends AntdImagePreviewGroupProps {}

const PreviewGroup: React.FC<GZDImagePreviewGroupProps> = (props) => {
  return <AntdImage.PreviewGroup {...props} />;
};

PreviewGroup.displayName = 'GZDImagePreviewGroup';

export default PreviewGroup;
