/**
 * title: 校验时机
 * description: 对于有异步校验的场景，过于频繁的校验会导致后端压力。可以通过 `validateTrigger` 改变校验时机，或者 `validateDebounce` 改变校验频率，或者 `validateFirst` 设置校验短路。
 */

import React from 'react';
import { Alert, Form, Input } from 'gzd';;

const App: React.FC = () => (
  <Form name="trigger" style={{ maxWidth: 600 }} layout="vertical" autoComplete="off">
    <Alert title="Use 'max' rule, continue type chars to see it" />

    <Form.Item
      hasFeedback
      label="Field A"
      name="field_a"
      validateTrigger="onBlur"
      rules={[{ max: 3 }]}
    >
      <Input placeholder="Validate required onBlur" />
    </Form.Item>

    <Form.Item
      hasFeedback
      label="Field B"
      name="field_b"
      validateDebounce={1000}
      rules={[{ max: 3 }]}
    >
      <Input placeholder="Validate required debounce after 1s" />
    </Form.Item>

    <Form.Item
      hasFeedback
      label="Field C"
      name="field_c"
      validateFirst
      rules={[{ max: 6 }, { max: 3, message: 'Continue input to exceed 6 chars' }]}
    >
      <Input placeholder="Validate one by one" />
    </Form.Item>
  </Form>
);

export default App;
