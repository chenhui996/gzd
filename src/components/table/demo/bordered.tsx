/**
 * title: 带边框
 * description: 在表格外层增加完整边框和圆角，并组合独立的页头、页脚；金额列使用右对齐便于比较数值。
 */
import React from 'react';
import {
  AllCommunityModule,
  type ColDef,
  type ICellRendererParams,
} from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  money: string;
  address: string;
}

const NameCellRenderer: React.FC<ICellRendererParams<DataType, string>> = ({ value }) => (
  <a>{value}</a>
);

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 180,
    flex: 1,
    cellRenderer: NameCellRenderer,
  },
  {
    headerName: 'Cash Assets',
    field: 'money',
    minWidth: 180,
    flex: 1,
    cellStyle: { textAlign: 'right' },
    headerClass: 'ag-right-aligned-header',
  },
  {
    headerName: 'Address',
    field: 'address',
    minWidth: 260,
    flex: 2,
  },
];

const rowData: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    money: '￥300,000.00',
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    money: '￥1,256,000.00',
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    money: '￥120,000.00',
    address: 'Sydney No. 1 Lake Park',
  },
];

const App: React.FC = () => (
  <div className="gzd-table-demo-scrollbar-scope gzd-table-demo-bordered">
    <div className="gzd-table-demo-bordered-section">Header</div>
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
    <div className="gzd-table-demo-bordered-section">Footer</div>
  </div>
);

export default App;
