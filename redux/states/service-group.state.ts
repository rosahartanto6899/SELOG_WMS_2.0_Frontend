import { ServiceGroupState } from "@sera-types/service-group.type";

const initialState: ServiceGroupState = {
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
  dropdown: {
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
  createServiceGroup: {
    isLoading: false,
    error: null,
    data: {},
  },
  detailServiceGroup: {
    isLoading: false,
    error: null,
    data: {},
  },
  updateServiceGroup: {
    isLoading: false,
    error: null,
    data: {},
  },
  deleteServiceGroup: {
    isLoading: false,
    error: null,
    data: {},
  },
};

export default initialState;
