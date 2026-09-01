/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import MessageHandler from "@sera-libraries/message-handler";
import {
  RootState,
  stockManagementActions,
  unitActivityActions,
} from "@sera-redux";
import { BaseType } from "@sera-types/base.type";
import {
  GetStockPayload,
  StockManagementState,
} from "@sera-types/stock-management.type";
import { UnitActivityState } from "@sera-types/unit-activity";
import useErrorHandler from "@sera-utils/hooks/useErrorHandler";
import { Flex } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import StockManagementFilters from "./stock-management-filters";
import TableInOut from "./stock-management-table-in-out";
import TableStockUnit from "./stock-management-table-stock-unit";
import TableSummary from "./stock-management-table-summary";

interface StockManagementInitialPageProps {
  stockManagement: StockManagementState;
  unitActivity: UnitActivityState;
  getStock: typeof stockManagementActions.getStockFetch;
  getStockAutoComplete: typeof stockManagementActions.getStockAutoCompleteFetch;
  getStockAutoCompleteClear: typeof stockManagementActions.getStockAutoCompleteClear;
  getSummary: typeof stockManagementActions.getSummaryFetch;
  createVehicleClear: typeof stockManagementActions.createVehicleClear;
  detailVehicleClear: typeof stockManagementActions.detailVehicleClear;
  updateVehicleClear: typeof stockManagementActions.updateVehicleClear;
  updatePMCheckClear: typeof unitActivityActions.updatePMCheckClear;
}

const StockManagementInitialPage = ({
  stockManagement,
  unitActivity,
  getStock,
  getStockAutoComplete,
  getStockAutoCompleteClear,
  getSummary,
  createVehicleClear,
  detailVehicleClear,
  updateVehicleClear,
  updatePMCheckClear,
}: StockManagementInitialPageProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "stockManagement" });

  const { isApiResponse, sendErrorHandlerApi, sendErrorHandler } =
    useErrorHandler("/pages/fleet-management/stock-management/index");

  const [isSkipFetch, setIsSkipFetch] = useState(false);

  const [stockOptions, setStockOptions] = useState<BaseType>({
    page: 1,
    limit: 10,
  });
  const [stockAutoCompleteOptions, setStockAutoCompleteOptions] =
    useState<BaseType>({
      searchBy: "licensePlate",
      page: 1,
      limit: 10,
    });

  const [params, setParams] = useState<GetStockPayload>({
    branchId: [],
    unitTypeId: [],
    shipmentType: [],
  });

  const onChangeFilter = (_payload: GetStockPayload) => {
    setParams((_prev) => ({
      branchId: _payload?.branchId ?? _prev?.branchId,
      unitTypeId: _payload?.unitTypeId ?? _prev?.unitTypeId,
      shipmentType: _payload?.shipmentType ?? _prev?.shipmentType,
    }));
  };

  const onChangePagination = (_current: number, _limit: number) => {
    setStockOptions((_prevState) => ({
      ..._prevState,
      page: _current,
      limit: _limit,
    }));
  };

  const onTableChangeListener = (_: any, __: any, _sorter: any) => {
    if (!_sorter) return;
    setStockOptions((_prevState) => ({
      ..._prevState,
      order: _sorter.field,
      sort: _sorter.order === "ascend" ? "asc" : "desc",
    }));
  };

  const onChangeSearchBy = (_value?: string) => {
    setIsSkipFetch(true);

    setStockOptions((_prev: BaseType) => ({
      ..._prev,
      searchBy: _value,
      search: null,
    }));

    setStockAutoCompleteOptions((prevState: BaseType) => ({
      ...prevState,
      searchBy: _value,
      search: null,
    }));

    getStockAutoCompleteClear();
  };

  const onHandleSearching = (_search?: string) => {
    setStockAutoCompleteOptions((_prev: BaseType) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? "licensePlate",
      search: _search,
      page: 1,
    }));
  };

  const onHandleClearSearch = () => {
    setStockOptions((_prev: BaseType) => ({
      ..._prev,
      search: null,
    }));
  };

  const onHandleSearch = (_search?: string) => {
    setStockOptions((_prev: BaseType) => ({
      ..._prev,
      searchBy: _prev?.searchBy ?? "licensePlate",
      search: _search,
      page: 1,
    }));
  };

  useEffect(() => {
    detailVehicleClear();
  }, []);

  useEffect(() => {
    if (isSkipFetch) return setIsSkipFetch(false);

    const getDataStock = () => {
      try {
        getStock({ ...stockOptions, ...params });
      } catch (error: any) {
        if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 123, error);
        else sendErrorHandler("useEffect", 123, error?.data?.message);
      }
    };

    getDataStock();

    const intervalId = setInterval(getDataStock, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [stockOptions, params]);

  useEffect(() => {
    try {
      if (stockAutoCompleteOptions.search) {
        getStockAutoComplete({ ...stockAutoCompleteOptions, ...params });
      }
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 135, error);
      else sendErrorHandler("useEffect", 135, error?.data?.message);
    }
  }, [stockAutoCompleteOptions, params]);

  useEffect(() => {
    try {
      getSummary(params);
    } catch (error: any) {
      if (isApiResponse(error)) sendErrorHandlerApi("useEffect", 149, error);
      else sendErrorHandler("useEffect", 149, error?.data?.message);
    }
  }, [params]);

  useEffect(() => {
    const { licensePlate } = stockManagement?.createVehicle?.data;

    if (licensePlate) {
      MessageHandler().success(
        `${t("toast.create.prevText")} “${licensePlate}” ${t("toast.create.postText")}`,
      );

      createVehicleClear();
    }
  }, [stockManagement?.createVehicle]);

  useEffect(() => {
    const { licensePlate } = stockManagement?.updateVehicle?.data;

    if (licensePlate) {
      MessageHandler().success(
        `${t("toast.update.prevText")} “${licensePlate}” ${t("toast.update.postText")}`,
      );

      updateVehicleClear();
    }
  }, [stockManagement?.updateVehicle]);

  useEffect(() => {
    const { vehicleId } = unitActivity?.updatePMCheck?.data;

    if (vehicleId) {
      MessageHandler().success(t("toast.pmCheck"));
      updatePMCheckClear();
    }
  }, [unitActivity?.updatePMCheck?.data]);

  return (
    <Flex gap={24} vertical>
      <Card.Filter>
        <StockManagementFilters data={params} onChangeFilter={onChangeFilter} />
      </Card.Filter>

      <Card>
        <TableSummary />
      </Card>

      <Card>
        <TableStockUnit
          options={stockOptions}
          onChangePagination={onChangePagination}
          onTableChangeListener={onTableChangeListener}
          onChangeSearchBy={onChangeSearchBy}
          onHandleSearching={onHandleSearching}
          onHandleSearch={onHandleSearch}
          onHandleClearSearch={onHandleClearSearch}
        />
      </Card>

      <Card>
        <TableInOut />
      </Card>
    </Flex>
  );
};

const mapStateToProps = (state: RootState) => ({
  stockManagement: state.stockManagement,
  unitActivity: state.unitActivity,
});

const mapDispatchToProps = {
  getStock: stockManagementActions.getStockFetch,
  getStockAutoComplete: stockManagementActions.getStockAutoCompleteFetch,
  getStockAutoCompleteClear: stockManagementActions.getStockAutoCompleteClear,
  getSummary: stockManagementActions.getSummaryFetch,
  createVehicleClear: stockManagementActions.createVehicleClear,
  detailVehicleClear: stockManagementActions.detailVehicleClear,
  updateVehicleClear: stockManagementActions.updateVehicleClear,
  updatePMCheckClear: unitActivityActions.updatePMCheckClear,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockManagementInitialPage);
