/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { CheckOutlined, EyeOutlined, PrinterOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import { BaseType } from "@sera-types/base.type";
import { Col, Empty, message, Modal, Row } from "antd";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  PackagingColumns,
  PackagingSearchByOptions,
  ShipmentColumns,
  ShipmentSearchByOptions,
} from "./outstanding-outgoing-props-table";
import PackagingByShipmentModal from "./packaging-by-shipment-modal";
import PoByPackagingModal from "./po-by-packaging-modal";

interface TabProps {
  customerCode: string | null;
  warehouseCode: string | null;
  /** fetch ulang saat tab aktif (pane antd dipertahankan) */
  active?: boolean;
  onChanged?: () => void;
}

/** Tab Packaging — server-side parity DnItemsTab (paging, search dropdown,
 *  sort) + multi-select → Ready To Ship; klik baris → popup PO per packaging. */
export const PackagingTab = ({
  customerCode,
  warehouseCode,
  active = true,
  onChanged,
}: TabProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing",
  });
  const { t: tOpt } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.table.options",
  });
  const INIT_SEARCH_BY = "packagingNo";
  const columns = PackagingColumns();
  const [rows, setRows] = useState<any[] | null>(null);
  const [total, setTotal] = useState(0);
  const [listOptions, setListOptions] = useState<
    BaseType & { [key: string]: any }
  >({ page: 1, limit: 10, order: "createdAt", sort: "desc" });
  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [poNo, setPoNo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    if (!customerCode || !warehouseCode) return;
    OutstandingOutgoingApi()
      .retrievePackagings({
        customerCode,
        warehouseCode,
        ...listOptions,
      } as any)
      .then((resp: any) => {
        setRows(resp?.data?.data ?? []);
        setTotal(resp?.data?.pagination?.totalData ?? 0);
      })
      .catch(() => setRows([]));
  };

  useEffect(() => {
    setRows(null);
    setSelectedIds([]);
  }, [customerCode, warehouseCode]);

  useEffect(() => {
    if (active) load();
  }, [active, listOptions, customerCode, warehouseCode]);

  if (!customerCode || !warehouseCode)
    return <Empty description={t("table.selectWarehouse")} />;

  const selectedRows = (rows ?? []).filter((r: any) =>
    selectedIds.includes(r.id),
  );
  const selectedPackagingNos = [
    ...new Set(selectedRows.map((r: any) => r.packagingNo)),
  ];

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

  const doReadyToShip = () => {
    if (!selectedPackagingNos.length) {
      message.error(t("table.selectInfo"));
      return;
    }
    Modal.confirm({
      title: (
        <span
          dangerouslySetInnerHTML={{
            __html: t("confirm.status", {
              status: `<strong>Ready To Ship</strong>`,
            }),
          }}
        />
      ),
      content: t("confirm.warning"),
      okText: t("confirm.yes"),
      cancelText: t("confirm.no"),
      okButtonProps: { danger: true },
      onOk: async () => {
        setLoading(true);
        try {
          const resp =
            await OutstandingOutgoingApi().readyToShip(selectedPackagingNos);
          const no = (resp as any)?.data?.data?.shipmentNo ?? "-";
          Modal.success({
            title: t("shipment.createdTitle"),
            content: (
              <span
                dangerouslySetInnerHTML={{
                  __html: t("shipment.created", {
                    no: `<strong>${no}</strong>`,
                  }),
                }}
              />
            ),
          });
          setSelectedIds([]);
          load();
          onChanged?.();
        } catch (error: any) {
          const body: any = error?.response?.data ?? error?.data ?? {};
          message.error(body?.message ?? body?.data?.message ?? "Failed");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Table
        title={t("packagingTable.title")}
        actions={
          <Button
            type="primary"
            icon={<CheckOutlined />}
            disabled={!selectedIds.length}
            loading={loading}
            onClick={doReadyToShip}
          >
            {t("shipment.button")}
          </Button>
        }
        columns={[
          {
            title: "No",
            key: "no",
            width: 60,
            align: "center" as const,
            render: (_: any, record: any) => (
              <span>
                {((listOptions.page ?? 1) - 1) * (listOptions.limit ?? 10) +
                  (rows ?? []).indexOf(record) +
                  1}
              </span>
            ),
          },
          ...columns.map((c: any) => ({ ...c, sorter: true })),
          {
            title: t("table.column.action"),
            key: "view",
            width: 70,
            render: (_: any, row: any) => (
              <Button
                size="small"
                type="text"
                icon={<EyeOutlined />}
                tooltip={t("table.button.view")}
                onClick={() => setPoNo(row.packagingNo)}
              />
            ),
          },
        ]}
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
        onSelectedRowsChange={(keys) => setSelectedIds(keys as string[])}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 4]}>
            <Col flex="0 0 14rem">
              <Select
                style={{ width: "100%", minWidth: "14rem" }}
                id="packaging-search-by"
                defaultValue={INIT_SEARCH_BY}
                placeholder={t("table.search.placeholder")}
                onChange={(value) => handlerSelectSearchBy(value)}
                onClear={() => handlerSelectSearchBy("")}
                allowClear={false}
              >
                {PackagingSearchByOptions(tOpt).map((opt) => (
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
      <PoByPackagingModal packagingNo={poNo} onClose={() => setPoNo(null)} />
    </div>
  );
};

/** Tab Shipment — server-side parity DnItemsTab; klik baris → popup packaging
 *  per shipment. */
export const ShipmentTab = ({
  customerCode,
  warehouseCode,
  active = true,
}: TabProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing",
  });
  const { t: tOpt } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing.table.options",
  });
  const { data: session } = useSession() as any;
  const INIT_SEARCH_BY = "shipmentNo";
  const columns = ShipmentColumns();
  const [rows, setRows] = useState<any[] | null>(null);
  const [total, setTotal] = useState(0);
  const [listOptions, setListOptions] = useState<
    BaseType & { [key: string]: any }
  >({ page: 1, limit: 10, order: "modifiedDate", sort: "desc" });
  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);
  const [shipNo, setShipNo] = useState<string | null>(null);

  const load = () => {
    if (!customerCode || !warehouseCode) return;
    OutstandingOutgoingApi()
      .retrieveShipments({ customerCode, warehouseCode, ...listOptions } as any)
      .then((resp: any) => {
        setRows(resp?.data?.data ?? []);
        setTotal(resp?.data?.pagination?.totalData ?? 0);
      })
      .catch(() => setRows([]));
  };

  useEffect(() => {
    setRows(null);
  }, [customerCode, warehouseCode]);

  useEffect(() => {
    if (active) load();
  }, [active, listOptions, customerCode, warehouseCode]);

  if (!customerCode || !warehouseCode)
    return <Empty description={t("table.selectWarehouse")} />;

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

  /** Cetak surat pengiriman per shipment — parity legacy PrintActual
   *  (PlanOutgoingController.cs): 2 halaman A4, halaman 1 SPB + tabel PO +
   *  total + catatan + tanda tangan, halaman 2 tabel material per packaging. */
  const printDeliveryLetter = async (row: any) => {
    let items: any[] = [];
    let pos: any[] = [];
    try {
      const [pkgResp, poResp] = await Promise.all([
        OutstandingOutgoingApi().retrievePackagingsByShipment(row.shipmentNo, {
          page: 1,
          limit: 100,
          order: "packagingNo",
          sort: "asc",
        }),
        OutstandingOutgoingApi().retrievePosByShipment(row.shipmentNo),
      ]);
      items = (pkgResp as any)?.data?.data ?? [];
      pos = (poResp as any)?.data?.data ?? [];
    } catch {
      message.error(t("shipment.printFailed"));
      return;
    }
    if (!items.length) {
      message.error(t("shipment.printFailed"));
      return;
    }
    const userLogin = (session?.user?.name as string) ?? "";
    const destination =
      row.customerDestination ?? items[0].customerDestination ?? "";
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const tanggal = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const totalWeight = items.reduce(
      (sum, d) => sum + (Number(d.weight) || 0),
      0,
    );

    // Halaman 1 — tabel PO (No | No DO | Keterangan | Berat | Ukuran | Biaya | Catatan)
    const poRows = pos
      .map(
        (p, i) =>
          `<tr><td>${i + 1}</td><td>${p.poNo ?? ""}</td><td>${p.description ?? ""}</td><td></td><td></td><td></td><td></td></tr>`,
      )
      .join("");

    // Halaman 2 — tabel material per packaging
    const matRows = items
      .map(
        (d) =>
          `<tr><td>${d.materialCode ?? ""}</td><td>${d.materialName ?? ""}</td>` +
          `<td>${d.materialBrand ?? ""}</td><td>${d.qty ?? ""}</td><td>${d.uom ?? ""}</td></tr>`,
      )
      .join("");

    const win = window.open();
    if (!win) return;
    win.document
      .write(`<!DOCTYPE html><html><head><title>SURAT PENGIRIMAN BARANG</title>
<style>
  @page { size: A4 portrait; margin: 12mm; }
  body { font: 10px/1.4 Helvetica, Arial, sans-serif; color: #000; margin: 0; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; }
  .head img { height: 65px; }
  .head h1 { font-size: 18px; text-align: right; margin: 0; font-weight: bold; }
  .kirim { display: flex; justify-content: space-between; margin: 8px 0; }
  .kirim .right { text-align: right; }
  hr { border: 0; border-top: 1px solid #000; margin: 4px 0; }
  table { border-collapse: collapse; width: 100%; }
  .detail td { border: 0; padding: 1px 4px; text-align: left; }
  .detail td:nth-child(1), .detail td:nth-child(3) { width: 10%; font-weight: bold; }
  .detail td:nth-child(2), .detail td:nth-child(4) { width: 40%; }
  .po td { border: 0; padding: 2px 4px; text-align: center; }
  .po th { border: 0; padding: 2px 4px; text-align: center; font-weight: normal; }
  .po th:nth-child(1), .po td:nth-child(1) { width: 10%; }
  .po th:nth-child(n+2) { width: 15%; }
  .total div { margin: 1px 0; }
  .foot { display: flex; justify-content: space-between; margin-top: 10px; }
  .foot .right { width: 40%; }
  .foot .right .cbx { display: block; margin: 3px 0; }
  .foot .right .cbx span { display: inline-block; margin-left: 4px; }
  .box-cell { display: inline-block; width: 9px; height: 9px; border: 1px solid #000; }
  .sign { display: flex; margin-top: 14px; }
  .sign .box { border: 1px solid #000; width: 20%; text-align: center; padding: 8px 2px 2px; }
  .sign .box .line { margin: 38px 0 6px; }
  .sign .empty { width: 40%; text-align: right; }
  .sign .empty div { margin: 7px 0; }
  .mat { margin-top: 14px; }
  .mat th { border: 1px solid #000; padding: 2px 4px; text-align: center; }
  .mat td { border: 1px solid #000; padding: 2px 4px; text-align: left; }
</style></head><body>
<div class="head">
  <img src="/img/selognew.png" alt="SELOG"/>
  <h1>SURAT PENGIRIMAN BARANG</h1>
</div>
<div class="kirim">
  <div><br/><strong>SELOG - PT United Equipment Indonesia</strong><br/>
    Jl. Raya Bekasi KM22<br/>Jakarta Timur 13910 - INDONESIA<br/>
    Telp :<br/>Fax :</div>
  <div class="right"><br/>Kepada<br/><strong>${destination}</strong><br/>&nbsp;</div>
</div>
<hr/>
<table class="detail">
  <tr><td>No SPB</td><td>: <strong>${row.shipmentNo ?? ""}</strong></td>
      <td>User</td><td>: ${userLogin}</td></tr>
  <tr><td>Tanggal</td><td>: ${tanggal}</td>
      <td>Expedisi</td><td>: </td></tr>
</table>
<hr/>
<table class="po">
  <thead><tr><th>No</th><th>No DO</th><th>Keterangan</th><th>Berat (Kg)</th>
    <th>Ukuran (Cm)</th><th>Biaya</th><th>Catatan</th></tr></thead>
  <tbody>${poRows}</tbody>
</table>
<hr/>
<hr/>
<div class="total">
  <div>Total Case : ${items.length}</div>
  <div>Total Weight : ${totalWeight}</div>
</div>
<div class="foot">
  <div>Catatan<br/><strong>Shipment :</strong><br/>Pengangkut Menerima Barang kiriman<br/>Dalam Kondisi Baik</div>
  <div class="right">Kondisi Saat Barang diterima<br/>
    <span class="cbx"><span class="box-cell"></span> OK</span>
    <span class="cbx"><span class="box-cell"></span> Damaged</span>
    <span class="cbx"><span class="box-cell"></span> Short</span>
  </div>
</div>
<div class="sign">
  <div class="box">Tanda Tangan Ekspedisi<div class="line">_______________</div>Ekspedisi</div>
  <div class="box">Dikirim oleh :<div class="line">_______________</div>Cap &amp; Nama Jelas</div>
  <div class="box">Diterima oleh :<div class="line">_______________</div>Warehouse Officer</div>
  <div class="empty"><div>_______________________________</div><div>_______________________________</div><div>_______________________________</div><div>_______________________________</div><div>_______________________________</div><div>_______________________________</div></div>
</div>
<table class="mat">
  <thead><tr><th>Material Code</th><th>Material Name</th><th>Material Brand</th><th>Qty</th><th>UoM</th></tr></thead>
  <tbody>${matRows}</tbody>
</table>
<script>setTimeout(function(){window.print();},300);window.onafterprint=function(){window.close();};</script>
</body></html>`);
    win.document.close();
  };

  return (
    <>
      <Table
        title={t("shipmentTable.title")}
        columns={[
          {
            title: "No",
            key: "no",
            width: 60,
            align: "center" as const,
            render: (_: any, record: any) => (
              <span>
                {((listOptions.page ?? 1) - 1) * (listOptions.limit ?? 10) +
                  (rows ?? []).indexOf(record) +
                  1}
              </span>
            ),
          },
          ...columns.map((c: any) => ({ ...c, sorter: true })),
          {
            title: t("table.column.action"),
            key: "action",
            width: 100,
            render: (_: any, row: any) => (
              <>
                <Button
                  size="small"
                  type="text"
                  icon={<EyeOutlined />}
                  tooltip={t("table.button.view")}
                  onClick={() => setShipNo(row.shipmentNo)}
                />
                <Button
                  size="small"
                  type="text"
                  icon={<PrinterOutlined />}
                  tooltip={t("shipment.printLetter")}
                  onClick={() => printDeliveryLetter(row)}
                />
              </>
            ),
          },
        ]}
        dataSource={rows ?? []}
        loading={rows === null}
        rowKey="shipmentNo"
        scroll={{ x: "max-content" }}
        total={total}
        current={listOptions.page}
        pageSize={listOptions.limit}
        onPageChange={onPageChange}
        onTableChange={onTableChange}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 4]}>
            <Col flex="0 0 14rem">
              <Select
                style={{ width: "100%", minWidth: "14rem" }}
                id="shipment-search-by"
                defaultValue={INIT_SEARCH_BY}
                placeholder={t("table.search.placeholder")}
                onChange={(value) => handlerSelectSearchBy(value)}
                onClear={() => handlerSelectSearchBy("")}
                allowClear={false}
              >
                {ShipmentSearchByOptions(tOpt).map((opt) => (
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
      <PackagingByShipmentModal
        shipmentNo={shipNo}
        onClose={() => setShipNo(null)}
      />
    </>
  );
};
