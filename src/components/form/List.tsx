import React from 'react';
import { Form as AntdForm } from 'antd';
import type { FormListProps } from 'antd/es/form';

export interface GZDFormListProps extends FormListProps {}

const List: React.FC<GZDFormListProps> = (props) => {
  return <AntdForm.List {...props} />;
};

List.displayName = 'GZDFormList';

export default List;
