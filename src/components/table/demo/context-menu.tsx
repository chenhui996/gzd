/**
 * title: 自定义右键菜单 (Context Menu)
 * description: 通过配置 `getContextMenuItems` 回调函数，可以完全自定义表格单元格上的右键菜单。你可以混合使用原生菜单项（如 `copy`, `export`）和自定义操作。
 */
import React, { useMemo, useCallback } from 'react';
import { Table, message } from 'gzd';
import type { ColDef, GetContextMenuItemsParams } from 'ag-grid-community';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAt: string;
}

const rowData: FileItem[] = [
  { id: '1', name: '2024年度财务报表.xlsx', type: 'Excel', size: '1.2 MB', updatedAt: '2024-03-01' },
  { id: '2', name: 'Q1市场活动方案.pptx', type: 'PowerPoint', size: '5.6 MB', updatedAt: '2024-02-15' },
  { id: '3', name: '产品需求文档_v2.docx', type: 'Word', size: '2.1 MB', updatedAt: '2024-03-05' },
  { id: '4', name: '用户访谈录音.mp3', type: 'Audio', size: '15.4 MB', updatedAt: '2024-01-20' },
  { id: '5', name: '公司Logo高清版.png', type: 'Image', size: '3.8 MB', updatedAt: '2024-02-28' },
];

const App: React.FC = () => {
  const columnDefs = useMemo<ColDef<FileItem>[]>(() => [
    { field: 'name', headerName: '文件名称', flex: 1 },
    { field: 'type', headerName: '类型', width: 120 },
    { field: 'size', headerName: '大小', width: 120 },
    { field: 'updatedAt', headerName: '修改时间', width: 150 },
  ], []);

  // 自定义右键菜单
  const getContextMenuItems = useCallback((params: GetContextMenuItemsParams): any => {
    // 基础的复制功能
    const result: any[] = ['copy', 'copyWithHeaders', 'separator'];

    // 只有在点击具体行时才显示自定义操作（如果是点击表头或空白处，则没有 node 数据）
    if (params.node && params.node.data) {
      const rowData = params.node.data as FileItem;

      result.push({
        name: `查看 "${rowData.name}" 详情`,
        action: () => {
          message.info(`正在打开文件：${rowData.name}`);
        },
        icon: '<span class="ag-icon ag-icon-eye"></span>', // 可以使用内置图标或自定义 HTML
      });

      result.push({
        name: '下载文件',
        action: () => {
          message.success(`开始下载：${rowData.name}`);
        },
        icon: '<span class="ag-icon ag-icon-save"></span>',
      });

      result.push('separator');

      result.push({
        name: '删除',
        action: () => {
          message.error(`删除了文件：${rowData.name}`);
        },
        icon: '<span class="ag-icon ag-icon-cancel" style="color: red;"></span>',
        cssClasses: ['red-menu-item'], // 可以添加自定义类名修改样式
      });
    }

    // 默认提供导出选项
    result.push('separator', 'export');

    return result;
  }, []);

  return (
    <div style={{ height: 350 }}>
      <Table<FileItem>
        rowData={rowData}
        columnDefs={columnDefs}
        getContextMenuItems={getContextMenuItems}
        allowContextMenuWithControlKey={true} // 允许在 Mac 上使用 Ctrl+Click 触发右键菜单
      />
    </div>
  );
};

export default App;
