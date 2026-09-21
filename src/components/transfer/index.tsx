import { forwardRef } from 'react';
import { Transfer as AntdTransfer } from 'antd';
import type { TransferProps } from 'antd';

import List, { type GZDTransferListProps } from './List';
import Search, { type GZDTransferSearchProps } from './Search';
import Operation, { type GZDTransferOperationProps } from './Operation';

export interface GZDTransferProps<RecordType> extends TransferProps<RecordType> {}
export type { GZDTransferListProps as TransferListProps, GZDTransferSearchProps as TransferSearchProps, GZDTransferOperationProps as TransferOperationProps };

const Transfer = forwardRef<HTMLDivElement, GZDTransferProps<any>>((props, ref) => {
  return (
    <div ref={ref} style={{ width: '100%' }}> 
      <AntdTransfer {...props} />
    </div>
  );
}) as <RecordType extends any = any>(
  props: React.PropsWithChildren<GZDTransferProps<RecordType>> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement;

export type GZDTransferComponent = typeof Transfer & {
  List: typeof List;
  Search: typeof Search;
  Operation: typeof Operation;
};

const TransTransfer = Transfer as GZDTransferComponent;

TransTransfer.List = List;
TransTransfer.Search = Search;
TransTransfer.Operation = Operation;

(TransTransfer as any).displayName = 'GZDTransfer';

export default TransTransfer;
