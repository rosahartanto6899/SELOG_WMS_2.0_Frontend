import { RoleState } from "@sera-types/role.type";

const initialState: RoleState = {
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
  dropdownRoles: {
    data: [],
  },
  createNewRole: {
    data: [],
  },
  roleDetail: {
    data: {},
  },
  updateRole: {
    data: [],
  },
  postCreateNewRole: { roleName: "" },
  postUpdateRole: { id: "", roleName: "" },
  postDeleteRole: { id: "", roleName: "" },
};

export default initialState;
