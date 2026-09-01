/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { Avatar, Card, Col, Row } from "antd";
import moment from "moment";
import React, { ReactNode, useEffect } from "react";

import LoadingCircle from "../icons/LoadingCircle";
import Megaphone from "../icons/Megaphone";
import TriangleWarning from "../icons/TriangleWarning";
import styles from "./card-notification.module.scss";

export interface CardNotificationProps {
  title: ReactNode | string;
  timestamp: string;
  description: ReactNode | string;
  type: "alert" | "announcement" | "approval" | "system" | "transaction";
  // state: 'unread' | 'read' | 'new';
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const CardNotification = (props: CardNotificationProps): JSX.Element => {
  const { timestamp, title, onClick, type, description } = props;

  useEffect(() => {
    const intervalNewNotif = setInterval(() => {
      const mins = moment
        .duration(moment().diff(moment(timestamp)))
        .asSeconds();
      if (mins > 60) {
        clearInterval(intervalNewNotif);
      }
    }, 500);
  }, [timestamp]);

  return (
    <Card
      key={timestamp}
      className={`${styles["sera-card-notification"]} ${styles.cardState}`}
      onClick={onClick || undefined}
    >
      <Card.Meta
        avatar={
          <Avatar
            icon={
              <>
                {type === "announcement" && <Megaphone />}
                {(type === "system" || type === "approval") && (
                  <LoadingCircle />
                )}
                {type === "alert" && (
                  <TriangleWarning style={{ color: "#BE1E2D" }} />
                )}
              </>
            }
          />
        }
        title={
          <Row justify="space-between">
            <Col className="notification-title">{title}</Col>
            <Col>
              <div className="notification-timestamp">
                {moment(timestamp).format("DD MMM YYYY - HH:mm")}
              </div>
            </Col>
          </Row>
        }
        description={
          <div className="notification-description">{description}</div>
        }
      />
    </Card>
  );
};

export default CardNotification;
