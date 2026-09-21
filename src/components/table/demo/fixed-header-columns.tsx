/**
 * title: 固定头和列
 * description: 表格使用固定高度并将首尾关键列分别固定在两侧，可同时纵向浏览大量数据、横向查看完整列内容。
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

const addressColumnDefs: ColDef<DataType>[] = Array.from(
  { length: 20 },
  (_, index) => ({
    headerName: `Column ${index + 1}`,
    field: "address",
    colId: `address-${index + 1}`,
    width: 150,
  }),
);

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: "Full Name",
    field: "name",
    width: 120,
    pinned: "left",
    lockPinned: true,
  },
  {
    headerName: "Age",
    field: "age",
    width: 100,
    pinned: "left",
    lockPinned: true,
  },
  ...addressColumnDefs,
  {
    headerName: "Action",
    colId: "action",
    width: 100,
    pinned: "right",
    lockPinned: true,
    cellRenderer: () => <a>action</a>,
  },
];

const rowData: DataType[] = Array.from({ length: 100 }, (_, index) => ({
  key: String(index),
  name: `Edward King ${index}`,
  age: 32,
  address: `London, Park Lane no. ${index}`,
}));

const App: React.FC = () => (
  <div className="gzd-table-demo-scrollbar-scope">
    <div style={{ height: 280 }}>
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
        paginationPageSize={10}
        paginationPageSizeSelector={false}
      />
    </div>
  </div>
);

export default App;
