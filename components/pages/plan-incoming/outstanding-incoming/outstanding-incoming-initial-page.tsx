/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  CheckOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  // HolderOutlined, // reuse when the Hold feature is re-enabled
  InsertRowAboveOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import {
  outstandingIncomingActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import {
  OutstandingIncomingDetail,
  OutstandingIncomingRow,
  outstandingIncomingTypes,
} from "@sera-types/outstanding-incoming.type";
import { ROUTE } from "@sera-utils/constants/routes";
import useCheckPermission from "@sera-utils/hooks/useCheckPermission";
import { useIsMobileView } from "@sera-utils/hooks/useIsMobileView";
import {
  Checkbox,
  Col,
  Drawer,
  Dropdown,
  Input as AntdInput,
  message,
  Modal,
  Row,
  Space,
} from "antd";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import AdjustQtyForm from "./adjust-qty-form";
import BarcodeLabelingForm from "./barcode-labeling-form";
import BinningSlipForm from "./binning-slip-form";
import CreateActualForm from "./create-actual-form";
import { HoldIncomingForm, HoldListForm } from "./hold-incoming-form";
import { Columns, SearchByOptions } from "./outstanding-incoming-props-table";
import OutstandingIncomingSummary from "./outstanding-incoming-summary";
import QiForm from "./qi-form";

const INIT_SEARCH_BY = "deliveryNoteNo";

const OutstandingIncomingInitialPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming",
  });

  const { isCreate, isUpdate, isDelete } = useCheckPermission({
    menuLink: ROUTE.PLAN_INCOMING.OUTSTANDING_INCOMING,
  });

  const { data, options } = useAppSelector(
    (state) => state.outstandingIncoming,
  );
  const loading = useAppSelector((state) => state.loading);

  const COLUMN_KEYS = (Columns({} as any) ?? []).filter(
    (_item: any) => !_item?.exception,
  );
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS.map((_item: any) => _item?.key),
  );

  const { data: session } = useSession() as any;
  // Active warehouse dari session switch — backend filter per warehouse aktif,
  // filter dropdown warehouse dihapus dari UI
  const activeWarehouseCode = (session?.user?.warehouseCode ?? "") as string;

  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);
  const [listOptions, setListOptions] = useState<
    BaseType & { [key: string]: any }
  >({ page: 1, limit: 10, order: "createdAt", sort: "desc" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState<string | null>(null);

  // mobile: search & columns live in drawers, header stays compact
  const isMobile = useIsMobileView();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDraft, setFilterDraft] = useState("");
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [columnsQuery, setColumnsQuery] = useState("");

  // parity outgoing hasCancellation — Cancel PO hanya aktif bila ada baris
  // terpilih ber-status Cancellation
  const selectedRows = (data ?? []).filter((r: any) =>
    selectedIds.includes(r.id),
  );
  const hasCancellation = selectedRows.some(
    (r: any) => r.status === "Cancellation",
  );

  // modal/form state (row & bulk actions)
  const [activeHeader, setActiveHeader] = useState<string | null>(null);
  const [activeDn, setActiveDn] = useState<string | null>(null);
  const [activeDetails, setActiveDetails] = useState<
    OutstandingIncomingDetail[]
  >([]);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustLoading, setAdjustLoading] = useState(false);
  const [blOpen, setBlOpen] = useState(false);
  const [blLoading, setBlLoading] = useState(false);
  const [qiOpen, setQiOpen] = useState(false);
  const [slipOpen, setSlipOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const [holdListOpen, setHoldListOpen] = useState(false);
  const [actualOpen, setActualOpen] = useState(false);
  const refresh = () =>
    dispatch(
      outstandingIncomingActions.getOutstandingIncomingFetch({
        ...listOptions,
        warehouseCode: activeWarehouseCode || undefined,
      }),
    );

  useEffect(() => {
    dispatch(
      outstandingIncomingActions.getOutstandingIncomingSummaryFetch({
        warehouseCodes: activeWarehouseCode ? [activeWarehouseCode] : null,
      }),
    );
  }, [activeWarehouseCode]);

  useEffect(() => {
    refresh();
  }, [listOptions, activeWarehouseCode]);

  const onPageChangeListener = (current: number, limit: number) => {
    setListOptions((prevState) => ({ ...prevState, page: current, limit }));
  };

  const onTableChangeListener = (_p: any, _f: any, sorter: any) => {
    if (sorter?.field) {
      setListOptions((prevState) => ({
        ...prevState,
        order: sorter.field, // = dataIndex, map whitelist backend
        sort: sorter.order === "ascend" ? "asc" : "desc",
        page: 1, // sort baru → mulai dari halaman 1
      }));
    }
  };

  // LOGIS pattern: changing the search column resets the search box
  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value ?? INIT_SEARCH_BY);
    setListOptions((prevState: any) => ({
      ...prevState,
      search: null,
      page: 1,
    }));
  };

  const loadDetails = async (
    id: string,
  ): Promise<OutstandingIncomingDetail[]> => {
    const header = await OutstandingIncomingApi().retrieveDetailTyped(id);
    return header.details ?? [];
  };

  const handlers = useMemo(
    () => ({
      onHold: (row: OutstandingIncomingRow) => {
        setActiveHeader(row.id);
        setHoldOpen(true);
      },
      onAdjustQty: (row: OutstandingIncomingRow) => {
        // popup langsung muncul — details di-load paralel (dulu: nunggu API dulu)
        setActiveHeader(row.id);
        setActiveDn(row.deliveryNoteNo ?? null);
        setActiveDetails([]);
        setAdjustOpen(true);
        setAdjustLoading(true);
        loadDetails(row.id).then((d) => {
          setActiveDetails(d);
          setAdjustLoading(false);
        });
      },
      onBinning: async (row: OutstandingIncomingRow) => {
        // Status sudah Binning → langsung buka layar, TANPA update status
        // (parity legacy: getIsDraft == "Binning" → processBinningLocation)
        if (row.status === "Binning") {
          router.push(
            `${ROUTE.PLAN_INCOMING.OUTSTANDING_INCOMING}/binning?id=${row.id}`,
          );
          return;
        }
        // Belum Binning → wajib ada partialQty ≠ 0 (parity Swal "Mohon input
        // Partial Quantity terlebih dahulu")
        const details = await loadDetails(row.id);
        if (!details.some((d) => (d.partialQty ?? 0) !== 0)) {
          message.error(t("binning.noPartial"));
          return;
        }
        Modal.confirm({
          title: t("list.confirmFlowTitle", { status: "Binning" }),
          content: t("list.confirmFlowHint"),
          okButtonProps: { danger: true },
          onOk: async () => {
            try {
              await OutstandingIncomingApi().updateStatus(row.id, "Binning");
              message.success("Binning — OK");
              refresh();
              router.push(
                `${ROUTE.PLAN_INCOMING.OUTSTANDING_INCOMING}/binning?id=${row.id}`,
              );
            } catch (error: any) {
              const body: any = error?.response?.data ?? error?.data ?? {};
              message.error(body?.message ?? error?.statusText ?? "Failed");
            }
          },
        });
      },
      onQiWork: async (row: OutstandingIncomingRow) => {
        setActiveHeader(row.id);
        setActiveDetails(await loadDetails(row.id));
        setQiOpen(true);
      },
      onSlip: (row: OutstandingIncomingRow) => {
        setActiveHeader(row.id);
        setSlipOpen(true);
      },
      onEdit: (row: OutstandingIncomingRow) => {
        // Input/edit = halaman penuh ?id= (dulu popup)
        router.push(`${ROUTE.PLAN_INCOMING.INPUT_INCOMING}?id=${row.id}`);
      },
      onCancel: (row: OutstandingIncomingRow) => {
        Modal.confirm({
          title: t("list.confirmCancel"),
          onOk: async () => {
            await OutstandingIncomingApi().confirmCancellation([row.id]);
            message.success(t("list.cancelled"));
            refresh();
          },
        });
      },
      onFlow: async (row: OutstandingIncomingRow, status: string) => {
        // Sudah di status tujuan → langsung buka layar kerja TANPA update status
        // (parity legacy: getIsDraft == target → langsung proses, tanpa confirm)
        if (
          row.status === status &&
          (status === "Quality Inspection" || status === "Barcode Labeling")
        ) {
          setActiveHeader(row.id);
          setActiveDetails([]);
          if (status === "Quality Inspection") {
            setQiOpen(true);
            loadDetails(row.id).then(setActiveDetails);
          } else {
            setBlOpen(true);
            setBlLoading(true);
            loadDetails(row.id).then((d) => {
              setActiveDetails(d);
              setBlLoading(false);
            });
          }
          return;
        }
        // Parity legacy btnGoodsReceipt: blokir GR saat Actual Qty belum seimbang.
        // ponytail: pakai sums bawaan row Q1 (sumber sama dgn kolom indikator);
        // fallback fetch detail kalau row belum bawa sums (backend lama).
        if (status === "Goods Receipt") {
          let poQtyTotal = row.poQtyTotal;
          let binningQtyTotal = row.binningQtyTotal;
          if (poQtyTotal == null || binningQtyTotal == null) {
            const details = await loadDetails(row.id);
            poQtyTotal = details.reduce((s, d) => s + (d.poQty ?? 0), 0);
            binningQtyTotal = details.reduce(
              (s, d) => s + (d.binningQty ?? 0),
              0,
            );
          }
          if (poQtyTotal !== binningQtyTotal) {
            message.error(t("list.grUnbalanced"));
            return;
          }
        }
        Modal.confirm({
          title: t("list.confirmFlowTitle", { status }),
          content: t("list.confirmFlowHint"),
          okButtonProps: { danger: true },
          onOk: async () => {
            try {
              const resp: any = await OutstandingIncomingApi().updateStatus(
                row.id,
                status,
              );
              const msg = resp?.data?.data?.message;
              if (msg === "Update skipped") {
                // parity SP: status Cancelled/GR → skip, bukan error
                message.info(t("list.skipped"));
                return;
              }
              message.success(`${status} — OK`);
              refresh();
              // After setting "Quality Inspection" → open the QI working screen
              if (status === "Quality Inspection") {
                setActiveHeader(row.id);
                setActiveDetails([]);
                setQiOpen(true);
                loadDetails(row.id).then(setActiveDetails);
              }
              // Barcode Labeling → list material + pilih utk print barcode
              if (status === "Barcode Labeling") {
                setActiveHeader(row.id);
                setActiveDetails([]);
                setBlOpen(true);
                setBlLoading(true);
                loadDetails(row.id).then((d) => {
                  setActiveDetails(d);
                  setBlLoading(false);
                });
              }
            } catch (error: any) {
              const body: any = error?.response?.data ?? error?.data ?? {};
              message.error(body?.message ?? error?.statusText ?? "Failed");
            }
          },
        });
      },
    }),
    [listOptions, activeWarehouseCode],
  );

  const onConfirmCancelBulk = async () => {
    if (!selectedIds.length) return;
    setBulkLoading("cancel");
    try {
      const resp: any =
        await OutstandingIncomingApi().confirmCancellation(selectedIds);
      message.info(resp?.data?.data?.message ?? t("list.cancelled"));
      setSelectedIds([]);
      refresh();
    } catch (error: any) {
      const body: any = error?.response?.data ?? error?.data ?? {};
      message.error(body?.message ?? error?.statusText ?? "Failed");
    } finally {
      setBulkLoading(null);
    }
  };

  const onConfirmDraft = async () => {
    if (!selectedIds.length) return;
    setBulkLoading("confirm");
    try {
      const resp: any =
        await OutstandingIncomingApi().confirmDraft(selectedIds);
      message.info(resp?.data?.data?.message ?? "Done");
      setSelectedIds([]);
      refresh();
    } catch (error: any) {
      // surface the raw error — make the cause (403/422/etc.) visible instead of failing silently
      const body: any = error?.response?.data ?? error?.data ?? {};
      const detail = Array.isArray(body?.errors)
        ? body.errors
            .map((e: any) =>
              `${e?.field ?? ""}: ${(e?.message ?? []).join(", ")}`.replace(
                /^: /,
                "",
              ),
            )
            .join("; ")
        : "";
      message.error(
        `${body?.message ?? error?.statusText ?? "Confirm failed"}${detail ? ` — ${detail}` : ""}`,
      );
    } finally {
      setBulkLoading(null);
    }
  };

  const onDeleteBulk = () => {
    if (!selectedIds.length) return;
    Modal.confirm({
      title: t("list.confirmDelete"),
      content: t("list.confirmDeleteHint"),
      okButtonProps: { danger: true },
      onOk: async () => {
        setBulkLoading("delete");
        try {
          await OutstandingIncomingApi().deleteOutstanding(selectedIds);
          message.success(t("list.deleted"));
          setSelectedIds([]);
          refresh();
        } finally {
          setBulkLoading(null);
        }
      },
    });
  };

  // ---- mobile drawer handlers (reuse existing search/columns state) ----
  const applyFilter = () => {
    setListOptions((prevState: any) => ({
      ...prevState,
      search: filterDraft || undefined,
      searchBy: filterDraft ? searchBy : undefined,
      page: 1,
    }));
    setFilterOpen(false);
  };

  const resetFilter = () => {
    setFilterDraft("");
    setSearchBy(INIT_SEARCH_BY);
    setListOptions((prevState: any) => ({
      ...prevState,
      search: null,
      searchBy: undefined,
      page: 1,
    }));
    setFilterOpen(false);
  };

  const toggleColumn = (key: string, checked: boolean) =>
    setShowColumns((prev) =>
      checked ? [...prev, key] : prev.filter((k) => k !== key),
    );

  const mobileActionItems = [
    ...(isUpdate
      ? [
          {
            key: "confirm",
            icon: <CheckOutlined />,
            label: t("table.button.bulkConfirm"),
            disabled: !selectedIds.length,
          },
        ]
      : []),
    ...(isDelete
      ? [
          {
            key: "delete",
            icon: <DeleteOutlined />,
            label: t("table.button.bulkDelete"),
            danger: true,
            disabled: !selectedIds.length,
          },
        ]
      : []),
    ...(isUpdate
      ? [
          {
            key: "cancel",
            icon: <CloseCircleOutlined />,
            label: t("table.button.confirmCancel"),
            danger: true,
            disabled: !hasCancellation,
          },
        ]
      : []),
  ];

  const onMobileActionClick = ({ key }: { key: string }) =>
    key === "confirm"
      ? onConfirmDraft()
      : key === "delete"
        ? onDeleteBulk()
        : onConfirmCancelBulk();

  const searchByOptions = SearchByOptions();

  const columnOptions = COLUMN_KEYS.filter((_item: any) =>
    String(_item?.title ?? "")
      .toLowerCase()
      .includes(columnsQuery.toLowerCase()),
  );

  return (
    <>
      {/* one shadow from Card.Container is enough — inner cards shadowless like other pages */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <OutstandingIncomingSummary />

        <Card noShadow>
          <Table
            columns={(Columns(handlers) ?? []).filter(
              (_item: any) =>
                _item?.exception || showColumns?.includes(_item?.key),
            )}
            dataSource={data}
            loading={loading[outstandingIncomingTypes.GET_OUTSTANDING_INCOMING]}
            total={options?.totalData ?? 0}
            current={options?.page ?? 1}
            pageSize={options?.limit ?? 10}
            rowKey="id"
            scroll={{ x: "max-content" }}
            onPageChange={onPageChangeListener}
            onTableChange={onTableChangeListener}
            multipleSelect
            onSelectedRowsChange={(keys) => setSelectedIds(keys as string[])}
            getCheckboxProps={(record: any) => ({
              disabled: record?.status !== "Draft",
            })}
            isCustomSearch
            title={isMobile ? undefined : t("table.title")}
            customSearch={
              isMobile ? (
                // mobile-only header: title + ⋯ (row 1), utilities (row 2),
                // primary CTA (row 3) — hierarchy jelas, slot actions dikosongkan
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.7rem",
                        fontWeight: 600,
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t("table.title")}
                    </h3>
                    {(isUpdate || isDelete) && (
                      <Dropdown
                        menu={{
                          items: mobileActionItems,
                          onClick: onMobileActionClick,
                        }}
                      >
                        <Button
                          aria-label={t("table.button.moreActions")}
                          icon={<MoreOutlined />}
                          loading={
                            bulkLoading === "confirm" ||
                            bulkLoading === "delete" ||
                            bulkLoading === "cancel"
                          }
                        />
                      </Dropdown>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      block
                      icon={<SearchOutlined />}
                      onClick={() => {
                        setFilterDraft(
                          ((listOptions as any)?.search as string) ?? "",
                        );
                        setFilterOpen(true);
                      }}
                    >
                      {t("table.button.searchFilter")}
                    </Button>
                    <Button
                      block
                      icon={<InsertRowAboveOutlined />}
                      onClick={() => setColumnsOpen(true)}
                    >
                      Columns
                    </Button>
                  </div>

                  {isCreate && (
                    <Button
                      block
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        router.push(ROUTE.PLAN_INCOMING.INPUT_INCOMING)
                      }
                    >
                      {t("table.button.inputIncoming")}
                    </Button>
                  )}
                </div>
              ) : (
                <Row align="middle" gutter={[8, 4]}>
                  <Col flex="0 0 14rem">
                    <Select
                      style={{ width: "100%", minWidth: "14rem" }}
                      id="outstanding-incoming-search-by"
                      defaultValue={INIT_SEARCH_BY}
                      placeholder={t("table.search.placeholder")}
                      onChange={(value) => handlerSelectSearchBy(value)}
                      onClear={() => handlerSelectSearchBy("")}
                      allowClear={false}
                    >
                      {searchByOptions.map((opt) => (
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
              )
            }
            actions={
              isMobile ? null : (
                <Row gutter={[16, 4]}>
                  <Col>
                    <Space wrap>
                      {isCreate && (
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() =>
                            router.push(ROUTE.PLAN_INCOMING.INPUT_INCOMING)
                          }
                        >
                          {t("table.button.inputIncoming")}
                        </Button>
                      )}
                      {/* Hold feature hidden for now
                  <Button
                    icon={<HolderOutlined />}
                    onClick={() => setHoldListOpen(true)}
                  >
                    {t("table.button.holdList")}
                  </Button>
                  */}
                      {isUpdate && (
                        <Button
                          icon={<CheckOutlined />}
                          loading={bulkLoading === "confirm"}
                          disabled={!selectedIds.length}
                          onClick={onConfirmDraft}
                        >
                          {t("table.button.bulkConfirm")}
                        </Button>
                      )}
                      {(isDelete || isUpdate) && (
                        <Dropdown
                          menu={{
                            items: [
                              ...(isDelete
                                ? [
                                    {
                                      key: "delete",
                                      icon: <DeleteOutlined />,
                                      label: t("table.button.bulkDelete"),
                                      danger: true,
                                    },
                                  ]
                                : []),
                              ...(isUpdate
                                ? [
                                    {
                                      key: "cancel",
                                      icon: <CloseCircleOutlined />,
                                      label: t("table.button.confirmCancel"),
                                      danger: true,
                                      disabled: !hasCancellation,
                                    },
                                  ]
                                : []),
                            ],
                            onClick: ({ key }: { key: string }) =>
                              key === "delete"
                                ? onDeleteBulk()
                                : onConfirmCancelBulk(),
                          }}
                        >
                          <Button
                            danger
                            icon={<MoreOutlined />}
                            loading={
                              bulkLoading === "delete" ||
                              bulkLoading === "cancel"
                            }
                            disabled={!selectedIds.length}
                          >
                            {t("table.button.moreActions")} <DownOutlined />
                          </Button>
                        </Dropdown>
                      )}
                      {/* Create Actual feature hidden for now
                  {isUpdate && (
                    <Button
                      type="primary"
                      disabled={!selectedIds.length}
                      onClick={() => setActualOpen(true)}
                    >
                      {t("table.button.bulkCreateActual")}
                    </Button>
                  )}
                  */}
                    </Space>
                  </Col>
                  <Col>
                    <FilterDropdown
                      options={
                        (COLUMN_KEYS?.map((_item: any) => ({
                          label: _item?.title,
                          value: _item?.key,
                        })) as AutoCompleteType[]) ?? []
                      }
                      selectedValues={showColumns}
                      onChange={(_value: string[]) => setShowColumns(_value)}
                      onReset={() =>
                        setShowColumns(
                          COLUMN_KEYS?.map((_item: any) => _item?.key),
                        )
                      }
                      buttonLabel="Columns"
                      icon={<InsertRowAboveOutlined />}
                    />
                  </Col>
                </Row>
              )
            }
          />
        </Card>
      </div>

      {/* Mobile bottom sheets — reuse search/columns state di atas */}
      <Drawer
        title={t("table.button.searchFilter")}
        placement="bottom"
        height="auto"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        styles={{
          content: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
        footer={
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={resetFilter}>Reset</Button>
            <Button type="primary" onClick={applyFilter}>
              Search
            </Button>
          </Space>
        }
      >
        <div
          aria-hidden
          style={{
            background: "#d0d5dd",
            borderRadius: 999,
            height: 4,
            margin: "0 auto 12px",
            width: 36,
          }}
        />
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Select
            style={{ width: "100%" }}
            id="outstanding-incoming-search-by-mobile"
            value={searchBy}
            placeholder={t("table.search.placeholder")}
            onChange={(value) => {
              handlerSelectSearchBy(value);
              setFilterDraft("");
            }}
            onClear={() => handlerSelectSearchBy("")}
            allowClear={false}
          >
            {searchByOptions.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
          {/* sera Input tidak sinkron saat value direset ke "" — pakai antd
              Input mentah; submit via tombol Search di footer drawer */}
          <AntdInput
            allowClear
            prefix={<SearchOutlined />}
            style={{ width: "100%" }}
            placeholder={t("table.search.placeholder")}
            value={filterDraft}
            onChange={(e) => setFilterDraft(e.target.value)}
            onPressEnter={applyFilter}
          />
        </Space>
      </Drawer>

      <Drawer
        title="Columns"
        placement="bottom"
        height="min(75vh, 560px)"
        open={columnsOpen}
        onClose={() => setColumnsOpen(false)}
        styles={{
          body: {
            // hanya list checkbox yang scroll — body drawer tidak
            overflowY: "hidden",
          },
          content: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
        footer={
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() =>
                setShowColumns(COLUMN_KEYS.map((_i: any) => _i?.key))
              }
            >
              Reset
            </Button>
            <Button type="primary" onClick={() => setColumnsOpen(false)}>
              Apply
            </Button>
          </Space>
        }
      >
        <div
          aria-hidden
          style={{
            background: "#d0d5dd",
            borderRadius: 999,
            height: 4,
            margin: "0 auto 12px",
            width: 36,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            height: "100%",
          }}
        >
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search..."
            value={columnsQuery}
            onChange={(e) => setColumnsQuery(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              paddingBottom: 4,
            }}
          >
            {columnOptions.length > 0 ? (
              columnOptions.map((_item: any) => (
                <Checkbox
                  key={_item?.key}
                  checked={showColumns.includes(_item?.key)}
                  onChange={(e) => toggleColumn(_item?.key, e.target.checked)}
                >
                  {_item?.title}
                </Checkbox>
              ))
            ) : (
              <div style={{ color: "#999", fontSize: 12, textAlign: "center" }}>
                No results found
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {/* Aksi & form */}
      {holdOpen && (
        <HoldIncomingForm
          open={holdOpen}
          rows={(data ?? []).filter((r: any) => r.id === activeHeader)}
          onClose={() => setHoldOpen(false)}
          onDone={refresh}
        />
      )}
      <HoldListForm
        open={holdListOpen}
        onClose={() => setHoldListOpen(false)}
      />
      <AdjustQtyForm
        open={adjustOpen}
        details={activeDetails}
        loading={adjustLoading}
        deliveryNoteNo={activeDn}
        onClose={() => setAdjustOpen(false)}
        onDone={refresh}
      />
      <BarcodeLabelingForm
        open={blOpen}
        headerId={activeHeader}
        details={activeDetails}
        loading={blLoading}
        onClose={() => setBlOpen(false)}
        onDone={refresh}
      />
      <QiForm
        open={qiOpen}
        headerId={activeHeader}
        details={activeDetails}
        onClose={() => setQiOpen(false)}
        onDone={async () => {
          if (activeHeader) setActiveDetails(await loadDetails(activeHeader));
          refresh();
        }}
      />
      <BinningSlipForm
        open={slipOpen}
        headerId={activeHeader}
        onClose={() => setSlipOpen(false)}
      />
      <CreateActualForm
        open={actualOpen}
        ids={selectedIds}
        onClose={() => setActualOpen(false)}
        onDone={() => {
          setSelectedIds([]);
          refresh();
        }}
      />
    </>
  );
};

export default OutstandingIncomingInitialPage;
