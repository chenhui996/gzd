/**
 * title: 总结栏
 * description: 预先计算记录数量与金额合计，并通过 `pinnedBottomRowData` 将统计结果固定在数据行下方，与普通记录分开显示。
 */
import React from 'react';
import { AllCommunityModule, type ColDef } from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  quantity: number;
  amount: number;
}

const rowData: DataType[] = [
  { key: '1', name: 'John Brown', quantity: 10, amount: 320 },
  { key: '2', name: 'Jim Green', quantity: 8, amount: 256 },
  { key: '3', name: 'Joe Black', quantity: 12, amount: 384 },
];

const pinnedBottomRowData: DataType[] = [
  {
    key: 'summary',
    name: 'Total',
    quantity: rowData.reduce((total, row) => total + row.quantity, 0),
    amount: rowData.reduce((total, row) => total + row.amount, 0),
  },
];

const columnDefs: ColDef<DataType>[] = [
  { headerName: 'Name', field: 'name', minWidth: 180, flex: 1 },
  { headerName: 'Quantity', field: 'quantity', width: 140 },
  {
    headerName: 'Amount',
    field: 'amount',
    width: 140,
    valueFormatter: ({ value }) => `$${value ?? 0}`,
  },
];

const App: React.FC = () => (
  <div className="gzd-table-demo-scrollbar-scope">
    <Table<DataType>
      modules={[AllCommunityModule]}
      columnDefs={columnDefs}
      rowData={rowData}
      pinnedBottomRowData={pinnedBottomRowData}
      getRowId={({ data }) => data.key}
      defaultColDef={{
        sortable: false,
        resizable: false,
        suppressMovable: true,
      }}
      domLayout="autoHeight"
    />
  </div>
);

export default App;
