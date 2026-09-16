/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// parity legacy OutgoingReport.js: filter tanggal default hari ini, max 31 hari
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
  outgoingReportActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import { outgoingReportTypes } from "@sera-types/outgoing-report.type";
import { OutgoingReportListPayload } from "@sera-types/outgoing-report.type";
import { Col, DatePicker, Dropdown, message, Row } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx-js-style";

import { Columns, SearchByOptions } from "./outgoing-report-props-table";

const INIT_SEARCH_BY = "poDate";
const DATE_FMT = "YYYY-MM-DD";

/** Default list — rentang hari ini, sort poDate desc (parity legacy) */
const DEFAULT_LIST_OPTIONS: BaseType & { [key: string]: any } = {
  page: 1,
  limit: 10,
  order: "poDate",
  sort: "desc",
  startDate: dayjs().format(DATE_FMT),
  endDate: dayjs().format(DATE_FMT),
};

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
  {
    labelKey: "table.column.actualQty",
    key: "actualQty",
    width: 14,
    num: true,
  },
  { labelKey: "table.column.uom", key: "uom", width: 10 },
  { labelKey: "table.column.deliveryNoteNo", key: "deliveryNoteNo", width: 24 },
  { labelKey: "table.column.poDate", key: "poDate", width: 16 },
];

const exportTimestamp = () =>
  new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");

const poDateOnly = (v: any) => (v ? String(v).split("T")[0] : "");

/** Ekspor Excel ber-style — pola stock-availability */
const exportExcel = (rows: any[], t: any, subtitle: string) => {
  if (!rows.length) return;
  const cols = EXPORT_COLUMNS.map((c) => ({ ...c, label: t(c.labelKey) }));
  const aoa = [
    [t("table.title")],
    [subtitle],
    [],
    cols.map((c) => c.label),
    ...rows.map((r) =>
      cols.map((c) =>
        c.key === "poDate" ? poDateOnly(r[c.key]) : (r[c.key] ?? 0),
      ),
    ),
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
      };
    });
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Outgoing Report");
  XLSX.writeFile(wb, `outgoing-report-${exportTimestamp()}.xlsx`);
};

/** Ekspor CSV (BOM UTF-8) */
const exportCsv = (rows: any[], t: any) => {
  if (!rows.length) return;
  const cols = EXPORT_COLUMNS.map((c) => ({ ...c, label: t(c.labelKey) }));
  const esc = (v: any) => `"${String(v ?? "-").replace(/"/g, '""')}"`;
  const csv = [
    cols.map((c) => esc(c.label)).join(","),
    ...rows.map((r) =>
      cols
        .map((c) => esc(c.key === "poDate" ? poDateOnly(r[c.key]) : r[c.key]))
        .join(","),
    ),
  ].join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `outgoing-report-${exportTimestamp()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const OutgoingReportInitialPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(undefined, {
    keyPrefix: "report.outgoingReport",
  });

  const { data, options } = useAppSelector((state) => state.outgoingReport);
  const loading = useAppSelector(
    (state) => state.loading[outgoingReportTypes.GET_INCOMING_REPORT],
  );

  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);
  const [listOptions, setListOptions] = useState<
    BaseType & { [key: string]: any }
  >(DEFAULT_LIST_OPTIONS);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs(),
    dayjs(),
  ]);

  // Columns memanggil hook (useTranslation/useBreakpoint) — dieksekusi tiap render
  const columns = (Columns() ?? []) as any[];

  const refresh = () =>
    dispatch(
      outgoingReportActions.getOutgoingReportFetch(
        listOptions as OutgoingReportListPayload,
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

  /** Ganti searchBy: PO Date → range di input; kolom lain → teks */
  const handlerSelectSearchBy = (value?: string) => {
    const next = value ?? INIT_SEARCH_BY;
    setSearchBy(next);
    setListOptions((prevState: any) => ({
      ...prevState,
      search: null,
      page: 1,
    }));
  };

  /** Parity legacy btnSearchDate: wajib isi, end ≥ start, max 31 hari inklusif */
  const onRangeChange = (values: any) => {
    const [start, end] = values ?? [];
    if (!start || !end) {
      message.warning(t("table.warning.required"));
      return;
    }
    if (end.isBefore(start, "day")) {
      message.warning(t("table.warning.order"));
      return;
    }
    if (end.diff(start, "day") > 30) {
      message.warning(t("table.warning.max"));
      return;
    }
    setDateRange([start, end]);
    setListOptions((prevState: any) => ({
      ...prevState,
      startDate: start.format(DATE_FMT),
      endDate: end.format(DATE_FMT),
      page: 1,
    }));
  };

  const subtitle = `${t("table.date.range")}: ${listOptions.startDate} → ${listOptions.endDate}`;

  return (
    <Card noShadow>
      <Table
        title={t("table.title")}
        columns={columns}
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
          <Row align="middle" gutter={[8, 8]}>
            <Col flex="0 0 14rem">
              <Select
                style={{ width: "100%" }}
                id="outgoing-report-search-by"
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
              {searchBy === "poDate" ? (
                <DatePicker.RangePicker
                  style={{ width: "100%", minWidth: "18rem" }}
                  value={dateRange}
                  allowEmpty={[false, false]}
                  onChange={onRangeChange}
                />
              ) : (
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
              )}
            </Col>
          </Row>
        }
        actions={
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
                if (key === "xlsx") exportExcel(data, t, subtitle);
                else exportCsv(data, t);
              },
            }}
          >
            <Button icon={<DownloadOutlined />}>
              {t("table.button.export")}
            </Button>
          </Dropdown>
        }
      />
    </Card>
  );
};

export default OutgoingReportInitialPage;
