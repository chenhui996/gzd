import { Form as AntdForm } from 'antd';
import type { FormInstance } from 'antd';

import Form, { type GZDFormProps } from './Form';
import Item, { type GZDFormItemProps } from './Item';
import List, { type GZDFormListProps } from './List';
import ErrorList, { type GZDErrorListProps } from './ErrorList';
import Provider, { type GZDFormProviderProps } from './Provider';

export type {
  GZDFormProps,
  GZDFormItemProps,
  GZDFormListProps,
  GZDErrorListProps,
  GZDFormProviderProps,
  FormInstance,
};

export type GZDFormComponent = typeof Form & {
  Item: typeof Item;
  List: typeof List;
  ErrorList: typeof ErrorList;
  Provider: typeof Provider;
  useForm: typeof AntdForm.useForm;
  useFormInstance: typeof AntdForm.useFormInstance;
  useWatch: typeof AntdForm.useWatch;
};

const TransForm = Form as GZDFormComponent;

TransForm.Item = Item;
TransForm.List = List;
TransForm.ErrorList = ErrorList;
TransForm.Provider = Provider;
TransForm.useForm = AntdForm.useForm;
TransForm.useFormInstance = AntdForm.useFormInstance;
TransForm.useWatch = AntdForm.useWatch;

export default TransForm;
