import { CustomerState } from "@sera-types/customer.type";

const initialState: CustomerState = {
  data: [],
  isLoading: false,
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
  customerDetail: { data: {} },
  createCustomer: { data: [] },
  updateCustomer: { data: [] },
  postCreateCustomer: { code: "", name: "" },
  postUpdateCustomer: { id: "", name: "" },
  postDeleteCustomer: { id: "", name: "" },
};

export default initialState;
