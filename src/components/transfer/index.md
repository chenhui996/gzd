---
group: 数据录入
title: Transfer 穿梭框
---

# Transfer 穿梭框

## 何时使用 {#when-to-use}

- 需要在多个可选项中进行多选时。
- 比起 Select 和 TreeSelect，穿梭框占据更大的空间，可以展示可选项的更多信息。

穿梭选择框用直观的方式在两栏中移动元素，完成选择行为。

选择一个或以上的选项后，点击对应的方向键，可以把选中的选项移动到另一栏。其中，左边一栏为 `source`，右边一栏为 `target`，API 的设计也反映了这两个概念。

> 注意：穿梭框组件只支持受控使用，不支持非受控模式。

## 代码演示

### 基本用法

最基本的用法，展示了 `dataSource`、`targetKeys`、每行的渲染函数 `render` 以及回调函数 `onChange` `onSelectChange` `onScroll` 的用法。

```tsx
import React, { useState } from 'react';
import { Transfer } from 'gzd';
import type { TransferProps } from 'antd';

interface RecordType {
  key: string;
  title: string;
  description: string;
}

const mockData = Array.from({ length: 20 }).map<RecordType>((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
}));

const initialTargetKeys = mockData.filter((item) => Number(item.key) > 10).map((item) => item.key);

const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<TransferProps['targetKeys']>([]);

  const onChange: TransferProps['onChange'] = (nextTargetKeys, direction, moveKeys) => {
    console.log('targetKeys:', nextTargetKeys);
    console.log('direction:', direction);
    console.log('moveKeys:', moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    targetSelectedKeys,
  ) => {
    console.log('sourceSelectedKeys:', sourceSelectedKeys);
    console.log('targetSelectedKeys:', targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll: TransferProps['onScroll'] = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  return (
    <Transfer
      dataSource={mockData}
      titles={['Source', 'Target']}
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      onChange={onChange}
      onSelectChange={onSelectChange}
      onScroll={onScroll}
      render={(item) => item.title}
    />
  );
};

export default App;
```

### 单向样式

通过 `oneWay` 将 Transfer 转为单向样式。

```tsx
import React, { useState } from 'react';
import { Switch, Transfer } from 'gzd';
import type { TransferProps } from 'antd';

interface RecordType {
  key: string;
  title: string;
  description: string;
  disabled: boolean;
}

const mockData = Array.from({ length: 20 }).map<RecordType>((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
  disabled: i % 3 < 1,
}));

const oriTargetKeys = mockData.filter((item) => Number(item.key) % 3 > 1).map((item) => item.key);

const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<React.Key[]>(oriTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [disabled, setDisabled] = useState(false);

  const handleChange: TransferProps['onChange'] = (newTargetKeys, direction, moveKeys) => {
    setTargetKeys(newTargetKeys);

    console.log('targetKeys: ', newTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  };

  const handleSelectChange: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    targetSelectedKeys,
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  const handleScroll: TransferProps['onScroll'] = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  const handleDisable = (checked: boolean) => {
    setDisabled(checked);
  };

  return (
    <>
      <Transfer
        dataSource={mockData}
        titles={['Source', 'Target']}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        onScroll={handleScroll}
        render={(item) => item.title}
        disabled={disabled}
        oneWay
        style={{ marginBottom: 16 }}
      />
      <Switch
        unCheckedChildren="disabled"
        checkedChildren="disabled"
        checked={disabled}
        onChange={handleDisable}
      />
    </>
  );
};

export default App;
```

### 带搜索框

带搜索框的穿梭框，可以自定义搜索函数。

```tsx
import React, { useEffect, useState } from 'react';
import { Transfer } from 'gzd';
import type { TransferProps } from 'antd';

interface RecordType {
  key: string;
  title: string;
  description: string;
  chosen: boolean;
}

const App: React.FC = () => {
  const [mockData, setMockData] = useState<RecordType[]>([]);
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);

  const getMock = () => {
    const tempTargetKeys: React.Key[] = [];
    const tempMockData: RecordType[] = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: i % 2 === 0,
      };
      if (data.chosen) {
        tempTargetKeys.push(data.key);
      }
      tempMockData.push(data);
    }
    setMockData(tempMockData);
    setTargetKeys(tempTargetKeys);
  };

  useEffect(() => {
    getMock();
  }, []);

  const filterOption = (inputValue: string, option: RecordType) =>
    option.description.includes(inputValue);

  const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };

  const handleSearch: TransferProps['onSearch'] = (dir, value) => {
    console.log('search:', dir, value);
  };

  return (
    <Transfer
      dataSource={mockData}
      showSearch
      filterOption={filterOption}
      targetKeys={targetKeys}
      onChange={handleChange}
      onSearch={handleSearch}
      render={(item) => item.title}
    />
  );
};

export default App;
```

### 高级用法

穿梭框高级用法，可配置操作文案，可定制宽高，可对底部进行自定义渲染。

```tsx
import React, { useEffect, useState } from 'react';
import { Button, Transfer } from 'gzd';
import type { TransferProps } from 'antd';

interface RecordType {
  key: string;
  title: string;
  description: string;
  chosen: boolean;
}

const App: React.FC = () => {
  const [mockData, setMockData] = useState<RecordType[]>([]);
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);

  const getMock = () => {
    const tempTargetKeys: React.Key[] = [];
    const tempMockData: RecordType[] = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: i % 2 === 0,
      };
      if (data.chosen) {
        tempTargetKeys.push(data.key);
      }
      tempMockData.push(data);
    }
    setMockData(tempMockData);
    setTargetKeys(tempTargetKeys);
  };

  useEffect(() => {
    getMock();
  }, []);

  const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };

  const renderFooter: TransferProps['footer'] = (_, info) => {
    if (info?.direction === 'left') {
      return (
        <Button
          size="small"
          style={{ display: 'flex', margin: 8, marginInlineEnd: 'auto' }}
          onClick={getMock}
        >
          Left button reload
        </Button>
      );
    }
    return (
      <Button
        size="small"
        style={{ display: 'flex', margin: 8, marginInlineStart: 'auto' }}
        onClick={getMock}
      >
        Right button reload
      </Button>
    );
  };

  return (
    <Transfer
      dataSource={mockData}
      showSearch
      styles={{
        section: {
          width: 250,
          height: 300,
        },
      }}
      actions={['to right', 'to left']}
      targetKeys={targetKeys}
      onChange={handleChange}
      render={(item) => `${item.title}-${item.description}`}
      footer={renderFooter}
    />
  );
};

export default App;
```

### 自定义渲染行数据

自定义渲染每一个 Transfer Item，可用于渲染复杂数据。

```tsx
import React, { useEffect, useState } from 'react';
import { Transfer } from 'gzd';
import type { TransferProps } from 'antd';

interface RecordType {
  key: string;
  title: string;
  description: string;
  chosen: boolean;
}

const App: React.FC = () => {
  const [mockData, setMockData] = useState<RecordType[]>([]);
  const [targetKeys, setTargetKeys] = useState<React.Key[]>([]);

  const getMock = () => {
    const tempTargetKeys: React.Key[] = [];
    const tempMockData: RecordType[] = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: i % 2 === 0,
      };
      if (data.chosen) {
        tempTargetKeys.push(data.key);
      }
      tempMockData.push(data);
    }
    setMockData(tempMockData);
    setTargetKeys(tempTargetKeys);
  };

  useEffect(() => {
    getMock();
  }, []);

  const handleChange: TransferProps['onChange'] = (newTargetKeys, direction, moveKeys) => {
    console.log(newTargetKeys, direction, moveKeys);
    setTargetKeys(newTargetKeys);
  };

  const renderItem = (item: RecordType) => {
    const customLabel = (
      <span className="custom-item">
        {item.title} - {item.description}
      </span>
    );

    return {
      label: customLabel, // for displayed item
      value: item.title, // for title and filter matching
    };
  };

  return (
    <Transfer
      dataSource={mockData}
      styles={{
        section: {
          width: 300,
          height: 300,
        },
      }}
      targetKeys={targetKeys}
      onChange={handleChange}
      render={renderItem}
    />
  );
};

export default App;
```

### 自定义操作按钮

使用 actions 属性可以自定义操作按钮。
当 actions 传入字符串数组时，会使用默认的 Button 组件，并将字符串作为按钮文本。
当 actions 传入 React 元素数组时，会直接使用这些元素作为操作按钮，这样你可以使用自定义的按钮组件，如本例中的带有加载状态的按钮。
注意：
1. 当使用自定义按钮时，Transfer 组件会自动处理按钮的禁用状态和点击事件。
2. 你可以在自定义按钮上添加 disabled 属性来控制按钮的禁用状态。
3. 你可以在自定义按钮上添加 onClick 事件处理函数，它会与 Transfer 组件的内部处理函数合并执行。

```tsx
import React, { useState } from 'react';
import { Button, Transfer } from 'gzd';
import { message } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import type { TransferProps } from 'gzd';

interface RecordType {
  key: string;
  title: string;
  description: string;
}

const mockData: RecordType[] = Array.from({ length: 20 }).map((_, i) => ({
  key: i.toString(),
  title: `Content ${i + 1}`,
  description: `Description ${i + 1}`,
}));

const initialTargetKeys = mockData.filter((item) => Number(item.key) > 10).map((item) => item.key);

const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [loadingRight, setLoadingRight] = useState<boolean>(false);
  const [loadingLeft, setLoadingLeft] = useState<boolean>(false);

  // Handle data transfer
  const handleChange: TransferProps['onChange'] = (newTargetKeys, direction, moveKeys) => {
    setTargetKeys(newTargetKeys as string[]);

    // Simulate async action
    if (direction === 'right') {
      setLoadingRight(true);
      setTimeout(() => {
        setLoadingRight(false);
        message.success(`Successfully added ${moveKeys.length} items to the right`);
      }, 1000);
    } else {
      setLoadingLeft(true);
      setTimeout(() => {
        setLoadingLeft(false);
        message.success(`Successfully added ${moveKeys.length} items to the left`);
      }, 1000);
    }
  };

  // Handle selection change
  const handleSelectChange: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    targetSelectedKeys,
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys] as string[]);
  };

  // Right button is disabled (no selected items on the left or all selected items are already in the right list)
  const rightButtonDisabled =
    selectedKeys.length === 0 || selectedKeys.every((key) => targetKeys.includes(key));

  // Left button is disabled (no selected items on the right)
  const leftButtonDisabled =
    selectedKeys.length === 0 || selectedKeys.every((key) => !targetKeys.includes(key));

  // Custom right button click handler
  const handleRightButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // You can add custom logic here, such as showing a confirmation dialog
    console.log('Right button clicked', event);
    // The Transfer component will automatically handle data transfer
  };

  // Custom left button click handler
  const handleLeftButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // You can add custom logic here, such as showing a confirmation dialog
    console.log('Left button clicked', event);
    // The Transfer component will automatically handle data transfer
  };

  return (
    <Transfer
      dataSource={mockData}
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      onChange={handleChange}
      onSelectChange={handleSelectChange}
      render={(item) => item.title}
      actions={[
        // Custom right button (transfer data to the right)
        <Button
          key="to-right"
          type="primary"
          icon={<DoubleRightOutlined />}
          loading={loadingRight}
          disabled={rightButtonDisabled}
          onClick={handleRightButtonClick}
        >
          Move To Right
        </Button>,
        // Custom left button (transfer data to the left)
        <Button
          key="to-left"
          type="primary"
          icon={<DoubleLeftOutlined />}
          loading={loadingLeft}
          disabled={leftButtonDisabled}
          onClick={handleLeftButtonClick}
        >
          Move To Left
        </Button>,
      ]}
    />
  );
};

export default App;
```

### 分页

大数据下使用分页。

```tsx
import React, { useEffect, useState } from 'react';
import { Switch, Transfer } from 'gzd';
import type { TransferProps } from 'antd';

interface RecordType {
  key: string;
  title: string;
  description: string;
  chosen: boolean;
}

const App: React.FC = () => {
  const [oneWay, setOneWay] = useState(false);
  const [mockData, setMockData] = useState<RecordType[]>([]);
  const [targetKeys, setTargetKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const newTargetKeys: React.Key[] = [];
    const newMockData: RecordType[] = [];
    for (let i = 0; i < 2000; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: i % 2 === 0,
      };
      if (data.chosen) {
        newTargetKeys.push(data.key);
      }
      newMockData.push(data);
    }

    setTargetKeys(newTargetKeys);
    setMockData(newMockData);
  }, []);

  const onChange: TransferProps['onChange'] = (newTargetKeys, direction, moveKeys) => {
    console.log(newTargetKeys, direction, moveKeys);
    setTargetKeys(newTargetKeys);
  };

  return (
    <>
      <Transfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={onChange}
        render={(item) => item.title}
        oneWay={oneWay}
        pagination
      />
      <br />
      <Switch
        unCheckedChildren="one way"
        checkedChildren="one way"
        checked={oneWay}
        onChange={setOneWay}
      />
    </>
  );
};

export default App;
```

### 表格穿梭框

使用 Table 组件作为自定义渲染列表。

```tsx
import React, { useState } from 'react';
import { Flex, Table, Tag } from 'antd';
import { Switch, Transfer } from 'gzd';
import type { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd';

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

interface DataType {
  key: string;
  title: string;
  description: string;
  tag: string;
}

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType[];
  leftColumns: TableColumnsType<DataType>;
  rightColumns: TableColumnsType<DataType>;
}

// Customize Table Transfer
const TableTransfer: React.FC<TableTransferProps> = (props) => {
  const { leftColumns, rightColumns, ...restProps } = props;
  return (
    <Transfer style={{ width: '100%' }} {...restProps}>
      {({
        direction,
        filteredItems,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns;
        const rowSelection: TableRowSelection<TransferItem> = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys, 'replace');
          },
          selectedRowKeys: listSelectedKeys,
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
        };

        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            size="small"
            style={{ pointerEvents: listDisabled ? 'none' : undefined }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) {
                  return;
                }
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  );
};

const mockTags = ['cat', 'dog', 'bird'];

const mockData = Array.from({ length: 20 }).map<DataType>((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
  tag: mockTags[i % 3],
}));

const columns: TableColumnsType<DataType> = [
  {
    dataIndex: 'title',
    title: 'Name',
  },
  {
    dataIndex: 'tag',
    title: 'Tag',
    render: (tag: string) => (
      <Tag style={{ marginInlineEnd: 0 }} color="cyan">
        {tag.toUpperCase()}
      </Tag>
    ),
  },
  {
    dataIndex: 'description',
    title: 'Description',
  },
];

const filterOption = (input: string, item: DataType) =>
  item.title?.includes(input) || item.tag?.includes(input);

const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);
  const [disabled, setDisabled] = useState(false);

  const onChange: TableTransferProps['onChange'] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const toggleDisabled = (checked: boolean) => {
    setDisabled(checked);
  };

  return (
    <Flex align="start" gap={16} vertical>
      <TableTransfer
        dataSource={mockData}
        targetKeys={targetKeys}
        disabled={disabled}
        showSearch
        showSelectAll={false}
        onChange={onChange}
        filterOption={filterOption}
        leftColumns={columns}
        rightColumns={columns}
      />
      <Switch
        unCheckedChildren="disabled"
        checkedChildren="disabled"
        checked={disabled}
        onChange={toggleDisabled}
      />
    </Flex>
  );
};

export default App;
```

### 树穿梭框

使用 Tree 组件作为自定义渲染列表。

```tsx
import React, { useState } from 'react';
import { theme, Tree } from 'antd';
import { Transfer } from 'gzd';
import type { GetProp, TransferProps, TreeDataNode } from 'antd';

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];

interface TreeTransferProps {
  dataSource: TreeDataNode[];
  targetKeys: TransferProps['targetKeys'];
  onChange: TransferProps['onChange'];
}

// Customize Table Transfer
const isChecked = (selectedKeys: React.Key[], eventKey: React.Key) =>
  selectedKeys.includes(eventKey);

const generateTree = (
  treeNodes: TreeDataNode[] = [],
  checkedKeys: TreeTransferProps['targetKeys'] = [],
): TreeDataNode[] =>
  treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key as string),
    children: generateTree(children, checkedKeys),
  }));

const TreeTransfer: React.FC<TreeTransferProps> = ({
  dataSource,
  targetKeys = [],
  ...restProps
}) => {
  const { token } = theme.useToken();

  const transferDataSource: TransferItem[] = [];
  function flatten(list: TreeDataNode[] = []) {
    list.forEach((item) => {
      transferDataSource.push(item as TransferItem);
      flatten(item.children);
    });
  }
  flatten(dataSource);

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={(item) => item.title!}
      showSelectAll={false}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <div style={{ padding: token.paddingXS }}>
              <Tree
                blockNode
                checkable
                checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                treeData={generateTree(dataSource, targetKeys)}
                onCheck={(_, { node: { key } }) => {
                  onItemSelect(key as string, !isChecked(checkedKeys, key));
                }}
                onSelect={(_, { node: { key } }) => {
                  onItemSelect(key as string, !isChecked(checkedKeys, key));
                }}
              />
            </div>
          );
        }
      }}
    </Transfer>
  );
};

const treeData: TreeDataNode[] = [
  { key: '0-0', title: '0-0' },
  {
    key: '0-1',
    title: '0-1',
    children: [
      { key: '0-1-0', title: '0-1-0' },
      { key: '0-1-1', title: '0-1-1' },
    ],
  },
  { key: '0-2', title: '0-2' },
  { key: '0-3', title: '0-3' },
  { key: '0-4', title: '0-4' },
];

const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<TreeTransferProps['targetKeys']>([]);
  const onChange: TreeTransferProps['onChange'] = (keys) => {
    setTargetKeys(keys);
  };
  return <TreeTransfer dataSource={treeData} targetKeys={targetKeys} onChange={onChange} />;
};

export default App;
```

### 自定义状态

使用 `status` 为 Transfer 添加状态，可选 `error` 或者 `warning`。

```tsx
import React from 'react';
import { Flex } from 'antd';
import { Transfer } from 'gzd';

const App: React.FC = () => (
  <Flex gap={16} vertical>
    <Transfer status="error" />
    <Transfer status="warning" showSearch />
  </Flex>
);

export default App;
```



## API

通用属性参考：[通用属性](/react/common-props)

### Transfer

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| actions | 操作文案集合，顺序从上至下。当为字符串数组时使用默认的按钮，当为 ReactNode 数组时直接使用自定义元素 | ReactNode\[] | \[`>`, `<`] |
| dataSource | 数据源，其中的数据将会被渲染到左边一栏中，`targetKeys` 中指定的除外 | RecordType\[] | \[] |
| disabled | 是否禁用 | boolean | false |
| selectionsIcon | 自定义下拉菜单图标 | React.ReactNode | - |
| filterOption | 根据搜索内容进行筛选，接收 `inputValue` `option` `direction` 三个参数，(`direction` 自5.9.0+支持)，当 `option` 符合筛选条件时，应返回 true，反之则返回 false | (inputValue, option, direction: `left` \| `right`): boolean | - |
| footer | 底部渲染函数 | (props, { direction }) => ReactNode | - |
| locale | 各种语言 | { itemUnit: string; itemsUnit: string; searchPlaceholder: string; notFoundContent: ReactNode \| ReactNode[]; } | { itemUnit: `项`, itemsUnit: `项`, searchPlaceholder: `请输入搜索内容` } |
| oneWay | 展示为单向样式 | boolean | false |
| pagination | 使用分页样式，自定义渲染列表下无效 | boolean \| { pageSize: number, simple: boolean, showSizeChanger?: boolean, showLessItems?: boolean } | false |
| render | 每行数据渲染函数，该函数的入参为 `dataSource` 中的项，返回值为 ReactElement。或者返回一个普通对象，其中 `label` 字段为 ReactElement，`value` 字段为 title | (record) => ReactNode | - |
| selectAllLabels | 自定义顶部多选框标题的集合 | (ReactNode \| (info: { selectedCount: number, totalCount: number }) => ReactNode)\[] | - |
| selectedKeys | 设置哪些项应该被选中 | string\[] \| number\[] | \[] |
| showSearch | 是否显示搜索框，或可对两侧搜索框进行配置 | boolean \| { placeholder:string,defaultValue:string } | false |
| showSelectAll | 是否展示全选勾选框 | boolean | true |
| status | 设置校验状态 | 'error' \| 'warning' | - |
| targetKeys | 显示在右侧框数据的 key 集合 | string\[] \| number\[] | \[] |
| titles | 标题集合，顺序从左至右 | ReactNode\[] | - |
| onChange | 选项在两栏之间转移时的回调函数 | (targetKeys, direction, moveKeys): void | - |
| onScroll | 选项列表滚动时的回调函数 | (direction, event): void | - |
| onSearch | 搜索框内容时改变时的回调函数 | (direction: `left` \| `right`, value: string): void | - |
| onSelectChange | 选中项发生改变时的回调函数 | (sourceSelectedKeys, targetSelectedKeys): void | - |

### Render Props

Transfer 支持接收 `children` 自定义渲染列表，并返回以下参数：

| 参数            | 说明           | 类型 |
| --------------- | -------------- | ------------------------------------------------- |
| direction | 渲染列表的方向 | `left` \| `right` |
| disabled | 是否禁用列表 | boolean |
| filteredItems | 过滤后的数据 | RecordType\[] |
| selectedKeys | 选中的条目 | string\[] \| number\[] |
| onItemSelect | 勾选条目 | (key: string \| number, selected: boolean) |
| onItemSelectAll | 勾选一组条目 | (keys: string\[] \| number\[], selected: boolean) |

#### 参考示例

```
<Transfer {...props}>{(listProps) => <YourComponent {...listProps} />}</Transfer>
```

## 注意

按照 React 的[规范](https://zh-hans.react.dev/learn/rendering-lists#why-does-react-need-keys)，所有的组件数组必须绑定 key。在 Transfer 中，`dataSource` 里的数据值需要指定 `key` 值。对于 `dataSource` 默认将每列数据的 `key` 属性作为唯一的标识。

如果你的数据没有这个属性，务必使用 `rowKey` 来指定数据列的主键。

```
// 比如你的数据主键是 uid
return <Transfer rowKey={(record) => record.uid} />;
```
