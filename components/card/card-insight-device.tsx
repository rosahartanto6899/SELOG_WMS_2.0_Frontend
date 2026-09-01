/* eslint-disable no-unused-vars */
import { InfoCircleOutlined } from "@ant-design/icons";
import { Avatar, Card, CardProps, Col, Row, Tooltip } from "antd";
import React, { ReactNode } from "react";

import styles from "./card-insight-device.module.scss";

export interface CardInsighDevicetProps extends CardProps {
  title: string;
  icon: ReactNode;
  value: number | string | null;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  insightType: "primary" | "success" | "warning" | "danger" | "default";
  state?: "active" | "inactive";
  tooltip: string | null | undefined;
  fixedWidth?: boolean;
  loading?: boolean;
}

const defaultProps = {
  fixedWidth: true,
  loading: false,
};

const CardInsightDevice = (props: CardInsighDevicetProps) => {
  const {
    fixedWidth,
    state,
    onClick,
    insightType,
    icon,
    title,
    tooltip,
    value /* , key */,
    loading,
  } = props;

  return (
    <Card
      className={`${
        styles["sera-card-insight"] +
        (fixedWidth ? ` ${styles["sera-card-insight--fixed"]}` : "") +
        (state ? ` ${styles[state]}` : "")
      } ${styles[insightType]}`}
      onClick={onClick || undefined}
      bordered={false}
    >
      <div className={styles[`rectangled-${insightType}`]} />
      <Card.Meta
        avatar={<Avatar className={`ant-avatar-${insightType}`} icon={icon} />}
        title={
          <Row wrap={false} justify="center" align="middle">
            <Col flex="auto">{title}</Col>
            <Col flex="none">
              {tooltip && (
                <Tooltip title={tooltip}>
                  <InfoCircleOutlined />
                </Tooltip>
              )}
            </Col>
          </Row>
        }
      />
      <Row className="ant-card-content" justify="space-between" align="middle">
        <Col>
          {loading || value === null ? (
            <span className="value">-</span>
          ) : (
            <span className="value">{value?.toString() || "-"}</span>
          )}
        </Col>
        <Col>
          <span className="selected">Selected</span>
        </Col>
      </Row>
    </Card>
  );
};

CardInsightDevice.defaultProps = defaultProps;

export default CardInsightDevice;
