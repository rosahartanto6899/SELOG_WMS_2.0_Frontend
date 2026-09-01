import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import {
  useAppDispatch,
  useAppSelector,
  vehicleTypeActions,
} from "@sera-redux";
import { unitDriverCapacityActions } from "@sera-redux/slices/unit-driver-capacity.slice";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { unitDriverCapacityTypes } from "@sera-types/unit-driver-capacity.type";
import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { UnitDriverCapacityFilterProps } from "../unit-driver-capacity-initial-page";
import {
  ColumnsUnit,
  UnitSearchByOptions,
} from "../unit-driver-capacity-props-table";

const INIT_SEARCH_BY = "unitType";

interface UnitCapacityListProps {
  filter: UnitDriverCapacityFilterProps;
}

const UnitCapacityList = ({ filter }: UnitCapacityListProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitDriverCapacity.unit",
  });
  const COLUMN_KEYS = ColumnsUnit()?.filter((_item) => !_item?.exception);
  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS.filter((o) => !("exclude" in o) || !o.exclude).map(
      (_item) => _item.key,
    ),
  );

  const [searchBy, setSearchBy] = useState(INIT_SEARCH_BY);

  const dispatch = useAppDispatch();

  const {
    unitCapacity: { data, options, capacityStatuses, autoComplete },
  } = useAppSelector((state) => state.unitDriverCapacity);

  const loading = useAppSelector((state) => state.loading);

  const { dropdownVehicleTypes } = useAppSelector(
    (state) => state.vehicleTypes,
  );

  const unitTypeOptions = dropdownVehicleTypes.data.map((v) => ({
    label: v.name,
    value: v.id,
  }));

  const [unitCapacityListOptions, setUnitCapacityListOptions] = useState<
    BaseType & { [key: string]: any }
  >({
    page: 1,
    limit: 10,
    order: "eta",
    sort: "DESC",
  });

  const [unitCapacityAutoCompleteOptions, setUnitCapacityAutoCompleteOptions] =
    useState<BaseType>({
      searchBy: INIT_SEARCH_BY,
      page: 1,
      limit: 10,
    });

  const onPageChangeListener = (current: number, limit: number) => {
    setUnitCapacityListOptions((prevState) => ({
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
      setUnitCapacityListOptions((prevState) => ({
        ...prevState,
        order: sorter.field,
        sort: sorter.order === "ascend" ? "ASC" : ("DESC" as string),
      }));
    }
  };

  const onSearchChangeListener = (search?: string, searchBy?: string) => {
    setUnitCapacityListOptions((prevState: BaseType) => ({
      ...prevState,
      search,
      searchBy,
      page: 1,
    }));
  };

  const onSearchingChangeListener = (search?: string) => {
    setUnitCapacityAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      search,
    }));
  };

  const onClearSearchListener = () => {
    setUnitCapacityListOptions((prevState: BaseType) => ({
      ...prevState,
      search: null,
    }));
  };

  const handlerSelectSearchBy = (value?: string) => {
    setSearchBy(value!);
    setUnitCapacityListOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    setUnitCapacityAutoCompleteOptions((prevState: BaseType) => {
      if (prevState.search) {
        return {
          ...prevState,
          search: null,
        };
      }

      return prevState;
    });

    dispatch(unitDriverCapacityActions.getUnitCapacityAutoCompleteClear());
  };

  const handleOnChangeSelect = (value?: string) => {
    setUnitCapacityListOptions((prev) => ({
      ...prev,
      search: value,
    }));
  };

  useEffect(() => {
    dispatch(
      unitDriverCapacityActions.getUnitCapacityFetch({
        ...unitCapacityListOptions,
        ...filter,
        searchBy: unitCapacityListOptions?.search ? searchBy : undefined,
        search: unitCapacityListOptions.search || undefined,
      }),
    );

    return () => {
      dispatch(unitDriverCapacityActions.getUnitCapacityClear());
    };
  }, [unitCapacityListOptions, filter]);

  useEffect(() => {
    if (unitCapacityAutoCompleteOptions.search)
      dispatch(
        unitDriverCapacityActions.getUnitCapacityAutoCompleteFetch({
          ...unitCapacityAutoCompleteOptions,
          ...filter,
          searchBy,
        }),
      );

    return () => {
      dispatch(unitDriverCapacityActions.getUnitCapacityAutoCompleteClear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitCapacityAutoCompleteOptions]);

  useEffect(() => {
    dispatch(vehicleTypeActions.getDropdownVehicleTypesFetch({}));

    return () => {
      dispatch(vehicleTypeActions.getDropdownVehicleTypesClear());
    };
  }, []);

  return (
    <>
      <Table
        title={t("table.title")}
        columns={ColumnsUnit()?.filter(
          (_item) => _item?.exception || showColumns?.includes(_item?.key),
        )}
        dataSource={data}
        total={options?.totalData ?? 0}
        current={options?.page ?? 1}
        pageSize={options?.limit ?? 10}
        rowKey="no"
        loading={loading[unitDriverCapacityTypes.GET_UNIT_CAPACITY]}
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
                {UnitSearchByOptions().map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              {searchBy === "unitType" && (
                <Select
                  placeholder={t("table.search.unitPlaceholder")}
                  onChange={(value) => handleOnChangeSelect(value)}
                  onClear={() => handleOnChangeSelect(undefined)}
                  value={unitCapacityListOptions.search ?? undefined}
                  style={{ minWidth: "20rem" }}
                >
                  {unitTypeOptions?.map((opt) => (
                    <Select.Option key={opt.value} value={opt.label}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              )}
              {searchBy === "capacityStatus" && (
                <Select
                  placeholder={t("table.search.statusPlaceholder")}
                  onChange={(value) => handleOnChangeSelect(value)}
                  onClear={() => handleOnChangeSelect(undefined)}
                  value={unitCapacityListOptions.search ?? undefined}
                  style={{ minWidth: "20rem" }}
                >
                  {capacityStatuses?.data?.map((opt) => (
                    <Select.Option key={opt.id} value={opt.name}>
                      {opt.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
              {!["capacityStatus", "unitType"].includes(searchBy) && (
                <Input.Search
                  loading={false}
                  placeholder={t("table.search.placeholder")}
                  autoCompleteItems={autoComplete?.data}
                  onSearch={(search) =>
                    onSearchChangeListener(
                      search,
                      unitCapacityAutoCompleteOptions.searchBy ?? searchBy,
                    )
                  }
                  onSearching={(searching) =>
                    onSearchingChangeListener(searching)
                  }
                  onClear={onClearSearchListener}
                  value={unitCapacityAutoCompleteOptions.search ?? ""}
                />
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

export default UnitCapacityList;
