"use client";

import MessageHandler from "@sera-libraries/message-handler";
import {
  businessAreaActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { fatigueActions } from "@sera-redux/slices/driver-fatigue.slice";
import { employeeStatusActions } from "@sera-redux/slices/employee-status.slice";
import { shipmentTypesActions } from "@sera-redux/slices/shipment-types.slice";
import {
  IFatigueListPayload,
  IFatiguePayloadHealthCheck,
  ISummaryPayload,
} from "@sera-types/driver-fatigue.type";
import { useRouter } from "next/navigation";

const useDriverFatigue = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const {
    getSummary,
    data,
    isLoading: loadingFatigueList,
    options,
    getFilterOption,
    getDetails,
  } = useAppSelector((state) => state.driverFatigue);
  const { dropdownBusinessAreas, isLoading: loadingBranch } = useAppSelector(
    (state) => state.businessAreas,
  );

  const { data: shipmentTypeData, isLoading: loadingShipmentType } =
    useAppSelector((state) => state.shipmentTypes);
  const { data: employeeStatusData, isLoading: loadingEmployeeStatus } =
    useAppSelector((state) => state.employeeStatus);

  const goBack = () => router.push("/driver-management/driver-fatigue/");

  const fetchSummary = (payload?: ISummaryPayload) => {
    dispatch(fatigueActions.getSummaryFetch(payload ?? {}));
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

  const fetchFatiguList = (payload: IFatigueListPayload) => {
    dispatch(fatigueActions.getFatigueListFetch(payload));
  };

  const fetchFatigueFilter = () =>
    dispatch(fatigueActions.getFatigueFilterFetch());

  const fetchFatigueById = (id: string) => {
    dispatch(fatigueActions.getFatigueDetailsFetch({ id }));
  };

  const clearDetailsData = () =>
    dispatch(fatigueActions.getFatigueDetailsClear());

  const createHealthCheck = (
    payload: IFatiguePayloadHealthCheck,
    driverName: string,
  ) =>
    dispatch(
      fatigueActions.postFatigueDetailsFetch({
        payload,
        callback: () => {
          MessageHandler().success(
            `Health assessment ${driverName} have been successfully added!`,
          );
          goBack();
          clearDetailsData();
        },
      }),
    );

  return {
    queries: {
      fetchSummary,
      fetchBranch,
      fetchEmployeeStatus,
      fetchShipmentType,
      fetchFatiguList,
      fetchFatigueFilter,
      fetchFatigueById,
    },
    mutations: {
      createHealthCheck,
    },
    data: {
      summary: getSummary.data,
      dropdownBusinessAreas,
      shipmentTypeData,
      employeeStatusData,
      fatigueList: data,
      filterOption: getFilterOption?.data ?? [],
      fatigueDetails: getDetails.data,
    },
    loading: {
      loadingSummary: getSummary.isLoading,
      loadingBranch,
      loadingShipmentType,
      loadingEmployeeStatus,
      loadingFatigueList,
      loadingFilterOption: getFilterOption.isLoading ?? false,
      loadingFatigue: getDetails.isLoading ?? false,
      loadingDetails: getDetails.isLoading,
    },
    pagination: options,
    events: {
      goBack,
      clearDetailsData,
    },
  };
};

export default useDriverFatigue;
