/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterDropdown from "@sera-components/filter-dropdown";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import { masterDataActions, RootState } from "@sera-redux";
import {
  DEFAULT_SEARCH,
  journeyHistoryActions,
} from "@sera-redux/slices/journey-history.slice";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import {
  FilterParams,
  JourneyHistoryState,
  journeyHistoryType,
  JourneyList,
} from "@sera-types/journey-history.type";
import { LoadingState } from "@sera-types/loading.type";
import { MasterDataState } from "@sera-types/master-data.type";
import { Col, Row } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import {
  ColumnsShipment,
  ShipmentSearchByOptions,
  UNCHECK_SHIPMENT_KEYS,
} from "./journey-history-props-table";

const AUTOCOMPLETE = { searchBy: DEFAULT_SEARCH, page: 1, limit: 10 };

interface TableShipmentProps {
  params: FilterParams;

  loading: LoadingState;
  journeyHistory: JourneyHistoryState;
  masterData: MasterDataState;
  getJourneyList: typeof journeyHistoryActions.getJourneyListFetch;
  getACJourneyList: typeof journeyHistoryActions.getACJourneyListFetch;
  getACJourneyListClear: typeof journeyHistoryActions.getACJourneyListClear;
  getJourneyStatuses: typeof masterDataActions.getJourneyStatusesFetch;
}

const TableShipment = ({
  params,
  loading,
  journeyHistory,
  masterData,
  getJourneyList,
  getACJourneyList,
  getACJourneyListClear,
  getJourneyStatuses,
}: TableShipmentProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "journeyHistory.table.shipment",
  });

  const COLUMN_KEYS = ColumnsShipment({})?.filter((_item) => !_item?.exception);

  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !UNCHECK_SHIPMENT_KEYS.includes(_key),
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

    getACJourneyListClear();
  };

  const onHandleSearch = (_search?: string) => {
    setOptions((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleSearching = (_search?: string) => {
    setAutoComplete((_prev) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? DEFAULT_SEARCH,
      search: _search || null,
      page: 1,
    }));
  };

  const onHandleClearSearch = () => {
    setOptions((_prev) => ({ ..._prev, search: null }));
  };

  useEffect(() => {
    getJourneyStatuses();
    getACJourneyListClear();
  }, []);

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);
    getJourneyList({ ...options, ...params });
  }, [options, params]);

  useEffect(() => {
    if (autoComplete.search) getACJourneyList({ ...autoComplete, ...params });
  }, [autoComplete, params]);

  const renderFilter = useMemo(() => {
    return (
      <Input.Search
        id={`${options?.searchBy}-search`}
        key={`${options?.searchBy}-search`}
        value={options?.search ?? undefined}
        style={{ width: 172 }}
        loading={loading[journeyHistoryType.GET_AC_JOURNEY_LIST]}
        placeholder={t(`placeholder.${options?.searchBy ?? "default"}`)}
        autoCompleteItems={journeyHistory?.getACJourneyList?.data ?? []}
        onSearch={(_search) => onHandleSearch(_search)}
        onSearching={(_search) => onHandleSearching(_search)}
        onClear={onHandleClearSearch}
      />
    );
  }, [options?.searchBy, journeyHistory?.getACJourneyList?.data]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsShipment({
        statuses: masterData?.getJourneyStatuses?.data ?? [],
      })?.filter(
        (_item) => _item?.exception || showColumns?.includes(_item?.key),
      )}
      dataSource={journeyHistory?.getJourneyList?.data ?? []}
      total={journeyHistory?.getJourneyList?.options?.totalData ?? 0}
      current={journeyHistory?.getJourneyList?.options?.page ?? 1}
      pageSize={journeyHistory?.getJourneyList?.options?.limit ?? 10}
      rowKey={(row: JourneyList) => `${row.no}`}
      onPageChange={onChangePagination}
      scroll={{ x: "max-content" }}
      loading={loading[journeyHistoryType.GET_JOURNEY_LIST]}
      isCustomSearch
      customSearch={
        <Row align="middle" gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Select
              id="journey-history-shipment-search"
              style={{ width: 172 }}
              defaultValue={DEFAULT_SEARCH}
              options={ShipmentSearchByOptions()}
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
  journeyHistory: state.journeyHistory,
  masterData: state.masterData,
});

const mapDispatchToProps = {
  getJourneyList: journeyHistoryActions.getJourneyListFetch,
  getACJourneyList: journeyHistoryActions.getACJourneyListFetch,
  getACJourneyListClear: journeyHistoryActions.getACJourneyListClear,
  getJourneyStatuses: masterDataActions.getJourneyStatusesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableShipment);
