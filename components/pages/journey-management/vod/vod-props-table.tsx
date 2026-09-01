/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { EditOutlined } from "@sera-components/icons";
import StatusTag from "@sera-components/status-tag";
import { MasterDataItem } from "@sera-types/master-data.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import useGetPermission from "../hooks/useGetPermission";

export const UNCHECK_SHIPMENT_KEYS = [
  "category",
  "referenceNo",
  "customerName",
  "employeeName",
  "voiceDetail",
];

export const STATUS_TAG = {
  Open: "error",
  "On Progress": "success",
  Closed: "warning",
} as const;

interface ColumnsShipmentProps {
  vodTypes?: MasterDataItem[];
}

export const ColumnsShipment = ({ vodTypes }: ColumnsShipmentProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "vod.table.column",
  });

  const { isUpdate } = useGetPermission("voice-of-driver");

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
      align: "center",
      render: (_record: keyof typeof STATUS_TAG) => (
        <StatusTag value={_record} fallback={STATUS_TAG[_record] ?? ""} block />
      ),
    },
    {
      key: "ticketNumber",
      dataIndex: "ticketNumber",
      title: t("ticketNumber"),
      fixed: "left",
    },
    {
      key: "createdAt",
      dataIndex: "createdAt",
      title: t("createdAt"),
    },
    {
      key: "createdByName",
      dataIndex: "createdByName",
      title: t("createdByName"),
    },
    {
      key: "category",
      dataIndex: "category",
      title: t("category"),
    },
    {
      key: "shipmentNo",
      dataIndex: "shipmentNo",
      title: t("shipmentNo"),
    },
    {
      key: "referenceNo",
      dataIndex: "referenceNo",
      title: t("referenceNo"),
    },
    {
      key: "customerName",
      dataIndex: "customerName",
      title: t("customerName"),
    },
    {
      key: "branchName",
      dataIndex: "branchName",
      title: t("branchName"),
    },
    {
      key: "licensePlate",
      dataIndex: "licensePlate",
      title: t("licensePlate"),
    },
    {
      key: "employeeName",
      dataIndex: "employeeName",
      title: t("employeeName"),
    },
    {
      key: "voiceType",
      dataIndex: "voiceType",
      title: t("voiceType"),
      render: (text: string) =>
        vodTypes?.find((o) => o?.id === text)?.name ?? text ?? "",
    },
    {
      key: "voiceDetail",
      dataIndex: "voiceDetail",
      title: t("voiceDetail"),
      width: 200,
      render: (text: string) => (
        <span dangerouslySetInnerHTML={{ __html: text }} />
      ),
    },
    {
      key: "position",
      dataIndex: "position",
      title: t("position"),
    },
    {
      key: "note",
      dataIndex: "note",
      title: t("note"),
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
              id="link-detail-vod"
              href={`${ROUTE.JOURNEY_MANAGEMENT.VOD}/${_record}`}
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

          {isUpdate ? (
            <Col>
              <Link
                id="link-update-vod"
                href={`${ROUTE.JOURNEY_MANAGEMENT.VOD}/edit/${_record}`}
                passHref
              >
                <Button
                  id="view-button"
                  size="small"
                  tooltip={t("button.update.tooltip")}
                  type="link"
                  icon={<EditOutlined />}
                />
              </Link>
            </Col>
          ) : null}
        </Row>
      ),
    },
  ];
};

export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "vod.table.options",
  });

  return [
    { label: t("0"), value: "ticketNumber" },
    { label: t("1"), value: "category" },
    { label: t("2"), value: "shipmentNo" },
    { label: t("3"), value: "referenceNo" },
    { label: t("4"), value: "licensePlate" },
  ];
};
