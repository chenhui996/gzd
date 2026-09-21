/**
 * title: 分页
 * description: 开启 `pagination` 后每页展示 50 条数据，并允许在 2、5、10、20、40、50、100 条之间切换页大小；分页栏同时展示总条数。
 */
import React from 'react';
import { type ColDef, type ICellRendererParams } from 'gzd/gzd-table';
import { Flex, Table, Tag, Tooltip, Button } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  portfolioId: string;
  portfolioName: string;
  manager: string;
  assetClass: string;
  currency: string;
  totalMarketValue: number;
  unrealizedPnL: number;
  ytdReturn: number;
  riskLevel: string;
  volatility: number;
  maxDrawdown: number;
  sharpeRatio: number;
  duration: number;
  cashRatio: number;
  leverageRatio: number;
  benchmark: string;
  lastUpdated: string;
  status: string;
  tags: string[];
}

const NameCellRenderer: React.FC<ICellRendererParams<DataType, string>> = ({ value }) => (
  <Button color="primary" variant="link" style={{padding: '0'}}>
    {value}
  </Button>
);

const NumberCellRenderer: React.FC<ICellRendererParams<DataType, number>> = ({ value }) => {
  if (value == null) return <span>-</span>;
  const color = value < 0 ? 'var(--gzd-color-error)' : (value > 0 ? 'var(--gzd-color-success)' : 'inherit');
  return <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>{value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
};

const PercentCellRenderer: React.FC<ICellRendererParams<DataType, number>> = ({ value }) => {
  if (value == null) return <span>-</span>;
  const color = value < 0 ? 'var(--gzd-color-error)' : (value > 0 ? 'var(--gzd-color-success)' : 'inherit');
  return <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>{(value * 100).toFixed(2)}%</span>;
};

const StatusCellRenderer: React.FC<ICellRendererParams<DataType, string>> = ({ value }) => {
  const colorMap: Record<string, string> = {
    '运行中': 'green',
    '已清盘': 'default',
    '已暂停': 'error',
    '调仓中': 'warning',
  };
  return <Tag color={colorMap[value!] || 'default'}>{value}</Tag>;
};

const TagsCellRenderer: React.FC<ICellRendererParams<DataType, string[]>> = ({ value }) => {
  const tags = value ?? [];

  const content = (
    <Flex gap="small" align="center" wrap={false} style={{ overflow: 'hidden' }}>
      {tags.map((tag) => {
        let color = 'default';
        if (tag === '高收益') color = 'volcano';
        if (tag === 'ESG') color = 'green';
        if (tag === '量化') color = 'geekblue';
        if (tag === '对冲') color = 'purple';

        return (
          <Tag color={color} key={tag} style={{ marginInlineEnd: 0 }}>
            {tag}
          </Tag>
        );
      })}
    </Flex>
  );

  return (
    <Tooltip
      title={
        <Flex gap="small" align="center" wrap style={{ maxWidth: 300 }}>
          {tags.map((tag) => {
            let color = 'default';
            if (tag === '高收益') color = 'volcano';
            if (tag === 'ESG') color = 'green';
            if (tag === '量化') color = 'geekblue';
            if (tag === '对冲') color = 'purple';
            return <Tag color={color} key={tag} bordered={false}>{tag}</Tag>;
          })}
        </Flex>
      }
      placement="topLeft"
    >
      <div style={{ width: '100%', height: '100%' }}>
        {content}
      </div>
    </Tooltip>
  );
};

const ActionCellRenderer: React.FC<ICellRendererParams<DataType>> = ({ data }) => {
  if (!data) return null;
  return (
    <div style={{ display: 'flex', gap: 0, margin: '0 -4px'}}>
      <Button color="primary" variant="link" size="small" style={{padding: '0 4px'}}>交易</Button>
      <Button color="primary" variant="link" size="small" style={{padding: '0 4px'}}>报告</Button>
      <Button color="primary" variant="link" size="small" style={{padding: '0 4px'}}>更多</Button>
    </div>
  );
};

// 定义表格列，20列
const columnDefs: ColDef<DataType>[] = [
  {
    headerName: '序号', // 或者不写，或者写 '#'
    valueGetter: 'node.rowIndex + 1', // node.rowIndex 是从 0 开始的，所以 +1
    width: 50,
    pinned: 'left', // 通常序号列会被固定在左侧
    suppressHeaderMenuButton: true, // 序号列通常不需要表头菜单 (V31+ API)
    sortable: false, // 序号列通常不需要排序
    cellStyle: { paddingLeft: 14 }, // 针对数据行单元格设置左侧内边距
  },
  { headerName: '组合代码', field: 'portfolioId', width: 130, pinned: 'left' },
  { headerName: '组合名称', field: 'portfolioName', minWidth: 200, flex: 1, cellRenderer: NameCellRenderer, pinned: 'left' },
  { headerName: '基金经理', field: 'manager', width: 140 },
  { headerName: '资产类别', field: 'assetClass', width: 140 },
  { headerName: '状态', field: 'status', width: 120, cellRenderer: StatusCellRenderer },
  { headerName: '币种', field: 'currency', width: 80 },
  { headerName: '总市值', field: 'totalMarketValue', width: 160, type: 'numericColumn', valueFormatter: (p) => p.value?.toLocaleString() },
  { headerName: '未实现盈亏', field: 'unrealizedPnL', width: 150, type: 'numericColumn', cellRenderer: NumberCellRenderer },
  { headerName: '年内收益', field: 'ytdReturn', width: 120, type: 'numericColumn', cellRenderer: PercentCellRenderer },
  { headerName: '风险等级', field: 'riskLevel', width: 110 },
  { headerName: '波动率', field: 'volatility', width: 110, type: 'numericColumn', cellRenderer: PercentCellRenderer },
  { headerName: '最大回撤', field: 'maxDrawdown', width: 140, type: 'numericColumn', cellRenderer: PercentCellRenderer },
  { headerName: '夏普比率', field: 'sharpeRatio', width: 100, type: 'numericColumn' },
  { headerName: '久期', field: 'duration', width: 100, type: 'numericColumn' },
  { headerName: '现金比例', field: 'cashRatio', width: 100, type: 'numericColumn', cellRenderer: PercentCellRenderer },
  { headerName: '杠杆率', field: 'leverageRatio', width: 110, type: 'numericColumn', valueFormatter: (p) => `${p.value}x` },
  { headerName: '基准', field: 'benchmark', width: 150 },
  { headerName: '策略标签', field: 'tags', minWidth: 180, cellRenderer: TagsCellRenderer },
  { headerName: '最后更新', field: 'lastUpdated', width: 130 },
  {
    headerName: '操作', width: 121, cellRenderer: ActionCellRenderer, pinned: 'right', resizable: false,
  },
];

// 创造一个10000条的数据，20列
const rowData: DataType[] = Array.from({ length: 10000 }, (_, i) => {
  const assetClasses = ['权益', '固收', '多资产', '另类投资', '货币市场'];
  const managers = ['王建国', '李思思', '张伟', '刘明', '陈雪'];
  const currencies = ['USD', 'CNY', 'HKD', 'EUR'];
  const riskLevels = ['低', '中低', '中', '中高', '高'];
  const benchmarks = ['沪深300', '标普500', '巴克莱美国综指', 'MSCI全球', '中证500'];
  const tagPool = ['高收益', 'ESG', '量化', '对冲', '红利', '成长', '价值'];
  const statuses = ['运行中', '运行中', '运行中', '运行中', '调仓中', '已暂停', '已清盘'];

  const randomTags = tagPool.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
  const mv = Math.floor(Math.random() * 90000000) + 10000000;
  const pnl = (Math.random() - 0.3) * 5000000;

  return {
    key: `PF-${String(i + 1).padStart(5, '0')}`,
    portfolioId: `PF-${String(i + 1).padStart(5, '0')}`,
    portfolioName: `全球${assetClasses[i % assetClasses.length]}策略 ${i + 1}号`,
    manager: managers[Math.floor(Math.random() * managers.length)],
    assetClass: assetClasses[i % assetClasses.length],
    currency: currencies[i % currencies.length],
    totalMarketValue: mv,
    unrealizedPnL: pnl,
    ytdReturn: (Math.random() - 0.3) * 0.4,
    riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
    volatility: Math.random() * 0.3,
    maxDrawdown: -(Math.random() * 0.4),
    sharpeRatio: Number((Math.random() * 3).toFixed(2)),
    duration: Number((Math.random() * 10).toFixed(2)),
    cashRatio: Math.random() * 0.2,
    leverageRatio: Number((1 + Math.random() * 2).toFixed(2)),
    benchmark: benchmarks[Math.floor(Math.random() * benchmarks.length)],
    lastUpdated: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    tags: randomTags,
  };
});

const App: React.FC = () => (
  <div style={{ height: 660 }}>
    <Table<DataType>
      columnDefs={columnDefs}
      rowData={rowData}
      getRowId={({ data }) => data.key}
      pagination
      paginationPageSize={50}
      paginationPageSizeSelector={[2, 5, 10, 20, 40, 50, 100]}
    />
  </div>
);

export default App;
