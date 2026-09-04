import {
  MaterialLocationMappingState,
  UploadMaterialLocationMappingState,
} from "@sera-types/material-location-mapping.type";

export const initialUploadState: UploadMaterialLocationMappingState = {
  isLoading: false,
  error: null,
  activeUpsert: -1,
  summary: null,
  lastResult: null,
};

export const initialMappingState: MaterialLocationMappingState = {
  isLoading: false,
  error: null,
  data: [],
  options: { page: 1, limit: 10 },
};

const initialState = {
  ...initialUploadState,
  ...initialMappingState,
};

export default initialState;
