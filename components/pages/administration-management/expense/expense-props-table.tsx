/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { EditOutlined } from "@sera-components/icons";
import { ShipmentExpenses } from "@sera-types/expense-monitoring";
import {
  DATE_FORMAT,
  FORMAT_DATE_TIME,
  NUMBER_FORMAT,
} from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export const ColumnsSummary = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.table.summary.column",
  });

  const SUMMARY_HEADER_CHILD = (_key1: string, _key2: string) => [
    {
      key: _key1,
      dataIndex: _key1,
      title: t("childrens.0"),
      align: "center",
      render: (_record: string) => NUMBER_FORMAT(_record),
    },
    {
      key: _key2,
      dataIndex: _key2,
      title: t("childrens.1"),
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
  ];

  return [
    {
      key: "branchName",
      dataIndex: "branchName",
      title: t("branchName"),
    },
    {
      key: "requested",
      dataIndex: "requested",
      title: t("requested"),
      align: "center",
      children: SUMMARY_HEADER_CHILD("requestedQty", "requestedAmount"),
    },
    {
      key: "termin1",
      dataIndex: "termin1",
      title: t("termin1"),
      align: "center",
      children: SUMMARY_HEADER_CHILD("termin1Qty", "termin1Amount"),
    },
    {
      key: "termin2",
      dataIndex: "termin2",
      title: t("termin2"),
      align: "center",
      children: SUMMARY_HEADER_CHILD("termin2Qty", "termin2Amount"),
    },
    {
      key: "termin3",
      dataIndex: "termin3",
      title: t("termin3"),
      align: "center",
      children: SUMMARY_HEADER_CHILD("termin3Qty", "termin3Amount"),
    },
    {
      key: "termin4",
      dataIndex: "termin4",
      title: t("termin4"),
      align: "center",
      children: SUMMARY_HEADER_CHILD("termin4Qty", "termin4Amount"),
    },
    {
      key: "termin5",
      dataIndex: "termin5",
      title: t("termin5"),
      align: "center",
      children: SUMMARY_HEADER_CHILD("termin5Qty", "termin5Amount"),
    },
    {
      key: "termin6",
      dataIndex: "termin6",
      title: t("termin6"),
      align: "center",
      children: SUMMARY_HEADER_CHILD("termin6Qty", "termin6Amount"),
    },
    {
      key: "total",
      dataIndex: "total",
      title: t("total"),
      align: "center",
      children: SUMMARY_HEADER_CHILD("totalQty", "totalAmount"),
    },
  ];
};

export const UNCHECK_SHIPMENT_KEYS = ["termin1TransferDate"];

interface ColumnsShipmentProps {
  onUpdate?: (_record: ShipmentExpenses) => void;
}

export const ColumnsShipment = ({ onUpdate }: ColumnsShipmentProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.table.shipment.column",
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
      key: "expenseActivity",
      dataIndex: "expenseActivity",
      title: t("expenseActivity"),
      fixed: "left",
    },
    {
      key: "shipmentNo",
      dataIndex: "shipmentNo",
      title: t("shipmentNo"),
      fixed: "left",
    },
    {
      key: "bookingOrderNo",
      dataIndex: "bookingOrderNo",
      title: t("bookingOrderNo"),
    },
    {
      key: "customerName",
      dataIndex: "customerName",
      title: t("customerName"),
    },
    {
      key: "shipmentType",
      dataIndex: "shipmentType",
      title: t("shipmentType"),
    },
    {
      key: "unitType",
      dataIndex: "unitType",
      title: t("unitType"),
    },
    {
      key: "originName",
      dataIndex: "originName",
      title: t("originName"),
    },
    {
      key: "destinationName",
      dataIndex: "destinationName",
      title: t("destinationName"),
    },
    {
      key: "licensePlate",
      dataIndex: "licensePlate",
      title: t("licensePlate"),
    },
    {
      key: "driver1Name",
      dataIndex: "driver1Name",
      title: t("driver1Name"),
    },
    {
      key: "driver2Name",
      dataIndex: "driver2Name",
      title: t("driver2Name"),
      render: (_record: string) => _record || "-",
    },
    {
      key: "termin1TransferDate",
      dataIndex: "termin1TransferDate",
      title: t("termin1TransferDate"),
      render: (_record: string) => DATE_FORMAT(_record, FORMAT_DATE_TIME),
    },
    {
      key: "expenseTransfered",
      dataIndex: "expenseTransfered",
      title: t("expenseTransfered"),
      fixed: "right",
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "totalExpense",
      dataIndex: "totalExpense",
      title: t("totalExpense"),
      fixed: "right",
      render: (_record: string) => `Rp ${NUMBER_FORMAT(_record)}`,
    },
    {
      key: "action",
      dataIndex: "shipmentId",
      title: t("action"),
      fixed: "right",
      exception: true,
      render: (_record: string, _row: ShipmentExpenses) => (
        <Row justify="center" gutter={[8, 4]}>
          <Col>
            <Link
              id="link-detail-expense-shipment"
              href={`${ROUTE.ADMINISTRATION_MANAGEMENT.EXPENSE}/${_record}`}
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

          <Col>
            <Button
              id="edit-button"
              size="small"
              tooltip={t("button.edit.tooltip")}
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                if (onUpdate) onUpdate(_row);
              }}
            />
          </Col>
        </Row>
      ),
    },
  ];
};

export const ShipmentSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "admExpense.table.shipment.options",
  });

  return [
    { label: t("0"), value: "expenseActivity" },
    { label: t("1"), value: "shipmentNo" },
    { label: t("2"), value: "customerName" },
  ];
};
