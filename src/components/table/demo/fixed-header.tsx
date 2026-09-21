/**
 * title: 固定表头
 * description: 为表格容器设置固定高度，纵向滚动数据行时表头保持在容器顶部，适合一页展示较多记录。
 */
import React from "react";
import { AllCommunityModule, type ColDef } from "gzd/gzd-table";
import { Table } from "gzd";
import "./style.less";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: "Name",
    field: "name",
    width: 150,
  },
  {
    headerName: "Age",
    field: "age",
    width: 150,
  },
  {
    headerName: "Address",
    field: "address",
    flex: 1,
    minWidth: 200,
  },
];

const rowData: DataType[] = Array.from({ length: 100 }, (_, index) => ({
  key: String(index),
  name: `Edward King ${index}`,
  age: 32,
  address: `London, Park Lane no. ${index}`,
}));

const App: React.FC = () => (
  <div className="gz-table-demo-scrollbar-scope">
    <div style={{ height: 370 }}>
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
        pagination
        paginationPageSize={50}
        paginationPageSizeSelector={false}
      />
    </div>
  </div>
);

export default App;
