/**
 * title: React 错误处理
 * description: 友好的 [React 错误处理](https://zh-hans.react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) 包裹组件。
 */
import React, { useState } from 'react';
import { Alert, Button } from 'gzd';;

const { ErrorBoundary } = Alert;

const ThrowError: React.FC = () => {
  const [error, setError] = useState<Error>();
  const onClick = () => {
    setError(new Error('An Uncaught Error'));
  };

  if (error) {
    throw error;
  }
  return (
    <Button danger onClick={onClick}>
      Click me to throw a error
    </Button>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <ThrowError />
  </ErrorBoundary>
);

export default App;
