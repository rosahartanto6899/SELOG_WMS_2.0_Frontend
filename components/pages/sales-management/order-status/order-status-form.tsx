import Card from "@sera-components/card";
import Input from "@sera-components/input";
import useTracingTracking from "@sera-components/pages/journey-management/tracing-and-tracking/hooks/useTracingTracking";
import TypographyText from "@sera-components/typography/typography-text";
import {
  Col,
  Flex,
  Form,
  FormInstance,
  Row,
  StepProps,
  Steps,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { isEmpty, isNull, isString } from "lodash";
import { useRouter } from "next/router";
import React, { FC, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface OrderStatusFormProps {
  form: FormInstance;
}

const OrderStatusForm: FC<OrderStatusFormProps> = (_props) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "tracingAndTracking.detail",
  });

  const router = useRouter();

  const { id } = router.query;

  const {
    queries: { fetchDetails },
    data: { detailsData },
    loading: { detailsLoading },
    events: { clearDetailsData },
  } = useTracingTracking();

  const dataDetails = useMemo(() => {
    const _data = detailsData;
    const _dataDetail = _data?.detail;
    const _dataData = _data?.dateTime;
    const dataShipment = [
      {
        title: t("searchResult.shipment.0"),
        value: _dataDetail?.status ?? "-",
      },
      {
        title: t("searchResult.shipment.1"),
        value: _dataDetail?.shipmentNo ?? "-",
      },
      {
        title: t("searchResult.shipment.2"),
        value: _dataDetail?.customerName ?? "-",
      },
      {
        title: t("searchResult.shipment.3"),
        value: _dataDetail?.shipmentType ?? "-",
      },
      {
        title: t("searchResult.shipment.4"),
        value: _dataDetail?.branchOrder?.name ?? "-",
      },
      {
        title: t("searchResult.shipment.5"),
        value: _dataDetail?.lastUpdate
          ? dayjs(_dataDetail?.lastUpdate).format("DD-MM-YYYY HH:mm")
          : "-",
      },
    ];

    const driverInformation = [
      {
        title: t("searchResult.unitDriver.0"),
        value: _dataDetail?.licensePlate ?? "-",
      },
      {
        title: t("searchResult.unitDriver.1"),
        value: _dataDetail?.unitType ?? "-",
      },
      {
        title: t("searchResult.unitDriver.2"),
        value: _dataDetail?.driver1?.employeeName ?? "-",
      },
      {
        title: t("searchResult.unitDriver.3"),
        value: _dataDetail?.driver1?.mobilePhone ?? "-",
      },
      {
        title: t("searchResult.unitDriver.4"),
        value: _dataDetail?.driver2?.employeeName ?? "-",
      },
      {
        title: t("searchResult.unitDriver.5"),
        value: _dataDetail?.driver2?.mobilePhone ?? "-",
      },
    ];

    const activityLog: StepProps[] = _data?.activityLogs
      ?.filter((act) => !isNull(act.time))
      ?.map((activity) => ({
        title: (
          <Text style={{ fontWeight: "bold" }}>
            {dayjs(activity.time).format("DD MMM YYYY HH:mm")}
          </Text>
        ),
        description: (
          <Row style={{ flexDirection: "column" }}>
            <Col>
              <Text type="secondary">{activity.status}</Text>
            </Col>
            <Col>
              <Text type="secondary">{activity.actor}</Text>
            </Col>
          </Row>
        ),
      }));

    const journeyHistory: StepProps[] = [
      {
        title: <Text>Origin</Text>,
        subTitle: (
          <Row>
            <Col style={{ maxWidth: 150 }} span={24}>
              <Text
                strong
                ellipsis={{
                  tooltip: _dataDetail?.origin ?? "-",
                }}
              >
                {_dataDetail?.origin ?? "-"}
              </Text>
            </Col>
          </Row>
        ),
        description: (
          <Row>
            <Col span={24}>
              <Text
                strong
                ellipsis={{
                  tooltip: _dataDetail?.originAddress ?? "-",
                }}
              >
                {_dataDetail?.originAddress ?? "-"}
              </Text>
            </Col>
            <Col span={24}>
              <Text italic>
                {_dataData?.actualLoadingIn
                  ? dayjs(_dataData?.actualLoadingIn).format(
                      "DD MMM YYYY HH:mm",
                    )
                  : _dataData?.planLoadingIn
                    ? dayjs(_dataData?.planLoadingIn).format(
                        "DD MMM YYYY HH:mm",
                      )
                    : "-"}
              </Text>
            </Col>
          </Row>
        ),
        status: _dataData?.actualLoadingOut ? "finish" : "process",
      },
      {
        title: <Text>On Journey</Text>,
        status: _dataData?.actualLoadingOut
          ? "process"
          : _dataData?.ata
            ? "finish"
            : "wait",
      },
      {
        title: <Text>Destination</Text>,
        subTitle: (
          <Row>
            <Col style={{ maxWidth: 150 }} span={24}>
              <Text
                strong
                ellipsis={{
                  tooltip: _dataDetail?.destination ?? "-",
                }}
              >
                {_dataDetail?.destination ?? "-"}
              </Text>
            </Col>
          </Row>
        ),
        description: (
          <Row>
            <Col span={24}>
              <Text
                strong
                ellipsis={{
                  tooltip: _dataDetail?.destinationAddress ?? "-",
                }}
              >
                {_dataDetail?.destinationAddress ?? "-"}
              </Text>
            </Col>
            <Col span={24}>
              <Text italic>
                {_data?.dateTime?.ata
                  ? dayjs(_data?.dateTime?.ata).format("DD MMM YYYY HH:mm")
                  : _data?.dateTime?.estimateTimeArrival
                    ? dayjs(_data?.dateTime?.estimateTimeArrival).format(
                        "DD MMM YYYY HH:mm",
                      )
                    : "-"}
              </Text>
            </Col>
          </Row>
        ),
        status: _data?.dateTime?.ata ? "process" : "wait",
      },
    ];

    return { dataShipment, driverInformation, activityLog, journeyHistory };
  }, [detailsData]);

  useEffect(() => {
    if (id && isString(id)) {
      clearDetailsData();
      fetchDetails({ id });
    }
  }, [id]);

  const DetailResult = ({
    title,
    value,
    key,
  }: {
    title: string;
    value: string | number;
    key?: string | number;
  }) => (
    <Form layout="vertical">
      <Form.Item name={key} label={title}>
        <Input value={value} disabled loading={detailsLoading} />
      </Form.Item>
    </Form>
  );

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={14}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={24}>
            <Row>
              <Col span={24}>
                <Row gutter={[12, 12]}>
                  <Col span={24}>
                    <Card
                      title={t("searchResult.sub.0")}
                      loading={detailsLoading}
                    >
                      {dataDetails?.dataShipment?.map((e, idx) => (
                        <DetailResult
                          title={e.title}
                          value={e.value}
                          key={idx}
                        />
                      ))}
                    </Card>
                  </Col>

                  <Col span={24}>
                    <Card
                      title={t("searchResult.sub.1")}
                      loading={detailsLoading}
                    >
                      {dataDetails?.driverInformation?.map((e, idx) => (
                        <DetailResult
                          title={e.title}
                          value={e.value}
                          key={idx}
                        />
                      ))}
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>

      <Col xs={24} lg={10}>
        <Card title={t("activityLog.title")} loading={detailsLoading}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Flex gap={"small"} style={{ flexDirection: "column" }}>
                <Col>
                  {isEmpty(dataDetails?.activityLog) && !detailsLoading ? (
                    <Flex justify="center" align="center">
                      <TypographyText strong>No Activity Log</TypographyText>
                    </Flex>
                  ) : (
                    <Steps
                      progressDot
                      current={dataDetails?.activityLog?.length}
                      items={dataDetails?.activityLog}
                      direction="vertical"
                    />
                  )}
                </Col>
              </Flex>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default OrderStatusForm;
