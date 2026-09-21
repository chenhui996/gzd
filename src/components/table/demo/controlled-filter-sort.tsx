/**
 * title: 可控的筛选和排序
 * description: 通过表格 ref 调用 Grid API 设置年龄倒序、清空筛选或同时重置筛选与排序，并在状态变化时读取当前模型。
 */
import React, { useRef } from 'react';
import type {
  AgGridReact,
  ColDef,
  FilterChangedEvent,
  ISetFilterParams,
  SortChangedEvent,
} from 'gzd/gzd-table';
import { Button, Flex, Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const nameFilterParams: ISetFilterParams<DataType, string> = {
  values: ['Joe', 'Jim'],
  suppressMiniFilter: true,
  suppressSorting: true,
};

const addressFilterParams: ISetFilterParams<DataType, string> = {
  values: ['London', 'New York'],
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
    flex: 2,
    sortable: true,
    comparator: (addressA = '', addressB = '') => addressA.length - addressB.length,
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
  console.log('Various parameters', {
    filters: api.getFilterModel(),
    sorter: api.getColumnState().filter(({ sort }) => sort),
  });
};

const App: React.FC = () => {
  const tableRef = useRef<AgGridReact<DataType>>(null);

  const setAgeSort = () => {
    tableRef.current?.api.applyColumnState({
      state: [{ colId: 'age', sort: 'desc', sortIndex: 0 }],
      defaultState: { sort: null },
    });
  };

  const clearFilters = () => {
    tableRef.current?.api.setFilterModel(null);
  };

  const clearAll = () => {
    const api = tableRef.current?.api;

    api?.setFilterModel(null);
    api?.applyColumnState({ defaultState: { sort: null } });
  };

  return (
    <Flex className="gz-table-demo-scrollbar-scope" gap="medium" vertical>
      <Flex gap="small" wrap>
        <Button onClick={setAgeSort}>Sort age</Button>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Flex>
      <Table<DataType>
        ref={tableRef}
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
    </Flex>
  );
};

export default App;
