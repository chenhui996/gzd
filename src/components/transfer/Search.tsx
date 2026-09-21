import { forwardRef } from 'react';
import { Transfer as AntdTransfer } from 'antd';
import type { TransferSearchProps } from 'antd/es/transfer/search';

export interface GZDTransferSearchProps extends TransferSearchProps {}

const Search = forwardRef<HTMLDivElement, GZDTransferSearchProps>((props, ref) => {
  return (
    <div ref={ref}>
      <AntdTransfer.Search {...props} />
    </div>
  );
});

Search.displayName = 'GZDTransferSearch';

export default Search;
