import { forwardRef } from 'react';
import { Form as AntdForm } from 'antd';
import type { FormProps, FormInstance } from 'antd';

export interface GZDFormProps<Values = any> extends FormProps<Values> {}

const Form = forwardRef<FormInstance, GZDFormProps>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <AntdForm ref={ref} {...(restProps as any)}>
      {children}
    </AntdForm>
  );
});

Form.displayName = 'GZDForm';

export default Form;
