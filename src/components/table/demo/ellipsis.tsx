/**
 * title: 单元格自动省略
 * description: 为单元格设置单行溢出样式；当 Name 或 Address 内容超过当前可用列宽时，自动显示省略号。
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
  { headerName: 'Name', field: 'name', width: 180 },
  { headerName: 'Age', field: 'age', width: 100 },
  { headerName: 'Address', field: 'address', minWidth: 220, flex: 1 },
];

const rowData: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address:
      'New York No. 1 Lake Park, a long address that is truncated when it exceeds the column width',
  },
  {
    key: '2',
    name: 'Jim Green with a long name',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  { key: '3', name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park' },
];

const App: React.FC = () => (
  <div className="gzd-table-demo-scrollbar-scope gzd-table-demo-ellipsis">
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
      domLayout="autoHeight"
    />
  </div>
);

export default App;
