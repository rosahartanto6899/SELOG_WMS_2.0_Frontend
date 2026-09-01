import { CustomerRouteState } from "@sera-types/customer-route.type";

const initialState: CustomerRouteState = {
  isLoading: false,
  error: null,
  data: {},
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
  createCustomerRoute: {
    isLoading: false,
    error: null,
    data: {},
  },
  detailCustomerRoute: {
    isLoading: false,
    error: null,
    data: {},
  },
  updateCustomerRoute: {
    isLoading: false,
    error: null,
    data: {},
  },
  deleteCustomerRoute: {
    isLoading: false,
    error: null,
    data: {},
  },
  dropdownTollUsages: {
    isLoading: false,
    error: null,
    data: [],
  },
  dropdownCustomerRoutes: {
    data: [],
    options: {
      limit: 10,
      page: 1,
    },
  },
  dropdownRouteActivityTypes: {
    data: [],
    options: {},
  },
  dropdownLeadTimeTypes: {
    data: [],
    options: {},
  },
  uploadQuotation: {
    isLoading: false,
    error: null,
    data: {},
  },
  downloadQuotation: {
    isLoading: false,
    error: null,
    data: {},
  },
};

export default initialState;
