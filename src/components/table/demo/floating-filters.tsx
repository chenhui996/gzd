/**
 * title: 悬浮过滤器 (Floating Filters)
 * description: 通过在列配置 (`columnDefs`) 或默认列配置 (`defaultColDef`) 中开启 `floatingFilter: true`，可以将过滤输入框直接悬浮展示在表头下方。这种设计为用户提供了最直接、最快速的条件检索入口，无需点击表头菜单即可完成数据过滤。本示例展示了文本、数字等不同类型字段的悬浮过滤体验。
 */
import { useMemo } from 'react';
import { Table } from 'gzd';
import type { ColDef } from 'ag-grid-community';

export default () => {
  // 生成高密度 Mock 数据（100行 x 14列），确保同时出现横纵滚动条
  const rowData = useMemo(() => {
    const departments = ['研发部', '产品部', '设计部', '市场部', '运营部', '财务部'];
    const roles = ['前端开发', '后端开发', '产品经理', 'UI设计师', '市场专员', '财务专员'];
    const statuses = ['进行中', '已完成', '已延期', '待启动'];

    return Array.from({ length: 100 }).map((_, index) => {
      const id = index + 1;
      return {
        id,
        name: `员工 ${id}`,
        age: 22 + (id % 20),
        department: departments[id % departments.length],
        role: roles[id % roles.length],
        status: statuses[id % statuses.length],
        score: 60 + (id % 40) + Number(Math.random().toFixed(2)), // 随机带小数的得分
        salary: 10000 + (id * 150),
        email: `employee${id}@example.com`,
        phone: `138${String(id).padStart(8, '0')}`,
        address: `某某市某某区某某街道 ${id} 号楼`,
        joinDate: `202${id % 4}-0${(id % 9) + 1}-1${id % 9}`,
        project: `代号 Project ${String.fromCharCode(65 + (id % 10))}`,
        remark: id % 5 === 0 ? '重点关注对象' : `正常记录 ${id}`,
      };
    });
  }, []);

  // 列定义配置
  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'id', headerName: 'ID', width: 80, pinned: 'left' },
    { field: 'name', headerName: '姓名', width: 120, pinned: 'left' },
    { field: 'age', headerName: '年龄', width: 120, filter: 'agNumberColumnFilter' },
    { field: 'department', headerName: '部门', width: 150 },
    { field: 'role', headerName: '角色', width: 150 },
    { field: 'status', headerName: '状态', width: 120 },
    { field: 'score', headerName: '绩效得分', width: 140, filter: 'agNumberColumnFilter' },
    { field: 'salary', headerName: '薪资', width: 140, filter: 'agNumberColumnFilter' },
    { field: 'email', headerName: '邮箱', width: 220 },
    { field: 'phone', headerName: '手机号', width: 160 },
    { field: 'address', headerName: '联系地址', width: 280 },
    { field: 'joinDate', headerName: '入职日期', width: 160 },
    { field: 'project', headerName: '所属项目', width: 180, pinned: 'right' },
    { field: 'remark', headerName: '备注', width: 200, pinned: 'right' },
  ], []);

  // 默认列配置：在此处统一开启过滤和悬浮过滤器
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    // 开启列过滤功能
    filter: true,
    // 开启悬浮过滤器（在表头下方直接显示输入框）
    floatingFilter: true,
    minWidth: 100,
  }), []);

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Table
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        // 为了演示方便，这里开启分页（非必须）
        pagination={true}
        paginationPageSize={50}
      />
    </div>
  );
};
