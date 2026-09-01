/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  DataNotificationDaily,
  NotificationDailyData,
  NotificationDailyResponse,
  PayloadNotificationDaily,
} from "../../types/notification.type";
import initialState from "../states/notification.state";

export const notificationState = createSlice({
  name: "notification",
  initialState,
  reducers: {
    getNotificationDailyFetch: (
      state,
      action: PayloadAction<PayloadNotificationDaily>,
    ) => {
      state.isLoading = true;
    },
    getNotificationDailySuccess: (
      state,
      action: PayloadAction<NotificationDailyResponse>,
    ) => {
      const { data, count } = action.payload.data as DataNotificationDaily;
      if (data) {
        state.data = data;
        state.count = count;
        state.options = { ...state.options };
      }
      state.isLoading = false;
    },
    getNotificationDailyFailure: (state, action) => {
      state.isLoading = false;
    },
    getNotificationFleetGroupFetch: (state) => {
      state.isLoading = true;
    },
    getNotificationFleetGroupSuccess: (state, action) => {
      const { data } = action.payload;

      state.isLoading = false;
      state.fleetGroups.data = data;
    },
    getNotificationFleetGroupFailure: (state, action) => {
      state.isLoading = false;
    },
  },
});

export const {
  getNotificationDailyFetch,
  getNotificationDailySuccess,
  getNotificationDailyFailure,
  getNotificationFleetGroupFetch,
  getNotificationFleetGroupSuccess,
  getNotificationFleetGroupFailure,
} = notificationState.actions;

export const notificationActions = notificationState.actions;
export const notificationReducers = notificationState.reducer;
export default notificationReducers;
