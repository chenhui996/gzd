/**
 * title: 固定列
 * description: 使用 `pinned` 将姓名列固定在左侧、操作列固定在右侧；横向滚动时两侧关键列始终保持可见。
 */
import React from 'react';
import { AllCommunityModule, type ColDef } from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const addressColumnDefs: ColDef<DataType>[] = Array.from(
  { length: 20 },
  (_, index) => ({
    headerName: `Column ${index + 1}`,
    field: 'address',
    colId: `address-${index + 1}`,
    width: 120,
  }),
);

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Full Name',
    field: 'name',
    width: 100,
    pinned: 'left',
    lockPinned: true,
  },
  {
    headerName: 'Age',
    field: 'age',
    width: 100,
    pinned: 'left',
    lockPinned: true,
    sortable: true,
  },
  ...addressColumnDefs,
  {
    headerName: 'Action',
    colId: 'operation',
    width: 100,
    pinned: 'right',
    lockPinned: true,
    cellRenderer: () => <a>action</a>,
  },
];

const rowData: DataType[] = [
  { key: '1', name: 'Olivia', age: 32, address: 'New York Park' },
  { key: '2', name: 'Ethan', age: 40, address: 'London Park' },
];

const App: React.FC = () => (
  <div className="gz-table-demo-scrollbar-scope">
    <div style={{ height: 128 }}>
      <Table<DataType>
        modules={[AllCommunityModule]}
        columnDefs={columnDefs}
        rowData={rowData}
        getRowId={({ data }) => data.key}
        defaultColDef={{
          sortable: false,
          resizable: false,
          suppressMovable: true,
        }}
      />
    </div>
  </div>
);

export default App;
