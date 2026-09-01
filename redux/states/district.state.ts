import { DistrictState } from "@sera-types/districts.type";

const initialState: DistrictState = {
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
  dropdownDistricts: {
    data: [],
  },
};

export default initialState;
