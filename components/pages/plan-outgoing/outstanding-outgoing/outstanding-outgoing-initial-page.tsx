/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  CheckOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import {
  outstandingOutgoingActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import { outstandingOutgoingTypes } from "@sera-types/outstanding-outgoing.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { Col, message, Modal, Row, Space, Tabs } from "antd";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import DnItemsTab from "./dn-items-tab";
import {
  DnListColumns,
  RowActionHandlers,
  SearchByOptions,
} from "./outstanding-outgoing-props-table";
import OutstandingOutgoingSummary from "./outstanding-outgoing-summary";
import { PackagingTab, ShipmentTab } from "./packaging-shipment-tabs";

const INIT_SEARCH_BY = "deliveryNoteNo";
type TabKey = "dnList" | "dnItems" | "packaging" | "shipment";

/** Outstanding Outgoing — worklist 4 tab (spec 004). Fase 1 = read-only:
 *  aksi toolbar tampil sesuai aturan seleksi, handler aktif di Fase 2+. */
const OutstandingOutgoingInitialPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.outstandingOutgoing",
  });
  const router = useRouter();
  const { data: session } = useSession() as any;

  const { isRead, isUpdate, isDelete } = useCheckPermission({
    menuLink: ROUTE.PLAN_OUTGOING.OUTSTANDING_OUTGOING,
  });

  const { list } = useAppSelector((state) => state.outstandingOutgoing);
  const loading = useAppSelector((state) => state.loading);

  // aktif warehouse dari session switch (aktif customer + aktif warehouse)
  const sessionWarehouseCode = (session?.user?.warehouseCode as string) ?? null;
  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);
  const [listOptions, setListOptions] = useState<
    BaseType & { [key: string]: any }
  >({ page: 1, limit: 10, order: "createdAt", sort: "desc" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("dnList");
  const [exporting, setExporting] = useState(false);
  const [bulkLoading, setBulkLoading] = useState<string | null>(null);
  const [isSequential, setIsSequential] = useState(false);

  useEffect(() => {
    dispatch(
      outstandingOutgoingActions.getOutgoingTotalsFetch({
        warehouseCodes: sessionWarehouseCode ? [sessionWarehouseCode] : null,
      }),
    );
  }, [sessionWarehouseCode]);

  const refresh = () =>
    dispatch(
      outstandingOutgoingActions.getOutgoingListFetch({
        ...listOptions,
        warehouseCode: sessionWarehouseCode ?? undefined,
      }),
    );

  useEffect(() => {
    refresh();
  }, [listOptions, sessionWarehouseCode]);

  // Customer aktif dari sesi (parity input-outgoing-form) — dipakai tab 2–4
  const [customerCode, setCustomerCode] = useState<string | null>(null);
  useEffect(() => {
    const customerId = session?.user?.customerId;
    if (!customerId) return;
    import("@sera-libraries/api/customer").then(({ default: CustomerApi }) => {
      CustomerApi()
        .retrieveCustomerDetail({ id: customerId })
        .then((resp: any) => {
          const code = resp?.data?.data?.code ?? null;
          setCustomerCode(code);
          if (code)
            OutstandingOutgoingApi()
              .getSequentialConfig(code)
              .then((cfg: any) => setIsSequential(!!cfg?.isSequentialProcess))
              .catch(() => setIsSequential(false));
        })
        .catch(() => undefined);
    });
  }, [session?.user?.customerId]);

  // Tab 2–4 self-fetch on-open — aktif warehouse dari session switch
  const tabWarehouse = sessionWarehouseCode;
  const refreshAfterMutation = () => {
    refresh();
    dispatch(
      outstandingOutgoingActions.getOutgoingTotalsFetch({
        warehouseCodes: sessionWarehouseCode ? [sessionWarehouseCode] : null,
      }),
    );
  };

  const onPageChangeListener = (current: number, limit: number) =>
    setListOptions((prev) => ({ ...prev, page: current, limit }));

  const onTableChangeListener = (_p: any, _f: any, sorter: any) => {
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

  // ===== T013 — Export CSV seluruh data (parity nama file legacy) =====
  const exportCsv = async () => {
    setExporting(true);
    try {
      const base = {
        ...listOptions,
        page: 1,
        warehouseCode: sessionWarehouseCode ?? undefined,
      };
      const first = await OutstandingOutgoingApi().retrieveList({
        ...base,
        limit: 100,
      });
      const firstBody = (first as any)?.data;
      const totalPage: number = firstBody?.pagination?.totalPage ?? 1;
      const rows: any[] = [...(firstBody?.data ?? [])];
      for (let p = 2; p <= totalPage; p++) {
        const next = await OutstandingOutgoingApi().retrieveList({
          ...base,
          limit: 100,
          page: p,
        });
        rows.push(...((next as any)?.data?.data ?? []));
      }
      const headers = [
        "Delivery Note No",
        "Outgoing Date",
        "PO No",
        "PO Type",
        "PO Date",
        "Customer Destination",
        "Status",
        "Description",
        "Created Date",
        "Created By",
      ];
      const esc = (v: any) =>
        String(v ?? "")
          .replace(/"/g, '""')
          .replace(/\r?\n/g, " ");
      const csv = [
        headers.join(","),
        ...rows.map((r) =>
          [
            r.deliveryNoteNo,
            r.outgoingDate,
            r.poNo,
            r.poType,
            r.poDate,
            r.customerDestination,
            r.status,
            r.description,
            r.createdAt,
            r.createdBy,
          ]
            .map((v) => `"${esc(v)}"`)
            .join(","),
        ),
      ].join("\n");
      const now = new Date();
      const p2 = (n: number) => String(n).padStart(2, "0");
      const stamp = `${now.getFullYear()}${p2(now.getMonth() + 1)}${p2(
        now.getDate(),
      )}${p2(now.getHours())}${p2(now.getMinutes())}${p2(now.getSeconds())}`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(
        new Blob([csv], { type: "text/csv;charset=utf-8;" }),
      );
      link.download = `OUTSTANDINGPLANOUTGOING_${stamp}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } finally {
      setExporting(false);
    }
  };

  // Fase 2+: aksi diaktifkan dengan handler; Fase 1 aturan tampil/aktif saja
  // Fase 3: View navigasi ke halaman detail
  /** T035 — Export Excel (xlsx dep existing; sheet tunggal parity CSV) */
  const exportExcel = async () => {
    setExporting(true);
    try {
      const { utils, writeFile } = await import("xlsx");
      const base = {
        ...listOptions,
        page: 1,
        warehouseCode: sessionWarehouseCode ?? undefined,
      };
      const rows: any[] = [];
      const first = await OutstandingOutgoingApi().retrieveList({
        ...base,
        limit: 100,
      });
      const firstBody = (first as any)?.data;
      const totalPage: number = firstBody?.pagination?.totalPage ?? 1;
      rows.push(...(firstBody?.data ?? []));
      for (let p = 2; p <= totalPage; p++) {
        const next = await OutstandingOutgoingApi().retrieveList({
          ...base,
          limit: 100,
          page: p,
        });
        rows.push(...((next as any)?.data?.data ?? []));
      }
      const ws = utils.json_to_sheet(
        rows.map((r) => ({
          "Delivery Note No": r.deliveryNoteNo,
          "Outgoing Date": r.outgoingDate,
          "PO No": r.poNo,
          "PO Type": r.poType,
          "PO Date": r.poDate,
          "Customer Destination": r.customerDestination,
          Status: r.status,
          Description: r.description,
          "Created Date": r.createdAt,
          "Created By": r.createdBy,
        })),
      );
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "OUTSTANDINGPLANOUTGOING");
      const now = new Date();
      const p2 = (n: number) => String(n).padStart(2, "0");
      writeFile(
        wb,
        `OUTSTANDINGPLANOUTGOING_${now.getFullYear()}${p2(now.getMonth() + 1)}${p2(
          now.getDate(),
        )}${p2(now.getHours())}${p2(now.getMinutes())}${p2(
          now.getSeconds(),
        )}.xlsx`,
      );
    } finally {
      setExporting(false);
    }
  };

  // View — navigasi ke halaman detail (single selection)
  // ===== Aksi massal (Fase 2) — direct API + refresh (parity incoming) =====
  const selectedRows = list.data.filter((r: any) => selectedIds.includes(r.id));
  const hasDraft = selectedRows.some((r: any) => r.status === "Draft");
  const hasCancellation = selectedRows.some(
    (r: any) => r.status === "Cancellation",
  );

  const afterAction = (msg?: string | null) => {
    if (msg) message.success(msg);
    setSelectedIds([]);
    refresh();
    dispatch(
      outstandingOutgoingActions.getOutgoingTotalsFetch({
        warehouseCodes: sessionWarehouseCode ? [sessionWarehouseCode] : null,
      }),
    );
  };

  const apiError = (error: any) => {
    const body: any = error?.response?.data ?? error?.data ?? {};
    message.error(body?.message ?? body?.data?.message ?? "Failed");
  };

  const confirmProcess = (
    action: "confirm" | "cancelDo" | "delete",
    apiFn: (ids: string[]) => Promise<any>,
  ) => {
    Modal.confirm({
      title: t("confirm.process"),
      content: t("confirm.warning"),
      okText: t("confirm.yes"),
      cancelText: t("confirm.no"),
      okButtonProps: { danger: true },
      onOk: async () => {
        setBulkLoading(action);
        try {
          const resp = await apiFn(selectedIds);
          afterAction((resp as any)?.data?.data?.message);
        } catch (error: any) {
          apiError(error);
        } finally {
          setBulkLoading(null);
        }
      },
    });
  };

  /** Sequential AHM — bulk Ready To Ship (parity btnReadyToShipAHM):
   *  valid = indikator YES + status Quality Control; invalid skip dengan
   *  ringkasan DN; semua invalid → error; sebagian → warning lanjut/batal. */
  const confirmReadyToShipBulk = () => {
    const valid = selectedRows.filter(
      (r: any) => r.status === "Quality Control" && r.indicator === "YES",
    );
    const invalidIndicator = selectedRows.filter(
      (r: any) => r.indicator !== "YES",
    );
    const invalidStatus = selectedRows.filter(
      (r: any) => r.indicator === "YES" && r.status !== "Quality Control",
    );
    const dns = (rows: any[]) =>
      rows.map((r: any) => r.deliveryNoteNo).join(", ");

    if (!valid.length) {
      let msg = t("sequential.noValid");
      if (invalidIndicator.length)
        msg += `\n${t("sequential.skippedIndicator")}: ${dns(invalidIndicator)}`;
      if (invalidStatus.length)
        msg += `\n${t("sequential.skippedStatus")}: ${dns(invalidStatus)}`;
      message.error(msg);
      return;
    }

    const proceed = (list: typeof valid) => {
      Modal.confirm({
        title: t("sequential.confirmTitle", { count: list.length }),
        content:
          (invalidIndicator.length || invalidStatus.length
            ? `${invalidIndicator.length + invalidStatus.length} ${t("sequential.skipped")}: ${dns(
                [...invalidIndicator, ...invalidStatus],
              )}\n\n`
            : "") + t("confirm.warning"),
        okText: t("confirm.yes"),
        cancelText: t("confirm.no"),
        okButtonProps: { danger: true },
        onOk: async () => {
          setBulkLoading("status");
          try {
            const resp = await OutstandingOutgoingApi().updateStatuses(
              list.map((r: any) => r.id),
              "Ready To Ship",
            );
            const body = (resp as any)?.data?.data ?? {};
            message.success(
              t("sequential.done", { count: body.updated ?? list.length }),
            );
            afterAction();
          } catch (error: any) {
            apiError(error);
          } finally {
            setBulkLoading(null);
          }
        },
      });
    };

    if (invalidIndicator.length || invalidStatus.length) {
      let warn = `${valid.length} ${t("sequential.willProcess")}.`;
      if (invalidIndicator.length)
        warn += `\n${invalidIndicator.length} ${t("sequential.skippedIndicator")}: ${dns(invalidIndicator)}`;
      if (invalidStatus.length)
        warn += `\n${invalidStatus.length} ${t("sequential.skippedStatus")}: ${dns(invalidStatus)}`;
      Modal.confirm({
        title: t("sequential.warningTitle"),
        content: warn,
        okText: t("sequential.continue"),
        cancelText: t("confirm.no"),
        onOk: () => proceed(valid),
      });
      return;
    }
    proceed(valid);
  };

  // ===== Aksi per baris (parity outstanding-incoming action column) =====
  const confirmStatusRow = (row: any, status: string) => {
    Modal.confirm({
      title: (
        <span
          dangerouslySetInnerHTML={{
            __html: t("confirm.status", {
              status: `<strong>${status}</strong>`,
            }),
          }}
        />
      ),
      content: t("confirm.warning"),
      okText: t("confirm.yes"),
      cancelText: t("confirm.no"),
      okButtonProps: { danger: true },
      onOk: async () => {
        setBulkLoading("status");
        try {
          const resp = await OutstandingOutgoingApi().updateStatus(
            row.id,
            status,
          );
          afterAction((resp as any)?.data?.data?.message);
        } catch (error: any) {
          apiError(error);
        } finally {
          setBulkLoading(null);
        }
      },
    });
  };

  const rowHandlers: RowActionHandlers = {
    isSequential,
    onEditDraft: (row) =>
      router.push(`${ROUTE.PLAN_OUTGOING.INPUT_OUTGOING}?id=${row.id}`),
    onFlow: (row, key) => {
      if (!row) return;
      if (key === "__cancel_do__") {
        // Cancellation -> Cancel DO single-row (parity tombol StopOutlined incoming)
        Modal.confirm({
          title: t("confirm.process"),
          content: t("confirm.warning"),
          okText: t("confirm.yes"),
          cancelText: t("confirm.no"),
          okButtonProps: { danger: true },
          onOk: async () => {
            setBulkLoading("cancelDo");
            try {
              const resp = await OutstandingOutgoingApi().confirmCancellation([
                row.id,
              ]);
              afterAction((resp as any)?.data?.data?.message);
            } catch (error: any) {
              apiError(error);
            } finally {
              setBulkLoading(null);
            }
          },
        });
        return;
      }
      if (key === "__rts__") {
        // Sequential RTS single-row: guard indicator YES + QC (parity AHM)
        if (row.status !== "Quality Control" || row.indicator !== "YES") {
          message.error(
            `${t("sequential.noValid")} — ${row.deliveryNoteNo} (${row.status ?? "-"}, ${row.indicator ?? "-"})`,
          );
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
            setBulkLoading("status");
            try {
              const resp = await OutstandingOutgoingApi().updateStatuses(
                [row.id],
                "Ready To Ship",
              );
              const body = (resp as any)?.data?.data ?? {};
              message.success(
                t("sequential.done", { count: body.updated ?? 1 }),
              );
              afterAction();
            } catch (error: any) {
              apiError(error);
            } finally {
              setBulkLoading(null);
            }
          },
        });
        return;
      }
      if (key === "Picking") {
        // parity legacy btnPickingSlip: Confirmed/QC -> ubah status dulu;
        // status lain (Picking+) -> langsung buka modal
        if (row.status === "Confirmed" || row.status === "Quality Control") {
          Modal.confirm({
            title: (
              <span
                dangerouslySetInnerHTML={{
                  __html: t("confirm.status", {
                    status: `<strong>Picking</strong>`,
                  }),
                }}
              />
            ),
            content: t("confirm.warning"),
            okText: t("confirm.yes"),
            cancelText: t("confirm.no"),
            okButtonProps: { danger: true },
            onOk: async () => {
              setBulkLoading("status");
              try {
                await OutstandingOutgoingApi().updateStatus(row.id, "Picking");
                afterAction();
                router.push(
                  `${ROUTE.PLAN_OUTGOING.OUTSTANDING_OUTGOING}/picking?id=${row.id}`,
                );
              } catch (error: any) {
                apiError(error);
              } finally {
                setBulkLoading(null);
              }
            },
          });
        } else {
          router.push(
            `${ROUTE.PLAN_OUTGOING.OUTSTANDING_OUTGOING}/picking?id=${row.id}`,
          );
        }
        return;
      }
      confirmStatusRow(row, key);
    },
  };

  // kolom dihitung langsung di render (hook useTranslation di dalam Columns)
  const dnListColumns = DnListColumns(rowHandlers);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Card noShadow>
        <OutstandingOutgoingSummary />
      </Card>

      <Card noShadow>
        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as TabKey)}
          items={[
            {
              key: "dnList",
              label: t("tabs.dnList"),
              children: (
                <Table
                  title={t("table.title")}
                  columns={dnListColumns}
                  dataSource={list.data}
                  loading={loading[outstandingOutgoingTypes.GET_OUTGOING_LIST]}
                  total={list.options?.totalData ?? 0}
                  current={list.options?.page ?? 1}
                  pageSize={list.options?.limit ?? 10}
                  rowKey="id"
                  scroll={{ x: "max-content" }}
                  onPageChange={onPageChangeListener}
                  onTableChange={onTableChangeListener}
                  multipleSelect
                  onSelectedRowsChange={(keys) =>
                    setSelectedIds(keys as string[])
                  }
                  isCustomSearch
                  customSearch={
                    <Row align="middle" gutter={[8, 4]}>
                      <Col flex="0 0 14rem">
                        <Select
                          style={{ width: "100%", minWidth: "14rem" }}
                          id="outstanding-outgoing-search-by"
                          defaultValue={INIT_SEARCH_BY}
                          placeholder={t("table.search.placeholder")}
                          onChange={(value) => handlerSelectSearchBy(value)}
                          onClear={() => handlerSelectSearchBy("")}
                          allowClear={false}
                        >
                          {SearchByOptions().map((opt) => (
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
                  actions={
                    <Space wrap>
                      {isUpdate && (
                        <Button
                          icon={<CheckOutlined />}
                          loading={bulkLoading === "confirm"}
                          disabled={!selectedIds.length || !hasDraft}
                          onClick={() =>
                            confirmProcess(
                              "confirm",
                              OutstandingOutgoingApi().confirmDraft,
                            )
                          }
                        >
                          {t("table.button.confirm")}
                        </Button>
                      )}
                      {isUpdate && (
                        <Button
                          danger
                          icon={<CloseCircleOutlined />}
                          loading={bulkLoading === "cancelDo"}
                          disabled={!selectedIds.length || !hasCancellation}
                          onClick={() =>
                            confirmProcess(
                              "cancelDo",
                              OutstandingOutgoingApi().confirmCancellation,
                            )
                          }
                        >
                          {t("table.button.cancelDo")}
                        </Button>
                      )}
                      {isDelete && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          loading={bulkLoading === "delete"}
                          disabled={!selectedIds.length || !hasDraft}
                          onClick={() =>
                            confirmProcess(
                              "delete",
                              OutstandingOutgoingApi().deleteOutgoing,
                            )
                          }
                        >
                          {t("table.button.delete")}
                        </Button>
                      )}
                      {isUpdate && isSequential && (
                        <Button
                          type="primary"
                          icon={<ScanOutlined />}
                          loading={bulkLoading === "status"}
                          disabled={!selectedIds.length}
                          onClick={confirmReadyToShipBulk}
                        >
                          {t("table.button.readyToShip")}
                        </Button>
                      )}
                      {isRead && (
                        <>
                          <Button
                            icon={<DownloadOutlined />}
                            loading={exporting}
                            onClick={exportCsv}
                          >
                            {t("table.button.exportCsv")}
                          </Button>
                          <Button
                            icon={<FileExcelOutlined />}
                            loading={exporting}
                            onClick={exportExcel}
                          >
                            {t("table.button.exportExcel")}
                          </Button>
                        </>
                      )}
                    </Space>
                  }
                />
              ),
            },
            {
              key: "dnItems",
              label: t("tabs.dnItems"),
              disabled: isSequential,
              children: (
                <DnItemsTab
                  active={activeTab === "dnItems"}
                  customerCode={customerCode}
                  warehouseCode={tabWarehouse}
                  onChanged={refreshAfterMutation}
                />
              ),
            },
            {
              key: "packaging",
              label: t("tabs.packaging"),
              disabled: isSequential,
              children: (
                <PackagingTab
                  active={activeTab === "packaging"}
                  customerCode={customerCode}
                  warehouseCode={tabWarehouse}
                  onChanged={refreshAfterMutation}
                />
              ),
            },
            {
              key: "shipment",
              label: t("tabs.shipment"),
              disabled: isSequential,
              children: (
                <ShipmentTab
                  active={activeTab === "shipment"}
                  customerCode={customerCode}
                  warehouseCode={tabWarehouse}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default OutstandingOutgoingInitialPage;
