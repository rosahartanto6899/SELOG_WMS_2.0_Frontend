import { MenuState } from "@sera-types/menu.type";

const initialState: MenuState = {
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
  dropdownParentMenus: { data: [] },
  dropdownMenus: { data: [] },
  menuDetail: { data: {} },
  createNewMenu: { menuName: "" },
  updateMenu: { id: "", menuName: "" },
  deleteMenu: { id: "", menuName: "", options: { page: 0, limit: 0 } },
};

export default initialState;
