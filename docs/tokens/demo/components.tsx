/**
 * title: 组件自动使用当前 Token
 * description: 文档根节点的 ConfigProvider 会把当前模式的组件 Token 交给所有 gzd 组件，请使用右上角切换主题观察效果。
 */
import React from 'react';
import { Button, Card, Flex, Input, Switch } from 'gzd';

const App: React.FC = () => (
  <Card title="组件 Token 自动生效">
    <Flex vertical gap="middle">
      <Flex gap="small" wrap>
        <Button type="primary">主要按钮</Button>
        <Button>默认按钮</Button>
        <Button danger>危险按钮</Button>
      </Flex>
      <Input placeholder="输入框会同步使用当前组件 Token" />
      <Flex align="center" gap="small">
        <Switch defaultChecked />
        <span>切换开关</span>
      </Flex>
    </Flex>
  </Card>
);

export default App;
