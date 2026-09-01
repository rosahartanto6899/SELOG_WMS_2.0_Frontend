/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import {
  DEFAULT_SEARCH_DEMANDS,
  masterDataActions,
  pairingMatchingActions,
  RootState,
} from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { LoadingState } from "@sera-types/loading.type";
import { MasterDataState, masterDataTypes } from "@sera-types/master-data.type";
import {
  Demands,
  PairingMatchingState,
  pairingMatchingTypes,
  UnitParams,
} from "@sera-types/pairing-matching";
import { Col, DatePicker, Row } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import {
  ColumnsDemands,
  DemandsSearchByOptions,
  UNCHECK_DEMANDS_KEYS,
} from "./pairing-matching-props-table";

const AUTOCOMPLETE = { searchBy: DEFAULT_SEARCH_DEMANDS, page: 1, limit: 10 };

interface TableDemandsProps {
  params: UnitParams;
  data: Record<string, any>;
  onSelectData: (_value: Demands, _index?: number) => void;

  loading: LoadingState;
  masterData: MasterDataState;
  pairingMatching: PairingMatchingState;
  getDemands: typeof pairingMatchingActions.getDemandsFetch;
  getACDemands: typeof pairingMatchingActions.getACDemandsFetch;
  getACDemandsClear: typeof pairingMatchingActions.getACDemandsClear;
  getOrderPriorities: typeof masterDataActions.getOrderPrioritiesFetch;
}

const TableDemands = ({
  params,
  data,
  onSelectData,
  loading,
  masterData,
  pairingMatching,
  getDemands,
  getACDemands,
  getACDemandsClear,
  getOrderPriorities,
}: TableDemandsProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "pairingMatching.table.demands",
  });

  const COLUMN_KEYS = ColumnsDemands()?.filter((_item) => !_item?.exception);

  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !UNCHECK_DEMANDS_KEYS.includes(_key),
    ),
  );
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

    getACDemandsClear();
  };

  const onHandleSearch = (_search?: string) => {
    setOptions((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH_DEMANDS,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleSearching = (_search?: string) => {
    setAutoComplete((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH_DEMANDS,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleClearSearch = () => {
    setOptions((_prev) => ({ ..._prev, search: null }));
  };

  useEffect(() => {
    getOrderPriorities();
    getACDemandsClear();
  }, []);

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);
    getDemands({ ...options, ...params });
  }, [options, params]);

  useEffect(() => {
    if (autoComplete.search) getACDemands({ ...autoComplete, ...params });
  }, [autoComplete, params]);

  useEffect(() => {
    if (isEmpty(pairingMatching?.pairingProcess?.data)) return;
    getDemands({ ...options, ...params });
    getACDemandsClear();
  }, [pairingMatching?.pairingProcess?.data, options, params]);

  const renderFilter = useMemo(() => {
    if (options?.searchBy === "pickupDate") {
      return (
        <DatePicker
          id={`${options?.searchBy}-search`}
          key={`${options?.searchBy}-search`}
          style={{ width: 172, borderRadius: 20 }}
          placeholder={t(`placeholder.${options?.searchBy ?? "default"}`)}
          onChange={(_value) => onHandleSearch(_value?.format("YYYY-MM-DD"))}
        />
      );
    }

    if (options?.searchBy === "priority") {
      return (
        <Select
          id={`${options?.searchBy}-search`}
          key={`${options?.searchBy}-search`}
          style={{ width: 172 }}
          placeholder={t(`placeholder.${options?.searchBy ?? "default"}`)}
          options={masterData?.getOrderPriorities?.data?.map((_priority) => ({
            value: _priority?.name,
            label: _priority?.name,
          }))}
          onChange={(_value) => onHandleSearch(_value)}
          loading={loading[masterDataTypes.GET_ORDER_PRIORITIES]}
          disabled={loading[masterDataTypes.GET_ORDER_PRIORITIES]}
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
        loading={loading[pairingMatchingTypes.GET_AC_DEMANDS]}
        placeholder={t(`placeholder.${options?.searchBy ?? "default"}`)}
        autoCompleteItems={pairingMatching?.getACDemands?.data ?? []}
        onSearch={(_search) => onHandleSearch(_search)}
        onSearching={(_search) => onHandleSearching(_search)}
        onClear={onHandleClearSearch}
      />
    );
  }, [options?.searchBy, pairingMatching?.getACDemands?.data]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsDemands()?.filter(
        (_item) => _item?.exception || showColumns?.includes(_item?.key),
      )}
      dataSource={pairingMatching?.getDemands?.data ?? []}
      total={pairingMatching?.getDemands?.options?.totalData ?? 0}
      current={pairingMatching?.getDemands?.options?.page ?? 1}
      pageSize={pairingMatching?.getDemands?.options?.limit ?? 10}
      rowKey={(row: Demands) => `${row.no}`}
      onPageChange={onChangePagination}
      onRowClick={onSelectData}
      scroll={{ x: "max-content" }}
      loading={loading[pairingMatchingTypes.GET_DEMANDS]}
      rowClassName={(_record: Demands) => {
        if (_record?.id === data?.id) return "data-selected";
        return "";
      }}
      isCustomSearch
      customSearch={
        <Row align="middle" gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Select
              id="pairing-matching-demands-search"
              style={{ width: 172 }}
              defaultValue={DEFAULT_SEARCH_DEMANDS}
              options={DemandsSearchByOptions()}
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
      actions={
        <Row gutter={[16, 4]}>
          <Col>
            <FilterDropdown
              buttonLabel={t("button.config")}
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
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
  masterData: state.masterData,
  pairingMatching: state.pairingMatching,
});

const mapDispatchToProps = {
  getDemands: pairingMatchingActions.getDemandsFetch,
  getACDemands: pairingMatchingActions.getACDemandsFetch,
  getACDemandsClear: pairingMatchingActions.getACDemandsClear,
  getOrderPriorities: masterDataActions.getOrderPrioritiesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableDemands);
