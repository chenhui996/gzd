/**
 * title: 可编辑行
 * description: 点击 Edit 进入整行编辑，可保存修改或取消并恢复原值；翻页时会自动结束当前编辑状态。
 */
import React, { useCallback, useMemo, useState } from 'react';
import {
  AllCommunityModule,
  type ColDef,
  type GridApi,
  type ICellRendererParams,
  type PaginationChangedEvent,
  type RowValueChangedEvent,
} from 'gzd/gzd-table';
import { Button, Popconfirm, Space, Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

interface ActionCellRendererParams extends ICellRendererParams<DataType> {
  editingKey: string | null;
  onCancel: (api: GridApi<DataType>) => void;
  onEdit: (key: string, api: GridApi<DataType>, rowIndex: number) => void;
  onSave: (api: GridApi<DataType>) => void;
}

const initialRowData: DataType[] = Array.from({ length: 100 }, (_, index) => ({
  key: String(index),
  name: `Edward ${index}`,
  age: 32,
  address: `London Park no. ${index}`,
}));

const ActionCellRenderer: React.FC<ActionCellRendererParams> = ({
  api,
  data,
  editingKey,
  node,
  onCancel,
  onEdit,
  onSave,
}) => {
  if (!data) {
    return null;
  }

  if (editingKey === data.key) {
    return (
      <Space size="small">
        <a onClick={() => onSave(api)}>Save</a>
        <Popconfirm title="Sure to cancel?" onConfirm={() => onCancel(api)}>
          <a>Cancel</a>
        </Popconfirm>
      </Space>
    );
  }

  return (
    <Button
      disabled={editingKey !== null}
      onClick={() => onEdit(data.key, api, node.rowIndex ?? 0)}
      size="small"
      type="link"
    >
      Edit
    </Button>
  );
};

const App: React.FC = () => {
  const [rowData, setRowData] = useState(initialRowData);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const handleEdit = useCallback(
    (key: string, api: GridApi<DataType>, rowIndex: number) => {
      setEditingKey(key);
      requestAnimationFrame(() => {
        api.startEditingCell({ rowIndex, colKey: 'name' });
      });
    },
    [],
  );

  const handleSave = useCallback((api: GridApi<DataType>) => {
    api.stopEditing(false);
    setEditingKey(null);
  }, []);

  const handleCancel = useCallback((api: GridApi<DataType>) => {
    api.stopEditing(true);
    setEditingKey(null);
  }, []);

  const columnDefs = useMemo<ColDef<DataType>[]>(
    () => [
      {
        headerName: 'name',
        field: 'name',
        minWidth: 180,
        flex: 1,
        editable: ({ data }) => data?.key === editingKey,
      },
      {
        headerName: 'age',
        field: 'age',
        width: 120,
        editable: ({ data }) => data?.key === editingKey,
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: { min: 0, precision: 0 },
      },
      {
        headerName: 'address',
        field: 'address',
        minWidth: 260,
        flex: 2,
        editable: ({ data }) => data?.key === editingKey,
      },
      {
        headerName: 'operation',
        colId: 'operation',
        minWidth: 150,
        cellRenderer: ActionCellRenderer,
        cellRendererParams: {
          editingKey,
          onCancel: handleCancel,
          onEdit: handleEdit,
          onSave: handleSave,
        },
      },
    ],
    [editingKey, handleCancel, handleEdit, handleSave],
  );

  const handleRowValueChanged = ({ data }: RowValueChangedEvent<DataType>) => {
    if (!data) {
      return;
    }
    setRowData((current) =>
      current.map((item) => (item.key === data.key ? { ...data } : item)),
    );
  };

  const handlePaginationChanged = ({ api, newPage }: PaginationChangedEvent<DataType>) => {
    if (newPage && editingKey !== null) {
      handleCancel(api);
    }
  };

  return (
    <div className="gzd-table-demo-scrollbar-scope" style={{ height: 390 }}>
      <Table<DataType>
        modules={[AllCommunityModule]}
        columnDefs={columnDefs}
        rowData={rowData}
        getRowId={({ data }) => data.key}
        editType="fullRow"
        suppressClickEdit
        suppressCellFocus={false}
        stopEditingWhenCellsLoseFocus={false}
        onRowValueChanged={handleRowValueChanged}
        onPaginationChanged={handlePaginationChanged}
        pagination
        paginationPageSize={10}
        paginationPageSizeSelector={false}
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
