/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  DownloadOutlined,
  DownOutlined,
  FileExcelOutlined,
  InsertRowAboveOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import ActualOutgoingApi from "@sera-libraries/api/actual-outgoing";
import {
  actualOutgoingActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { actualOutgoingTypes } from "@sera-types/actual-outgoing.type";
import { BaseType } from "@sera-types/base.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { useIsMobileView } from "@sera-utils/hooks/useIsMobileView";
import {
  Checkbox,
  Col,
  Drawer,
  Dropdown,
  Input as AntdInput,
  Row,
  Space,
} from "antd";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  ActualOutgoingColumns,
  ActualOutgoingSearchByOptions,
} from "./actual-outgoing-props-table";

const INIT_SEARCH_BY = "deliveryNoteNo";

/** List Actual Outgoing (spec 005) — read-only parity legacy ActualOutgoing.js.
 *  Action eye → navigate detail page (${base}/${id}), parity outstanding. */
const ActualOutgoingInitialPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.actualOutgoing",
  });
  const { t: tOpt } = useTranslation(undefined, {
    keyPrefix: "planOutgoing.actualOutgoing.options",
  });
  const { data: session } = useSession() as any;
  const { data, options } = useAppSelector((state) => state.actualOutgoing);
  const loading = useAppSelector(
    (state) => state.loading[actualOutgoingTypes.GET_ACTUAL_OUTGOING],
  );

  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);
  const [listOptions, setListOptions] = useState<
    BaseType & { [k: string]: any }
  >({
    page: 1,
    limit: 10,
    order: "deliveryNoteNo",
    sort: "asc",
  });
  const [exporting, setExporting] = useState(false);

  // mobile: search, columns & actions pindah ke bottom drawer
  const isMobile = useIsMobileView();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDraft, setFilterDraft] = useState("");
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [columnsQuery, setColumnsQuery] = useState("");

  const sessionWarehouseCode = session?.user?.warehouseCode ?? null;
  const customerCode = session?.user?.customerCode ?? null;

  const refresh = () =>
    dispatch(
      actualOutgoingActions.getActualOutgoingFetch({
        ...listOptions,
        customerCode,
        warehouseCode: sessionWarehouseCode ?? undefined,
      }),
    );

  useEffect(() => {
    if (!session) return;
    refresh();
  }, [listOptions, sessionWarehouseCode, session]);

  const onPageChangeListener = (current: number, limit: number) =>
    setListOptions((prev) => ({ ...prev, page: current, limit }));

  const onTableChangeListener = (_p: any, _f: any, sorter: any) => {
    if (sorter?.field) {
      setListOptions((prev) => ({
        ...prev,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : "desc",
        page: 1,
      }));
    }
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value ?? INIT_SEARCH_BY);
    setListOptions((prev: any) => ({ ...prev, search: null, page: 1 }));
  };

  /** Export rows (semua halaman) — shared CSV/Excel */
  const fetchAllRows = async () => {
    const base = {
      ...listOptions,
      page: 1,
      customerCode,
      warehouseCode: sessionWarehouseCode ?? undefined,
    };
    const first = await ActualOutgoingApi().retrieveList({
      ...base,
      limit: 100,
    });
    const firstBody = (first as any)?.data;
    const totalPage: number = firstBody?.pagination?.totalPage ?? 1;
    const rows: any[] = [...(firstBody?.data ?? [])];
    for (let p = 2; p <= totalPage; p++) {
      const next = await ActualOutgoingApi().retrieveList({
        ...base,
        limit: 100,
        page: p,
      });
      rows.push(...((next as any)?.data?.data ?? []));
    }
    return rows;
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const rows = await fetchAllRows();
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
            r.createdDate,
            r.createdBy,
          ]
            .map((v) => `"${esc(v)}"`)
            .join(","),
        ),
      ].join("\n");
      const now = new Date();
      const p2 = (n: number) => String(n).padStart(2, "0");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(
        new Blob([csv], { type: "text/csv;charset=utf-8;" }),
      );
      link.download = `ACTUALOUTGOING_${now.getFullYear()}${p2(now.getMonth() + 1)}${p2(now.getDate())}${p2(now.getHours())}${p2(now.getMinutes())}${p2(now.getSeconds())}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } finally {
      setExporting(false);
    }
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      const { utils, writeFile } = await import("xlsx");
      const rows = await fetchAllRows();
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
          "Created Date": r.createdDate,
          "Created By": r.createdBy,
        })),
      );
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "ACTUALOUTGOING");
      const now = new Date();
      const p2 = (n: number) => String(n).padStart(2, "0");
      writeFile(
        wb,
        `ACTUALOUTGOING_${now.getFullYear()}${p2(now.getMonth() + 1)}${p2(now.getDate())}${p2(now.getHours())}${p2(now.getMinutes())}.xlsx`,
      );
    } finally {
      setExporting(false);
    }
  };

  const openDetail = (id: string) =>
    router.push(`${ROUTE.PLAN_OUTGOING.ACTUAL_OUTGOING}/${id}`);

  const columns = [...ActualOutgoingColumns({ onView: openDetail })];
  const COLUMN_KEYS = columns.filter((_c: any) => !_c?.exception);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS.map((_c: any) => _c?.key),
  );

  // ---- mobile drawer handlers (reuse existing search/export logic) ----
  const applyFilter = () => {
    setListOptions((prev: any) => ({
      ...prev,
      search: filterDraft || undefined,
      searchBy: filterDraft ? searchBy : undefined,
      page: 1,
    }));
    setFilterOpen(false);
  };

  const resetFilter = () => {
    setFilterDraft("");
    setSearchBy(INIT_SEARCH_BY);
    setListOptions((prev: any) => ({
      ...prev,
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

  const columnOptions = COLUMN_KEYS.filter((_item: any) =>
    String(_item?.title ?? "")
      .toLowerCase()
      .includes(columnsQuery.toLowerCase()),
  );

  const mobileActionItems = [
    {
      key: "csv",
      icon: <DownloadOutlined />,
      label: t("exportCsv"),
    },
    {
      key: "excel",
      icon: <FileExcelOutlined />,
      label: t("exportExcel"),
    },
  ];

  const onMobileActionClick = ({ key }: { key: string }) =>
    key === "csv" ? exportCsv() : exportExcel();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card noShadow>
        <Table
          title={isMobile ? undefined : t("title")}
          columns={columns.filter(
            (_item: any) =>
              _item?.exception || showColumns?.includes(_item?.key),
          )}
          dataSource={data}
          loading={loading}
          total={options?.totalData ?? 0}
          current={options?.page ?? 1}
          pageSize={options?.limit ?? 10}
          rowKey="id"
          scroll={{ x: "max-content" }}
          onPageChange={onPageChangeListener}
          onTableChange={onTableChangeListener}
          isCustomSearch
          customSearch={
            isMobile ? (
              // mobile-only header: title + ⋯ (row 1), utilities (row 2)
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
                    {t("title")}
                  </h3>
                  <Dropdown
                    menu={{
                      items: mobileActionItems,
                      onClick: onMobileActionClick,
                    }}
                  >
                    <Button
                      aria-label={t("export")}
                      icon={<MoreOutlined />}
                      loading={exporting}
                    />
                  </Dropdown>
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
                    {t("searchFilter")}
                  </Button>
                  <Button
                    block
                    icon={<InsertRowAboveOutlined />}
                    onClick={() => setColumnsOpen(true)}
                  >
                    Columns
                  </Button>
                </div>
              </div>
            ) : (
              <Row align="middle" gutter={[8, 4]}>
                <Col flex="0 0 14rem">
                  <Select
                    style={{ width: "100%", minWidth: "14rem" }}
                    id="actual-outgoing-search-by"
                    defaultValue={INIT_SEARCH_BY}
                    onChange={(value) => handlerSelectSearchBy(value)}
                    onClear={() => handlerSelectSearchBy("")}
                    allowClear={false}
                  >
                    {ActualOutgoingSearchByOptions(tOpt).map((opt) => (
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
                    placeholder={t("searchPlaceholder")}
                    onSearch={(search?: string) =>
                      setListOptions((prev: any) => ({
                        ...prev,
                        search: search || undefined,
                        searchBy: search ? searchBy : undefined,
                        page: 1,
                      }))
                    }
                    onClear={() =>
                      setListOptions((prev: any) => ({
                        ...prev,
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
              <Space wrap>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "csv",
                        icon: <DownloadOutlined />,
                        label: t("exportCsv"),
                      },
                      {
                        key: "excel",
                        icon: <FileExcelOutlined />,
                        label: t("exportExcel"),
                      },
                    ],
                    onClick: ({ key }: { key: string }) =>
                      key === "csv" ? exportCsv() : exportExcel(),
                  }}
                >
                  <Button icon={<DownloadOutlined />} loading={exporting}>
                    {t("export")} <DownOutlined />
                  </Button>
                </Dropdown>
              </Space>
            )
          }
        />
      </Card>

      {/* Mobile bottom sheets — reuse search/columns state di atas */}
      <Drawer
        title={t("searchFilter")}
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
            id="actual-outgoing-search-by-mobile"
            value={searchBy}
            onChange={(value) => {
              handlerSelectSearchBy(value);
              setFilterDraft("");
            }}
            onClear={() => handlerSelectSearchBy("")}
            allowClear={false}
          >
            {ActualOutgoingSearchByOptions(tOpt).map((opt) => (
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
            placeholder={t("searchPlaceholder")}
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
          <AntdInput
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
              flex: 1,
              gap: 8,
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
    </div>
  );
};

export default ActualOutgoingInitialPage;
