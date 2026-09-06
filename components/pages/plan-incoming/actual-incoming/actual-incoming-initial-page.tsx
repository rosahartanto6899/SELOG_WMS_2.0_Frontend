/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { InsertRowAboveOutlined } from "@ant-design/icons";
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
import { Col, message, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ActualIncomingFilter, {
  FilterStateProps,
} from "./actual-incoming-filter";
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

  const refresh = () =>
    dispatch(
      actualIncomingActions.getActualIncomingFetch({
        ...listOptions,
        warehouseCode: filter.warehouseCodes?.length
          ? filter.warehouseCodes.join(",")
          : undefined,
      }),
    );

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

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Card.Filter>
          <ActualIncomingFilter
            filter={filter}
            onChangeFilter={onChangeFilter}
          />
        </Card.Filter>

        <Card noShadow>
          <Table
            title={t("table.title")}
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
            customSearch={
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
            }
          />
        </Card>
      </div>

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
