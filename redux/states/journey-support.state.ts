import { JourneySupportState } from "@sera-types/journey-support.type";

const initialState: JourneySupportState = {
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
  detail: {
    data: {},
    isLoading: false,
    error: null,
  },
  summary: {
    data: { total: 0, loading: 0, onJourney: 0, unloading: 0 },
    isLoading: false,
    error: null,
  },
  updateActivity: {
    data: {},
    isLoading: false,
    error: null,
  },
  updateActivitySkyward: {
    data: {},
    isLoading: false,
    error: null,
  },
};

export default initialState;
