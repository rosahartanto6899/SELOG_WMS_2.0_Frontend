import { StockManagementState } from "@sera-types/stock-management.type";

const initialState: StockManagementState = {
  isLoading: false,
  error: null,
  data: [],
  options: {
    page: 1,
    limit: 10,
    totalData: 0,
    totalPage: 0,
    order: null,
    sort: null,
    searchBy: null,
    search: null,
  },
  autoComplete: {
    isLoading: false,
    error: null,
    data: [],
    options: {
      page: 1,
      limit: 10,
      totalData: 0,
      totalPage: 0,
      order: null,
      sort: null,
      searchBy: null,
      search: null,
    },
  },
  getSummary: {
    isLoading: false,
    error: null,
    data: {},
  },
  createVehicle: {
    isLoading: false,
    error: null,
    data: {},
  },
  detailVehicle: {
    isLoading: false,
    error: null,
    data: {},
  },
  updateVehicle: {
    isLoading: false,
    error: null,
    data: {},
  },
  upsertVehicle: {
    isLoading: false,
    error: null,
    data: {},
  },
  downloadTemplate: {
    isLoading: false,
    error: null,
    data: null,
  },
  stockStatus: {
    isLoading: false,
    error: null,
    data: [],
  },
};

export default initialState;
