import { InsertRowAboveOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import FilterDropdown from "@sera-components/filter-dropdown";
import { AddListIcon, Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import {
  businessAreaActions,
  expensesActions,
  useAppDispatch,
  useAppSelector,
  vehicleTypeActions,
} from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import {
  ExpensesFilterStateProps,
  expensesTypes,
} from "@sera-types/expenses.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { Col, Flex, Row } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ExpensesFilter from "./expenses-filters";
import { Columns, SearchByOptions } from "./expenses-props-table";
import ExpensesSummary from "./expenses-summary";

const INIT_SEARCH_BY = "customerName";

const ExpensesInitialPage = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "expenses",
  });

  const COLUMN_KEYS = Columns()?.filter((_item) => !_item?.exception);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS.filter((item) => !item.exclude).map((_item) => _item.key),
  );

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data, options, autoComplete } = useAppSelector(
    (state) => state.expenses,
  );

  const loading = useAppSelector((state) => state.loading);

  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);
  const [filter, setFilter] = useState<ExpensesFilterStateProps>({
    branchId: undefined,
    shipmentType: undefined,
    unitTypeId: undefined,
  });

  const [expensesListOptions, setExpensesListOptions] = useState<
    BaseType & { [key: string]: any }
  >({
    page: 1,
    limit: 10,
    // order: "createdAt",
    // sort: "asc",
  });

  const [expensesAutoCompleteOptions, setExpensesAutoCompleteOptions] =
    useState<BaseType>({
      searchBy: INIT_SEARCH_BY,
      page: 1,
      limit: 10,
    });

  const onChangeFilter = (val: string[], type: string) => {
    setFilter((prev) => ({
      ...prev,
      [type]: val?.length ? val : undefined,
    }));
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value!);
    setExpensesListOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    setExpensesAutoCompleteOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    dispatch(expensesActions.getExpensesAutoCompleteClear());
  };

  const onClearSearchListener = () => {
    setExpensesAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setExpensesListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string) => {
    setExpensesAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search,
    }));
  };

  const onPageChangeListener = (current: number, limit: number) => {
    setExpensesListOptions((prevState) => ({
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
      setExpensesListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : ("desc" as string),
      }));
    }
  };

  useEffect(() => {
    dispatch(expensesActions.getSummaryExpensesFetch(filter));

    return () => {
      dispatch(expensesActions.getSummaryExpensesClear());
    };
  }, [filter]);

  useEffect(() => {
    dispatch(businessAreaActions.getDropdownBusinessAreasFetch({}));
    dispatch(vehicleTypeActions.getDropdownVehicleTypesFetch({}));
    return () => {
      dispatch(vehicleTypeActions.getDropdownVehicleTypesClear());
      dispatch(businessAreaActions.getDropdownBusinessAreasClear());
    };
  }, []);

  useEffect(() => {
    dispatch(
      expensesActions.getExpensesFetch({
        ...expensesListOptions,
        ...filter,
        searchBy: expensesListOptions?.search ? searchBy : undefined,
        search: expensesListOptions?.search || undefined,
      }),
    );

    return () => {
      dispatch(expensesActions.getExpensesClear());
    };
  }, [expensesListOptions, filter]);

  useEffect(() => {
    if (expensesAutoCompleteOptions.search) {
      dispatch(
        expensesActions.getExpensesAutoCompleteFetch({
          ...expensesAutoCompleteOptions,
          ...filter,
          searchBy,
        }),
      );
    }

    return () => {
      dispatch(expensesActions.getExpensesAutoCompleteClear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expensesAutoCompleteOptions, searchBy]);

  return (
    <>
      <Flex vertical gap={24}>
        <Card.Filter>
          <ExpensesFilter filter={filter} onChangeFilter={onChangeFilter} />
        </Card.Filter>

        <Card>
          <ExpensesSummary />
        </Card>

        <Card>
          <Table
            dataSource={data}
            loading={loading[expensesTypes.GET_EXPENSES]}
            total={options?.totalData ?? 0}
            current={options?.page ?? 1}
            pageSize={options?.limit ?? 10}
            columns={Columns()?.filter(
              (_item) => _item?.exception || showColumns?.includes(_item?.key),
            )}
            title={t("table.title")}
            scroll={{ x: "max-content" }}
            onPageChange={onPageChangeListener}
            onTableChange={onTableChangeListener}
            rowKey="no"
            actions={
              <Row gutter={[16, 4]}>
                <Col>
                  <Button
                    type="primary"
                    icon={<Plus />}
                    onClick={() =>
                      router.push(`${ROUTE.OPERATION_MANAGEMENT.EXPENSES}/add`)
                    }
                  >
                    {t("table.button.addSingleExpense")}
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<AddListIcon />}
                    onClick={() =>
                      router.push(
                        `${ROUTE.OPERATION_MANAGEMENT.EXPENSES}/upsert`,
                      )
                    }
                  >
                    {t("table.button.addBulkExpenses")}
                  </Button>
                </Col>
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
                  <Input.Search
                    loading={false}
                    placeholder={t("table.search.placeholder")}
                    autoCompleteItems={autoComplete?.data ?? []}
                    onSearch={(search) =>
                      onSearchChangeListener(
                        search,
                        expensesAutoCompleteOptions.searchBy ?? searchBy,
                      )
                    }
                    onSearching={(searching) =>
                      onSearchingChangeListener(searching)
                    }
                    onClear={onClearSearchListener}
                    value={expensesAutoCompleteOptions.search ?? ""}
                  />
                </Col>
              </Row>
            }
          />
        </Card>
      </Flex>
    </>
  );
};

export default ExpensesInitialPage;
