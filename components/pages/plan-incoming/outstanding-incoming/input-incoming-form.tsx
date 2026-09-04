/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import {
  InputIncomingPayload,
  OutstandingIncomingHeader,
} from "@sera-types/outstanding-incoming.type";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  editId?: string | null; // edit mode (C6) when filled
  onClose: () => void;
  onDone: () => void;
}

interface MaterialRow {
  key: number;
  materialCode: string;
  materialName: string;
  materialBrand: string;
  uom: string;
  qty: number;
  barcode?: string;
  locationBarcode?: string;
  canEdit?: boolean;
  detailId?: string; // edit mode — detail id for C4
}

let materialKeySeq = 0;

/** C1 input & C6 edit — header + tabel material multi-baris + add-info, SATU submit. */
const InputIncomingForm = (props: Props) => {
  const { open, editId, onClose, onDone } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.form",
  });
  const [form] = Form.useForm();
  const [materials, setMaterials] = useState<MaterialRow[]>([]);
  const [addInfos, setAddInfos] = useState<
    Array<{ name?: string; value?: string }>
  >([{}]);
  const [submitting, setSubmitting] = useState(false);
  const [editData, setEditData] = useState<OutstandingIncomingHeader | null>(
    null,
  );

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    setMaterials([{ key: ++materialKeySeq } as MaterialRow]);
    setAddInfos([{}]);
    setEditData(null);
    if (editId) {
      OutstandingIncomingApi()
        .retrieveEdit(editId)
        .then((data) => {
          setEditData(data);
          form.setFieldsValue({
            ...data,
            poDate: data.poDate ? dayjs(data.poDate) : null,
            incomingDate: data.incomingDate ? dayjs(data.incomingDate) : null,
          });
          setMaterials(
            (data.details ?? []).map((d) => ({
              key: ++materialKeySeq,
              detailId: d.id,
              materialCode: d.materialCode,
              materialName: d.materialName,
              materialBrand: d.materialBrand,
              uom: d.uom,
              qty: d.poQty,
              canEdit: d.canEdit ?? false,
            })),
          );
          setAddInfos(
            (data.addInfos ?? []).map((a) => ({
              name: a.name ?? "",
              value: a.value ?? "",
            })),
          );
        });
    }
  }, [open, editId]);

  const updateMaterial = (key: number, patch: Partial<MaterialRow>) =>
    setMaterials((prev) =>
      prev.map((m) => (m.key === key ? { ...m, ...patch } : m)),
    );

  const submit = async (values: any) => {
    const rows = materials.filter((m) => m.materialCode && m.qty != null);
    if (!rows.length) {
      message.warning(t("noMaterial"));
      return;
    }
    const additionalInformation = addInfos
      .filter((a) => a.name)
      .map((a) => ({ name: a.name!, value: a.value ?? "" }));

    setSubmitting(true);
    try {
      if (editId && editData) {
        // C3 header + add-info replace; detail qty changes via C4; new materials via C2
        await OutstandingIncomingApi().updateIncomingHeader(editId, {
          ...values,
          additionalInformation,
        });
        for (const row of rows) {
          if (row.detailId && row.canEdit) {
            await OutstandingIncomingApi().updateIncomingDetail(row.detailId, {
              qty: row.qty,
            });
          }
        }
        const newRows = rows.filter((r) => !r.detailId);
        if (newRows.length) {
          await OutstandingIncomingApi().addDetails(
            editId,
            newRows.map((r) => ({
              materialCode: r.materialCode,
              materialName: r.materialName,
              materialBrand: r.materialBrand,
              uom: r.uom,
              qty: r.qty,
              barcode: r.barcode,
              locationBarcode: r.locationBarcode,
            })),
          );
        }
        message.success(t("updated"));
      } else {
        const payload: InputIncomingPayload = {
          ...values,
          additionalInformation,
          details: rows.map((r) => ({
            materialCode: r.materialCode,
            materialName: r.materialName,
            materialBrand: r.materialBrand,
            uom: r.uom,
            qty: r.qty,
            barcode: r.barcode,
            locationBarcode: r.locationBarcode,
          })),
        };
        await OutstandingIncomingApi().createIncoming(payload);
        message.success(t("created"));
      }
      onDone();
      onClose();
    } catch (e: any) {
      message.error(e?.response?.data?.message ?? t("failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const materialColumns = [
    {
      title: t("materialCode"),
      render: (_: any, row: MaterialRow) => (
        <Input
          value={row.materialCode}
          disabled={!!row.detailId}
          onChange={(e) =>
            updateMaterial(row.key, { materialCode: e.target.value })
          }
        />
      ),
    },
    {
      title: t("materialName"),
      render: (_: any, row: MaterialRow) => (
        <Input
          value={row.materialName}
          onChange={(e) =>
            updateMaterial(row.key, { materialName: e.target.value })
          }
        />
      ),
    },
    {
      title: t("materialBrand"),
      width: 140,
      render: (_: any, row: MaterialRow) => (
        <Input
          value={row.materialBrand}
          onChange={(e) =>
            updateMaterial(row.key, { materialBrand: e.target.value })
          }
        />
      ),
    },
    {
      title: t("uom"),
      width: 100,
      render: (_: any, row: MaterialRow) => (
        <Input
          value={row.uom}
          onChange={(e) => updateMaterial(row.key, { uom: e.target.value })}
        />
      ),
    },
    {
      title: t("qty"),
      width: 110,
      render: (_: any, row: MaterialRow) => (
        <InputNumber
          min={1}
          value={row.qty}
          disabled={!!row.detailId && !row.canEdit}
          onChange={(v) => updateMaterial(row.key, { qty: v ?? 0 })}
        />
      ),
    },
    {
      title: "",
      width: 50,
      render: (_: any, row: MaterialRow) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          disabled={!!row.detailId && !row.canEdit}
          onClick={() =>
            setMaterials((prev) => prev.filter((m) => m.key !== row.key))
          }
        />
      ),
    },
  ];

  return (
    <Card
      title={editId ? t("editTitle") : t("title")}
      extra={
        <Space>
          <Button onClick={onClose}>{t("cancel")}</Button>
          <Button
            type="primary"
            loading={submitting}
            onClick={() => form.submit()}
            icon={<PlusOutlined />}
          >
            {t("submit")}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={submit}>
        <Row gutter={12}>
          <Col xs={24} md={8}>
            <Form.Item
              name="customerCode"
              label={t("customerCode")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input disabled={!!editId} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="customerName"
              label={t("customerName")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="warehouseCode"
              label={t("warehouseCode")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input disabled={!!editId} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="warehouseName"
              label={t("warehouseName")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="deliveryNoteNo"
              label={t("deliveryNoteNo")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="poNo"
              label={t("poNo")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="poType" label={t("poType")}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="poDate" label={t("poDate")}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="supplierName" label={t("supplierName")}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="incomingDate" label={t("incomingDate")}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="referenceNo" label={t("referenceNo")}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="materialCategory" label={t("materialCategory")}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="description" label={t("description")}>
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Card
        type="inner"
        title={t("materials")}
        extra={
          <Button
            icon={<PlusOutlined />}
            onClick={() =>
              setMaterials((prev) => [
                ...prev,
                { key: ++materialKeySeq } as MaterialRow,
              ])
            }
          >
            {t("addMaterial")}
          </Button>
        }
      >
        <Table
          size="small"
          rowKey="key"
          dataSource={materials}
          columns={materialColumns}
          pagination={false}
        />
      </Card>

      <Card type="inner" className="mt-4" title={t("addInfos")}>
        {addInfos.map((row, i) => (
          <Row key={i} gutter={8} className="mb-2">
            <Col span={10}>
              <Input
                placeholder={t("name")}
                value={row.name}
                onChange={(e) =>
                  setAddInfos((prev) =>
                    prev.map((r, j) =>
                      i === j ? { ...r, name: e.target.value } : r,
                    ),
                  )
                }
              />
            </Col>
            <Col span={10}>
              <Input
                placeholder={t("value")}
                value={row.value}
                onChange={(e) =>
                  setAddInfos((prev) =>
                    prev.map((r, j) =>
                      i === j ? { ...r, value: e.target.value } : r,
                    ),
                  )
                }
              />
            </Col>
            <Col span={4}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() =>
                  setAddInfos((prev) => prev.filter((_, j) => j !== i))
                }
              />
            </Col>
          </Row>
        ))}
        <Button onClick={() => setAddInfos((prev) => [...prev, {}])}>
          {t("addInfo")}
        </Button>
      </Card>
    </Card>
  );
};

export default InputIncomingForm;
