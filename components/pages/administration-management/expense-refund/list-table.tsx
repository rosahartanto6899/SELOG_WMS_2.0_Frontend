import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { UnitParams } from "@sera-types/expense-refund.type";
// import { UnitParams } from "@sera-types/tracking-tracking.type";
import { Col, Row } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import useExpenseRefund from "./hooks/useExpenseRefund";
import { ColumnsList, UNCHECK_KEYS } from "./list-props-table";

const DEFAULT_SEARCH = "shipmentNumber";
const initialOptions = { page: 1, limit: 10 };

interface ListTableProps {
  params: UnitParams;
}

const ListTable = ({ params }: ListTableProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "expenseRefund.table",
  });

  const {
    queries: { fetchList },
    data: { listData },
    pagination: { listOptions },
    loading: { listLoading },
  } = useExpenseRefund();

  const [isSkipFetch, setIsSkipFetch] = useState(false);

  const [options, setOptions] = useState<BaseType>(initialOptions);
  const COLUMN_KEYS = ColumnsList()?.filter((_item) => !_item?.exception);

  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !UNCHECK_KEYS.includes(_key),
    ),
  );

  const onChangePagination = (_current: number, _limit: number) => {
    setOptions((_prev) => ({ ..._prev, page: _current, limit: _limit }));
  };

  const onChangeSearchBy = (_value?: string) => {
    if (!_value) return setOptions(initialOptions);
    setOptions((_prev) => ({ ..._prev, searchBy: _value, search: null }));
    setIsSkipFetch(true);
  };

  const onHandleSearch = (_search?: string) => {
    if (!_search) return setOptions(initialOptions);
    setOptions((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH,
      search: _search,
      page: 1,
    }));
  };

  const onHandleClearSearch = () => {
    setOptions(initialOptions);
  };

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);
    fetchList({ ...options, ...params });
  }, [options, params]);

  const renderFilter = useMemo(() => {
    return (
      <Input.Search
        id={`${options?.searchBy}-search`}
        key={`${options?.searchBy}-search`}
        style={{ width: 172 }}
        loading={Boolean(false)}
        disabled={Boolean(false)}
        placeholder={"search"}
        autoCompleteItems={[]}
        onSearch={(_search) => onHandleSearch(_search)}
        onClear={onHandleClearSearch}
        value={options?.search ?? ""}
      />
    );
  }, [options?.searchBy]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsList()?.filter(
        (_item) => _item?.exception || showColumns?.includes(_item?.key),
      )}
      dataSource={listData ?? []}
      total={listOptions?.totalData ?? 0}
      current={listOptions?.page ?? 1}
      pageSize={listOptions?.limit ?? 10}
      onPageChange={onChangePagination}
      scroll={{ x: "max-content" }}
      loading={listLoading}
      isCustomSearch
      customSearch={
        <Row align="middle" gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Select
              id="expense-refund-search"
              style={{ width: 172 }}
              defaultValue={DEFAULT_SEARCH}
              options={[
                { label: "Shipment Number", value: "shipmentNumber" },
                { label: "Customer Name", value: "customerName" },
              ]}
              onChange={(value) => onChangeSearchBy(value)}
              onClear={() => null}
              allowClear={false}
            />
          </Col>

          <Col xs={24} md={12}>
            {renderFilter}
          </Col>
        </Row>
      }
      showActions
      actions={
        <Row gutter={[12, 12]}>
          <Col>
            <FilterDropdown
              buttonLabel={t("button.config")}
              icon={<InsertRowAboveOutlined />}
              options={
                (COLUMN_KEYS?.map((_item) => ({
                  label: _item?.title,
                  value: _item?.key,
                })) as AutoCompleteType[]) ?? []
              }
              selectedValues={showColumns}
              onChange={(_value: string[]) => {
                setShowColumns(_value);
              }}
              onReset={() => {
                setShowColumns(COLUMN_KEYS?.map((_item) => _item?.key));
              }}
            />
          </Col>
        </Row>
      }
    />
  );
};

export default ListTable;
