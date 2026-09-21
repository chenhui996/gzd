import React from 'react';
import { Card as AntdCard } from 'antd';
import type { CardMetaProps } from 'antd/es/card';

export interface GZDCardMetaProps extends CardMetaProps {}

const Meta: React.FC<GZDCardMetaProps> = (props) => {
  return <AntdCard.Meta {...props} />;
};

Meta.displayName = 'GZDCardMeta';

export default Meta;
