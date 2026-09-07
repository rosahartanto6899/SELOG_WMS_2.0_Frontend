/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  // HolderOutlined, // reuse when the Hold feature is re-enabled
  InsertRowAboveOutlined,
  PlusOutlined,
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
import { Col, message, Modal, Row, Space } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import AdjustQtyForm from "./adjust-qty-form";
import BarcodeLabelingForm from "./barcode-labeling-form";
import BinningSlipForm from "./binning-slip-form";
import CreateActualForm from "./create-actual-form";
import { HoldIncomingForm, HoldListForm } from "./hold-incoming-form";
import OutstandingIncomingFilter, {
  FilterStateProps,
} from "./outstanding-incoming-filter";
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

  const [filter, setFilter] = useState<FilterStateProps>({});
  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);
  const [listOptions, setListOptions] = useState<
    BaseType & { [key: string]: any }
  >({ page: 1, limit: 10, order: "createdAt", sort: "desc" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState<string | null>(null);

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
        warehouseCode: filter.warehouseCodes?.length
          ? filter.warehouseCodes.join(",")
          : undefined,
      }),
    );

  useEffect(() => {
    dispatch(
      outstandingIncomingActions.getOutstandingIncomingSummaryFetch({
        warehouseCodes: filter.warehouseCodes ?? null,
      }),
    );
  }, [filter.warehouseCodes]);

  useEffect(() => {
    refresh();
  }, [listOptions, filter]);

  const onChangeFilter = (v: any, type: string) => {
    setFilter((prev) => ({ ...prev, [type]: v }));
    setListOptions((prev) => ({ ...prev, page: 1 }));
  };

  const onPageChangeListener = (current: number, limit: number) => {
    setListOptions((prevState) => ({ ...prevState, page: current, limit }));
  };

  const onTableChangeListener = (_p: any, _f: any, sorter: any) => {
    if (sorter) {
      setListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : "desc",
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
            await OutstandingIncomingApi().cancelPlanIncoming(row.id);
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
    [listOptions, filter],
  );

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

  return (
    <>
      {/* one shadow from Card.Container is enough — inner cards shadowless like other pages */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Card.Filter>
          <OutstandingIncomingFilter
            filter={filter}
            onChangeFilter={onChangeFilter}
          />
        </Card.Filter>

        <Card noShadow>
          <OutstandingIncomingSummary />
        </Card>

        <Card noShadow>
          <Table
            title={t("table.title")}
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
            customSearch={
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
                        loading={bulkLoading === "confirm"}
                        disabled={!selectedIds.length}
                        onClick={onConfirmDraft}
                      >
                        {t("table.button.bulkConfirm")}
                      </Button>
                    )}
                    {isDelete && (
                      <Button
                        danger
                        loading={bulkLoading === "delete"}
                        disabled={!selectedIds.length}
                        onClick={onDeleteBulk}
                      >
                        {t("table.button.bulkDelete")}
                      </Button>
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
            }
          />
        </Card>
      </div>

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
