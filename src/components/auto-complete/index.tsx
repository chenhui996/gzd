import { forwardRef } from 'react';
import { AutoComplete as AntdAutoComplete, type AutoCompleteProps } from 'antd';
import type { RefSelectProps } from 'antd';

export interface GZDAutoCompleteProps extends AutoCompleteProps {}

const AutoComplete = forwardRef<RefSelectProps, GZDAutoCompleteProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdAutoComplete ref={ref as any} {...restProps}>
      {children}
    </AntdAutoComplete>
  );
});

AutoComplete.displayName = 'GZDAutoComplete';

export default AutoComplete;
