/**
 * title: 嵌套子表格
 * description: 展开主表行后在详情区域渲染独立的子表格，首行默认展开；嵌套 Detail Grid 依赖 Enterprise Master/Detail。
 */
import React, { useMemo } from 'react';
import type {
  ColDef,
  GridOptions,
  ICellRendererParams,
  IDetailCellRendererParams,
} from 'gzd/gzd-table';
import { Badge, Space, Table } from 'gzd';
import './style.less';

interface DetailDataType {
  key: string;
  date: string;
  name: string;
  upgradeNum: string;
}

interface DataType {
  key: string;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number;
  creator: string;
  createdAt: string;
  details: DetailDataType[];
}

const detailRowData: DetailDataType[] = Array.from({ length: 3 }, (_, index) => ({
  key: String(index),
  date: '2014-12-24 23:12:00',
  name: 'This is production name',
  upgradeNum: 'Upgraded: 56',
}));

const rowData: DataType[] = Array.from({ length: 3 }, (_, index) => ({
  key: String(index),
  name: 'Screen',
  platform: 'iOS',
  version: '10.3.4.5654',
  upgradeNum: 500,
  creator: 'Jack',
  createdAt: '2014-12-24 23:12:00',
  details: detailRowData.map((item) => ({ ...item, key: `${index}-${item.key}` })),
}));

const DetailActionCellRenderer: React.FC = () => (
  <Space size="small">
    <a>Pause</a>
    <a>Stop</a>
    <a>More</a>
  </Space>
);

const StatusCellRenderer: React.FC = () => <Badge status="success" text="Finished" />;

const PublishCellRenderer: React.FC<ICellRendererParams<DataType>> = () => <a>Publish</a>;

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 140,
    cellRenderer: 'agGroupCellRenderer',
  },
  { headerName: 'Platform', field: 'platform', width: 110 },
  { headerName: 'Version', field: 'version', minWidth: 140 },
  { headerName: 'Upgraded', field: 'upgradeNum', width: 110 },
  { headerName: 'Creator', field: 'creator', width: 100 },
  { headerName: 'Date', field: 'createdAt', minWidth: 180, flex: 1 },
  {
    headerName: 'Action',
    colId: 'operation',
    width: 100,
    cellRenderer: PublishCellRenderer,
  },
];

const detailColumnDefs: ColDef<DetailDataType>[] = [
  { headerName: 'Date', field: 'date', minWidth: 180 },
  { headerName: 'Name', field: 'name', minWidth: 190, flex: 1 },
  {
    headerName: 'Status',
    colId: 'status',
    width: 120,
    cellRenderer: StatusCellRenderer,
  },
  { headerName: 'Upgrade Status', field: 'upgradeNum', minWidth: 140 },
  {
    headerName: 'Action',
    colId: 'operation',
    minWidth: 180,
    cellRenderer: DetailActionCellRenderer,
  },
];

const App: React.FC = () => {
  const detailCellRendererParams = useMemo<
    Partial<IDetailCellRendererParams<DataType, DetailDataType>>
  >(
    () => ({
      detailGridOptions: {
        columnDefs: detailColumnDefs,
        getRowId: ({ data }) => data.key,
        defaultColDef: {
          sortable: false,
          resizable: false,
          suppressMovable: true,
        },
      } satisfies GridOptions<DetailDataType>,
      getDetailRowData: ({ data, successCallback }) => successCallback(data.details),
    }),
    [],
  );

  return (
    <div className="gzd-table-demo-scrollbar-scope" style={{ height: 330 }}>
      <Table<DataType>
        columnDefs={columnDefs}
        rowData={rowData}
        getRowId={({ data }) => data.key}
        masterDetail
        isRowMaster={() => true}
        detailCellRendererParams={detailCellRendererParams}
        detailRowHeight={150}
        onFirstDataRendered={({ api }) => api.getRowNode('0')?.setExpanded(true)}
        defaultColDef={{
          sortable: false,
          resizable: false,
          suppressMovable: true,
        }}
      />
    </div>
  );
};

export default App;
