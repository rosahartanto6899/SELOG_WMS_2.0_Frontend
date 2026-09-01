import {
  businessAreaActions,
  podCollectionActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { shipmentTypesActions } from "@sera-redux/slices/shipment-types.slice";
import { BaseType } from "@sera-types/base.type";
import {
  ApprovalPodPayload,
  PayloadDetails,
  PodDeliveryPayload,
  PodHardcopyPayload,
  PodLoadingPayload,
  PodTimestampPayload,
  PodUnloadingPayload,
  UnitParams,
} from "@sera-types/pod-collection.type";
import { useRouter } from "next/navigation";

const usePodCollection = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { dropdownBusinessAreas, isLoading: loadingBranch } = useAppSelector(
    (state) => state.businessAreas,
  );

  const { data: shipmentTypeData, isLoading: loadingShipmentType } =
    useAppSelector((state) => state.shipmentTypes);

  const {
    getList,
    getSummary,
    getDetails,
    podApproval,
    podLoading,
    podUnloading,
    podTimestamp,
    podHardcopy,
  } = useAppSelector((state) => state.podCollection);

  const goBack = () =>
    router.push("/administration-management/pod-collection/");

  const fetchBranch = () => {
    dispatch(businessAreaActions.getDropdownBusinessAreasFetch({}));
  };

  const fetchShipmentType = () => {
    dispatch(shipmentTypesActions.getShipmentTypesFetch());
  };

  const fetchSummary = (payload: UnitParams) => {
    dispatch(podCollectionActions.getSummaryFetch(payload));
  };

  const fetchList = (payload: BaseType) => {
    dispatch(podCollectionActions.getListFetch(payload));
  };

  const fetchDetails = (payload: PayloadDetails) => {
    dispatch(podCollectionActions.getDetailsFetch(payload));
  };

  const postLoading = (payload: PodLoadingPayload, callback?: () => void) => {
    dispatch(podCollectionActions.podLoadingFetch({ payload, callback }));
  };

  const postUnloading = (
    payload: PodUnloadingPayload,
    callback?: () => void,
  ) => {
    dispatch(podCollectionActions.podUnloadingFetch({ payload, callback }));
  };

  const putApproval = (payload: ApprovalPodPayload, callback?: () => void) => {
    dispatch(podCollectionActions.getApprovalFetch({ payload, callback }));
  };

  const postDelivery = (payload: PodDeliveryPayload, callback?: () => void) => {
    dispatch(podCollectionActions.podDeliveryFetch({ payload, callback }));
  };

  const postTimestamp = (
    payload: PodTimestampPayload,
    callback?: () => void,
  ) => {
    dispatch(podCollectionActions.podTimestampFetch({ payload, callback }));
  };

  const postHardcopy = (payload: PodHardcopyPayload, callback?: () => void) => {
    dispatch(podCollectionActions.podHardcopyFetch({ payload, callback }));
  };

  return {
    queries: {
      fetchBranch,
      fetchShipmentType,
      fetchSummary,
      fetchList,
      fetchDetails,
      putApproval,
      postLoading,
      postUnloading,
      postDelivery,
      postTimestamp,
      postHardcopy,
    },
    data: {
      branchList: dropdownBusinessAreas,
      shipmentTypes: shipmentTypeData,
      summaryData: getSummary.data,
      listData: getList.data,
      detailsData: getDetails?.data,
    },
    loading: {
      loadingBranch,
      loadingShipmentType,
      loadingSummary: getSummary.isLoading,
      listLoading: getList.isLoading,
      detailsLoading: getDetails.isLoading,
      loadingApproval: podApproval.isLoading,
      loadingPodLoad: podLoading.isLoading,
      loadingPodUnload: podUnloading.isLoading,
      loadingTimestamp: podTimestamp.isLoading,
      loadingHardcopy: podHardcopy.isLoading,
    },
    pagination: {
      listOptions: getList.options,
      detailsOptions: podApproval.options,
    },
    events: {
      goBack,
    },
  };
};

export default usePodCollection;
