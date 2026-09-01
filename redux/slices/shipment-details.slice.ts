import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/shipment-details.state";
import {
  GetDetailsResponse,
  PayloadDetails,
} from "@sera-types/shipment-details.type";

export const shipmentDetailsSlice = createSlice({
  name: "shipmentDetails",
  initialState,
  reducers: {
    getDetailsFetch: (state, action: PayloadAction<PayloadDetails>) => {
      state.getDetails.isLoading = true;
      state.getDetails.error = null;
      state.getDetails.payload = { ...action.payload };
    },
    getDetailsSuccess: (state, action: PayloadAction<GetDetailsResponse>) => {
      state.getDetails.isLoading = false;
      state.getDetails.error = null;
      if (action?.payload?.data) {
        state.getDetails.data = { ...action?.payload?.data };
      }
    },
    getDetailsFailure: (state, action) => {
      state.getDetails.isLoading = false;
      state.getDetails.error = { ...action.payload };
      state.getDetails.data = { ...initialState.getDetails.data };
    },
  },
});

export const shipmentDetailsActions = shipmentDetailsSlice.actions;
export const shipmentDetailsReducers = shipmentDetailsSlice.reducer;
export default shipmentDetailsReducers;
