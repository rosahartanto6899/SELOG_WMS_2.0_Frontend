/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CloudDownloadOutlined,
  SendOutlined,
  TableOutlined,
  UploadOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import TableEditable from "@sera-components/table-editable";
import UploadDnD from "@sera-components/upload-dnd";
import WmsWarehouseApi from "@sera-libraries/api/wms-warehouse";
import { RootState, uploadIncomingAhmActions } from "@sera-redux";
import type { UploadIncomingAhmRow } from "@sera-types/upload-incoming-ahm.type";
import {
  Alert,
  Col,
  FloatButton,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import { RcFile } from "antd/lib/upload";
import { cloneDeep } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import * as XLSX from "xlsx";

import {
  COLUMN_LABELS,
  DATE_KEYS,
  HEADER_KEYS,
  MAX_ROWS,
  parseRows,
  TIME_KEYS,
  validateHeaderConsistency,
  validateWorkbookIntegrity,
  XLSXtoJSON,
} from "./upload-incoming-ahm.helpers";

const STATUS_TAG: Record<string, { color: string; label: string }> = {
  pending: { color: "default", label: "pending" },
  submitting: { color: "processing", label: "submitting" },
  success: { color: "success", label: "success" },
  failed: { color: "error", label: "failed" },
};

function UploadIncomingAhmUpsertBulk(props: any) {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.uploadAhm",
  });
  const { dispatch, lastResult, isLoading } = props;
  const [data, setData] = useState<UploadIncomingAhmRow[] | null>(null);
  const [cellErrors, setCellErrors] = useState<Record<string, string>>({});
  const [consistencyErrors, setConsistencyErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tableFilter, setTableFilter] = useState({
    deliveryNoteNo: "",
    poNumber: "",
    supplierPartNumber: "",
    status: undefined as string | undefined,
  });
  const submitRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [warehouse, setWarehouse] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const lastErrorRef = useRef<unknown>(null);

  useEffect(() => {
    WmsWarehouseApi()
      .retrieveDropdownWarehouses()
      .then((resp: any) => setWarehouses(resp?.data?.data ?? []))
      .catch(() => undefined);
  }, []);

  const warehouseOptions = useMemo(
    () =>
      warehouses.map((w: any) => ({
        value: w.id,
        label: `${w.code} — ${w.name}`,
        code: w.code,
        name: w.name,
      })),
    [warehouses],
  );

  const withWarehouse = (row: UploadIncomingAhmRow): UploadIncomingAhmRow => ({
    ...row,
    warehouseCode: warehouse?.code,
    warehouseName: warehouse?.name,
  });

  // Memo — array 22 kolom ini sebelumnya dibuat ulang (reference baru) di
  // SETIAP render, memicu TableEditable membangun ulang seluruh definisi
  // cell-editable-nya tiap kali, walau tidak ada yang berubah. Dikombinasi
  // dataSource ribuan baris, ini bikin komponen terasa berat/lag saat ada
  // render tak terkait (mis. buka dropdown Select Warehouse).
  const columns = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "no",
        key: "no",
        width: 45,
        fixed: "left" as const,
        align: "center" as const,
      },
      ...HEADER_KEYS.map((key) => ({
        title: COLUMN_LABELS[key] ?? key,
        dataIndex: key,
        key,
        isEditable: true,
        isNumber: key === "qtySumDiOri" || key === "qtyDn",
        isDate: DATE_KEYS.includes(key),
        isTime: TIME_KEYS.includes(key),
      })),
      {
        title: t("colStatus"),
        dataIndex: "upsertStatus",
        key: "upsertStatus",
        width: 110,
        fixed: "right" as const,
        render: (_v: any, record: any) => {
          const tag = STATUS_TAG[record?.upsertStatus ?? "pending"];
          return <Tag color={tag.color}>{t(`status.${tag.label}`)}</Tag>;
        },
      },
      {
        title: t("colReason"),
        dataIndex: "upsertReason",
        key: "upsertReason",
        width: 260,
        fixed: "right" as const,
        ellipsis: true,
      },
    ],
    [t],
  );

  // Global error feedback (e.g. template download failed) — once per error change.
  useEffect(() => {
    if (props.error && props.error !== lastErrorRef.current) {
      lastErrorRef.current = props.error;
      message.error(
        typeof props.error === "string"
          ? props.error
          : t("message.downloadFailed"),
      );
      dispatch(uploadIncomingAhmActions.downloadTemplateClear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.error]);

  // Chained submit: apply the last row's result, then continue with the next pending row.
  useEffect(() => {
    if (!lastResult || !data) return;
    setData((prev) => {
      if (!prev) return prev;
      const next = cloneDeep(prev);
      const row = next[lastResult.index];
      if (row && row.upsertStatus === "submitting") {
        row.upsertStatus = lastResult.status;
        row.upsertReason = lastResult.reason ?? "";
      }
      const pending = next.findIndex((r) => r.upsertStatus === "pending");
      if (pending >= 0) {
        next[pending].upsertStatus = "submitting";
        dispatch(
          uploadIncomingAhmActions.upsertRowFetch({
            index: pending,
            row: withWarehouse(next[pending]),
          }),
        );
      } else {
        setIsSubmitting(false);
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult]);

  // One DN = one header — revalidate whenever data changes (including cell edits).
  useEffect(() => {
    setConsistencyErrors(data ? validateHeaderConsistency(data) : {});
  }, [data]);

  const beforeUpload = (file: RcFile) => {
    setIsParsing(true);

    const runParse = () => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const workbook = XLSX.read(arrayBuffer, {
            type: "array",
            cellNF: false,
            cellText: false,
          });

          const integrityError = validateWorkbookIntegrity(workbook);
          if (integrityError) throw new Error(t(integrityError));

          if (XLSXtoJSON(workbook, "Formulir input", 4).length > MAX_ROWS) {
            throw new Error(t("message.limit"));
          }

          const errors: Record<string, string> = {};
          const rows = parseRows(workbook, (rowIndex, key, kind) => {
            errors[`${rowIndex}-${key}`] = kind;
          });
          setCellErrors(errors);
          dispatch(uploadIncomingAhmActions.upsertSummaryClear());
          setData(rows);
          setCurrentPage(1);
          setPageSize(10);
          setTableFilter({
            deliveryNoteNo: "",
            poNumber: "",
            supplierPartNumber: "",
            status: undefined,
          });
          // jumlah baris sudah tampil di judul tabel preview (previewTitle) —
          // toast "X rows read..." jadi tidak perlu, cukup tampilkan warning
          // kalau ada cell yang error.
          if (Object.keys(errors).length)
            message.warning(t("message.cellError"));
        } catch (_error) {
          setData(null);
          if (_error) {
            message.error(
              _error instanceof Error ? _error.message : String(_error),
            );
          }
        } finally {
          // Jeda kecil sebelum overlay ditutup — memberi jaminan tabel +
          // notifikasi (message) sudah benar-benar tampil di layar dulu,
          // bukan hilang bersamaan/duluan sebelum hasilnya kelihatan.
          setTimeout(() => setIsParsing(false), 500);
        }
      };
      reader.onerror = () => {
        setIsParsing(false);
        message.error("Failed to read the selected file.");
      };
      reader.readAsArrayBuffer(file);
    };

    // Double requestAnimationFrame: cara standar browser untuk MENJAMIN satu
    // frame sudah benar-benar dicat (overlay kelihatan) sebelum thread utama
    // sibuk oleh parsing sinkron — setTimeout(0) saja tidak menjamin ini
    // (frame bisa dilewati untuk file kecil yang parsingnya sangat cepat).
    requestAnimationFrame(() => requestAnimationFrame(runParse));

    return false;
  };

  const onChangeData = ({ rowKey, key, value }: any) => {
    // rowKey = index GLOBAL (lihat tableDataSource: key = String(globalIndex)),
    // stabil terhadap halaman pagination — beda dengan `index` bawaan
    // TableEditable yang cuma posisi lokal di slice halaman aktif.
    const globalIndex = Number(rowKey);
    setData((prev) =>
      prev
        ? prev.map((row, i) =>
            i === globalIndex
              ? { ...row, [key]: value, upsertStatus: "pending" }
              : row,
          )
        : prev,
    );
    setCellErrors((prev) => {
      const next = { ...prev };
      delete next[`${globalIndex}-${key}`];
      return next;
    });
  };

  const doSubmit = () => {
    dispatch(uploadIncomingAhmActions.upsertSummaryClear());
    setIsSubmitting(true);
    setData((prev) => {
      if (!prev) return prev;
      const next: UploadIncomingAhmRow[] = prev.map((r) =>
        r.upsertStatus === "success" ? r : { ...r, upsertStatus: "pending" },
      );
      const first = next.findIndex((r) => r.upsertStatus === "pending");
      if (first < 0) {
        setIsSubmitting(false);
        return prev;
      }
      next[first].upsertStatus = "submitting";
      dispatch(
        uploadIncomingAhmActions.upsertRowFetch({
          index: first,
          row: withWarehouse(next[first]),
        }),
      );
      return next;
    });
  };

  const handleSubmit = () => {
    if (!data?.length) return;
    // successful rows are not resubmitted; editing a successful row marks it pending again.
    const toSubmit = data.filter((r) => r.upsertStatus !== "success").length;
    if (!toSubmit) {
      message.info(t("message.nothingToSubmit"));
      return;
    }
    if (
      Object.keys(cellErrors).length ||
      Object.keys(consistencyErrors).length
    ) {
      message.error(
        Object.keys(consistencyErrors).length
          ? t("message.headerMismatch")
          : t("message.cellError"),
      );
      return;
    }
    Modal.confirm({
      title: "Confirm Submission",
      content: `Submit ${toSubmit} row(s) to warehouse ${warehouse?.code} — ${warehouse?.name}?`,
      okText: "Submit",
      cancelText: "Cancel",
      onOk: doSubmit,
    });
  };

  const summary = props.summary as { success: number; failed: number } | null;
  const showSummary =
    !isSubmitting && summary && summary.success + summary.failed > 0;

  // Memo — dulu `data.map(...)` inline di JSX bikin array+objek baru untuk
  // SEMUA baris (bisa ribuan) di setiap render komponen ini, walau `data`
  // sendiri tidak berubah. Table jadi harus reconcile ulang seluruh dataset
  // tiap kali, bikin interaksi lain (mis. buka dropdown) terasa lag.
  const tableDataSource = useMemo(
    () => data?.map((r, i) => ({ ...r, key: String(i) })) ?? [],
    [data],
  );

  // Filter Delivery Note No / PO Number / Supplier Part Number (substring,
  // case-insensitive) + Status (exact) — diterapkan SEBELUM slice pagination
  // di bawah, supaya pencarian mencakup semua baris, bukan cuma halaman aktif.
  const filteredDataSource = useMemo(() => {
    const dn = tableFilter.deliveryNoteNo.trim().toLowerCase();
    const po = tableFilter.poNumber.trim().toLowerCase();
    const spn = tableFilter.supplierPartNumber.trim().toLowerCase();
    return tableDataSource.filter((row: any) => {
      if (
        dn &&
        !String(row.deliveryNoteNo ?? "")
          .toLowerCase()
          .includes(dn)
      )
        return false;
      if (
        po &&
        !String(row.poNumber ?? "")
          .toLowerCase()
          .includes(po)
      )
        return false;
      if (
        spn &&
        !String(row.supplierPartNumber ?? "")
          .toLowerCase()
          .includes(spn)
      )
        return false;
      if (tableFilter.status && row.upsertStatus !== tableFilter.status)
        return false;
      return true;
    });
  }, [tableDataSource, tableFilter]);

  // Slice ke halaman aktif — dulu SELURUH baris (bisa ribuan) dirender ke DOM
  // sekaligus karena Table bersama pakai pagination={false} & mengandalkan
  // caller sudah meng-slice; tanpa ini semua interaksi di halaman jadi berat.
  const pagedDataSource = useMemo(
    () =>
      filteredDataSource.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [filteredDataSource, currentPage, pageSize],
  );

  const onChangeTableFilter = (patch: Partial<typeof tableFilter>) => {
    setTableFilter((prev) => ({ ...prev, ...patch }));
    setCurrentPage(1);
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      {isParsing && (
        <div
          style={{
            alignItems: "center",
            background: "rgb(0 0 0 / 45%)",
            display: "flex",
            inset: 0,
            justifyContent: "center",
            position: "fixed",
            // di bawah z-index toast antd `message` (~1010) — sengaja, supaya
            // notifikasi hasil parsing tetap kelihatan MENUMPUK DI ATAS overlay
            // ini sebelum overlay-nya ditutup, bukan malah ketutup/hilang.
            zIndex: 900,
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Spin size="large" />
            <Typography.Text
              style={{ color: "#fff", whiteSpace: "nowrap" }}
              strong
            >
              {t("message.parsing")}
            </Typography.Text>
          </div>
        </div>
      )}

      <div ref={topRef} />

      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {t("title")}
            </Typography.Title>
            <Typography.Text type="secondary">
              {t("subtitle", { max: MAX_ROWS })}
            </Typography.Text>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "right" }}>
            <Space
              align="start"
              wrap
              style={{ justifyContent: "flex-end", width: "100%" }}
            >
              <div style={{ flex: "1 1 320px", minWidth: 0 }}>
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder={t("selectWarehouse")}
                  style={{ textAlign: "left", width: "100%" }}
                  popupMatchSelectWidth={false}
                  disabled={isSubmitting}
                  options={warehouseOptions}
                  onChange={(_v: any, opt: any) =>
                    setWarehouse({ code: opt.code, name: opt.name })
                  }
                />
                {!warehouse && (
                  <div>
                    <Typography.Text type="danger" style={{ fontSize: 12 }}>
                      {t("required")}
                    </Typography.Text>
                  </div>
                )}
              </div>
              <Button
                icon={<CloudDownloadOutlined />}
                loading={isLoading}
                onClick={() =>
                  dispatch(
                    uploadIncomingAhmActions.downloadTemplateFetch({
                      fileName: "Template-UploadIncomingAHM.xlsx",
                    }),
                  )
                }
              >
                {t("downloadTemplate")}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <Typography.Text strong>
            <UploadOutlined /> {t("stepUpload")}
          </Typography.Text>
          <Typography.Text type="secondary">{t("hintUpload")}</Typography.Text>
          <UploadDnD
            accept=".xlsx"
            beforeUpload={beforeUpload}
            showUploadList={false}
            maxCount={1}
            disabled={isSubmitting || isParsing}
          />
        </Space>
      </Card>

      {showSummary ? (
        <Alert
          type={summary.failed > 0 ? "warning" : "success"}
          showIcon
          message={t("summary", {
            success: summary.success,
            failed: summary.failed,
          })}
          description={
            summary.failed > 0 ? t("summaryFixHint") : t("summaryDone")
          }
        />
      ) : null}

      {data?.length ? (
        <Card
          title={
            <Space>
              <TableOutlined />
              {t("previewTitle", { count: data.length })}
            </Space>
          }
        >
          <Row gutter={[8, 8]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Input
                allowClear
                placeholder={t("filter.deliveryNoteNo")}
                value={tableFilter.deliveryNoteNo}
                onChange={(e) =>
                  onChangeTableFilter({ deliveryNoteNo: e.target.value })
                }
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Input
                allowClear
                placeholder={t("filter.poNumber")}
                value={tableFilter.poNumber}
                onChange={(e) =>
                  onChangeTableFilter({ poNumber: e.target.value })
                }
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Input
                allowClear
                placeholder={t("filter.supplierPartNumber")}
                value={tableFilter.supplierPartNumber}
                onChange={(e) =>
                  onChangeTableFilter({ supplierPartNumber: e.target.value })
                }
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder={t("filter.status")}
                value={tableFilter.status}
                onChange={(status) => onChangeTableFilter({ status })}
                options={Object.entries(STATUS_TAG).map(([value, tag]) => ({
                  value,
                  label: t(`status.${tag.label}`),
                }))}
              />
            </Col>
          </Row>

          <TableEditable
            columns={columns as any}
            dataSource={pagedDataSource}
            onSaveAction={({ key, rowKey, value }: any) =>
              onChangeData({ rowKey, key, value })
            }
            pageSize={pageSize}
            current={currentPage}
            total={filteredDataSource.length}
            onPageChange={(page: number, size: number) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            scroll={{ x: "max-content" }}
            showTitle={false}
            showActions={false}
          />
          <div ref={submitRef} style={{ textAlign: "right", marginTop: 16 }}>
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={isSubmitting}
              disabled={!data?.length || isLoading || !warehouse}
              onClick={handleSubmit}
            >
              {t("submit")}
            </Button>
          </div>
        </Card>
      ) : null}

      {data?.length && !isParsing ? (
        <FloatButton.Group>
          <FloatButton
            icon={<VerticalAlignTopOutlined />}
            tooltip={t("scrollToTop")}
            onClick={() =>
              topRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          />
          <FloatButton
            icon={<VerticalAlignBottomOutlined />}
            tooltip={t("scrollToSubmit")}
            onClick={() =>
              submitRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
              })
            }
          />
        </FloatButton.Group>
      ) : null}
    </Space>
  );
}

const mapStateToProps = (state: RootState) => ({
  lastResult: state.uploadIncomingAhm?.lastResult,
  isLoading: state.uploadIncomingAhm?.isLoading,
  error: state.uploadIncomingAhm?.error,
  summary: state.uploadIncomingAhm?.summary,
});

export default connect(mapStateToProps)(UploadIncomingAhmUpsertBulk);
