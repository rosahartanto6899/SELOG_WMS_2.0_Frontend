/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/outstanding-outgoing.state";
import {
  InputOutgoingPayload,
  OutstandingOutgoingHeader,
  UpdateOutgoingPayload,
} from "@sera-types/outstanding-outgoing.type";

/** Submit form input plan outgoing — create (C1) / update (C3+C4+C2). */
export const outstandingOutgoingSlice = createSlice({
  name: "outstandingOutgoing",
  initialState,
  reducers: {
    submitOutgoingFetch: {
      // payload create / update dibedakan lewat properti id (update)
      reducer: (
        state,
        _action: PayloadAction<InputOutgoingPayload | UpdateOutgoingPayload>,
      ) => {
        state.submit = {
          ...state.submit,
          isLoading: true,
          error: null,
          success: false,
          message: null,
        };
      },
      prepare: (payload: InputOutgoingPayload | UpdateOutgoingPayload) => ({
        payload,
      }),
    },
    submitOutgoingSuccess: (state, action: PayloadAction<string | null>) => {
      state.submit.isLoading = false;
      state.submit.success = true;
      state.submit.message = action.payload ?? null;
    },
    submitOutgoingFailure: (state, action) => {
      state.submit.isLoading = false;
      state.submit.error = { ...action.payload };
    },
    submitOutgoingClear: (state) => {
      state.submit = initialState.submit;
    },

    getOutgoingEditFetch: (state, _action: PayloadAction<{ id: string }>) => {
      state.edit = { ...state.edit, isLoading: true, error: null, data: null };
    },
    getOutgoingEditSuccess: (
      state,
      action: PayloadAction<{ data: OutstandingOutgoingHeader | null }>,
    ) => {
      state.edit.isLoading = false;
      state.edit.data = action.payload.data ?? null;
    },
    getOutgoingEditFailure: (state, action) => {
      state.edit.isLoading = false;
      state.edit.error = { ...action.payload };
    },
    getOutgoingEditClear: (state) => {
      state.edit = initialState.edit;
    },
  },
});

export const { actions: outstandingOutgoingActions } = outstandingOutgoingSlice;
export const outstandingOutgoingReducer = outstandingOutgoingSlice.reducer;
export default outstandingOutgoingReducer;
