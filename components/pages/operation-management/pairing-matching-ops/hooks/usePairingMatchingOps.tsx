"use client";

// import MessageHandler from "@sera-libraries/message-handler";
import {
  businessAreaActions,
  masterDataActions,
  useAppDispatch,
  useAppSelector,
  vehicleTypeActions,
} from "@sera-redux";
import { pairingMatchingOpsActions } from "@sera-redux/slices/pairing-matching-ops.slice";
import { shipmentTypesActions } from "@sera-redux/slices/shipment-types.slice";
import { BaseType } from "@sera-types/base.type";
import {
  PairingConfirmPayload,
  PairingHistoryParams,
  PairingProcessPayload,
  PairingRepairPayload,
  UnitDetailParams,
  UnitParams,
} from "@sera-types/pairing-matching-ops";
import { useRouter } from "next/navigation";

const usePairingMatchingOps = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const { dropdownBusinessAreas, isLoading: loadingBranch } = useAppSelector(
    (state) => state.businessAreas,
  );

  const { data: shipmentTypeData, isLoading: loadingShipmentType } =
    useAppSelector((state) => state.shipmentTypes);

  const { getAreas, getUnitCapacityStatuses } = useAppSelector(
    (state) => state.masterData,
  );

  const { dropdownVehicleTypes: unitTypes, isLoading: loadingUnitTypes } =
    useAppSelector((state) => state.vehicleTypes);

  const {
    getSummary,
    getUnitPosition,
    getUnitDetail,
    getDemands,
    getDemandFilter,
    getPairingHistory,
    pairingProcess: pairingProcessState,
    pairingConfirm,
    pairingRepair,
    getShipmentDetail,
  } = useAppSelector((state) => state.pairingMatchingOps);

  const goBack = () =>
    router.push("/operation-management/pairing-matching-ops/");

  const fetchBranch = () => {
    dispatch(businessAreaActions.getDropdownBusinessAreasFetch({}));
  };

  const fetchShipmentType = () => {
    dispatch(shipmentTypesActions.getShipmentTypesFetch());
  };

  const fetchArea = () => {
    dispatch(masterDataActions.getAreasFetch());
  };

  const fetchUnitType = () => {
    dispatch(vehicleTypeActions.getDropdownVehicleTypesFetch({}));
  };

  const fetchSummary = (params: UnitParams) => {
    dispatch(pairingMatchingOpsActions.getSummaryFetch(params));
  };

  const fetchUnitCapacityStatus = () => {
    dispatch(masterDataActions.getUnitCapacityStatusesFetch());
  };

  const fetchUnitPosition = (payload: any) => {
    dispatch(pairingMatchingOpsActions.getUnitPositionFetch(payload));
  };

  const fetchUnitDetail = (params: UnitDetailParams) => {
    dispatch(pairingMatchingOpsActions.getUnitDetailFetch({ ...params }));
  };

  const fetchDemands = (payload: BaseType) => {
    dispatch(pairingMatchingOpsActions.getDemandsFetch(payload));
  };

  const fetchDemandFilter = () => {
    dispatch(pairingMatchingOpsActions.getFilterDemandFetch());
  };

  const clearUnitDetail = () =>
    dispatch(pairingMatchingOpsActions.getUnitDetailClear());

  const fetchUnpairedDriver = (payload: {
    payload: BaseType;
    customerId: string;
    originId: string;
  }) => {
    dispatch(pairingMatchingOpsActions.getUnpairedDriverFetch(payload));
  };

  const fetchPairingHistory = (payload: PairingHistoryParams) => {
    dispatch(pairingMatchingOpsActions.getPairingHistoryFetch(payload));
  };

  const postPairingConfirm = (
    payload: PairingConfirmPayload,
    callback?: () => void,
  ) => {
    dispatch(
      pairingMatchingOpsActions.pairingConfirmFetch({ payload, callback }),
    );
  };

  const postPairingRepair = (
    payload: PairingRepairPayload,
    callback?: () => void,
  ) => {
    dispatch(
      pairingMatchingOpsActions.pairingRepairFetch({ payload, callback }),
    );
  };

  const pairingProcess = (
    payload: PairingProcessPayload,
    callback?: () => void,
  ) => {
    dispatch(
      pairingMatchingOpsActions.pairingProcessFetch({ payload, callback }),
    );
  };

  return {
    queries: {
      fetchBranch,
      fetchShipmentType,
      fetchArea,
      fetchUnitType,
      fetchSummary,
      fetchUnitCapacityStatus,
      fetchUnitPosition,
      fetchUnitDetail,
      fetchDemands,
      fetchDemandFilter,
      fetchUnpairedDriver,
      fetchPairingHistory,
    },
    mutations: {
      postPairingConfirm,
      postPairingRepair,
      pairingProcess,
    },
    data: {
      branchList: dropdownBusinessAreas,
      shipmentTypes: shipmentTypeData,
      areaList: getAreas?.data ?? [],
      unitTypes,
      summaryData: getSummary?.data ?? null,
      unitCapacityStatusList: getUnitCapacityStatuses.data,
      unitPosition: getUnitPosition.data,
      unitDetail: getUnitDetail.data,
      demandList: getDemands.data ?? [],
      filterDemands: getDemandFilter.data ?? [],
      pairingHistoryData: getPairingHistory.data ?? [],
    },
    loading: {
      loadingBranch,
      loadingShipmentType,
      loadingArea: Boolean(getAreas?.isLoading),
      loadingUnitTypes,
      loadingSummary: Boolean(getSummary?.isLoading),
      loadingUnitCapacityStatus: Boolean(getUnitCapacityStatuses?.isLoading),
      loadingUnitPosition: Boolean(getUnitPosition?.isLoading),
      loadingUnitDetail: Boolean(getUnitDetail?.isLoading),
      loadingDemands: Boolean(getDemands?.isLoading),
      loadingPairingHistory: Boolean(getPairingHistory?.isLoading),
      loadingPairingProcess: Boolean(pairingProcessState?.isLoading),
      loadingPairingConfirm: Boolean(pairingConfirm?.isLoading),
      loadingPairingRepair: Boolean(pairingRepair?.isLoading),
      loadingShipmentDetail: Boolean(getShipmentDetail?.isLoading),
    },
    pagination: {
      demandsOptions: getDemands.options,
    },
    events: { goBack, clearUnitDetail },
  };
};

export default usePairingMatchingOps;
