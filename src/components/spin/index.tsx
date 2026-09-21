import Spin, { type GZDSpinProps } from './Spin';
import { Spin as AntdSpin } from 'antd';

export type { GZDSpinProps };

export type GZDSpinComponent = typeof Spin & Omit<typeof AntdSpin, keyof typeof Spin>;

const TransSpin = Spin as GZDSpinComponent;

// Inherit static properties like Spin.setDefaultIndicator
Object.assign(TransSpin, AntdSpin);

export default TransSpin;
