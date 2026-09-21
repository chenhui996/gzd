/**
 * title: 紧凑型
 * description: 分别设置 `headerHeight` 和 `rowHeight` 展示中等、小型两种密度；小型表格适合空间有限的容器。
 */
import React from 'react';
import { AllCommunityModule, type ColDef } from 'gzd/gzd-table';
import { Divider, Table } from 'gzd';
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
    address: 'Sydney No. 1 Lake Park',
  },
];

const commonProps = {
  modules: [AllCommunityModule],
  columnDefs,
  rowData,
  getRowId: ({ data }: { data: DataType }) => data.key,
  defaultColDef: {
    sortable: false,
    resizable: false,
    suppressMovable: true,
  },
  domLayout: 'autoHeight' as const,
};

const App: React.FC = () => (
  <div className="gzd-table-demo-scrollbar-scope">
    <Divider>Medium size table</Divider>
    <Table<DataType> {...commonProps} headerHeight={40} rowHeight={40} />
    <Divider>Small size table</Divider>
    <Table<DataType> {...commonProps} headerHeight={32} rowHeight={32} />
  </div>
);

export default App;
