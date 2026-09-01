import { AreaState } from "@sera-types/area.type";

const initialState: AreaState = {
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
  dropdownAreas: {
    data: [],
  },
};

export default initialState;
