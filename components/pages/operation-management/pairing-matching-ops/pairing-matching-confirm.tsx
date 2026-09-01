/* eslint-disable react-hooks/exhaustive-deps */
import Typography from "@sera-components/typography";
import { pairingMatchingOpsActions, RootState } from "@sera-redux";
import { LoadingState } from "@sera-types/loading.type";
import {
  Demands,
  PairingMatchingState,
  pairingMatchingTypes,
} from "@sera-types/pairing-matching-ops";
import {
  DATE_FORMAT,
  FORMAT_DATE_TIME,
  NUMBER_FORMAT,
} from "@sera-utils/constants/common";
import { Col, Flex, Row, Spin } from "antd";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface PairingMatchingConfirmProps {
  data: Demands | null;
  loading: LoadingState;
  pairingMatchingOps: PairingMatchingState;
  getShipmentDetail: typeof pairingMatchingOpsActions.getShipmentDetailFetch;
}

const PairingMatchingConfirm = ({
  data,
  loading,
  pairingMatchingOps,
  getShipmentDetail,
}: PairingMatchingConfirmProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.table.demands.confirm",
  });

  useEffect(() => {
    if (data?.id) getShipmentDetail({ id: data?.id });
  }, [data]);

  const DATA = useMemo(() => {
    const _data = pairingMatchingOps?.getShipmentDetail?.data;

    return [
      {
        title: t("desc.0.title"),
        childrens: [
          {
            label: t("desc.0.items.0"),
            value: _data?.shipmentNumber ?? "-",
          },
          {
            label: t("desc.0.items.1"),
            value: _data?.customerName ?? "-",
          },
          {
            label: t("desc.0.items.2"),
            value: DATE_FORMAT(_data?.pickupDate, FORMAT_DATE_TIME, "-"),
          },
          {
            label: t("desc.0.items.3"),
            value: _data?.origin ?? "-",
          },
          {
            label: t("desc.0.items.4"),
            value: _data?.destination ?? "-",
          },
        ],
      },
      {
        title: t("desc.1.title"),
        childrens: [
          {
            label: t("desc.1.items.0"),
            value: _data?.licensePlate ?? "-",
          },
          {
            label: t("desc.1.items.1"),
            value: _data?.unitType ?? "-",
          },
          {
            label: t("desc.1.items.2"),
            value: _data?.driver1 ?? "-",
          },
          {
            label: t("desc.1.items.3"),
            value: _data?.driver2 ?? "-",
          },
        ],
      },
      {
        title: t("desc.2.title"),
        childrens: [
          {
            label: t("desc.2.items.0"),
            value: `Rp ${NUMBER_FORMAT(_data?.revenue)}`,
          },
          {
            label: t("desc.2.items.1"),
            value: `Rp ${NUMBER_FORMAT(_data?.cost)}`,
          },
          {
            label: t("desc.2.items.2"),
            value: `${_data?.ratioExpense ?? 0}%`,
          },
          {
            label: t("desc.2.items.3"),
            value: _data?.jmpCode ?? "-",
          },
        ],
      },
    ];
  }, [pairingMatchingOps?.getShipmentDetail?.data]);

  return (
    <Row>
      <Col span={24}>
        <Spin spinning={loading[pairingMatchingTypes.GET_SHIPMENT_DETAIL]}>
          <Flex vertical gap={16}>
            {DATA?.map((_item, _index) => (
              <Flex key={_index} vertical>
                <Typography.Title level={5}>{_item?.title}</Typography.Title>

                {_item?.childrens?.map((_child, _key) => (
                  <Row key={_key}>
                    <Col span={10}>{_child?.label}</Col>
                    <Col span={1}>:</Col>
                    <Col span={13}> {_child?.value}</Col>
                  </Row>
                ))}
              </Flex>
            ))}
          </Flex>
        </Spin>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  pairingMatchingOps: state.pairingMatchingOps,
});

const mapDispatchToProps = {
  getShipmentDetail: pairingMatchingOpsActions.getShipmentDetailFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PairingMatchingConfirm);
