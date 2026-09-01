import {
  businessAreaActions,
  // tracingTrackingActions,
  useAppDispatch,
  useAppSelector,
} from "@sera-redux";
import { expenseRefundActions } from "@sera-redux/slices/expense-refund.slice";
import { shipmentTypesActions } from "@sera-redux/slices/shipment-types.slice";
import { BaseType } from "@sera-types/base.type";
import {
  ExpenseRefundProcessPayload,
  PayloadDetails,
  UnitParams,
} from "@sera-types/expense-refund.type";
// import { BaseType } from "@sera-types/base.type";
// import { UnitParams } from "@sera-types/pairing-matching";
// import { DetailParams } from "@sera-types/tracking-tracking.type";
import { useRouter } from "next/navigation";

const useExpenseRefund = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { dropdownBusinessAreas, isLoading: loadingBranch } = useAppSelector(
    (state) => state.businessAreas,
  );

  const { data: shipmentTypeData, isLoading: loadingShipmentType } =
    useAppSelector((state) => state.shipmentTypes);

  const {
    getDetails,
    getList,
    getSummary,
    refundProcess: processRefund,
  } = useAppSelector((state) => state.expenseRefund);

  const goBack = () =>
    router.push("/administration-management/expense-refund/");

  const fetchBranch = () => {
    dispatch(businessAreaActions.getDropdownBusinessAreasFetch({}));
  };

  const fetchShipmentType = () => {
    dispatch(shipmentTypesActions.getShipmentTypesFetch());
  };

  const fetchSummary = (payload: UnitParams) => {
    dispatch(expenseRefundActions.getSummaryFetch(payload));
  };

  const fetchList = (payload: BaseType) => {
    dispatch(expenseRefundActions.getListFetch(payload));
  };

  const fetchDetails = (payload: PayloadDetails) => {
    dispatch(expenseRefundActions.getDetailsFetch(payload));
  };

  const refundProcess = (
    payload: ExpenseRefundProcessPayload,
    callback?: () => void,
  ) => {
    dispatch(expenseRefundActions.refundExpenseFetch({ payload, callback }));
  };

  // const fetchDetails = (payload: DetailParams) => {
  //   dispatch(tracingTrackingActions.getDetailsFetch(payload));
  // };

  return {
    queries: {
      fetchBranch,
      fetchShipmentType,
      fetchSummary,
      fetchList,
      refundProcess,
      fetchDetails,
    },
    data: {
      branchList: dropdownBusinessAreas,
      shipmentTypes: shipmentTypeData,
      summaryData: getSummary.data,
      listData: getList.data,
      detailsData: getDetails.data,
    },
    loading: {
      loadingBranch,
      loadingShipmentType,
      loadingSummary: Boolean(getSummary?.isLoading),
      listLoading: Boolean(getList?.isLoading),
      loadingRefund: Boolean(processRefund?.isLoading),
      detailsLoading: getDetails.isLoading,
    },
    pagination: {
      listOptions: getList.options,
    },
    events: {
      goBack,
    },
  };
};

export default useExpenseRefund;
