import { Modal as AntdModal, type ModalProps } from "antd";
import React from "react";

export interface GZDModalProps extends ModalProps {}

// Modal doesn't typically need a ref exposed, we use FC
const Modal: React.FC<GZDModalProps> = (props) => {
  return <AntdModal centered={true} {...props} />;
};

Modal.displayName = "GZDModal";

export default Modal;
