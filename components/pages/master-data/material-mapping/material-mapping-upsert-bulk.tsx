/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CloudDownloadOutlined,
  SendOutlined,
  TableOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import TableEditable from "@sera-components/table-editable";
import UploadDnD from "@sera-components/upload-dnd";
import WmsWarehouseApi from "@sera-libraries/api/wms-warehouse";
import { materialLocationMappingActions, RootState } from "@sera-redux";
import type { UploadMaterialLocationMappingRow } from "@sera-types/material-location-mapping.type";
import {
  Alert,
  Col,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { RcFile } from "antd/lib/upload";
import { cloneDeep } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import * as XLSX from "xlsx";

import {
  COLUMN_LABELS,
  HEADER_KEYS,
  MAX_ROWS,
  parseRows,
  validateWorkbookIntegrity,
  XLSXtoJSON,
} from "./material-mapping.helpers";

const STATUS_TAG: Record<string, { color: string; label: string }> = {
  pending: { color: "default", label: "pending" },
  submitting: { color: "processing", label: "submitting" },
  success: { color: "success", label: "success" },
  failed: { color: "error", label: "failed" },
};

function MaterialMappingUpsertBulk(props: any) {
  const { t } = useTranslation(undefined, {
    keyPrefix: "masterData.materialMapping",
  });
  const { dispatch, lastResult, isLoading } = props;
  const [data, setData] = useState<UploadMaterialLocationMappingRow[] | null>(
    null,
  );
  const [cellErrors, setCellErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const withWarehouse = (
    row: UploadMaterialLocationMappingRow,
  ): UploadMaterialLocationMappingRow => ({
    ...row,
    warehouseCode: warehouse?.code,
    warehouseName: warehouse?.name,
  });

  const columns = [
    {
      title: "#",
      dataIndex: "no",
      key: "no",
      width: 45,
      fixed: "left" as const,
    },
    ...HEADER_KEYS.map((key) => ({
      title: COLUMN_LABELS[key] ?? key,
      dataIndex: key,
      key,
      isEditable: true,
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
  ];

  // Global error feedback (e.g. template download failed) — once per error change.
  useEffect(() => {
    if (props.error && props.error !== lastErrorRef.current) {
      lastErrorRef.current = props.error;
      message.error(
        typeof props.error === "string"
          ? props.error
          : t("message.downloadFailed"),
      );
      dispatch(materialLocationMappingActions.downloadTemplateClear());
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
          materialLocationMappingActions.upsertRowFetch({
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

  const beforeUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(arrayBuffer, {
          type: "array",
          cellDates: true,
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
        dispatch(materialLocationMappingActions.upsertSummaryClear());
        setData(rows);
        if (Object.keys(errors).length) message.warning(t("message.cellError"));
        else message.success(t("message.parsed", { count: rows.length }));
      } catch (_error) {
        setData(null);
        if (_error) {
          message.error(
            _error instanceof Error ? _error.message : String(_error),
          );
        }
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const onChangeData = ({ index, key, value }: any) => {
    setData((prev) =>
      prev
        ? prev.map((row, i) =>
            i === index
              ? { ...row, [key]: value, upsertStatus: "pending" }
              : row,
          )
        : prev,
    );
    setCellErrors((prev) => {
      const next = { ...prev };
      delete next[`${index}-${key}`];
      return next;
    });
  };

  const doSubmit = () => {
    dispatch(materialLocationMappingActions.upsertSummaryClear());
    setIsSubmitting(true);
    setData((prev) => {
      if (!prev) return prev;
      const next: UploadMaterialLocationMappingRow[] = prev.map((r) =>
        r.upsertStatus === "success" ? r : { ...r, upsertStatus: "pending" },
      );
      const first = next.findIndex((r) => r.upsertStatus === "pending");
      if (first < 0) {
        setIsSubmitting(false);
        return prev;
      }
      next[first].upsertStatus = "submitting";
      dispatch(
        materialLocationMappingActions.upsertRowFetch({
          index: first,
          row: withWarehouse(next[first]),
        }),
      );
      return next;
    });
  };

  const handleSubmit = () => {
    if (!data?.length) return;
    const toSubmit = data.filter((r) => r.upsertStatus !== "success").length;
    if (!toSubmit) {
      message.info(t("message.nothingToSubmit"));
      return;
    }
    if (Object.keys(cellErrors).length) {
      message.error(t("message.cellError"));
      return;
    }
    Modal.confirm({
      title: t("modal.submit.title"),
      content: t("modal.submit.content", {
        count: toSubmit,
        warehouse: `${warehouse?.code} — ${warehouse?.name}`,
      }),
      okText: t("modal.submit.ok"),
      cancelText: t("modal.submit.cancel"),
      onOk: doSubmit,
    });
  };

  const summary = props.summary as { success: number; failed: number } | null;
  const showSummary =
    !isSubmitting && summary && summary.success + summary.failed > 0;

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {t("upload.title")}
            </Typography.Title>
            <Typography.Text type="secondary">
              {t("upload.subtitle", { max: MAX_ROWS })}
            </Typography.Text>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "right" }}>
            <Space>
              <Select
                showSearch
                optionFilterProp="label"
                placeholder={t("selectWarehouse")}
                style={{ minWidth: 220, textAlign: "left" }}
                disabled={isSubmitting}
                options={warehouses.map((w: any) => ({
                  value: w.id,
                  label: w.name,
                  code: w.code,
                  name: w.name,
                }))}
                onChange={(_v: any, opt: any) =>
                  setWarehouse({ code: opt.code, name: opt.name })
                }
              />
              <Button
                icon={<CloudDownloadOutlined />}
                loading={isLoading}
                disabled={!warehouse}
                onClick={() =>
                  dispatch(
                    materialLocationMappingActions.downloadTemplateFetch({
                      warehouseCode: warehouse!.code,
                      fileName: "Template-UploadMaterialLocationMapping.xlsx",
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
            disabled={isSubmitting}
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
          <TableEditable
            columns={columns as any}
            dataSource={data.map((r, i) => ({ ...r, key: String(i) }))}
            onSaveAction={({ key, index, value }: any) =>
              onChangeData({ index, key, value })
            }
            pageSize={10}
            scroll={{ x: "max-content" }}
          />
          <div style={{ textAlign: "right", marginTop: 16 }}>
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
    </Space>
  );
}

const mapStateToProps = (state: RootState) => ({
  lastResult: state.materialLocationMapping?.lastResult,
  isLoading: state.materialLocationMapping?.isLoading,
  error: state.materialLocationMapping?.error,
  summary: state.materialLocationMapping?.summary,
});

export default connect(mapStateToProps)(MaterialMappingUpsertBulk);
