"use client";

import {
  businessAreaActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { performanceActions } from "@sera-redux/slices/driver-performance.slice";
import { employeeStatusActions } from "@sera-redux/slices/employee-status.slice";
import { shipmentTypesActions } from "@sera-redux/slices/shipment-types.slice";
import { useRouter } from "next/navigation";

const useDriverPerformance = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const { getSummary, data, isLoading, options } = useAppSelector(
    (state) => state.driverPerformance,
  );

  const { dropdownBusinessAreas, isLoading: loadingBranch } = useAppSelector(
    (state) => state.businessAreas,
  );
  const { data: shipmentTypeData, isLoading: loadingShipmentType } =
    useAppSelector((state) => state.shipmentTypes);
  const { data: employeeStatusData, isLoading: loadingEmployeeStatus } =
    useAppSelector((state) => state.employeeStatus);

  const goBack = () => router.push("/driver-management/driver-performance/");

  const fetchSummary = (payload?: any) => {
    dispatch(performanceActions.getSummaryFetch(payload ?? {}));
  };

  const fetchBranch = () => {
    dispatch(businessAreaActions.getDropdownBusinessAreasFetch({}));
  };

  const fetchEmployeeStatus = () => {
    dispatch(employeeStatusActions.getEmployeeStatusFetch());
  };

  const fetchShipmentType = () => {
    dispatch(shipmentTypesActions.getShipmentTypesFetch());
  };

  const fetchPerformanceList = (payload: any) => {
    dispatch(performanceActions.getPerformanceListFetch(payload));
  };

  const fetchPerformanceFilter = () =>
    dispatch(performanceActions.getPerformanceFilterFetch());

  return {
    queries: {
      fetchSummary,
      fetchBranch,
      fetchEmployeeStatus,
      fetchShipmentType,
      fetchPerformanceList,
      fetchPerformanceFilter,
    },
    data: {
      summary: getSummary.data,
      dropdownBusinessAreas,
      shipmentTypeData,
      employeeStatusData,
      performanceList: data,
      filterOption: [],
    },
    loading: {
      loadingSummary: getSummary.isLoading,
      loadingBranch,
      loadingShipmentType,
      loadingEmployeeStatus,
      loadingPerformanceList: isLoading,
      loadingFilterOption: false,
    },
    pagination: options,
    events: {
      goBack,
    },
  };
};

export default useDriverPerformance;
