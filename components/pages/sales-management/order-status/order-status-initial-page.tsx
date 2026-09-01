/* eslint-disable @typescript-eslint/no-explicit-any */
import { InboxOutlined, InsertRowAboveOutlined } from "@ant-design/icons";
import Card from "@sera-components/card";
import CarouselInsightSkeletons from "@sera-components/carousel/carousel-insights";
import FilterDropdown from "@sera-components/filter-dropdown";
import { LogisWalletIcon } from "@sera-components/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import {
  getDropdownBusinessAreasFetch,
  getOrderStatusAutoCompleteClear,
  getOrderStatusAutoCompleteFetch,
  getOrderStatusClear,
  getOrderStatusFetch,
  getOrderStatusSummaryInformationClear,
  getOrderStatusSummaryInformationFetch,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { businessAreaTypes } from "@sera-types/business-area.type";
import { orderStatusTypes } from "@sera-types/order-status.type";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Col, Flex, Row } from "antd";
import { camelCase } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import OrderStatusCard from "./order-status-card";
import OrderStatusFilters from "./order-status-filter";
import {
  Columns,
  ColumnsShipmentStatus,
  SearchByOptions,
} from "./order-status-props-table";
export interface FilterProps {
  shipmentType?: string[];
}

const INIT_SEARCH_BY = "branchName";

const OrderStatusInitialPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "orderStatus" });
  const dispatch = useAppDispatch();
  const {
    data,
    options,
    autoComplete,
    summary: {
      data: { summary, shipmentStatus },
    },
  } = useAppSelector((state) => state.orderStatus);
  const { dropdownBusinessAreas } = useAppSelector(
    (state) => state.businessAreas,
  );

  const loading = useAppSelector((state) => state.loading);
  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/sales-management/shipment-status/index");

  const [filter, setFilter] = useState<FilterProps>({
    shipmentType: undefined,
  });
  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);
  const COLUMN_KEYS = Columns()?.filter((_item) => !_item?.exception);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS.filter((item) => !item.exclude).map((_item) => _item.key),
  );

  const shipmentStatusData = shipmentStatus.map((v) => {
    const obj: Record<string, any> = { category: v.status };
    for (const branch of v.branches) {
      obj[camelCase(branch.name)] = branch.count;
    }

    return obj;
  });

  const [orderStatusListOptions, setOrderStatusListOptions] = useState<
    BaseType & { [key: string]: any }
  >({
    page: 1,
    limit: 10,
    // order: "createdAt",
    // sort: "desc",
  });

  const [orderStatusAutoCompleteOptions, setOrderStatusAutoCompleteOptions] =
    useState<BaseType>({
      searchBy: INIT_SEARCH_BY,
      page: 1,
      limit: 10,
    });

  const onPageChangeListener = (current: number, limit: number) => {
    setOrderStatusListOptions((prevState) => ({
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
      setOrderStatusListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : ("desc" as string),
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setOrderStatusListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string) => {
    setOrderStatusAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setOrderStatusListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value!);
    setOrderStatusListOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    setOrderStatusAutoCompleteOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    dispatch(getOrderStatusAutoCompleteClear());
  };

  const onChangeFilter = (val: string[], type: keyof FilterProps) => {
    setFilter((prev) => {
      const _filter = { ...prev, [type]: val?.length ? val : undefined };
      setOrderStatusListOptions((prevState) => {
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

  useEffect(() => {
    dispatch(getDropdownBusinessAreasFetch({}));
    return () => {
      dispatch(getOrderStatusClear());
      dispatch(getOrderStatusAutoCompleteClear());
      dispatch(getOrderStatusSummaryInformationClear());
    };
  }, []);

  useEffect(() => {
    try {
      dispatch(
        getOrderStatusFetch({
          ...orderStatusListOptions,
          searchBy: orderStatusListOptions.search ? searchBy : undefined,
        }),
      );
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 154, error);
      else sendErrorHandler("useEffect", 155, error?.data?.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderStatusListOptions]);

  useEffect(() => {
    try {
      if (orderStatusAutoCompleteOptions.search)
        dispatch(
          getOrderStatusAutoCompleteFetch({
            ...orderStatusAutoCompleteOptions,
            searchBy,
          }),
        );
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 164, error);
      else sendErrorHandler("useEffect", 165, error?.data?.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderStatusAutoCompleteOptions]);

  useEffect(() => {
    dispatch(
      getOrderStatusSummaryInformationFetch({
        shipmentType: filter.shipmentType ?? [],
      }),
    );

    return () => {
      dispatch(getOrderStatusSummaryInformationClear());
    };
  }, [filter.shipmentType]);

  return (
    <div>
      <Flex vertical gap={"3rem"}>
        <Card
          style={{
            position: "sticky",
            zIndex: 10,
            top: "-24px",
            width: "max-content",
          }}
        >
          <OrderStatusFilters filter={filter} onChangeFilter={onChangeFilter} />
        </Card>
        <Card noShadow>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <CarouselInsightSkeletons>
                <Col className="gutter-row" span={24}>
                  <OrderStatusCard
                    label={t("table.card.totalShipment")}
                    icon={<LogisWalletIcon />}
                    value={summary.totalShipment}
                    cardBg="#F0F9FF"
                    avatarBg="#69B1FF"
                    loading={
                      loading[
                        orderStatusTypes.GET_ORDER_STATUS_SUMMARY_INFORMATION
                      ]
                    }
                  />
                </Col>
                <Col className="gutter-row" span={24}>
                  <OrderStatusCard
                    label={t("table.card.shipmentOrder")}
                    icon={<LogisWalletIcon />}
                    value={summary.shipmentOrder}
                    loading={
                      loading[
                        orderStatusTypes.GET_ORDER_STATUS_SUMMARY_INFORMATION
                      ]
                    }
                  />
                </Col>
                <Col className="gutter-row" span={24}>
                  <OrderStatusCard
                    label={t("table.card.pairingProcess")}
                    icon={<LogisWalletIcon />}
                    value={summary.pairingProcess}
                    cardBg="#cfe2ff"
                    avatarBg="#163769"
                    loading={
                      loading[
                        orderStatusTypes.GET_ORDER_STATUS_SUMMARY_INFORMATION
                      ]
                    }
                  />
                </Col>
                <Col className="gutter-row" span={24}>
                  <OrderStatusCard
                    label={t("table.card.shipmentJourney")}
                    icon={<LogisWalletIcon />}
                    value={summary.shipmentJourney}
                    cardBg="successMain"
                    avatarBg="successSubtle"
                    loading={
                      loading[
                        orderStatusTypes.GET_ORDER_STATUS_SUMMARY_INFORMATION
                      ]
                    }
                  />
                </Col>
                <Col className="gutter-row" span={24}>
                  <OrderStatusCard
                    label={t("table.card.administrationProcess")}
                    icon={<LogisWalletIcon />}
                    value={summary.administrationProcess}
                    cardBg="dangerMain"
                    avatarBg="dangerSubtle"
                    loading={
                      loading[
                        orderStatusTypes.GET_ORDER_STATUS_SUMMARY_INFORMATION
                      ]
                    }
                  />
                </Col>
                <Col className="gutter-row" span={24}>
                  <OrderStatusCard
                    label={t("table.card.shipmentDone")}
                    icon={<InboxOutlined />}
                    value={summary.shipmentDone}
                    cardBg="warningMain"
                    avatarBg="warningSubtle"
                    loading={
                      loading[
                        orderStatusTypes.GET_ORDER_STATUS_SUMMARY_INFORMATION
                      ]
                    }
                  />
                </Col>
              </CarouselInsightSkeletons>
            </Col>
          </Row>
        </Card>
        <Card>
          <Table
            title={t("table.title")}
            columns={Columns()?.filter(
              (_item) => _item?.exception || showColumns?.includes(_item?.key),
            )}
            dataSource={data ?? []}
            current={options?.page}
            total={options?.totalData ?? 0}
            rowKey="no"
            loading={loading[orderStatusTypes.GET_ORDER_STATUS]}
            scroll={{ x: "max-content" }}
            multipleDelete={false}
            pageSize={options?.limit ?? 10}
            onPageChange={onPageChangeListener}
            onTableChange={onTableChangeListener}
            isCustomSearch
            customSearch={
              <Row align="middle" gutter={[8, 4]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Select
                    id="customer-search"
                    defaultValue={INIT_SEARCH_BY}
                    placeholder={t("table.search.default.placeholder")}
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
                    loading={loading[orderStatusTypes.GET_ORDER_STATUS]}
                    placeholder={t("table.search.placeholder")}
                    autoCompleteItems={autoComplete?.data}
                    onSearch={(search) =>
                      onSearchChangeListener(
                        search,
                        orderStatusAutoCompleteOptions.searchBy ??
                          INIT_SEARCH_BY,
                      )
                    }
                    onSearching={(searching) =>
                      onSearchingChangeListener(searching)
                    }
                    onClear={onClearSearchListener}
                    value={orderStatusAutoCompleteOptions.search ?? ""}
                  />
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
        <Card>
          <Table
            title={t("table.titleShipment")}
            columns={ColumnsShipmentStatus({
              data: dropdownBusinessAreas.data,
            })}
            dataSource={shipmentStatusData ?? []}
            rowKey="category"
            loading={loading[businessAreaTypes.GET_DROPDOWN_BUSINESS_AREAS]}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </Flex>
    </div>
  );
};

export default OrderStatusInitialPage;
