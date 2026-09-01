/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InsertRowAboveOutlined } from "@ant-design/icons";
import FilterDropdown from "@sera-components/filter-dropdown";
import { AddListIcon, Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import {
  RootState,
  stockManagementActions,
  unitActivityActions,
} from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { LoadingState } from "@sera-types/loading.type";
import {
  StockManagement,
  StockManagementState,
  stockManagementTypes,
} from "@sera-types/stock-management.type";
import { UnitActivityState } from "@sera-types/unit-activity";
import { ROUTE } from "@sera-utils/constants/routes";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Button, Col, Row } from "antd";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import useGetPermissionFleetManagement from "../hooks/useGetPermission";
import {
  ColumnsStockUnit,
  STOCK_UNIT_DEFAULT_UNCHECK,
  StockUnitSearchByOptions,
} from "./stock-management-props-table";

interface TableStockUnitProps {
  options: BaseType;
  onChangePagination: (_current: number, _limit: number) => void;
  onTableChangeListener: (_: any, __: any, _sorter: any) => void;
  onChangeSearchBy: (_value?: string) => void;
  onHandleSearching: (_search?: string) => void;
  onHandleSearch: (_search?: string) => void;
  onHandleClearSearch: () => void;

  loading: LoadingState;
  stockManagement: StockManagementState;
  unitActivity: UnitActivityState;
  getStockInlineSuccess: typeof stockManagementActions.getStockInlineSuccess;
  getLastLocation: typeof unitActivityActions.getLastLocationFetch;
  stockStatus: typeof stockManagementActions.stockStatusFetch;
  getLastLocationClear: typeof unitActivityActions.getLastLocationClear;
}

const TableStockUnit = ({
  options,
  onChangePagination,
  onTableChangeListener,
  onChangeSearchBy,
  onHandleSearching,
  onHandleSearch,
  onHandleClearSearch,

  loading,
  stockManagement,
  unitActivity,
  getStockInlineSuccess,
  getLastLocation,
  stockStatus,
  getLastLocationClear,
}: TableStockUnitProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "stockManagement.table",
  });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/stock-management/stock-unit");

  const { isCreate, isUpdate } =
    useGetPermissionFleetManagement("stock-management");

  const COLUMN_KEYS = ColumnsStockUnit({})?.filter(
    (_item) => !_item?.exception,
  );

  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !STOCK_UNIT_DEFAULT_UNCHECK.includes(_key),
    ),
  );

  const refetchLastLocation = (_vin: string) => {
    if (!_vin) return;
    getLastLocation({ vin: _vin });
  };

  const renderFilter = useMemo(() => {
    if (options?.searchBy === "hasObd") {
      return (
        <Select
          id="has-obd-search"
          key="has-obd-search"
          style={{ width: 172 }}
          placeholder={t("placeholder.hasObd")}
          options={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          onChange={(value) => onHandleSearch(value)}
          allowClear={false}
        />
      );
    }

    if (
      options?.searchBy === "maintenanceStatus" ||
      options?.searchBy === "licenseStatus" ||
      options?.searchBy === "kirStatus"
    ) {
      return (
        <Select
          id={`${options?.searchBy}-search`}
          key={`${options?.searchBy}-search`}
          style={{ width: 172 }}
          placeholder={t(`placeholder.${options?.searchBy}`)}
          options={stockManagement?.stockStatus?.data?.map((_item) => ({
            value: _item?.id,
            label: _item?.name,
          }))}
          onChange={(value) => onHandleSearch(value)}
          allowClear={false}
        />
      );
    }

    return (
      <Input.Search
        id="license-plate-search"
        key="license-plate-search"
        style={{ width: 172 }}
        loading={loading[stockManagementTypes.GET_STOCK_AUTOCOMPLETE]}
        placeholder={t("placeholder.licensePlate")}
        autoCompleteItems={stockManagement?.autoComplete?.data ?? []}
        onSearch={(_search) => onHandleSearch(_search)}
        onSearching={(_search) => onHandleSearching(_search)}
        onClear={onHandleClearSearch}
      />
    );
  }, [options?.searchBy, stockManagement?.stockStatus?.data]);

  useEffect(() => {
    try {
      stockStatus();
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 123, error);
      else sendErrorHandler("useEffect", 123, error?.data?.message);
    }
  }, []);

  useEffect(() => {
    if (isEmpty(unitActivity?.lastLocation?.data)) return;

    getStockInlineSuccess(unitActivity?.lastLocation?.data);
    getLastLocationClear();
  }, [unitActivity?.lastLocation?.data]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsStockUnit({
        loading,
        refetchLastLocation,
        activeVin: unitActivity?.lastLocation?.payload?.vin,
      })?.filter(
        (_item) => _item?.exception || showColumns?.includes(_item?.key),
      )}
      dataSource={stockManagement?.data || []}
      total={stockManagement?.options?.totalData || 0}
      current={stockManagement?.options?.page || 1}
      pageSize={stockManagement?.options?.limit || 10}
      rowKey={(row: StockManagement) => `${row.no}`}
      onPageChange={onChangePagination}
      onTableChange={onTableChangeListener}
      scroll={{ x: "max-content" }}
      loading={loading[stockManagementTypes.GET_STOCK]}
      rowClassName={(_record) => {
        const STATUS_KEYS = ["maintenanceStatus", "licenseStatus", "kirStatus"];

        const _isExpired = STATUS_KEYS.some(
          (key) => _record?.[key]?.toLowerCase() === "expired",
        );

        const _isAttention = STATUS_KEYS.some(
          (key) => _record?.[key]?.toLowerCase() === "attention",
        );

        if (_isExpired) return "data-error";
        if (_isAttention) return "data-warning";
        return "";
      }}
      isCustomSearch
      customSearch={
        <Row align="middle" gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Select
              id="stock-management-search"
              style={{ width: 172 }}
              defaultValue="licensePlate"
              options={StockUnitSearchByOptions()}
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
        <Row gutter={[16, 16]}>
          {isCreate ? (
            <Col>
              <Link
                id="link-add-service-group"
                href={`${ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT}/add`}
                passHref
              >
                <Button id="action-add" type="primary" icon={<Plus />}>
                  {t("button.add")}
                </Button>
              </Link>
            </Col>
          ) : null}

          {isCreate && isUpdate ? (
            <Col>
              <Link
                id="link-upsert-service-group"
                href={`${ROUTE.FLEET_MANAGEMENT.STOCK_MANAGEMENT}/upsert`}
                passHref
              >
                <Button
                  id="action-upsert"
                  type="primary"
                  icon={<AddListIcon />}
                >
                  {t("button.upsert")}
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
  stockManagement: state.stockManagement,
  unitActivity: state.unitActivity,
});

const mapDispatchToProps = {
  getStockInlineSuccess: stockManagementActions.getStockInlineSuccess,
  getLastLocation: unitActivityActions.getLastLocationFetch,
  stockStatus: stockManagementActions.stockStatusFetch,
  getLastLocationClear: unitActivityActions.getLastLocationClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableStockUnit);
