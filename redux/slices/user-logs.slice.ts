/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  DataUserLog,
  GetUserLogsResponse,
  UserLog,
} from "@sera-types/user-logs.type";
import FormatUtils from "@sera-utils/format";
import _ from "lodash";

import initialState from "../states/user-logs.state";

export const userLogState = createSlice({
  name: "userLogs",
  initialState,
  reducers: {
    getUserLogsFetch: (state, action: PayloadAction<BaseType>) => {
      state.isLoading = true;
    },
    getUserLogsSuccess: (state, action: PayloadAction<GetUserLogsResponse>) => {
      const { data, pagination } = action.payload.data as DataUserLog;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((logs: UserLog, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...logs, no };
        });
      }
      state.isLoading = false;
    },
    getUserLogsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    getUserLogsClear: (state) => {
      state.data = [];
      state.options = initialState.options;
    },

    getUserLogsAutoCompleteFetch: (state, action: PayloadAction<BaseType>) => {
      state.isLoading = true;
      state.error = null;
      if (state?.autoComplete) {
        state.autoComplete.options.searchBy = action.payload.searchBy;
      }
    },
    getUserLogsAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetUserLogsResponse>,
    ) => {
      // const { data, pagination } = action.payload.data as DataUserLog;
      const { data, pagination } = action.payload.data as any;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy =
        (state.autoComplete && state.autoComplete.options.searchBy) ||
        "menuName";

      if (state?.autoComplete?.options && state?.autoComplete?.data) {
        state.autoComplete.options = {
          ...state.autoComplete.options,
          page,
          limit,
          totalData,
          totalPage,
        };

        const formatAutoComplete = (value: string) => {
          if (value.includes(".")) {
            const wordBeforePeriod = value
              .substring(0, value.indexOf("."))
              .split(" ")[0]
              .split(/(?=[A-Z])/);

            return FormatUtils().stringToTitleCase(wordBeforePeriod.join(" "));
          }
          return FormatUtils().stringToTitleCase(value);
        };

        const uniqueData = _.uniqBy(data, searchBy);
        const includesInData =
          _.includes(searchBy, "activityName") ||
          _.includes(searchBy, "channel");

        state.autoComplete.data = uniqueData
          ? uniqueData.map((item: any) => ({
              label: includesInData
                ? formatAutoComplete(item[searchBy])
                : item[searchBy],
              value: item[searchBy],
            }))
          : ([] as any);
      }
      state.isLoading = false;
    },
    getUserLogsAutoCompleteFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    getUserLogDetailFetch: (state, action) => {
      state.isLoading = true;
    },
    getUserLogDetailSuccess: (
      state,
      action: PayloadAction<GetUserLogsResponse>,
    ) => {
      const { data } = action.payload as DataUserLog;
      state.userLogDetail.data = { ...state.userLogDetail.data, ...data };
      state.isLoading = false;
    },
    getUserLogDetailFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    exportUserLogsFetch: (state, action) => {
      state.isLoading = true;
      state.error = null;
      state.exportUserLogs.options = { ...action.payload };
    },
    exportUserLogsSuccess: (state, action) => {
      state.isLoading = false;
      state.exportUserLogs.options = { ...action.payload };
    },
    exportUserLogsFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
  },
});

export const {
  getUserLogsFetch,
  getUserLogsSuccess,
  getUserLogsFailure,
  getUserLogsAutoCompleteFetch,
  getUserLogsAutoCompleteSuccess,
  getUserLogsAutoCompleteFailure,
  getUserLogDetailFetch,
  getUserLogDetailSuccess,
  getUserLogDetailFailure,
  exportUserLogsFetch,
  exportUserLogsSuccess,
  exportUserLogsFailure,
} = userLogState.actions;

export const userLogActions = userLogState.actions;
export const userLogReducers = userLogState.reducer;
export default userLogReducers;
