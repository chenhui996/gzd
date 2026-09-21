/**
 * title: 自定义语义结构的样式和类
 * description: 使用 `headerClass`、`cellClass` 和 `getRowClass` 分别定制表头、指定列及满足条件的数据行，样式逻辑与数据结构保持分离。
 */
import React from 'react';
import { AllCommunityModule, type ColDef } from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  status: 'normal' | 'warning';
  amount: number;
  description: string;
}

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 160,
    flex: 1,
    headerClass: 'gz-table-demo-semantic-header',
    cellClass: 'gz-table-demo-semantic-name',
  },
  {
    headerName: 'Status',
    field: 'status',
    width: 120,
    headerClass: 'gz-table-demo-semantic-header',
  },
  {
    headerName: 'Amount',
    field: 'amount',
    width: 120,
    headerClass: 'gz-table-demo-semantic-header',
    cellClass: 'gz-table-demo-semantic-amount',
    valueFormatter: ({ value }) => `$${value ?? 0}`,
  },
  {
    headerName: 'Description',
    field: 'description',
    minWidth: 240,
    flex: 2,
    headerClass: 'gz-table-demo-semantic-header',
  },
];

const rowData: DataType[] = [
  { key: '1', name: 'John Brown', status: 'normal', amount: 320, description: 'Ready to ship' },
  { key: '2', name: 'Jim Green', status: 'warning', amount: 256, description: 'Needs review' },
  { key: '3', name: 'Joe Black', status: 'normal', amount: 384, description: 'Ready to ship' },
];

const App: React.FC = () => (
  <div className="gz-table-demo-scrollbar-scope gz-table-demo-semantic">
    <Table<DataType>
      modules={[AllCommunityModule]}
      columnDefs={columnDefs}
      rowData={rowData}
      getRowId={({ data }) => data.key}
      getRowClass={({ data }) =>
        data?.status === 'warning' ? 'gz-table-demo-semantic-row-warning' : undefined
      }
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
