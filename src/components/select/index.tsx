import { forwardRef } from 'react';
import { Select as AntdSelect } from 'antd';
import type { SelectProps } from 'antd';
import type { DefaultOptionType, BaseOptionType } from 'antd/es/select';

import Option, { type GZDSelectOptionProps } from './Option';
import OptGroup, { type GZDSelectOptGroupProps } from './OptGroup';

export interface GZDSelectProps<ValueType = any, OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType> extends SelectProps<ValueType, OptionType> {}
export type { GZDSelectOptionProps as SelectOptionProps, GZDSelectOptGroupProps as SelectOptGroupProps };

const Select = forwardRef<HTMLElement, GZDSelectProps>((props, ref) => {
  return <AntdSelect ref={ref as any} {...props} />;
}) as <ValueType = any, OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType>(
  props: React.PropsWithChildren<GZDSelectProps<ValueType, OptionType>> & React.RefAttributes<HTMLElement>
) => React.ReactElement;

export type GZDSelectComponent = typeof Select & {
  Option: typeof Option;
  OptGroup: typeof OptGroup;
};

const TransSelect = Select as GZDSelectComponent;

TransSelect.Option = Option;
TransSelect.OptGroup = OptGroup;
(TransSelect as any).displayName = 'GZDSelect';

export default TransSelect;
