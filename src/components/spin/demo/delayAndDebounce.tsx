/**
 * title: 延迟
 * description: 延迟显示 loading 效果。当 spinning 状态在 `delay` 时间内结束，则不显示 loading 状态。
 */
import React from 'react';
import { Alert, Spin, Switch } from 'gzd';
import { Flex } from 'antd';;

const App: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <Flex gap={16} vertical>
      <Spin spinning={loading} delay={500}>
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
