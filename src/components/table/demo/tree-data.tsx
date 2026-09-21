/**
 * title: 树形数据展示
 * description: 通过 Tree Data 展示父子层级并支持展开、收起；切换 `checkStrictly` 可控制父子节点的选择是否联动，该能力需要 Enterprise。
 */
import React, { useMemo, useState } from 'react';
import type {
  ColDef,
  RowSelectionOptions,
  SelectionChangedEvent,
} from 'gzd/gzd-table';
import { Space, Switch, Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  children?: DataType[];
}

const columnDefs: ColDef<DataType>[] = [
  { headerName: 'Age', field: 'age', width: 120 },
  { headerName: 'Address', field: 'address', minWidth: 260, flex: 1 },
];

const rowData: DataType[] = [
  {
    key: '1',
    name: 'John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
    children: [
      {
        key: '11',
        name: 'John Brown',
        age: 42,
        address: 'New York No. 2 Lake Park',
      },
      {
        key: '12',
        name: 'John Brown jr.',
        age: 30,
        address: 'New York No. 3 Lake Park',
        children: [
          {
            key: '121',
            name: 'Jimmy Brown',
            age: 16,
            address: 'New York No. 3 Lake Park',
          },
        ],
      },
      {
        key: '13',
        name: 'Jim Green sr.',
        age: 72,
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: '131',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: '1311',
                name: 'Jim Green jr.',
                age: 25,
                address: 'London No. 3 Lake Park',
              },
              {
                key: '1312',
                name: 'Jimmy Green sr.',
                age: 18,
                address: 'London No. 4 Lake Park',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: '2',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
];

const onSelectionChanged = ({ api }: SelectionChangedEvent<DataType>) => {
  console.log(
    'selectedRowKeys:',
    api.getSelectedNodes().flatMap(({ data }) => (data ? [data.key] : [])),
  );
};

const App: React.FC = () => {
  const [checkStrictly, setCheckStrictly] = useState(false);
  const rowSelection = useMemo<RowSelectionOptions<DataType>>(
    () => ({
      mode: 'multiRow',
      checkboxes: true,
      headerCheckbox: true,
      checkboxLocation: 'autoGroupColumn',
      groupSelects: checkStrictly ? 'self' : 'descendants',
    }),
    [checkStrictly],
  );

  return (
    <div className="gz-table-demo-scrollbar-scope">
      <Space align="center" style={{ marginBottom: 16 }}>
        CheckStrictly:
        <Switch checked={checkStrictly} onChange={setCheckStrictly} />
      </Space>
      <div style={{ height: 340 }}>
        <Table<DataType>
          columnDefs={columnDefs}
          rowData={rowData}
          getRowId={({ data }) => data.key}
          treeData
          treeDataChildrenField="children"
          rowSelection={rowSelection}
          onSelectionChanged={onSelectionChanged}
          autoGroupColumnDef={{
            headerName: 'Name',
            field: 'name',
            minWidth: 260,
            flex: 1,
            cellRendererParams: { suppressCount: true },
          }}
          defaultColDef={{
            sortable: false,
            resizable: false,
            suppressMovable: true,
          }}
        />
      </div>
    </div>
  );
};

export default App;
