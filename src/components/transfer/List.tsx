import { forwardRef } from 'react';
import { Transfer as AntdTransfer } from 'antd';
import type { TransferListProps } from 'antd/es/transfer/Section';

export interface GZDTransferListProps<RecordType> extends TransferListProps<RecordType> {}

const List = forwardRef<HTMLDivElement, GZDTransferListProps<any>>((props, ref) => {
  return (
    <div ref={ref}>
      <AntdTransfer.List {...props} />
    </div>
  );
});

List.displayName = 'GZDTransferList';

export default List;
