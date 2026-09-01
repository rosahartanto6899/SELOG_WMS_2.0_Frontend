/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  InsertRowAboveOutlined,
  NodeIndexOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import Button from "@sera-components/button";
import Card from "@sera-components/card";
import CardSummary, {
  CardSummaryDataProps,
} from "@sera-components/card/card-summary";
import FilterDropdown from "@sera-components/filter-dropdown";
import { Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Modal from "@sera-components/modal";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import Typography from "@sera-components/typography";
import MessageHandler from "@sera-libraries/message-handler";
import {
  customerContractActions,
  customerLocationActions,
  customerRouteActions,
  RootState,
} from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import {
  CustomerRoute,
  CustomerRouteParams,
  CustomerRouteState,
  customerRouteTypes,
} from "@sera-types/customer-route.type";
import { LoadingState } from "@sera-types/loading.type";
import { NUMBER_FORMAT } from "@sera-utils/constants/common";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Divider, Flex, Row } from "antd";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import CustomerRouteFilters from "./customer-route-filters";
import {
  actionCustomerRoute,
  Columns,
  COLUMNS_DEFAULT_UNCHECK,
  SearchByOptions,
} from "./customer-route-props-table";

export interface OnChangeFilterProps {
  categories?: string[];
  industries?: string[];
  statuses?: string[];
}
interface CustomerRouteInitialPageProps {
  loading: LoadingState;
  customerRoutes: CustomerRouteState;
  getCustomerRoutes: typeof customerRouteActions.getCustomerRoutesFetch;
  getCustomerRoutesAutoComplete: typeof customerRouteActions.getCustomerRoutesAutoCompleteFetch;
  deleteCustomerRoute: typeof customerRouteActions.deleteCustomerRouteFetch;
  getCustomerRoutesAutoCompleteClear: typeof customerRouteActions.getCustomerRoutesAutoCompleteClear;
  getDetailCustomerRouteClear: typeof customerRouteActions.getDetailCustomerRouteClear;
  deleteCustomerRouteClear: typeof customerRouteActions.deleteCustomerRouteClear;
  createCustomerRouteClear: typeof customerRouteActions.createCustomerRouteClear;
  updateCustomerRouteClear: typeof customerRouteActions.updateCustomerRouteClear;
  getContractsClear: typeof customerContractActions.getContractsClear;
  getDetailContractClear: typeof customerContractActions.getDetailContractClear;
  getCustomerLocationsClear: typeof customerLocationActions.getCustomerLocationsClear;
  uploadQuotationClear: typeof customerRouteActions.uploadQuotationClear;
}

const CustomerRouteInitialPage = ({
  loading,
  customerRoutes,
  getCustomerRoutes,
  getCustomerRoutesAutoComplete,
  deleteCustomerRoute,
  getCustomerRoutesAutoCompleteClear,
  getDetailCustomerRouteClear,
  deleteCustomerRouteClear,
  createCustomerRouteClear,
  updateCustomerRouteClear,
  getContractsClear,
  getDetailContractClear,
  getCustomerLocationsClear,
  uploadQuotationClear,
}: CustomerRouteInitialPageProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "customerRoute" });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/customer-routes/index");

  const COLUMN_KEYS = Columns({})?.filter((_item) => !_item?.exception);

  const [isSkipFetch, setIsSkipFetch] = useState(false);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !COLUMNS_DEFAULT_UNCHECK.includes(_key),
    ),
  );
  const [params, setParams] = useState<CustomerRouteParams>({
    category: [],
    industry: [],
    status: [],
  });
  const [dataOptions, setDataOptions] = useState<BaseType>({
    page: 1,
    limit: 10,
    searchBy: "routeCode",
    search: null,
  });
  const [dataAutoCompleteOptions, setDataAutoCompleteOptions] =
    useState<BaseType>({
      searchBy: "routeCode",
      page: 1,
      limit: 10,
    });
  const [selectedData, setSelectedData] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const onChangeFilter = (_val: CustomerRouteParams) => {
    setParams((_prev) => ({
      category: _val?.category ?? _prev?.category,
      industry: _val?.industry ?? _prev?.industry,
      status: _val?.status ?? _prev?.status,
    }));
  };

  const DATA_SUMMARY = useMemo(() => {
    const _data = customerRoutes?.data?.summary ?? {};

    return [
      {
        label: t("summary.field.totalCustomer"),
        value: NUMBER_FORMAT(_data?.totalCustomer),
        variant: "info",
        icon: <ShopOutlined />,
      },
      {
        label: t("summary.field.totalRouteRegistered"),
        value: NUMBER_FORMAT(_data?.totalRouteRegistered),
        variant: "success",
        icon: <NodeIndexOutlined />,
      },
    ] as CardSummaryDataProps[];
  }, [customerRoutes?.data?.summary]);

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

    getCustomerRoutesAutoCompleteClear();
  };

  const onHandleSearching = (_search?: string) => {
    setDataAutoCompleteOptions((_prev: BaseType) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? "routeCode",
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
      searchBy: _prev?.searchBy ?? "routeCode",
      search: _search,
      page: 1,
    }));
  };

  const showDeleteModal = (_params: string) => {
    setShowDeleteConfirm(true);
    setSelectedData(_params);
  };

  useEffect(() => {
    getDetailCustomerRouteClear();
    getContractsClear();
    getDetailContractClear();
    getCustomerLocationsClear();
    uploadQuotationClear();
  }, []);

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);

    try {
      getCustomerRoutes({ ...dataOptions, ...params });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 173, error);
      else sendErrorHandler("useEffect", 173, error?.data?.message);
    }
  }, [dataOptions, params]);

  useEffect(() => {
    try {
      if (dataAutoCompleteOptions.search) {
        getCustomerRoutesAutoComplete({
          ...dataAutoCompleteOptions,
          ...params,
        });
      }
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 184, error);
      else sendErrorHandler("useEffect", 184, error?.data?.message);
    }
  }, [dataAutoCompleteOptions, params]);

  useEffect(() => {
    const _data = customerRoutes.createCustomerRoute?.data;

    if (!isEmpty(_data)) {
      MessageHandler().success(t("toast.create"));
      createCustomerRouteClear();
    }
  }, [customerRoutes.createCustomerRoute]);

  useEffect(() => {
    const _data = customerRoutes.updateCustomerRoute?.data;

    if (!isEmpty(_data)) {
      MessageHandler().success(t("toast.update"));
      updateCustomerRouteClear();
    }
  }, [customerRoutes.updateCustomerRoute]);

  useEffect(() => {
    const _data = customerRoutes.deleteCustomerRoute?.data;

    if (!isEmpty(_data)) {
      MessageHandler().success(t("toast.delete"));
      deleteCustomerRouteClear();
    }
  }, [customerRoutes.deleteCustomerRoute]);

  return (
    <Flex gap={24} vertical>
      <Card.Filter>
        <CustomerRouteFilters data={params} onChangeFilter={onChangeFilter} />
      </Card.Filter>

      <CardSummary
        data={DATA_SUMMARY}
        loading={loading[customerRouteTypes.GET_CUSTOMER_ROUTES]}
      />

      <Divider />

      <Table
        title={t("table.title")}
        columns={Columns({
          onDeleteAction: (_record) => {
            showDeleteModal(_record);
          },
        })?.filter(
          (_item) => _item?.exception || showColumns?.includes(_item?.key),
        )}
        dataSource={customerRoutes?.data?.list ?? []}
        total={customerRoutes.options?.totalData ?? 0}
        current={customerRoutes.options?.page ?? 1}
        pageSize={customerRoutes.options?.limit}
        rowKey={(row: CustomerRoute) => `${row?.no}`}
        onPageChange={onChangePagination}
        onTableChange={onTableChangeListener}
        scroll={{ x: "max-content" }}
        loading={loading[customerRouteTypes.GET_CUSTOMER_ROUTES]}
        isCustomSearch
        customSearch={
          <Row align="middle" gutter={[8, 4]}>
            <Col xs={24} md={12}>
              <Select
                id="customer-route-search"
                style={{ width: 172 }}
                defaultValue="routeCode"
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
                loading={
                  loading[customerRouteTypes.GET_CUSTOMER_ROUTES_AUTOCOMPLETE]
                }
                placeholder={t("table.search.placeholder")}
                autoCompleteItems={customerRoutes.autoComplete?.data ?? []}
                onSearch={(_search) => onHandleSearch(_search)}
                onSearching={(_search) => onHandleSearching(_search)}
                onClear={onHandleClearSearch}
              />
            </Col>
          </Row>
        }
        actions={
          <Row gutter={[16, 4]}>
            {actionCustomerRoute.isCreate ? (
              <Col>
                <Link
                  id="link-add-customer-route"
                  href={`${ROUTE.SALES_MANAGEMENT.CUSTOMER_ROUTE}/add`}
                  passHref
                >
                  <Button id="action-add" type="primary" icon={<Plus />}>
                    {t("table.button.add")}
                  </Button>
                </Link>
              </Col>
            ) : null}

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

      <Modal.Confirm
        type="danger"
        open={showDeleteConfirm}
        title={t("modal.delete.title")}
        okText={t("modal.delete.ok")}
        cancelText={t("modal.delete.cancel")}
        okButtonProps={{
          disabled: loading[customerRouteTypes.DELETE_CUSTOMER_ROUTE],
          loading: loading[customerRouteTypes.DELETE_CUSTOMER_ROUTE],
        }}
        cancelButtonProps={{
          disabled: loading[customerRouteTypes.DELETE_CUSTOMER_ROUTE],
        }}
        onOk={() => {
          console.log(selectedData);

          deleteCustomerRoute({
            id: selectedData,
            options: dataOptions,
          });
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      >
        <Typography.Text>{t("modal.delete.subtitle")} </Typography.Text>
      </Modal.Confirm>
    </Flex>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  customerRoutes: state.customerRoutes,
});

const mapDispatchToProps = {
  getCustomerRoutes: customerRouteActions.getCustomerRoutesFetch,
  getCustomerRoutesAutoComplete:
    customerRouteActions.getCustomerRoutesAutoCompleteFetch,
  deleteCustomerRoute: customerRouteActions.deleteCustomerRouteFetch,
  getCustomerRoutesAutoCompleteClear:
    customerRouteActions.getCustomerRoutesAutoCompleteClear,
  getDetailCustomerRouteClear: customerRouteActions.getDetailCustomerRouteClear,
  deleteCustomerRouteClear: customerRouteActions.deleteCustomerRouteClear,
  createCustomerRouteClear: customerRouteActions.createCustomerRouteClear,
  updateCustomerRouteClear: customerRouteActions.updateCustomerRouteClear,
  getContractsClear: customerContractActions.getContractsClear,
  getDetailContractClear: customerContractActions.getDetailContractClear,
  getCustomerLocationsClear: customerLocationActions.getCustomerLocationsClear,
  uploadQuotationClear: customerRouteActions.uploadQuotationClear,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomerRouteInitialPage);
