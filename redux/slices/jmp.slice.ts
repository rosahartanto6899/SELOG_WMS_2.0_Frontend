/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/jmp.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  CreateJMPPayload,
  DetailJMPPayload,
  FilterParams,
  GetDetailJMPResponse,
  GetJMPListResponse,
  GetSummaryResponse,
  JMPList,
  UpdateJMPPayload,
} from "@sera-types/jmp.type";
import { uniqBy } from "lodash";

export const DEFAULT_SEARCH = "jmpCode";

export const jmpState = createSlice({
  name: "jmp",
  initialState,
  reducers: {
    getSummaryFetch: (state, action: PayloadAction<FilterParams>) => {
      state.getSummary.isLoading = true;
      state.getSummary.error = null;
      state.getSummary.payload = { ...action.payload };
    },
    getSummarySuccess: (state, action: PayloadAction<GetSummaryResponse>) => {
      state.getSummary.isLoading = false;
      state.getSummary.error = null;
      state.getSummary.data = { ...action?.payload?.data };
    },
    getSummaryFailure: (state, action) => {
      state.getSummary.isLoading = false;
      state.getSummary.error = { ...action.payload };
      state.getSummary.data = {};
    },
    getSummaryClear: (state) => {
      state.getSummary = initialState.getSummary;
    },

    getJMPListFetch: (state, action: PayloadAction<BaseType>) => {
      state.getJMPList.isLoading = true;
      state.getJMPList.error = null;
      state.getJMPList.data = [];
      state.getJMPList.options = { ...action.payload };
    },
    getJMPListSuccess: (state, action: PayloadAction<GetJMPListResponse>) => {
      state.getJMPList.isLoading = false;
      state.getJMPList.error = null;

      const { data, pagination } = action.payload as GetJMPListResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;

      if (data) {
        state.getJMPList.data = data?.map(
          (_record: JMPList, _index: number) => {
            const no = (page - 1) * limit + _index + 1;
            return { ..._record, no };
          },
        );
      }

      state.getJMPList.options = {
        ...state.getJMPList.options,
        page,
        limit,
        totalData,
        totalPage,
      };
    },
    getJMPListFailure: (state, action) => {
      state.getJMPList.isLoading = false;
      state.getJMPList.error = { ...action.payload };
      state.getJMPList.data = [];
    },
    getJMPListClear: (state) => {
      state.getJMPList = initialState.getJMPList;
    },

    getACJMPListFetch: (state, action: PayloadAction<BaseType>) => {
      state.getACJMPList.isLoading = true;
      state.getACJMPList.error = null;
      state.getACJMPList.data = [];
      state.getACJMPList.options = { ...action.payload };
    },
    getACJMPListSuccess: (state, action: PayloadAction<GetJMPListResponse>) => {
      state.getACJMPList.isLoading = false;
      state.getACJMPList.error = null;

      const { data, pagination } = action.payload as GetJMPListResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy = state?.getACJMPList?.options?.searchBy ?? DEFAULT_SEARCH;

      if (state?.getACJMPList?.options && state?.getACJMPList?.data) {
        const _uniqueData = uniqBy(data, searchBy);

        state.getACJMPList.data = _uniqueData
          ? _uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];

        state.getACJMPList.options = {
          ...state.getACJMPList.options,
          page,
          limit,
          totalData,
          totalPage,
        };
      }
    },
    getACJMPListFailure: (state, action) => {
      state.getACJMPList.isLoading = false;
      state.getACJMPList.error = { ...action.payload };
      state.getACJMPList.data = [];
    },
    getACJMPListClear: (state) => {
      state.getACJMPList = initialState.getACJMPList;
    },

    createJMPFetch: (state, action: PayloadAction<CreateJMPPayload>) => {
      state.createJMP.isLoading = true;
      state.createJMP.error = null;
      state.createJMP.payload = { ...action.payload };
    },
    createJMPSuccess: (state, action: PayloadAction<CreateJMPPayload>) => {
      state.createJMP.isLoading = false;
      state.createJMP.error = null;
      state.createJMP.data = { ...action?.payload };
    },
    createJMPFailure: (state, action) => {
      state.createJMP.isLoading = false;
      state.createJMP.error = { ...action.payload };
      state.createJMP.data = {};
    },
    createJMPClear: (state) => {
      state.createJMP = initialState.createJMP;
    },

    detailJMPFetch: (state, action: PayloadAction<DetailJMPPayload>) => {
      state.detailJMP.isLoading = true;
      state.detailJMP.error = null;
      state.detailJMP.payload = { ...action.payload };
    },
    detailJMPSuccess: (state, action: PayloadAction<GetDetailJMPResponse>) => {
      state.detailJMP.isLoading = false;
      state.detailJMP.error = null;

      if (action.payload.data) {
        state.detailJMP.data = action.payload.data;
      }
    },
    detailJMPFailure: (state, action) => {
      state.detailJMP.isLoading = false;
      state.detailJMP.error = { ...action.payload };
      state.detailJMP.data = {};
    },
    detailJMPClear: (state) => {
      state.detailJMP = initialState.detailJMP;
    },

    updateJMPFetch: (state, action: PayloadAction<UpdateJMPPayload>) => {
      state.updateJMP.isLoading = true;
      state.updateJMP.error = null;
      state.updateJMP.payload = { ...action.payload };
    },
    updateJMPSuccess: (state, action: PayloadAction<UpdateJMPPayload>) => {
      state.updateJMP.isLoading = false;
      state.updateJMP.error = null;
      state.updateJMP.data = { ...action?.payload };
    },
    updateJMPFailure: (state, action) => {
      state.updateJMP.isLoading = false;
      state.updateJMP.error = { ...action.payload };
      state.updateJMP.data = {};
    },
    updateJMPClear: (state) => {
      state.updateJMP = initialState.updateJMP;
    },
  },
});

export const jmpActions = jmpState.actions;
export const jmpReducer = jmpState.reducer;
export default jmpReducer;
