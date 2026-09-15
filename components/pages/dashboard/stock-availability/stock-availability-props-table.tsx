/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import { StockAvailabilityRow } from "@sera-types/stock-availability.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { Grid, Space, Tag } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

/** searchBy options — whitelist sama dengan Q1 backend (5 kolom, parity SP) */
export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "dashboard.stockAvailability.table.options",
  });

  return [
    { label: t("0"), value: "materialCode" },
    { label: t("1"), value: "materialName" },
    { label: t("2"), value: "materialBrand" },
    { label: t("3"), value: "customerName" },
    { label: t("4"), value: "warehouseName" },
  ];
};

interface ColumnsProps {
  onViewDetail: (record: StockAvailabilityRow) => void;
}

export const Columns = ({ onViewDetail }: ColumnsProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "dashboard.stockAvailability.table",
  });

  const { isRead } = useCheckPermission({
    menuLink: ROUTE.DASHBOARD_STOCK_AVAILABILITY,
  });

  const { xl } = Grid.useBreakpoint();
  const leftFixed = xl ? "left" : undefined;
  const rightFixed = xl ? "right" : undefined;

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
      title: t("column.uom"),
      dataIndex: "uom",
      key: "uom",
      truncate: true,
      width: 90,
    },
    {
      title: t("column.qtySOH"),
      dataIndex: "qtySOH",
      key: "qtySOH",
      align: "center" as const,
      width: 140,
      // parity legacy: 0 → tag netral, < 0 → merah (baris hold/negatif)
      render: (value: number) => (
        <Tag color={value < 0 ? "red" : value === 0 ? "default" : "green"}>
          {value}
        </Tag>
      ),
    },
    {
      title: t("column.action"),
      key: "action",
      fixed: rightFixed,
      exception: true,
      width: 60,
      align: "center" as const,
      render: (_: never, record: StockAvailabilityRow) => (
        <Space size={4} wrap={false}>
          {isRead && (
            <Button
              size="small"
              type="text"
              icon={<EyeOutlined />}
              tooltip={t("button.view")}
              onClick={() => onViewDetail(record)}
            />
          )}
        </Space>
      ),
    },
  ];
};

export default Columns;
