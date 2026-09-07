/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import StatusTag from "@sera-components/status-tag";
import { ActualIncomingRow } from "@sera-types/actual-incoming.type";
import { ROUTE } from "@sera-utils/constants/routes";
import FormatUtils from "@sera-utils/format";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { Grid, Space } from "antd";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

/** searchBy options — whitelist sama dengan A-List backend (7 kolom) */
export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.actualIncoming.table.options",
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

export const Columns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.actualIncoming.table",
  });

  const { isRead } = useCheckPermission({
    menuLink: ROUTE.PLAN_INCOMING.ACTUAL_INCOMING,
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
      align: "center" as const,
      render: (_: never, record: any) => record.no,
      fixed: leftFixed,
      exception: true,
      width: 60,
    },
    {
      title: t("column.status"),
      dataIndex: "status",
      key: "status",
      fixed: leftFixed,
      width: 170,
      render: (value: string) => (
        <StatusTag value={value ?? "-"} fallback="default" />
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
      title: t("column.incomingDate"),
      dataIndex: "incomingDate",
      key: "incomingDate",
      width: 160,
      render: (value: string) => toDate(value),
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
      title: t("column.supplierName"),
      dataIndex: "supplierName",
      key: "supplierName",
      truncate: true,
      width: 160,
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
      title: t("column.additionalInfo"),
      dataIndex: "additionalInfo",
      key: "additionalInfo",
      truncate: true,
      width: 180,
    },
    {
      title: t("column.grDate"),
      dataIndex: "grDate",
      key: "grDate",
      width: 160,
      render: (value: string) => toDate(value),
    },
    {
      title: t("column.grBy"),
      dataIndex: "grBy",
      key: "grBy",
      truncate: true,
      width: 130,
    },
    {
      title: t("column.action"),
      key: "action",
      fixed: rightFixed,
      exception: true,
      render: (_: never, record: ActualIncomingRow) => (
        <Space size={4} wrap={false}>
          {isRead && (
            <Link href={`${ROUTE.PLAN_INCOMING.ACTUAL_INCOMING}/${record.id}`}>
              <Button
                size="small"
                type="text"
                icon={<EyeOutlined />}
                tooltip={t("button.view")}
              />
            </Link>
          )}
        </Space>
      ),
    },
  ];
};

export default Columns;
