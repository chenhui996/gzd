/**
 * title: 拖拽手柄列
 * description: 在 Name 列显示 `rowDrag` 手柄；拖动手柄即可调整行顺序，并在拖拽结束后同步更新 `rowData`。
 */
import React, { useCallback, useState } from 'react';
import { AllCommunityModule, type ColDef, type RowDragEndEvent } from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Sort',
    colId: 'sort',
    width: 72,
    rowDrag: true,
    sortable: false,
    resizable: false,
    suppressMovable: true,
  },
  { headerName: 'Name', field: 'name', minWidth: 160, flex: 1 },
  { headerName: 'Age', field: 'age', width: 100 },
  { headerName: 'Address', field: 'address', minWidth: 260, flex: 2 },
];

const initialRowData: DataType[] = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park' },
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
    <div className="gzd-table-demo-scrollbar-scope" style={{ height: 150 }}>
      <Table<DataType>
        modules={[AllCommunityModule]}
        columnDefs={columnDefs}
        rowData={rowData}
        getRowId={({ data }) => data.key}
        rowDragManaged
        animateRows
        onRowDragEnd={handleRowDragEnd}
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
