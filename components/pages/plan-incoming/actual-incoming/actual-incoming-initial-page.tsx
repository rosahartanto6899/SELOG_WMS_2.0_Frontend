/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DeleteOutlined,
  DownloadOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { InsertRowAboveOutlined, SearchOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import ActualIncomingApi from "@sera-libraries/api/actual-incoming";
import {
  actualIncomingActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { actualIncomingTypes } from "@sera-types/actual-incoming.type";
import { BaseType } from "@sera-types/base.type";
import { AutoCompleteType } from "@sera-types/base.type";
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
  Row,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FilterStateProps } from "./actual-incoming-filter";
import { Columns, SearchByOptions } from "./actual-incoming-props-table";
import { DeleteActualForm } from "./delete-actual-form";

const INIT_SEARCH_BY = "deliveryNoteNo";

/** Ekspor CSV baris halaman aktif (buka di Excel; tanpa dependensi baru). */
const exportCsv = (rows: any[]) => {
  if (!rows.length) return;
  const headers = [
    "deliveryNoteNo",
    "incomingDate",
    "poNo",
    "poType",
    "poDate",
    "supplierName",
    "referenceNo",
    "status",
    "description",
    "additionalInfo",
    "grDate",
    "grBy",
  ];
  const esc = (v: any) => `"${String(v ?? "-").replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `actual-incoming-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const ActualIncomingInitialPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.actualIncoming",
  });

  const { isDelete } = useCheckPermission({
    menuLink: ROUTE.PLAN_INCOMING.ACTUAL_INCOMING,
  });

  const { data, options } = useAppSelector((state) => state.actualIncoming);
  const loading = useAppSelector(
    (state) => state.loading[actualIncomingTypes.GET_ACTUAL_INCOMING],
  );

  const COLUMN_KEYS = (Columns() ?? []).filter(
    (_item: any) => !_item?.exception,
  );
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS.map((_item: any) => _item?.key),
  );

  const [filter, setFilter] = useState<FilterStateProps>({});
  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);
  const [listOptions, setListOptions] = useState<
    BaseType & { [key: string]: any }
  >({ page: 1, limit: 10, order: "grDate", sort: "desc" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // mobile: search & columns live in drawers, header stays compact
  const isMobile = useIsMobileView();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDraft, setFilterDraft] = useState("");
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [columnsQuery, setColumnsQuery] = useState("");

  // scope customer/warehouse dari token aktif di BE — tidak ada param FE
  const refresh = () =>
    dispatch(actualIncomingActions.getActualIncomingFetch({ ...listOptions }));

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

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value ?? INIT_SEARCH_BY);
    setListOptions((prevState: any) => ({
      ...prevState,
      search: null,
      page: 1,
    }));
  };

  // hook dipanggil di body — jumlah hook konstan lintas branch mobile/desktop
  const searchByOptions = SearchByOptions();

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

  const columnOptions = COLUMN_KEYS.filter((_item: any) =>
    String(_item?.title ?? "")
      .toLowerCase()
      .includes(columnsQuery.toLowerCase()),
  );

  const mobileActionItems = [
    {
      key: "export",
      icon: <DownloadOutlined />,
      label: t("table.button.export"),
    },
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
  ];

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Card noShadow>
          <Table
            columns={(Columns() ?? []).filter(
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
            multipleSelect
            onSelectedRowsChange={(keys) => setSelectedIds(keys as string[])}
            isCustomSearch
            title={isMobile ? undefined : t("table.title")}
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
                      {t("table.title")}
                    </h3>
                    <Dropdown
                      menu={{
                        items: mobileActionItems,
                        onClick: ({ key }: { key: string }) =>
                          key === "delete"
                            ? setDeleteOpen(true)
                            : exportCsv(data),
                      }}
                    >
                      <Button
                        aria-label={t("table.button.export")}
                        icon={<MoreOutlined />}
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
                </div>
              ) : (
                <Row align="middle" gutter={[8, 4]}>
                  <Col flex="0 0 14rem">
                    <Select
                      style={{ width: "100%", minWidth: "14rem" }}
                      id="actual-incoming-search-by"
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
                      <Button
                        icon={<DownloadOutlined />}
                        onClick={() => exportCsv(data)}
                      >
                        {t("table.button.export")}
                      </Button>
                      {isDelete && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          disabled={!selectedIds.length}
                          onClick={() => setDeleteOpen(true)}
                        >
                          {t("table.button.bulkDelete")}
                        </Button>
                      )}
                    </Space>
                  </Col>
                  <Col>
                    <FilterDropdown
                      options={
                        (COLUMN_KEYS?.map((_item: any) => ({
                          label: _item?.title as string,
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
            id="actual-incoming-search-by-mobile"
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

      <DeleteActualForm
        open={deleteOpen}
        ids={selectedIds}
        onClose={() => setDeleteOpen(false)}
        onDone={() => {
          setSelectedIds([]);
          refresh();
        }}
      />
    </>
  );
};

export default ActualIncomingInitialPage;
