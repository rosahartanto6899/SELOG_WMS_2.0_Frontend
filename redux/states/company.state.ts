import { CompanyState } from "@sera-types/company.type";

const initialState: CompanyState = {
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
  companyDetail: { data: {} },
  createNewCompany: {},
  updateCompany: {},
  deleteCompany: {},
  dropdownCompanies: { data: [], options: {} },
};

export default initialState;
