import { InsertRowAboveOutlined } from "@ant-design/icons";
import Card from "@sera-components/card";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import {
  businessAreaActions,
  shipmentCancellationsActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { shipmentCancellationsTypes } from "@sera-types/shipment-cancellations.type";
import { Col, Flex, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ShipmentCancellationsFilter, {
  FilterStateProps,
} from "./shipment-cancellations-filter";
import { Columns, SearchByOptions } from "./shipment-cancellations-props-table";
import ShipmentCancellationsSummary from "./shipment-cancellations-summary";

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

export const driverExpenseDummyData: any[] = [
  {
    no: "1",
    termin: "Termin 1",
    umNumber: "UM-2024-001",
    bphNumber: "BPH-2024-001",
    transferredDate: "2024-01-20",
    amount: "Rp 500.000",
    referenceNumber: "REF-001",
    transferStatus: "Success",
    note: "Uang makan",
    approvalNote: "Approved by Admin",
  },
  {
    no: "2",
    termin: "Termin 2",
    umNumber: "UM-2024-002",
    bphNumber: "BPH-2024-002",
    transferredDate: "2024-01-22",
    amount: "Rp 300.000",
    referenceNumber: "REF-002",
    transferStatus: "Pending",
    note: "Uang bensin",
    approvalNote: "-",
  },
];

const ShipmentCancellationsList = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(undefined, {
    keyPrefix: "shipmentCancellations",
  });

  const COLUMN_KEYS = Columns()?.filter((_item) => !_item?.exception);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS.map((_item) => _item.key),
  );

  const { data, options, autoComplete } = useAppSelector(
    (state) => state.shipmentCancellations,
  );

  const loading = useAppSelector((state) => state.loading);

  const [filter, setFilter] = useState<FilterStateProps>({
    branchId: undefined,
    shipmentType: undefined,
  });
  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);

  const [
    shipmentCancellationsListOptions,
    setShipmentCancellationsListOptions,
  ] = useState<BaseType & { [key: string]: any }>({
    page: 1,
    limit: 10,
    order: "createdAt",
    sort: "asc",
  });

  const [
    shipmentCancellationsAutoCompleteOptions,
    setShipmentCancellationsAutoCompleteOptions,
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
      setShipmentCancellationsListOptions((prevState) => {
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
    setShipmentCancellationsListOptions((prevState) => ({
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
      setShipmentCancellationsListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : ("desc" as string),
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setShipmentCancellationsListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string) => {
    setShipmentCancellationsAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setShipmentCancellationsListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value!);
    setShipmentCancellationsListOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }
      return prevState;
    });

    setShipmentCancellationsAutoCompleteOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }
      return prevState;
    });
  };

  const handleSelectStatus = (value?: string) => {
    setShipmentCancellationsListOptions((prev) => ({
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
    dispatch(
      shipmentCancellationsActions.getShipmentCancellationsSummaryFetch(filter),
    );

    return () => {
      dispatch(
        shipmentCancellationsActions.getShipmentCancellationsSummaryClear(),
      );
    };
  }, [filter]);

  useEffect(() => {
    dispatch(
      shipmentCancellationsActions.getShipmentCancellationsFetch({
        ...shipmentCancellationsListOptions,
        ...filter,
        searchBy: shipmentCancellationsListOptions?.search
          ? searchBy
          : undefined,
        search: shipmentCancellationsListOptions?.search || undefined,
      }),
    );

    return () => {
      dispatch(shipmentCancellationsActions.getShipmentCancellationsClear());
    };
  }, [shipmentCancellationsListOptions, filter]);

  useEffect(() => {
    if (shipmentCancellationsAutoCompleteOptions.search) {
      dispatch(
        shipmentCancellationsActions.getShipmentCancellationsAutoCompleteFetch({
          ...shipmentCancellationsAutoCompleteOptions,
          ...filter,
          searchBy,
        }),
      );
    }

    return () => {
      dispatch(
        shipmentCancellationsActions.getShipmentCancellationsAutoCompleteClear(),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipmentCancellationsAutoCompleteOptions, searchBy]);

  return (
    <Flex gap={16} vertical>
      <Card.Filter>
        <ShipmentCancellationsFilter
          filter={filter}
          onChangeFilter={onChangeFilter}
        />
      </Card.Filter>

      <Card>
        <ShipmentCancellationsSummary />
      </Card>

      <Card>
        <Table
          title={t("table.title")}
          columns={Columns()?.filter(
            (_item) => _item?.exception || showColumns?.includes(_item?.key),
          )}
          dataSource={data}
          loading={
            loading[shipmentCancellationsTypes.GET_SHIPMENT_CANCELLATIONS]
          }
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
                        shipmentCancellationsAutoCompleteOptions.searchBy ??
                          searchBy,
                      )
                    }
                    onSearching={(searching) =>
                      onSearchingChangeListener(searching)
                    }
                    onClear={onClearSearchListener}
                    value={
                      shipmentCancellationsAutoCompleteOptions.search ?? ""
                    }
                  />
                )}

                {searchBy === "status" && (
                  <Select
                    placeholder={t("table.search.statusPlaceholder")}
                    onChange={(value) => handleSelectStatus(value)}
                    value={shipmentCancellationsListOptions.search ?? undefined}
                    onClear={() => handleSelectStatus(undefined)}
                    style={{ minWidth: "20rem" }}
                  >
                    {searchBy === "status" &&
                      APPROVAL_STATUS_OPTIONS.map((opt) => (
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

export default ShipmentCancellationsList;
