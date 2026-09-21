/**
 * title: 状态与事件拦截 (State & Cell Events)
 * description: 演示了对单元格生命周期事件的精细控制。双击行可弹出消息，并通过 `suppressKeyboardEvent` 拦截了默认的 Enter 键换行行为。
 */
import React, { useMemo, useCallback } from 'react';
import { Table, message } from 'gzd';
import type { 
  ColDef, 
  CellDoubleClickedEvent,
  SuppressKeyboardEventParams 
} from 'ag-grid-community';

interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  status: 'Todo' | 'In Progress' | 'Done';
}

const rowData: TaskItem[] = [
  { id: 'T-01', title: '完成首页 UI 设计', assignee: 'Alice', status: 'Done' },
  { id: 'T-02', title: '接入登录注册 API', assignee: 'Bob', status: 'In Progress' },
  { id: 'T-03', title: '编写组件库使用文档', assignee: 'Charlie', status: 'Todo' },
  { id: 'T-04', title: '优化表格渲染性能', assignee: 'Dave', status: 'In Progress' },
  { id: 'T-05', title: '修复头部固定时的错位 Bug', assignee: 'Eve', status: 'Todo' },
];

const App: React.FC = () => {
  const columnDefs = useMemo<ColDef<TaskItem>[]>(() => [
    { field: 'id', headerName: '任务 ID', width: 100 },
    { field: 'title', headerName: '任务名称', flex: 1, editable: true },
    { field: 'assignee', headerName: '负责人', width: 120 },
    { field: 'status', headerName: '状态', width: 120 },
  ], []);

  // 拦截键盘事件：禁止使用 Enter 键默认的编辑或换行行为，将其重写为弹出提示
  const suppressKeyboardEvent = useCallback((params: SuppressKeyboardEventParams<TaskItem>) => {
    const { event } = params;
    if (event && event.key === 'Enter') {
      message.info(`你按下了 Enter 键，默认的默认编辑行为已被拦截。当前单元格: ${params.colDef.headerName}`);
      return true; // 返回 true 表示拦截该事件
    }
    return false; // 其他键放行
  }, []);

  // 单元格双击事件
  const onCellDoubleClicked = useCallback((event: CellDoubleClickedEvent<TaskItem>) => {
    // 如果不是可编辑的单元格，我们给个双击提示
    if (!event.colDef.editable) {
      message.success(`你双击了不可编辑的单元格，行数据: ${event.data?.title}`);
    }
  }, []);

  return (
    <div style={{ height: 350 }}>
      <Table<TaskItem>
        rowData={rowData}
        columnDefs={columnDefs}
        onCellDoubleClicked={onCellDoubleClicked}
        defaultColDef={{ suppressKeyboardEvent }}
      />
    </div>
  );
};

export default App;
