/**
 * title: 可展开
 * description: 通过 Master/Detail 在行首显示展开按钮；展开后在详情区域展示当前记录的补充说明，该能力需要 Enterprise。
 */
import React from 'react';
import type { ColDef, ICellRendererParams } from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  description: string;
}

const DetailCellRenderer: React.FC<ICellRendererParams<DataType>> = ({ data }) => (
  <p style={{ margin: 0, padding: '20px 24px' }}>{data?.description}</p>
);

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 180,
    flex: 1,
    cellRenderer: 'agGroupCellRenderer',
  },
  {
    headerName: 'Age',
    field: 'age',
    width: 120,
  },
  {
    headerName: 'Address',
    field: 'address',
    minWidth: 260,
    flex: 2,
  },
  {
    headerName: 'Action',
    colId: 'action',
    width: 120,
    cellRenderer: () => <a>Delete</a>,
  },
];

const rowData: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description:
      'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    key: '3',
    name: 'Not Expandable',
    age: 29,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This not expandable',
  },
  {
    key: '4',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
  },
];

const App: React.FC = () => (
  <div className="gz-table-demo-scrollbar-scope">
    <div style={{ height: 240 }}>
      <Table<DataType>
        columnDefs={columnDefs}
        rowData={rowData}
        getRowId={({ data }) => data.key}
        masterDetail
        isRowMaster={(data) => data.name !== 'Not Expandable'}
        detailCellRenderer={DetailCellRenderer}
        detailCellRendererParams={{}}
        detailRowHeight={72}
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
