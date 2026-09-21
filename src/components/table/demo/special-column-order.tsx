/**
 * title: 特殊列排序
 * description: 将自定义展开列和选择列插入普通数据列之间，分别控制详情展开与行选择；展开内容使用 Enterprise Master/Detail。
 */
import React, { useCallback, useEffect, useState } from 'react';
import type { ColDef, ICellRendererParams, IHeaderParams } from 'gzd/gzd-table';
import { Button, Checkbox, Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  description: string;
}

const ExpandCellRenderer: React.FC<ICellRendererParams<DataType>> = ({ node }) => {
  const [expanded, setExpanded] = useState(node.expanded);

  useEffect(() => {
    const onExpandedChanged = () => setExpanded(node.expanded);

    node.addEventListener('expandedChanged', onExpandedChanged);
    return () => node.removeEventListener('expandedChanged', onExpandedChanged);
  }, [node]);

  return (
    <Button
      aria-label={expanded ? 'Collapse row' : 'Expand row'}
      onClick={() => node.setExpanded(!node.expanded)}
      size="small"
      type="text"
    >
      {expanded ? '−' : '+'}
    </Button>
  );
};

const SelectionCellRenderer: React.FC<ICellRendererParams<DataType>> = ({ node }) => {
  const [checked, setChecked] = useState(Boolean(node.isSelected()));

  useEffect(() => {
    const onRowSelected = () => setChecked(Boolean(node.isSelected()));

    node.addEventListener('rowSelected', onRowSelected);
    return () => node.removeEventListener('rowSelected', onRowSelected);
  }, [node]);

  return (
    <Checkbox
      aria-label={`Select ${node.data?.name ?? 'row'}`}
      checked={checked}
      onChange={(event) => node.setSelected(event.target.checked)}
    />
  );
};

const SelectionHeader: React.FC<IHeaderParams<DataType>> = ({ api }) => {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  const refreshSelectionState = useCallback(() => {
    let rowCount = 0;
    let selectedCount = 0;

    api.forEachNode((node) => {
      rowCount += 1;
      selectedCount += node.isSelected() ? 1 : 0;
    });
    setChecked(rowCount > 0 && selectedCount === rowCount);
    setIndeterminate(selectedCount > 0 && selectedCount < rowCount);
  }, [api]);

  useEffect(() => {
    api.addEventListener('selectionChanged', refreshSelectionState);
    return () => api.removeEventListener('selectionChanged', refreshSelectionState);
  }, [api, refreshSelectionState]);

  return (
    <Checkbox
      aria-label="Select all rows"
      checked={checked}
      indeterminate={indeterminate}
      onChange={(event) => {
        if (event.target.checked) {
          api.selectAll();
        } else {
          api.deselectAll();
        }
      }}
    />
  );
};

const DetailCellRenderer: React.FC<ICellRendererParams<DataType>> = ({ data }) => (
  <p style={{ margin: 0, padding: '20px 24px' }}>{data?.description}</p>
);

const columnDefs: ColDef<DataType>[] = [
  { headerName: 'Name', field: 'name', minWidth: 180, flex: 1 },
  {
    headerName: '',
    colId: 'expand',
    width: 56,
    cellRenderer: ExpandCellRenderer,
    suppressHeaderMenuButton: true,
  },
  { headerName: 'Age', field: 'age', width: 120 },
  {
    headerName: '',
    colId: 'selection',
    width: 56,
    headerComponent: SelectionHeader,
    cellRenderer: SelectionCellRenderer,
    suppressHeaderMenuButton: true,
  },
  { headerName: 'Address', field: 'address', minWidth: 260, flex: 2 },
];

const rowData: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description:
      'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    key: '3',
    name: 'Not Expandable',
    age: 29,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This not expandable',
  },
  {
    key: '4',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
  },
];

const App: React.FC = () => (
  <div className="gzd-table-demo-scrollbar-scope">
    <div style={{ height: 280 }}>
      <Table<DataType>
        columnDefs={columnDefs}
        rowData={rowData}
        getRowId={({ data }) => data.key}
        rowSelection={{
          mode: 'multiRow',
          checkboxes: false,
          headerCheckbox: false,
          enableClickSelection: false,
        }}
        masterDetail
        detailCellRenderer={DetailCellRenderer}
        detailCellRendererParams={{}}
        detailRowHeight={72}
        defaultColDef={{
          sortable: false,
          resizable: false,
          suppressMovable: true,
        }}
      />
    </div>
  </div>
);

export default App;
