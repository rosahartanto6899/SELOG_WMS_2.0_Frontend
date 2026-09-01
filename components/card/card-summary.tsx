import CarouselInsightSkeletons from "@sera-components/carousel/carousel-insights";
import Typography from "@sera-components/typography";
import { Col, Divider, Flex, Row } from "antd";
import React from "react";

const { Text, Title } = Typography;

export interface CardSummaryProps {
  title?: string;
  content?: React.ReactNode;
  data: CardSummaryDataProps[];
  loading?: boolean;
  height?: number | string;
  isCurrency?: boolean;
}

export interface CardSummaryDataProps {
  label: string;
  value: string;
  total?: string;
  variant:
    | "info"
    | "sub-info"
    | "success"
    | "error"
    | "warning"
    | "yellow-accent";
  customVariant?: [string, string];
  icon?: React.ReactNode;
}

const CardSummary = ({
  title,
  content,
  data,
  loading,
  height,
  isCurrency,
}: CardSummaryProps): JSX.Element => {
  const BACKGROUND = {
    info: ["#e6f4ff", "#4096ff"],
    "sub-info": ["#d6e4ff", "#1d39c4"],
    success: ["#f6ffed", "#52c41a"],
    warning: ["#fff2e8", "#ff7a45"],
    error: ["#fff1f0", "#f5222d"],
    "yellow-accent": ["#fffbe6", "#fadb14"],
  };

  return (
    <Flex vertical>
      {title ? (
        <Row>
          <Col>
            <h3 style={{ fontWeight: 600 }}>{title}</h3>
          </Col>
        </Row>
      ) : null}

      {content}
      {content ? <Divider /> : null}

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <CarouselInsightSkeletons isCurrency={isCurrency}>
            {data.map((_item, _index) => (
              <Col key={_index} className="gutter-row" span={24}>
                <Flex
                  style={{
                    width: "100%",
                    height: height ?? "auto",
                    padding: "2rem",
                    margin: "2rem 0",
                    background:
                      _item?.customVariant?.[0] ||
                      BACKGROUND[_item?.variant][0],
                    borderRadius: 8,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  vertical
                  justify="space-between"
                  gap={8}
                >
                  <Flex gap="middle" align="center">
                    <Flex
                      gap="middle"
                      justify="center"
                      align="center"
                      style={{
                        flexShrink: 0,
                        height: "40px",
                        minWidth: "40px",
                        padding: "8px",
                        borderRadius: "8px",
                        background:
                          _item?.customVariant?.[1] ||
                          BACKGROUND[_item?.variant][1],
                      }}
                    >
                      {_item?.icon
                        ? React.cloneElement(_item.icon as React.ReactElement, {
                            style: { fontSize: 20, color: "#fff" },
                          })
                        : null}

                      {_item?.total ? (
                        <Text
                          style={{ textAlign: "center", color: "#fff" }}
                          fontSize={20}
                          strong
                        >
                          {_item?.total}
                        </Text>
                      ) : null}
                    </Flex>

                    <Text
                      fontSize={18}
                      type="secondary"
                      strong
                      // ellipsis={{ tooltip: _item.label }}
                    >
                      {_item?.label}
                    </Text>
                  </Flex>

                  <Title level={2} loading={loading}>
                    {_item?.value}
                  </Title>
                </Flex>
              </Col>
            ))}
          </CarouselInsightSkeletons>
        </Col>
      </Row>
    </Flex>
  );
};

export default CardSummary;
