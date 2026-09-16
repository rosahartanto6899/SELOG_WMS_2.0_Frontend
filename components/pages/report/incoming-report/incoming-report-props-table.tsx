/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingReportRow } from "@sera-types/incoming-report.type";
import { Grid } from "antd";
import { useTranslation } from "react-i18next";

/** searchBy options — whitelist sama dengan backend; PO Date paling atas,
 *  dipilih → input search jadi range tanggal */
export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "report.incomingReport.table.options",
  });

  return [
    { label: t("0"), value: "poDate" },
    { label: t("1"), value: "materialCode" },
    { label: t("2"), value: "materialName" },
    { label: t("3"), value: "materialBrand" },
    { label: t("4"), value: "deliveryNoteNo" },
  ];
};

/** Kolom table — urutan parity legacy: MaterialCode, MaterialName,
 *  MaterialBrand, ActualQty, UoM, DeliveryNoteNo, PODate (desc). */
export const Columns = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "report.incomingReport.table",
  });

  const { xl } = Grid.useBreakpoint();
  const leftFixed = xl ? "left" : undefined;

  return [
    {
      title: "No",
      key: "no",
      align: "center" as const,
      render: (_: never, record: IncomingReportRow) => record.no,
      fixed: leftFixed,
      exception: true,
      width: 60,
    },
    {
      title: t("column.materialCode"),
      dataIndex: "materialCode",
      key: "materialCode",
      truncate: true,
      sorter: true,
      width: 160,
    },
    {
      title: t("column.materialName"),
      dataIndex: "materialName",
      key: "materialName",
      truncate: true,
      sorter: true,
      width: 220,
    },
    {
      title: t("column.materialBrand"),
      dataIndex: "materialBrand",
      key: "materialBrand",
      truncate: true,
      sorter: true,
      width: 140,
    },
    {
      title: t("column.actualQty"),
      dataIndex: "actualQty",
      key: "actualQty",
      align: "center" as const,
      sorter: true,
      width: 120,
    },
    {
      title: t("column.uom"),
      dataIndex: "uom",
      key: "uom",
      truncate: true,
      width: 90,
    },
    {
      title: t("column.deliveryNoteNo"),
      dataIndex: "deliveryNoteNo",
      key: "deliveryNoteNo",
      truncate: true,
      sorter: true,
      width: 180,
    },
    {
      title: t("column.poDate"),
      dataIndex: "poDate",
      key: "poDate",
      // parity legacy: date-only (String(d).split("T")[0])
      render: (value?: string | null) =>
        value ? String(value).split("T")[0] : "-",
      sorter: true,
      defaultSortOrder: "descend" as const,
      width: 130,
    },
  ];
};

export default Columns;
