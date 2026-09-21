/**
 * title: 行列合并
 * description: 使用 `colSpan` 让第二行 Name 横跨后续五列，并通过 `spanRows` 垂直合并最后两行相同的 Home phone。
 */
import React from 'react';
import { AllCommunityModule, type ColDef, type ICellRendererParams } from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  tel: string;
  phone: number;
  address: string;
}

const NameCellRenderer: React.FC<ICellRendererParams<DataType, string>> = ({ value }) => (
  <a>{value}</a>
);

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'RowHead',
    field: 'key',
    width: 100,
  },
  {
    headerName: 'Name',
    field: 'name',
    width: 160,
    cellRenderer: NameCellRenderer,
    colSpan: ({ node }) => (node?.rowIndex === 1 ? 5 : 1),
  },
  {
    headerName: 'Age',
    field: 'age',
    width: 100,
  },
  {
    headerName: 'Home phone',
    field: 'tel',
    width: 180,
    spanRows: ({ nodeA, nodeB }) =>
      nodeA?.data?.key === '4' && nodeB?.data?.key === '5',
  },
  {
    headerName: 'Phone',
    field: 'phone',
    width: 150,
  },
  {
    headerName: 'Address',
    field: 'address',
    minWidth: 240,
    flex: 1,
  },
];

const rowData: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    tel: '0571-22098909',
    phone: 18889898989,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    tel: '0571-22098333',
    phone: 18889898888,
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 18,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '5',
    name: 'Jake White',
    age: 18,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'Dublin No. 2 Lake Park',
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
        suppressMovable: true,
      }}
      enableCellSpan
      enableCellTextSelection={false}
      domLayout="autoHeight"
    />
  </div>
);

export default App;
