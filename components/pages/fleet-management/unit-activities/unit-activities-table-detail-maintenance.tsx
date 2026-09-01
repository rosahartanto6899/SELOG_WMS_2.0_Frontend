/* eslint-disable react-hooks/exhaustive-deps */
import { InsertRowAboveOutlined } from "@ant-design/icons";
import Button from "@sera-components/button";
import FilterDropdown from "@sera-components/filter-dropdown";
import { Plus } from "@sera-components/icons";
import Input from "@sera-components/input";
import Select from "@sera-components/select";
import Table from "@sera-components/table";
import { RootState } from "@sera-redux";
import { AutoCompleteType, BaseType } from "@sera-types/base.type";
import { LoadingState } from "@sera-types/loading.type";
import {
  Unit,
  UnitActivityState,
  unitActivityTypes,
} from "@sera-types/unit-activity";
import { ROUTE } from "@sera-utils/constants/routes";
import { Col, Row } from "antd";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import useGetPermissionFleetManagement from "../hooks/useGetPermission";
import {
  ColumnsDetailMaintenance,
  DETAIL_MAINTENANCE_DEFAULT_UNCHECK,
  DetailMaintenanceSearchByOptions,
} from "./unit-activities-props-table";

interface TableDetailMaintenanceProps {
  options: BaseType;
  onChangePagination: (_current: number, _limit: number) => void;
  onChangeSearchBy: (_value?: string) => void;
  onHandleSearching: (_search?: string) => void;
  onHandleSearch: (_search?: string) => void;
  onHandleClearSearch: () => void;

  loading: LoadingState;
  unitActivity: UnitActivityState;
}

const TableDetailMaintenance = ({
  options,
  onChangePagination,
  onChangeSearchBy,
  onHandleSearching,
  onHandleSearch,
  onHandleClearSearch,
  loading,
  unitActivity,
}: TableDetailMaintenanceProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitActivities.table.detailMaintenance",
  });

  const { isCreate } = useGetPermissionFleetManagement("unit-activities");

  const COLUMN_KEYS = ColumnsDetailMaintenance()?.filter(
    (_item) => !_item?.exception,
  );

  const [showColumns, setShowColumns] = useState<string[]>(
    COLUMN_KEYS?.map((_item) => _item?.key)?.filter(
      (_key) => !DETAIL_MAINTENANCE_DEFAULT_UNCHECK.includes(_key),
    ),
  );

  const renderFilter = useMemo(() => {
    if (options?.searchBy === "maintenanceLevel") {
      return (
        <Select
          id="maintenance-level-search"
          key="maintenance-level-search"
          style={{ width: 172 }}
          placeholder={t("placeholder.maintenanceLevel")}
          options={unitActivity?.maintenanceLevel?.data?.map((_level) => ({
            value: _level?.id,
            label: _level?.name,
          }))}
          onChange={(value) => onHandleSearch(value)}
          allowClear={false}
        />
      );
    }

    if (options?.searchBy === "status") {
      return (
        <Select
          id="maintenance-status-search"
          key="maintenance-status-search"
          style={{ width: 172 }}
          placeholder={t("placeholder.maintenanceStatus")}
          options={unitActivity?.maintenanceStatus?.data?.map((_level) => ({
            value: _level?.id,
            label: _level?.name,
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
        loading={loading[unitActivityTypes.GET_UNIT_AUTOCOMPLETE]}
        placeholder={t("placeholder.licensePlate")}
        autoCompleteItems={unitActivity?.autoComplete?.data ?? []}
        onSearch={(_search) => onHandleSearch(_search)}
        onSearching={(_search) => onHandleSearching(_search)}
        onClear={onHandleClearSearch}
      />
    );
  }, [options?.searchBy]);

  return (
    <Table
      title={t("title")}
      columns={ColumnsDetailMaintenance()?.filter(
        (_item) => _item?.exception || showColumns?.includes(_item?.key),
      )}
      dataSource={unitActivity?.data ?? []}
      total={unitActivity?.options?.totalData ?? 0}
      current={unitActivity?.options?.page ?? 1}
      pageSize={unitActivity?.options?.limit ?? 10}
      rowKey={(row: Unit) => `${row.no}`}
      onPageChange={onChangePagination}
      scroll={{ x: "max-content" }}
      loading={loading[unitActivityTypes.GET_UNIT]}
      isCustomSearch
      customSearch={
        <Row align="middle" gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Select
              id="unit-activity-search"
              style={{ width: 172 }}
              defaultValue="licensePlate"
              options={DetailMaintenanceSearchByOptions()}
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
                id="link-add-service-group"
                href={`${ROUTE.FLEET_MANAGEMENT.UNIT_ACTIVITIES}/add`}
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
  unitActivity: state.unitActivity,
});

export default connect(mapStateToProps)(TableDetailMaintenance);
