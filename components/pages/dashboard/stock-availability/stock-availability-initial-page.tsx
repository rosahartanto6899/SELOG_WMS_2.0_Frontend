/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// parity legacy wms-hold-bg / wms-packaging-bg (row highlight SOH negatif / nol)
import {
  DownloadOutlined,
  FileExcelOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import {
  stockAvailabilityActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import { stockAvailabilityTypes } from "@sera-types/stock-availability.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { useIsMobileView } from "@sera-utils/hooks/useIsMobileView";
import { Col, Dropdown, Row, Space, Typography } from "antd";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx-js-style";

import MobileTableHeader from "../../plan-outgoing/outstanding-outgoing/mobile-table-header";
import styles from "./stock-availability.module.scss";
import { Columns, SearchByOptions } from "./stock-availability-props-table";

const INIT_SEARCH_BY = "materialCode";

/** Default list — dipakai saat belum ada cache Redux. */
const DEFAULT_LIST_OPTIONS: BaseType & { [key: string]: any } = {
  page: 1,
  limit: 10,
  order: "materialCode",
  sort: "asc",
};

/** Kunci payload list — dipakai hydrate state lokal & deteksi cache valid
 *  (kembali dari halaman Detail) agar tidak fetch ulang. */
const LIST_KEYS = ["page", "limit", "order", "sort", "search", "searchBy"];

/** Kolom ekspor — label & urutan sama dengan tabel (i18n), num → format angka.
 *  Plan Incoming/Outgoing & Available tidak diekspor (tidak tampil di tabel). */
interface ExportColumn {
  labelKey: string;
  key: string;
  width: number;
  num?: boolean;
}
const EXPORT_COLUMNS: ExportColumn[] = [
  { labelKey: "table.column.materialCode", key: "materialCode", width: 22 },
  { labelKey: "table.column.materialName", key: "materialName", width: 40 },
  { labelKey: "table.column.materialBrand", key: "materialBrand", width: 22 },
  { labelKey: "table.column.uom", key: "uom", width: 10 },
  { labelKey: "table.column.qtySOH", key: "qtySOH", width: 16, num: true },
];

const exportTimestamp = () =>
  new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");

/** Ekspor Excel ber-style: judul, header biru bold, zebra, border,
 *  angka #,##0, SOH negatif merah (parity Tag merah di tabel). */
const exportExcel = (rows: any[], t: any, subtitle: string) => {
  if (!rows.length) return;
  const cols = EXPORT_COLUMNS.map((c) => ({ ...c, label: t(c.labelKey) }));
  const aoa = [
    [t("table.title")],
    [subtitle],
    [],
    cols.map((c) => c.label),
    ...rows.map((r) => cols.map((c) => r[c.key] ?? 0)),
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  const thin = { style: "thin", color: { rgb: "D9D9D9" } };
  const border = { top: thin, bottom: thin, left: thin, right: thin };
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
    fill: { patternType: "solid", fgColor: { rgb: "2F55EB" } },
    alignment: { horizontal: "center", vertical: "center" },
    border,
  };

  const lastCol = XLSX.utils.encode_col(cols.length - 1);
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: cols.length - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: cols.length - 1 } },
  ];
  ws["!cols"] = cols.map((c) => ({ wch: c.width }));
  ws["!autofilter"] = {
    ref: `A4:${lastCol}${aoa.length}`,
  };

  ws["A1"].s = {
    font: { bold: true, sz: 14, color: { rgb: "1F1F1F" } },
  };
  ws["A2"].s = { font: { italic: true, sz: 10, color: { rgb: "8C8C8C" } } };

  cols.forEach((_, i) => {
    ws[`${XLSX.utils.encode_col(i)}4`].s = headerStyle;
  });

  rows.forEach((row, r) => {
    const negativeSoh = Number(row.qtySOH) < 0;
    cols.forEach((c, i) => {
      const cell = ws[`${XLSX.utils.encode_col(i)}${r + 5}`];
      if (!cell) return;
      cell.s = {
        border,
        alignment: c.num ? { horizontal: "right" } : { vertical: "center" },
        numFmt: c.num ? "#,##0" : undefined,
        fill:
          r % 2 === 1
            ? { patternType: "solid", fgColor: { rgb: "F5F7FF" } }
            : undefined,
        font:
          negativeSoh && c.key === "qtySOH"
            ? { color: { rgb: "CF1322" }, bold: true }
            : undefined,
      };
    });
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Stock Availability");
  XLSX.writeFile(wb, `stock-availability-${exportTimestamp()}.xlsx`);
};

/** Ekspor CSV (buka di Excel; BOM agar UTF-8 terbaca). */
const exportCsv = (rows: any[], t: any) => {
  if (!rows.length) return;
  const cols = EXPORT_COLUMNS.map((c) => ({ ...c, label: t(c.labelKey) }));
  const esc = (v: any) => `"${String(v ?? "-").replace(/"/g, '""')}"`;
  const csv = [
    cols.map((c) => esc(c.label)).join(","),
    ...rows.map((r) => cols.map((c) => esc(r[c.key])).join(",")),
  ].join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `stock-availability-${exportTimestamp()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const StockAvailabilityInitialPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(undefined, {
    keyPrefix: "dashboard.stockAvailability",
  });

  const { data, options } = useAppSelector((state) => state.stockAvailability);
  const loading = useAppSelector(
    (state) => state.loading[stockAvailabilityTypes.GET_STOCK_AVAILABILITY],
  );

  const { data: session } = useSession() as any;
  const router = useRouter();
  const isMobile = useIsMobileView();
  // parity legacy: dashboard ter-filter customer + warehouse aktif session
  const customerCode = (session?.user?.customerCode ?? "") as string;
  const warehouseCode = (session?.user?.warehouseCode ?? "") as string;

  // kembali dari Detail: hydrate state lokal dari cache Redux — options
  // terisi totalData hanya setelah fetch sukses sebelumnya
  const cached = options?.totalData != null ? options : null;
  const [searchBy, setSearchBy] = useState(
    (cached?.searchBy as string) ?? INIT_SEARCH_BY,
  );
  const [listOptions, setListOptions] = useState<
    BaseType & { [key: string]: any }
  >(() =>
    cached
      ? Object.fromEntries(
          LIST_KEYS.map((k) => [k, cached[k]]).filter(
            ([, v]) => v !== undefined,
          ),
        )
      : DEFAULT_LIST_OPTIONS,
  );

  // jangan bungkus Columns() dalam useMemo: Columns memanggil hook
  // (useTranslation/useBreakpoint) dan harus dieksekusi tiap render
  const columns = (Columns({
    onViewDetail: (record) => {
      router.push(
        `${ROUTE.DASHBOARD_STOCK_AVAILABILITY}/${encodeURIComponent(
          record.materialCode,
        )}`,
      );
    },
  }) ?? []) as any[];

  const refresh = () =>
    dispatch(
      stockAvailabilityActions.getStockAvailabilityFetch({
        ...listOptions,
        customerCode: customerCode || undefined,
        warehouseCode: warehouseCode || undefined,
      }),
    );

  useEffect(() => {
    if (!session) return;
    // kembali dari Detail: listOptions identik dengan cache Redux
    // (page/search/sort sama, sesi customer/warehouse sama) → pakai data
    // lama, jangan fetch ulang
    const isRestored =
      options?.totalData != null &&
      LIST_KEYS.every(
        (k) => (listOptions[k] ?? undefined) === (options[k] ?? undefined),
      ) &&
      (options.customerCode || undefined) === (customerCode || undefined) &&
      (options.warehouseCode || undefined) === (warehouseCode || undefined);
    if (!isRestored) refresh();
  }, [listOptions, customerCode, warehouseCode, session]);

  const onPageChangeListener = (current: number, limit: number) => {
    setListOptions((prevState) => ({ ...prevState, page: current, limit }));
  };

  const onTableChangeListener = (_p: any, _f: any, sorter: any) => {
    if (sorter) {
      setListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : "desc",
      }));
    }
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value ?? INIT_SEARCH_BY);
    setListOptions((prevState: any) => ({
      ...prevState,
      search: null,
      page: 1,
    }));
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Card noShadow>
          <Row justify="space-between" align="middle" gutter={[16, 8]}>
            <Col>
              <Space wrap>
                <Button
                  icon={<ReloadOutlined />}
                  type="primary"
                  loading={loading}
                  onClick={refresh}
                >
                  {t("table.button.refresh")}
                </Button>
                <Typography.Text type="secondary">
                  {t("table.lastUpdated")}:
                  {options?.lastUpdated
                    ? ` ${new Date(options.lastUpdated).toLocaleString()}`
                    : " -"}
                </Typography.Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card noShadow>
          <Table
            title={isMobile ? undefined : t("table.title")}
            columns={
              isMobile
                ? columns.filter(
                    (c: any) =>
                      ["materialCode", "materialName", "qtySOH"].includes(
                        String(c.key),
                      ) || c?.exception,
                  )
                : columns
            }
            dataSource={data}
            loading={loading}
            total={options?.totalData ?? 0}
            current={options?.page ?? 1}
            pageSize={options?.limit ?? 10}
            rowKey="id"
            scroll={{ x: "max-content" }}
            onPageChange={onPageChangeListener}
            onTableChange={onTableChangeListener}
            isCustomSearch
            customSearch={
              isMobile ? (
                <MobileTableHeader
                  title={t("table.title")}
                  selectId="stock-availability-search-by-mobile"
                  searchFilterLabel={t("table.searchFilter")}
                  placeholder={t("table.search.placeholder")}
                  searchBy={searchBy}
                  searchByOptions={SearchByOptions()}
                  currentSearch={(listOptions as any).search}
                  onSelectSearchBy={handlerSelectSearchBy}
                  onSearch={(search?: string) =>
                    setListOptions((prevState: any) => ({
                      ...prevState,
                      search: search || undefined,
                      searchBy: search ? searchBy : undefined,
                      page: 1,
                    }))
                  }
                  menu={{
                    ariaLabel: t("table.button.export"),
                    items: [
                      {
                        key: "xlsx",
                        icon: <FileExcelOutlined />,
                        label: "Excel (.xlsx)",
                      },
                      { key: "csv", label: "CSV (.csv)" },
                    ],
                    onClick: ({ key }) => {
                      const subtitle = `${t("table.lastUpdated")}: ${
                        options?.lastUpdated
                          ? new Date(options.lastUpdated).toLocaleString()
                          : "-"
                      }${customerCode ? ` | ${customerCode}` : ""}${
                        warehouseCode ? ` | ${warehouseCode}` : ""
                      }`;
                      if (key === "xlsx") exportExcel(data, t, subtitle);
                      else exportCsv(data, t);
                    },
                  }}
                />
              ) : (
                <Row align="middle" gutter={[8, 8]}>
                  <Col flex="0 0 12rem">
                    <Select
                      style={{ width: "100%" }}
                      id="stock-availability-search-by"
                      defaultValue={
                        (cached?.searchBy as string) ?? INIT_SEARCH_BY
                      }
                      placeholder={t("table.search.placeholder")}
                      onChange={(value: any) => handlerSelectSearchBy(value)}
                      onClear={() => handlerSelectSearchBy("")}
                      allowClear={false}
                    >
                      {SearchByOptions().map((opt) => (
                        <Select.Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                  <Col flex="auto">
                    <Input.Search
                      loading={false}
                      defaultValue={(cached?.search as string) ?? undefined}
                      style={{ width: "100%", minWidth: "18rem" }}
                      placeholder={t("table.search.placeholder")}
                      onSearch={(search?: string) =>
                        setListOptions((prevState: any) => ({
                          ...prevState,
                          search: search || undefined,
                          searchBy: search ? searchBy : undefined,
                          page: 1,
                        }))
                      }
                      onClear={() =>
                        setListOptions((prevState: any) => ({
                          ...prevState,
                          search: null,
                          searchBy: undefined,
                        }))
                      }
                    />
                  </Col>
                </Row>
              )
            }
            actions={
              isMobile ? null : (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "xlsx",
                        icon: <FileExcelOutlined />,
                        label: "Excel (.xlsx)",
                      },
                      { key: "csv", label: "CSV (.csv)" },
                    ],
                    onClick: ({ key }) => {
                      const subtitle = `${t("table.lastUpdated")}: ${
                        options?.lastUpdated
                          ? new Date(options.lastUpdated).toLocaleString()
                          : "-"
                      }${customerCode ? ` | ${customerCode}` : ""}${
                        warehouseCode ? ` | ${warehouseCode}` : ""
                      }`;
                      if (key === "xlsx") exportExcel(data, t, subtitle);
                      else exportCsv(data, t);
                    },
                  }}
                >
                  <Button icon={<DownloadOutlined />}>
                    {t("table.button.export")}
                  </Button>
                </Dropdown>
              )
            }
            // parity legacy createdRow: qtySOH < 0 → merah, 0 → abu-abu
            rowClassName={(record: any) =>
              Number(record.qtySOH) < 0
                ? styles["row-negative"]
                : Number(record.qtySOH) === 0
                  ? styles["row-zero"]
                  : ""
            }
          />
        </Card>
      </div>
    </>
  );
};

export default StockAvailabilityInitialPage;
