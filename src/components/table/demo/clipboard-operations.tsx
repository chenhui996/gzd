/**
 * title: 导入与导出 (Import & Export)
 * description: 开启 `enableRangeSelection` 后，可以使用 `suppressPaste` 对剪贴板的粘贴操作进行拦截。例如：在此演示中，尝试粘贴包含负数的内容将被拒绝。
 */
import React, { useMemo, useCallback } from 'react';
import { Table, message } from 'gzd';
import type { ColDef, ProcessDataFromClipboardParams } from 'ag-grid-community';

interface ScoreRecord {
  id: string;
  name: string;
  math: number;
  english: number;
  science: number;
}

const rowData: ScoreRecord[] = [
  { id: '1', name: '张三', math: 85, english: 92, science: 88 },
  { id: '2', name: '李四', math: 90, english: 80, science: 95 },
  { id: '3', name: '王五', math: 78, english: 85, science: 82 },
];

const App: React.FC = () => {
  const columnDefs = useMemo<ColDef<ScoreRecord>[]>(() => [
    { field: 'name', headerName: '姓名', width: 120 },
    { field: 'math', headerName: '数学 (可粘贴)', flex: 1, editable: true },
    { field: 'english', headerName: '英语 (可粘贴)', flex: 1, editable: true },
    { field: 'science', headerName: '科学 (可粘贴)', flex: 1, editable: true },
  ], []);

  // 拦截并处理粘贴的数据
  const processDataFromClipboard = useCallback((params: ProcessDataFromClipboardParams): string[][] | null => {
    const data = params.data; // 二维数组，表示剪贴板中的行列数据
    let hasError = false;

    // 遍历检查每个粘贴的单元格内容
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const cellValue = data[i][j];
        const numValue = Number(cellValue);
        // 假设分数不能为负数
        if (!isNaN(numValue) && numValue < 0) {
          hasError = true;
          break;
        }
      }
    }

    if (hasError) {
      message.error('粘贴被拦截：数据中包含非法分数（负数），请检查后重试！');
      return null; // 返回 null 即可拦截默认的粘贴行为
    }

    message.success('粘贴成功！');
    return data; // 返回数据允许粘贴
  }, []);

  return (
    <div style={{ height: 300 }}>
      <Table<ScoreRecord>
        rowData={rowData}
        columnDefs={columnDefs}
        enableRangeSelection={true} // 开启范围选择以支持原生的复制粘贴
        processDataFromClipboard={processDataFromClipboard}
      />
    </div>
  );
};

export default App;
