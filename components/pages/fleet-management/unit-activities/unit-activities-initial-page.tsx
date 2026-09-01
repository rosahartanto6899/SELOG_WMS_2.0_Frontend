/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@sera-components/card";
import MessageHandler from "@sera-libraries/message-handler";
import { RootState, unitActivityActions } from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import { UnitActivityState, UnitParams } from "@sera-types/unit-activity";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Flex } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import UnitActivitiesFilters from "./unit-activities-filters";
import UnitActivitiesSummary from "./unit-activities-summary";
import TableDetailMaintenance from "./unit-activities-table-detail-maintenance";
import TableForecastUnit from "./unit-activities-table-forecast-unit";
import TableMaintenanceStatus from "./unit-activities-table-maintenance-status";

interface UnitActivitiesInitialPageProps {
  unitActivity: UnitActivityState;
  getUnit: typeof unitActivityActions.getUnitFetch;
  getUnitAutoComplete: typeof unitActivityActions.getUnitAutoCompleteFetch;
  getSummary: typeof unitActivityActions.getSummaryFetch;
  getMaintenanceLevel: typeof unitActivityActions.getMaintenanceLevelFetch;
  getMaintenanceStatus: typeof unitActivityActions.getMaintenanceStatusFetch;
  getUnitAutoCompleteClear: typeof unitActivityActions.getUnitAutoCompleteClear;
  createMaintenanceClear: typeof unitActivityActions.createMaintenanceClear;
  updateMaintenanceClear: typeof unitActivityActions.updateMaintenanceClear;
  getUnitDetailClear: typeof unitActivityActions.getUnitDetailClear;
  getLocationCountClear: typeof unitActivityActions.getLocationCountClear;
}

const UnitActivitiesInitialPage = ({
  unitActivity,
  getUnit,
  getUnitAutoComplete,
  getSummary,
  getMaintenanceLevel,
  getMaintenanceStatus,
  getUnitAutoCompleteClear,
  createMaintenanceClear,
  updateMaintenanceClear,
  getUnitDetailClear,
  getLocationCountClear,
}: UnitActivitiesInitialPageProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "unitActivities",
  });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/unit-activities/index");

  const [isSkipFetch, setIsSkipFetch] = useState(false);

  const [params, setParams] = useState<UnitParams>({
    branchId: [],
    unitTypeId: [],
  });
  const [unitOptions, setUnitOptions] = useState<BaseType>({
    page: 1,
    limit: 10,
  });
  const [unitAutoCompleteOptions, setUnitAutoCompleteOptions] =
    useState<BaseType>({
      searchBy: "licensePlate",
      page: 1,
      limit: 10,
    });

  const onChangeFilter = (_val: UnitParams) => {
    setParams((_prev) => ({
      branchId: _val?.branchId ?? _prev?.branchId,
      unitTypeId: _val?.unitTypeId ?? _prev?.unitTypeId,
    }));
  };

  const onChangePagination = (_current: number, _limit: number) => {
    setUnitOptions((_prevState) => ({
      ..._prevState,
      page: _current,
      limit: _limit,
    }));
  };

  const onChangeSearchBy = (_value?: string) => {
    setIsSkipFetch(true);

    setUnitOptions((_prev: BaseType) => ({
      ..._prev,
      searchBy: _value,
      search: null,
    }));

    setUnitAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy: _value,
      search: null,
    }));

    getUnitAutoCompleteClear();
  };

  const onHandleSearching = (_search?: string) => {
    setUnitAutoCompleteOptions((_prev: BaseType) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? "licensePlate",
      search: _search,
      page: 1,
    }));
  };

  const onHandleSearch = (_search?: string) => {
    setUnitOptions((_prev: BaseType) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? "licensePlate",
      search: _search,
      page: 1,
    }));
  };

  const onHandleClearSearch = () => {
    setUnitOptions((_prev: BaseType) => ({
      ..._prev,
      search: null,
    }));
  };

  useEffect(() => {
    try {
      getMaintenanceLevel();
      getMaintenanceStatus();
      getUnitDetailClear();
      getLocationCountClear();
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 121, error);
      else sendErrorHandler("useEffect", 121, error?.data?.message);
    }
  }, []);

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);

    try {
      getUnit({ ...unitOptions, ...params });
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 131, error);
      else sendErrorHandler("useEffect", 131, error?.data?.message);
    }
  }, [unitOptions, params]);

  useEffect(() => {
    try {
      if (unitAutoCompleteOptions.search) {
        getUnitAutoComplete({ ...unitAutoCompleteOptions, ...params });
      }
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 140, error);
      else sendErrorHandler("useEffect", 140, error?.data?.message);
    }
  }, [unitAutoCompleteOptions, params]);

  useEffect(() => {
    try {
      getSummary(params);
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 116, error);
      else sendErrorHandler("useEffect", 116, error?.data?.message);
    }
  }, [params]);

  useEffect(() => {
    if (isEmpty(unitActivity?.createMaintenance?.data)) return;

    MessageHandler().success(t("toast.create"));
    createMaintenanceClear();
  }, [unitActivity?.createMaintenance]);

  useEffect(() => {
    if (isEmpty(unitActivity?.updateMaintenance?.data)) return;

    MessageHandler().success(t("toast.update"));
    updateMaintenanceClear();
  }, [unitActivity?.updateMaintenance]);

  return (
    <Flex gap={24} vertical>
      <Card.Filter>
        <UnitActivitiesFilters data={params} onChangeFilter={onChangeFilter} />
      </Card.Filter>

      <Card>
        <UnitActivitiesSummary />
      </Card>

      <Card>
        <TableMaintenanceStatus />
      </Card>

      <Card>
        <TableDetailMaintenance
          options={unitOptions}
          onChangePagination={onChangePagination}
          onChangeSearchBy={onChangeSearchBy}
          onHandleSearching={onHandleSearching}
          onHandleSearch={onHandleSearch}
          onHandleClearSearch={onHandleClearSearch}
        />
      </Card>

      <Card>
        <TableForecastUnit />
      </Card>
    </Flex>
  );
};

const mapStateToProps = (state: RootState) => ({
  unitActivity: state.unitActivity,
});

const mapDispatchToProps = {
  getUnit: unitActivityActions.getUnitFetch,
  getUnitAutoComplete: unitActivityActions.getUnitAutoCompleteFetch,
  getSummary: unitActivityActions.getSummaryFetch,
  getMaintenanceLevel: unitActivityActions.getMaintenanceLevelFetch,
  getMaintenanceStatus: unitActivityActions.getMaintenanceStatusFetch,
  getUnitAutoCompleteClear: unitActivityActions.getUnitAutoCompleteClear,
  createMaintenanceClear: unitActivityActions.createMaintenanceClear,
  updateMaintenanceClear: unitActivityActions.updateMaintenanceClear,
  getUnitDetailClear: unitActivityActions.getUnitDetailClear,
  getLocationCountClear: unitActivityActions.getLocationCountClear,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitActivitiesInitialPage);
