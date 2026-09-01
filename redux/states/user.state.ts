import { UserState } from "@sera-types/user.type";

const initialState: UserState = {
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
  userDetail: { data: {} },
  createNewUser: {},
  updateUser: {},
  deleteUser: {},
  userGrade: {
    isLoading: false,
    isSuccess: false,
    error: null,
    data: [],
  },
  updateActiveVendor: {
    success: false,
    error: null,
    data: {
      reactivatedAt: "",
      id: "",
      status: "",
    },
  },
};

export default initialState;
