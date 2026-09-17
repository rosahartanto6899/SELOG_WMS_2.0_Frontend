/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SohAllSlocReportRow } from "@sera-types/soh-all-sloc-report.type";
import { Grid } from "antd";
import { useTranslation } from "react-i18next";

/** searchBy options — whitelist sama dengan backend */
export const SearchByOptions = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "report.sohAllSlocReport.table.options",
  });

  return [
    { label: t("0"), value: "materialCode" },
    { label: t("1"), value: "materialName" },
    { label: t("2"), value: "materialBrand" },
  ];
};

/** Kolom table — parity legacy: No, Material Code, Material Name, Brand, Total,
 *  lalu satu kolom qty per kode warehouse user (dinamis dari response). */
export const Columns = (warehouseCodes: string[] = []) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "report.sohAllSlocReport.table",
  });

  const { xl } = Grid.useBreakpoint();
  const leftFixed = xl ? "left" : undefined;

  const base = [
    {
      title: "No",
      key: "no",
      align: "center" as const,
      render: (_: never, record: SohAllSlocReportRow) => record.no,
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
      title: t("column.totalQty"),
      dataIndex: "totalQty",
      key: "totalQty",
      align: "right" as const,
      sorter: true,
      width: 110,
    },
  ];

  // kolom warehouse dinamis — parity DataTable legacy (dt-right, qty atau 0)
  const warehouseColumns = warehouseCodes.map((code) => ({
    title: code,
    key: `whs-${code}`,
    align: "right" as const,
    width: 130,
    render: (_: never, record: SohAllSlocReportRow) =>
      record.warehouses?.[code] ?? 0,
  }));

  return [...base, ...warehouseColumns];
};

export default Columns;
