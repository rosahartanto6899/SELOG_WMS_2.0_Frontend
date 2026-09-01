import { UserLogState } from "@sera-types/user-logs.type";

const initialState: UserLogState = {
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
  dropdownUserLogs: {
    data: [],
  },
  userLogDetail: {
    data: {},
  },
  exportUserLogs: {
    options: {
      search: null,
      searchBy: null,
    },
  },
};

export default initialState;
