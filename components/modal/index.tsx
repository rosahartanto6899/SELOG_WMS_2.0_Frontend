import { Modal as AntdModal, ModalProps as AntdModalProps } from "antd";
import { ReactNode } from "react";

import styles from "./modal.module.scss";
// eslint-disable-next-line import/no-named-as-default
import ModalConfirm from "./modal-confirm";
import ModalContainer from "./modal-container";
import ModalView from "./modal-view";

export interface ModalProps extends AntdModalProps {
  id?: string;
  isVisible?: boolean;
  title?: string;
  // eslint-disable-next-line no-undef
  children?: JSX.Element | JSX.Element[];
  width?: number;
  okText?: string;
  cancelText?: string;
  closable?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  footer?: ReactNode | null;
}

const Modal = (props: ModalProps) => {
  const { children, closable, footer } = props;

  return (
    <div className={styles.container}>
      <AntdModal
        {...props}
        zIndex={1999}
        footer={footer ?? null}
        closable={closable ?? false}
        centered
      >
        {children}
      </AntdModal>
    </div>
  );
};

Modal.Confirm = ModalConfirm;
Modal.View = ModalView;
Modal.Container = ModalContainer;

export default Modal;
