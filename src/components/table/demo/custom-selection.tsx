/**
 * title: 自定义选择项
 * description: 在选择列表头中提供当前页全选、反选、清空和奇偶行选择；表头复选框会同步反映当前页的选择状态。
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import {
  AllCommunityModule,
  type ColDef,
  type IHeaderParams,
  type RowNode,
  type SelectionChangedEvent,
} from 'gzd/gzd-table';
import { Button, Checkbox, Dropdown, Flex, Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 180,
    flex: 1,
  },
  {
    headerName: 'Age',
    field: 'age',
    width: 120,
  },
  {
    headerName: 'Address',
    field: 'address',
    minWidth: 260,
    flex: 2,
  },
];

const rowData: DataType[] = Array.from({ length: 46 }, (_, index) => ({
  key: String(index),
  name: `Edward King ${index}`,
  age: 32,
  address: `London, Park Lane no. ${index}`,
}));

const SelectionHeader: React.FC<IHeaderParams<DataType>> = ({ api }) => {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  const getCurrentPageNodes = useCallback((): RowNode<DataType>[] => {
    const pageSize = api.paginationGetPageSize();
    const startIndex = api.paginationGetCurrentPage() * pageSize;

    return Array.from({ length: pageSize }, (_, index) =>
      api.getDisplayedRowAtIndex(startIndex + index),
    ).filter((node): node is RowNode<DataType> => node !== undefined);
  }, [api]);

  const refreshSelectionState = useCallback(() => {
    const pageNodes = getCurrentPageNodes();
    const selectedCount = pageNodes.filter((node) => node.isSelected()).length;

    setChecked(pageNodes.length > 0 && selectedCount === pageNodes.length);
    setIndeterminate(selectedCount > 0 && selectedCount < pageNodes.length);
  }, [getCurrentPageNodes]);

  useEffect(() => {
    api.addEventListener('selectionChanged', refreshSelectionState);
    api.addEventListener('paginationChanged', refreshSelectionState);

    return () => {
      api.removeEventListener('selectionChanged', refreshSelectionState);
      api.removeEventListener('paginationChanged', refreshSelectionState);
    };
  }, [api, refreshSelectionState]);

  const selectMatchingRows = (matches: (index: number) => boolean) => {
    api.deselectAll();
    getCurrentPageNodes().forEach((node, index) => node.setSelected(matches(index)));
  };

  const menuItems = useMemo(
    () => [
      { key: 'all', label: 'Select All' },
      { key: 'invert', label: 'Invert Current Page' },
      { key: 'none', label: 'Select None' },
      { type: 'divider' as const },
      { key: 'odd', label: 'Select Odd Row' },
      { key: 'even', label: 'Select Even Row' },
    ],
    [],
  );

  const onMenuClick = ({ key }: { key: string }) => {
    if (key === 'all') {
      api.selectAll('currentPage');
    } else if (key === 'invert') {
      getCurrentPageNodes().forEach((node) => node.setSelected(!node.isSelected()));
    } else if (key === 'none') {
      api.deselectAll();
    } else if (key === 'odd') {
      selectMatchingRows((index) => index % 2 === 0);
    } else if (key === 'even') {
      selectMatchingRows((index) => index % 2 !== 0);
    }
  };

  return (
    <Flex align="center" gap={2}>
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        onChange={(event) => {
          if (event.target.checked) {
            api.selectAll('currentPage');
          } else {
            api.deselectAll('currentPage');
          }
        }}
      />
      <Dropdown menu={{ items: menuItems, onClick: onMenuClick }} trigger={['click']}>
        <Button
          aria-label="Selection actions"
          icon={<DownOutlined />}
          size="small"
          type="text"
        />
      </Dropdown>
    </Flex>
  );
};

const App: React.FC = () => {
  const onSelectionChanged = ({ selectedNodes }: SelectionChangedEvent<DataType>) => {
    const selectedRowKeys = (selectedNodes ?? []).flatMap(({ data }) =>
      data ? [data.key] : [],
    );

    console.log('selectedRowKeys changed: ', selectedRowKeys);
  };

  return (
    <div className="gzd-table-demo-scrollbar-scope">
      <div style={{ height: 360 }}>
        <Table<DataType>
          modules={[AllCommunityModule]}
          columnDefs={columnDefs}
          rowData={rowData}
          getRowId={({ data }) => data.key}
          rowSelection={{
            mode: 'multiRow',
            checkboxes: true,
            headerCheckbox: false,
          }}
          selectionColumnDef={{
            width: 76,
            minWidth: 76,
            maxWidth: 76,
            resizable: false,
            suppressMovable: true,
            headerComponent: SelectionHeader,
          }}
          onSelectionChanged={onSelectionChanged}
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
};

export default App;
