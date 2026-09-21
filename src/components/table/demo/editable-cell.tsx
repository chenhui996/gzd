/**
 * title: 可编辑单元格
 * description: 双击 Name 单元格进入编辑，提交后同步更新数据；工具栏可新增行，操作列可在确认后删除行。
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  AllCommunityModule,
  type CellValueChangedEvent,
  type ColDef,
  type ICellRendererParams,
} from 'gzd/gzd-table';
import { Button, Popconfirm, Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: string;
  address: string;
}

const initialRowData: DataType[] = [
  {
    key: '0',
    name: 'Edward King 0',
    age: '32',
    address: 'London, Park Lane no. 0',
  },
  {
    key: '1',
    name: 'Edward King 1',
    age: '32',
    address: 'London, Park Lane no. 1',
  },
];

const App: React.FC = () => {
  const [rowData, setRowData] = useState(initialRowData);
  const [count, setCount] = useState(initialRowData.length);

  const handleDelete = useCallback((key: string) => {
    setRowData((current) => current.filter((item) => item.key !== key));
  }, []);

  const columnDefs = useMemo<ColDef<DataType>[]>(
    () => [
      {
        headerName: 'name',
        field: 'name',
        minWidth: 180,
        flex: 1,
        editable: true,
        valueSetter: ({ data, newValue }) => {
          const name = String(newValue ?? '').trim();
          if (!name) {
            return false;
          }
          data.name = name;
          return true;
        },
      },
      {
        headerName: 'age',
        field: 'age',
        width: 100,
      },
      {
        headerName: 'address',
        field: 'address',
        minWidth: 240,
        flex: 2,
      },
      {
        headerName: 'operation',
        colId: 'operation',
        width: 120,
        cellRenderer: ({ data }: ICellRendererParams<DataType>) =>
          data ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(data.key)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ],
    [handleDelete],
  );

  const handleAdd = () => {
    const newRow: DataType = {
      key: String(count),
      name: `Edward King ${count}`,
      age: '32',
      address: `London, Park Lane no. ${count}`,
    };
    setRowData((current) => [...current, newRow]);
    setCount((current) => current + 1);
  };

  const handleCellValueChanged = ({ data }: CellValueChangedEvent<DataType>) => {
    setRowData((current) =>
      current.map((item) => (item.key === data.key ? { ...data } : item)),
    );
  };

  return (
    <div className="gzd-table-demo-scrollbar-scope">
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <Table<DataType>
        modules={[AllCommunityModule]}
        columnDefs={columnDefs}
        rowData={rowData}
        getRowId={({ data }) => data.key}
        singleClickEdit
        stopEditingWhenCellsLoseFocus
        suppressCellFocus={false}
        onCellValueChanged={handleCellValueChanged}
        defaultColDef={{
          sortable: false,
          resizable: false,
          suppressMovable: true,
        }}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default App;
