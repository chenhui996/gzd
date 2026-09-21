/**
 * title: 虚拟列表
 * description: 在固定高度容器中加载大量行数据，表格仅渲染可视区域及缓冲区内容；滚动时复用行节点以降低渲染开销。
 */
import React from 'react';
import { AllCommunityModule, type ColDef } from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const rowData: DataType[] = Array.from({ length: 1000 }, (_, index) => ({
  key: String(index),
  name: `Edward King ${index}`,
  age: 20 + (index % 40),
  address: `London, Park Lane no. ${index}`,
}));

const columnDefs: ColDef<DataType>[] = [
  { headerName: 'Name', field: 'name', minWidth: 180, flex: 1 },
  { headerName: 'Age', field: 'age', width: 100 },
  { headerName: 'Address', field: 'address', minWidth: 240, flex: 2 },
];

const App: React.FC = () => (
  <div className="gzd-table-demo-scrollbar-scope" style={{ height: 320 }}>
    <Table<DataType>
      modules={[AllCommunityModule]}
      columnDefs={columnDefs}
      rowData={rowData}
      getRowId={({ data }) => data.key}
      suppressRowVirtualisation={false}
      rowBuffer={10}
      defaultColDef={{
        sortable: false,
        resizable: false,
        suppressMovable: true,
      }}
    />
  </div>
);

export default App;
