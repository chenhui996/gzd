import { forwardRef } from 'react';
import { App as AntdApp } from 'antd';
import type { AppProps } from 'antd/es/app';

export type GZDAppProps = AppProps;

const App = forwardRef<HTMLElement, GZDAppProps>((props, ref) => {
  return <AntdApp ref={ref} {...props} />;
});

App.displayName = 'GZDApp';

type AntdAppType = typeof AntdApp;

export type GZDAppComponent = typeof App & Omit<AntdAppType, keyof typeof App>;

const TransApp = App as GZDAppComponent;

// 保留 antd App.useApp 等静态能力，确保业务侧可以沿用 antd 的上下文实例获取方式。
Object.assign(TransApp, AntdApp);

export default TransApp;
