import Result, { type GZDResultProps } from './Result';
import { Result as AntdResult } from 'antd';

export type { GZDResultProps };

// Result in Antd has static properties for preset images like PRESENTED_IMAGE_404
export type GZDResultComponent = typeof Result & Omit<typeof AntdResult, keyof typeof Result>;

const TransResult = Result as GZDResultComponent;

Object.assign(TransResult, AntdResult);

export default TransResult;
