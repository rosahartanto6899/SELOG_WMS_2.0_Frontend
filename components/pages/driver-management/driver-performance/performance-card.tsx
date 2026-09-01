import Card from "@sera-components/card";
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

interface FatigueCardProps {
  cardBg?: keyof typeof BACKGROUND_COLOR;
  avatarBg?: keyof typeof BACKGROUND_COLOR;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  loading: boolean;
}

const PerformanceCard = ({
  cardBg = "primaryMain",
  avatarBg = "primarySecond",
  icon,
  label,
  value,
  loading,
}: FatigueCardProps) => {
  return (
    <Card
      style={{
        width: "100%",
        borderRadius: 8,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        background: BACKGROUND_COLOR[cardBg],
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
                background: BACKGROUND_COLOR[avatarBg],
              }}
              icon={icon}
            />
            <Text fontSize={18} type="secondary" strong>
              {label}
            </Text>
          </Flex>
        </Col>
        <Col span={24}>
          <Title level={2} style={{ margin: "16px 0 4px" }} loading={loading}>
            {value || 0}
          </Title>
        </Col>
      </Row>
    </Card>
  );
};

export default PerformanceCard;
