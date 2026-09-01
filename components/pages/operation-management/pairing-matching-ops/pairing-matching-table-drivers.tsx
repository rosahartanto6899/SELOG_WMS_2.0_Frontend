/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import {
  DEFAULT_SEARCH_DRIVERS,
  masterDataActions,
  pairingMatchingOpsActions as pairingMatchingActions,
  RootState,
} from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import { LoadingState } from "@sera-types/loading.type";
import { MasterDataState, masterDataTypes } from "@sera-types/master-data.type";
import {
  PairingMatchingState,
  pairingMatchingTypes,
  UnitParams,
  UnpairedDriver,
} from "@sera-types/pairing-matching-ops";
import { Col, Row } from "antd";
import { cloneDeep } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import {
  ColumnsDrivers,
  DriversSearchByOptions,
} from "./pairing-matching-props-table";

const AUTOCOMPLETE = { searchBy: DEFAULT_SEARCH_DRIVERS, page: 1, limit: 10 };

interface TableDriversProps {
  params: UnitParams;
  data: Record<string, any>;
  onSelectData: (_value: any, _index?: number) => void;

  loading: LoadingState;
  masterData: MasterDataState;
  pairingMatching: PairingMatchingState;
  getUnpairedDriver: typeof pairingMatchingActions.getUnpairedDriverFetch;
  getACUnpairedDriver: typeof pairingMatchingActions.getACUnpairedDriverFetch;
  getACUnpairedDriverClear: typeof pairingMatchingActions.getACUnpairedDriverClear;
  getDriverCapacityStatuses: typeof masterDataActions.getDriverCapacityStatusesFetch;
  getEmployeeStatuses: typeof masterDataActions.getEmployeeStatusesFetch;
  getTierLevels: typeof masterDataActions.getTierLevelsFetch;
}

const TableDrivers = ({
  params,
  data,
  onSelectData,
  loading,
  masterData,
  pairingMatching,
  getUnpairedDriver,
  getACUnpairedDriver,
  getACUnpairedDriverClear,
  getDriverCapacityStatuses,
  getEmployeeStatuses,
  getTierLevels,
}: TableDriversProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatchingOps.table.drivers",
  });

  const [isSkipFetch, setIsSkipFetch] = useState(false);
  const [options, setOptions] = useState<BaseType>({ page: 1, limit: 10 });
  const [autoComplete, setAutoComplete] = useState<BaseType>(AUTOCOMPLETE);

  const onChangePagination = (_current: number, _limit: number) => {
    setOptions((_prev) => ({ ..._prev, page: _current, limit: _limit }));
  };

  const onChangeSearchBy = (_value?: string) => {
    setIsSkipFetch(true);

    setOptions((_prev) => ({ ..._prev, searchBy: _value, search: null }));
    setAutoComplete((_prev) => ({ ..._prev, searchBy: _value, search: null }));

    getACUnpairedDriverClear();
  };

  const onHandleSearch = (_search?: string) => {
    setOptions((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH_DRIVERS,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleSearching = (_search?: string) => {
    setAutoComplete((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH_DRIVERS,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleClearSearch = () => {
    setOptions((_prev) => ({ ..._prev, search: null }));
  };

  useEffect(() => {
    getDriverCapacityStatuses();
    getEmployeeStatuses();
    getTierLevels();
  }, []);

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);
    const tempParams = cloneDeep(params);
    delete tempParams.unitTypeId;

    getUnpairedDriver({
      payload: { ...options, ...tempParams },
      customerId: data?.customerId,
      originId: data?.originId,
    });
  }, [
    options,
    params?.area,
    params?.branchId,
    data?.customerId,
    data?.originId,
  ]);

  useEffect(() => {
    if (autoComplete.search) {
      getACUnpairedDriver({
        payload: { ...autoComplete, ...params },
        customerId: data?.customerId,
        originId: data?.originId,
      });
    }
  }, [
    autoComplete,
    params?.area,
    params?.branchId,
    data?.customerId,
    data?.originId,
  ]);

  const renderFilter = useMemo(() => {
    if (options?.searchBy === "employeeStatus") {
      return (
        <Select
          id={`${options?.searchBy}-search`}
          key={`${options?.searchBy}-search`}
          style={{ width: 172 }}
          placeholder={t(`placeholder.${options?.searchBy ?? "default"}`)}
          options={masterData?.getEmployeeStatuses?.data?.map((_status) => ({
            value: _status?.name,
            label: _status?.name,
          }))}
          onChange={(_value) => onHandleSearch(_value)}
          loading={loading[masterDataTypes.GET_EMPLOYEE_STATUSES]}
          disabled={loading[masterDataTypes.GET_EMPLOYEE_STATUSES]}
          allowClear={false}
        />
      );
    }

    if (options?.searchBy === "tier") {
      return (
        <Select
          id={`${options?.searchBy}-search`}
          key={`${options?.searchBy}-search`}
          style={{ width: 172 }}
          placeholder={t(`placeholder.${options?.searchBy ?? "default"}`)}
          options={masterData?.getTierLevels?.data?.map((_level) => ({
            value: _level?.name,
            label: _level?.name,
          }))}
          onChange={(_value) => onHandleSearch(_value)}
          loading={loading[masterDataTypes.GET_TIER_LEVELS]}
          disabled={loading[masterDataTypes.GET_TIER_LEVELS]}
          allowClear={false}
        />
      );
    }

    return (
      <Input.Search
        id={`${options?.searchBy}-search`}
        key={`${options?.searchBy}-search`}
        value={options?.search ?? undefined}
        style={{ width: 172 }}
        loading={loading[pairingMatchingTypes.GET_AC_UNPAIRED_DRIVER]}
        placeholder={t(`placeholder.${options?.searchBy ?? "default"}`)}
        autoCompleteItems={pairingMatching?.getACUnpairedDriver?.data ?? []}
        onSearch={(_search) => onHandleSearch(_search)}
        onSearching={(_search) => onHandleSearching(_search)}
        onClear={onHandleClearSearch}
      />
    );
  }, [
    options?.searchBy,
    pairingMatching?.getACUnpairedDriver?.data,
    masterData?.getEmployeeStatuses?.data,
  ]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsDrivers({
        statuses: masterData?.getDriverCapacityStatuses?.data ?? [],
      })}
      dataSource={pairingMatching?.getUnpairedDriver?.data ?? []}
      total={pairingMatching?.getUnpairedDriver?.options?.totalData ?? 0}
      current={pairingMatching?.getUnpairedDriver?.options?.page ?? 1}
      pageSize={pairingMatching?.getUnpairedDriver?.options?.limit ?? 10}
      rowKey={(row: UnpairedDriver) => `${row.no}`}
      onPageChange={onChangePagination}
      onRowClick={onSelectData}
      scroll={{ x: "max-content" }}
      loading={loading[pairingMatchingTypes.GET_UNPAIRED_DRIVER]}
      rowClassName={(_record: UnpairedDriver) => {
        if (_record?.id === data?.driverId1) return "data-selected";
        if (_record?.id === data?.driverId2) return "data-selected";
        return "";
      }}
      showLessItems
      isCustomSearch
      customSearch={
        <Row align="middle" gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Select
              id="pairing-matching-drivers-search"
              style={{ width: 172 }}
              defaultValue={DEFAULT_SEARCH_DRIVERS}
              options={DriversSearchByOptions()}
              onChange={(value) => onChangeSearchBy(value)}
              onClear={() => onChangeSearchBy("")}
              allowClear={false}
            />
          </Col>

          <Col xs={24} md={12}>
            {renderFilter}
          </Col>
        </Row>
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  masterData: state.masterData,
  pairingMatching: state.pairingMatchingOps,
});

const mapDispatchToProps = {
  getUnpairedDriver: pairingMatchingActions.getUnpairedDriverFetch,
  getACUnpairedDriver: pairingMatchingActions.getACUnpairedDriverFetch,
  getACUnpairedDriverClear: pairingMatchingActions.getACUnpairedDriverClear,
  getDriverCapacityStatuses: masterDataActions.getDriverCapacityStatusesFetch,
  getEmployeeStatuses: masterDataActions.getEmployeeStatusesFetch,
  getTierLevels: masterDataActions.getTierLevelsFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableDrivers);
