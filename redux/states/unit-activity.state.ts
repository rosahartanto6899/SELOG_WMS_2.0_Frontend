import { UnitActivityState } from "@sera-types/unit-activity";

const initialState: UnitActivityState = {
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
  unitDetail: {
    isLoading: false,
    error: null,
    data: {},
  },
  pmCheckDetail: {
    isLoading: false,
    error: null,
    data: {},
  },
  getSummary: {
    isLoading: false,
    error: null,
    data: {},
  },
  createMaintenance: {
    isLoading: false,
    error: null,
    data: {},
  },
  updateMaintenance: {
    isLoading: false,
    error: null,
    data: {},
  },
  lastLocation: {
    isLoading: false,
    error: null,
    data: {},
  },
  updatePMCheck: {
    isLoading: false,
    error: null,
    data: {},
  },
  maintenanceStatus: {
    isLoading: false,
    error: null,
    data: [],
  },
  maintenanceType: {
    isLoading: false,
    error: null,
    data: [],
  },
  maintenanceLevel: {
    isLoading: false,
    error: null,
    data: [],
  },
  locationCount: {
    isLoading: false,
    error: null,
    data: {},
  },
};

export default initialState;
