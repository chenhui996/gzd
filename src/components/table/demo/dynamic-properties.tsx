/**
 * title: 动态控制表格属性
 * description: 使用开关实时控制边框、行密度、加载状态、分页、表头和行展开，演示 Table 属性随 React 状态更新的效果。
 */
import React, { useState } from 'react';
import type { ColDef, ICellRendererParams } from 'gzd/gzd-table';
import { Flex, Switch, Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  description: string;
}

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 180,
    flex: 1,
    cellRenderer: 'agGroupCellRenderer',
  },
  { headerName: 'Age', field: 'age', width: 100 },
  { headerName: 'Address', field: 'address', minWidth: 240, flex: 2 },
];

const rowData: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'This is the detail content for John Brown.',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'This is the detail content for Jim Green.',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    description: 'This is the detail content for Joe Black.',
  },
];

const DetailCellRenderer: React.FC<ICellRendererParams<DataType>> = ({ data }) => (
  <div style={{ padding: '16px 24px' }}>{data?.description}</div>
);

const App: React.FC = () => {
  const [bordered, setBordered] = useState(false);
  const [compact, setCompact] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [expandable, setExpandable] = useState(false);

  return (
    <Flex className="gzd-table-demo-scrollbar-scope" gap="medium" vertical>
      <Flex align="center" gap="medium" wrap>
        <Switch checked={bordered} checkedChildren="Bordered" unCheckedChildren="Plain" onChange={setBordered} />
        <Switch checked={compact} checkedChildren="Compact" unCheckedChildren="Normal" onChange={setCompact} />
        <Switch checked={loading} checkedChildren="Loading" unCheckedChildren="Ready" onChange={setLoading} />
        <Switch checked={pagination} checkedChildren="Pagination" unCheckedChildren="All rows" onChange={setPagination} />
        <Switch checked={showHeader} checkedChildren="Header" unCheckedChildren="No header" onChange={setShowHeader} />
        <Switch checked={expandable} checkedChildren="Expandable" unCheckedChildren="Plain" onChange={setExpandable} />
      </Flex>
      <div className={bordered ? 'gzd-table-demo-dynamic-bordered' : undefined} style={{ height: 300 }}>
        <Table<DataType>
          key={expandable ? 'master-detail' : 'plain'}
          columnDefs={columnDefs}
          rowData={rowData}
          getRowId={({ data }) => data.key}
          loading={loading}
          headerHeight={showHeader ? 31 : 0}
          rowHeight={compact ? 28 : 40}
          pagination={pagination}
          paginationPageSize={2}
          paginationPageSizeSelector={false}
          masterDetail={expandable}
          isRowMaster={() => expandable}
          detailCellRenderer={expandable ? DetailCellRenderer : undefined}
          detailCellRendererParams={expandable ? {} : undefined}
          detailRowHeight={68}
          defaultColDef={{
            sortable: false,
            resizable: false,
            suppressMovable: true,
          }}
        />
      </div>
    </Flex>
  );
};

export default App;
