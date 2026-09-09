/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  ScanOutlined,
  StopOutlined,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import StatusTag from "@sera-components/status-tag";
import { OutstandingOutgoingListRow } from "@sera-types/outstanding-outgoing.type";
import { ROUTE } from "@sera-utils/constants/routes";
import FormatUtils from "@sera-utils/format";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { Col, Dropdown, Grid, MenuProps, Row, Space, Tooltip } from "antd";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import styles from "./outstanding-outgoing.module.scss";

/** Handler aksi baris — parity pola RowActionHandlers incoming */
export interface RowActionHandlers {
  /** Transisi status per baris (Picking/QC/Transit/Ready To Ship) */
  onFlow: (row: OutstandingOutgoingListRow, status: string) => void;
  /** Draft -> form edit input-outgoing?id= */
  onEditDraft: (row: OutstandingOutgoingListRow) => void;
  /** Mode sequential per customer (menu 3 item) */
  isSequential?: boolean;
}

/** Menu status per baris (parity flowMenuItems incoming + btnStatus legacy):
 *  sequential -> Picking/QC/RTS; MUTATION -> Transit; selain itu Picking/QC. */
const flowMenuItems = (
  record: OutstandingOutgoingListRow,
  isSequential?: boolean,
): MenuProps["items"] => {
  // semua material sudah di-picking (indicator YES) + status Packaging →
  // status terkunci, tidak bisa kembali ke Picking/QC
  const locked = record.status === "Packaging" && record.indicator === "YES";
  if (isSequential) {
    return [
      { key: "Picking", label: "1. Picking", disabled: locked },
      {
        key: "Quality Control",
        label: "2. Quality Control",
        disabled: locked,
      },
      { key: "__rts__", label: "3. Ready To Ship" },
    ];
  }
  if ((record.poType ?? "").toUpperCase() === "MUTATION") {
    return [
      { key: "Transit In", label: "1. Transit In" },
      { key: "Transit Out", label: "2. Transit Out" },
    ];
  }
  return [
    { key: "Picking", label: "1. Picking", disabled: locked },
    {
      key: "Quality Control",
      label: "2. Quality Control",
      disabled: locked,
    },
  ];
};

/** Indikator picking parity usp_CheckIndicatorOutgoing — YES hijau / NO merah */
export const INDICATOR_COLORS: Record<string, string> = {
  YES: "#52c41a",
  NO: "#f5222d",
};

/** searchBy options — advanced search popup legacy (3 kolom, SP parity) */
export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.table.options",
  });

  return [
    { label: t("0"), value: "deliveryNoteNo" },
    { label: t("1"), value: "poNo" },
    { label: t("2"), value: "customerDestination" },
    { label: t("3"), value: "referenceNo" },
    { label: t("4"), value: "description" },
    { label: t("5"), value: "status" },
  ];
};

const toDate = (v?: string | null) =>
  v ? FormatUtils().dateTimeTransform(v) : "-";

/** Kolom tab DN List — parity kolom legacy datatableWHS + indikator +
 *  KOLOM AKSI (parity outstanding-incoming: View/Edit/Status/Cancel per baris). */
export const DnListColumns = (handlers?: RowActionHandlers) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.table",
  });

  const { isRead, isUpdate } = useCheckPermission({
    menuLink: ROUTE.PLAN_OUTGOING.OUTSTANDING_OUTGOING,
  });

  const { xl } = Grid.useBreakpoint();
  const leftFixed = xl ? "left" : undefined;
  const rightFixed = xl ? "right" : undefined;

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
      // NOTE: jangan set truncate — override render memaksa plain text (parity catatan incoming)
      fixed: leftFixed,
      width: 170,
      render: (value: string, record: any) => (
        <Space size={4} wrap={false}>
          <Tooltip title={t(`indicator.${record.indicator ?? "NO"}`)}>
            <span
              className={styles["indicator-dot"]}
              style={
                {
                  "--c": INDICATOR_COLORS[record.indicator ?? "NO"],
                } as any
              }
            />
          </Tooltip>
          <StatusTag value={value ?? "-"} fallback="default" />
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
      render: (value: string | null) => value ?? "-",
    },
    {
      title: t("column.poDate"),
      dataIndex: "poDate",
      key: "poDate",
      width: 160,
      render: (value: string) => toDate(value),
    },
    {
      title: t("column.customerDestination"),
      dataIndex: "customerDestination",
      key: "customerDestination",
      truncate: true,
      width: 180,
      render: (value: string | null) => value ?? "-",
    },
    {
      title: t("column.outgoingDate"),
      dataIndex: "outgoingDate",
      key: "outgoingDate",
      width: 160,
      render: (value: string) => toDate(value),
    },
    {
      title: t("column.referenceNo"),
      dataIndex: "referenceNo",
      key: "referenceNo",
      truncate: true,
      width: 130,
      render: (value: string | null) => value ?? "-",
    },
    {
      title: t("column.description"),
      dataIndex: "description",
      key: "description",
      truncate: true,
      width: 180,
    },
    // kolom Additional Information disembunyikan (permintaan user);
    // add-info tetap tersedia di halaman detail (Fase 3)
    {
      title: t("column.createdBy"),
      dataIndex: "createdBy",
      key: "createdBy",
      truncate: true,
      width: 130,
      render: (value: string | null) => value ?? "-",
    },
    {
      title: t("column.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (value: string) => toDate(value),
    },
    ...(handlers
      ? [
          {
            title: t("column.action"),
            key: "action",
            fixed: rightFixed,
            exception: true, // tanpa width -> hug konten (parity incoming)
            render: (_: never, record: OutstandingOutgoingListRow) => {
              const isDraft = record.status === "Draft";

              // Draft: tombol langsung (View + Edit) — parity incoming
              if (isDraft) {
                return (
                  <Space size={4} wrap={false}>
                    {isRead && (
                      <Link
                        href={`${ROUTE.PLAN_OUTGOING.OUTSTANDING_OUTGOING}/${record.id}`}
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
                        onClick={() => handlers.onEditDraft(record)}
                      />
                    )}
                  </Space>
                );
              }

              // Non-draft: View + dropdown Status + Cancel (Cancellation)
              return (
                <Space size={4} wrap={false}>
                  {isRead && (
                    <Link
                      href={`${ROUTE.PLAN_OUTGOING.OUTSTANDING_OUTGOING}/${record.id}`}
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
                        items: flowMenuItems(record, handlers.isSequential),
                        onClick: ({ key }) =>
                          handlers.onFlow(record, key as string),
                      }}
                    >
                      <Button
                        size="small"
                        icon={<ScanOutlined />}
                        tooltip={t("button.status")}
                      >
                        {t("button.status")}
                      </Button>
                    </Dropdown>
                  )}
                  {isUpdate && record.status === "Cancellation" && (
                    <Button
                      size="small"
                      type="text"
                      danger
                      icon={<StopOutlined />}
                      tooltip={t("button.cancelDo")}
                      onClick={() => handlers.onFlow(record, "__cancel_do__")}
                    />
                  )}
                </Space>
              );
            },
          },
        ]
      : []),
  ];
};

/** Kolom tab DN Items — parity datatablePOItems */
export const DnItemsColumns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.table",
  });
  return [
    {
      title: t("column.materialCode"),
      dataIndex: "materialCode",
      key: "materialCode",
      truncate: true,
      width: 150,
    },
    {
      title: t("column.materialName"),
      dataIndex: "materialName",
      key: "materialName",
      truncate: true,
      width: 220,
    },
    {
      title: t("column.materialBrand"),
      dataIndex: "materialBrand",
      key: "materialBrand",
      truncate: true,
      width: 140,
    },
    {
      title: t("column.qty"),
      dataIndex: "poQty",
      key: "poQty",
      width: 90,
      align: "right" as const,
    },
    { title: t("column.uom"), dataIndex: "uom", key: "uom", width: 90 },
    {
      title: t("column.poNo"),
      dataIndex: "poNo",
      key: "poNo",
      truncate: true,
      width: 140,
    },
    {
      title: t("column.deliveryNoteNo"),
      dataIndex: "deliveryNoteNo",
      key: "deliveryNoteNo",
      truncate: true,
      width: 160,
    },
    {
      title: t("column.customerDestination"),
      dataIndex: "customerDestination",
      key: "customerDestination",
      truncate: true,
      width: 180,
    },
  ];
};

/** searchBy options tab DN Items (whitelist Q2) */
export const ItemsSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.table.options",
  });
  return [
    { label: t("materialCodeOpt"), value: "materialCode" },
    { label: t("materialNameOpt"), value: "materialName" },
    { label: t("materialBrandOpt"), value: "materialBrand" },
    { label: t("0"), value: "deliveryNoteNo" },
    { label: t("1"), value: "poNo" },
    { label: t("2"), value: "customerDestination" },
  ];
};

export const PackagingSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.table.options",
  });
  return [
    { label: t("packagingNoOpt"), value: "packagingNo" },
    { label: t("materialCodeOpt"), value: "materialCode" },
    { label: t("materialNameOpt"), value: "materialName" },
  ];
};

export const ShipmentSearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.table.options",
  });
  return [
    { label: t("shipmentNoOpt"), value: "shipmentNo" },
    { label: t("2"), value: "customerDestination" },
  ];
};

/** Kolom tab Packaging — parity datatablePackaging */
export const PackagingColumns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.table",
  });
  return [
    {
      title: t("column.packagingNo"),
      dataIndex: "packagingNo",
      key: "packagingNo",
      truncate: true,
      width: 240,
    },
    {
      title: t("column.materialCode"),
      dataIndex: "materialCode",
      key: "materialCode",
      truncate: true,
      width: 160,
    },
    {
      title: t("column.materialName"),
      dataIndex: "materialName",
      key: "materialName",
      truncate: true,
    },
    {
      title: t("column.qty"),
      dataIndex: "qty",
      key: "qty",
      width: 90,
      align: "right" as const,
    },
    { title: t("column.uom"), dataIndex: "uom", key: "uom", width: 90 },
    {
      title: t("column.weight"),
      dataIndex: "weight",
      key: "weight",
      width: 110,
      align: "right" as const,
    },
    {
      title: t("column.length"),
      dataIndex: "length",
      key: "length",
      width: 100,
      align: "right" as const,
    },
    {
      title: t("column.width"),
      dataIndex: "width",
      key: "width",
      width: 100,
      align: "right" as const,
    },
    {
      title: t("column.height"),
      dataIndex: "height",
      key: "height",
      width: 100,
      align: "right" as const,
    },
  ];
};

/** Kolom tab Shipment — parity datatableShipment */
export const ShipmentColumns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.table",
  });
  return [
    {
      title: t("column.shipmentNo"),
      dataIndex: "shipmentNo",
      key: "shipmentNo",
      truncate: true,
      width: 260,
    },
    {
      title: t("column.customerDestination"),
      dataIndex: "customerDestination",
      key: "customerDestination",
      truncate: true,
      width: 200,
    },
    {
      title: t("column.createdAt"),
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      width: 160,
      render: (value: string | null) => toDate(value),
    },
  ];
};

/** Ikon export dipakai toolbar (T013) */
export const ExportIcon = DownloadOutlined;
