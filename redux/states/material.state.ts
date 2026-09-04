import { MaterialState } from "@sera-types/material.type";

const initialState: MaterialState = {
  isLoading: false,
  error: null,
  data: [],
  options: { page: 1, limit: 10 },
  materialDetail: { data: null },
  dropdownMaterials: { data: [] },
};

export default initialState;
