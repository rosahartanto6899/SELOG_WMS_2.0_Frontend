/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  MoreOutlined,
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
import { Col, Dropdown, Grid, MenuProps, Row, Space, Tag, Tooltip } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import styles from "./outstanding-incoming.module.scss";

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

/** Menu status (mantan "Flow") — OutstandingIncoming: transit (MUTATION + TRANS warehouse) vs non-transit. */
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

/** Warna indikator legacy: green = seimbang, blue = partialQty>0, red = unbalanced tanpa partial */
const INDICATOR_COLORS: Record<string, string> = {
  green: "#52c41a",
  blue: "#1677ff",
  red: "#f5222d",
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
      // NOTE: jangan set truncate — Table override render truncate memaksa plain text,
      // menimpa render custom (dot indikator + StatusTag + HOLD)
      fixed: leftFixed,
      width: 190,
      render: (value: string, record: OutstandingIncomingRow) => (
        <Space size={4} wrap={false}>
          <Tooltip title={t(`indicator.${record.indicator ?? "green"}`)}>
            <span
              className={styles["indicator-dot"]}
              style={
                { "--c": INDICATOR_COLORS[record.indicator ?? "green"] } as any
              }
            />
          </Tooltip>
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
      exception: true, // tanpa width → hug konten (table-layout auto via scroll.x max-content)
      render: (_: never, record: OutstandingIncomingRow) => {
        const isDraft = record.status === "Draft";
        // Menu aksi berlabel — ikon-only terbukti tidak discoverable (user harus hover tooltip)
        // Draft: tombol langsung (tanpa titik tiga) — cuma 2 aksi, menu tak perlu
        if (isDraft) {
          return (
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
              {isUpdate && (
                <Button
                  size="small"
                  type="text"
                  icon={<EditOutlined />}
                  tooltip={t("button.edit")}
                  onClick={() => handlers.onEdit(record)}
                />
              )}
              {isUpdate && isDelete && (
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
          );
        }

        // Titik tiga hanya utilitas — menu Status jadi tombol sendiri
        const items: MenuProps["items"] = [
          {
            key: "adjustQty",
            icon: <SlidersOutlined />,
            label: t("button.adjustQty"),
          },
          {
            key: "slip",
            icon: <FileTextOutlined />,
            label: t("button.slip"),
          },
        ];

        // Klik item menu status (mantan Flow)
        const onStatusMenuClick: MenuProps["onClick"] = ({ key }) => {
          if (key === "__binning__") return handlers.onBinning(record);
          // QI saat status sudah QI → layar kerja QI (parity legacy)
          if (
            key === "Quality Inspection" &&
            record.status === "Quality Inspection"
          )
            return handlers.onQiWork(record);
          handlers.onFlow(record, key);
        };

        return (
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
            {isUpdate && (
              <Dropdown
                trigger={["click"]}
                menu={{
                  items: flowMenuItems(record),
                  onClick: onStatusMenuClick,
                }}
              >
                <Button
                  size="small"
                  icon={<ScanOutlined />}
                  tooltip={t("button.flow")}
                >
                  {t("button.flow")}
                </Button>
              </Dropdown>
            )}
            {isUpdate && (
              <Dropdown
                trigger={["click"]}
                menu={{
                  items,
                  onClick: ({ key }) => {
                    if (key === "adjustQty")
                      return handlers.onAdjustQty(record);
                    if (key === "slip") return handlers.onSlip(record);
                  },
                }}
              >
                <Button size="small" type="text" icon={<MoreOutlined />} />
              </Dropdown>
            )}
          </Space>
        );
      },
    },
  ];
};

export default Columns;
