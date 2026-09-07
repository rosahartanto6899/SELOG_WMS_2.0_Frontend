/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Empty from "@sera-components/empty";
import CustomerApi from "@sera-libraries/api/customer";
import MaterialApi from "@sera-libraries/api/material";
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
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
  Modal,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import MaterialSearch from "./material-search";

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
  // add-info LEVEL DETAIL (name/value bebas, parity header)
  additionalInformation?: Array<{ name?: string; value?: string }>;
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
  // Customer diambil dari sesi auth (Redis) — kode+nama customer aktif,
  // BUKAN input user (parity: tenant = customer yang login)
  const { data: session } = useSession() as any;
  const [customer, setCustomer] = useState<{
    code?: string;
    name?: string;
  }>({});
  // Dropdown warehouse — sesuai customer aktif + akses role (roles[].warehouses)
  const [warehouses, setWarehouses] = useState<
    Array<{ id: string; code: string; name: string }>
  >([]);
  // Popup pilih material (multi) — list sesuai customer aktif
  const [matOpen, setMatOpen] = useState(false);
  const [matLoading, setMatLoading] = useState(false);
  const [matOptions, setMatOptions] = useState<
    Array<{ id: string; code: string; name: string; brand?: string }>
  >([]);
  const [matSel, setMatSel] = useState<string[]>([]); // material IDs terpilih
  const [matQ, setMatQ] = useState("");
  const [matSearchBy, setMatSearchBy] = useState("code");

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    setMaterials([]);
    setAddInfos([{}]);
    setEditData(null);
    setCustomer({});
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
              additionalInformation: (d.addInfos ?? []).map((a) => ({
                name: a.name ?? "",
                value: a.value ?? "",
              })),
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

  // Customer aktif dari sesi auth (Redis) — reaktif utk sesi yang datang belakangan
  useEffect(() => {
    const customerId = session?.user?.customerId;
    if (!open || editId || !customerId) return;
    CustomerApi()
      .retrieveCustomerDetail({ id: customerId })
      .then((resp: any) => {
        const c = resp?.data?.data;
        setCustomer({ code: c?.code, name: c?.name });
      })
      .catch(() => undefined);
  }, [open, editId, session?.user?.customerId]);

  // Warehouse dropdown: customer aktif (tenant) + akses role — parity shared-layout
  useEffect(() => {
    if (!open) return;
    const customerId = session?.user?.customerId;
    if (!customerId) return;
    const roleWarehouses = (session?.user?.roles ?? []).flatMap(
      (r: any) => r?.warehouses ?? [],
    );
    httpService
      .get(`${apiUrl.user}/warehouses/dropdown`)
      .then((resp: any) => {
        const all = resp?.data?.data ?? [];
        setWarehouses(
          all
            .filter(
              (w: any) =>
                w.customer?.id === customerId &&
                (!roleWarehouses.length || roleWarehouses.includes(w.id)),
            )
            .map((w: any) => ({ id: w.id, code: w.code, name: w.name })),
        );
      })
      .catch(() => undefined);
  }, [open, session?.user?.customerId, session?.user?.roles]);

  const updateMaterial = (key: number, patch: Partial<MaterialRow>) =>
    setMaterials((prev) =>
      prev.map((m) => (m.key === key ? { ...m, ...patch } : m)),
    );

  const submit = async (values: any) => {
    // customerCode/Name dari sesi auth (Redis), bukan input
    const customerCode = customer.code ?? editData?.customerCode;
    const customerName = customer.name ?? editData?.customerName;
    if (!customerCode || !customerName) {
      message.error(t("noCustomerSession"));
      return;
    }
    // warehouseName ikut kode warehouse yang dipilih di dropdown
    const warehouseName =
      warehouses.find((w) => w.code === values.warehouseCode)?.name ??
      editData?.warehouseName;
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
          customerCode,
          customerName,
          warehouseName,
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
              additionalInformation: (r.additionalInformation ?? [])
                .filter((a) => a.name)
                .map((a) => ({ name: a.name!, value: a.value ?? "" })),
            })),
          );
        }
        message.success(t("updated"));
      } else {
        const payload: InputIncomingPayload = {
          ...values,
          customerCode,
          customerName,
          warehouseName,
          additionalInformation,
          details: rows.map((r) => ({
            materialCode: r.materialCode,
            materialName: r.materialName,
            materialBrand: r.materialBrand,
            uom: r.uom,
            qty: r.qty,
            barcode: r.barcode,
            locationBarcode: r.locationBarcode,
            additionalInformation: (r.additionalInformation ?? [])
              .filter((a) => a.name)
              .map((a) => ({ name: a.name!, value: a.value ?? "" })),
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
          disabled
          onChange={(e) =>
            updateMaterial(row.key, { materialCode: e.target.value })
          }
        />
      ),
    },
    {
      title: t("materialName"),
      render: (_: any, row: MaterialRow) => (
        <Input value={row.materialName} disabled />
      ),
    },
    {
      title: t("materialBrand"),
      width: 140,
      render: (_: any, row: MaterialRow) => (
        <Input value={row.materialBrand} disabled />
      ),
    },
    {
      title: t("uom"),
      width: 100,
      render: (_: any, row: MaterialRow) => <Input value={row.uom} disabled />,
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
    <Card title={editId ? t("editTitle") : t("title")}>
      <Form form={form} layout="vertical" onFinish={submit}>
        {/* Urutan per kelompok dokumen: konteks → PO → Surat Jalan → umum.
            Required (Warehouse, No. PO, No. SJ) dijalur atas, tanggal menempel
            nomornya (Tanggal PO setelah No. PO, Tgl Incoming setelah No. SJ). */}
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              name="warehouseCode"
              label={t("warehouse")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                disabled={!!editId}
                placeholder={t("warehousePlaceholder")}
                options={warehouses.map((w) => ({
                  value: w.code,
                  label: `${w.name} (${w.code})`,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="poNo"
              label={t("poNo")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="poType" label={t("poType")}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="poDate" label={t("poDate")}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="deliveryNoteNo"
              label={t("deliveryNoteNo")}
              rules={[{ required: true, message: t("required") }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="supplierName" label={t("supplierName")}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="incomingDate" label={t("incomingDate")}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="referenceNo" label={t("referenceNo")}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="description" label={t("description")}>
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={t("addInfos")}>
              {addInfos.map((row, i) => (
                <Row key={i} gutter={8} className="mb-2" align="middle">
                  <Col span={11}>
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
                  <Col span={11}>
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
                  <Col span={2}>
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
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => setAddInfos((prev) => [...prev, {}])}
              >
                {t("addInfo")}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Card
        className="mt-4"
        type="inner"
        title={t("materials")}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setMatSel([]);
              setMatOpen(true);
              if (!matOptions.length) {
                setMatLoading(true);
                MaterialApi()
                  .retrieveDropdownMaterials({
                    customerCode:
                      customer.code ?? editData?.customerCode ?? undefined,
                  })
                  .then((resp: any) => {
                    setMatOptions(resp?.data?.data ?? []);
                  })
                  .catch(() => undefined)
                  .finally(() => setMatLoading(false));
              }
            }}
          >
            {t("addMaterial")}
          </Button>
        }
      >
        {materials.length === 0 ? (
          <Empty />
        ) : (
          <Table
            size="small"
            rowKey="key"
            dataSource={materials}
            columns={materialColumns}
            pagination={false}
            locale={{ emptyText: <Empty /> }}
            expandable={{
              // Add-info LEVEL DETAIL — expand baris material
              expandedRowRender: (row: MaterialRow) => (
                <div style={{ maxWidth: 560 }}>
                  {(row.additionalInformation ?? [{}]).map((a, i) => (
                    <Row key={i} gutter={8} className="mb-2">
                      <Col span={10}>
                        <Input
                          placeholder={t("name")}
                          value={a.name}
                          onChange={(e) =>
                            updateMaterial(row.key, {
                              additionalInformation: (
                                row.additionalInformation ?? [{}]
                              ).map((r, j) =>
                                i === j ? { ...r, name: e.target.value } : r,
                              ),
                            })
                          }
                        />
                      </Col>
                      <Col span={10}>
                        <Input
                          placeholder={t("value")}
                          value={a.value}
                          onChange={(e) =>
                            updateMaterial(row.key, {
                              additionalInformation: (
                                row.additionalInformation ?? [{}]
                              ).map((r, j) =>
                                i === j ? { ...r, value: e.target.value } : r,
                              ),
                            })
                          }
                        />
                      </Col>
                      <Col span={4}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() =>
                            updateMaterial(row.key, {
                              additionalInformation: (
                                row.additionalInformation ?? []
                              ).filter((_, j) => j !== i),
                            })
                          }
                        />
                      </Col>
                    </Row>
                  ))}
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      updateMaterial(row.key, {
                        additionalInformation: [
                          ...(row.additionalInformation ?? []),
                          {},
                        ],
                      })
                    }
                  >
                    {t("addInfo")}
                  </Button>
                </div>
              ),
            }}
          />
        )}
      </Card>

      {/* Popup pilih material — multi select, sesuai customer aktif */}
      <Modal
        open={matOpen}
        title={t("pickMaterial")}
        width={1180}
        style={{ top: 20 }}
        okText={`${t("addMaterial")} (${matSel.length})`}
        okButtonProps={{ disabled: !matSel.length }}
        cancelText={t("cancel")}
        onCancel={() => setMatOpen(false)}
        onOk={async () => {
          const picked = matOptions.filter((m) => matSel.includes(m.id));
          // uom/barcode dari detail master (fallback input manual bila kosong)
          const withDetail = await Promise.all(
            picked.map(async (m) => {
              try {
                const resp: any = await MaterialApi().retrieveMaterialDetail({
                  id: m.id,
                });
                const d = resp?.data?.data ?? {};
                return {
                  key: ++materialKeySeq,
                  materialCode: m.code,
                  materialName: m.name,
                  materialBrand: m.brand ?? "",
                  uom: d.uoM ?? d.uom ?? "",
                  barcode: d.barcode,
                  qty: 0,
                } as MaterialRow;
              } catch {
                return {
                  key: ++materialKeySeq,
                  materialCode: m.code,
                  materialName: m.name,
                  materialBrand: m.brand ?? "",
                  uom: "",
                  qty: 0,
                } as MaterialRow;
              }
            }),
          );
          setMaterials((prev) => {
            const existing = new Set(prev.map((m) => m.materialCode));
            return [
              ...prev,
              ...withDetail.filter((m) => !existing.has(m.materialCode)),
            ];
          });
          setMatOpen(false);
        }}
      >
        <MaterialSearch
          id="mat-pick"
          searchBy={matSearchBy}
          onSearchBy={(v) => {
            setMatSearchBy(v);
            setMatQ("");
          }}
          placeholder={t("pickMaterialPlaceholder")}
          onSearchValue={(v) => setMatQ((v ?? "").toLowerCase())}
          options={[
            { value: "code", label: t("materialCode") },
            { value: "name", label: t("materialName") },
            { value: "brand", label: t("materialBrand") },
          ]}
        />
        <div style={{ marginTop: 12 }} />
        <Table
          size="small"
          rowKey="id"
          loading={matLoading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ y: 420 }}
          locale={{
            emptyText: <Empty description={t("noMaterialFound")} />,
          }}
          rowSelection={{
            selectedRowKeys: matSel,
            onChange: (keys) => setMatSel(keys as string[]),
          }}
          dataSource={matOptions.filter((m) => {
            if (!matQ) return true;
            return String((m as any)[matSearchBy] ?? "")
              .toLowerCase()
              .includes(matQ);
          })}
          columns={[
            {
              title: "No",
              width: 50,
              render: (_: any, __: any, i: number) => i + 1,
            },
            { title: t("materialCode"), dataIndex: "code", width: 140 },
            { title: t("materialName"), dataIndex: "name" },
            {
              title: t("materialBrand"),
              dataIndex: "brand",
              width: 140,
            },
          ]}
        />
      </Modal>

      <div
        style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}
      >
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
      </div>
    </Card>
  );
};

export default InputIncomingForm;
