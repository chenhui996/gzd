/**
 * title: 分页
 * description: 开启 `pagination` 后每页展示两条数据，并允许在 2、5、10 条之间切换页大小；分页栏同时展示总条数。
 */
import React from 'react';
import { type ColDef, type ICellRendererParams } from 'gzd/gzd-table';
import { Flex, Space, Table, Tag } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const NameCellRenderer: React.FC<ICellRendererParams<DataType, string>> = ({ value }) => (
  <a>{value}</a>
);

const TagsCellRenderer: React.FC<ICellRendererParams<DataType, string[]>> = ({ value }) => (
  <Flex gap="small" align="center" wrap>
    {(value ?? []).map((tag) => {
      let color = tag.length > 5 ? 'geekblue' : 'green';
      if (tag === 'kawaii') {
        color = 'volcano';
      }

      return (
        <Tag color={color} key={tag}>
          {tag.toUpperCase()}
        </Tag>
      );
    })}
  </Flex>
);

const ActionCellRenderer: React.FC<ICellRendererParams<DataType>> = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <Space size="medium">
      <a>Invite {data.name}</a>
      <a>Delete</a>
    </Space>
  );
};

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 160,
    flex: 1,
    cellRenderer: NameCellRenderer,
  },
  {
    headerName: 'Age',
    field: 'age',
    width: 100,
  },
  {
    headerName: 'Address',
    field: 'address',
    minWidth: 240,
    flex: 2,
  },
  {
    headerName: 'Tags',
    field: 'tags',
    minWidth: 180,
    flex: 1,
    cellRenderer: TagsCellRenderer,
  },
  {
    headerName: 'Action',
    minWidth: 240,
    flex: 1,
    cellRenderer: ActionCellRenderer,
  },
];

// 创造一个10000条的数据
const rowData: DataType[] = Array.from({ length: 10000 }, (_, i) => ({
  key: `${i + 1}`,
  name: `Name ${i + 1}`,
  age: Math.floor(Math.random() * 100),
  address: `Address ${i + 1}`,
  tags: ['nice', 'developer'],
}));



const App: React.FC = () => (
  <div style={{ height: 330 }}>
    <Table<DataType>
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
      paginationPageSizeSelector={[2, 5, 10, 20, 40, 50, 100]}
    />
  </div>
);

export default App;
