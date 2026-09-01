import { UnitDriverCapacityState } from "@sera-types/unit-driver-capacity.type";

const initialState: UnitDriverCapacityState = {
  unitCapacity: {
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
    },
    summary: {
      isLoading: false,
      error: null,
      data: {
        areas: [],
        rows: [],
        totals: {},
      },
    },
    detail: {
      isLoading: false,
      error: null,
      data: {},
    },
    forecast: {
      isLoading: false,
      error: null,
      data: {
        dateFrom: "",
        dateTo: "",
        days: [],
      },
    },
    capacityStatuses: {
      isLoading: false,
      error: null,
      data: [],
    },
  },
  driverCapacity: {
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
    },
    summary: {
      isLoading: false,
      error: null,
      data: {
        areas: [],
        rows: [],
        totals: {},
      },
    },
    detail: {
      isLoading: false,
      error: null,
      data: {},
    },
    forecast: {
      isLoading: false,
      error: null,
      data: {
        dateFrom: "",
        dateTo: "",
        days: [],
      },
    },
    capacityStatuses: {
      isLoading: false,
      error: null,
      data: [],
    },
    employeeStatuses: {
      isLoading: false,
      error: null,
      data: [],
    },
  },
};

export default initialState;
