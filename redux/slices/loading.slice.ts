/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

import { REGEX_PATTERN_ACTION_TYPE } from "../../libraries/common/regexConstants";
import initialState from "../states/loading.state";

let actionName = "";
let actionStatus = "";

const getLoadingMatches = (actionType: string) =>
  REGEX_PATTERN_ACTION_TYPE.exec(actionType);
const isActionLoading = (action: any) => {
  const matches = getLoadingMatches(action.type);

  if (!matches) {
    return false;
  }

  const [, requestName, requestStatus] = matches;

  actionName = requestName;
  actionStatus = requestStatus;

  return true;
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    clearLoading: (state) => {
      // delete state['businessAreas/getDropdownDashboardListBusinessAreasByMWMapping'];
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isActionLoading, (state, action) => ({
        ...state,
        [actionName]: actionStatus === "Fetch",
      }))
      .addDefaultCase((state, action) => state);
  },
});

export const { clearLoading } = loadingSlice.actions;

export const loadingActions = loadingSlice.actions;
export const loadingReducer = loadingSlice.reducer;
export default loadingReducer;
