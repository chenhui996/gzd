/**
 * title: 自定义空状态
 * description: 通过 `noRowsOverlayComponent` 替换默认空状态，并使用 `noRowsOverlayComponentParams` 向空状态组件传递说明文字。
 */
import React, { useState } from 'react';
import { AllCommunityModule, type ColDef } from 'gzd/gzd-table';
import { Button, Empty, Table } from 'gzd';
import './style.less';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

interface CustomEmptyOverlayProps {
  description?: string;
}

const CustomEmptyOverlay: React.FC<CustomEmptyOverlayProps> = ({
  description = 'No data available',
}) => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />;

const columnDefs: ColDef<DataType>[] = [
  { headerName: 'Name', field: 'name', minWidth: 180, flex: 1 },
  { headerName: 'Age', field: 'age', width: 100 },
  { headerName: 'Address', field: 'address', minWidth: 240, flex: 2 },
];

const sampleRowData: DataType[] = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
];

const App: React.FC = () => {
  const [rowData, setRowData] = useState<DataType[]>([]);

  return (
    <div className="gz-table-demo-scrollbar-scope">
      <Button
        type="primary"
        onClick={() => setRowData((current) => (current.length ? [] : sampleRowData))}
        style={{ marginBottom: 16 }}
      >
        {rowData.length ? 'Clear data' : 'Load sample data'}
      </Button>
      <div style={{ height: 180 }}>
        <Table<DataType>
          modules={[AllCommunityModule]}
          columnDefs={columnDefs}
          rowData={rowData}
          getRowId={({ data }) => data.key}
          noRowsOverlayComponent={CustomEmptyOverlay}
          noRowsOverlayComponentParams={{ description: 'No records found' }}
          defaultColDef={{
            sortable: false,
            resizable: false,
            suppressMovable: true,
          }}
        />
      </div>
    </div>
  );
};

export default App;
