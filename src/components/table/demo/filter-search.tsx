/**
 * title: 自定义筛选的搜索
 * description: 在 Name 或 Address 的 Set Filter 中输入关键词搜索候选项，再勾选结果筛选数据；Set Filter 需要 Enterprise。
 */
import React from 'react';
import type {
  ColDef,
  FilterChangedEvent,
  ISetFilterParams,
  SortChangedEvent,
} from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const nameFilterParams: ISetFilterParams<DataType, string> = {
  values: ['Joe', 'Jim', 'John'],
  defaultToNothingSelected: true,
  suppressSorting: true,
  treeList: true,
  treeListPathGetter: (value) => (value ? [value] : null),
};

const addressFilterParams: ISetFilterParams<DataType, string> = {
  values: ['London', 'New York'],
  defaultToNothingSelected: true,
  suppressSorting: true,
};

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 180,
    flex: 3,
    filter: 'agSetColumnFilter',
    filterParams: nameFilterParams,
    filterValueGetter: ({ data }) => data?.name.split(' ')[0] ?? '',
    suppressHeaderMenuButton: false,
  },
  {
    headerName: 'Age',
    field: 'age',
    width: 120,
    sortable: true,
    comparator: (ageA = 0, ageB = 0) => ageA - ageB,
  },
  {
    headerName: 'Address',
    field: 'address',
    minWidth: 260,
    flex: 4,
    filter: 'agSetColumnFilter',
    filterParams: addressFilterParams,
    filterValueGetter: ({ data }) => {
      const address = data?.address ?? '';

      if (address.startsWith('London')) {
        return 'London';
      }
      if (address.startsWith('New York')) {
        return 'New York';
      }

      return address;
    },
    suppressHeaderMenuButton: false,
  },
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
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

type TableStateChangedEvent = FilterChangedEvent<DataType> | SortChangedEvent<DataType>;

const onTableStateChanged = ({ api }: TableStateChangedEvent) => {
  console.log('params', {
    filters: api.getFilterModel(),
    sorter: api.getColumnState().filter(({ sort }) => sort),
  });
};

const App: React.FC = () => (
  <div className="gz-table-demo-scrollbar-scope">
    <Table<DataType>
      columnDefs={columnDefs}
      rowData={rowData}
      getRowId={({ data }) => data.key}
      onFilterChanged={onTableStateChanged}
      onSortChanged={onTableStateChanged}
      defaultColDef={{
        sortable: false,
        filter: false,
        resizable: false,
        suppressMovable: true,
      }}
      domLayout="autoHeight"
    />
  </div>
);

export default App;
