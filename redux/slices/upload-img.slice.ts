import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "@sera-redux/states/upload-img.state";

export const uploadImgState = createSlice({
  name: "upload-img",
  initialState,
  reducers: {
    uploadImageFetch: (state, action) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.error = null;
      state.data = action.payload;
    },
    uploadImageSuccess: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    },
    uploadImageFailure: (state, action) => {
      state.isLoading = false;
      state.error = { ...action.payload };
    },
    uploadImageClear: (state) => {
      state.data = null;
    },
    getImageFetch: (state) => {
      state.getImage.isLoading = true;
    },
    getImageSuccess: (state, action: PayloadAction<any>) => {
      state.getImage.isLoading = false;
      state.getImage.isSuccess = true;
      state.getImage.data = action.payload;
    },
    getImageFailure: (state, action) => {
      state.getImage.isLoading = false;
      state.getImage.error = { ...action.payload };
    },
    getImageClear: (state) => {
      state.data = null;
    },
  },
});

export const {
  uploadImageFetch,
  uploadImageSuccess,
  uploadImageFailure,
  uploadImageClear,
  getImageFetch,
  getImageSuccess,
  getImageFailure,
  getImageClear,
} = uploadImgState.actions;

export const uploadImgActions = uploadImgState.actions;
export const uploadImgReducers = uploadImgState.reducer;
export default uploadImgReducers;
