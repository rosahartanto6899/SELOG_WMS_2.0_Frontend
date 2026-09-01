import { Modal, ModalProps } from "antd";

import styles from "./modal-container.module.scss";

interface ModalContainerProps extends ModalProps {
  children: React.ReactNode;
  title: string;
}

const ModalContainer = ({
  children,
  open,
  title,
  ...args
}: ModalContainerProps) => (
  <Modal
    {...args}
    open={open}
    title={title}
    className={styles["modal-wrapper"]}
    centered
  >
    <div className={styles["modal-children"]}>{children}</div>
  </Modal>
);

export default ModalContainer;
