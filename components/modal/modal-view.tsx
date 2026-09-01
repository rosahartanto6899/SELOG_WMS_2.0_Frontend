import { Badge, Col, Modal, ModalProps, Row } from "antd";

import SettingsUtils from "../../utils/settings/utils";
import styles from "./modal-view.module.scss";

interface ModalViewProps extends ModalProps {
  children?: JSX.Element | JSX.Element[];
  status?: string;
}

function ModalView(props: Readonly<ModalViewProps>) {
  const {
    className,
    title,
    children,
    okButtonProps,
    cancelButtonProps,
    status,
  } = props;

  return (
    <Modal
      centered
      className={`${className ?? ""} ${styles["sera-modal-view"]}`}
      {...props}
      title={
        <Row wrap={false}>
          <Col flex="auto">{title}</Col>
          <Col flex="none">
            {status && (
              <Badge status={SettingsUtils().getDeviceTagStatusColor(status)} />
            )}
            &nbsp;{status || ""}
          </Col>
        </Row>
      }
      closable={false}
      okButtonProps={{ ...okButtonProps }}
      cancelButtonProps={{ ...cancelButtonProps }}
    >
      {children}
    </Modal>
  );
}

export default ModalView;
