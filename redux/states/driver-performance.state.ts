import { IDriverPerformanceState } from "@sera-types/driver-performance.type";

const initialState: IDriverPerformanceState = {
  getSummary: {
    isLoading: false,
    error: null,
    data: {
      totalDrivers: 0,
      performanceSummary: {
        A: 0,
        B: 0,
        C: 0,
      },
    },
    payload: {
      "branchId[]": [],
      "shipmentType[]": [],
    },
  },
  options: {
    page: 1,
    limit: 10,
  },
  data: [],
  getFilterOption: {
    data: [],
  },
};

export default initialState;
