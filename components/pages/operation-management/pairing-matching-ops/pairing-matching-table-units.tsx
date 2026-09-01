/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import {
  DEFAULT_SEARCH_UNITS,
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
  UnpairedUnit,
} from "@sera-types/pairing-matching-ops";
import { Col, Row } from "antd";
import { cloneDeep } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import {
  ColumnsUnits,
  UnitsSearchByOptions,
} from "./pairing-matching-props-table";

const AUTOCOMPLETE = { searchBy: DEFAULT_SEARCH_UNITS, page: 1, limit: 10 };

interface TableUnitsProps {
  params: UnitParams;
  data: Record<string, any>;
  onSelectData: (_value: any, _index?: number) => void;

  loading: LoadingState;
  masterData: MasterDataState;
  pairingMatching: PairingMatchingState;
  getUnpairedUnit: typeof pairingMatchingActions.getUnpairedUnitFetch;
  getACUnpairedUnit: typeof pairingMatchingActions.getACUnpairedUnitFetch;
  getACUnpairedUnitClear: typeof pairingMatchingActions.getACUnpairedUnitClear;
}

const TableUnits = ({
  params,
  data,
  onSelectData,
  loading,
  masterData,
  pairingMatching,
  getUnpairedUnit,
  getACUnpairedUnit,
  getACUnpairedUnitClear,
}: TableUnitsProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.table.units",
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

    getACUnpairedUnitClear();
  };

  const onHandleSearch = (_search?: string) => {
    setOptions((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH_UNITS,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleSearching = (_search?: string) => {
    setAutoComplete((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH_UNITS,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleClearSearch = () => {
    setOptions((_prev) => ({ ..._prev, search: null }));
  };

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);
    const tempParams = cloneDeep(params);
    delete tempParams.area;

    getUnpairedUnit({
      payload: { ...options, ...tempParams },
      customerId: data?.customerId,
      originId: data?.originId,
    });
  }, [
    options,
    params?.unitTypeId,
    params?.branchId,
    data?.customerId,
    data?.originId,
  ]);

  useEffect(() => {
    if (autoComplete.search)
      getACUnpairedUnit({
        payload: { ...autoComplete, ...params },
        customerId: data?.customerId,
        originId: data?.originId,
      });
  }, [autoComplete, params, data?.customerId, data?.originId]);

  const renderFilter = useMemo(() => {
    if (options?.searchBy === "status") {
      return (
        <Select
          id={`${options?.searchBy}-search`}
          key={`${options?.searchBy}-search`}
          style={{ width: 172 }}
          placeholder={t(`placeholder.${options?.searchBy ?? "default"}`)}
          options={masterData?.getUnitCapacityStatuses?.data?.map(
            (_status) => ({
              value: _status?.name,
              label: _status?.name,
            }),
          )}
          onChange={(_value) => onHandleSearch(_value)}
          loading={loading[masterDataTypes.GET_UNIT_CAPACITY_STATUSES]}
          disabled={loading[masterDataTypes.GET_UNIT_CAPACITY_STATUSES]}
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
        loading={loading[pairingMatchingTypes.GET_AC_UNPAIRED_UNIT]}
        placeholder={t(`placeholder.${options?.searchBy ?? "default"}`)}
        autoCompleteItems={pairingMatching?.getACUnpairedUnit?.data ?? []}
        onSearch={(_search) => onHandleSearch(_search)}
        onSearching={(_search) => onHandleSearching(_search)}
        onClear={onHandleClearSearch}
      />
    );
  }, [options?.searchBy, pairingMatching?.getACUnpairedUnit?.data]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsUnits({
        statuses: masterData?.getUnitCapacityStatuses?.data ?? [],
      })}
      dataSource={pairingMatching?.getUnpairedUnit?.data ?? []}
      total={pairingMatching?.getUnpairedUnit?.options?.totalData ?? 0}
      current={pairingMatching?.getUnpairedUnit?.options?.page ?? 1}
      pageSize={pairingMatching?.getUnpairedUnit?.options?.limit ?? 10}
      rowKey={(row: UnpairedUnit) => `${row.no}`}
      onPageChange={onChangePagination}
      onRowClick={onSelectData}
      scroll={{ x: "max-content" }}
      loading={loading[pairingMatchingTypes.GET_UNPAIRED_UNIT]}
      rowClassName={(_record: UnpairedUnit) => {
        if (_record?.id === data?.vehicleId) return "data-selected";
        return "";
      }}
      showLessItems
      isCustomSearch
      customSearch={
        <Row align="middle" gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Select
              id="pairing-matching-units-search"
              style={{ width: 172 }}
              defaultValue={DEFAULT_SEARCH_UNITS}
              options={UnitsSearchByOptions()}
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
  getUnpairedUnit: pairingMatchingActions.getUnpairedUnitFetch,
  getACUnpairedUnit: pairingMatchingActions.getACUnpairedUnitFetch,
  getACUnpairedUnitClear: pairingMatchingActions.getACUnpairedUnitClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableUnits);
