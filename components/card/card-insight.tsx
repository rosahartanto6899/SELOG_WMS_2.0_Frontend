/* eslint-disable no-unused-vars */
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Avatar, Card, CardProps, Col, Row, Spin, Tooltip } from "antd";
import React, { ReactNode } from "react";

import styles from "./card-insight.module.scss";

export interface CardInsightProps extends CardProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  value?: number;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  insightType:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "default"
    | "ghost";
  state?: "active" | "inactive";
  tooltip: string | null | undefined;
  fixedWidth?: boolean;
}

const defaultProps = {
  fixedWidth: true,
};

const CardInsight = (props: CardInsightProps) => {
  const {
    fixedWidth,
    state,
    onClick,
    insightType,
    icon,
    title,
    tooltip,
    value,
    subtitle /* , key */,
  } = props;

  return (
    <Card
      className={`${styles["sera-card-insight"]} ${fixedWidth ? styles["sera-card-insight--fixed"] : ""} ${
        state ? styles[state] : ""
      }`}
      onClick={onClick || undefined}
      bordered={false}
    >
      <Card.Meta
        avatar={<Avatar className={`ant-avatar-${insightType}`} icon={icon} />}
        title={
          <Row wrap={false} justify="space-between" align="middle">
            <Col flex="none">
              <Row>
                <Col span={24}>
                  <strong>{title}</strong>
                </Col>
                <Col span={24}>{subtitle}</Col>
              </Row>
            </Col>
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
          <span className="value">
            {typeof value === "undefined" || value === null ? (
              <Spin indicator={<LoadingOutlined spin />} />
            ) : (
              value.toString()
            )}
          </span>
        </Col>
        <Col>
          <span className="selected">Selected</span>
        </Col>
      </Row>
    </Card>
  );
};

CardInsight.defaultProps = defaultProps;

export default CardInsight;
