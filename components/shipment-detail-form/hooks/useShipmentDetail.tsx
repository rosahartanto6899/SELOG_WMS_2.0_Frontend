import { useAppDispatch, useAppSelector } from "@sera-redux";
import { shipmentDetailsActions } from "@sera-redux/slices/shipment-details.slice";
import { PayloadDetails } from "@sera-types/shipment-details.type";

const useShipmentDetail = () => {
  const dispatch = useAppDispatch();

  const { getDetails } = useAppSelector((state) => state.shipmentDetails);

  const fetchDetails = (payload: PayloadDetails) => {
    dispatch(shipmentDetailsActions.getDetailsFetch(payload));
  };

  return {
    queries: {
      fetchDetails,
    },
    data: {
      shipmentDetails: getDetails.data,
    },
    loading: {
      loadingDetails: getDetails.isLoading,
    },
  };
};

export default useShipmentDetail;
