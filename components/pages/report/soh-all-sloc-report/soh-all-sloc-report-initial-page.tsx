/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// parity legacy SOHAllSLOC.js: SOH semua SLOC user, kolom warehouse dinamis.
// Loop N+1 per warehouse legacy diganti satu request server-side pivot.
import {
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import {
  sohAllSlocReportActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import { sohAllSlocReportTypes } from "@sera-types/soh-all-sloc-report.type";
import { SohAllSlocReportListPayload } from "@sera-types/soh-all-sloc-report.type";
import { useIsMobileView } from "@sera-utils/hooks/useIsMobileView";
import { Col, Dropdown, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx-js-style";

import MobileTableHeader from "../../plan-outgoing/outstanding-outgoing/mobile-table-header";
import { Columns, SearchByOptions } from "./soh-all-sloc-report-props-table";

const INIT_SEARCH_BY = "materialCode";

const DEFAULT_LIST_OPTIONS: BaseType & { [key: string]: any } = {
  page: 1,
  limit: 10,
  order: "materialCode",
  sort: "asc",
};

const exportTimestamp = () =>
  new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");

/** Ekspor Excel ber-style — pola outgoing-report; kolom warehouse dinamis */
const exportExcel = (
  rows: any[],
  warehouseCodes: string[],
  t: any,
  subtitle: string,
) => {
  if (!rows.length) return;
  const cols = [
    { label: t("table.column.materialCode"), key: "materialCode", width: 22 },
    { label: t("table.column.materialName"), key: "materialName", width: 40 },
    {
      label: t("table.column.materialBrand"),
      key: "materialBrand",
      width: 22,
    },
    {
      label: t("table.column.totalQty"),
      key: "totalQty",
      width: 14,
      num: true,
    },
    ...warehouseCodes.map((code) => ({
      label: code,
      key: `whs:${code}`,
      width: 16,
      num: true,
    })),
  ];
  const cell = (r: any, c: { key: string }) =>
    c.key.startsWith("whs:")
      ? (r.warehouses?.[c.key.slice(4)] ?? 0)
      : (r[c.key] ?? 0);

  const aoa = [
    [t("table.title")],
    [subtitle],
    [],
    cols.map((c) => c.label),
    ...rows.map((r) => cols.map((c) => cell(r, c))),
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
  ws["!autofilter"] = { ref: `A4:${lastCol}${aoa.length}` };

  ws["A1"].s = { font: { bold: true, sz: 14, color: { rgb: "1F1F1F" } } };
  ws["A2"].s = { font: { italic: true, sz: 10, color: { rgb: "8C8C8C" } } };

  cols.forEach((_, i) => {
    ws[`${XLSX.utils.encode_col(i)}4`].s = headerStyle;
  });

  rows.forEach((row, r) => {
    cols.forEach((c, i) => {
      const cll = ws[`${XLSX.utils.encode_col(i)}${r + 5}`];
      if (!cll) return;
      cll.s = {
        border,
        alignment: (c as any).num
          ? { horizontal: "right" }
          : { vertical: "center" },
        numFmt: (c as any).num ? "#,##0" : undefined,
        fill:
          r % 2 === 1
            ? { patternType: "solid", fgColor: { rgb: "F5F7FF" } }
            : undefined,
      };
    });
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SOH All SLOC");
  XLSX.writeFile(wb, `soh-all-sloc-${exportTimestamp()}.xlsx`);
};

/** Ekspor CSV (BOM UTF-8) */
const exportCsv = (rows: any[], warehouseCodes: string[], t: any) => {
  if (!rows.length) return;
  const cols = [
    { label: t("table.column.materialCode"), key: "materialCode" },
    { label: t("table.column.materialName"), key: "materialName" },
    { label: t("table.column.materialBrand"), key: "materialBrand" },
    { label: t("table.column.totalQty"), key: "totalQty" },
    ...warehouseCodes.map((code) => ({ label: code, key: `whs:${code}` })),
  ];
  const val = (r: any, c: { key: string }) =>
    c.key.startsWith("whs:")
      ? (r.warehouses?.[c.key.slice(4)] ?? 0)
      : (r[c.key] ?? "-");
  const esc = (v: any) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [
    cols.map((c) => esc(c.label)).join(","),
    ...rows.map((r) => cols.map((c) => esc(val(r, c))).join(",")),
  ].join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `soh-all-sloc-${exportTimestamp()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const SohAllSlocReportInitialPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(undefined, {
    keyPrefix: "report.sohAllSlocReport",
  });

  const { data, warehouses, options } = useAppSelector(
    (state) => state.sohAllSlocReport,
  );
  const loading = useAppSelector(
    (state) => state.loading[sohAllSlocReportTypes.GET_SOH_ALL_SLOC_REPORT],
  );

  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);
  const isMobile = useIsMobileView();
  const [listOptions, setListOptions] = useState<
    BaseType & { [key: string]: any }
  >(DEFAULT_LIST_OPTIONS);

  // kolom dipanggil tiap render — warehouses dari response backend
  const columns = (Columns(warehouses) ?? []) as any[];

  const refresh = () =>
    dispatch(
      sohAllSlocReportActions.getSohAllSlocReportFetch(
        listOptions as SohAllSlocReportListPayload,
      ),
    );

  useEffect(() => {
    refresh();
  }, [listOptions]);

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

  const subtitle = `${t("table.total.materials")}: ${options?.totalData ?? 0}`;

  return (
    <Card noShadow>
      <Table
        title={isMobile ? undefined : t("table.title")}
        columns={
          isMobile
            ? columns.filter((c: any) =>
                ["materialCode", "materialName", "totalQty"].includes(
                  String(c.key),
                ),
              )
            : columns
        }
        dataSource={data}
        loading={loading}
        total={options?.totalData ?? 0}
        current={options?.page ?? 1}
        pageSize={options?.limit ?? 10}
        rowKey="materialCode"
        scroll={{ x: "max-content" }}
        onPageChange={onPageChangeListener}
        onTableChange={onTableChangeListener}
        isCustomSearch
        customSearch={
          isMobile ? (
            <MobileTableHeader
              title={t("table.title")}
              selectId="soh-all-sloc-search-by-mobile"
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
                  {
                    key: "csv",
                    icon: <FileTextOutlined />,
                    label: "CSV (.csv)",
                  },
                ],
                onClick: ({ key }) => {
                  if (key === "xlsx")
                    exportExcel(data, warehouses, t, subtitle);
                  else exportCsv(data, warehouses, t);
                },
              }}
            />
          ) : (
            <Row align="middle" gutter={[8, 8]}>
              <Col flex="0 0 14rem">
                <Select
                  style={{ width: "100%" }}
                  id="soh-all-sloc-search-by"
                  defaultValue={INIT_SEARCH_BY}
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
                  {
                    key: "csv",
                    icon: <FileTextOutlined />,
                    label: "CSV (.csv)",
                  },
                ],
                onClick: ({ key }) => {
                  if (key === "xlsx")
                    exportExcel(data, warehouses, t, subtitle);
                  else exportCsv(data, warehouses, t);
                },
              }}
            >
              <Button icon={<DownloadOutlined />}>
                {t("table.button.export")}
              </Button>
            </Dropdown>
          )
        }
      />
    </Card>
  );
};

export default SohAllSlocReportInitialPage;
