/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CloudDownloadOutlined,
  DeleteOutlined,
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
import { RootState, uploadStockAdjustmentActions } from "@sera-redux";
import type { UploadStockAdjustmentRow } from "@sera-types/upload-stock-adjustment.type";
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
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import * as XLSX from "xlsx";

import {
  COLUMN_LABELS,
  HEADER_KEYS,
  INT_KEYS,
  MAX_ROWS,
  parseRows,
  validateDuplicates,
  validateWorkbookIntegrity,
  XLSXtoJSON,
} from "./upload-stock-adjustment.helpers";

const STATUS_TAG: Record<string, { color: string; label: string }> = {
  pending: { color: "default", label: "pending" },
  submitting: { color: "processing", label: "submitting" },
  success: { color: "success", label: "success" },
  failed: { color: "error", label: "failed" },
};

function UploadStockAdjustmentUpsertBulk(props: any) {
  const { t } = useTranslation(undefined, {
    keyPrefix: "inventoryStock.uploadStockAdjustment",
  });
  const { dispatch, lastResult, isLoading } = props;
  const [data, setData] = useState<UploadStockAdjustmentRow[] | null>(null);
  const [cellErrors, setCellErrors] = useState<Record<string, string>>({});
  const [duplicateErrors, setDuplicateErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tableFilter, setTableFilter] = useState({
    materialCode: "",
    status: undefined as string | undefined,
  });
  const submitRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const lastErrorRef = useRef<unknown>(null);

  // warehouse aktif diambil dari BACKEND via warehouseId session (parity
  // upload-incoming-ahm) — guard FE tetap: tanpa warehouse aktif, submit
  // disabled
  const { data: session, status: sessionStatus } = useSession() as any;
  const [warehouse, setWarehouse] = useState<{
    code: string;
    name: string;
  } | null>(null);
  // Guards the "No active warehouse" message below from flashing red on
  // mount — session/API lookup is async, so `warehouse` briefly reads null
  // before it resolves; only show the message once the lookup has settled.
  const [isWarehouseLoading, setIsWarehouseLoading] = useState(true);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    const warehouseId = session?.user?.warehouseId;
    if (!warehouseId) {
      setWarehouse(null);
      setIsWarehouseLoading(false);
      return;
    }
    setIsWarehouseLoading(true);
    WmsWarehouseApi()
      .retrieveWarehouseDetail({ id: warehouseId })
      .then((resp: any) => {
        const d = resp?.data?.data;
        setWarehouse(d?.code ? { code: d.code, name: d.name ?? "" } : null);
      })
      .catch(() => setWarehouse(null))
      .finally(() => setIsWarehouseLoading(false));
  }, [session?.user?.warehouseId, sessionStatus]);

  // Hapus baris — popup parity outstanding-incoming (Modal.confirm danger).
  // Baris = data lokal (belum/sudah submit); cellErrors di-remap karena
  // key-nya index global — setelah delete, index baris di bawahnya bergeser.
  const onDeleteRow = (record: any) => {
    const idx = Number(record?.key);
    Modal.confirm({
      title: t("confirmDelete"),
      content: t("confirmDeleteHint", {
        code: record?.materialCode ?? "-",
      }),
      okButtonProps: { danger: true },
      onOk: () => {
        setData((prev) => {
          if (!prev) return prev;
          const next = prev
            .filter((_r, i) => i !== idx)
            .map((r, i) => ({ ...r, no: i + 1 }));
          setCurrentPage((p) =>
            Math.min(p, Math.max(1, Math.ceil(next.length / pageSize))),
          );
          return next;
        });
        setCellErrors((prev) => {
          const next: Record<string, string> = {};
          Object.entries(prev).forEach(([k, v]) => {
            const [i, key] = k.split("-");
            const n = Number(i);
            if (n === idx) return;
            next[`${n > idx ? n - 1 : n}-${key}`] = v;
          });
          return next;
        });
        message.success(t("deleted"));
      },
    });
  };

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
        isNumber: INT_KEYS.includes(key),
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
      {
        title: t("colAction"),
        key: "action",
        width: 60,
        fixed: "right" as const,
        align: "center" as const,
        render: (_: any, record: any) => (
          <Button
            size="small"
            type="text"
            danger
            icon={<DeleteOutlined />}
            tooltip={t("delete")}
            disabled={isSubmitting || record?.upsertStatus === "submitting"}
            onClick={() => onDeleteRow(record)}
          />
        ),
      },
    ],
    [t, isSubmitting],
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
      dispatch(uploadStockAdjustmentActions.downloadTemplateClear());
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
          uploadStockAdjustmentActions.upsertRowFetch({
            index: pending,
            row: next[pending],
          }),
        );
      } else {
        setIsSubmitting(false);
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult]);

  // Duplikat MaterialCode dalam satu file — revalidasi tiap data berubah
  // (termasuk edit sel), parity aturan preview SP lama.
  useEffect(() => {
    setDuplicateErrors(data ? validateDuplicates(data) : {});
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
            throw new Error(t("message.limit", { max: MAX_ROWS }));
          }

          const errors: Record<string, string> = {};
          const rows = parseRows(workbook, (rowIndex, key, kind) => {
            errors[`${rowIndex}-${key}`] = kind;
          });
          setCellErrors(errors);
          dispatch(uploadStockAdjustmentActions.upsertSummaryClear());
          setData(rows);
          setDuplicateErrors(validateDuplicates(rows));
          setCurrentPage(1);
          setPageSize(10);
          setTableFilter({ materialCode: "", status: undefined });
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
    dispatch(uploadStockAdjustmentActions.upsertSummaryClear());
    setIsSubmitting(true);
    setData((prev) => {
      if (!prev) return prev;
      const next: UploadStockAdjustmentRow[] = prev.map((r) =>
        r.upsertStatus === "success" ? r : { ...r, upsertStatus: "pending" },
      );
      const first = next.findIndex((r) => r.upsertStatus === "pending");
      if (first < 0) {
        setIsSubmitting(false);
        return prev;
      }
      next[first].upsertStatus = "submitting";
      dispatch(
        uploadStockAdjustmentActions.upsertRowFetch({
          index: first,
          row: next[first],
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
    if (Object.keys(cellErrors).length || Object.keys(duplicateErrors).length) {
      message.error(
        Object.keys(duplicateErrors).length
          ? t("message.duplicate")
          : t("message.cellError"),
      );
      return;
    }
    Modal.confirm({
      title: t("confirmTitle"),
      content: t("confirmContent", {
        count: toSubmit,
        warehouse: `${warehouse?.code} — ${warehouse?.name}`,
      }),
      okText: t("submit"),
      cancelText: t("cancel"),
      onOk: doSubmit,
    });
  };

  const summary = props.summary as { success: number; failed: number } | null;
  const showSummary =
    !isSubmitting && summary && summary.success + summary.failed > 0;

  const tableDataSource = useMemo(
    () => data?.map((r, i) => ({ ...r, key: String(i) })) ?? [],
    [data],
  );

  // Filter MaterialCode (substring, case-insensitive) + Status (exact) —
  // diterapkan SEBELUM slice pagination di bawah, supaya pencarian mencakup
  // semua baris, bukan cuma halaman aktif.
  const filteredDataSource = useMemo(() => {
    const mc = tableFilter.materialCode.trim().toLowerCase();
    return tableDataSource.filter((row: any) => {
      if (
        mc &&
        !String(row.materialCode ?? "")
          .toLowerCase()
          .includes(mc)
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
              {!isWarehouseLoading && !warehouse && (
                <Typography.Text type="danger" style={{ fontSize: 12 }}>
                  {t("noActiveWarehouse")}
                </Typography.Text>
              )}
              <Button
                icon={<CloudDownloadOutlined />}
                loading={isLoading}
                onClick={() =>
                  dispatch(
                    uploadStockAdjustmentActions.downloadTemplateFetch({
                      fileName: "Template-UploadStockAdjustment.xlsx",
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
                placeholder={t("filter.materialCode")}
                value={tableFilter.materialCode}
                onChange={(e) =>
                  onChangeTableFilter({ materialCode: e.target.value })
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
  lastResult: state.uploadStockAdjustment?.lastResult,
  isLoading: state.uploadStockAdjustment?.isLoading,
  error: state.uploadStockAdjustment?.error,
  summary: state.uploadStockAdjustment?.summary,
});

export default connect(mapStateToProps)(UploadStockAdjustmentUpsertBulk);
