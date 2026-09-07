/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Empty from "@sera-components/empty";
import MaterialSearch from "@sera-components/pages/plan-incoming/outstanding-incoming/material-search";
import CustomerApi from "@sera-libraries/api/customer";
import MaterialApi from "@sera-libraries/api/material";
import apiUrl from "@sera-libraries/common/api-url";
import { httpService } from "@sera-libraries/http-service";
import { outstandingOutgoingActions, RootState } from "@sera-redux";
import {
  InputOutgoingPayload,
  OutstandingOutgoingAddInfo,
  UpdateOutgoingPayload,
} from "@sera-types/outstanding-outgoing.type";
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
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

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
  additionalInformation?: OutstandingOutgoingAddInfo[];
}

let materialKeySeq = 0;

/** C1 input & C6 edit — header + tabel material multi-baris + add-info, submit
 *  lewat REDUX (slice/saga outstanding-outgoing), parity input-incoming-form. */
const InputOutgoingForm = (props: Props) => {
  const { open, editId, onClose, onDone } = props;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outgoingForm",
  });
  const dispatch = useDispatch();
  const submitState = useSelector(
    (state: RootState) => state.outstandingOutgoing.submit,
  );
  const editState = useSelector(
    (state: RootState) => state.outstandingOutgoing.edit,
  );
  const [form] = Form.useForm();
  const [materials, setMaterials] = useState<MaterialRow[]>([]);
  const [addInfos, setAddInfos] = useState<OutstandingOutgoingAddInfo[]>([{}]);
  const [editData, setEditData] = useState<any>(null);
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

  // reset form + fetch data edit (C6) via redux
  useEffect(() => {
    if (!open) return;
    form.resetFields();
    setMaterials([]);
    setAddInfos([{}]);
    setEditData(null);
    dispatch(outstandingOutgoingActions.submitOutgoingClear());
    if (editId) {
      dispatch(outstandingOutgoingActions.getOutgoingEditFetch({ id: editId }));
    } else {
      dispatch(outstandingOutgoingActions.getOutgoingEditClear());
    }
  }, [open, editId]);

  // prefill dari state redux edit
  useEffect(() => {
    const data = editState.data;
    if (!open || !editId || !data) return;
    setEditData(data);
    form.setFieldsValue({
      ...data,
      poDate: data.poDate ? dayjs(data.poDate) : null,
      outgoingDate: data.outgoingDate ? dayjs(data.outgoingDate) : null,
    });
    setMaterials(
      (data.details ?? []).map((d: any) => ({
        key: ++materialKeySeq,
        detailId: d.id,
        materialCode: d.materialCode,
        materialName: d.materialName,
        materialBrand: d.materialBrand,
        uom: d.uom,
        qty: d.poQty,
        canEdit: d.canEdit ?? false,
        additionalInformation: (d.addInfos ?? []).map((a: any) => ({
          name: a.name ?? "",
          value: a.value ?? "",
        })),
      })),
    );
    setAddInfos(
      (data.addInfos ?? []).map((a: any) => ({
        name: a.name ?? "",
        value: a.value ?? "",
      })),
    );
  }, [open, editId, editState.data]);

  // error fetch edit → toast
  useEffect(() => {
    if (editState.error) {
      message.error(
        (editState.error as any)?.message ?? t("noCustomerSession"),
      );
    }
  }, [editState.error]);

  // efek hasil submit dari redux: sukses → toast + onDone; gagal → toast
  useEffect(() => {
    if (submitState.success) {
      message.success(editId ? t("updated") : t("created"));
      dispatch(outstandingOutgoingActions.submitOutgoingClear());
      onDone();
    }
  }, [submitState.success]);

  useEffect(() => {
    if (submitState.error) {
      message.error((submitState.error as any)?.message ?? t("failed"));
    }
  }, [submitState.error]);

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
        const list = all
          .filter(
            (w: any) =>
              w.customer?.id === customerId &&
              (!roleWarehouses.length || roleWarehouses.includes(w.id)),
          )
          .map((w: any) => ({ id: w.id, code: w.code, name: w.name }));
        setWarehouses(list);
        // default: warehouse teratas (mode create, belum ada pilihan)
        if (list.length && !editData && !form.getFieldValue("warehouseCode")) {
          form.setFieldValue("warehouseCode", list[0].code);
        }
      })
      .catch(() => undefined);
  }, [open, session?.user?.customerId, session?.user?.roles]);

  // bersihkan state redux saat form ditutup
  useEffect(
    () => () => {
      dispatch(outstandingOutgoingActions.submitOutgoingClear());
      dispatch(outstandingOutgoingActions.getOutgoingEditClear());
    },
    [],
  );

  const updateMaterial = (key: number, patch: Partial<MaterialRow>) =>
    setMaterials((prev) =>
      prev.map((m) => (m.key === key ? { ...m, ...patch } : m)),
    );

  const submit = (values: any) => {
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
    if (rows.some((m) => (m.qty ?? 0) < 1)) {
      message.warning(t("invalidQty"));
      return;
    }
    const additionalInformation = addInfos
      .filter((a) => a.name)
      .map((a) => ({ name: a.name!, value: a.value ?? "" }));
    const detailPayload = (r: MaterialRow) => ({
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
    });

    if (editId && editData) {
      // C3 header + add-info replace; qty changes via C4; new materials via C2
      const payload: UpdateOutgoingPayload = {
        id: editId,
        ...values,
        customerCode,
        customerName,
        warehouseName,
        additionalInformation,
        updateDetails: rows
          .filter((r) => r.detailId && r.canEdit)
          .map((r) => ({
            detailId: r.detailId!,
            qty: r.qty,
            additionalInformation: (r.additionalInformation ?? [])
              .filter((a) => a.name)
              .map((a) => ({ name: a.name!, value: a.value ?? "" })),
          })),
        details: rows.filter((r) => !r.detailId).map(detailPayload),
      };
      dispatch(outstandingOutgoingActions.submitOutgoingFetch(payload));
    } else {
      const payload: InputOutgoingPayload = {
        ...values,
        customerCode,
        customerName,
        warehouseName,
        additionalInformation,
        details: rows.map(detailPayload),
      };
      dispatch(outstandingOutgoingActions.submitOutgoingFetch(payload));
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
            nomornya (Tanggal PO setelah No. PO, Tgl Outgoing setelah No. SJ). */}
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
            <Form.Item
              name="customerDestination"
              label={t("customerDestination")}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="outgoingDate" label={t("outgoingDate")}>
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
                      maxLength={20} // batas kolom DB PlanOutgoingHeaderAddInfo.Name
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
              expandIcon: ({ expanded, onExpand, record }) => (
                <Tooltip title={t("addInfos")}>
                  <button
                    type="button"
                    className={`ant-table-row-expand-icon${
                      expanded
                        ? " ant-table-row-expand-icon-expanded"
                        : " ant-table-row-expand-icon-collapsed"
                    }`}
                    onClick={(e) => onExpand(record, e)}
                  />
                </Tooltip>
              ),
              expandedRowRender: (row: MaterialRow) => (
                <Card
                  type="inner"
                  title={t("addInfos")}
                  style={{ maxWidth: 560 }}
                >
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
                </Card>
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
          id="mat-pick-outgoing"
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
            loading={submitState.isLoading}
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

export default InputOutgoingForm;
