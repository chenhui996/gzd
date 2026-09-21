/**
 * title: 自定义筛选菜单
 * description: 从 Name 列的表头菜单输入关键词筛选数据，单元格会同步高亮所有匹配文本；重置后恢复完整数据。
 */
import React from 'react';
import {
  AllCommunityModule,
  type ColDef,
  type FilterChangedEvent,
  type ICellRendererParams,
  type ITextFilterParams,
} from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

interface TextFilterModel {
  filter?: string;
}

const textFilterParams: ITextFilterParams = {
  buttons: ['reset', 'apply'],
  closeOnApply: true,
  filterOptions: ['contains'],
  maxNumConditions: 1,
  trimInput: true,
};

const HighlightCellRenderer: React.FC<ICellRendererParams<DataType>> = ({
  api,
  column,
  value,
}) => {
  const text = String(value ?? '');
  const searchText = (
    api.getFilterModel()[column?.getColId() ?? ''] as TextFilterModel | undefined
  )?.filter;

  if (!searchText) {
    return text;
  }

  const matchIndex = text.toLowerCase().indexOf(searchText.toLowerCase());

  if (matchIndex < 0) {
    return text;
  }

  const matchEnd = matchIndex + searchText.length;

  return (
    <>
      {text.slice(0, matchIndex)}
      <mark style={{ backgroundColor: '#ffc069', padding: 0 }}>
        {text.slice(matchIndex, matchEnd)}
      </mark>
      {text.slice(matchEnd)}
    </>
  );
};

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 180,
    flex: 3,
    filter: 'agTextColumnFilter',
    filterParams: textFilterParams,
    cellRenderer: HighlightCellRenderer,
    suppressHeaderMenuButton: false,
  },
  {
    headerName: 'Age',
    field: 'age',
    width: 120,
    filter: 'agTextColumnFilter',
    filterParams: textFilterParams,
    cellRenderer: HighlightCellRenderer,
    suppressHeaderMenuButton: false,
  },
  {
    headerName: 'Address',
    field: 'address',
    minWidth: 260,
    flex: 5,
    sortable: true,
    comparator: (addressA = '', addressB = '') => addressA.length - addressB.length,
    sortingOrder: ['desc', 'asc'],
    filter: 'agTextColumnFilter',
    filterParams: textFilterParams,
    cellRenderer: HighlightCellRenderer,
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
    name: 'Joe Black',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Jim Green',
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

const onFilterChanged = ({ api }: FilterChangedEvent<DataType>) => {
  api.refreshCells({ force: true });
};

const App: React.FC = () => (
  <div className="gzd-table-demo-scrollbar-scope">
    <Table<DataType>
      modules={[AllCommunityModule]}
      columnDefs={columnDefs}
      rowData={rowData}
      getRowId={({ data }) => data.key}
      onFilterChanged={onFilterChanged}
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
