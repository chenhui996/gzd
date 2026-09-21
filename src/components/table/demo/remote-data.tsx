/**
 * title: 远程加载数据
 * description: 通过 Infinite Row Model 按页请求远程数据；分页、姓名排序和性别筛选会转换为请求参数，请求期间显示加载状态。
 */
import React, { useMemo, useState } from 'react';
import {
  AllCommunityModule,
  type ColDef,
  type IDatasource,
  type IGetRowsParams,
  type ITextFilterParams,
} from 'gzd/gzd-table';
import { Table } from 'gzd';
import './style.less';

interface DataType {
  name: string;
  gender: string;
  email: string;
  id: string;
}

interface TextFilterModel {
  filter?: string;
}

const genderFilterParams: ITextFilterParams = {
  buttons: ['reset', 'apply'],
  closeOnApply: true,
  filterOptions: ['equals'],
  maxNumConditions: 1,
  trimInput: true,
};

const columnDefs: ColDef<DataType>[] = [
  {
    headerName: 'Name',
    field: 'name',
    minWidth: 180,
    flex: 1,
    sortable: true,
  },
  {
    headerName: 'Gender',
    field: 'gender',
    width: 140,
    filter: 'agTextColumnFilter',
    filterParams: genderFilterParams,
    suppressHeaderMenuButton: false,
  },
  {
    headerName: 'Email',
    field: 'email',
    minWidth: 260,
    flex: 2,
  },
];

const getRemoteParams = ({
  endRow,
  filterModel,
  sortModel,
  startRow,
}: IGetRowsParams<DataType>) => {
  const pageSize = endRow - startRow;
  const params = new URLSearchParams({
    limit: String(pageSize),
    page: String(Math.floor(startRow / pageSize) + 1),
  });
  const gender = (filterModel.gender as TextFilterModel | undefined)?.filter;
  const sort = sortModel[0];

  if (gender) {
    params.set('gender', gender);
  }
  if (sort) {
    params.set('orderby', sort.colId);
    params.set('order', sort.sort);
  }

  return params;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const datasource = useMemo<IDatasource>(
    () => ({
      getRows: (params: IGetRowsParams<DataType>) => {
        setLoading(true);

        const searchParams = getRemoteParams(params);

        void fetch(
          `https://660d2bd96ddfa2943b33731c.mockapi.io/api/users?${searchParams.toString()}`,
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Request failed: ${response.status}`);
            }

            return response.json() as Promise<unknown>;
          })
          .then((response) => {
            params.successCallback(Array.isArray(response) ? response : [], 100);
          })
          .catch(() => {
            console.log('fetch mock data failed');
            params.failCallback();
          })
          .finally(() => setLoading(false));
      },
    }),
    [],
  );

  return (
    <div className="gz-table-demo-scrollbar-scope">
      <div style={{ height: 360 }}>
        <Table<DataType>
          modules={[AllCommunityModule]}
          columnDefs={columnDefs}
          rowModelType="infinite"
          datasource={datasource}
          getRowId={({ data }) => String(data.id)}
          loading={loading}
          cacheBlockSize={10}
          maxBlocksInCache={2}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
          defaultColDef={{
            sortable: false,
            filter: false,
            resizable: false,
            suppressMovable: true,
          }}
        />
      </div>
    </div>
  );
};

export default App;
