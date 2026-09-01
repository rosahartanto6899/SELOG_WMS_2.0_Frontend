import { CustomerState } from "@sera-types/customer.type";

const initialState: CustomerState = {
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
  detailCustomer: {
    isLoading: false,
    error: null,
    data: {},
  },
  updateCustomer: {
    isLoading: false,
    error: null,
    data: {},
  },
  createSales: {
    isLoading: false,
    error: null,
    data: {},
  },
  deleteSales: {
    isLoading: false,
    error: null,
    data: {},
  },
  customerSales: {
    isLoading: false,
    error: null,
    data: [],
  },
  customerContacts: {
    isLoading: false,
    error: null,
    data: [],
  },
  dropdownCustomers: { data: [], options: {} },
  dropdownSales: {
    isLoading: false,
    error: null,
    data: [],
  },
  dropdownAddReq: {
    isLoading: false,
    error: null,
    data: [],
  },
  dropdownPOD: {
    isLoading: false,
    error: null,
    data: [],
  },
  dropdownCustomerIndustries: {
    data: [],
    options: {},
  },
  dropdownCustomerCategories: {
    data: [],
    options: {},
  },
  dropdownCustomerStatuses: {
    data: [],
    options: {},
  },
};

export default initialState;
