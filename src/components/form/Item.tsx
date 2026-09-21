
import { Form as AntdForm } from 'antd';
import type { FormItemProps } from 'antd';

export interface GZDFormItemProps<Values = any> extends FormItemProps<Values> {}

const Item = <Values = any,>(props: GZDFormItemProps<Values>) => {
  const { children, ...restProps } = props;

  return (
    <AntdForm.Item {...(restProps as any)}>
      {children}
    </AntdForm.Item>
  );
};

Item.displayName = 'GZDFormItem';

export default Item;
