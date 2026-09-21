import Modal, { type GZDModalProps } from './Modal';
import { Modal as AntdModal } from 'antd';
import type { ModalFuncProps } from 'antd';

export type { GZDModalProps, ModalFuncProps as GZDModalFuncProps };

type AntdModalType = typeof AntdModal;

export type GZDModalComponent = typeof Modal & Omit<AntdModalType, keyof typeof Modal>;

const TransModal = Modal as GZDModalComponent;

// 挂载 AntdModal 的静态方法 (info, success, error, warning, confirm, destroyAll, useModal 等)
Object.assign(TransModal, AntdModal);

export default TransModal;
