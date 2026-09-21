/**
 * title: 多列排序
 * description: 开启 `alwaysMultiSort` 后可连续点击多个成绩列排序；无论点击顺序如何，语文、数学、英语始终按预设优先级组合排序。
 */
import React from 'react';
import {
  AllCommunityModule,
  type ColDef,
  type SortChangedEvent,
} from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  chinese: number;
  math: number;
  english: number;
}

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 160,
    flex: 1,
  },
  {
    headerName: 'Chinese Score',
    field: 'chinese',
    minWidth: 150,
    flex: 1,
    sortable: true,
    comparator: (scoreA = 0, scoreB = 0) => scoreA - scoreB,
  },
  {
    headerName: 'Math Score',
    field: 'math',
    minWidth: 150,
    flex: 1,
    sortable: true,
    comparator: (scoreA = 0, scoreB = 0) => scoreA - scoreB,
  },
  {
    headerName: 'English Score',
    field: 'english',
    minWidth: 150,
    flex: 1,
    sortable: true,
    comparator: (scoreA = 0, scoreB = 0) => scoreA - scoreB,
  },
];

const rowData: DataType[] = [
  { key: '1', name: 'John Brown', chinese: 98, math: 60, english: 70 },
  { key: '2', name: 'Jim Green', chinese: 98, math: 66, english: 89 },
  { key: '3', name: 'Joe Black', chinese: 98, math: 90, english: 70 },
  { key: '4', name: 'Jim Red', chinese: 88, math: 99, english: 89 },
];

const sortPriority: Record<string, number> = {
  chinese: 3,
  math: 2,
  english: 1,
};

const onSortChanged = ({ api }: SortChangedEvent<DataType>) => {
  const sortedColumns = api
    .getColumnState()
    .filter(({ sort }) => sort)
    .sort(
      (columnA, columnB) =>
        (sortPriority[columnB.colId] ?? 0) - (sortPriority[columnA.colId] ?? 0),
    );

  const needsPriorityUpdate = sortedColumns.some(
    ({ sortIndex }, index) => sortIndex !== index,
  );

  if (needsPriorityUpdate) {
    api.applyColumnState({
      state: sortedColumns.map(({ colId, sort }, sortIndex) => ({
        colId,
        sort,
        sortIndex,
      })),
      defaultState: { sort: null },
    });
    return;
  }

  console.log('params', sortedColumns);
};

const App: React.FC = () => (
  <div className="gz-table-demo-scrollbar-scope">
    <Table<DataType>
      modules={[AllCommunityModule]}
      columnDefs={columnDefs}
      rowData={rowData}
      getRowId={({ data }) => data.key}
      onSortChanged={onSortChanged}
      alwaysMultiSort
      defaultColDef={{
        sortable: false,
        resizable: false,
        suppressMovable: true,
      }}
      domLayout="autoHeight"
    />
  </div>
);

export default App;
