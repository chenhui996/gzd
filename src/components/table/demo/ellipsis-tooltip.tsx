/**
 * title: 自定义单元格省略提示
 * description: 设置 `tooltipShowMode="whenTruncated"`，仅当 Address 内容被列宽截断时显示自定义 Tooltip，完整内容不重复提示。
 */
import React from "react";
import {
  AllCommunityModule,
  type ColDef,
  type ITooltipParams,
} from "gzd/gzd-table";
import { Table } from "gzd";
import "./style.less";

interface DataType {
  key: string;
  name: string;
  address: string;
}

const CustomTooltip: React.FC<ITooltipParams<DataType, string>> = ({
  value,
}) => (
  <div
    style={{
      maxWidth: 320,
      padding: "8px 12px",
      color: "#fff",
      background: "#333",
      borderRadius: 4,
      whiteSpace: "normal",
      wordBreak: "break-word",
    }}
  >
    {value}
  </div>
);

const columnDefs: ColDef<DataType>[] = [
  { headerName: "Name", field: "name", width: 180 },
  {
    headerName: "Address",
    field: "address",
    minWidth: 240,
    flex: 1,
    tooltipField: "address",
    tooltipComponent: CustomTooltip,
  },
];

const rowData: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    address:
      "New York No. 1 Lake Park, a long address with extra details shown in the custom tooltip.New York No. 1 Lake Park, a long address with extra details shown in the custom tooltip",
  },
  { key: "2", name: "Jim Green", address: "London No. 1 Lake Park" },
  { key: "3", name: "Joe Black", address: "Sidney No. 1 Lake Park" },
];

const App: React.FC = () => (
  <div className="gz-table-demo-scrollbar-scope gz-table-demo-ellipsis">
    <Table<DataType>
      modules={[AllCommunityModule]}
      columnDefs={columnDefs}
      rowData={rowData}
      getRowId={({ data }) => data.key}
      tooltipShowMode="whenTruncated"
      defaultColDef={{
        sortable: false,
        resizable: false,
        suppressMovable: true,
      }}
      domLayout="autoHeight"
    />
  </div>
);

export default App;
