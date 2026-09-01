import { RoleMenuState } from "@sera-types/role-menu.type";

const initialState: RoleMenuState = {
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
  dropdownRoleMenus: {
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
  createNewRoleMenu: {
    data: [],
  },
  roleMenuDetail: {
    data: {},
  },
  updateRoleMenu: {
    data: [],
  },
  allRoleMenus: {
    data: [],
  },
  roleId: null,
  fleetGroupId: null,
  postCreateNewRoleMenus: {
    success: false,
    message: "",
  },
  postUpdateRoleMenus: {
    success: false,
    message: "",
  },
  postDeleteRoleMenus: {
    success: false,
    message: "",
    menuName: "",
  },
};

export default initialState;
