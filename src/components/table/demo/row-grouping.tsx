/**
 * title: 行分组与聚合 (Row Grouping & Aggregation)
 * description: |
 *   行分组允许将具有相同特征的数据聚合并折叠显示，非常适合组织架构或财务报表的展示。
 *   
 *   - **基础分组 (`rowGroup`)**：决定**初始化状态**。在列配置 (`columnDefs`) 中设置 `rowGroup: true`，表格一加载就会默认按该列的值进行树形分组（如示例中的“部门”列）。
 *   - **动态拖拽分组 (`enableRowGroup`)**：决定**交互权限**。设置全局属性 `rowGroupPanelShow="always"` 可在表头上方开启拖拽面板；同时在列上开启 `enableRowGroup: true`，即允许用户自由拖拽该列进行动态分组（如示例中的“岗位”列）。
 *   - **数据聚合 (`aggFunc`)**：配合 `aggFunc: 'sum'`（或 `min`、`max`、`avg`），表格会自动计算并展示分组节点下所有子项的汇总数据（如示例中对“薪资”和“奖金”进行求和）。
 */
import React, { useMemo } from 'react';
import { Table } from 'gzd';
import type { ColDef } from 'ag-grid-community';

interface Employee {
  id: string;
  department: string;
  role: string;
  name: string;
  age: number;
  joinDate: string;
  city: string;
  performance: string;
  salary: number;
  bonus: number;
  project: string;
  manager: string;
  email: string;
  phone: string;
}

// 动态生成 100 条 Mock 数据，确保有充足的纵向滚动条
const rowData: Employee[] = Array.from({ length: 100 }).map((_, i) => {
  const departments = ['研发部', '设计部', '市场部', '人事部', '财务部', '运营部'];
  const roles = {
    '研发部': ['前端工程师', '后端工程师', '测试工程师', '架构师'],
    '设计部': ['UI 设计师', '交互设计师', '视觉专家'],
    '市场部': ['市场专员', '市场经理', '公关专员'],
    '人事部': ['HR', '招聘专员', '薪酬福利专员'],
    '财务部': ['会计', '出纳', '财务总监'],
    '运营部': ['内容运营', '活动运营', '用户运营'],
  };
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都'];
  const perfs = ['S', 'A', 'B', 'C'];

  const dept = departments[i % departments.length];
  const deptRoles = roles[dept as keyof typeof roles];
  const role = deptRoles[i % deptRoles.length];

  return {
    id: `EMP-${String(i + 1).padStart(4, '0')}`,
    department: dept,
    role: role,
    name: `员工_${i + 1}`,
    age: 22 + (i % 15),
    joinDate: `202${Math.floor(i % 4)}-0${(i % 9) + 1}-1${i % 8}`,
    city: cities[i % cities.length],
    performance: perfs[i % perfs.length],
    salary: 10000 + (i % 20) * 1000,
    bonus: 2000 + (i % 10) * 500,
    project: `核心项目组 ${i % 5 + 1}`,
    manager: `主管_${i % 10 + 1}`,
    email: `emp_${i + 1}@company.com`,
    phone: `138${String(i).padStart(8, '0')}`,
  };
});

const App: React.FC = () => {
  const columnDefs = useMemo<ColDef<Employee>[]>(() => [
    {
      field: 'department',
      headerName: '部门',
      rowGroup: true, // 默认按此列分组
      enableRowGroup: true, // 允许用户将此列拖拽到分组面板中
      hide: true // 分组列默认隐藏，使用 AG Grid 自动生成的 group 列展示
    },
    {
      field: 'role',
      headerName: '岗位',
      width: 150,
      enableRowGroup: true // 允许按岗位分组
    },
    { field: 'name', headerName: '姓名', width: 120, pinned: 'left' },
    { field: 'id', headerName: '工号', width: 120 },
    { field: 'age', headerName: '年龄', width: 100 },
    { field: 'city', headerName: '所在城市', width: 120, enableRowGroup: true },
    { field: 'joinDate', headerName: '入职时间', width: 150 },
    { field: 'performance', headerName: '绩效', width: 100 },
    { field: 'project', headerName: '所属项目', width: 150 },
    { field: 'manager', headerName: '直属主管', width: 120 },
    {
      field: 'salary',
      headerName: '基本薪资',
      width: 150,
      aggFunc: 'sum', // 聚合函数：求和
      valueFormatter: (params) => {
        if (params.value == null) return '-';
        return `¥ ${params.value.toLocaleString()}`;
      }
    },
    {
      field: 'bonus',
      headerName: '奖金',
      width: 150,
      aggFunc: 'sum',
      valueFormatter: (params) => {
        if (params.value == null) return '-';
        return `¥ ${params.value.toLocaleString()}`;
      }
    },
    { field: 'email', headerName: '企业邮箱', width: 200 },
    { field: 'phone', headerName: '联系电话', width: 150 },
  ], []);

  // 配置自动生成的分组列
  const autoGroupColumnDef = useMemo<any>(() => ({
    headerName: '组织架构',
    minWidth: 250,
    pinned: 'left',
    cellRendererParams: {
      suppressCount: false, // 展示该分组下的记录数
    },
  }), []);

  return (
    <div style={{ height: 500 }}>
      <Table<Employee>
        rowData={rowData}
        columnDefs={columnDefs}
        autoGroupColumnDef={autoGroupColumnDef}
        groupDefaultExpanded={-1} // 默认展开所有分组
        rowGroupPanelShow="always" // 始终在表头上方显示拖拽分组面板
        pagination
        paginationPageSize={50}
        paginationPageSizeSelector={[2, 5, 10, 20, 40, 50, 100]}
      />
    </div>
  );
};

export default App;
