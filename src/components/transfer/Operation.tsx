import { forwardRef } from 'react';
import { Transfer as AntdTransfer } from 'antd';
import type { TransferOperationProps } from 'antd/es/transfer/Actions';

export interface GZDTransferOperationProps extends TransferOperationProps {}

const Operation = forwardRef<HTMLDivElement, GZDTransferOperationProps>((props, ref) => {
  return (
    <div ref={ref}>
      <AntdTransfer.Operation {...props} />
    </div>
  );
});

Operation.displayName = 'GZDTransferOperation';

export default Operation;
