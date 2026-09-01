import Card from "@sera-components/card";
import Skeleton from "@sera-components/skeleton";
import Typography from "@sera-components/typography";
import { Avatar, Col, Flex, Row } from "antd";
import React from "react";

const { Text, Title } = Typography;

const BACKGROUND_COLOR = {
  primaryMain: "#e6f4ff",
  primarySecond: "#4096ff",
  successMain: "#f6ffed",
  successSubtle: "#52c41a",
  dangerMain: "#fff1f0",
  dangerSubtle: "#f5222d",
  warningMain: "#fff2e8",
  warningSubtle: "#ff7a45",
} as const;

interface OrderStatusCardProps {
  cardBg?: string;
  avatarBg?: string;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  loading?: boolean;
}

const OrderStatusCard = ({
  cardBg = "primaryMain",
  avatarBg = "primarySecond",
  icon,
  label,
  value,
  loading,
}: OrderStatusCardProps) => {
  const backgroundColor = () => {
    const keys = Object.keys(BACKGROUND_COLOR);
    if (keys.includes(cardBg) && keys.includes(avatarBg)) {
      const card = cardBg as keyof typeof BACKGROUND_COLOR;
      const avatar = avatarBg as keyof typeof BACKGROUND_COLOR;

      return {
        cardBg: BACKGROUND_COLOR[card],
        avatarBg: BACKGROUND_COLOR[avatar],
      };
    } else {
      return {
        cardBg,
        avatarBg,
      };
    }
  };

  return (
    <Card
      style={{
        width: "100%",
        borderRadius: 8,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        background: backgroundColor().cardBg,
      }}
      bodyStyle={{
        padding: "12px",
      }}
    >
      <Row align="middle" gutter={[8, 0]}>
        <Col span={24}>
          <Flex gap="middle" align="center">
            <Avatar
              shape="square"
              size="large"
              style={{
                background: backgroundColor().avatarBg,
              }}
              icon={icon}
            />
            <Text type="secondary" strong>
              {loading ? <Skeleton.Input /> : label}
            </Text>
          </Flex>
        </Col>
        <Col span={24}>
          <Title level={2} style={{ margin: "16px 0 4px" }}>
            {loading ? <Skeleton.Input /> : value || 0}
          </Title>
        </Col>
      </Row>
    </Card>
  );
};

export default OrderStatusCard;
