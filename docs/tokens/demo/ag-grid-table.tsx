/**
 * title: Table 跟随文档主题
 * description: 文档根节点已由 ConfigProvider 包裹；选择 Gold Dark / Light 时，Table 会自动应用对应的 AG Grid 专属 Token。
 */
import React from 'react';
import { Table } from 'gzd';
import type { ColDef } from 'gzd/gzd-table';

interface RowData {
  id: string;
  name: string;
  department: string;
  amount: number;
}

const columnDefs: ColDef<RowData>[] = [
  { field: 'name', headerName: '姓名', flex: 1 },
  { field: 'department', headerName: '部门', flex: 1 },
  { field: 'amount', headerName: '金额', flex: 1 },
];

const rowData: RowData[] = [
  { id: '1', name: '张三', department: '研发部', amount: 1200 },
  { id: '2', name: '李四', department: '设计部', amount: 860 },
  { id: '3', name: '王五', department: '产品部', amount: 1500 },
];

const App: React.FC = () => (
  <div style={{ height: 300 }}>
    <Table<RowData>
      columnDefs={columnDefs}
      rowData={rowData}
      getRowId={({ data }) => data.id}
      defaultColDef={{ sortable: false, resizable: false }}
      pagination={false}
    />
  </div>
);

export default App;
