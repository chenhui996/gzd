/**
 * title: 隐藏列
 * description: 勾选或取消字段名称即可动态显示、隐藏对应列；列定义中的 `hide` 状态由当前勾选列表统一控制。
 */
import React, { useMemo, useState } from 'react';
import { AllCommunityModule, type ColDef } from 'gzd/gzd-table';
import { Checkbox, Divider, Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns = Array.from({ length: 8 }, (_, index) => ({
  id: `column-${index + 1}`,
  title: `Column ${index + 1}`,
}));

const defaultCheckedList = columns.map(({ id }) => id);

const rowData: DataType[] = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York Park' },
  { key: '2', name: 'Jim Green', age: 40, address: 'London Park' },
];

const App: React.FC = () => {
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const columnDefs = useMemo<ColDef<DataType>[]>(
    () =>
      columns.map(({ id, title }) => ({
        headerName: title,
        field: 'address',
        colId: id,
        minWidth: 140,
        flex: 1,
        hide: !checkedList.includes(id),
      })),
    [checkedList],
  );

  return (
    <div className="gzd-table-demo-scrollbar-scope">
      <Divider>Columns displayed</Divider>
      <Checkbox.Group
        value={checkedList}
        options={columns.map(({ id, title }) => ({ label: title, value: id }))}
        onChange={(values) => setCheckedList(values.map(String))}
      />
      <div style={{ marginTop: 24 }}>
        <Table<DataType>
          modules={[AllCommunityModule]}
          columnDefs={columnDefs}
          rowData={rowData}
          getRowId={({ data }) => data.key}
          defaultColDef={{
            sortable: false,
            resizable: false,
            suppressMovable: true,
          }}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
};

export default App;
