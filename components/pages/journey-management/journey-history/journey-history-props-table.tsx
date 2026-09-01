/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import StatusTag from "@sera-components/status-tag";
import { JourneyDetailActivity } from "@sera-types/journey-history.type";
import { MasterDataItem } from "@sera-types/master-data.type";
import { DATE_FORMAT, FORMAT_DATE_TIME } from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import { Col, Row } from "antd";
import dayjs from "dayjs";
import { isNil } from "lodash";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export const UNCHECK_SHIPMENT_KEYS = [
  "salesDealing",
  "salesServicing",
  "licensePlate",
  "drivers1",
  "drivers2",
];

export const SHIPMENT_STATUS_TAG = {
  Delayed: "error",
  "On Time": "success",
  Early: "warning",
  Done: "success",
} as const;

interface ColumnsShipmentProps {
  statuses?: MasterDataItem[];
}

export const ColumnsShipment = ({ statuses }: ColumnsShipmentProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeyHistory.table.shipment.column",
  });

  return [
    {
      key: "no",
      dataIndex: "no",
      title: "No",
      fixed: "left",
      width: 60,
      align: "center",
      exception: true,
    },
    {
      key: "status",
      dataIndex: "status",
      title: t("status"),
      fixed: "left",
      render: (_record: string) => {
        const _data = statuses?.find((_item) => _record === _item?.name);
        return <StatusTag value={_record} color={_data?.color ?? ""} block />;
      },
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: t("createdAt"),
      render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
    },
    {
      key: "actualTimeArrival",
      dataIndex: "actualTimeArrival",
      title: t("actualTimeArrival"),
      render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
    },
    {
      key: "salesDealing",
      dataIndex: "salesDealing",
      title: t("salesDealing"),
    },
    {
      key: "salesServicing",
      dataIndex: "salesServicing",
      title: t("salesServicing"),
    },
    {
      key: "bookingOrderNo",
      dataIndex: "bookingOrderNo",
      title: t("bookingOrderNo"),
    },
    {
      key: "shipmentNo",
      dataIndex: "shipmentNo",
      title: t("shipmentNo"),
    },
    {
      key: "shipmentType",
      dataIndex: "shipmentType",
      title: t("shipmentType"),
    },
    {
      key: "customerName",
      dataIndex: "customerName",
      title: t("customerName"),
    },
    {
      key: "unitType",
      dataIndex: "unitType",
      title: t("unitType"),
    },
    {
      key: "origin",
      dataIndex: "origin",
      title: t("origin"),
    },
    {
      key: "destination",
      dataIndex: "destination",
      title: t("destination"),
    },
    {
      key: "licensePlate",
      dataIndex: "licensePlate",
      title: t("licensePlate"),
    },
    {
      key: "drivers1",
      dataIndex: ["drivers", 1],
      title: t("drivers1"),
    },
    {
      key: "drivers2",
      dataIndex: ["drivers", 2],
      title: t("drivers2"),
      render: (_record: string) => _record || "-",
    },
    {
      key: "action",
      dataIndex: "id",
      title: t("action"),
      fixed: "right",
      exception: true,
      render: (_record: string) => (
        <Row justify="center" gutter={[8, 4]}>
          <Col>
            <Link
              id="link-detail-journey-history"
              href={`${ROUTE.JOURNEY_MANAGEMENT.JOURNEY_HISTORY}/${_record}`}
              passHref
            >
              <Button
                id="view-button"
                size="small"
                tooltip={t("button.detail.tooltip")}
                type="link"
                icon={<EyeOutlined />}
              />
            </Link>
          </Col>
        </Row>
      ),
    },
  ];
};

export const ColumnsJourney = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeyHistory.table.journey.column",
  });

  return [
    {
      key: "activity",
      dataIndex: "activity",
      title: t("activity"),
      align: "left",
    },
    {
      key: "locationName",
      dataIndex: "locationName",
      title: t("locationName"),
    },
    {
      key: "status",
      dataIndex: "status",
      title: t("status"),
      align: "center",
      render: (_: string, _data: JourneyDetailActivity) => {
        if (isNil(_data?.plannedDate)) return <></>;
        const _plannedDate = dayjs(_data?.plannedDate);
        const _actualDate = dayjs(_data?.opsActualDate ?? _data?.obdActualDate);
        const _diff = _actualDate.diff(_plannedDate, "minute");

        let _status: keyof typeof SHIPMENT_STATUS_TAG | null = null;
        if (_diff < 0) _status = "Early";
        else if (_diff === 0 || _diff === 1) _status = "On Time";
        else _status = "Delayed";

        return (
          <StatusTag
            value={_status}
            fallback={SHIPMENT_STATUS_TAG[_status] ?? ""}
            block
          />
        );
      },
    },
    {
      key: "plannedDate",
      dataIndex: "plannedDate",
      title: t("plannedDate"),
      render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
    },
    {
      key: "header_skyward",
      title: t("header_skyward"),
      onHeaderCell: () => ({ className: "group-bordered-start-end-head" }),
      children: [
        {
          key: "obdActualDate",
          dataIndex: "obdActualDate",
          title: t("obdActualDate"),
          onHeaderCell: () => ({ className: "group-bordered-start-end" }),
          onCell: () => ({ className: "group-bordered-start-end" }),
          render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
        },
        {
          key: "obdCoordinate",
          dataIndex: "obdCoordinate",
          title: t("obdCoordinate"),
          onHeaderCell: () => ({ className: "group-bordered-end" }),
          onCell: () => ({ className: "group-bordered-end" }),
        },
        {
          key: "obdAddress",
          dataIndex: "obdAddress",
          title: t("obdAddress"),
          onHeaderCell: () => ({ className: "group-bordered-end" }),
          onCell: () => ({ className: "group-bordered-end" }),
          width: 200,
          truncate: true,
        },
      ],
    },
    {
      key: "header_operation",
      title: t("header_operation"),
      onHeaderCell: () => ({ className: "group-bordered-end-head" }),
      children: [
        {
          key: "opsActualDate",
          dataIndex: "opsActualDate",
          title: t("opsActualDate"),
          onHeaderCell: () => ({ className: "group-bordered-end" }),
          onCell: () => ({ className: "group-bordered-end" }),
          render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
        },
        {
          key: "opsCoordinate",
          dataIndex: "opsCoordinate",
          title: t("opsCoordinate"),
          onHeaderCell: () => ({ className: "group-bordered-end" }),
          onCell: () => ({ className: "group-bordered-end" }),
        },
        {
          key: "opsAddress",
          dataIndex: "opsAddress",
          title: t("opsAddress"),
          align: "left",
          onHeaderCell: () => ({ className: "group-bordered-end" }),
          onCell: () => ({ className: "group-bordered-end" }),
          width: 200,
          truncate: true,
        },
      ],
    },
  ];
};

export const ShipmentSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeyHistory.table.shipment.options",
  });

  return [
    { label: t("0"), value: "shipmentNo" },
    { label: t("1"), value: "salesDealing" },
    { label: t("2"), value: "salesServicing" },
    { label: t("3"), value: "customerName" },
  ];
};
