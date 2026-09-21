/**
 * title: 首列 Checkbox
 * description: 通过 rowSelection 开启多选，AG Grid 自动生成 Checkbox 列，无需在 columnDefs 中手动插入。使用 selectionColumnDef 将选择列固定在最左侧；仅点击复选框切换选择，表头全选覆盖所有页。示例包含 120 条数据，可横向滚动查看选择列的固定效果。
 */
import { useState } from 'react';
import { Table } from 'gzd';
import type {
  ColDef,
  RowSelectionOptions,
  SelectionChangedEvent,
  SelectionColumnDef,
} from 'gzd/gzd-table';

interface Portfolio {
  id: string;
  name: string;
  manager: string;
  assetClass: string;
  currency: string;
  marketValue: number;
  benchmark: string;
  status: string;
  updatedAt: string;
}

const columnDefs: ColDef<Portfolio>[] = [
  { headerName: '组合代码', field: 'id', width: 150 },
  { headerName: '组合名称', field: 'name', width: 240 },
  { headerName: '基金经理', field: 'manager', width: 140 },
  { headerName: '资产类别', field: 'assetClass', width: 140 },
  { headerName: '币种', field: 'currency', width: 100 },
  {
    headerName: '总市值',
    field: 'marketValue',
    width: 180,
    type: 'numericColumn',
    valueFormatter: ({ value }) => value?.toLocaleString('zh-CN'),
  },
  { headerName: '业绩基准', field: 'benchmark', width: 200 },
  { headerName: '运行状态', field: 'status', width: 140 },
  { headerName: '最后更新', field: 'updatedAt', width: 160 },
];

const managers = ['王建国', '李思思', '张伟', '陈雪'];
const assetClasses = ['权益', '固收', '多资产'];
const benchmarks = ['沪深300', '中证全债', '股债均衡指数'];

const rowData: Portfolio[] = Array.from({ length: 120 }, (_, index) => ({
  id: `PF-${String(index + 1).padStart(4, '0')}`,
  name: `${assetClasses[index % assetClasses.length]}精选组合 ${index + 1}号`,
  manager: managers[index % managers.length],
  assetClass: assetClasses[index % assetClasses.length],
  currency: 'CNY',
  marketValue: 10000000 + index * 125000,
  benchmark: benchmarks[index % benchmarks.length],
  status: index % 5 === 0 ? '调仓中' : '运行中',
  updatedAt: `2026-09-${String(index % 20 + 1).padStart(2, '0')}`,
}));

// 选择状态交给 AG Grid 管理，React 只展示已选数量。
const rowSelection: RowSelectionOptions<Portfolio> = {
  mode: 'multiRow',
  checkboxes: true,
  headerCheckbox: true,
  enableClickSelection: false,
  selectAll: 'all',
};

const selectionColumnDef: SelectionColumnDef = {
  pinned: 'left',
  lockPinned: true,
  lockPosition: 'left',
  width: 36,
  resizable: false,
  suppressMovable: true,
};

export default function CheckboxColumnDemo() {
  const [selectedCount, setSelectedCount] = useState(0);

  const handleSelectionChanged = (event: SelectionChangedEvent<Portfolio>) => {
    setSelectedCount(event.api.getSelectedRows().length);
  };

  return (
    <div>
      <p role="status">已选择 {selectedCount} / {rowData.length} 条</p>
      <div style={{ height: 420, maxWidth: 960 }}>
        <Table<Portfolio>
          columnDefs={columnDefs}
          rowData={rowData}
          getRowId={({ data }) => data.id}
          rowSelection={rowSelection}
          selectionColumnDef={selectionColumnDef}
          onSelectionChanged={handleSelectionChanged}
          pagination
          paginationPageSize={40}
          paginationPageSizeSelector={[20, 40, 80]}
        />
      </div>
    </div>
  );
}
