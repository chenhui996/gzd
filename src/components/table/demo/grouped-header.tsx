/**
 * title: 表头分组
 * description: 使用 `ColGroupDef` 将电话信息组织为两级表头，同时固定姓名列和地址列；分页用于浏览更多记录。
 */
import React from 'react';
import {
  AllCommunityModule,
  type ColDef,
  type ColGroupDef,
  type ITextFilterParams,
} from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  street: string;
  building: string;
  number: number;
  companyAddress: string;
  companyName: string;
  gender: string;
}

const nameFilterParams: ITextFilterParams = {
  buttons: ['reset', 'apply'],
  closeOnApply: true,
  filterOptions: ['startsWith'],
  maxNumConditions: 1,
};

const columnDefs: Array<ColDef<DataType> | ColGroupDef<DataType>> = [
  {
    headerName: 'Name',
    field: 'name',
    width: 120,
    pinned: 'left',
    lockPinned: true,
    filter: 'agTextColumnFilter',
    filterParams: nameFilterParams,
    suppressHeaderMenuButton: false,
  },
  {
    headerName: 'Other',
    children: [
      {
        headerName: 'Age',
        field: 'age',
        width: 150,
        sortable: true,
        comparator: (ageA = 0, ageB = 0) => ageA - ageB,
      },
      {
        headerName: 'Address',
        children: [
          { headerName: 'Street', field: 'street', width: 150 },
          {
            headerName: 'Block',
            children: [
              { headerName: 'Building', field: 'building', width: 100 },
              { headerName: 'Door No.', field: 'number', width: 100 },
            ],
          },
        ],
      },
    ],
  },
  {
    headerName: 'Company',
    children: [
      { headerName: 'Company Address', field: 'companyAddress', width: 200 },
      { headerName: 'Company Name', field: 'companyName', minWidth: 180, flex: 1 },
    ],
  },
  {
    headerName: 'Gender',
    field: 'gender',
    width: 90,
    pinned: 'right',
    lockPinned: true,
  },
];

const rowData: DataType[] = Array.from({ length: 100 }, (_, index) => ({
  key: String(index),
  name: 'John Brown',
  age: index + 1,
  street: 'Lake Park',
  building: 'C',
  number: 2035,
  companyAddress: 'Lake Street 42',
  companyName: 'SoftLake Co',
  gender: 'M',
}));

const App: React.FC = () => (
  <div className="gzd-table-demo-scrollbar-scope">
    <div style={{ height: 390 }}>
      <Table<DataType>
        modules={[AllCommunityModule]}
        columnDefs={columnDefs}
        rowData={rowData}
        getRowId={({ data }) => data.key}
        defaultColDef={{
          sortable: false,
          filter: false,
          resizable: false,
          suppressMovable: true,
        }}
        pagination
        paginationPageSize={10}
        paginationPageSizeSelector={false}
        groupHeaderHeight={28}
      />
    </div>
  </div>
);

export default App;
