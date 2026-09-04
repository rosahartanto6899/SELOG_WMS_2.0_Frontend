/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CloudDownloadOutlined,
  EditOutlined,
  SaveOutlined,
  UndoOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import { OutstandingIncomingDetail } from "@sera-types/outstanding-incoming.type";
import FormatUtils from "@sera-utils/format";
import { Input as AntdInput } from "antd";
import {
  Col,
  Form,
  InputNumber,
  message,
  Modal,
  Popover,
  Row,
  Table,
  Typography,
  Upload,
} from "antd";
import { RcFile } from "antd/lib/upload";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

import styles from "./outstanding-incoming.module.scss";

interface Props {
  open: boolean;
  headerId: string | null;
  details: OutstandingIncomingDetail[];
  onClose: () => void;
  onDone: () => void;
}

interface AttachmentRow {
  fileName: string;
  attachmentUrl: string;
  createdDate?: string | null;
}

type QiRow = OutstandingIncomingDetail & { _highlight?: boolean };

const MAX_SAVE_ROWS = 100; // parity legacy limit SaveQualityInspectionChanges

/**
 * Quality Inspection working screen:
 * 13-column table + AddInfo, STAGED Excel upload (highlight → Save ≤100 / Cancel),
 * per-row edit (qty/barcode correction + attachments), Excel export.
 * Legacy Good/Not-Good radio (QIResult) was never persisted — not implemented.
 */
const QiForm = (props: Props) => {
  const { open, headerId, details, onClose, onDone } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.qi",
  });
  const [form] = Form.useForm();
  const [rows, setRows] = useState<QiRow[]>([]);
  const [editing, setEditing] = useState<OutstandingIncomingDetail | null>(
    null,
  );
  const [attachments, setAttachments] = useState<AttachmentRow[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);

  // sync the local staging copy whenever the modal opens / parent data changes
  useEffect(() => {
    if (open) setRows(details.map((d) => ({ ...d, _highlight: false })));
  }, [open, details]);

  const dirty = useMemo(() => rows.some((r) => r._highlight), [rows]);

  useEffect(() => {
    if (editing) {
      form.setFieldsValue({
        materialCode: editing.materialCode,
        materialName: editing.materialName,
        materialBrand: editing.materialBrand,
        materialBarcode: editing.materialBarcode ?? "",
        materialLocationBarcode: editing.materialLocationBarcode ?? "",
        uom: editing.uom,
        planQty: editing.poQty,
        actualQty: editing.binningQty ?? 0,
        // legacy prefill parity (JS L640-676): net effect = partialQty as-is
        partialQty: editing.partialQty ?? 0,
        description: editing.description ?? "",
      });
      OutstandingIncomingApi()
        .retrieveDetailAttachments(editing.id)
        .then((list: AttachmentRow[]) => setAttachments(list))
        .catch(() => setAttachments([]));
    }
  }, [editing]);

  // parity usp_UpdateQualityInspection — direct SET, does not touch binningDate/status
  const saveEdit = async (values: any) => {
    if (!editing) return;
    setSubmitting(true);
    try {
      await OutstandingIncomingApi().updateQiDetail(editing.id, {
        materialCode: values.materialCode,
        materialName: values.materialName,
        materialBrand: values.materialBrand,
        materialBarcode: values.materialBarcode || undefined,
        materialLocationBarcode: values.materialLocationBarcode || undefined,
        uom: values.uom,
        planQty: values.planQty,
        actualQty: values.actualQty,
        partialQty: values.partialQty ?? 0,
        description: values.description || undefined,
      });
      message.success(t("success"));
      setEditing(null);
      onDone();
    } catch (e: any) {
      message.error(e?.response?.data?.message ?? t("failed"));
    } finally {
      setSubmitting(false);
    }
  };

  // === Excel upload — local staging (parity UploadExcelQI: no DB write yet) ===
  const onUploadExcel = (file: RcFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: "array" });
        const sheetRows = XLSX.utils.sheet_to_json<Record<string, any>>(
          wb.Sheets[wb.SheetNames[0]],
          { defval: "" },
        );
        const pick = (r: Record<string, any>, ...keys: string[]) => {
          const hit = Object.keys(r).find(
            (k) =>
              keys.includes(k) || keys.includes(String(k).trim().toLowerCase()),
          );
          return hit ? r[hit] : "";
        };
        const items = sheetRows
          .map((r, i) => {
            const materialCode = String(
              pick(r, "materialCode", "material code"),
            ).trim();
            const partialQtyRaw = String(
              pick(r, "partialQty", "partial qty"),
            ).trim();
            const partialQty = Number(partialQtyRaw);
            if (
              materialCode &&
              (partialQtyRaw === "" || Number.isNaN(partialQty))
            ) {
              throw new Error(t("invalidRow", { n: i + 1 }));
            }
            return {
              materialCode,
              partialQty: Number.isNaN(partialQty) ? 0 : partialQty,
              description: String(pick(r, "description")) || undefined,
            };
          })
          .filter((r) => r.materialCode);
        if (!items.length) throw new Error(t("emptyUpload"));

        // apply to local state + highlight changed rows
        let changed = 0;
        setRows((prev) =>
          prev.map((row) => {
            const hit = items.find((i) => i.materialCode === row.materialCode);
            if (!hit) return row;
            const nextPartial = hit.partialQty ?? 0;
            const nextDesc = hit.description ?? row.description ?? undefined;
            if (
              row.partialQty === nextPartial &&
              row.description === nextDesc
            ) {
              return row;
            }
            changed += 1;
            return {
              ...row,
              partialQty: nextPartial,
              description: nextDesc,
              _highlight: true,
            };
          }),
        );
        if (changed === 0) {
          message.error(t("noChanges"));
          return;
        }
        message.success(t("staged", { n: changed }));
      } catch (err: any) {
        message.error(err?.message ?? t("failed"));
      }
    };
    reader.readAsArrayBuffer(file);
    return false; // stop auto-upload — client-side parsing only
  };

  const onSaveChanges = async () => {
    if (!headerId) return;
    const items = rows
      .filter((r) => r._highlight)
      .map((r) => ({
        materialCode: r.materialCode,
        partialQty: r.partialQty ?? 0,
        description: r.description ?? undefined,
      }));
    if (!items.length) {
      message.error(t("noChanges"));
      return;
    }
    if (items.length > MAX_SAVE_ROWS) {
      message.error(t("tooMany"));
      return;
    }
    setSaving(true);
    try {
      await OutstandingIncomingApi().saveQualityInspection(headerId, items);
      message.success(t("success"));
      onDone(); // parent reloads details → rows resync without highlights
    } catch (e: any) {
      message.error(e?.response?.data?.message ?? t("failed"));
    } finally {
      setSaving(false);
    }
  };

  const onCancelChanges = () => {
    setRows(details.map((d) => ({ ...d, _highlight: false })));
  };

  // === Excel export — 13 parity columns, file name QUALITYINSPECTION_yyyyMMddHHmmss ===
  const onExport = () => {
    const ws = XLSX.utils.json_to_sheet(
      rows.map((d) => ({
        "Material Code": d.materialCode,
        "Material Name": d.materialName,
        "Material Brand": d.materialBrand,
        "Plan Qty": d.poQty,
        "Actual Qty": d.binningQty ?? 0,
        "Binning Date": d.binningDate ?? "",
        "Binning By": d.binningBy ?? "",
        "Partial Qty": d.partialQty ?? 0,
        UoM: d.uom,
        Description: d.description ?? "",
        "Material Barcode": d.materialBarcode ?? "",
        "Material Location Barcode": d.materialLocationBarcode ?? "",
        "Description Detail": d.description ?? "", // parity 13th column (same source column)
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "QUALITY INSPECTION");
    XLSX.writeFile(
      wb,
      `QUALITYINSPECTION_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[-:T]/g, "")}.xlsx`,
    );
  };

  const num = (extra?: object) => ({
    align: "right" as const,
    className: styles["tabular-nums"],
    ...extra,
  });

  const columns = [
    {
      title: "#",
      dataIndex: "no",
      key: "no",
      width: 45,
      align: "center" as const,
    },
    {
      title: t("materialCode"),
      dataIndex: "materialCode",
      key: "materialCode",
      width: 140,
    },
    {
      title: t("materialName"),
      dataIndex: "materialName",
      key: "materialName",
      width: 200,
    },
    {
      title: t("materialBrand"),
      dataIndex: "materialBrand",
      key: "materialBrand",
      width: 120,
    },
    {
      title: t("poQty"),
      dataIndex: "poQty",
      key: "poQty",
      width: 90,
      ...num(),
      // parity CoreApp: PlanQty column rendered as AddInfo link
      render: (v: number, record: OutstandingIncomingDetail) => (
        <Popover
          title={t("addInfo")}
          content={
            (record.addInfos ?? []).length ? (
              <div style={{ maxWidth: 280 }}>
                {(record.addInfos ?? []).map((a, i) => (
                  <div key={i}>
                    <b>{a.name}</b>: {a.value}
                  </div>
                ))}
              </div>
            ) : (
              "-"
            )
          }
        >
          <Typography.Link>{v}</Typography.Link>
        </Popover>
      ),
    },
    {
      title: t("actualQty"),
      dataIndex: "binningQty",
      key: "binningQty",
      width: 90,
      ...num(),
    },
    {
      title: t("binningDate"),
      dataIndex: "binningDate",
      key: "binningDate",
      width: 150,
      render: (v: string | null) =>
        v ? FormatUtils().dateTimeTransform(v) : "-",
    },
    {
      title: t("binningBy"),
      dataIndex: "binningBy",
      key: "binningBy",
      width: 120,
    },
    {
      title: t("partialQty"),
      dataIndex: "partialQty",
      key: "partialQty",
      width: 100,
      ...num(),
    },
    { title: t("uom"), dataIndex: "uom", key: "uom", width: 70 },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: t("materialBarcode"),
      dataIndex: "materialBarcode",
      key: "materialBarcode",
      width: 130,
    },
    {
      title: t("materialLocationBarcode"),
      dataIndex: "materialLocationBarcode",
      key: "materialLocationBarcode",
      width: 150,
    },
    {
      title: t("descriptionDetail"),
      dataIndex: "description",
      key: "descriptionDetail",
      ellipsis: true,
    },
    {
      title: t("action"),
      key: "operation",
      fixed: "right" as const,
      width: 60,
      render: (_: unknown, record: QiRow) => (
        <Button
          size="small"
          type="text"
          icon={<EditOutlined />}
          tooltip={t("edit")}
          onClick={() => setEditing(record)}
        />
      ),
    },
  ];

  return (
    <Modal
      open={open}
      title={t("title")}
      onCancel={onClose}
      footer={null}
      width={1180}
      destroyOnClose
    >
      <Row justify="end" gutter={8} style={{ marginBottom: 12 }}>
        {!dirty && (
          <Col>
            <Upload
              accept=".xlsx,.xls"
              showUploadList={false}
              beforeUpload={onUploadExcel}
            >
              <Button icon={<UploadOutlined />}>{t("uploadExcel")}</Button>
            </Upload>
          </Col>
        )}
        {dirty && (
          <>
            <Col>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={saving}
                onClick={onSaveChanges}
              >
                {t("saveChanges")}
              </Button>
            </Col>
            <Col>
              <Button icon={<UndoOutlined />} onClick={onCancelChanges}>
                {t("cancelChanges")}
              </Button>
            </Col>
          </>
        )}
        <Col>
          <Button icon={<CloudDownloadOutlined />} onClick={onExport}>
            {t("exportExcel")}
          </Button>
        </Col>
      </Row>

      <Table
        size="small"
        rowKey="id"
        dataSource={rows.map((d, i) => ({ ...d, no: i + 1 }))}
        columns={columns as any}
        pagination={false}
        scroll={{ x: "max-content" }}
        rowClassName={(record: QiRow) =>
          record._highlight ? styles["qi-highlight-row"] : ""
        }
      />

      <Modal
        open={!!editing}
        title={`${t("editTitle")} — ${editing?.materialCode ?? ""}`}
        width={860}
        onCancel={() => setEditing(null)}
        onOk={() => form.submit()}
        okText={t("save")}
        cancelText={t("close")}
        confirmLoading={submitting}
        destroyOnClose
        className={styles["sera-controls"]}
      >
        <Form form={form} layout="vertical" onFinish={saveEdit}>
          {/* Material identity — disabled input + label, same style as PO Qty */}
          <Row gutter={12} className="mb-2">
            <Col xs={24} sm={12}>
              <Form.Item label={t("materialCode")}>
                <Input disabled value={editing?.materialCode ?? ""} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={t("materialName")}>
                <Input disabled value={editing?.materialName ?? ""} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={t("materialBrand")}>
                <Input disabled value={editing?.materialBrand ?? ""} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={t("uom")}>
                <Input disabled value={editing?.uom ?? ""} />
              </Form.Item>
            </Col>
          </Row>

          {/* Parity ModalInputAttachmentIncoming: qty form on the left, attachment table on the right */}
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="planQty"
                label={t("poQty")}
                extra={t("planQtyHint")}
              >
                <InputNumber min={0} disabled style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="actualQty" label={t("actualQty")}>
                <InputNumber min={0} disabled style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="partialQty"
                label={t("partialQty")}
                rules={[{ required: true, message: t("required") }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="materialBarcode" label={t("materialBarcode")}>
                <Input maxLength={12} disabled />
              </Form.Item>
              <Form.Item
                name="materialLocationBarcode"
                label={t("materialLocationBarcode")}
              >
                <Input maxLength={12} disabled />
              </Form.Item>
              <Form.Item name="description" label={t("description")}>
                <AntdInput.TextArea rows={3} maxLength={500} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Card
                title={t("attachments")}
                extra={
                  <Upload
                    accept=".jpeg,.jpg,.png"
                    showUploadList={false}
                    customRequest={({ file, onSuccess, onError }: any) => {
                      OutstandingIncomingApi()
                        .uploadHoldAttachment(editing!.id, file as File)
                        .then(() => {
                          message.success(t("uploaded"));
                          onSuccess?.({});
                          return OutstandingIncomingApi().retrieveDetailAttachments(
                            editing!.id,
                          );
                        })
                        .then((list: AttachmentRow[]) => setAttachments(list))
                        .catch((err: any) => {
                          message.error(
                            err?.response?.data?.message ?? t("failed"),
                          );
                          onError?.(err);
                        });
                    }}
                  >
                    <Button size="small" icon={<UploadOutlined />}>
                      {t("uploadAttachment")}
                    </Button>
                  </Upload>
                }
              >
                <Table
                  size="small"
                  rowKey="attachmentUrl"
                  dataSource={attachments}
                  pagination={false}
                  locale={{ emptyText: "-" }}
                  columns={[
                    {
                      title: t("fileName"),
                      dataIndex: "fileName",
                      ellipsis: true,
                    },
                    {
                      title: t("uploadedDate"),
                      dataIndex: "createdDate",
                      width: 150,
                      render: (v: string | null) =>
                        v ? FormatUtils().dateTimeTransform(v) : "-",
                    },
                    {
                      title: t("download"),
                      key: "download",
                      width: 90,
                      align: "center",
                      render: (_: unknown, a: AttachmentRow) => (
                        <Typography.Link href={a.attachmentUrl} target="_blank">
                          {t("download")}
                        </Typography.Link>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Modal>
  );
};

export default QiForm;
