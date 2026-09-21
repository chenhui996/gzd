/**
 * title: 响应式
 * description: 监听 `onGridSizeChanged`，在容器跨过预设宽度时自动显示或隐藏次要列；拖动外层容器可观察响应式变化。
 */
import React, { useState } from "react";
import {
  AllCommunityModule,
  type ColDef,
  type GridSizeChangedEvent,
} from "gzd/gzd-table";
import { Table } from "gzd";
import "./style.less";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  email: string;
  phone: string;
}

const columnDefs: ColDef<DataType>[] = [
  { headerName: "Name", field: "name", minWidth: 150, flex: 1 },
  { headerName: "Age", field: "age", width: 90 },
  { headerName: "Address", field: "address", minWidth: 220, flex: 2 },
  {
    headerName: "Email",
    field: "email",
    minWidth: 220,
    flex: 1,
    colId: "email",
  },
  { headerName: "Phone", field: "phone", width: 150, colId: "phone" },
];

const rowData: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    email: "john.brown@example.com",
    phone: "555-0101",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    email: "jim.green@example.com",
    phone: "555-0102",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    email: "joe.black@example.com",
    phone: "555-0103",
  },
];

const App: React.FC = () => {
  const [layout, setLayout] = useState("Wide layout");

  const handleGridSizeChanged = ({
    api,
    clientWidth,
  }: GridSizeChangedEvent<DataType>) => {
    const isNarrow = clientWidth < 640;
    const isMedium = clientWidth < 900;
    api.setColumnsVisible(["email", "phone"], !isMedium);
    api.setColumnsVisible(["age"], !isNarrow);
    const nextLayout = isNarrow
      ? "Compact layout"
      : isMedium
        ? "Medium layout"
        : "Wide layout";
    setLayout((current) => (current === nextLayout ? current : nextLayout));
  };

  return (
    <div className="gz-table-demo-scrollbar-scope">
      <div
        style={{ marginBottom: 12, color: "var(--gz-color-text-secondary)" }}
      >
        {layout} · 调整演示容器大小以查看列的变化。
      </div>
      <div style={{ resize: "horizontal", overflow: "auto", minWidth: 320 }}>
        <Table<DataType>
          modules={[AllCommunityModule]}
          columnDefs={columnDefs}
          rowData={rowData}
          getRowId={({ data }) => data.key}
          onGridSizeChanged={handleGridSizeChanged}
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
