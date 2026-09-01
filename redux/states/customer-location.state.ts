import { CustomerLocationState } from "@sera-types/customer-location.type";

const initialState: CustomerLocationState = {
  data: [],
  isLoading: false,
  saveState: false,
  error: null,
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
    data: [],
  },
  dropdownCustomerLocations: {
    data: [],
    payload: {},
  },
  createNewCustomerLocation: {
    data: [],
  },
  customerLocationDetail: {
    isLoading: false,
    data: {},
    error: null,
  },
  updaCustomerLocation: {
    data: [],
  },
  postCreateNewCustomerLocation: {
    name: "",
    coordinate: "",
    provinceId: "",
    cityId: "",
    districtId: "",
    area: "",
    address: "",
    customerId: "",
    operationDays: [],
  },
  postUpdateCustomerLocation: {
    id: "",
    name: "",
    coordinate: "",
    provinceId: "",
    cityId: "",
    districtId: "",
    area: "",
    address: "",
    customerId: "",
    operationDays: [],
  },
  postDeleteCustomerLocation: { id: "", name: "" },
};

export default initialState;
