import { ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Modal, ModalProps, Space } from "antd";
import { ReactNode } from "react";

import styles from "./modal-confirm.module.scss";

export interface ModalConfirmProps extends ModalProps {
  // eslint-disable-next-line no-undef
  children?: JSX.Element | JSX.Element[];
  type?: "danger" | "warning";
  icon?: ReactNode;
  withIcon?: boolean;
}

const ModalConfirm = (props: ModalConfirmProps) => {
  const {
    className,
    title,
    okButtonProps,
    type,
    children,
    icon,
    width,
    withIcon = true,
  } = props;

  return (
    <Modal
      className={`${className ?? ""} ${styles["sera-modal-confirm"]} ${
        type === "warning" ? styles.warning : styles.danger
      }`}
      centered
      {...props}
      title={
        withIcon ? (
          <Space size="middle">
            {icon ||
              (type === "warning" ? (
                <WarningOutlined />
              ) : (
                <ExclamationCircleOutlined />
              ))}
            <strong>{title}</strong>
          </Space>
        ) : (
          title
        )
      }
      width={width ?? 416}
      closable={false}
      okButtonProps={{ ...okButtonProps, danger: type === "danger" }}
      zIndex={1002}
    >
      {children}
    </Modal>
  );
};

export default ModalConfirm;
