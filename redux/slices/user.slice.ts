/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "@sera-redux/states/user.state";
import { BaseType, PaginationType } from "@sera-types/base.type";
import {
  CreateNewUserPayload,
  DeleteUserPayload,
  GetUserGradeResponse,
  GetUsersResponse,
  UpdateActiveVendorPayload,
  UpdateActiveVendorResponse,
  UpdateUserPayload,
  User,
  UserGrade,
} from "@sera-types/user.type";
import _ from "lodash";

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Get User
    getUsersFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getUsersSuccess: (state, action: PayloadAction<GetUsersResponse>) => {
      const { data, pagination } = action.payload as GetUsersResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      state.options = { ...state.options, page, limit, totalData, totalPage };
      if (data) {
        state.data = data.map((u: User, index: number) => {
          const no = (page - 1) * limit + index + 1;
          return { ...u, no };
        });
      }
      state.isLoading = false;
    },
    getUsersFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getUsersClear: (state) => {
      state.data = [];
      state.options = initialState.options;
    },

    // Get User Auto Complete
    getUsersAutoCompleteFetch: (state, action: PayloadAction<BaseType>) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };

      if (state?.autoComplete) {
        state.autoComplete.options.searchBy = action.payload.searchBy;
      }
    },
    getUsersAutoCompleteSuccess: (
      state,
      action: PayloadAction<GetUsersResponse>,
    ) => {
      const { data, pagination } = action.payload as GetUsersResponse;
      const { page, limit, totalData, totalPage } =
        pagination as PaginationType;
      const searchBy =
        (state.autoComplete && state.autoComplete.options.searchBy) || "name";

      if (state?.autoComplete?.options && state?.autoComplete?.data) {
        state.autoComplete.options = {
          ...state.autoComplete.options,
          page,
          limit,
          totalData,
          totalPage,
        };

        const uniqueData = _.uniqBy(data, searchBy);

        state.autoComplete.data = uniqueData
          ? uniqueData.map((item: any) => ({
              label: item[searchBy],
              value: item[searchBy],
            }))
          : [];
      }
      state.isLoading = false;
    },
    getUsersAutoCompleteFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getUsersAutoCompleteClear: (state) => {
      state.autoComplete = initialState.autoComplete;
    },

    // Get User Detail
    getUserDetailFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    getUserDetailSuccess: (state, action: PayloadAction<GetUsersResponse>) => {
      const { data } = action.payload as GetUsersResponse;
      state.isLoading = false;
      state.userDetail.data = { ...state.userDetail.data, ...data };
    },
    getUserDetailFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    getUserDetailClear: (state) => {
      state.userDetail = initialState.userDetail;
    },

    // Create New User
    createNewUserFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    createNewUserSuccess: (
      state,
      action: PayloadAction<CreateNewUserPayload>,
    ) => {
      state.isLoading = false;
      state.createNewUser = action.payload;
    },
    createNewUserFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    createNewUserClear: (state) => {
      state.createNewUser = initialState.createNewUser;
    },

    // Update User
    updateUserFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    updateUserSuccess: (state, action: PayloadAction<UpdateUserPayload>) => {
      state.isLoading = false;
      state.updateUser = action.payload;
    },
    updateUserFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    updateUserClear: (state) => {
      state.updateUser = initialState.updateUser;
    },

    // Delete User
    deleteUserFetch: (state, action) => {
      state.error = null;
      state.isLoading = true;
      state.options = { ...action.payload };
    },
    deleteUserSuccess: (state, action: PayloadAction<DeleteUserPayload>) => {
      state.isLoading = false;
      state.deleteUser = action.payload;
    },
    deleteUserFailure: (state, action) => {
      state.error = { ...action.payload };
      state.isLoading = false;
    },
    deleteUserClear: (state) => {
      state.deleteUser = initialState.deleteUser;
    },

    // User Grade
    getUserGradeFetch: (state) => {
      state.userGrade.isLoading = true;
      state.userGrade.isSuccess = false;
      state.userGrade.error = null;
      state.userGrade.data = [];
    },
    getUserGradeSuccess: (
      state,
      action: PayloadAction<GetUserGradeResponse>,
    ) => {
      state.userGrade.isLoading = false;
      state.userGrade.isSuccess = true;
      const { data } = action.payload;
      state.userGrade.data = data as UserGrade[];
      state.userGrade.error = null;
    },
    getUserGradeFailure: (state, action) => {
      state.userGrade.isLoading = false;
      state.userGrade.isSuccess = false;
      state.userGrade.data = [];
      state.userGrade.error = { ...action.payload };
    },
    getUserGradeReset: (state) => {
      state.userGrade = initialState.userGrade;
    },

    // UPDATE ACTIVE VENDOR
    updateActiveVendorFetch: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _action: PayloadAction<UpdateActiveVendorPayload>,
    ) => {
      state.updateActiveVendor = initialState.updateActiveVendor;
      state.isLoading = true;
      state.error = null;
    },
    updateActiveVendorSuccess: (
      state,
      action: PayloadAction<UpdateActiveVendorResponse>,
    ) => {
      state.updateActiveVendor = action.payload;
      state.isLoading = false;
    },
    updateActiveVendorFailure: (state, action) => {
      state.isLoading = false;
      state.updateActiveVendor = {
        error: true,
        success: false,
        data: initialState.updateActiveVendor.data,
      };
      state.error = { ...action.payload };
    },
    updateActiveVendorClear: (state) => {
      state.updateActiveVendor = initialState.updateActiveVendor;
    },
  },
});

export const {
  getUsersFetch,
  getUsersSuccess,
  getUsersFailure,
  getUsersClear,
  getUsersAutoCompleteFetch,
  getUsersAutoCompleteSuccess,
  getUsersAutoCompleteFailure,
  getUsersAutoCompleteClear,
  createNewUserFetch,
  createNewUserSuccess,
  createNewUserFailure,
  createNewUserClear,
  updateUserFetch,
  updateUserSuccess,
  updateUserFailure,
  updateUserClear,
  updateActiveVendorClear,
  updateActiveVendorFailure,
  updateActiveVendorFetch,
  updateActiveVendorSuccess,
} = userSlice.actions;

export const userActions = userSlice.actions;
export const userReducers = userSlice.reducer;
export default userReducers;
