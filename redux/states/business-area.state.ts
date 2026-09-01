import { BusinessAreaState } from "@sera-types/business-area.type";

const initialState: BusinessAreaState = {
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
  businessAreaDetail: { data: {} },
  createNewBusinessArea: {},
  updateBusinessArea: {},
  deleteBusinessArea: {},
  dropdownBusinessAreas: { data: [], options: {} },
};

export default initialState;
