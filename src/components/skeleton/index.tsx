import Skeleton, { type GZDSkeletonProps } from './Skeleton';
import Button, { type GZDSkeletonButtonProps } from './Button';
import Avatar, { type GZDSkeletonAvatarProps } from './Avatar';
import Input, { type GZDSkeletonInputProps } from './Input';
import Image, { type GZDSkeletonImageProps } from './Image';
import Node, { type GZDSkeletonNodeProps } from './Node';

export type { 
  GZDSkeletonProps, 
  GZDSkeletonButtonProps, 
  GZDSkeletonAvatarProps, 
  GZDSkeletonInputProps, 
  GZDSkeletonImageProps, 
  GZDSkeletonNodeProps 
};

export type GZDSkeletonComponent = typeof Skeleton & {
  Button: typeof Button;
  Avatar: typeof Avatar;
  Input: typeof Input;
  Image: typeof Image;
  Node: typeof Node;
};

const TransSkeleton = Skeleton as GZDSkeletonComponent;

TransSkeleton.Button = Button;
TransSkeleton.Avatar = Avatar;
TransSkeleton.Input = Input;
TransSkeleton.Image = Image;
TransSkeleton.Node = Node;

export default TransSkeleton;
