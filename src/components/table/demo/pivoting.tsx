/**
 * title: 数据透视 (Pivoting)
 * description: 开启 `pivotMode={true}` 并配合 `pivot: true`，可以将某一列的值横向展开为多个列，实现类似 Excel 的数据透视表功能。通常需要配合 `rowGroup` 和 `aggFunc` 一起使用。
 */
import React, { useMemo } from 'react';
import { Table } from 'gzd';
import type { ColDef } from 'ag-grid-community';

interface SalesRecord {
  year: string;
  quarter: string;
  product: string;
  sales: number;
}

const rowData: SalesRecord[] = [
  { year: '2023', quarter: 'Q1', product: '手机', sales: 150 },
  { year: '2023', quarter: 'Q2', product: '手机', sales: 180 },
  { year: '2023', quarter: 'Q1', product: '电脑', sales: 300 },
  { year: '2023', quarter: 'Q2', product: '电脑', sales: 320 },
  { year: '2024', quarter: 'Q1', product: '手机', sales: 190 },
  { year: '2024', quarter: 'Q2', product: '手机', sales: 210 },
  { year: '2024', quarter: 'Q1', product: '电脑', sales: 350 },
  { year: '2024', quarter: 'Q2', product: '电脑', sales: 380 },
  { year: '2024', quarter: 'Q1', product: '平板', sales: 80 },
  { year: '2024', quarter: 'Q2', product: '平板', sales: 100 },
];

const App: React.FC = () => {
  const columnDefs = useMemo<ColDef<SalesRecord>[]>(() => [
    { 
      field: 'year', 
      headerName: '年份', 
      rowGroup: true, // 行分组依据
      enableRowGroup: true
    },
    { 
      field: 'product', 
      headerName: '产品', 
      rowGroup: true, // 二级行分组依据
      enableRowGroup: true
    },
    { 
      field: 'quarter', 
      headerName: '季度', 
      pivot: true, // 将该列的值（Q1, Q2）转换为横向的列
      enablePivot: true
    },
    { 
      field: 'sales', 
      headerName: '销售额 (万元)', 
      aggFunc: 'sum', // 聚合函数
    },
  ], []);

  // 默认分组列配置
  const autoGroupColumnDef = useMemo<any>(() => ({
    minWidth: 200,
  }), []);

  return (
    <div style={{ height: 400 }}>
      <Table<SalesRecord>
        rowData={rowData}
        columnDefs={columnDefs}
        autoGroupColumnDef={autoGroupColumnDef}
        pivotMode={true} // 开启透视模式
        groupDefaultExpanded={-1} // 默认展开所有分组
      />
    </div>
  );
};

export default App;
