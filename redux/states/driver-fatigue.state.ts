import { IDriverFatigueState } from "@sera-types/driver-fatigue.type";

const initialState: IDriverFatigueState = {
  getSummary: {
    isLoading: false,
    error: null,
    data: {
      totalDrivers: 0,
      fatigueSummary: {
        low: 0,
        medium: 0,
        high: 0,
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
  getDetails: {
    data: null,
  },
};

export default initialState;
