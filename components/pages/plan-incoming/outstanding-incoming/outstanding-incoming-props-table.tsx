/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  // HolderOutlined, // reuse when the Hold feature is re-enabled
  ScanOutlined,
  SlidersOutlined,
  StopOutlined,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import StatusTag from "@sera-components/status-tag";
import { OutstandingIncomingRow } from "@sera-types/outstanding-incoming.type";
import { ROUTE } from "@sera-utils/constants/routes";
import FormatUtils from "@sera-utils/format";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { Col, Dropdown, Grid, MenuProps, Row, Space, Tag } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export interface RowActionHandlers {
  onHold: (row: OutstandingIncomingRow) => void;
  onAdjustQty: (row: OutstandingIncomingRow) => void;
  onBinning: (row: OutstandingIncomingRow) => void;
  onSlip: (row: OutstandingIncomingRow) => void;
  onEdit: (row: OutstandingIncomingRow) => void;
  onCancel: (row: OutstandingIncomingRow) => void;
  onFlow: (row: OutstandingIncomingRow, status: string) => void;
  onQiWork: (row: OutstandingIncomingRow) => void;
}

/** Flow menu — OutstandingIncoming: transit (MUTATION + TRANS warehouse) vs non-transit. */
const flowMenuItems = (record: OutstandingIncomingRow): MenuProps["items"] => {
  const isTransit =
    record.poType?.toUpperCase() === "MUTATION" &&
    (record.warehouseCode ?? "").toUpperCase().includes("TRANS");

  if (isTransit) {
    return [
      { key: "Transit In", label: "1. Transit In" },
      { key: "Transit Out", label: "2. Transit Out" },
    ];
  }

  return [
    { key: "Quality Inspection", label: "1. Quality Inspection" },
    { key: "Barcode Labeling", label: "2. Barcode Labeling" },
    { key: "__binning__", label: "3. Binning" },
    { key: "Goods Receipt", label: "4. Goods Receipt" },
  ];
};

/** searchBy options — LOGIS pattern (whitelist = 7 search columns, SP parity). */
export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.table.options",
  });

  return [
    { label: t("0"), value: "deliveryNoteNo" },
    { label: t("1"), value: "poNo" },
    { label: t("2"), value: "customerName" },
    { label: t("3"), value: "referenceNo" },
    { label: t("4"), value: "supplierName" },
    { label: t("5"), value: "description" },
    { label: t("6"), value: "status" },
  ];
};

export const Columns = (handlers: RowActionHandlers) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.table",
  });

  const { isRead, isUpdate, isDelete } = useCheckPermission({
    menuLink: ROUTE.PLAN_INCOMING.OUTSTANDING_INCOMING,
  });

  const { xl } = Grid.useBreakpoint();
  const leftFixed = xl ? "left" : undefined;
  const rightFixed = xl ? "right" : undefined;

  const toDate = (v?: string | null) =>
    v ? FormatUtils().dateTimeTransform(v) : "-";

  return [
    {
      title: "No",
      key: "no",
      render: (_: never, record: any) => (
        <Row justify="center">
          <Col>{record.no}</Col>
        </Row>
      ),
      fixed: leftFixed,
      exception: true,
      width: 60,
    },
    {
      title: t("column.status"),
      dataIndex: "status",
      key: "status",
      truncate: true,
      fixed: leftFixed,
      width: 190,
      render: (value: string, record: OutstandingIncomingRow) => (
        <Space size={4} wrap={false}>
          <StatusTag value={value ?? "-"} fallback="default" />
          {record.isHold ? <Tag color="warning">HOLD</Tag> : null}
        </Space>
      ),
    },
    {
      title: t("column.deliveryNoteNo"),
      dataIndex: "deliveryNoteNo",
      key: "deliveryNoteNo",
      truncate: true,
      width: 160,
    },
    {
      title: t("column.poNo"),
      dataIndex: "poNo",
      key: "poNo",
      truncate: true,
      width: 140,
    },
    {
      title: t("column.poType"),
      dataIndex: "poType",
      key: "poType",
      truncate: true,
      width: 110,
    },
    {
      title: t("column.poDate"),
      dataIndex: "poDate",
      key: "poDate",
      width: 160,
      render: (value: string) => toDate(value),
    },
    {
      title: t("column.customerName"),
      dataIndex: "customerName",
      key: "customerName",
      truncate: true,
      width: 180,
    },
    {
      title: t("column.warehouseName"),
      dataIndex: "warehouseName",
      key: "warehouseName",
      truncate: true,
      width: 160,
    },
    {
      title: t("column.supplierName"),
      dataIndex: "supplierName",
      key: "supplierName",
      truncate: true,
      width: 160,
    },
    {
      title: t("column.incomingDate"),
      dataIndex: "incomingDate",
      key: "incomingDate",
      width: 160,
      render: (value: string) => toDate(value),
    },
    {
      title: t("column.referenceNo"),
      dataIndex: "referenceNo",
      key: "referenceNo",
      truncate: true,
      width: 130,
    },
    {
      title: t("column.description"),
      dataIndex: "description",
      key: "description",
      truncate: true,
      width: 180,
    },
    {
      title: t("column.createdBy"),
      dataIndex: "createdBy",
      key: "createdBy",
      truncate: true,
      width: 130,
    },
    {
      title: t("column.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (value: string) => toDate(value),
    },
    {
      title: t("column.action"),
      key: "action",
      fixed: rightFixed,
      exception: true,
      width: 220,
      render: (_: never, record: OutstandingIncomingRow) => (
        <Space size={4} wrap={false}>
          {isRead && (
            <Link
              href={`${ROUTE.PLAN_INCOMING.OUTSTANDING_INCOMING}/${record.id}`}
            >
              <Button
                size="small"
                type="text"
                icon={<EyeOutlined />}
                tooltip={t("button.view")}
              />
            </Link>
          )}
          {isUpdate && record.status !== "Draft" && (
            <Button
              size="small"
              type="text"
              icon={<SlidersOutlined />}
              tooltip={t("button.adjustQty")}
              onClick={() => handlers.onAdjustQty(record)}
            />
          )}
          {/* Hold feature hidden for now
          {isUpdate && (
            <Button
              size="small"
              type="text"
              icon={<HolderOutlined />}
              tooltip={t("button.hold")}
              onClick={() => handlers.onHold(record)}
            />
          )}
          */}
          {isUpdate && record.status !== "Draft" && (
            <Dropdown
              trigger={["click"]}
              menu={{
                items: flowMenuItems(record),
                onClick: ({ key }) => {
                  if (key === "__binning__") return handlers.onBinning(record);
                  // QI when already in QI opens the QI working screen (material edit)
                  if (
                    key === "Quality Inspection" &&
                    record.status === "Quality Inspection"
                  )
                    return handlers.onQiWork(record);
                  handlers.onFlow(record, key);
                },
              }}
            >
              <Button
                size="small"
                type="text"
                icon={<ScanOutlined />}
                tooltip={t("button.flow")}
              />
            </Dropdown>
          )}
          {isUpdate && (
            <Button
              size="small"
              type="text"
              icon={<FileTextOutlined />}
              tooltip={t("button.slip")}
              onClick={() => handlers.onSlip(record)}
            />
          )}
          {isUpdate && record.status === "Draft" && (
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              tooltip={t("button.edit")}
              onClick={() => handlers.onEdit(record)}
            />
          )}
          {isDelete && record.status === "Draft" && (
            <Button
              size="small"
              type="text"
              danger
              icon={<StopOutlined />}
              tooltip={t("button.cancel")}
              onClick={() => handlers.onCancel(record)}
            />
          )}
        </Space>
      ),
    },
  ];
};

export default Columns;
