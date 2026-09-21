import React from 'react';
import { Form as AntdForm } from 'antd';
import type { FormProviderProps } from 'antd/es/form/context';

export interface GZDFormProviderProps extends FormProviderProps {}

const Provider: React.FC<GZDFormProviderProps> = (props) => {
  return <AntdForm.Provider {...props} />;
};

Provider.displayName = 'GZDFormProvider';

export default Provider;
