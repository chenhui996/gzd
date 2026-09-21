/**
 * title: 统一列配置
 * description: 通过 `defaultColDef` 为所有列统一开启排序和宽度调整，并设置最小列宽；单列仍可覆盖这些默认配置。
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
  { headerName: 'Name', field: 'name', flex: 1 },
  { headerName: 'Age', field: 'age', width: 100, sortable: false },
  { headerName: 'Address', field: 'address', flex: 2 },
];

const rowData: DataType[] = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park' },
];

const App: React.FC = () => (
  <div className="gz-table-demo-scrollbar-scope">
    <Table<DataType>
      modules={[AllCommunityModule]}
      columnDefs={columnDefs}
      rowData={rowData}
      getRowId={({ data }) => data.key}
      defaultColDef={{
        sortable: true,
        resizable: true,
        minWidth: 140,
        suppressMovable: true,
      }}
      domLayout="autoHeight"
    />
  </div>
);

export default App;
