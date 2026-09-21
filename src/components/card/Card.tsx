import { forwardRef } from 'react';
import { Card as AntdCard, type CardProps } from 'antd';

export interface GZDCardProps extends CardProps {}

const Card = forwardRef<HTMLDivElement, GZDCardProps>((props, ref) => {
  return <AntdCard ref={ref} {...props} />;
});

Card.displayName = 'GZDCard';

export default Card;
