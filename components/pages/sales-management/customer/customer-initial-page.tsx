/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { InsertRowAboveOutlined } from "@ant-design/icons";
import Card from "@sera-components/card";
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import FilterDropdown from "@sera-components/filter-dropdown";
import { LogisWallet } from "@sera-components/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import MessageHandler from "@sera-libraries/message-handler";
import { customerActions, RootState } from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import {
  Customer,
  CustomerParams,
  CustomerState,
  customerTypes,
} from "@sera-types/customer.type";
import { LoadingState } from "@sera-types/loading.type";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Flex, Row } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import CustomerFilters from "./customer-filters";
import {
  Columns,
  COLUMNS_DEFAULT_UNCHECK,
  SearchByOptions,
} from "./customer-props-table";

interface CustomersProps {
  loading: LoadingState;
  customers: CustomerState;
  getCustomers: typeof customerActions.getCustomersFetch;
  getCustomersAutoComplete: typeof customerActions.getCustomersAutoCompleteFetch;
  getCustomersAutoCompleteClear: typeof customerActions.getCustomersAutoCompleteClear;
  getDetailCustomerClear: typeof customerActions.getDetailCustomerClear;
  updateCustomerClear: typeof customerActions.updateCustomerClear;
  createSalesClear: typeof customerActions.createSalesClear;
  deleteSalesClear: typeof customerActions.deleteSalesClear;
}

const CustomerInitialPage = ({
  loading,
  customers,
  getCustomers,
  getCustomersAutoComplete,
  getCustomersAutoCompleteClear,
  getDetailCustomerClear,
  updateCustomerClear,
  createSalesClear,
  deleteSalesClear,
}: CustomersProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "customer" });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-data/index");

  const COLUMN_KEYS = Columns()?.filter((_item) => !_item?.exception);

  const [isSkipFetch, setIsSkipFetch] = useState(false);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !COLUMNS_DEFAULT_UNCHECK.includes(_key),
    ),
  );
  const [params, setParams] = useState<CustomerParams>({
    category: [],
    industry: [],
    status: [],
  });
  const [dataOptions, setDataOptions] = useState<BaseType>({
    page: 1,
    limit: 10,
    searchBy: "cmd",
    search: null,
  });
  const [dataAutoCompleteOptions, setDataAutoCompleteOptions] =
    useState<BaseType>({
      searchBy: "cmd",
      page: 1,
      limit: 10,
    });

  const onChangeFilter = (_val: CustomerParams) => {
    setParams((_prev) => ({
      category: _val?.category ?? _prev?.category,
      industry: _val?.industry ?? _prev?.industry,
      status: _val?.status ?? _prev?.status,
    }));
  };

  const DATA_SUMMARY = useMemo(() => {
    const _data = customers?.data?.summary ?? {};

    return [
      {
        label: t("summary.field.total"),
        value: NUMBER_FORMAT(_data?.total),
        variant: "info",
      },
      {
        label: t("summary.field.active"),
        value: NUMBER_FORMAT(_data?.active),
        variant: "success",
      },
      {
        label: t("summary.field.blocked"),
        value: NUMBER_FORMAT(_data?.blocked),
        variant: "error",
      },
    ]?.map((_item) => ({
      ..._item,
      icon: <LogisWallet />,
    })) as CardSummaryDataProps[];
  }, [customers?.data?.summary]);

  const onChangePagination = (_current: number, _limit: number) => {
    setDataOptions((_prevState) => ({
      ..._prevState,
      page: _current,
      limit: _limit,
    }));
  };

  const onTableChangeListener = (_: any, __: any, _sorter: any) => {
    if (!_sorter) return;
    setDataOptions((_prevState) => ({
      ..._prevState,
      order: _sorter.field,
      sort: _sorter.order === "ascend" ? "asc" : "desc",
    }));
  };

  const onChangeSearchBy = (_value?: string) => {
    setIsSkipFetch(true);

    setDataOptions((_prev: BaseType) => ({
      ..._prev,
      searchBy: _value,
      search: null,
    }));

    setDataAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy: _value,
      search: null,
    }));

    getCustomersAutoCompleteClear();
  };

  const onHandleSearching = (_search?: string) => {
    setDataAutoCompleteOptions((_prev: BaseType) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? "cmd",
      search: _search,
      page: 1,
    }));
  };

  const onHandleClearSearch = () => {
    setDataOptions((_prev: BaseType) => ({
      ..._prev,
      search: null,
    }));
  };

  const onHandleSearch = (_search?: string) => {
    setDataOptions((_prev: BaseType) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? "cmd",
      search: _search,
      page: 1,
    }));
  };

  useEffect(() => {
    getDetailCustomerClear();
    createSalesClear();
    deleteSalesClear();
  }, []);

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);

    try {
      getCustomers({ ...dataOptions, ...params });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 135, error);
      else sendErrorHandler("useEffect", 135, error?.data?.message);
    }
  }, [dataOptions, params]);

  useEffect(() => {
    try {
      if (dataAutoCompleteOptions.search) {
        getCustomersAutoComplete({ ...dataAutoCompleteOptions, ...params });
      }
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 135, error);
      else sendErrorHandler("useEffect", 135, error?.data?.message);
    }
  }, [dataAutoCompleteOptions, params]);

  useEffect(() => {
    if (isEmpty(customers?.updateCustomer?.data)) return;

    MessageHandler().success(t("toast.update"));
    updateCustomerClear();
  }, [customers?.updateCustomer?.data]);

  return (
    <Flex gap={24} vertical>
      <Card.Filter>
        <CustomerFilters data={params} onChangeFilter={onChangeFilter} />
      </Card.Filter>

      <Card>
        <CardSummary
          data={DATA_SUMMARY}
          loading={loading[customerTypes.GET_CUSTOMERS]}
        />
      </Card>

      <Card>
        <Table
          title={t("table.title")}
          columns={Columns()?.filter(
            (_item) => _item?.exception || showColumns?.includes(_item?.key),
          )}
          dataSource={customers?.data?.list ?? []}
          total={customers.options?.totalData ?? 0}
          current={customers.options?.page ?? 1}
          pageSize={customers.options?.limit}
          rowKey={(row: Customer) => `${row?.no}`}
          onPageChange={onChangePagination}
          onTableChange={onTableChangeListener}
          scroll={{ x: "max-content" }}
          loading={loading[customerTypes.GET_CUSTOMERS]}
          rowClassName={(_record: Customer) => {
            if (!_record?.hasSales) return "data-warning";
            return "";
          }}
          isCustomSearch
          customSearch={
            <Row align="middle" gutter={[8, 8]}>
              <Col xs={24} md={12}>
                <Select
                  id="customer-search"
                  style={{ width: 172 }}
                  defaultValue="cmd"
                  options={SearchByOptions()}
                  placeholder={t("table.search.default.placeholder")}
                  onChange={(value) => onChangeSearchBy(value)}
                  onClear={() => onChangeSearchBy("")}
                  allowClear={false}
                />
              </Col>

              <Col xs={24} md={12}>
                <Input.Search
                  id={`${dataOptions?.searchBy}-search`}
                  key={`${dataOptions?.searchBy}-search`}
                  style={{ width: 172 }}
                  loading={loading[customerTypes.GET_CUSTOMERS_AUTOCOMPLETE]}
                  placeholder={t("table.search.placeholder")}
                  autoCompleteItems={customers.autoComplete?.data ?? []}
                  onSearch={(_search) => onHandleSearch(_search)}
                  onSearching={(_search) => onHandleSearching(_search)}
                  onClear={onHandleClearSearch}
                />
              </Col>
            </Row>
          }
          actions={
            <Row gutter={8}>
              <Col>
                <FilterDropdown
                  buttonLabel={t("table.button.config")}
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
      </Card>
    </Flex>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  customers: state.customers,
});

const mapDispatchToProps = {
  getCustomers: customerActions.getCustomersFetch,
  getCustomersAutoComplete: customerActions.getCustomersAutoCompleteFetch,
  getCustomersAutoCompleteClear: customerActions.getCustomersAutoCompleteClear,
  getDetailCustomerClear: customerActions.getDetailCustomerClear,
  createSalesClear: customerActions.createSalesClear,
  deleteSalesClear: customerActions.deleteSalesClear,
  updateCustomerClear: customerActions.updateCustomerClear,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerInitialPage);
