import { ProvinceState } from "@sera-types/provinces.type";

const initialState: ProvinceState = {
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
  dropdownProvinces: {
    data: [],
  },
};

export default initialState;
