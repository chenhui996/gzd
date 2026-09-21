/**
 * title: 卡片加载中
 * description: 可以直接把内容内嵌到 `Spin` 中，将现有容器变为加载状态。
 */
import React from 'react';
import { Alert, Spin, Switch } from 'gzd';
import { Flex } from 'antd';;

const App: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <Flex gap={16} vertical>
      <Spin spinning={loading}>
        <Alert
          type="info"
          title="Alert message title"
          description="Further details about the context of this alert."
        />
      </Spin>
      <p>
        Loading state：
        <Switch checked={loading} onChange={setLoading} />
      </p>
    </Flex>
  );
};

export default App;
