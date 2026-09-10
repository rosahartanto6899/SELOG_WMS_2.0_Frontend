/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { CheckOutlined, EyeOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import { BaseType } from "@sera-types/base.type";
import { Col, Empty, message, Modal, Row } from "antd";
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
    const destinations = new Set(
      selectedRows.map((r: any) => r.customerDestination ?? ""),
    );
    if (destinations.size > 1) {
      message.error(t("packaging.destinationMismatch"));
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
            key: "view",
            width: 70,
            render: (_: any, row: any) => (
              <Button
                size="small"
                type="text"
                icon={<EyeOutlined />}
                tooltip={t("table.button.view")}
                onClick={() => setShipNo(row.shipmentNo)}
              />
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
