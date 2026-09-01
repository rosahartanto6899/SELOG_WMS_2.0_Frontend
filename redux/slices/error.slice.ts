/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

import initialState from "../states/loading.state";

let actionName = "";
let actionStatus = "";

const getErrorMatches = (actionType: string) =>
  /(.*)(Fetch|Failure|)/.exec(actionType);

const isActionError = (action: any) => {
  const matches = getErrorMatches(action.type);

  if (!matches) {
    return false;
  }

  const [, requestName, requestStatus] = matches;

  actionName = requestName;
  actionStatus = requestStatus;

  return true;
};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isActionError, (state, action: any) => ({
        ...state,
        [actionName]: actionStatus === "Failure" ? action.type.error : null,
        detail: action.payload,
      }))
      .addDefaultCase((state, action) => state);
  },
});

export const errorReducer = errorSlice.reducer;

export default errorReducer;
