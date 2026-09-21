/**
 * title: 自动高度
 * description: 在固定高度容器中切换少量和多量数据，表格始终填满可用高度；数据超过一页时可通过分页继续浏览。
 */
import React, { useState } from "react";
import { AllCommunityModule, type ColDef } from "gzd/gzd-table";
import { Flex, Switch, Table } from "gzd";
import "./style.less";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columnDefs: ColDef<DataType>[] = [
  { headerName: "Name", field: "name", minWidth: 180, flex: 1 },
  { headerName: "Age", field: "age", width: 120 },
  { headerName: "Address", field: "address", minWidth: 260, flex: 3 },
];

const generateData = (length: number): DataType[] =>
  Array.from({ length }, (_, index) => ({
    key: String(index),
    name: `Edward King ${index}`,
    age: 32 + index,
    address: `London, Park Lane no. ${index}`,
  }));

const dataMore = generateData(30);
const dataLess = generateData(2);

const App: React.FC = () => {
  const [hasMoreData, setHasMoreData] = useState(true);

  return (
    <Flex
      className="gzd-table-demo-scrollbar-scope"
      align="start"
      gap="middle"
      vertical
    >
      <Switch
        checked={hasMoreData}
        checkedChildren="More Data"
        unCheckedChildren="Less Data"
        onChange={setHasMoreData}
      />
      <div
        style={{
          alignSelf: "stretch",
          background: "rgba(140, 140, 140, 0.03)",
          boxSizing: "border-box",
          height: 280,
          padding: 16,
        }}
      >
        <div style={{ height: "100%" }}>
          <Table<DataType>
            modules={[AllCommunityModule]}
            columnDefs={columnDefs}
            rowData={hasMoreData ? dataMore : dataLess}
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
    </Flex>
  );
};

export default App;
