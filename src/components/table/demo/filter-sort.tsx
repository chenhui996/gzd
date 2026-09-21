/**
 * title: 筛选和排序
 * description: Name 和 Address 列提供固定选项筛选，Name 的候选项按树形分组；Age 默认倒序，各列状态变化时输出当前筛选和排序模型。
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
  values: ['Joe', 'Jim', 'Green', 'Black'],
  defaultToNothingSelected: true,
  suppressMiniFilter: true,
  suppressSorting: true,
  treeList: true,
  treeListPathGetter: (value) => {
    if (!value) {
      return null;
    }

    return value === 'Green' || value === 'Black' ? ['Submenu', value] : [value];
  },
};

const addressFilterParams: ISetFilterParams<DataType, string> = {
  values: ['London', 'New York'],
  defaultToNothingSelected: true,
  suppressMiniFilter: true,
  suppressSorting: true,
};

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 180,
    flex: 1,
    sortable: true,
    comparator: (nameA = '', nameB = '') => nameA.length - nameB.length,
    sortingOrder: ['desc', null],
    filter: 'agSetColumnFilter',
    filterParams: nameFilterParams,
    filterValueGetter: ({ data }) => data?.name.split(' ') ?? [],
    suppressHeaderMenuButton: false,
  },
  {
    headerName: 'Age',
    field: 'age',
    width: 120,
    sortable: true,
    comparator: (ageA = 0, ageB = 0) => ageA - ageB,
    initialSort: 'desc',
  },
  {
    headerName: 'Address',
    field: 'address',
    minWidth: 260,
    flex: 2,
    filter: 'agSetColumnFilter',
    filterParams: addressFilterParams,
    suppressHeaderMenuButton: false,
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
  const sorter = api
    .getColumnState()
    .filter(({ sort }) => sort)
    .map(({ colId, sort, sortIndex }) => ({ field: colId, order: sort, sortIndex }));

  console.log('params', {
    filters: api.getFilterModel(),
    sorter,
  });
};

const App: React.FC = () => (
  <div className="gzd-table-demo-scrollbar-scope">
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
