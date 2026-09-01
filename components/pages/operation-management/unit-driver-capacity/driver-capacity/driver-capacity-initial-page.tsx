import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import { useAppDispatch, useAppSelector } from "@sera-redux";
import { unitDriverCapacityActions } from "@sera-redux/slices/unit-driver-capacity.slice";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { unitDriverCapacityTypes } from "@sera-types/unit-driver-capacity.type";
import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { UnitDriverCapacityFilterProps } from "../unit-driver-capacity-initial-page";
import {
  ColumnsDriver,
  DriverSearchByOptions,
} from "../unit-driver-capacity-props-table";

const INIT_SEARCH_BY = "employeeStatus";

interface DriverCapacityListProps {
  filter: UnitDriverCapacityFilterProps;
}

const DriverCapacityList = ({ filter }: DriverCapacityListProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.driver",
  });
  const COLUMN_KEYS = ColumnsDriver()?.filter((_item) => !_item?.exception);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS.filter((o) => !("exclude" in o) || !o.exclude).map(
      (_item) => _item.key,
    ),
  );

  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);

  const dispatch = useAppDispatch();

  const {
    driverCapacity: {
      data,
      options,
      capacityStatuses,
      autoComplete,
      employeeStatuses,
    },
  } = useAppSelector((state) => state.unitDriverCapacity);

  const loading = useAppSelector((state) => state.loading);

  const [driverCapacityListOptions, setDriverCapacityListOptions] = useState<
    BaseType & { [key: string]: any }
  >({
    page: 1,
    limit: 10,
    order: undefined,
    sort: "ASC",
  });

  const [
    driverCapacityAutoCompleteOptions,
    setDriverCapacityAutoCompleteOptions,
  ] = useState<BaseType>({
    searchBy: INIT_SEARCH_BY,
    page: 1,
    limit: 10,
  });

  const onPageChangeListener = (current: number, limit: number) => {
    setDriverCapacityListOptions((prevState) => ({
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
      setDriverCapacityListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "asc" : ("desc" as string),
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setDriverCapacityListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string) => {
    setDriverCapacityAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setDriverCapacityListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const handleSelectStatus = (value?: string) => {
    setDriverCapacityListOptions((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value!);
    setDriverCapacityListOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    setDriverCapacityAutoCompleteOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    dispatch(unitDriverCapacityActions.getDriverCapacityAutoCompleteClear());
  };

  useEffect(() => {
    dispatch(
      unitDriverCapacityActions.getDriverCapacityFetch({
        ...driverCapacityListOptions,
        ...filter,
        searchBy,
      }),
    );

    return () => {
      dispatch(unitDriverCapacityActions.getDriverCapacityClear());
    };
  }, [driverCapacityListOptions, filter]);

  useEffect(() => {
    if (driverCapacityAutoCompleteOptions.search)
      dispatch(
        unitDriverCapacityActions.getDriverCapacityAutoCompleteFetch({
          ...driverCapacityAutoCompleteOptions,
          searchBy,
        }),
      );

    return () => {
      dispatch(unitDriverCapacityActions.getDriverCapacityAutoCompleteClear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverCapacityAutoCompleteOptions]);

  useEffect(() => {
    dispatch(unitDriverCapacityActions.getDriverCapacityStatusesFetch());
    return () => {
      dispatch(unitDriverCapacityActions.getDriverCapacityStatusesClear());
    };
  }, []);

  return (
    <>
      <Table
        title={t("table.title")}
        columns={ColumnsDriver()?.filter(
          (_item) => _item?.exception || showColumns?.includes(_item?.key),
        )}
        dataSource={data}
        total={options?.totalData ?? 0}
        current={options?.page ?? 1}
        pageSize={options?.limit ?? 10}
        rowKey="no"
        loading={loading[unitDriverCapacityTypes.GET_DRIVER_CAPACITY]}
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
                {DriverSearchByOptions().map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              {searchBy !== "employeeStatus" && searchBy !== "status" && (
                <Input.Search
                  loading={false}
                  placeholder={t("table.search.placeholder")}
                  autoCompleteItems={autoComplete?.data}
                  onSearch={(search) =>
                    onSearchChangeListener(
                      search,
                      driverCapacityAutoCompleteOptions.searchBy ?? searchBy,
                    )
                  }
                  onSearching={(searching) =>
                    onSearchingChangeListener(searching)
                  }
                  onClear={onClearSearchListener}
                  value={driverCapacityAutoCompleteOptions.search ?? ""}
                />
              )}
              {searchBy === "employeeStatus" && (
                <Select
                  placeholder={t("table.search.statusPlaceholder")}
                  onChange={(value) => handleSelectStatus(value)}
                  value={driverCapacityListOptions.search ?? undefined}
                  onClear={() => handleSelectStatus(undefined)}
                  style={{ minWidth: "17rem" }}
                >
                  {searchBy === "employeeStatus" &&
                    employeeStatuses.data.map((opt) => (
                      <Select.Option
                        key={opt.id}
                        value={opt.name.toUpperCase()}
                      >
                        {opt.name.toUpperCase()}
                      </Select.Option>
                    ))}
                </Select>
              )}
              {searchBy === "status" && (
                <Select
                  placeholder={t("table.search.statusPlaceholder")}
                  onChange={(value) => handleSelectStatus(value)}
                  value={driverCapacityListOptions.search ?? undefined}
                  onClear={() => handleSelectStatus(undefined)}
                  style={{ minWidth: "20rem" }}
                >
                  {searchBy === "status" &&
                    capacityStatuses?.data?.map((opt) => (
                      <Select.Option key={opt.id} value={opt.name}>
                        {opt.name}
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
    </>
  );
};

export default DriverCapacityList;
