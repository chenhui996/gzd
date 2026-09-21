/**
 * title: 合并表头 (多级分组)
 * description: 通过在 `columnDefs` 中嵌套 `children` 属性，可以实现多层级的复杂表头（合并表头）。本示例展示了跨越三级的表头结构，并利用 `columnGroupShow` 属性实现了某些次要列在分组展开/收起时的动态显示。
 */
import { useMemo }
  from 'react';
import { Table } from 'gzd';
import type { ColDef, ColGroupDef } from 'ag-grid-community';

export default () => {
  // 生成高密度 Mock 数据（100行 x 16列），确保同时出现横纵滚动条
  const rowData = useMemo(() => {
    const departments = ['研发部', '产品部', '设计部', '市场部', '运营部'];
    const roles = ['前端开发', '后端开发', '产品经理', 'UI设计师', '市场专员'];
    const statuses = ['进行中', '已完成', '已延期', '待启动'];

    return Array.from({ length: 100 }).map((_, index) => {
      const id = index + 1;
      return {
        id,
        name: `员工 ${id}`,
        age: 22 + (id % 20),
        gender: id % 2 === 0 ? '男' : '女',
        department: departments[id % departments.length],
        role: roles[id % roles.length],
        email: `employee${id}@example.com`,
        phone: `138${String(id).padStart(8, '0')}`,
        address: `某某市某某区某某街道 ${id} 号楼`,
        emergencyContact: `家属 ${id}`,
        score: 60 + (id % 40) + Number(Math.random().toFixed(2)),
        salary: 10000 + (id * 150),
        bonus: 2000 + (id * 50),
        project: `代号 Project ${String.fromCharCode(65 + (id % 10))}`,
        status: statuses[id % statuses.length],
        joinDate: `202${id % 4}-0${(id % 9) + 1}-1${id % 9}`,
      };
    });
  }, []);

  // 定义包含嵌套分组的列配置
  const columnDefs = useMemo<(ColDef | ColGroupDef)[]>(() => [
    // 冻结在左侧的列
    { field: 'id', headerName: 'ID', width: 80, pinned: 'left' },
    { field: 'name', headerName: '姓名', width: 120, pinned: 'left' },

    // 第一大分组：HR 信息 (可展开)
    {
      headerName: 'HR 信息 (展开查看更多)',
      groupId: 'hrInfo', // 为分组指定一个 ID
      children: [
        // 第二层分组：基础信息
        {
          headerName: '基础信息',
          children: [
            { field: 'age', headerName: '年龄', width: 100 },
            { field: 'gender', headerName: '性别', width: 100 },
            { field: 'department', headerName: '部门', width: 140 },
            { field: 'role', headerName: '角色', width: 140 },
          ]
        },
        // 第二层分组：联系方式
        {
          headerName: '联系方式',
          children: [
            // 默认显示的列 (不配置 columnGroupShow)
            { field: 'phone', headerName: '手机号', width: 150 },
            // 只有在顶级分组(hrInfo)展开时才显示的列 (配置 columnGroupShow: 'open')
            { field: 'email', headerName: '邮箱', width: 220, columnGroupShow: 'open' },
            { field: 'address', headerName: '联系地址', width: 280, columnGroupShow: 'open' },
            { field: 'emergencyContact', headerName: '紧急联系人', width: 150, columnGroupShow: 'open' },
          ]
        }
      ]
    },

    // 第二大分组：业务数据
    {
      headerName: '业务数据',
      children: [
        {
          headerName: '薪酬与绩效',
          children: [
            { field: 'score', headerName: '绩效得分', width: 140, filter: 'agNumberColumnFilter' },
            { field: 'salary', headerName: '基本薪资', width: 140 },
            { field: 'bonus', headerName: '奖金', width: 140 },
          ]
        },
        {
          headerName: '项目情况',
          children: [
            { field: 'project', headerName: '所属项目', width: 180 },
            { field: 'status', headerName: '状态', width: 120 },
            { field: 'joinDate', headerName: '入职日期', width: 150 },
          ]
        }
      ]
    }
  ], []);

  // 默认列配置
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    minWidth: 100,
  }), []);

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Table
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={50}
      />
    </div>
  );
};
