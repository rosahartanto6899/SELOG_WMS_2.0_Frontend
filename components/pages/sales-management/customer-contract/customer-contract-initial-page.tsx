/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import { customerContractActions, RootState } from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import {
  Contract,
  CustomerContractState,
  customerContractTypes,
} from "@sera-types/customer-contract.type";
import { LoadingState } from "@sera-types/loading.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import {
  Columns,
  COLUMNS_DEFAULT_UNCHECK,
  SearchByOptions,
} from "./customer-contract-props-table";

interface CustomerContractInitialPageProps {
  loading: LoadingState;
  customerContracts: CustomerContractState;
  getContracts: typeof customerContractActions.getContractsFetch;
  getContractsAutoComplete: typeof customerContractActions.getContractsAutoCompleteFetch;
  getContractsAutoCompleteClear: typeof customerContractActions.getContractsAutoCompleteClear;
}

const CustomerContractInitialPage = ({
  loading,
  customerContracts,
  getContracts,
  getContractsAutoComplete,
  getContractsAutoCompleteClear,
}: CustomerContractInitialPageProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "customerContract" });
  const COLUMN_KEYS = Columns()?.filter((_item) => !_item?.exception);

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-contract/index");

  const [isSkipFetch, setIsSkipFetch] = useState(false);

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

  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !COLUMNS_DEFAULT_UNCHECK.includes(_key),
    ),
  );

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

    getContractsAutoCompleteClear();
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
    if (isSkipFetch) return setIsSkipFetch(false);

    try {
      getContracts(dataOptions);
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 135, error);
      else sendErrorHandler("useEffect", 135, error?.data?.message);
    }
  }, [dataOptions]);

  useEffect(() => {
    try {
      if (dataAutoCompleteOptions.search) {
        getContractsAutoComplete(dataAutoCompleteOptions);
      }
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 135, error);
      else sendErrorHandler("useEffect", 135, error?.data?.message);
    }
  }, [dataAutoCompleteOptions]);

  return (
    <Table
      title={t("table.contract.title")}
      columns={Columns()?.filter(
        (_item) => _item?.exception || showColumns?.includes(_item?.key),
      )}
      dataSource={customerContracts?.data ?? []}
      total={customerContracts?.options?.totalData ?? 0}
      current={customerContracts?.options?.page ?? 1}
      pageSize={customerContracts?.options?.limit ?? 10}
      rowKey={(row: Contract) => `${row.no}`}
      onPageChange={onChangePagination}
      onTableChange={onTableChangeListener}
      scroll={{ x: "max-content" }}
      loading={loading[customerContractTypes.GET_CONTRACTS]}
      isCustomSearch
      customSearch={
        <Row align="middle" gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Select
              id="customer-contract-search"
              style={{ width: 172 }}
              defaultValue="cmd"
              options={SearchByOptions()}
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
              loading={
                loading[customerContractTypes.GET_CONTRACTS_AUTOCOMPLETE]
              }
              placeholder={t("table.contract.search.placeholder")}
              autoCompleteItems={customerContracts?.autoComplete?.data ?? []}
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
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  customerContracts: state.customerContracts,
});

const mapDispatchToProps = {
  getContracts: customerContractActions.getContractsFetch,
  getContractsAutoComplete:
    customerContractActions.getContractsAutoCompleteFetch,
  getContractsAutoCompleteClear:
    customerContractActions.getContractsAutoCompleteClear,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerContractInitialPage);
