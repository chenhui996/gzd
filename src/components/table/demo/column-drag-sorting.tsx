/**
 * title: 列拖拽排序
 * description: 将 `suppressMovable` 设为 `false` 后，可直接拖动任意表头调整列的显示顺序。
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

const columnDefs: ColDef<DataType>[] = [
  { headerName: 'Name', field: 'name', minWidth: 180, flex: 1 },
  { headerName: 'Age', field: 'age', width: 120 },
  { headerName: 'Address', field: 'address', minWidth: 260, flex: 2 },
];

const rowData: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];

const App: React.FC = () => (
  <div className="gzd-table-demo-scrollbar-scope">
    <Table<DataType>
      modules={[AllCommunityModule]}
      columnDefs={columnDefs}
      rowData={rowData}
      getRowId={({ data }) => data.key}
      defaultColDef={{
        sortable: false,
        resizable: false,
        suppressMovable: false,
      }}
      domLayout="autoHeight"
    />
  </div>
);

export default App;
