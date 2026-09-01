/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { InsertRowAboveOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import FilterDropdown from "@sera-components/filter-dropdown";
import { Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import { masterDataActions, RootState, useAppSelector } from "@sera-redux";
import {
  DEFAULT_SEARCH,
  vodActions,
} from "@sera-redux/slices/voice-of-driver.slice";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { LoadingState } from "@sera-types/loading.type";
import { MasterDataState, masterDataTypes } from "@sera-types/master-data.type";
import {
  ListParams,
  VoDList,
  VoDState,
  vodTypes,
} from "@sera-types/voice-of-driver.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { Col, Row } from "antd";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import useGetPermission from "../hooks/useGetPermission";
import {
  ColumnsShipment,
  SearchByOptions,
  UNCHECK_SHIPMENT_KEYS,
} from "./vod-props-table";

const AUTOCOMPLETE = { searchBy: DEFAULT_SEARCH, page: 1, limit: 10 };

interface VoDTableProps {
  params: ListParams;

  loading: LoadingState;
  vod: VoDState;
  masterData: MasterDataState;
  getVoDList: typeof vodActions.getVoDListFetch;
  getACVoDList: typeof vodActions.getACVoDListFetch;
  getACVoDListClear: typeof vodActions.getACVoDListClear;
  getVoDCategories: typeof masterDataActions.getVoDCategoriesFetch;
}

const VoDTable = ({
  params,
  loading,
  vod,
  masterData,
  getVoDList,
  getACVoDList,
  getACVoDListClear,
  getVoDCategories,
}: VoDTableProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "vod.table",
  });

  const {
    getVoDTypes: { data: dropdownVodTypes },
  } = useAppSelector((state) => state.masterData);

  const COLUMN_KEYS = ColumnsShipment({})?.filter((_item) => !_item?.exception);
  const { isCreate } = useGetPermission("voice-of-driver");

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

    getACVoDListClear();
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
    getVoDCategories();
    getACVoDListClear();
  }, []);

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);
    getVoDList({ ...options, ...params });
  }, [options, params]);

  useEffect(() => {
    if (autoComplete.search) getACVoDList({ ...autoComplete, ...params });
  }, [autoComplete, params]);

  const renderFilter = useMemo(() => {
    if (options?.searchBy === "category") {
      return (
        <Select
          id={`${options?.searchBy}-search`}
          key={`${options?.searchBy}-search`}
          style={{ width: 172 }}
          placeholder={t(`placeholder.${options?.searchBy ?? "default"}`)}
          options={masterData?.getVoDCategories?.data?.map((_category) => ({
            value: _category?.name,
            label: _category?.name,
          }))}
          onChange={(_value) => onHandleSearch(_value)}
          loading={loading[masterDataTypes.GET_VOD_CATEGORIES]}
          disabled={loading[masterDataTypes.GET_VOD_CATEGORIES]}
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
        loading={loading[vodTypes.GET_AC_VOD_LIST]}
        placeholder={t(`placeholder.${options?.searchBy ?? "default"}`)}
        autoCompleteItems={vod?.getACVoDList?.data ?? []}
        onSearch={(_search) => onHandleSearch(_search)}
        onSearching={(_search) => onHandleSearching(_search)}
        onClear={onHandleClearSearch}
      />
    );
  }, [options?.searchBy, vod?.getACVoDList?.data]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsShipment({
        vodTypes: dropdownVodTypes,
      })?.filter(
        (_item) => _item?.exception || showColumns?.includes(_item?.key),
      )}
      dataSource={vod?.getVoDList?.data ?? []}
      total={vod?.getVoDList?.options?.totalData ?? 0}
      current={vod?.getVoDList?.options?.page ?? 1}
      pageSize={vod?.getVoDList?.options?.limit ?? 10}
      rowKey={(row: VoDList) => `${row.no}`}
      onPageChange={onChangePagination}
      scroll={{ x: "max-content" }}
      loading={loading[vodTypes.GET_VOD_LIST]}
      isCustomSearch
      customSearch={
        <Row align="middle" gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Select
              id="vod-search"
              style={{ width: 172 }}
              defaultValue={DEFAULT_SEARCH}
              options={SearchByOptions()}
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
          {isCreate ? (
            <Col>
              <Link
                id="link-add-vod"
                href={`${ROUTE.JOURNEY_MANAGEMENT.VOD}/add`}
                passHref
              >
                <Button id="action-add" type="primary" icon={<Plus />}>
                  {t("button.add")}
                </Button>
              </Link>
            </Col>
          ) : null}

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
  vod: state.vod,
  masterData: state.masterData,
});

const mapDispatchToProps = {
  getVoDList: vodActions.getVoDListFetch,
  getACVoDList: vodActions.getACVoDListFetch,
  getACVoDListClear: vodActions.getACVoDListClear,
  getVoDCategories: masterDataActions.getVoDCategoriesFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(VoDTable);
