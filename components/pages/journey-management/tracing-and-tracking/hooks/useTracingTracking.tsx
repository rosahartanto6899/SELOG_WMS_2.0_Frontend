import {
  businessAreaActions,
  masterDataActions,
  tracingTrackingActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { shipmentTypesActions } from "@sera-redux/slices/shipment-types.slice";
import { BaseType } from "@sera-types/base.type";
import { UnitParams } from "@sera-types/pairing-matching";
import { DetailParams } from "@sera-types/tracking-tracking.type";
import { useRouter } from "next/navigation";

const useTracingTracking = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { dropdownBusinessAreas, isLoading: loadingBranch } = useAppSelector(
    (state) => state.businessAreas,
  );

  const { data: shipmentTypeData, isLoading: loadingShipmentType } =
    useAppSelector((state) => state.shipmentTypes);

  const { getDetails, getList, getSummary } = useAppSelector(
    (state) => state.tracingTracking,
  );

  const { getJourneyStatuses } = useAppSelector((state) => state.masterData);

  const goBack = () => router.push("/journey-management/tracing-and-tracking/");

  const fetchBranch = () => {
    dispatch(businessAreaActions.getDropdownBusinessAreasFetch({}));
  };

  const fetchShipmentType = () => {
    dispatch(shipmentTypesActions.getShipmentTypesFetch());
  };

  const fetchSummary = (payload: UnitParams) => {
    dispatch(tracingTrackingActions.getSummaryFetch(payload));
  };

  const fetchList = (payload: BaseType) => {
    dispatch(tracingTrackingActions.getListFetch(payload));
  };

  const fetchDetails = (payload: DetailParams) => {
    dispatch(tracingTrackingActions.getDetailsFetch(payload));
  };

  const clearDetailsData = () =>
    dispatch(tracingTrackingActions.clearDetailsData());

  const fetchJourneyStatuses = () => {
    dispatch(masterDataActions.getJourneyStatusesFetch());
  };

  return {
    queries: {
      fetchBranch,
      fetchShipmentType,
      fetchSummary,
      fetchList,
      fetchDetails,
      fetchJourneyStatuses,
    },
    data: {
      branchList: dropdownBusinessAreas,
      shipmentTypes: shipmentTypeData,
      summaryData: getSummary.data,
      listData: getList.data,
      detailsData: getDetails.data,
      journeyStatuses: getJourneyStatuses?.data,
    },
    loading: {
      loadingBranch,
      loadingShipmentType,
      loadingSummary: getSummary.isLoading,
      listLoading: getList.isLoading,
      detailsLoading: getDetails.isLoading,
    },
    pagination: {
      listOptions: getList.options,
    },
    events: {
      goBack,
      clearDetailsData,
    },
  };
};

export default useTracingTracking;
