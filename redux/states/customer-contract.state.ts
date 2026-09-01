import { CustomerContractState } from "@sera-types/customer-contract.type";

const initialState: CustomerContractState = {
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
  detailContract: {
    isLoading: false,
    error: null,
    data: {},
  },
  updateCustomerContract: {},
  dropdownCustomerContracts: { data: [], options: {} },
  dropdownRouteActivityTypes: {
    data: [],
    options: {},
  },
  dropdownLeadTimeTypes: {
    data: [],
    options: {},
  },
};

export default initialState;
