import { InsertRowAboveOutlined } from "@ant-design/icons";
import Card from "@sera-components/card";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import {
  businessAreaActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { additionalExpenseActions } from "@sera-redux/slices/additional-expense.slice";
import { additionalExpenseTypes } from "@sera-types/additional-expense.type";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { Col, Flex, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import AdditionalExpenseFilter, {
  FilterStateProps,
} from "./additional-expense-filter";
import { Columns, SearchByOptions } from "./additional-expense-props-table";
import AdditionalExpenseSummary from "./additional-expense-summary";

const INIT_SEARCH_BY = "shipmentNo";

export const APPROVAL_STATUS_OPTIONS = [
  {
    label: "Waiting for Approval",
    value: "Waiting for Approval",
  },
  {
    label: "Rejected",
    value: "Rejected",
  },
  {
    label: "Approved",
    value: "Approved",
  },
];

const AdditionalExpenseList = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(undefined, {
    keyPrefix: "additionalExpense",
  });

  const COLUMN_KEYS = Columns()?.filter((_item) => !_item?.exception);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS.map((_item) => _item.key),
  );

  const { data, options, autoComplete } = useAppSelector(
    (state) => state.additionalExpense,
  );

  const loading = useAppSelector((state) => state.loading);

  const [filter, setFilter] = useState<FilterStateProps>({
    branchId: undefined,
    shipmentType: undefined,
  });
  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);

  const [additionalExpenseListOptions, setAdditionalExpenseListOptions] =
    useState<BaseType & { [key: string]: any }>({
      page: 1,
      limit: 10,
      order: "createdAt",
      sort: "asc",
    });

  const [
    additionalExpenseAutoCompleteOptions,
    setAdditionalExpenseAutoCompleteOptions,
  ] = useState<BaseType>({
    searchBy: INIT_SEARCH_BY,
    page: 1,
    limit: 10,
  });

  const onChangeFilter = (val: string[], type: string) => {
    setFilter((prev) => {
      const _filter = {
        ...prev,
        [type]: val?.length ? val : undefined,
      };
      setAdditionalExpenseListOptions((prevState) => {
        const _params = {
          ...prevState,
          ..._filter,
          page: 1,
        };
        return _params;
      });

      return _filter;
    });
  };

  const onPageChangeListener = (current: number, limit: number) => {
    setAdditionalExpenseListOptions((prevState) => ({
      ...prevState,
      page: current,
      limit,
    }));
  };

  const onTableChangeListener = (
    _pagination: any,
    _filters: any,
    sorter: any,
  ) => {
    if (sorter) {
      setAdditionalExpenseListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : ("desc" as string),
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setAdditionalExpenseListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string) => {
    setAdditionalExpenseAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setAdditionalExpenseListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value!);
    setAdditionalExpenseListOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }
      return prevState;
    });

    setAdditionalExpenseAutoCompleteOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }
      return prevState;
    });

    dispatch(additionalExpenseActions.getAdditionalExpenseAutoCompleteClear());
  };

  const handleSelectStatus = (value?: string) => {
    setAdditionalExpenseListOptions((prev) => ({
      ...prev,
      search: value,
    }));
  };

  useEffect(() => {
    dispatch(businessAreaActions.getDropdownBusinessAreasFetch({}));
    return () => {
      dispatch(businessAreaActions.getDropdownBusinessAreasClear());
    };
  }, []);

  useEffect(() => {
    dispatch(additionalExpenseActions.getAdditionalExpenseSummaryFetch(filter));

    return () => {
      dispatch(additionalExpenseActions.getAdditionalExpenseSummaryClear());
    };
  }, [filter]);

  useEffect(() => {
    dispatch(
      additionalExpenseActions.getAdditionalExpenseFetch({
        ...additionalExpenseListOptions,
        ...filter,
        searchBy: additionalExpenseListOptions?.search ? searchBy : undefined,
        search: additionalExpenseListOptions?.search || undefined,
      }),
    );

    return () => {
      dispatch(additionalExpenseActions.getAdditionalExpenseClear());
    };
  }, [additionalExpenseListOptions, filter]);

  useEffect(() => {
    if (additionalExpenseAutoCompleteOptions.search) {
      dispatch(
        additionalExpenseActions.getAdditionalExpenseAutoCompleteFetch({
          ...additionalExpenseAutoCompleteOptions,
          ...filter,
          searchBy,
        }),
      );
    }

    return () => {
      dispatch(
        additionalExpenseActions.getAdditionalExpenseAutoCompleteClear(),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [additionalExpenseAutoCompleteOptions, searchBy]);

  return (
    <Flex gap={16} vertical>
      <Card.Filter>
        <AdditionalExpenseFilter
          filter={filter}
          onChangeFilter={onChangeFilter}
        />
      </Card.Filter>

      <Card>
        <AdditionalExpenseSummary />
      </Card>

      <Card>
        <Table
          title={t("table.title")}
          columns={Columns()?.filter(
            (_item) => _item?.exception || showColumns?.includes(_item?.key),
          )}
          dataSource={data}
          loading={loading[additionalExpenseTypes.GET_ADDITIONAL_EXPENSE]}
          total={options?.totalData ?? 0}
          current={options?.page ?? 1}
          pageSize={options?.limit ?? 10}
          rowKey="no"
          scroll={{ x: "max-content" }}
          onPageChange={onPageChangeListener}
          onTableChange={onTableChangeListener}
          isCustomSearch
          customSearch={
            <Row align="middle" gutter={[8, 4]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Select
                  style={{ width: "100%" }}
                  id="customer-search"
                  defaultValue={searchBy}
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

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {searchBy !== "status" && (
                  <Input.Search
                    loading={false}
                    placeholder={t("table.search.placeholder")}
                    autoCompleteItems={autoComplete?.data || []}
                    onSearch={(search) =>
                      onSearchChangeListener(
                        search,
                        additionalExpenseAutoCompleteOptions.searchBy ??
                          searchBy,
                      )
                    }
                    onSearching={(searching) =>
                      onSearchingChangeListener(searching)
                    }
                    onClear={onClearSearchListener}
                    value={additionalExpenseAutoCompleteOptions.search ?? ""}
                  />
                )}

                {searchBy === "status" && (
                  <Select
                    placeholder={t("table.search.statusPlaceholder")}
                    onChange={(value) => handleSelectStatus(value)}
                    value={additionalExpenseListOptions.search ?? undefined}
                    onClear={() => handleSelectStatus(undefined)}
                    style={{ minWidth: "20rem" }}
                  >
                    {APPROVAL_STATUS_OPTIONS.map((opt) => (
                      <Select.Option
                        key={opt.value}
                        value={opt.value.toUpperCase()}
                      >
                        {opt.label.toUpperCase()}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Col>
            </Row>
          }
          actions={
            <Row gutter={[16, 4]}>
              <Col>
                <FilterDropdown
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
                  buttonLabel="Columns"
                  icon={<InsertRowAboveOutlined />}
                />
              </Col>
            </Row>
          }
        />
      </Card>
    </Flex>
  );
};

export default AdditionalExpenseList;
