/**
 * title: 拖拽排序
 * description: 开启 `rowDragManaged` 和 `rowDragEntireRow` 后可拖动整行排序，拖拽结束时将新的行顺序同步回 React 状态。
 */
import React, { useCallback, useState } from 'react';
import {
  AllCommunityModule,
  type ColDef,
  type RowDragEndEvent,
} from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columnDefs: ColDef<DataType>[] = [
  { headerName: 'Name', field: 'name', minWidth: 160, flex: 1 },
  { headerName: 'Age', field: 'age', width: 100 },
  { headerName: 'Address', field: 'address', minWidth: 260, flex: 2 },
];

const initialRowData: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address:
      'Long text Long text Long text Long text Long text Long text Long text Long text Long text',
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
    address: 'Sidney No. 1 Lake Park',
  },
];

const App: React.FC = () => {
  const [rowData, setRowData] = useState(initialRowData);

  const handleRowDragEnd = useCallback(({ api }: RowDragEndEvent<DataType>) => {
    const nextRowData: DataType[] = [];
    api.forEachNodeAfterFilterAndSort((node) => {
      if (node.data) {
        nextRowData.push(node.data);
      }
    });
    setRowData(nextRowData);
  }, []);

  return (
    <div className="gz-table-demo-scrollbar-scope" style={{ height: 150 }}>
      <Table<DataType>
        modules={[AllCommunityModule]}
        columnDefs={columnDefs}
        rowData={rowData}
        getRowId={({ data }) => data.key}
        rowDragManaged
        rowDragEntireRow
        animateRows
        onRowDragEnd={handleRowDragEnd}
        getRowStyle={() => ({ cursor: 'move' })}
        defaultColDef={{
          sortable: false,
          resizable: false,
          suppressMovable: true,
        }}
      />
    </div>
  );
};

export default App;
