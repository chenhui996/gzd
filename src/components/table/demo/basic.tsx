/**
 * title: 基础表格
 * description: 通过 `columnDefs` 定义数据列，使用 `cellRenderer` 渲染姓名链接、标签和行操作，并通过 `getRowId` 为每行指定稳定的业务主键。
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

const rowData: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['kawaii'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const App: React.FC = () => (
  <div className="gzd-table-demo-scrollbar-scope">
    <Table<DataType>
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
);

export default App;
