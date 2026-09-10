/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { SelectOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import { BaseType } from "@sera-types/base.type";
import { Col, message, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  DnItemsColumns,
  ItemsSearchByOptions,
} from "./outstanding-outgoing-props-table";
import PackagingFormModal from "./packaging-form-modal";

export const EmptyHint = ({ text }: { text: string }) => (
  <div style={{ textAlign: "center", padding: "2rem", opacity: 0.6 }}>
    {text}
  </div>
);

interface Props {
  customerCode: string | null;
  warehouseCode: string | null;
  /** fetch ulang saat tab menjadi aktif (pane antd dipertahankan — tanpa ini
   *  data basi setelah mutasi status di tab DN List) */
  active?: boolean;
  onChanged?: () => void; // refresh list/totals setelah packaging
}

const INIT_SEARCH_BY = "materialCode";

/** Tab DN Items — tampilan parity DN List (server-side: pagination, search
 *  dropdown searchBy, sort) + multi-select → Packaging. */
const DnItemsTab = ({
  customerCode,
  warehouseCode,
  active = true,
  onChanged,
}: Props) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing",
  });
  // t utk opsi searchBy (key prefix table.options) — hook stabil di atas,
  // bukan dipanggil dalam JSX (rules-of-hooks)
  const { t: tOpt } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.table.options",
  });

  const [rows, setRows] = useState<any[] | null>(null);
  const [total, setTotal] = useState(0);
  const [listOptions, setListOptions] = useState<
    BaseType & { [key: string]: any }
  >({ page: 1, limit: 10, order: "createdAt", sort: "desc" });
  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);
  // rows terpilih lintas halaman (agregasi packaging butuh datanya)
  const [selectedRowMap, setSelectedRowMap] = useState<Map<string, any>>(
    new Map(),
  );

  const columns = [
    {
      title: "No",
      key: "no",
      render: (_: never, record: any) => (
        <span>
          {((listOptions.page ?? 1) - 1) * (listOptions.limit ?? 10) +
            (rows ?? []).indexOf(record) +
            1}
        </span>
      ),
      width: 60,
      align: "center" as const,
    },
    ...DnItemsColumns().map((c: any) => ({
      ...c,
      sorter: true, // sort server-side (onTableChange)
    })),
  ];

  const [modalOpen, setModalOpen] = useState(false);
  // snapshot ids + ROWS saat modal dibuka — seleksi tabel ter-reset saat modal
  // overlay muncul (onSelectedRowsChange([]) dari Table) → rows modal & payload
  // harus dari snapshot, bukan seleksi live
  const [pendingRows, setPendingRows] = useState<any[]>([]);
  const pendingIds = pendingRows.map((r: any) => r.id);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!customerCode || !warehouseCode) return;
    OutstandingOutgoingApi()
      .retrieveItems({ customerCode, warehouseCode, ...listOptions } as any)
      .then((resp: any) => {
        // picked-only difilter backend (Q2: pickingDate IS NOT NULL + packagingNo
        // IS NULL) — FE tidak perlu filter lagi; materialCode kosong dibuang FE
        setRows((resp?.data?.data ?? []).filter((r: any) => r.materialCode));
        setTotal(resp?.data?.pagination?.totalData ?? 0);
      })
      .catch(() => setRows([]));
  };

  useEffect(() => {
    setRows(null);
    setSelectedRowMap(new Map());
  }, [customerCode, warehouseCode]);

  useEffect(() => {
    if (active) load();
  }, [active, listOptions, customerCode, warehouseCode]);

  const selectedRows = [...selectedRowMap.values()];

  const onPageChange = (current: number, limit: number) =>
    setListOptions((prev) => ({ ...prev, page: current, limit }));

  const onTableChange = (_p: any, _f: any, sorter: any) => {
    if (sorter) {
      setListOptions((prev) => ({
        ...prev,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : "desc",
      }));
    }
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value ?? INIT_SEARCH_BY);
    setListOptions((prev: any) => ({ ...prev, search: null, page: 1 }));
  };

  const openPackaging = () => {
    if (!selectedRows.length) {
      message.error(t("table.selectInfo"));
      return;
    }
    // destination beda boleh — grup packaging per material+destination
    setPendingRows(selectedRows);
    setModalOpen(true);
  };

  const submitPackaging = async (groups: any[]) => {
    if (!pendingIds.length || !groups.length) {
      message.error(t("table.selectInfo"));
      return;
    }
    setSubmitting(true);
    try {
      // hanya field DTO — buang key internal agregasi (whitelist backend)
      const packagings = groups.map((g) => ({
        materialCode: g.materialCode,
        materialName: g.materialName,
        materialBrand: g.materialBrand,
        uom: g.uom,
        qty: g.qty,
        weight: g.weight ?? 0,
        length: g.length ?? 0,
        width: g.width ?? 0,
        height: g.height ?? 0,
        customerDestination: g.customerDestination,
      }));
      const resp = await OutstandingOutgoingApi().createPackagings({
        detailIds: pendingIds,
        packagings,
      });
      const body = (resp as any)?.data?.data ?? {};
      // A8 per-grup materialCode → array nomor (fallback single utk compat)
      const nos: string[] =
        body.packagingNos ?? (body.packagingNo ? [body.packagingNo] : []);
      Modal.success({
        title: t("packaging.createdTitle"),
        content: (
          <span
            dangerouslySetInnerHTML={{
              __html: t("packaging.created", {
                no: nos.map((n) => `<strong>${n}</strong>`).join("<br/>"),
              }),
            }}
          />
        ),
      });
      setModalOpen(false);
      setSelectedRowMap(new Map());
      setPendingRows([]);
      load();
      onChanged?.();
    } catch (error: any) {
      const body: any = error?.response?.data ?? error?.data ?? {};
      message.error(body?.message ?? body?.data?.message ?? "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!customerCode || !warehouseCode) {
    return <EmptyHint text={t("table.selectWarehouse")} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Table
        title={t("itemsTable.title")}
        actions={
          <Button
            type="primary"
            icon={<SelectOutlined />}
            disabled={!selectedRows.length}
            onClick={openPackaging}
            loading={submitting}
          >
            {t("packaging.button")}
          </Button>
        }
        columns={columns}
        dataSource={rows ?? []}
        loading={rows === null}
        rowKey="id"
        scroll={{ x: "max-content" }}
        total={total}
        current={listOptions.page}
        pageSize={listOptions.limit}
        onPageChange={onPageChange}
        onTableChange={onTableChange}
        multipleSelect
        onSelectedRowsChange={(keys) => {
          // pertahankan pilihan lintas halaman: sinkron halaman aktif
          const pageIds = new Set((rows ?? []).map((r: any) => r.id));
          const next = new Map(selectedRowMap);
          for (const id of pageIds) {
            if (!keys.includes(id)) next.delete(id);
          }
          for (const r of rows ?? []) {
            if (keys.includes(r.id)) next.set(r.id, r);
          }
          setSelectedRowMap(next);
        }}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 4]}>
            <Col flex="0 0 14rem">
              <Select
                style={{ width: "100%", minWidth: "14rem" }}
                id="dn-items-search-by"
                defaultValue={INIT_SEARCH_BY}
                placeholder={t("table.search.placeholder")}
                onChange={(value) => handlerSelectSearchBy(value)}
                onClear={() => handlerSelectSearchBy("")}
                allowClear={false}
              >
                {ItemsSearchByOptions(tOpt).map((opt) => (
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
        }
      />
      <PackagingFormModal
        open={modalOpen}
        rows={pendingRows}
        submitting={submitting}
        onCancel={() => setModalOpen(false)}
        onSubmit={submitPackaging}
      />
    </div>
  );
};
export default DnItemsTab;
