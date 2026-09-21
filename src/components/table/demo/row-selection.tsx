/**
 * title: 多选
 * description: 通过复选框选择多行并实时展示已选数量，指定行不可选择；执行批量操作时显示加载状态，完成后清空选择。
 */
import React, { useRef, useState } from 'react';
import {
  type AgGridReact,
  type ColDef,
  type ICellRendererParams,
  type RowSelectionOptions,
  type SelectionChangedEvent,
} from 'gzd/gzd-table';
import { Button, Flex, Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const NameCellRenderer: React.FC<ICellRendererParams<DataType, string>> = ({ value }) => (
  <a>{value}</a>
);

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 180,
    flex: 1,
    cellRenderer: NameCellRenderer,
  },
  {
    headerName: 'Age',
    field: 'age',
    width: 120,
  },
  {
    headerName: 'Address',
    field: 'address',
    minWidth: 260,
    flex: 2,
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
    name: 'Disabled User',
    age: 99,
    address: 'Sydney No. 1 Lake Park',
  },
];

const rowSelection: RowSelectionOptions<DataType> = {
  mode: 'multiRow',
  checkboxes: true,
  headerCheckbox: true,
  hideDisabledCheckboxes: false,
  isRowSelectable: ({ data }) => data?.name !== 'Disabled User',
};

const App: React.FC = () => {
  const tableRef = useRef<AgGridReact<DataType>>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const start = () => {
    setLoading(true);

    // ajax request after empty completing
    setTimeout(() => {
      tableRef.current?.api.deselectAll();
      setLoading(false);
    }, 1000);
  };

  const onSelectionChanged = ({ selectedNodes }: SelectionChangedEvent<DataType>) => {
    const selectedRows = (selectedNodes ?? []).flatMap(({ data }) => (data ? [data] : []));
    const nextSelectedRowKeys = selectedRows.map(({ key }) => key);

    console.log(`selectedRowKeys: ${nextSelectedRowKeys}`, 'selectedRows: ', selectedRows);
    setSelectedRowKeys(nextSelectedRowKeys);
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Flex className="gz-table-demo-scrollbar-scope" gap="medium" vertical>
      <Flex align="center" gap="medium">
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Reload
        </Button>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
      </Flex>
      <Table<DataType>
        ref={tableRef}
        columnDefs={columnDefs}
        rowData={rowData}
        getRowId={({ data }) => data.key}
        rowSelection={rowSelection}
        selectionColumnDef={{
          width: 48,
          minWidth: 48,
          maxWidth: 48,
          resizable: false,
          suppressMovable: true,
        }}
        onSelectionChanged={onSelectionChanged}
        defaultColDef={{
          sortable: false,
          resizable: false,
          suppressMovable: true,
        }}
        domLayout="autoHeight"
      />
    </Flex>
  );
};

export default App;
